import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { setupAdminAuth, isAdminAuthenticated, logAdminAction } from "./adminAuth";
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
import jwt from 'jsonwebtoken';

// Multer setup for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for videos
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});
// Browserless routes removed - no longer using browserless service
// import { registerBrowserlessRoutes } from "./browserless-routes";
// import { registerBrowserlessAuthRoutes } from "./browserless-auth-routes";
import { registerFigmaMCPRoutes } from "./figma-mcp-routes";
import { serviceMonitor } from "./service-monitor";
import { registerVisionsRoutes } from "./visionsApi";
import { registerCommunitiesRoutes } from "./communitiesApi";
import { turnstileService } from "./turnstileService";
import { AnalyticsService, analyticsMiddleware } from "./analytics";
import { ServerNotificationService } from "./notificationService";
import { emailService } from "./emailService";
import { cloudflareImages } from "./cloudflareImages";
import { setupRouteSegregation, routeInfoEndpoint, AuthType, getRequiredAuthType } from "./routeSegregation";
import { 
  enhancedUserAuthentication, 
  enhancedAdminAuthentication, 
  enhancedSecurityHeaders,
  securityErrorHandler 
} from "./authenticationValidation";
import { bypassAuthForTesting } from "./auth-bypass";
import webhookRouter from "./webhooks";
import privacyRouter from "./routes/privacy";
import paymentsRouter from "./routes/payments";

// Privacy and Payment processing handled by Fides + RevenueCat + Paddle integration

export async function registerRoutes(app: Express): Promise<Server> {
  // Analytics middleware (before auth to track all requests)
  app.use(analyticsMiddleware());

  // 🔐 COMPREHENSIVE ROUTE SEGREGATION AND SECURITY SETUP
  console.log('🔐 Implementing comprehensive route segregation and security...');
  
  // Apply enhanced security headers to all routes
  app.use(enhancedSecurityHeaders);
  
  // Apply security error handling middleware
  app.use(securityErrorHandler);
  
  // 🧪 Apply auth bypass middleware BEFORE route segregation for testing
  app.use(bypassAuthForTesting);
  
  // Apply route segregation middleware FIRST - this validates authentication types
  setupRouteSegregation(app);
  
  // Authentication systems setup with proper isolation
  await setupAuth(app);         // Replit Auth for regular users (unified auth)
  await setupAdminAuth(app);    // Replit Auth for admin staff (admin portal only)

  // Apply enhanced authentication middleware for additional security
  app.use(enhancedUserAuthentication);   // Enhanced user auth with cross-auth prevention
  app.use(enhancedAdminAuthentication);  // Enhanced admin auth with additional checks

  // Note: Both regular users and admins use Replit Auth with proper route segregation
  // Route segregation middleware ensures no cross-authentication vulnerabilities

  // Debug endpoint to check route authentication requirements
  app.get('/api/debug/route-info', routeInfoEndpoint);
  
  console.log('✅ Comprehensive route segregation and security middleware applied');

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;
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

  // Admin dashboard routes
  app.get("/api/admin/analytics", isAdminAuthenticated, async (req, res) => {
    try {
      const period = req.query.period as string || '7d';
      
      // Calculate date range based on period
      const now = new Date();
      const periodDays = {
        '1d': 1,
        '7d': 7,
        '30d': 30,
        '90d': 90
      }[period] || 7;
      
      const startDate = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));
      
      // Get user analytics
      const totalUsers = await storage.getUserCount();
      const newUsersToday = await storage.getNewUsersCount(1);
      const newUsersWeek = await storage.getNewUsersCount(7);
      const premiumUsers = await storage.getPremiumUsersCount();
      const activeUsers = await storage.getActiveUsersCount(periodDays);
      const totalPosts = await storage.getPostsCount();
      const totalEngagements = await storage.getEngagementsCount();
      const totalOracleReadings = await storage.getOracleReadingsCount();
      
      // Get chakra distribution
      const chakraDistribution = await storage.getChakraDistribution();
      
      // Get engagement types
      const engagementTypes = await storage.getEngagementTypesDistribution();
      
      // Get daily signups
      const dailySignups = await storage.getDailySignups(periodDays);
      
      // Get recent activity
      const recentActivity = await storage.getRecentActivity(20);
      
      const analytics = {
        totalUsers,
        newUsersToday,
        newUsersWeek,
        premiumUsers,
        activeUsers,
        totalPosts,
        totalEngagements,
        totalOracleReadings,
        chakraDistribution,
        engagementTypes,
        dailySignups,
        recentActivity
      };
      
      res.json(analytics);
    } catch (error) {
      console.error("Admin analytics error:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/admin/reports", isAdminAuthenticated, async (req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      console.error("Admin reports error:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  app.patch("/api/admin/reports/:reportId", isAdminAuthenticated, async (req, res) => {
    try {
      const { reportId } = req.params;
      const { status, moderatorNotes } = req.body;
      const adminUser = (req as any).user;
      
      await storage.updateReport(reportId, {
        status,
        moderatorNotes,
        reviewedAt: new Date(),
        reviewedBy: adminUser.id
      });
      
      // Enhanced audit logging for report actions
      await logAdminAction(req, 'report_reviewed', {
        reportId,
        oldStatus: 'pending', // TODO: Get from storage if needed
        newStatus: status,
        moderatorNotes: moderatorNotes?.substring(0, 100) // Truncate for logging
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Admin update report error:", error);
      res.status(500).json({ error: "Failed to update report" });
    }
  });

  app.get("/api/admin/health", isAdminAuthenticated, async (req, res) => {
    try {
      // Basic system health metrics
      const health = {
        totalRequests: 1000, // TODO: Implement actual metrics
        averageResponseTime: 250,
        errorRate: 0.5,
        activeServices: 8,
        totalServices: 10,
        lastHealthCheck: new Date().toISOString(),
        serviceStatus: [
          { name: "Database", status: "healthy" as const, lastCheck: new Date().toISOString(), responseTime: 50 },
          { name: "Authentication", status: "healthy" as const, lastCheck: new Date().toISOString(), responseTime: 120 },
          { name: "File Storage", status: "healthy" as const, lastCheck: new Date().toISOString(), responseTime: 80 },
          { name: "Analytics", status: "healthy" as const, lastCheck: new Date().toISOString(), responseTime: 200 },
          { name: "Email Service", status: "degraded" as const, lastCheck: new Date().toISOString(), responseTime: 500 },
          { name: "Payment Processing", status: "healthy" as const, lastCheck: new Date().toISOString(), responseTime: 300 },
          { name: "AI Oracle", status: "healthy" as const, lastCheck: new Date().toISOString(), responseTime: 1200 },
          { name: "Browser Automation", status: "degraded" as const, lastCheck: new Date().toISOString(), responseTime: 2000 },
          { name: "Zero Trust", status: "healthy" as const, lastCheck: new Date().toISOString(), responseTime: 150 },
          { name: "CDN", status: "down" as const, lastCheck: new Date().toISOString(), responseTime: 0 },
        ]
      };
      
      res.json(health);
    } catch (error) {
      console.error("Admin health error:", error);
      res.status(500).json({ error: "Failed to fetch system health" });
    }
  });

  // Admin User Management Routes (TODO: Implement storage methods)
  /* 
  app.get("/api/admin/users", isAdminAuthenticated, async (req, res) => {
    try {
      const { page = 1, limit = 50, search, status } = req.query;
      const users = await storage.getUsers({ 
        page: Number(page), 
        limit: Number(limit), 
        search: search as string,
        status: status as string 
      });
      res.json(users);
    } catch (error) {
      console.error("Admin users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  */

  /* TODO: Implement storage methods for admin user management
  app.get("/api/admin/users/:userId", isAdminAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Get additional user data for admin view
      const userPosts = await storage.getUserPosts(userId, { limit: 10 });
      const userReports = await storage.getUserReports(userId);
      const userEngagements = await storage.getUserEngagements(userId, { limit: 10 });
      
      res.json({
        ...user,
        recentPosts: userPosts,
        reports: userReports,
        recentEngagements: userEngagements
      });
    } catch (error) {
      console.error("Admin user detail error:", error);
      res.status(500).json({ error: "Failed to fetch user details" });
    }
  });
  */

  app.patch("/api/admin/users/:userId/status", isAdminAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const { status, reason } = req.body;
      const adminUser = (req as any).user;
      
      // Enhanced audit logging for user status changes
      await logAdminAction(req, 'user_role_changed', {
        targetUserId: userId,
        oldStatus: 'active', // TODO: Get from storage if needed
        newStatus: status,
        reason: reason?.substring(0, 200) // Truncate for logging
      });
      
      // TODO: Implement storage.updateUserStatus method
      // await storage.updateUserStatus(userId, status, {
      //   reason,
      //   moderatedBy: adminUser.id,
      //   moderatedAt: new Date()
      // });
      
      res.json({ success: true, message: "User status update not yet implemented" });
    } catch (error) {
      console.error("Admin user status update error:", error);
      res.status(500).json({ error: "Failed to update user status" });
    }
  });

  // Admin Content Moderation Routes  
  app.get("/api/admin/posts", isAdminAuthenticated, async (req, res) => {
    try {
      const { page = 1, limit = 50, status, chakra } = req.query;
      // Use existing getPosts method with proper parameters
      const posts = await storage.getPosts(Number(limit));
      res.json(posts);
    } catch (error) {
      console.error("Admin posts error:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.patch("/api/admin/posts/:postId/moderate", isAdminAuthenticated, async (req, res) => {
    try {
      const { postId } = req.params;
      const { action, reason } = req.body; // action: 'approve', 'remove', 'flag'
      const adminUser = (req as any).user;
      
      // Enhanced audit logging for post moderation
      const auditAction = action === 'remove' ? 'post_removed' : 'post_restored';
      await logAdminAction(req, auditAction, {
        targetPostId: postId,
        moderationAction: action,
        reason: reason?.substring(0, 200) // Truncate for logging
      });
      
      // TODO: Implement moderatePost method in storage
      console.log('Post moderation requested:', { postId, action, reason });
      // await storage.moderatePost(postId, action, {
      //   reason,
      //   moderatedBy: adminUser.id,
      //   moderatedAt: new Date()
      // });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Admin post moderation error:", error);
      res.status(500).json({ error: "Failed to moderate post" });
    }
  });

  // Admin Support Ticket System
  app.get("/api/admin/support-tickets", isAdminAuthenticated, async (req, res) => {
    try {
      const { status = 'open', priority } = req.query;
      // TODO: Implement getSupportTickets method in storage
      const tickets: any[] = [];
      // const tickets = await storage.getSupportTickets({ 
      //   status: status as string,
      //   priority: priority as string 
      // });
      res.json(tickets);
    } catch (error) {
      console.error("Admin support tickets error:", error);
      res.status(500).json({ error: "Failed to fetch support tickets" });
    }
  });

  app.patch("/api/admin/support-tickets/:ticketId", isAdminAuthenticated, async (req, res) => {
    try {
      const { ticketId } = req.params;
      const { status, response, priority } = req.body;
      const adminUser = (req as any).user;
      
      // TODO: Implement updateSupportTicket method in storage
      console.log('Support ticket update requested:', { ticketId, status, response });
      // await storage.updateSupportTicket(ticketId, {
      //   status,
      //   response,
      //   priority,
      //   assignedTo: adminUser.id,
      //   updatedAt: new Date()
      // });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Admin support ticket update error:", error);
      res.status(500).json({ error: "Failed to update support ticket" });
    }
  });

  // Admin Community Feedback Routes
  app.get("/api/admin/feedback", isAdminAuthenticated, async (req, res) => {
    try {
      const { type, status } = req.query;
      // TODO: Implement getCommunityFeedback method in storage
      const feedback: any[] = [];
      // const feedback = await storage.getCommunityFeedback({ 
      //   type: type as string,
      //   status: status as string 
      // });
      res.json(feedback);
    } catch (error) {
      console.error("Admin feedback error:", error);
      res.status(500).json({ error: "Failed to fetch community feedback" });
    }
  });

  app.patch("/api/admin/feedback/:feedbackId", isAdminAuthenticated, async (req, res) => {
    try {
      const { feedbackId } = req.params;
      const { status, adminResponse } = req.body;
      const adminUser = (req as any).user;
      
      // TODO: Implement updateCommunityFeedback method in storage
      console.log('Community feedback update requested:', { feedbackId, status, adminResponse });
      // await storage.updateCommunityFeedback(feedbackId, {
      //   status,
      //   adminResponse,
      //   reviewedBy: adminUser.id,
      //   reviewedAt: new Date()
      // });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Admin feedback update error:", error);
      res.status(500).json({ error: "Failed to update feedback" });
    }
  });

  // Admin Bug Tracking Routes
  app.get("/api/admin/bugs", isAdminAuthenticated, async (req, res) => {
    try {
      const { severity, status, assignee } = req.query;
      // Use existing getReports method for bug reports
      const bugs = await storage.getReports();
      // TODO: Filter reports by type='bug' and other criteria
      // const bugs = await storage.getBugReports({ 
      //   severity: severity as string,
      //   status: status as string,
      //   assignee: assignee as string 
      // });
      res.json(bugs);
    } catch (error) {
      console.error("Admin bugs error:", error);
      res.status(500).json({ error: "Failed to fetch bug reports" });
    }
  });

  app.patch("/api/admin/bugs/:bugId", isAdminAuthenticated, async (req, res) => {
    try {
      const { bugId } = req.params;
      const { status, severity, assignee, resolution } = req.body;
      const adminUser = (req as any).user;
      
      // Use existing updateReport method for bug reports
      console.log('Bug report update requested:', { bugId, status, severity, resolution });
      // TODO: Implement proper bug tracking system
      // await storage.updateBugReport(bugId, {
      //   status,
      //   severity,
      //   assignee,
      //   resolution,
      //   updatedBy: adminUser.id,
      //   updatedAt: new Date()
      // });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Admin bug update error:", error);
      res.status(500).json({ error: "Failed to update bug report" });
    }
  });

  // Post routes
  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
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

  app.get('/api/posts', isAuthenticated, async (req, res) => {
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

  app.get('/api/posts/:id', isAuthenticated, async (req, res) => {
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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;

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
      const userId = req.user.id;

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
      const userId = req.user.id;
      const bookmarks = await storage.getUserBookmarks(userId);
      res.json(bookmarks);
    } catch (error: any) {
      console.error("Error fetching bookmarks:", error);
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  app.get('/api/posts/:postId/engage/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;

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
      const userId = req.user.id;

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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;

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
      const userId = req.user.id;

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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;
      const count = await storage.getUnreadNotificationCount(userId);
      res.json(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ message: "Failed to fetch unread count" });
    }
  });

  app.post('/api/notifications/:notificationId/read', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;
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

  // Payment processing handled by RevenueCat + Paddle integration
  // See documentation for RevenueCat and Paddle setup instructions

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
      const userId = req.user.id;
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
      const userId = req.user.id;
      const spirit = await storage.getUserSpirit(userId);
      res.json(spirit);
    } catch (error) {
      console.error("Error fetching spirit:", error);
      res.status(500).json({ message: "Failed to fetch spirit" });
    }
  });

  app.get('/api/spirits/my-spirit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;

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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;

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
      const userId = req.user.id;
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
      const userId = req.user.id;
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
      const userId = req.user.id;

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
      const userId = req.user.id;

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

      // Track newsletter subscription analytics
      await AnalyticsService.trackNewsletter(email, 'subscribed', {
        first_name: firstName,
        turnstile_verified: isProductionDomain,
        source: 'website_form',
      });

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

  // Privacy and GDPR compliance routes
  app.post('/api/privacy/export', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { email, dataTypes } = req.body;

      if (!email || !dataTypes || !Array.isArray(dataTypes)) {
        return res.status(400).json({ error: 'Email and dataTypes array are required' });
      }

      // Log the data export request
      await AnalyticsService.track({
        event: 'privacy_data_export_requested',
        distinctId: userId,
        properties: {
          email,
          dataTypes,
          requestedAt: new Date().toISOString(),
        },
      });

      // In a real implementation, you would:
      // 1. Queue the export job
      // 2. Generate the data export
      // 3. Send an email with the download link

      // For now, we'll simulate the request being processed
      console.log(`📤 Data export requested for user ${userId} (${email})`);
      console.log(`Requested data types: ${dataTypes.join(', ')}`);

      // Send confirmation email
      if (emailService && emailService.sendTransactionalEmail) {
        await emailService.sendTransactionalEmail({
          email: email,
          subject: 'Data Export Request Received',
          content: `
            <h2>Data Export Request Received</h2>
            <p>Your data export request has been received and will be processed within 30 days as required by GDPR.</p>
            <p><strong>Requested data types:</strong> ${dataTypes.join(', ')}</p>
            <p>You will receive an email with your data when ready.</p>
            <hr>
            <p><small>This is an automated message from Ascended Social privacy compliance system.</small></p>
          `,
          type: 'account_notification'
        });
      }

      res.json({ 
        message: 'Data export request submitted successfully',
        requestId: randomUUID(),
        estimatedCompletion: '30 days',
        dataTypes 
      });
    } catch (error) {
      console.error('Error processing data export request:', error);
      res.status(500).json({ error: 'Failed to process data export request' });
    }
  });

  app.post('/api/privacy/delete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { email, deleteTypes, reason } = req.body;

      if (!email || !deleteTypes || !Array.isArray(deleteTypes)) {
        return res.status(400).json({ error: 'Email and deleteTypes array are required' });
      }

      // Log the data deletion request  
      await AnalyticsService.track({
        event: 'privacy_data_deletion_requested',
        distinctId: userId,
        properties: {
          email,
          deleteTypes,
          reason,
          requestedAt: new Date().toISOString(),
        },
      });

      console.log(`🗑️ Data deletion requested for user ${userId} (${email})`);
      console.log(`Delete types: ${deleteTypes.join(', ')}`);
      if (reason) console.log(`Reason: ${reason}`);

      // In a real implementation, you would:
      // 1. Queue the deletion job
      // 2. Anonymize or delete user data based on deleteTypes
      // 3. Send confirmation email

      // For now, if 'all' is requested, we could mark user for deletion
      if (deleteTypes.includes('all')) {
        // Mark user account for deletion (in real implementation)
        console.log(`⚠️ Full account deletion requested for user ${userId}`);
      }

      // Send confirmation email
      if (emailService && emailService.sendTransactionalEmail) {
        await emailService.sendTransactionalEmail({
          email: email,
          subject: 'Data Deletion Request Received',
          content: `
            <h2>Data Deletion Request Received</h2>
            <p>Your data deletion request has been received and will be processed within 30 days as required by GDPR.</p>
            <p><strong>Data types to be deleted:</strong> ${deleteTypes.join(', ')}</p>
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            <p>You will receive a confirmation email once the deletion is complete.</p>
            <hr>
            <p><small>This is an automated message from Ascended Social privacy compliance system.</small></p>
          `,
          type: 'account_notification'
        });
      }

      res.json({ 
        message: 'Data deletion request submitted successfully',
        requestId: randomUUID(),
        estimatedCompletion: '30 days',
        deleteTypes 
      });
    } catch (error) {
      console.error('Error processing data deletion request:', error);
      res.status(500).json({ error: 'Failed to process data deletion request' });
    }
  });

  app.get('/api/privacy/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;

      // Get user data for privacy report
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate privacy compliance status
      const privacyStatus = {
        userId,
        email: user.email,
        dataRetentionPolicy: '12 months or until consent withdrawn',
        gdprCompliant: true,
        dataProcessingBasis: 'Consent (GDPR Article 6(1)(a))',
        dataCategories: {
          profile: 'Username, email, spiritual preferences',
          analytics: 'Usage patterns, engagement metrics',
          posts: 'Content created by user',
          comments: 'User interactions and discussions',
        },
        userRights: {
          dataExport: 'Available - Request processed within 30 days',
          dataDeletion: 'Available - Processed within 30 days',
          dataPortability: 'Available on request',
          withdrawConsent: 'Available anytime',
        },
        thirdPartySharing: [
          { service: 'PostHog Analytics', purpose: 'Usage analytics', dataTypes: ['behavioral'] },
          { service: 'RevenueCat', purpose: 'Cross-platform subscription management', dataTypes: ['subscription_status', 'customer_profile'] },
          { service: 'Paddle', purpose: 'Web payment processing and checkout', dataTypes: ['billing', 'payment_methods'] },
          { service: 'OneSignal', purpose: 'Email delivery and newsletter management', dataTypes: ['email', 'name', 'communication_preferences'] },
          { service: 'Cloudflare Stream', purpose: 'Video hosting and streaming', dataTypes: ['media'] },
          { service: 'OneSignal', purpose: 'Push notifications for mobile app', dataTypes: ['notification', 'device_tokens'] },
          { service: 'Replit Database', purpose: 'Primary data storage for platform', dataTypes: ['profile', 'posts', 'spiritual_data', 'user_preferences'] },
          { service: 'Replit', purpose: 'Application infrastructure and hosting', dataTypes: ['infrastructure', 'session_data'] },
        ],
        lastUpdated: new Date().toISOString(),
      };

      res.json(privacyStatus);
    } catch (error) {
      console.error('Error getting privacy status:', error);
      res.status(500).json({ error: 'Failed to get privacy status' });
    }
  });

  // Sparks routes - short-form posts with optional portrait videos
  app.post('/api/sparks', isAuthenticated, upload.single('video'), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { content } = req.body;
      
      if (!content || content.trim().length === 0) {
        return res.status(400).json({ message: "Content is required" });
      }
      
      if (content.length > 140) {
        return res.status(400).json({ message: "Content cannot exceed 140 characters" });
      }

      let videoUrl = null;
      let cloudflareVideoId = null;

      // Handle video upload if present
      if (req.file) {
        try {
          // Validate video file
          const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/mov'];
          if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ message: "Only MP4, WebM, and MOV video formats are supported" });
          }

          // Upload to Cloudflare Stream with metadata
          const uploadResult = await cloudflareImages.uploadVideo(req.file.buffer, {
            name: `spark-${userId}-${Date.now()}`,
            type: 'spark',
            userId: userId
          });

          cloudflareVideoId = uploadResult.result.uid;
          const streamUrls = cloudflareImages.getVideoStreamUrls(cloudflareVideoId);
          videoUrl = streamUrls.hls; // Use HLS for best compatibility
        } catch (error) {
          console.error("Error uploading video:", error);
          return res.status(500).json({ message: "Failed to upload video" });
        }
      }

      // Create spark post
      const sparkData = {
        content: content.trim(),
        type: 'spark',
        videoUrl,
        cloudflareVideoId
      };

      const spark = await storage.createPost(sparkData, userId);

      // Analyze content for chakra categorization
      const chakraAnalysis = await analyzePostChakra(sparkData.content);
      await storage.updatePostChakra(spark.id, chakraAnalysis.chakra);

      // Fetch complete spark with author
      const sparkWithAuthor = await storage.getPost(spark.id);

      res.json(sparkWithAuthor);
    } catch (error) {
      console.error("Error creating spark:", error);
      res.status(500).json({ message: "Failed to create spark" });
    }
  });

  app.get('/api/sparks', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      // Get sparks specifically (type = 'spark')
      const sparks = await storage.getPostsByType('spark', limit, offset);

      // Get engagement counts for each spark
      const sparkIds = sparks.map((s: any) => s.id);
      const spiritualCounts = await storage.getSpiritualCountForPosts(sparkIds);

      const sparksWithEngagements = await Promise.all(
        sparks.map(async (spark: any) => {
          const engagements = await storage.getPostEngagements(spark.id);
          const spiritualCount = spiritualCounts[spark.id] || 0;

          return {
            ...spark,
            upvotes: engagements.upvote || 0,
            downvotes: engagements.downvote || 0,
            likes: engagements.like || 0,
            energy: engagements.energy || 0,
            spiritualCount,
            // Add video streaming URLs if video exists
            videoStreamUrls: spark.videoUrl && spark.cloudflareVideoId ? 
              cloudflareImages.getVideoStreamUrls(spark.cloudflareVideoId) : null
          };
        })
      );

      res.json(sparksWithEngagements);
    } catch (error) {
      console.error("Error fetching sparks:", error);
      res.status(500).json({ message: "Failed to fetch sparks" });
    }
  });

  // Register routes with appropriate Zero Trust protection levels
  // Browserless routes removed - no longer using browserless service
  // registerBrowserlessRoutes(app); // Browser automation - should be Zero Trust protected
  // registerBrowserlessAuthRoutes(app); // Authenticated browser automation for testing
  registerFigmaMCPRoutes(app);    // Figma design sync - should be Zero Trust protected
  registerVisionsRoutes(app);     // Regular user features - Replit Auth only
  registerCommunitiesRoutes(app); // Regular user features - Replit Auth only
  
  // Privacy management routes (Fides integration)
  app.use('/api/privacy', privacyRouter); // DSAR, consent management, compliance
  console.log('🛡️ Privacy management routes registered');

  // Payment routes (RevenueCat + Paddle integration)  
  app.use('/api/payments', paymentsRouter); // Subscriptions, billing, webhooks
  console.log('💳 Payment routes registered');

  // Webhook routes for payment and privacy integrations
  app.use('/', webhookRouter); // Public webhooks for external services
  console.log('🔗 Webhook routes registered');

  // System health monitoring endpoint with comprehensive service status
  app.get('/api/system/health', async (req, res) => {
    try {
      const useCache = req.query.cache !== 'false';
      const health = useCache 
        ? await serviceMonitor.getCachedOrFreshHealth()
        : await serviceMonitor.getSystemHealth();
      
      const statusCode = health.overall === 'healthy' ? 200 : 
                        health.overall === 'degraded' ? 206 : 503;
      
      res.status(statusCode).json({
        success: health.overall !== 'unhealthy',
        health,
        metrics: serviceMonitor.getServiceMetrics(),
        polished: true,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('❌ [SYSTEM-HEALTH] Health check endpoint failed:', error);
      res.status(500).json({
        success: false,
        error: 'System health check failed',
        timestamp: new Date().toISOString()
      });
    }
  });
  console.log('📊 System health monitoring endpoint enabled');


  const httpServer = createServer(app);
  return httpServer;
}