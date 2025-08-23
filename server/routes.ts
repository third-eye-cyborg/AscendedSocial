import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  analyzePostChakra, 
  generateDailyReading, 
  generateTarotReading,
  generateUserSigil,
  generateOracleRecommendations,
  generateSpirit
} from "./openai";
import { 
  insertPostSchema, 
  insertCommentSchema, 
  insertEngagementSchema,
  type EngagementType 
} from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import { registerScrapybaraRoutes } from "./scrapybara-routes";
import Stripe from "stripe";

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

      // Generate sigil if user doesn't have one
      if (!user.sigil) {
        const sigil = await generateUserSigil(user.username || user.email || userId);
        await storage.updateUserSigil(userId, sigil);
        user.sigil = sigil;
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Post routes
  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postData = insertPostSchema.parse(req.body);
      
      // Create post
      const post = await storage.createPost(postData, userId);
      
      // Analyze content for chakra categorization
      const chakraAnalysis = await analyzePostChakra(postData.content);
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
      
      // Get engagement counts for each post
      const postsWithEngagements = await Promise.all(
        posts.map(async (post) => {
          const engagements = await storage.getPostEngagements(post.id);
          return { ...post, engagements };
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
      const { type } = req.body;
      
      if (!['upvote', 'downvote', 'like', 'energy'].includes(type)) {
        return res.status(400).json({ message: "Invalid engagement type" });
      }

      // Check if user has enough energy for energy engagements
      if (type === 'energy') {
        const user = await storage.getUser(userId);
        if (!user || (user.energy || 0) < 10) {
          return res.status(400).json({ message: "Insufficient energy" });
        }
        await storage.updateUserEnergy(userId, (user.energy || 0) - 10);
      }

      const engagement = await storage.createEngagement(
        { postId, type: type as EngagementType },
        userId
      );
      
      res.json(engagement);
    } catch (error) {
      console.error("Error creating engagement:", error);
      res.status(500).json({ message: "Failed to create engagement" });
    }
  });

  app.delete('/api/posts/:postId/engage/:type', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { postId, type } = req.params;
      
      await storage.removeEngagement(postId, userId, type as EngagementType);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing engagement:", error);
      res.status(500).json({ message: "Failed to remove engagement" });
    }
  });

  // Comment routes
  app.post('/api/posts/:postId/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { postId } = req.params;
      const commentData = insertCommentSchema.parse({ ...req.body, postId });
      
      const comment = await storage.createComment(commentData, userId);
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
      
      // Generate AI-powered sigil using username and traits
      const sigil = await generateUserSigil(user.username || user.email || userId);
      
      res.json({ sigil });
    } catch (error) {
      console.error("Error generating sigil:", error);
      res.status(500).json({ message: "Failed to generate sigil" });
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
      
      const { username, bio } = req.body;
      
      if (username && username.trim().length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters" });
      }
      
      const updateData: any = {};
      if (username) updateData.username = username.trim();
      if (bio !== undefined) updateData.bio = bio.trim();
      
      const updatedUser = await storage.updateUser(userId, updateData);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
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

  // Register Scrapybara routes for authenticated screenshot testing
  registerScrapybaraRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
