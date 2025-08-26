import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  analyzePostChakra, 
  generateDailyReading, 
  generateTarotReading,
  generateUserSigil,
  generateSigilImage,
  generateSpiritImage,
  generateOracleRecommendations,
  generateSpirit
} from "./openai";
import { 
  insertPostSchema, 
  insertCommentSchema, 
  insertEngagementSchema,
  insertReportSchema,
  type EngagementType 
} from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError, parseObjectPath, objectStorageClient } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import { randomUUID } from "crypto";
import multer from 'multer';

// Multer setup for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});
import { registerScrapybaraRoutes } from "./scrapybara-routes";
import { registerVisionsRoutes } from "./visionsApi";
import { registerCommunitiesRoutes } from "./communitiesApi";
import { registerZeroTrustRoutes } from "./zeroTrustApi";
import { turnstileService } from "./turnstileService";
import Stripe from "stripe";
import { emailService } from "./emailService";

// Stripe setup
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not found, subscription features will be disabled');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate sigil if user doesn't have one OR if sigil image is broken (temporary URL)
      if (!user.sigil || (user.sigilImageUrl && user.sigilImageUrl.includes('oaidalleapiprodscus.blob.core.windows.net'))) {
        console.log(`Regenerating sigil for user ${userId} - broken image detected`);
        const sigil = await generateUserSigil(user.username || user.email || userId);
        const sigilImageUrl = await generateSigilImage({ beliefs: 'spiritual growth', astrologySign: user.astrologySign || 'universal' });
        await storage.updateUserSigil(userId, sigil, sigilImageUrl);
        user.sigil = sigil;
        user.sigilImageUrl = sigilImageUrl;
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Object storage routes for profile images
  app.get('/objects/:objectPath(*)', async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error('Error checking object access:', error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post('/api/objects/upload', isAuthenticated, async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  // Profile image file upload endpoint
  app.post('/api/upload-profile-image', isAuthenticated, upload.single('image'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // For now, use a simpler approach - convert to base64 data URL
      // This avoids the Google Cloud Storage authentication issues
      const base64Data = file.buffer.toString('base64');
      const dataUrl = `data:${file.mimetype};base64,${base64Data}`;
      
      // Update user's profile image with the data URL
      const user = await storage.updateUser(userId, {
        profileImageUrl: dataUrl
      });
      
      return res.status(200).json({ user, imageUrl: dataUrl });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      res.status(500).json({ error: 'Failed to upload image. Please try using a direct image URL instead.' });
    }
  });

  // Simple profile image update - accepts any URL
  app.put('/api/profile-image', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { imageUrl } = req.body;
      
      // Allow null to remove profile picture
      if (imageUrl !== null && (!imageUrl || typeof imageUrl !== 'string')) {
        return res.status(400).json({ error: 'Valid imageUrl is required (or null to remove)' });
      }

      // Update user's profile image URL in database
      const user = await storage.updateUser(userId, {
        profileImageUrl: imageUrl
      });

      res.status(200).json({ user });
    } catch (error) {
      console.error('Error setting profile image:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Post routes
  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postData = insertPostSchema.parse(req.body);
      
      // Create post
      const post = await storage.createPost(postData, userId);
      
      // Analyze content and images for chakra categorization
      const chakraAnalysis = await analyzePostChakra(postData.content, postData.imageUrls || undefined);
      await storage.updatePostChakra(post.id, chakraAnalysis.chakra);
      
      // Fetch complete post with author
      const postWithAuthor = await storage.getPost(post.id);
      
      res.json(postWithAuthor);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.get('/api/posts', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const posts = await storage.getPosts(limit, offset);
      
      // Get engagement counts and spiritual counts for each post
      const postIds = posts.map(p => p.id);
      const spiritualCounts = await storage.getSpiritualCountForPosts(postIds);
      
      const postsWithEngagements = await Promise.all(
        posts.map(async (post) => {
          const engagements = await storage.getPostEngagements(post.id);
          return { 
            ...post, 
            engagements,
            spiritualCount: spiritualCounts[post.id] || 0
          };
        })
      );
      
      res.json(postsWithEngagements);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get('/api/posts/:id', async (req, res) => {
    try {
      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const engagements = await storage.getPostEngagements(post.id);
      res.json({ ...post, engagements });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // Engagement routes
  app.post('/api/posts/:postId/engage', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { postId } = req.params;
      const { type, energyAmount } = req.body;
      
      if (!['upvote', 'downvote', 'like', 'energy'].includes(type)) {
        return res.status(400).json({ message: "Invalid engagement type" });
      }

      const engagement = await storage.createEngagement(
        { postId, type: type as EngagementType },
        userId,
        type === 'energy' ? energyAmount : undefined
      );

      // Update spirit experience based on engagement type and energy amount
      let expGain = 0;
      switch (type) {
        case 'like':
          expGain = 5;
          break;
        case 'upvote':
          expGain = 10;
          break;
        case 'energy':
          // XP scales with energy amount (0.5 XP per energy point, minimum 10)
          expGain = Math.max(10, Math.floor((energyAmount || 10) * 0.5));
          break;
        case 'downvote':
          expGain = 2; // Small XP even for downvotes (participation)
          break;
      }

      if (expGain > 0) {
        await storage.updateSpiritExperience(userId, expGain, `${type}_engagement`);
      }
      
      res.json(engagement);
    } catch (error: any) {
      console.error("Error creating engagement:", error);
      res.status(500).json({ message: error.message || "Failed to create engagement" });
    }
  });

  app.delete('/api/posts/:postId/engage/:type', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { postId, type } = req.params;
      
      await storage.removeEngagement(postId, userId, type as EngagementType);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error removing engagement:", error);
      res.status(500).json({ message: "Failed to remove engagement" });
    }
  });

  // Update post spiritual status
  app.patch('/api/posts/:postId', isAuthenticated, async (req: any, res) => {
    try {
      const { postId } = req.params;
      const { isSpiritual } = req.body;
      const userId = req.user.claims.sub;
      
      await storage.updatePostSpiritual(postId, userId, isSpiritual);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error updating post spiritual status:", error);
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  // Bookmark routes
  app.post('/api/posts/:postId/bookmark', isAuthenticated, async (req: any, res) => {
    try {
      const { postId } = req.params;
      const { bookmarked } = req.body;
      const userId = req.user.claims.sub;
      
      if (bookmarked) {
        await storage.addBookmark(userId, postId);
      } else {
        await storage.removeBookmark(userId, postId);
      }
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error updating bookmark:", error);
      res.status(500).json({ message: "Failed to update bookmark" });
    }
  });

  app.get('/api/bookmarks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookmarks = await storage.getUserBookmarks(userId);
      res.json(bookmarks);
    } catch (error: any) {
      console.error("Error fetching bookmarks:", error);
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  app.get('/api/posts/:postId/engage/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { postId } = req.params;
      
      const engagements = await storage.getUserEngagement(postId, userId);
      const userEngagementTypes = engagements.map(engagement => engagement.type);
      
      res.json({ engagements: userEngagementTypes });
    } catch (error) {
      console.error("Error fetching user engagements:", error);
      res.status(500).json({ message: "Failed to fetch user engagements" });
    }
  });

  // Comment routes
  app.post('/api/posts/:postId/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { postId } = req.params;
      const commentData = insertCommentSchema.parse({ ...req.body, postId });
      
      const comment = await storage.createComment(commentData, userId);
      
      // Award spirit experience for commenting (community engagement)
      await storage.updateSpiritExperience(userId, 8, 'comment_creation');
      
      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.get('/api/posts/:postId/comments', async (req, res) => {
    try {
      const { postId } = req.params;
      const comments = await storage.getPostComments(postId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Spirit routes
  app.get('/api/spirit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const spirit = await storage.getUserSpirit(userId);
      
      // Check if spirit has broken image (temporary DALL-E URL) and regenerate
      if (spirit && spirit.imageUrl && spirit.imageUrl.includes('oaidalleapiprodscus.blob.core.windows.net')) {
        console.log(`Regenerating broken spirit image for user ${userId}`);
        const newImageUrl = await generateSpiritImage({
          name: spirit.name,
          description: spirit.description,
          element: spirit.element,
          level: spirit.level
        });
        
        // Update the spirit with the new image
        await storage.updateSpiritImage(userId, newImageUrl);
        spirit.imageUrl = newImageUrl;
      }
      
      res.json(spirit);
    } catch (error) {
      console.error("Error fetching spirit:", error);
      res.status(500).json({ message: "Failed to fetch spirit" });
    }
  });

  // Spiritual reading routes
  app.get('/api/readings/daily', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check if user already has a daily reading
      let reading = await storage.getUserDailyReading(userId);
      
      if (!reading) {
        // Generate new daily reading
        const aiReading = await generateDailyReading();
        reading = await storage.createReading({
          type: "daily",
          content: aiReading.content,
          metadata: {
            title: aiReading.title,
            card: aiReading.card,
            symbols: aiReading.symbols,
            guidance: aiReading.guidance
          }
        }, userId);
      }
      
      res.json(reading);
    } catch (error) {
      console.error("Error fetching daily reading:", error);
      res.status(500).json({ message: "Failed to fetch daily reading" });
    }
  });

  // Force refresh daily reading
  app.post('/api/readings/daily', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Force generate new daily reading
      const aiReading = await generateDailyReading();
      const reading = await storage.createReading({
        type: "daily",
        content: aiReading.content,
        metadata: {
          title: aiReading.title,
          card: aiReading.card,
          symbols: aiReading.symbols,
          guidance: aiReading.guidance
        }
      }, userId);
      
      res.json(reading);
    } catch (error) {
      console.error("Error generating new daily reading:", error);
      res.status(500).json({ message: "Failed to generate new daily reading" });
    }
  });

  app.post('/api/readings/tarot', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { question } = req.body;
      
      // Check if user is premium
      const user = await storage.getUser(userId);
      if (!user?.isPremium) {
        return res.status(403).json({ message: "Premium subscription required" });
      }
      
      const tarotReading = await generateTarotReading(question || "What guidance do I need today?");
      
      const reading = await storage.createReading({
        type: "tarot",
        content: tarotReading.interpretation,
        metadata: {
          question,
          cards: tarotReading.cards,
          guidance: tarotReading.guidance
        }
      }, userId);
      
      res.json(reading);
    } catch (error) {
      console.error("Error generating tarot reading:", error);
      res.status(500).json({ message: "Failed to generate tarot reading" });
    }
  });

  // Oracle recommendations
  app.get('/api/oracle/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get user's recent posts for context
      const userPosts = await storage.getUserPosts(userId, 5);
      const userHistory = userPosts.map(post => post.content);
      
      const recommendations = await generateOracleRecommendations(userHistory, user.aura || 0);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  // Force refresh oracle recommendations
  app.post('/api/oracle/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get user's recent posts for context
      const userPosts = await storage.getUserPosts(userId, 5);
      const userHistory = userPosts.map(post => post.content);
      
      // Force generate fresh recommendations
      const recommendations = await generateOracleRecommendations(userHistory, user.aura || 0);
      res.json(recommendations);
    } catch (error) {
      console.error("Error refreshing recommendations:", error);
      res.status(500).json({ message: "Failed to refresh recommendations" });
    }
  });

  // Get community oracle content - delivers random user content as mystical guidance
  app.get('/api/oracle/community', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get random posts from the community, excluding the current user's posts
      const randomPosts = await storage.getRandomPosts(5, userId);
      
      // Transform posts into oracle-style guidance
      const oracleContent = randomPosts.map(post => ({
        id: post.id,
        type: 'community_wisdom',
        title: `Wisdom from ${post.author.username || post.author.email || 'a fellow seeker'}`,
        content: post.content,
        guidance: `The universe has guided you to this message from a spiritual companion on their journey.`,
        chakra: post.chakra,
        author: {
          id: post.author.id,
          username: post.author.username,
          email: post.author.email,
          sigil: post.author.sigil
        },
        createdAt: post.createdAt
      }));
      
      res.json(oracleContent);
    } catch (error) {
      console.error("Error fetching community oracle:", error);
      res.status(500).json({ message: "Failed to fetch community oracle" });
    }
  });

  // Refresh community oracle content - generates fresh random posts for mystical guidance
  app.post('/api/oracle/community', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get fresh random posts from the community, excluding the current user's posts
      const randomPosts = await storage.getRandomPosts(5, userId);
      
      // Transform posts into oracle-style guidance
      const oracleContent = randomPosts.map(post => ({
        id: post.id,
        type: 'community_wisdom',
        title: `Wisdom from ${post.author.username || post.author.email || 'a fellow seeker'}`,
        content: post.content,
        guidance: `The universe has guided you to this message from a spiritual companion on their journey.`,
        chakra: post.chakra,
        author: {
          id: post.author.id,
          username: post.author.username,
          email: post.author.email,
          sigil: post.author.sigil
        },
        createdAt: post.createdAt
      }));
      
      res.json(oracleContent);
    } catch (error) {
      console.error("Error refreshing community oracle:", error);
      res.status(500).json({ message: "Failed to refresh community oracle" });
    }
  });

  // Generate personalized oracle reading based on user's recent activity
  app.post('/api/oracle/personalized', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { question } = req.body;
      
      // Get user's recent posts and activity
      const userPosts = await storage.getUserPosts(userId, 5);
      const userStats = await storage.getUserStats(userId);
      
      // Generate personalized oracle reading using AI with user context
      const contextPrompt = `
        User Context:
        - Recent posts: ${userPosts.map(p => p.content).join('; ')}
        - Total posts: ${userStats.totalPosts}
        - Total engagements: ${userStats.totalEngagements}
        - Question asked: ${question || 'General guidance'}
        
        Generate a personalized oracle reading that incorporates the user's actual spiritual journey and activity.
      `;
      
      const aiReading = await generateDailyReading(); // We'll enhance this function later
      
      const reading = await storage.createReading({
        type: "personalized",
        content: `${aiReading.content}\n\nThis guidance reflects your recent spiritual journey and the wisdom you've shared with the community.`,
        metadata: {
          title: aiReading.title,
          guidance: aiReading.guidance,
          question: question,
          basedOnActivity: true
        }
      }, userId);
      
      res.json(reading);
    } catch (error) {
      console.error("Error generating personalized oracle:", error);
      res.status(500).json({ message: "Failed to generate personalized oracle" });
    }
  });

  // Search routes
  app.get('/api/search', async (req, res) => {
    try {
      const query = req.query.query as string;
      const type = req.query.type as string || 'all';
      
      if (!query || query.length < 2) {
        return res.status(400).json({ message: "Query must be at least 2 characters" });
      }
      
      const results: any[] = [];
      
      // Search posts if type is 'all' or 'posts'
      if (type === 'all' || type === 'posts') {
        const posts = await storage.searchPosts(query, 10);
        const postResults = posts.map(post => ({
          type: 'post',
          id: post.id,
          title: `${post.author.username || post.author.email || 'Anonymous'}`,
          content: post.content,
          author: post.author,
          chakra: post.chakra,
          createdAt: post.createdAt
        }));
        results.push(...postResults);
      }
      
      // Search users if type is 'all' or 'users' 
      if (type === 'all' || type === 'users') {
        const users = await storage.searchUsers(query, 10);
        const userResults = await Promise.all(users.map(async user => {
          const stats = await storage.getUserStats(user.id);
          return {
            type: 'user',
            id: user.id,
            title: user.username || user.email || 'Spiritual Seeker',
            content: `Spiritual seeker with ${stats.totalPosts || 0} posts shared`,
            author: user,
            auraLevel: stats.auraLevel,
            createdAt: user.createdAt
          };
        }));
        results.push(...userResults);
      }
      
      res.json(results);
    } catch (error) {
      console.error("Error searching:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Notification routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const notifications = await storage.getUserNotifications(userId, limit);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get('/api/notifications/unread-count', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const count = await storage.getUnreadNotificationCount(userId);
      res.json(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ message: "Failed to fetch unread count" });
    }
  });

  app.post('/api/notifications/:notificationId/read', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { notificationId } = req.params;
      
      await storage.markNotificationAsRead(notificationId, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.post('/api/notifications/mark-all-read', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.markAllNotificationsAsRead(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  // User routes
  app.post('/api/users/regenerate-sigil', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check energy cost first
      const sigilCost = 100;
      if ((user.energy || 0) < sigilCost) {
        return res.status(400).json({ message: `Sigil regeneration requires ${sigilCost} energy. You have ${user.energy || 0} energy.` });
      }
      
      // Deduct energy cost
      await storage.updateUserEnergy(userId, (user.energy || 0) - sigilCost);
      
      // Generate new sigil (6 random characters)
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()+=[]{}|;:,.<>?';
      let newSigil = '';
      for (let i = 0; i < 6; i++) {
        newSigil += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      
      const updatedUser = await storage.updateUser(userId, { sigil: newSigil });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error regenerating sigil:", error);
      res.status(500).json({ message: "Failed to regenerate sigil" });
    }
  });

  app.post('/api/generate-sigil', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check energy cost first
      const sigilCost = 100;
      if ((user.energy || 0) < sigilCost) {
        return res.status(400).json({ message: `Sigil regeneration requires ${sigilCost} energy. You have ${user.energy || 0} energy.` });
      }
      
      // Deduct energy cost
      await storage.updateUserEnergy(userId, (user.energy || 0) - sigilCost);
      
      // Generate AI-powered sigil using username and traits
      const sigil = await generateUserSigil(user.username || user.email || userId);
      const sigilImageUrl = await generateSigilImage({ 
        beliefs: 'spiritual growth', 
        astrologySign: user.astrologySign || 'universal',
        spiritualPath: 'mystical journey'
      });
      
      res.json({ sigil, sigilImageUrl });
    } catch (error) {
      console.error("Error generating sigil:", error);
      res.status(500).json({ message: "Failed to generate sigil" });
    }
  });

  // Set sigil as profile image route
  // Save sigil to user profile (separate from profile picture)
  app.put('/api/save-sigil', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sigil, imageUrl } = req.body;
      
      if (!sigil || !imageUrl) {
        return res.status(400).json({ error: 'Both sigil and imageUrl are required' });
      }

      let finalImageUrl = imageUrl;
      
      // If this is a temporary DALL-E URL, download and save it permanently
      if (imageUrl.includes('oaidalleapiprodscus.blob.core.windows.net')) {
        console.log('Detected temporary DALL-E URL, downloading and saving permanently...');
        try {
          const { downloadAndSaveImage } = await import('./openai');
          const filename = `sigil-permanent-${userId}-${Date.now()}.png`;
          finalImageUrl = await downloadAndSaveImage(imageUrl, filename);
          console.log(`Sigil image permanently saved: ${filename} -> ${finalImageUrl}`);
        } catch (downloadError) {
          console.error('Failed to download sigil image, using original URL:', downloadError);
          // Keep the original URL as fallback
        }
      }

      // Update user's sigil and sigil image separately from profile picture
      const user = await storage.updateUser(userId, {
        sigil: sigil,
        sigilImageUrl: finalImageUrl
      });

      res.status(200).json({ user });
    } catch (error) {
      console.error('Error saving sigil:', error);
      res.status(500).json({ error: 'Failed to save sigil' });
    }
  });

  // Set sigil image as profile image route (for AI-generated images)
  app.put('/api/set-sigil-image-as-profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ error: 'imageUrl is required' });
      }

      // Update user's profile image URL to use the sigil image
      const user = await storage.updateUser(userId, {
        profileImageUrl: imageUrl
      });

      res.status(200).json({ user });
    } catch (error) {
      console.error('Error setting sigil image as profile:', error);
      res.status(500).json({ error: 'Failed to set sigil image as profile' });
    }
  });

  app.put('/api/set-sigil-as-profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sigil } = req.body;
      
      if (!sigil) {
        return res.status(400).json({ error: 'sigil is required' });
      }

      // Update user's sigil and clear profile image URL to use sigil instead
      const user = await storage.updateUser(userId, {
        sigil: sigil,
        profileImageUrl: null
      });

      res.status(200).json({ user });
    } catch (error) {
      console.error('Error setting sigil as profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/users/update-username', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { username } = req.body;
      
      if (!username || username.trim().length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters" });
      }
      
      const updatedUser = await storage.updateUser(userId, { username: username.trim() });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating username:", error);
      res.status(500).json({ message: "Failed to update username" });
    }
  });

  app.put('/api/users/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.claims.sub;
      
      // Users can only update their own profile
      if (userId !== currentUserId) {
        return res.status(403).json({ message: "Can only update your own profile" });
      }
      
      const { username, bio, astrologySign } = req.body;
      
      if (username && username.trim().length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters" });
      }
      
      const updateData: any = {};
      if (username) updateData.username = username.trim();
      if (bio !== undefined) updateData.bio = bio.trim();
      if (astrologySign !== undefined) updateData.astrologySign = astrologySign;
      
      const updatedUser = await storage.updateUser(userId, updateData);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Report routes
  app.post('/api/reports', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reportData = insertReportSchema.parse(req.body);
      
      // Validate that we're reporting something valid
      if (reportData.postId) {
        const post = await storage.getPost(reportData.postId);
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }
      }
      
      if (reportData.reportedUserId) {
        const user = await storage.getUser(reportData.reportedUserId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        // Can't report yourself
        if (reportData.reportedUserId === userId) {
          return res.status(400).json({ message: "You cannot report yourself" });
        }
      }
      
      const report = await storage.createReport(reportData, userId);
      res.status(201).json(report);
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.get('/api/reports/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reports = await storage.getUserReports(userId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching user reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // User Settings Routes
  app.put('/api/users/settings/privacy', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const {
        profileVisibility,
        postsVisibility,
        showOnlineStatus,
        allowDirectMessages,
        showActivityStatus,
        allowTagging
      } = req.body;
      
      const updateData: any = {};
      if (profileVisibility !== undefined) updateData.profileVisibility = profileVisibility;
      if (postsVisibility !== undefined) updateData.postsVisibility = postsVisibility;
      if (showOnlineStatus !== undefined) updateData.showOnlineStatus = showOnlineStatus;
      if (allowDirectMessages !== undefined) updateData.allowDirectMessages = allowDirectMessages;
      if (showActivityStatus !== undefined) updateData.showActivityStatus = showActivityStatus;
      if (allowTagging !== undefined) updateData.allowTagging = allowTagging;
      
      const updatedUser = await storage.updateUser(userId, updateData);
      res.json({ success: true, settings: updateData });
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      res.status(500).json({ message: "Failed to update privacy settings" });
    }
  });

  app.put('/api/users/settings/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const {
        likeNotifications,
        commentNotifications,
        energyNotifications,
        followNotifications,
        oracleNotifications,
        emailNotifications
      } = req.body;
      
      const updateData: any = {};
      if (likeNotifications !== undefined) updateData.likeNotifications = likeNotifications;
      if (commentNotifications !== undefined) updateData.commentNotifications = commentNotifications;
      if (energyNotifications !== undefined) updateData.energyNotifications = energyNotifications;
      if (followNotifications !== undefined) updateData.followNotifications = followNotifications;
      if (oracleNotifications !== undefined) updateData.oracleNotifications = oracleNotifications;
      if (emailNotifications !== undefined) updateData.emailNotifications = emailNotifications;
      
      const updatedUser = await storage.updateUser(userId, updateData);
      res.json({ success: true, settings: updateData });
    } catch (error) {
      console.error("Error updating notification settings:", error);
      res.status(500).json({ message: "Failed to update notification settings" });
    }
  });

  app.get('/api/users/settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return only settings-related fields
      const settings = {
        privacy: {
          profileVisibility: user.profileVisibility ?? true,
          postsVisibility: user.postsVisibility ?? true,
          showOnlineStatus: user.showOnlineStatus ?? true,
          allowDirectMessages: user.allowDirectMessages ?? true,
          showActivityStatus: user.showActivityStatus ?? true,
          allowTagging: user.allowTagging ?? true,
        },
        notifications: {
          likeNotifications: user.likeNotifications ?? true,
          commentNotifications: user.commentNotifications ?? true,
          energyNotifications: user.energyNotifications ?? true,
          followNotifications: user.followNotifications ?? true,
          oracleNotifications: user.oracleNotifications ?? true,
          emailNotifications: user.emailNotifications ?? false,
        }
      };
      
      res.json(settings);
    } catch (error) {
      console.error("Error fetching user settings:", error);
      res.status(500).json({ message: "Failed to fetch user settings" });
    }
  });

  app.get('/api/users/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get('/api/users/:userId/stats', async (req, res) => {
    try {
      const { userId } = req.params;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  app.get('/api/users/:userId/posts', async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const posts = await storage.getUserPosts(userId, limit);
      
      // Get engagement counts for each post
      const postsWithEngagements = await Promise.all(
        posts.map(async (post) => {
          const engagements = await storage.getPostEngagements(post.id);
          return { ...post, engagements };
        })
      );
      
      res.json(postsWithEngagements);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ message: "Failed to fetch user posts" });
    }
  });

  // Object storage routes for media uploads
  app.get("/objects/:objectPath(*)", isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  app.put("/api/media", isAuthenticated, async (req: any, res) => {
    if (!req.body.mediaURL) {
      return res.status(400).json({ error: "mediaURL is required" });
    }

    const userId = req.user?.claims?.sub;

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.mediaURL,
        {
          owner: userId,
          visibility: "public", // Media is public by default
        },
      );

      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      console.error("Error setting media:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Stripe subscription routes
  if (stripe) {
    app.post('/api/get-or-create-subscription', isAuthenticated, async (req: any, res) => {
      const userId = req.user.claims.sub;
      let user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

        res.send({
          subscriptionId: subscription.id,
          clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        });

        return;
      }
      
      if (!user.email) {
        return res.status(400).json({ error: 'No user email on file' });
      }

      try {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.username || `${user.firstName} ${user.lastName}` || user.email,
        });

        user = await storage.updateUserStripeInfo(user.id, customer.id);

        // You'll need to set STRIPE_PRICE_ID environment variable
        const priceId = process.env.STRIPE_PRICE_ID;
        if (!priceId) {
          return res.status(500).json({ error: 'Stripe price ID not configured' });
        }

        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{
            price: priceId,
          }],
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
        });

        await storage.updateUserStripeInfo(user.id, customer.id, subscription.id);
    
        res.send({
          subscriptionId: subscription.id,
          clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        });
      } catch (error: any) {
        return res.status(400).send({ error: { message: error.message } });
      }
    });
  }

  // Starmap endpoints
  app.get('/api/starmap/users', isAuthenticated, async (req: any, res) => {
    try {
      const filters: any = {};
      
      if (req.query.chakra) filters.chakra = req.query.chakra;
      if (req.query.minAura) filters.minAura = parseInt(req.query.minAura);
      if (req.query.maxAura) filters.maxAura = parseInt(req.query.maxAura);
      if (req.query.minEnergy) filters.minEnergy = parseInt(req.query.minEnergy);
      if (req.query.maxEnergy) filters.maxEnergy = parseInt(req.query.maxEnergy);
      if (req.query.astrologySign) filters.astrologySign = req.query.astrologySign;

      const starmapUsers = await storage.getStarmapUsers(filters);
      res.json(starmapUsers);
    } catch (error) {
      console.error("Error fetching starmap users:", error);
      res.status(500).json({ message: "Failed to fetch starmap users" });
    }
  });

  // Onboarding endpoints
  app.post('/api/onboarding/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { isReligious, isSpiritual, religion, spiritualPath, beliefs, offerings, birthDate, astrologySign } = req.body;
      
      // Update user with onboarding info
      await storage.updateUser(userId, {
        hasCompletedOnboarding: true,
        astrologySign,
        birthDate: birthDate ? new Date(birthDate) : null
      });

      // Generate AI Spirit based on answers
      const spiritData = await generateSpirit({
        isReligious,
        isSpiritual,
        religion,
        spiritualPath,
        beliefs,
        offerings,
        astrologySign
      });

      // Create spirit in database
      await storage.createSpirit(userId, {
        name: spiritData.name,
        description: spiritData.description,
        element: spiritData.element,
        imageUrl: spiritData.imageUrl,
        questionnaire: {
          isReligious,
          isSpiritual,
          religion,
          spiritualPath,
          beliefs,
          offerings,
          astrologySign,
          timestamp: new Date().toISOString()
        }
      });

      res.json({ success: true, spirit: spiritData });
    } catch (error) {
      console.error("Error completing onboarding:", error);
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });

  // Get user's spirit
  app.get('/api/spirit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const spirit = await storage.getUserSpirit(userId);
      res.json(spirit);
    } catch (error) {
      console.error("Error fetching spirit:", error);
      res.status(500).json({ message: "Failed to fetch spirit" });
    }
  });

  app.get('/api/spirits/my-spirit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const spirit = await storage.getUserSpirit(userId);
      res.json(spirit);
    } catch (error) {
      console.error("Error fetching spirit:", error);
      res.status(500).json({ message: "Failed to fetch spirit" });
    }
  });

  // Generate new spirit
  app.post("/api/spirit/generate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { isReligious, isSpiritual, religion, spiritualPath, beliefs, offerings, astrologySign } = req.body;
      
      // Validate required fields
      if (!beliefs || !astrologySign) {
        return res.status(400).json({ message: "Beliefs and astrology sign are required" });
      }

      // Delete existing spirit if any
      try {
        await storage.deleteUserSpirit(userId);
      } catch (error) {
        // Spirit may not exist yet, that's okay
      }

      // Generate new spirit
      const spiritData = await generateSpirit({
        isReligious,
        isSpiritual,
        religion,
        spiritualPath,
        beliefs,
        offerings,
        astrologySign
      });

      // Create spirit in database
      const spirit = await storage.createSpirit(userId, {
        name: spiritData.name,
        description: spiritData.description,
        element: spiritData.element,
        imageUrl: spiritData.imageUrl,
        questionnaire: {
          isReligious,
          isSpiritual,
          religion,
          spiritualPath,
          beliefs,
          offerings,
          astrologySign,
          timestamp: new Date().toISOString()
        }
      });

      res.json(spirit);
    } catch (error) {
      console.error("Error generating spirit:", error);
      res.status(500).json({ message: "Failed to generate spirit" });
    }
  });

  // Regenerate existing spirit
  app.post("/api/spirit/regenerate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get existing spirit
      const existingSpirit = await storage.getUserSpirit(userId);
      if (!existingSpirit) {
        return res.status(404).json({ message: "No spirit found to regenerate" });
      }

      // Use existing questionnaire data for regeneration
      const questionnaire = (existingSpirit as any).questionnaire || {};
      
      // Generate new spirit with same questionnaire
      const spiritData = await generateSpirit({
        isReligious: questionnaire.isReligious || false,
        isSpiritual: questionnaire.isSpiritual || true,
        religion: questionnaire.religion || "",
        spiritualPath: questionnaire.spiritualPath || "",
        beliefs: questionnaire.beliefs || "Seeking spiritual growth",
        offerings: questionnaire.offerings || "",
        astrologySign: questionnaire.astrologySign || "Aquarius"
      });

      // Delete old spirit and create new one
      await storage.deleteUserSpirit(userId);
      
      const newSpirit = await storage.createSpirit(userId, {
        name: spiritData.name,
        description: spiritData.description,
        element: spiritData.element,
        imageUrl: spiritData.imageUrl,
        level: (existingSpirit as any).level || 1,
        experience: (existingSpirit as any).experience || 0,
        questionnaire: {
          ...questionnaire,
          regeneratedAt: new Date().toISOString()
        }
      });

      res.json(newSpirit);
    } catch (error) {
      console.error("Error regenerating spirit:", error);
      res.status(500).json({ message: "Failed to regenerate spirit" });
    }
  });

  // Get user spirit (alias endpoint)
  app.get("/api/spirit", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const spirit = await storage.getUserSpirit(userId);
      res.json(spirit);
    } catch (error) {
      console.error("Error fetching spirit:", error);
      res.status(500).json({ message: "Failed to fetch spirit" });
    }
  });

  // Generate new spirit
  app.post("/api/spirit/generate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { isReligious, isSpiritual, religion, spiritualPath, beliefs, offerings, astrologySign } = req.body;
      
      // Validate required fields
      if (!beliefs || !astrologySign) {
        return res.status(400).json({ message: "Beliefs and astrology sign are required" });
      }

      // Generate new spirit
      const spiritData = await generateSpirit({
        isReligious,
        isSpiritual,
        religion,
        spiritualPath,
        beliefs,
        offerings,
        astrologySign
      });

      // Create spirit in database (replaces existing)
      const spirit = await storage.createSpirit(userId, {
        name: spiritData.name,
        description: spiritData.description,
        element: spiritData.element,
        imageUrl: spiritData.imageUrl,
        questionnaire: {
          isReligious,
          isSpiritual,
          religion,
          spiritualPath,
          beliefs,
          offerings,
          astrologySign,
          timestamp: new Date().toISOString()
        }
      });

      res.json(spirit);
    } catch (error) {
      console.error("Error generating spirit:", error);
      res.status(500).json({ message: "Failed to generate spirit" });
    }
  });

  // Evolve existing spirit (costs energy)
  app.post("/api/spirit/regenerate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check user energy first
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const evolutionCost = 100;
      if ((user.energy || 0) < evolutionCost) {
        return res.status(400).json({ message: `Evolution requires ${evolutionCost} energy. You have ${user.energy || 0} energy.` });
      }
      
      // Get existing spirit
      const existingSpirit = await storage.getUserSpirit(userId);
      if (!existingSpirit) {
        return res.status(404).json({ message: "No spirit found to evolve" });
      }

      // Use existing questionnaire data for regeneration
      const questionnaire = (existingSpirit as any).questionnaire || {};
      
      // Generate new spirit with same questionnaire
      const spiritData = await generateSpirit({
        isReligious: questionnaire.isReligious || false,
        isSpiritual: questionnaire.isSpiritual || true,
        religion: questionnaire.religion || "",
        spiritualPath: questionnaire.spiritualPath || "",
        beliefs: questionnaire.beliefs || "Seeking spiritual growth",
        offerings: questionnaire.offerings || "",
        astrologySign: questionnaire.astrologySign || "Aquarius"
      });

      // Deduct energy cost
      await storage.updateUserEnergy(userId, (user.energy || 0) - evolutionCost);
      
      // Preserve evolution history and add regeneration entry
      const preservedEvolution = [...((existingSpirit as any).evolution || [])];
      const regenerationEntry = {
        timestamp: new Date().toISOString(),
        action: "spirit_regeneration",
        experienceGain: 0,
        newExperience: (existingSpirit as any).experience || 0,
        newLevel: (existingSpirit as any).level || 1,
        leveledUp: false
      };
      preservedEvolution.push(regenerationEntry);
      
      // Delete old spirit and create new one with preserved level/experience AND evolution history
      await storage.deleteUserSpirit(userId);
      
      const newSpirit = await storage.createSpirit(userId, {
        name: spiritData.name,
        description: spiritData.description,
        element: spiritData.element,
        imageUrl: spiritData.imageUrl,
        level: (existingSpirit as any).level || 1,
        experience: (existingSpirit as any).experience || 0,
        questionnaire: {
          ...questionnaire,
          regeneratedAt: new Date().toISOString()
        }
      });

      // Update the new spirit with preserved evolution history
      if (newSpirit) {
        await storage.updateSpiritEvolution((newSpirit as any).id, preservedEvolution);
      }

      res.json(newSpirit);
    } catch (error) {
      console.error("Error regenerating spirit:", error);
      res.status(500).json({ message: "Failed to regenerate spirit" });
    }
  });

  // Evolve spirit with updated questionnaire
  app.post("/api/spirit/evolve-with-questionnaire", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { isReligious, isSpiritual, religion, spiritualPath, beliefs, offerings, astrologySign } = req.body;
      
      // Validate required fields
      if (!beliefs || !astrologySign) {
        return res.status(400).json({ message: "Beliefs and astrology sign are required" });
      }
      
      // Check user energy first
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const evolutionCost = 100;
      if ((user.energy || 0) < evolutionCost) {
        return res.status(400).json({ message: `Evolution requires ${evolutionCost} energy. You have ${user.energy || 0} energy.` });
      }
      
      // Get existing spirit for level and experience preservation
      const existingSpirit = await storage.getUserSpirit(userId);
      if (!existingSpirit) {
        return res.status(404).json({ message: "No spirit found to evolve" });
      }

      // Generate new spirit with updated questionnaire
      const spiritData = await generateSpirit({
        isReligious,
        isSpiritual,
        religion,
        spiritualPath,
        beliefs,
        offerings,
        astrologySign
      });

      // Preserve evolution history and add questionnaire evolution entry
      const preservedEvolution = [...((existingSpirit as any).evolution || [])];
      const questEvolutionEntry = {
        timestamp: new Date().toISOString(),
        action: "questionnaire_evolution",
        experienceGain: 0,
        newExperience: (existingSpirit as any).experience || 0,
        newLevel: (existingSpirit as any).level || 1,
        leveledUp: false,
        spiritName: spiritData.name,
        updatedBeliefs: beliefs,
        updatedPath: spiritualPath
      };
      preservedEvolution.push(questEvolutionEntry);
      
      // Deduct energy cost
      await storage.updateUserEnergy(userId, (user.energy || 0) - evolutionCost);
      
      // Delete old spirit and create new one with preserved level/experience AND evolution history
      await storage.deleteUserSpirit(userId);
      
      const newSpirit = await storage.createSpirit(userId, {
        name: spiritData.name,
        description: spiritData.description,
        element: spiritData.element,
        imageUrl: spiritData.imageUrl,
        level: (existingSpirit as any).level || 1,
        experience: (existingSpirit as any).experience || 0,
        questionnaire: {
          isReligious,
          isSpiritual,
          religion,
          spiritualPath,
          beliefs,
          offerings,
          astrologySign,
          evolvedAt: new Date().toISOString(),
          previousQuestionnaire: (existingSpirit as any).questionnaire
        }
      });

      // Update the new spirit with preserved evolution history
      if (newSpirit) {
        await storage.updateSpiritEvolution((newSpirit as any).id, preservedEvolution);
      }

      res.json(newSpirit);
    } catch (error) {
      console.error("Error evolving spirit with questionnaire:", error);
      res.status(500).json({ message: "Failed to evolve spirit" });
    }
  });

  // Connection requests
  app.post('/api/connections/request', isAuthenticated, async (req: any, res) => {
    try {
      const requesterId = req.user.claims.sub;
      const { receiverId } = req.body;
      
      if (requesterId === receiverId) {
        return res.status(400).json({ message: "Cannot connect to yourself" });
      }

      const connection = await storage.createConnection(requesterId, receiverId);
      res.json(connection);
    } catch (error) {
      console.error("Error creating connection request:", error);
      res.status(500).json({ message: "Failed to send connection request" });
    }
  });

  // Accept/decline connection
  app.put('/api/connections/:connectionId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { connectionId } = req.params;
      const { status } = req.body;
      
      const connection = await storage.updateConnection(connectionId, userId, status);
      res.json(connection);
    } catch (error) {
      console.error("Error updating connection:", error);
      res.status(500).json({ message: "Failed to update connection" });
    }
  });

  // User Activity endpoints for settings page
  app.get('/api/users/:userId/activity/liked', isAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const posts = await storage.getUserLikedPosts(userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching liked posts:", error);
      res.status(500).json({ message: "Failed to fetch liked posts" });
    }
  });

  app.get('/api/users/:userId/activity/energy-given', isAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const posts = await storage.getUserEnergyGivenPosts(userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching energy given posts:", error);
      res.status(500).json({ message: "Failed to fetch energy given posts" });
    }
  });

  app.get('/api/users/:userId/activity/voted', isAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const posts = await storage.getUserVotedPosts(userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching voted posts:", error);
      res.status(500).json({ message: "Failed to fetch voted posts" });
    }
  });

  app.get('/api/users/:userId/activity/commented', isAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const posts = await storage.getUserCommentedPosts(userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching commented posts:", error);
      res.status(500).json({ message: "Failed to fetch commented posts" });
    }
  });

  app.get('/api/users/:userId/activity/spiritual', isAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const posts = await storage.getUserSpiritualPosts(userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching spiritual posts:", error);
      res.status(500).json({ message: "Failed to fetch spiritual posts" });
    }
  });

  // Spiritual mark endpoints
  app.post('/api/posts/:postId/spiritual-mark', isAuthenticated, async (req: any, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user.claims.sub;
      
      const result = await storage.toggleSpiritualMark(userId, postId);
      res.json(result);
    } catch (error) {
      console.error("Error toggling spiritual mark:", error);
      res.status(500).json({ message: "Failed to toggle spiritual mark" });
    }
  });

  app.get('/api/posts/:postId/spiritual-mark/user', isAuthenticated, async (req: any, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user.claims.sub;
      
      const result = await storage.getSpiritualMarkStatus(userId, postId);
      res.json(result);
    } catch (error) {
      console.error("Error getting spiritual mark status:", error);
      res.status(500).json({ message: "Failed to get spiritual mark status" });
    }
  });

  // Newsletter subscription routes
  app.post('/api/newsletter/subscribe', async (req, res) => {
    try {
      const { email, firstName, lastName, turnstileToken } = req.body;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: "Valid email is required" });
      }

      // Check if this is a production domain that requires Turnstile
      const hostname = req.get('host') || '';
      const isProductionDomain = hostname.includes('ascended.social');
      
      // Verify Turnstile token for bot protection (only on production domains)
      if (isProductionDomain) {
        if (!turnstileToken) {
          return res.status(400).json({ 
            message: "Security verification required. Please refresh the page and try again.",
            code: 'TURNSTILE_REQUIRED'
          });
        }

        const clientIp = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
        const verification = await turnstileService.verifyToken(turnstileToken, clientIp);
        
        if (!verification.success) {
          console.warn('Newsletter subscription blocked - Turnstile verification failed:', verification.errorCodes);
          return res.status(400).json({ 
            message: turnstileService.getErrorMessage(verification.errorCodes || []),
            code: 'TURNSTILE_VERIFICATION_FAILED'
          });
        }
        
        console.log('✅ Newsletter subscription - Turnstile verification successful for production domain');
      } else {
        console.log('🧪 Newsletter subscription on testing domain - Turnstile bypassed');
      }

      // Check if email already exists
      const existingSubscription = await storage.getNewsletterSubscription(email);
      if (existingSubscription) {
        if (existingSubscription.isActive) {
          return res.status(400).json({ message: "Email is already subscribed" });
        } else {
          // Reactivate subscription
          const token = emailService.generateUnsubscribeToken();
          await storage.updateNewsletterPreferences(existingSubscription.unsubscribeToken!, { isActive: true });
          return res.json({ message: "Subscription reactivated successfully" });
        }
      }

      // Create new subscription
      const unsubscribeToken = emailService.generateUnsubscribeToken();
      const subscription = await storage.createNewsletterSubscription({
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        unsubscribeToken,
        preferences: { frequency: 'weekly', contentTypes: ['spiritual', 'community', 'oracle'] }
      });

      // Send welcome email
      await emailService.sendWelcomeEmail({
        email: subscription.email,
        firstName: subscription.firstName || undefined
      });

      res.json({ message: "Successfully subscribed to newsletter", subscriptionId: subscription.id });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  app.get('/api/newsletter/unsubscribe', async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: "Unsubscribe token is required" });
      }

      const subscription = await storage.getNewsletterSubscriptionByToken(token);
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      await storage.unsubscribeNewsletter(token);
      res.json({ message: "Successfully unsubscribed from newsletter" });
    } catch (error) {
      console.error("Error unsubscribing from newsletter:", error);
      res.status(500).json({ message: "Failed to unsubscribe from newsletter" });
    }
  });

  app.get('/api/newsletter/preferences', async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: "Token is required" });
      }

      const subscription = await storage.getNewsletterSubscriptionByToken(token);
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      res.json({
        email: subscription.email,
        preferences: subscription.preferences,
        isActive: subscription.isActive
      });
    } catch (error) {
      console.error("Error getting newsletter preferences:", error);
      res.status(500).json({ message: "Failed to get newsletter preferences" });
    }
  });

  app.post('/api/newsletter/preferences', async (req, res) => {
    try {
      const { token } = req.query;
      const { preferences } = req.body;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: "Token is required" });
      }

      if (!preferences || typeof preferences !== 'object') {
        return res.status(400).json({ message: "Valid preferences object is required" });
      }

      const subscription = await storage.updateNewsletterPreferences(token, preferences);
      res.json({ message: "Preferences updated successfully", preferences: subscription.preferences });
    } catch (error) {
      console.error("Error updating newsletter preferences:", error);
      res.status(500).json({ message: "Failed to update newsletter preferences" });
    }
  });

  // Admin route to send newsletter (optional - for testing)
  app.post('/api/newsletter/send', isAuthenticated, async (req: any, res) => {
    try {
      const { subject, content } = req.body;
      
      if (!subject || !content) {
        return res.status(400).json({ message: "Subject and content are required" });
      }

      // Get all active subscriptions
      const subscriptions = await storage.getActiveNewsletterSubscriptions();
      
      let sentCount = 0;
      let failedCount = 0;

      // Send email to all subscribers
      for (const subscription of subscriptions) {
        const success = await emailService.sendNewsletterEmail({
          email: subscription.email,
          firstName: subscription.firstName || undefined,
          subject,
          content,
          unsubscribeToken: subscription.unsubscribeToken || ''
        });

        if (success) {
          await storage.updateNewsletterLastEmailSent(subscription.email);
          sentCount++;
        } else {
          failedCount++;
        }
      }

      res.json({ 
        message: "Newsletter sent", 
        results: { sent: sentCount, failed: failedCount } 
      });
    } catch (error) {
      console.error("Error sending newsletter:", error);
      res.status(500).json({ message: "Failed to send newsletter" });
    }
  });

  // Register Scrapybara routes for authenticated screenshot testing
  registerScrapybaraRoutes(app);
  registerVisionsRoutes(app);
  registerCommunitiesRoutes(app);
  registerZeroTrustRoutes(app);


  const httpServer = createServer(app);
  return httpServer;
}
