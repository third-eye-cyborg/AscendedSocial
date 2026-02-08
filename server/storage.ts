import {
  users,
  posts,
  comments,
  postEngagements,
  commentEngagements,
  spiritualReadings,
  subscriptions,
  spirits,
  connections,
  spiritualMarks,
  newsletterSubscriptions,
  reports,
  auditLogs,
  webhookEvents,
  entitlements,
  type User,
  type UpsertUser,
  type Post,
  type PostWithAuthor,
  type InsertPost,
  type Comment,
  type CommentWithAuthor,
  type InsertComment,
  type Engagement,
  type InsertEngagement,
  type SpiritualReading,
  type InsertReading,
  type Notification,
  type NotificationWithTriggerUser,
  type InsertNotification,
  type NewsletterSubscription,
  type InsertNewsletterSubscription,
  type Report,
  type InsertReport,
  type AuditLog,
  type InsertAuditLog,
  type WebhookEvent,
  type InsertWebhookEvent,
  type Entitlement,
  type InsertEntitlement,
  type ChakraType,
  type EngagementType,
  type UserRole,
  type AuditAction,
  notifications,
  bookmarks,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, count, ilike, or, ne, sum, inArray, gte, lte, gt, lt } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(userId: string, updates: Partial<User>): Promise<User>;
  updateUserSigil(userId: string, sigil: string, sigilImageUrl?: string): Promise<User>;
  updateUserEnergy(userId: string, energy: number): Promise<User>;
  updateUserAura(userId: string, aura: number): Promise<User>;
  
  // User activity operations
  getUserLikedPosts(userId: string): Promise<PostWithAuthor[]>;
  getUserEnergyGivenPosts(userId: string): Promise<PostWithAuthor[]>;
  getUserVotedPosts(userId: string): Promise<PostWithAuthor[]>;
  getUserCommentedPosts(userId: string): Promise<PostWithAuthor[]>;
  getUserSpiritualPosts(userId: string): Promise<PostWithAuthor[]>;
  
  // Post operations
  createPost(post: InsertPost, authorId: string): Promise<Post>;
  getPost(id: string): Promise<PostWithAuthor | undefined>;
  getPosts(limit?: number, offset?: number): Promise<PostWithAuthor[]>;
  getPostsByType(type: string, limit?: number, offset?: number): Promise<PostWithAuthor[]>;
  getUserPosts(userId: string, limit?: number): Promise<PostWithAuthor[]>;
  updatePostChakra(postId: string, chakra: ChakraType): Promise<Post>;
  updatePostSpiritual(postId: string, authorId: string, isSpiritual: boolean): Promise<void>;
  
  // Search operations
  searchPosts(query: string, limit?: number): Promise<PostWithAuthor[]>;
  searchUsers(query: string, limit?: number): Promise<User[]>;
  
  // Engagement operations
  createEngagement(engagement: InsertEngagement, userId: string): Promise<Engagement>;
  removeEngagement(postId: string, userId: string, type: EngagementType): Promise<void>;
  getPostEngagements(postId: string): Promise<{ [key in EngagementType]: number }>;
  getUserEngagement(postId: string, userId: string): Promise<Engagement[]>;
  
  // Comment operations
  createComment(comment: InsertComment, authorId: string): Promise<CommentWithAuthor>;
  getPostComments(postId: string): Promise<CommentWithAuthor[]>;
  
  // Spiritual operations
  createReading(reading: InsertReading, userId: string): Promise<SpiritualReading>;
  getUserDailyReading(userId: string): Promise<SpiritualReading | undefined>;
  
  // Notification operations
  createNotification(notification: InsertNotification, userId: string): Promise<Notification>;
  getUserNotifications(userId: string, limit?: number): Promise<NotificationWithTriggerUser[]>;
  markNotificationAsRead(notificationId: string, userId: string): Promise<void>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
  getUnreadNotificationCount(userId: string): Promise<number>;

  // Stats operations
  getUserStats(userId: string): Promise<{
    totalPosts: number;
    totalEngagements: number;
    positiveEnergy: number;
    auraLevel: number;
  }>;

  // Spirits
  createSpirit(userId: string, spiritData: { name: string; description: string; element: string; imageUrl?: string; questionnaire: any; level?: number; experience?: number }): Promise<any>;
  getUserSpirit(userId: string): Promise<any | null>;
  deleteUserSpirit(userId: string): Promise<void>;
  updateSpiritLevel(spiritId: string, level: number, experience: number): Promise<any>;
  updateSpiritImage(userId: string, imageUrl: string): Promise<any>;
  updateSpiritEvolution(spiritId: string, evolution: any[]): Promise<any>;

  // Connections  
  createConnection(requesterId: string, receiverId: string): Promise<any>;
  updateConnection(connectionId: string, userId: string, status: 'accepted' | 'declined'): Promise<any>;
  getUserConnections(userId: string): Promise<any[]>;

  // Starmap operations
  getStarmapUsers(filters?: {
    chakra?: string;
    minAura?: number;
    maxAura?: number;
    minEnergy?: number;
    maxEnergy?: number;
    astrologySign?: string;
  }): Promise<Array<{
    id: string;
    username: string | null;
    profileImageUrl: string | null;
    aura: number | null;
    energy: number | null;
    astrologySign: string | null;
    connections: Array<{ id: string; username: string | null; bondLevel: number }>;
    dominantChakra?: string;
    postCount: number;
  }>>;

  // Bookmark operations
  addBookmark(userId: string, postId: string): Promise<void>;
  removeBookmark(userId: string, postId: string): Promise<void>;
  getUserBookmarks(userId: string): Promise<string[]>;
  
  // Newsletter subscription operations
  createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
  getNewsletterSubscription(email: string): Promise<NewsletterSubscription | undefined>;
  getNewsletterSubscriptionByToken(token: string): Promise<NewsletterSubscription | undefined>;
  unsubscribeNewsletter(token: string): Promise<void>;
  updateNewsletterPreferences(token: string, preferences: Record<string, any>): Promise<NewsletterSubscription>;
  getActiveNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;
  updateNewsletterLastEmailSent(email: string): Promise<void>;

  // Report operations
  createReport(report: InsertReport, reporterId: string): Promise<Report>;
  getReport(id: string): Promise<Report | undefined>;
  getUserReports(reporterId: string): Promise<Report[]>;
  getPendingReports(): Promise<Report[]>;
  getReports(): Promise<any[]>;
  updateReport(reportId: string, updates: { status?: string; moderatorNotes?: string; reviewedAt?: Date; reviewedBy?: string }): Promise<void>;

  // User moderation operations
  banUser(userId: string, banReason: string, bannedBy: string, banExpiresAt?: Date, ipAddress?: string, userAgent?: string): Promise<User>;
  unbanUser(userId: string, unbannedBy: string, reason: string, ipAddress?: string, userAgent?: string): Promise<User>;
  suspendUser(userId: string, suspensionReason: string, suspendedBy: string, suspensionExpiresAt: Date, ipAddress?: string, userAgent?: string): Promise<User>;
  unsuspendUser(userId: string, unsuspendedBy: string, reason: string, ipAddress?: string, userAgent?: string): Promise<User>;
  warnUser(userId: string, warnedBy: string, reason: string, ipAddress?: string, userAgent?: string): Promise<User>;
  updateUserRole(userId: string, newRole: UserRole, changedBy: string, reason: string, ipAddress?: string, userAgent?: string): Promise<User>;
  
  // User filtering and search operations
  searchUsersWithFilters(filters: {
    query?: string;
    role?: UserRole;
    isBanned?: boolean;
    isSuspended?: boolean;
    minWarningCount?: number;
    createdAfter?: Date;
    createdBefore?: Date;
    limit?: number;
    offset?: number;
  }): Promise<User[]>;
  getUsersForModeration(filters?: {
    status?: 'active' | 'banned' | 'suspended';
    role?: UserRole;
    limit?: number;
    offset?: number;
  }): Promise<User[]>;
  
  // Audit log operations
  createAuditLog(auditLog: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(filters?: {
    action?: AuditAction;
    performedBy?: string;
    targetUserId?: string;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]>;
  getUserAuditHistory(userId: string, limit?: number): Promise<AuditLog[]>;
  
  // User status checks
  isUserBanned(userId: string): Promise<boolean>;
  isUserSuspended(userId: string): Promise<boolean>;
  checkUserModerationStatus(userId: string): Promise<{
    isBanned: boolean;
    isSuspended: boolean;
    banReason?: string;
    suspensionReason?: string;
    banExpiresAt?: Date;
    suspensionExpiresAt?: Date;
    warningCount: number;
  }>;

  // Admin analytics operations
  getUserCount(): Promise<number>;
  getNewUsersCount(days: number): Promise<number>;
  getPremiumUsersCount(): Promise<number>;
  getActiveUsersCount(days: number): Promise<number>;
  getPostsCount(): Promise<number>;
  getEngagementsCount(): Promise<number>;
  getOracleReadingsCount(): Promise<number>;
  getChakraDistribution(): Promise<{ chakra: string; count: number; percentage: number }[]>;
  getEngagementTypesDistribution(): Promise<{ type: string; count: number; percentage: number }[]>;
  getDailySignups(days: number): Promise<{ date: string; count: number }[]>;
  getRecentActivity(limit: number): Promise<{ type: string; description: string; timestamp: string; userId: string; userEmail: string }[]>;

  // Webhook event operations
  createWebhookEvent(webhookEvent: InsertWebhookEvent): Promise<WebhookEvent>;
  updateWebhookEventStatus(eventId: string, status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'retry', errorMessage?: string): Promise<void>;

  // Entitlement operations
  createEntitlement(entitlement: InsertEntitlement): Promise<Entitlement>;
  updateEntitlement(userId: string, entitlementId: string, updates: Partial<Entitlement>): Promise<void>;
  getUserEntitlements(userId: string): Promise<Entitlement[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Note: Now using Replit Auth - no external auth ID needed
    
    // Check if user exists by email
    if (userData.email) {
      const [existingByEmail] = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email));
      
      if (existingByEmail) {
        // Update existing user, add WorkOS ID
        const { id, ...updateData } = userData as any;
        const [user] = await db
          .update(users)
          .set({ ...updateData, updatedAt: new Date() })
          .where(eq(users.id, existingByEmail.id))
          .returning();
        return user;
      }
    }
    
    // User doesn't exist, create new one (exclude id from insert)
    try {
      const { id, ...insertData } = userData as any;
      const [user] = await db
        .insert(users)
        .values(insertData)
        .returning();
      return user;
    } catch (error: any) {
      console.error('Database insert error:', error);
      throw error;
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserSigil(userId: string, sigil: string, sigilImageUrl?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ sigil, sigilImageUrl, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserEnergy(userId: string, energy: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ energy, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserAura(userId: string, aura: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ aura, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }


  // Post operations
  async createPost(post: InsertPost, authorId: string): Promise<Post> {
    const [newPost] = await db
      .insert(posts)
      .values({ 
        content: post.content,
        imageUrl: post.imageUrl,
        imageUrls: post.imageUrls,
        videoUrl: post.videoUrl,
        type: post.type,
        isPremium: post.isPremium,
        authorId: authorId,
        chakra: 'root' as const
      })
      .returning();
    return newPost;
  }

  async getPost(id: string): Promise<PostWithAuthor | undefined> {
    const [post] = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        imageUrls: posts.imageUrls,
        videoUrl: posts.videoUrl,
        cloudflareVideoId: posts.cloudflareVideoId,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isPremium: posts.isPremium,
        isSpiritual: posts.isSpiritual,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: users,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, id));
    return post;
  }

  async getPosts(limit = 20, offset = 0): Promise<PostWithAuthor[]> {
    const result = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        imageUrls: posts.imageUrls,
        videoUrl: posts.videoUrl,
        cloudflareVideoId: posts.cloudflareVideoId,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isPremium: posts.isPremium,
        isSpiritual: posts.isSpiritual,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: users,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);
    return result;
  }

  async getPostsByType(type: string, limit = 20, offset = 0): Promise<PostWithAuthor[]> {
    const result = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        imageUrls: posts.imageUrls,
        videoUrl: posts.videoUrl,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isPremium: posts.isPremium,
        isSpiritual: posts.isSpiritual,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: users,
        cloudflareVideoId: posts.cloudflareVideoId,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.type, type))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);
    return result;
  }

  async getUserPosts(userId: string, limit = 20): Promise<PostWithAuthor[]> {
    const result = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        imageUrls: posts.imageUrls,
        videoUrl: posts.videoUrl,
        cloudflareVideoId: posts.cloudflareVideoId,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isPremium: posts.isPremium,
        isSpiritual: posts.isSpiritual,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: users,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.authorId, userId))
      .orderBy(desc(posts.createdAt))
      .limit(limit);
    return result;
  }

  async searchPosts(query: string, limit = 10): Promise<PostWithAuthor[]> {
    const result = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        imageUrls: posts.imageUrls,
        videoUrl: posts.videoUrl,
        cloudflareVideoId: posts.cloudflareVideoId,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isPremium: posts.isPremium,
        isSpiritual: posts.isSpiritual,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: users,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(ilike(posts.content, `%${query.replace(/[%_\\]/g, '\\$&')}%`))
      .orderBy(desc(posts.createdAt))
      .limit(limit);
    return result;
  }

  async searchUsers(query: string, limit = 10): Promise<User[]> {
    const result = await db
      .select()
      .from(users)
      .where(
        or(
          ilike(users.username, `%${query.replace(/[%_\\]/g, '\\$&')}%`),
          ilike(users.email, `%${query.replace(/[%_\\]/g, '\\$&')}%`)
        )
      )
      .orderBy(desc(users.createdAt))
      .limit(limit);
    return result;
  }

  async getRandomPosts(limit = 5, excludeUserId?: string): Promise<PostWithAuthor[]> {
    const query = db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        imageUrls: posts.imageUrls,
        videoUrl: posts.videoUrl,
        cloudflareVideoId: posts.cloudflareVideoId,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isPremium: posts.isPremium,
        isSpiritual: posts.isSpiritual,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: users,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .orderBy(sql`RANDOM()`)
      .limit(limit);

    if (excludeUserId) {
      query.where(ne(posts.authorId, excludeUserId));
    }

    const result = await query;
    return result;
  }


  async updatePostChakra(postId: string, chakra: ChakraType): Promise<Post> {
    const [post] = await db
      .update(posts)
      .set({ chakra, updatedAt: new Date() })
      .where(eq(posts.id, postId))
      .returning();
    return post;
  }

  async updatePostSpiritual(postId: string, authorId: string, isSpiritual: boolean): Promise<void> {
    // Verify the user is the author of the post
    const post = await this.getPost(postId);
    if (!post || post.author.id !== authorId) {
      throw new Error("Only the author can update the spiritual status of their post");
    }

    await db
      .update(posts)
      .set({ isSpiritual, updatedAt: new Date() })
      .where(eq(posts.id, postId));
  }

  // Engagement operations
  async createEngagement(engagement: InsertEngagement, userId: string, energyAmount?: number): Promise<Engagement> {
    // For energy transfers, check if one already exists and prevent duplicates
    if (engagement.type === 'energy') {
      const existingEnergyEngagement = await db
        .select()
        .from(postEngagements)
        .where(
          and(
            eq(postEngagements.postId, engagement.postId),
            eq(postEngagements.userId, userId),
            eq(postEngagements.type, 'energy')
          )
        )
        .limit(1);
      
      if (existingEnergyEngagement.length > 0) {
        throw new Error("You have already transferred energy to this post.");
      }
    } else {
      // Remove existing engagement of same type if exists (for non-energy types)
      await db
        .delete(postEngagements)
        .where(
          and(
            eq(postEngagements.postId, engagement.postId),
            eq(postEngagements.userId, userId),
            eq(postEngagements.type, engagement.type)
          )
        );
    }

    // Handle energy deduction for energy type
    if (engagement.type === 'energy') {
      const user = await this.getUser(userId);
      const requiredEnergy = energyAmount || 10;
      
      if (!user || (user.energy || 0) < requiredEnergy) {
        throw new Error(`Insufficient energy. You have ${user?.energy || 0} energy but need ${requiredEnergy}.`);
      }
      
      // Ensure energy amount is within valid range
      if (requiredEnergy < 1 || requiredEnergy > 50) {
        throw new Error("Energy amount must be between 1 and 50 points.");
      }
      
      await this.updateUserEnergy(userId, (user.energy || 0) - requiredEnergy);
    }

    // Handle mutual exclusion for upvote/downvote
    if (engagement.type === 'upvote') {
      await db
        .delete(postEngagements)
        .where(
          and(
            eq(postEngagements.postId, engagement.postId),
            eq(postEngagements.userId, userId),
            eq(postEngagements.type, 'downvote')
          )
        );
    } else if (engagement.type === 'downvote') {
      await db
        .delete(postEngagements)
        .where(
          and(
            eq(postEngagements.postId, engagement.postId),
            eq(postEngagements.userId, userId),
            eq(postEngagements.type, 'upvote')
          )
        );
    }

    const [newEngagement] = await db
      .insert(postEngagements)
      .values({ 
        ...engagement, 
        userId,
        energyAmount: engagement.type === 'energy' ? (energyAmount || 10) : 1
      })
      .returning();

    // Update post frequency
    await this.updatePostFrequency(engagement.postId);
    
    return newEngagement;
  }

  async removeEngagement(postId: string, userId: string, type: EngagementType): Promise<void> {
    // Prevent removal of energy engagements - they are permanent once transferred
    if (type === 'energy') {
      throw new Error("Energy transfers cannot be reversed. They are permanent spiritual commitments.");
    }

    await db
      .delete(postEngagements)
      .where(
        and(
          eq(postEngagements.postId, postId),
          eq(postEngagements.userId, userId),
          eq(postEngagements.type, type)
        )
      );

    // Update post frequency
    await this.updatePostFrequency(postId);
  }

  async getPostEngagements(postId: string): Promise<{ [key in EngagementType]: number } & { comments: number }> {
    // Optimized: Get all engagement data in a single query using conditional aggregation
    const [engagementData] = await db
      .select({
        upvoteCount: sql<number>`COUNT(CASE WHEN ${postEngagements.type} = 'upvote' THEN 1 END)`,
        downvoteCount: sql<number>`COUNT(CASE WHEN ${postEngagements.type} = 'downvote' THEN 1 END)`,
        likeCount: sql<number>`COUNT(CASE WHEN ${postEngagements.type} = 'like' THEN 1 END)`,
        totalEnergy: sql<number>`COALESCE(SUM(CASE WHEN ${postEngagements.type} = 'energy' THEN ${postEngagements.energyAmount} ELSE 0 END), 0)`,
      })
      .from(postEngagements)
      .where(eq(postEngagements.postId, postId));

    // Get comment count in parallel (can't be combined with above due to different table)
    const [{ count: commentCount }] = await db
      .select({ count: count() })
      .from(comments)
      .where(eq(comments.postId, postId));

    return {
      upvote: engagementData?.upvoteCount || 0,
      downvote: engagementData?.downvoteCount || 0,
      like: engagementData?.likeCount || 0,
      energy: engagementData?.totalEnergy || 0,
      comments: commentCount || 0,
    };
  }

  async getUserEngagement(postId: string, userId: string): Promise<Engagement[]> {
    return await db
      .select()
      .from(postEngagements)
      .where(
        and(
          eq(postEngagements.postId, postId),
          eq(postEngagements.userId, userId)
        )
      );
  }

  private async updatePostFrequency(postId: string): Promise<void> {
    // Optimized: Calculate frequency directly in database without multiple queries
    const [engagementData] = await db
      .select({
        upvoteCount: sql<number>`COUNT(CASE WHEN ${postEngagements.type} = 'upvote' THEN 1 END)`,
        downvoteCount: sql<number>`COUNT(CASE WHEN ${postEngagements.type} = 'downvote' THEN 1 END)`,
        likeCount: sql<number>`COUNT(CASE WHEN ${postEngagements.type} = 'like' THEN 1 END)`,
        totalEnergy: sql<number>`COALESCE(SUM(CASE WHEN ${postEngagements.type} = 'energy' THEN ${postEngagements.energyAmount} ELSE 0 END), 0)`,
      })
      .from(postEngagements)
      .where(eq(postEngagements.postId, postId));
    
    const frequency = (engagementData?.upvoteCount || 0) - (engagementData?.downvoteCount || 0) + 
                     (engagementData?.likeCount || 0) + Math.floor((engagementData?.totalEnergy || 0) * 0.2);
    
    await db
      .update(posts)
      .set({ frequency })
      .where(eq(posts.id, postId));
  }

  // Comment operations
  async createComment(comment: InsertComment, authorId: string): Promise<CommentWithAuthor> {
    const [newComment] = await db
      .insert(comments)
      .values({ ...comment, authorId })
      .returning();

    const [commentWithAuthor] = await db
      .select({
        id: comments.id,
        postId: comments.postId,
        authorId: comments.authorId,
        content: comments.content,
        createdAt: comments.createdAt,
        author: users,
      })
      .from(comments)
      .innerJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.id, newComment.id));

    return commentWithAuthor;
  }

  async getPostComments(postId: string): Promise<CommentWithAuthor[]> {
    return await db
      .select({
        id: comments.id,
        postId: comments.postId,
        authorId: comments.authorId,
        content: comments.content,
        createdAt: comments.createdAt,
        author: users,
      })
      .from(comments)
      .innerJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(comments.createdAt);
  }

  // Spiritual operations
  async createReading(reading: InsertReading, userId: string): Promise<SpiritualReading> {
    const [newReading] = await db
      .insert(spiritualReadings)
      .values({ ...reading, userId })
      .returning();
    return newReading;
  }

  async getUserDailyReading(userId: string): Promise<SpiritualReading | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [reading] = await db
      .select()
      .from(spiritualReadings)
      .where(
        and(
          eq(spiritualReadings.userId, userId),
          eq(spiritualReadings.type, "daily"),
          gte(spiritualReadings.createdAt, today)
        )
      )
      .limit(1);
    
    return reading;
  }

  // Notification operations
  async createNotification(notification: InsertNotification, userId: string): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values({ ...notification, userId })
      .returning();
    return newNotification;
  }

  async getUserNotifications(userId: string, limit = 20): Promise<NotificationWithTriggerUser[]> {
    const result = await db
      .select({
        id: notifications.id,
        userId: notifications.userId,
        type: notifications.type,
        title: notifications.title,
        message: notifications.message,
        isRead: notifications.isRead,
        relatedId: notifications.relatedId,
        relatedType: notifications.relatedType,
        triggerUserId: notifications.triggerUserId,
        createdAt: notifications.createdAt,
        triggerUser: users,
      })
      .from(notifications)
      .leftJoin(users, eq(notifications.triggerUserId, users.id))
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
    return result.map(item => ({
      ...item,
      triggerUser: item.triggerUser || undefined
    }));
  }

  async markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, userId)
        )
      );
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId));
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false)
        )
      );
    return result.count;
  }

  // Stats operations
  async getUserStats(userId: string): Promise<{
    totalPosts: number;
    totalEngagements: number;
    positiveEnergy: number;
    auraLevel: number;
  }> {
    const [postCount] = await db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.authorId, userId));

    const [engagementCount] = await db
      .select({ count: count() })
      .from(postEngagements)
      .where(eq(postEngagements.userId, userId));

    const user = await this.getUser(userId);
    
    return {
      totalPosts: postCount.count,
      totalEngagements: engagementCount.count,
      positiveEnergy: user?.aura || 0,
      auraLevel: Math.floor((user?.aura || 0) / 1000) + 1,
    };
  }

  // Spirit operations
  async createSpirit(userId: string, spiritData: { name: string; description: string; element: string; imageUrl?: string; questionnaire: any; level?: number; experience?: number }): Promise<any> {
    const [spirit] = await db
      .insert(spirits)
      .values({
        userId,
        name: spiritData.name,
        description: spiritData.description,
        element: spiritData.element as 'fire' | 'water' | 'earth' | 'air',
        imageUrl: spiritData.imageUrl,
        questionnaire: spiritData.questionnaire,
        level: spiritData.level || 1,
        experience: spiritData.experience || 0,
      })
      .returning();
    return spirit;
  }

  async getUserSpirit(userId: string): Promise<any | null> {
    const [spirit] = await db
      .select()
      .from(spirits)
      .where(eq(spirits.userId, userId));
    return spirit || null;
  }

  async deleteUserSpirit(userId: string): Promise<void> {
    await db
      .delete(spirits)
      .where(eq(spirits.userId, userId));
  }

  async updateSpiritExperience(userId: string, experienceGain: number, action: string): Promise<any | null> {
    // Get current spirit
    const currentSpirit = await this.getUserSpirit(userId);
    if (!currentSpirit) return null;

    const newExperience = currentSpirit.experience + experienceGain;
    const newLevel = Math.floor(newExperience / 100) + 1; // Level up every 100 XP
    const hasLeveledUp = newLevel > currentSpirit.level;
    
    // Create evolution entry
    const evolutionEntry = {
      timestamp: new Date().toISOString(),
      action: action,
      experienceGain: experienceGain,
      newExperience: newExperience,
      newLevel: newLevel,
      leveledUp: hasLeveledUp
    };

    // Update evolution history
    const newEvolution = [...(currentSpirit.evolution || []), evolutionEntry];

    const [updatedSpirit] = await db
      .update(spirits)
      .set({ 
        experience: newExperience,
        level: newLevel,
        evolution: newEvolution,
        updatedAt: new Date()
      })
      .where(eq(spirits.userId, userId))
      .returning();

    return updatedSpirit;
  }

  async getSpiritLevel(userId: string): Promise<number> {
    const spirit = await this.getUserSpirit(userId);
    return spirit?.level || 1;
  }

  async updateSpiritLevel(spiritId: string, level: number, experience: number): Promise<any> {
    const [spirit] = await db
      .update(spirits)
      .set({ level, experience, updatedAt: new Date() })
      .where(eq(spirits.id, spiritId))
      .returning();
    return spirit;
  }

  async updateSpiritImage(userId: string, imageUrl: string): Promise<any> {
    const [spirit] = await db
      .update(spirits)
      .set({ imageUrl, updatedAt: new Date() })
      .where(eq(spirits.userId, userId))
      .returning();
    return spirit;
  }

  async updateSpiritEvolution(spiritId: string, evolution: any[]): Promise<any> {
    const [spirit] = await db
      .update(spirits)
      .set({ evolution, updatedAt: new Date() })
      .where(eq(spirits.id, spiritId))
      .returning();
    return spirit;
  }

  // Connection operations
  async createConnection(requesterId: string, receiverId: string): Promise<any> {
    const [connection] = await db
      .insert(connections)
      .values({
        requesterId,
        receiverId,
        status: 'pending',
      })
      .returning();
    return connection;
  }

  async updateConnection(connectionId: string, userId: string, status: 'accepted' | 'declined'): Promise<any> {
    const [connection] = await db
      .update(connections)
      .set({ status, updatedAt: new Date() })
      .where(
        and(
          eq(connections.id, connectionId),
          eq(connections.receiverId, userId)
        )
      )
      .returning();
    return connection;
  }

  async getUserConnections(userId: string): Promise<any[]> {
    const userConnections = await db
      .select()
      .from(connections)
      .where(
        or(
          eq(connections.requesterId, userId),
          eq(connections.receiverId, userId)
        )
      );
    return userConnections;
  }

  async getStarmapUsers(filters?: {
    chakra?: string;
    minAura?: number;
    maxAura?: number;
    minEnergy?: number;
    maxEnergy?: number;
    astrologySign?: string;
  }): Promise<Array<{
    id: string;
    username: string | null;
    profileImageUrl: string | null;
    aura: number | null;
    energy: number | null;
    astrologySign: string | null;
    connections: Array<{ id: string; username: string | null; bondLevel: number }>;
    dominantChakra?: string;
    postCount: number;
  }>> {
    try {
      // Build base query with user data
      const query = db
        .select({
          id: users.id,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          aura: users.aura,
          energy: users.energy,
          astrologySign: users.astrologySign,
        })
        .from(users);

      // Apply filters if provided
      const conditions = [];
      if (filters?.minAura) {
        conditions.push(gte(users.aura, filters.minAura));
      }
      if (filters?.maxAura) {
        conditions.push(lte(users.aura, filters.maxAura));
      }
      if (filters?.minEnergy) {
        conditions.push(gte(users.energy, filters.minEnergy));
      }
      if (filters?.maxEnergy) {
        conditions.push(lte(users.energy, filters.maxEnergy));
      }
      if (filters?.astrologySign) {
        conditions.push(eq(users.astrologySign, filters.astrologySign));
      }

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      const baseUsers = await query;

      // Enrich user data with connections and dominant chakra
      const enrichedUsers = await Promise.all(
        baseUsers.map(async (user) => {
          // Get user connections
          const userConnections = await db
            .select({
              id: users.id,
              username: users.username,
              bondLevel: connections.bondLevel,
            })
            .from(connections)
            .innerJoin(users, 
              or(
                and(eq(connections.requesterId, user.id), eq(users.id, connections.receiverId)),
                and(eq(connections.receiverId, user.id), eq(users.id, connections.requesterId))
              )
            )
            .where(
              and(
                or(
                  eq(connections.requesterId, user.id),
                  eq(connections.receiverId, user.id)
                ),
                eq(connections.status, 'accepted')
              )
            );

          // Get dominant chakra from user's posts
          const chakraStats = await db
            .select({
              chakra: posts.chakra,
              count: count(posts.id)
            })
            .from(posts)
            .where(eq(posts.authorId, user.id))
            .groupBy(posts.chakra)
            .orderBy(desc(count(posts.id)))
            .limit(1);

          // Get total post count
          const [postCountResult] = await db
            .select({ count: count(posts.id) })
            .from(posts)
            .where(eq(posts.authorId, user.id));

          const dominantChakra = chakraStats[0]?.chakra;
          const postCount = postCountResult?.count || 0;

          // Apply chakra filter if specified
          if (filters?.chakra && dominantChakra !== filters.chakra) {
            return null;
          }

          return {
            ...user,
            connections: userConnections.map(conn => ({
              id: conn.id,
              username: conn.username,
              bondLevel: conn.bondLevel || 0
            })),
            dominantChakra,
            postCount
          };
        })
      );

      // Filter out null entries (filtered by chakra)
      return enrichedUsers.filter(user => user !== null) as any[];
    } catch (error) {
      console.error('Error getting starmap users:', error);
      throw error;
    }
  }

  // Bookmark operations
  async addBookmark(userId: string, postId: string): Promise<void> {
    await db
      .insert(bookmarks)
      .values({ userId, postId })
      .onConflictDoNothing();
  }

  async removeBookmark(userId: string, postId: string): Promise<void> {
    await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.postId, postId)));
  }

  async getUserBookmarks(userId: string): Promise<string[]> {
    const userBookmarks = await db
      .select({ postId: bookmarks.postId })
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId));
    
    return userBookmarks.map(b => b.postId);
  }

  // Spiritual mark operations
  async toggleSpiritualMark(userId: string, postId: string): Promise<{ marked: boolean; count: number }> {
    // Check if user has already marked this post
    const existing = await db
      .select()
      .from(spiritualMarks)
      .where(and(eq(spiritualMarks.userId, userId), eq(spiritualMarks.postId, postId)))
      .limit(1);

    let marked: boolean;
    if (existing.length > 0) {
      // Remove the mark
      await db
        .delete(spiritualMarks)
        .where(and(eq(spiritualMarks.userId, userId), eq(spiritualMarks.postId, postId)));
      marked = false;
    } else {
      // Add the mark
      await db
        .insert(spiritualMarks)
        .values({ userId, postId });
      marked = true;
    }

    // Get updated count
    const [countResult] = await db
      .select({ count: count() })
      .from(spiritualMarks)
      .where(eq(spiritualMarks.postId, postId));

    return {
      marked,
      count: countResult?.count || 0
    };
  }

  async getSpiritualMarkStatus(userId: string, postId: string): Promise<{ marked: boolean; count: number }> {
    // Check if user has marked this post
    const existing = await db
      .select()
      .from(spiritualMarks)
      .where(and(eq(spiritualMarks.userId, userId), eq(spiritualMarks.postId, postId)))
      .limit(1);

    // Get total count for this post
    const [countResult] = await db
      .select({ count: count() })
      .from(spiritualMarks)
      .where(eq(spiritualMarks.postId, postId));

    return {
      marked: existing.length > 0,
      count: countResult?.count || 0
    };
  }

  async getSpiritualCountForPosts(postIds: string[]): Promise<Record<string, number>> {
    if (postIds.length === 0) return {};
    
    const results = await db
      .select({
        postId: spiritualMarks.postId,
        count: count()
      })
      .from(spiritualMarks)
      .where(inArray(spiritualMarks.postId, postIds))
      .groupBy(spiritualMarks.postId);

    const countMap: Record<string, number> = {};
    for (const result of results) {
      countMap[result.postId] = result.count;
    }
    
    return countMap;
  }

  // User activity methods
  async getUserLikedPosts(userId: string): Promise<PostWithAuthor[]> {
    const result = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        imageUrls: posts.imageUrls,
        videoUrl: posts.videoUrl,
        cloudflareVideoId: posts.cloudflareVideoId,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isPremium: posts.isPremium,
        isSpiritual: posts.isSpiritual,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: users,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(postEngagements, eq(posts.id, postEngagements.postId))
      .where(
        and(
          eq(postEngagements.userId, userId),
          eq(postEngagements.type, 'like')
        )
      )
      .orderBy(desc(postEngagements.createdAt))
      .limit(50);

    return result;
  }

  async getUserEnergyGivenPosts(userId: string): Promise<PostWithAuthor[]> {
    const result = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        imageUrls: posts.imageUrls,
        videoUrl: posts.videoUrl,
        cloudflareVideoId: posts.cloudflareVideoId,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isPremium: posts.isPremium,
        isSpiritual: posts.isSpiritual,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: users,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(postEngagements, eq(posts.id, postEngagements.postId))
      .where(
        and(
          eq(postEngagements.userId, userId),
          eq(postEngagements.type, 'energy')
        )
      )
      .orderBy(desc(postEngagements.createdAt))
      .limit(50);

    return result;
  }

  async getUserVotedPosts(userId: string): Promise<PostWithAuthor[]> {
    const result = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        imageUrls: posts.imageUrls,
        videoUrl: posts.videoUrl,
        cloudflareVideoId: posts.cloudflareVideoId,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isPremium: posts.isPremium,
        isSpiritual: posts.isSpiritual,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: users,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(postEngagements, eq(posts.id, postEngagements.postId))
      .where(
        and(
          eq(postEngagements.userId, userId),
          or(
            eq(postEngagements.type, 'upvote'),
            eq(postEngagements.type, 'downvote')
          )
        )
      )
      .orderBy(desc(postEngagements.createdAt))
      .limit(50);

    return result;
  }

  async getUserCommentedPosts(userId: string): Promise<PostWithAuthor[]> {
    const result = await db
      .selectDistinct({
        id: posts.id,
        authorId: posts.authorId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        imageUrls: posts.imageUrls,
        videoUrl: posts.videoUrl,
        cloudflareVideoId: posts.cloudflareVideoId,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isPremium: posts.isPremium,
        isSpiritual: posts.isSpiritual,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        commentCreatedAt: comments.createdAt,
        author: users,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(comments, eq(posts.id, comments.postId))
      .where(eq(comments.authorId, userId))
      .orderBy(desc(sql`${comments.createdAt}`))
      .limit(50);

    return result;
  }

  async getUserSpiritualPosts(userId: string): Promise<PostWithAuthor[]> {
    const result = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        imageUrls: posts.imageUrls,
        videoUrl: posts.videoUrl,
        cloudflareVideoId: posts.cloudflareVideoId,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isPremium: posts.isPremium,
        isSpiritual: posts.isSpiritual,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: users,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(
        and(
          eq(posts.authorId, userId),
          eq(posts.isSpiritual, true)
        )
      )
      .orderBy(desc(posts.createdAt))
      .limit(50);

    return result;
  }

  // Newsletter subscription operations
  async createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const [result] = await db
      .insert(newsletterSubscriptions)
      .values(subscription)
      .returning();
    return result;
  }

  async getNewsletterSubscription(email: string): Promise<NewsletterSubscription | undefined> {
    const result = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, email))
      .limit(1);
    return result[0];
  }

  async getNewsletterSubscriptionByToken(token: string): Promise<NewsletterSubscription | undefined> {
    const result = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.unsubscribeToken, token))
      .limit(1);
    return result[0];
  }

  async unsubscribeNewsletter(token: string): Promise<void> {
    await db
      .update(newsletterSubscriptions)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(newsletterSubscriptions.unsubscribeToken, token));
  }

  async updateNewsletterPreferences(token: string, preferences: Record<string, any>): Promise<NewsletterSubscription> {
    const [result] = await db
      .update(newsletterSubscriptions)
      .set({ preferences, updatedAt: new Date() })
      .where(eq(newsletterSubscriptions.unsubscribeToken, token))
      .returning();
    return result;
  }

  async getActiveNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    const result = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.isActive, true))
      .orderBy(desc(newsletterSubscriptions.subscriptionDate));
    return result;
  }

  async updateNewsletterLastEmailSent(email: string): Promise<void> {
    await db
      .update(newsletterSubscriptions)
      .set({ lastEmailSent: new Date(), updatedAt: new Date() })
      .where(eq(newsletterSubscriptions.email, email));
  }

  // Report operations
  async createReport(report: InsertReport, reporterId: string): Promise<Report> {
    // Validate that either postId or reportedUserId is provided, but not both
    if ((report.postId && report.reportedUserId) || (!report.postId && !report.reportedUserId)) {
      throw new Error("Must report either a post OR a user, not both or neither");
    }

    const [newReport] = await db
      .insert(reports)
      .values({
        ...report,
        reporterId,
      })
      .returning();

    return newReport;
  }

  async getReport(id: string): Promise<Report | undefined> {
    const [report] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, id));
    return report;
  }

  async getUserReports(reporterId: string): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.reporterId, reporterId))
      .orderBy(desc(reports.createdAt));
  }

  async getPendingReports(): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.status, 'pending'))
      .orderBy(desc(reports.createdAt));
  }

  async getReports(): Promise<any[]> {
    const result = await db
      .select({
        id: reports.id,
        type: reports.type,
        reason: reports.reason,
        status: reports.status,
        postId: reports.postId,
        reportedUserId: reports.reportedUserId,
        moderatorNotes: reports.moderatorNotes,
        reviewedAt: reports.reviewedAt,
        reviewedBy: reports.reviewedBy,
        createdAt: reports.createdAt,
        updatedAt: reports.updatedAt,
        reporter: users,
      })
      .from(reports)
      .innerJoin(users, eq(reports.reporterId, users.id))
      .orderBy(desc(reports.createdAt));

    // Fetch additional data for reports
    const enrichedReports = await Promise.all(
      result.map(async (report) => {
        let reportedUser = null;
        let post = null;

        if (report.reportedUserId) {
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, report.reportedUserId));
          reportedUser = user;
        }

        if (report.postId) {
          const [postData] = await db
            .select({
              id: posts.id,
              content: posts.content,
              author: users,
            })
            .from(posts)
            .innerJoin(users, eq(posts.authorId, users.id))
            .where(eq(posts.id, report.postId));
          post = postData;
        }

        return {
          ...report,
          reportedUser,
          post,
        };
      })
    );

    return enrichedReports;
  }

  async updateReport(reportId: string, updates: { status?: "pending" | "reviewed" | "resolved" | "dismissed"; moderatorNotes?: string; reviewedAt?: Date; reviewedBy?: string }): Promise<void> {
    await db
      .update(reports)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(reports.id, reportId));
  }

  // Admin analytics operations
  async getUserCount(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(users);
    return result.count;
  }

  async getNewUsersCount(days: number): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const [result] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, startDate));
    return result.count;
  }

  async getPremiumUsersCount(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.isPremium, true));
    return result.count;
  }

  async getActiveUsersCount(days: number): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Count users who have created posts or engagements in the last X days
    const [postAuthors] = await db
      .select({ count: count(sql`DISTINCT ${posts.authorId}`) })
      .from(posts)
      .where(gte(posts.createdAt, startDate));
    
    const [engagementUsers] = await db
      .select({ count: count(sql`DISTINCT ${postEngagements.userId}`) })
      .from(postEngagements)
      .where(gte(postEngagements.createdAt, startDate));
    
    // Simple approximation - in a real system, you'd use a more sophisticated query
    return Math.max(postAuthors.count, engagementUsers.count);
  }

  async getPostsCount(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(posts);
    return result.count;
  }

  async getEngagementsCount(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(postEngagements);
    return result.count;
  }

  async getOracleReadingsCount(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(spiritualReadings);
    return result.count;
  }

  async getChakraDistribution(): Promise<{ chakra: string; count: number; percentage: number }[]> {
    const result = await db
      .select({
        chakra: posts.chakra,
        count: count(),
      })
      .from(posts)
      .groupBy(posts.chakra);

    const total = result.reduce((sum, item) => sum + item.count, 0);
    
    return result.map(item => ({
      chakra: item.chakra,
      count: item.count,
      percentage: total > 0 ? (item.count / total) * 100 : 0,
    }));
  }

  async getEngagementTypesDistribution(): Promise<{ type: string; count: number; percentage: number }[]> {
    const result = await db
      .select({
        type: postEngagements.type,
        count: count(),
      })
      .from(postEngagements)
      .groupBy(postEngagements.type);

    const total = result.reduce((sum, item) => sum + item.count, 0);
    
    return result.map(item => ({
      type: item.type,
      count: item.count,
      percentage: total > 0 ? (item.count / total) * 100 : 0,
    }));
  }

  async getDailySignups(days: number): Promise<{ date: string; count: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const result = await db
      .select({
        date: sql`DATE(${users.createdAt})`.as('date'),
        count: count(),
      })
      .from(users)
      .where(gte(users.createdAt, startDate))
      .groupBy(sql`DATE(${users.createdAt})`)
      .orderBy(sql`DATE(${users.createdAt})`);

    return result.map(item => ({
      date: item.date as string,
      count: item.count,
    }));
  }

  async getRecentActivity(limit: number): Promise<{ type: string; description: string; timestamp: string; userId: string; userEmail: string }[]> {
    // Get recent posts
    const recentPosts = await db
      .select({
        type: sql`'post'`.as('type'),
        description: sql`'Created a new post'`.as('description'),
        timestamp: posts.createdAt,
        userId: posts.authorId,
        userEmail: users.email,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .orderBy(desc(posts.createdAt))
      .limit(limit / 2);

    // Get recent engagements
    const recentEngagements = await db
      .select({
        type: postEngagements.type,
        description: sql`CONCAT('User ', ${postEngagements.type}, 'd a post')`.as('description'),
        timestamp: postEngagements.createdAt,
        userId: postEngagements.userId,
        userEmail: users.email,
      })
      .from(postEngagements)
      .innerJoin(users, eq(postEngagements.userId, users.id))
      .orderBy(desc(postEngagements.createdAt))
      .limit(limit / 2);

    // Combine and sort by timestamp
    const allActivity = [...recentPosts, ...recentEngagements];
    allActivity.sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeB - timeA;
    });
    
    return allActivity.slice(0, limit).map(activity => ({
      type: String(activity.type),
      description: String(activity.description),
      timestamp: activity.timestamp ? new Date(activity.timestamp).toISOString() : new Date().toISOString(),
      userId: activity.userId,
      userEmail: activity.userEmail || '',
    }));
  }

  // User moderation operations
  async banUser(userId: string, banReason: string, bannedBy: string, banExpiresAt?: Date, ipAddress?: string, userAgent?: string): Promise<User> {
    const bannedAt = new Date();
    
    const [user] = await db
      .update(users)
      .set({
        isBanned: true,
        banReason,
        bannedAt,
        bannedBy,
        banExpiresAt,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    // Create audit log
    await this.createAuditLog({
      action: "user_banned",
      performedBy: bannedBy,
      targetUserId: userId,
      reason: banReason,
      details: { banExpiresAt: banExpiresAt?.toISOString(), permanent: !banExpiresAt },
      ipAddress,
      userAgent
    });
    
    return user;
  }

  async unbanUser(userId: string, unbannedBy: string, reason: string, ipAddress?: string, userAgent?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        isBanned: false,
        banReason: null,
        bannedAt: null,
        bannedBy: null,
        banExpiresAt: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    // Create audit log
    await this.createAuditLog({
      action: "user_unbanned",
      performedBy: unbannedBy,
      targetUserId: userId,
      reason,
      ipAddress,
      userAgent
    });
    
    return user;
  }

  async suspendUser(userId: string, suspensionReason: string, suspendedBy: string, suspensionExpiresAt: Date, ipAddress?: string, userAgent?: string): Promise<User> {
    const suspendedAt = new Date();
    
    const [user] = await db
      .update(users)
      .set({
        isSuspended: true,
        suspensionReason,
        suspendedAt,
        suspendedBy,
        suspensionExpiresAt,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    // Create audit log
    await this.createAuditLog({
      action: "user_suspended",
      performedBy: suspendedBy,
      targetUserId: userId,
      reason: suspensionReason,
      details: { suspensionExpiresAt: suspensionExpiresAt.toISOString() },
      ipAddress,
      userAgent
    });
    
    return user;
  }

  async unsuspendUser(userId: string, unsuspendedBy: string, reason: string, ipAddress?: string, userAgent?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        isSuspended: false,
        suspensionReason: null,
        suspendedAt: null,
        suspendedBy: null,
        suspensionExpiresAt: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    // Create audit log
    await this.createAuditLog({
      action: "user_unsuspended",
      performedBy: unsuspendedBy,
      targetUserId: userId,
      reason,
      ipAddress,
      userAgent
    });
    
    return user;
  }

  async warnUser(userId: string, warnedBy: string, reason: string, ipAddress?: string, userAgent?: string): Promise<User> {
    const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
    const newWarningCount = (currentUser?.warningCount || 0) + 1;
    
    const [user] = await db
      .update(users)
      .set({
        warningCount: newWarningCount,
        lastWarningAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    // Create audit log
    await this.createAuditLog({
      action: "user_warned",
      performedBy: warnedBy,
      targetUserId: userId,
      reason,
      details: { newWarningCount },
      ipAddress,
      userAgent
    });
    
    return user;
  }

  async updateUserRole(userId: string, newRole: UserRole, changedBy: string, reason: string, ipAddress?: string, userAgent?: string): Promise<User> {
    const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
    const oldRole = currentUser?.role || 'user';
    
    const [user] = await db
      .update(users)
      .set({
        role: newRole,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    // Create audit log
    await this.createAuditLog({
      action: "user_role_changed",
      performedBy: changedBy,
      targetUserId: userId,
      reason,
      oldValue: oldRole,
      newValue: newRole,
      ipAddress,
      userAgent
    });
    
    return user;
  }

  // User filtering and search operations
  async searchUsersWithFilters(filters: {
    query?: string;
    role?: UserRole;
    isBanned?: boolean;
    isSuspended?: boolean;
    minWarningCount?: number;
    createdAfter?: Date;
    createdBefore?: Date;
    limit?: number;
    offset?: number;
  }): Promise<User[]> {
    const conditions = [];
    
    if (filters.query) {
      conditions.push(
        or(
          ilike(users.username, `%${filters.query}%`),
          ilike(users.email, `%${filters.query}%`),
          ilike(users.firstName, `%${filters.query}%`),
          ilike(users.lastName, `%${filters.query}%`)
        )
      );
    }
    
    if (filters.role) {
      conditions.push(eq(users.role, filters.role));
    }
    
    if (filters.isBanned !== undefined) {
      conditions.push(eq(users.isBanned, filters.isBanned));
    }
    
    if (filters.isSuspended !== undefined) {
      conditions.push(eq(users.isSuspended, filters.isSuspended));
    }
    
    if (filters.minWarningCount !== undefined) {
      conditions.push(gte(users.warningCount, filters.minWarningCount));
    }
    
    if (filters.createdAfter) {
      conditions.push(gte(users.createdAt, filters.createdAfter));
    }
    
    if (filters.createdBefore) {
      conditions.push(lte(users.createdAt, filters.createdBefore));
    }
    
    // Build query with all conditions at once
    let baseQuery = db.select().from(users) as any;
    
    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions));
    }
    
    baseQuery = baseQuery.orderBy(desc(users.createdAt));
    
    if (filters.limit !== undefined) {
      baseQuery = baseQuery.limit(filters.limit);
    }
    
    if (filters.offset !== undefined) {
      baseQuery = baseQuery.offset(filters.offset);
    }
    
    return await baseQuery;
  }

  async getUsersForModeration(filters?: {
    status?: 'active' | 'banned' | 'suspended';
    role?: UserRole;
    limit?: number;
    offset?: number;
  }): Promise<User[]> {
    const conditions = [];
    
    if (filters?.status) {
      if (filters.status === 'banned') {
        conditions.push(eq(users.isBanned, true));
      } else if (filters.status === 'suspended') {
        conditions.push(eq(users.isSuspended, true));
      } else if (filters.status === 'active') {
        conditions.push(and(eq(users.isBanned, false), eq(users.isSuspended, false)));
      }
    }
    
    if (filters?.role) {
      conditions.push(eq(users.role, filters.role));
    }
    
    // Build query with all conditions at once
    let baseQuery = db.select().from(users) as any;
    
    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions));
    }
    
    baseQuery = baseQuery.orderBy(desc(users.createdAt));
    
    if (filters?.limit !== undefined) {
      baseQuery = baseQuery.limit(filters.limit);
    }
    
    if (filters?.offset !== undefined) {
      baseQuery = baseQuery.offset(filters.offset);
    }
    
    return await baseQuery;
  }

  // Audit log operations
  async createAuditLog(auditLog: InsertAuditLog): Promise<AuditLog> {
    const [log] = await db
      .insert(auditLogs)
      .values(auditLog)
      .returning();
    return log;
  }

  async getAuditLogs(filters?: {
    action?: AuditAction;
    performedBy?: string;
    targetUserId?: string;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]> {
    const conditions = [];
    
    if (filters?.action) {
      conditions.push(eq(auditLogs.action, filters.action));
    }
    
    if (filters?.performedBy) {
      conditions.push(eq(auditLogs.performedBy, filters.performedBy));
    }
    
    if (filters?.targetUserId) {
      conditions.push(eq(auditLogs.targetUserId, filters.targetUserId));
    }
    
    if (filters?.fromDate) {
      conditions.push(gte(auditLogs.createdAt, filters.fromDate));
    }
    
    if (filters?.toDate) {
      conditions.push(lte(auditLogs.createdAt, filters.toDate));
    }
    
    // Build query with all conditions at once
    let query = db.select().from(auditLogs) as any;
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(auditLogs.createdAt));
    
    if (filters?.limit !== undefined) {
      query = query.limit(filters.limit);
    }
    
    if (filters?.offset !== undefined) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async getUserAuditHistory(userId: string, limit?: number): Promise<AuditLog[]> {
    let query = db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.targetUserId, userId))
      .orderBy(desc(auditLogs.createdAt)) as any;
    
    if (limit !== undefined) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  // User status checks
  async isUserBanned(userId: string): Promise<boolean> {
    const [user] = await db
      .select({ isBanned: users.isBanned, banExpiresAt: users.banExpiresAt })
      .from(users)
      .where(eq(users.id, userId));
    
    if (!user || !user.isBanned) return false;
    
    // Check if ban has expired
    if (user.banExpiresAt && user.banExpiresAt < new Date()) {
      // Automatically unban expired user
      await db
        .update(users)
        .set({
          isBanned: false,
          banReason: null,
          bannedAt: null,
          bannedBy: null,
          banExpiresAt: null,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
      return false;
    }
    
    return true;
  }

  async isUserSuspended(userId: string): Promise<boolean> {
    const [user] = await db
      .select({ isSuspended: users.isSuspended, suspensionExpiresAt: users.suspensionExpiresAt })
      .from(users)
      .where(eq(users.id, userId));
    
    if (!user || !user.isSuspended) return false;
    
    // Check if suspension has expired
    if (user.suspensionExpiresAt && user.suspensionExpiresAt < new Date()) {
      // Automatically unsuspend expired user
      await db
        .update(users)
        .set({
          isSuspended: false,
          suspensionReason: null,
          suspendedAt: null,
          suspendedBy: null,
          suspensionExpiresAt: null,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
      return false;
    }
    
    return true;
  }

  async checkUserModerationStatus(userId: string): Promise<{
    isBanned: boolean;
    isSuspended: boolean;
    banReason?: string;
    suspensionReason?: string;
    banExpiresAt?: Date;
    suspensionExpiresAt?: Date;
    warningCount: number;
  }> {
    const [user] = await db
      .select({
        isBanned: users.isBanned,
        isSuspended: users.isSuspended,
        banReason: users.banReason,
        suspensionReason: users.suspensionReason,
        banExpiresAt: users.banExpiresAt,
        suspensionExpiresAt: users.suspensionExpiresAt,
        warningCount: users.warningCount
      })
      .from(users)
      .where(eq(users.id, userId));
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check for expired bans/suspensions
    const isBanned = await this.isUserBanned(userId);
    const isSuspended = await this.isUserSuspended(userId);
    
    return {
      isBanned,
      isSuspended,
      banReason: user.banReason || undefined,
      suspensionReason: user.suspensionReason || undefined,
      banExpiresAt: user.banExpiresAt || undefined,
      suspensionExpiresAt: user.suspensionExpiresAt || undefined,
      warningCount: user.warningCount || 0
    };
  }

  // Webhook event operations
  async createWebhookEvent(webhookEvent: InsertWebhookEvent): Promise<WebhookEvent> {
    const [event] = await db.insert(webhookEvents).values(webhookEvent).returning();
    return event;
  }

  async updateWebhookEventStatus(eventId: string, status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'retry', errorMessage?: string): Promise<void> {
    await db.update(webhookEvents)
      .set({ 
        status,
        errorMessage,
        lastProcessedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(webhookEvents.eventId, eventId));
  }

  // Entitlement operations
  async createEntitlement(entitlement: InsertEntitlement): Promise<Entitlement> {
    const [ent] = await db.insert(entitlements).values(entitlement).returning();
    return ent;
  }

  async updateEntitlement(userId: string, entitlementId: string, updates: Partial<Entitlement>): Promise<void> {
    await db.update(entitlements)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(
        eq(entitlements.userId, userId),
        eq(entitlements.entitlementId, entitlementId)
      ));
  }

  async getUserEntitlements(userId: string): Promise<Entitlement[]> {
    return await db.select().from(entitlements).where(eq(entitlements.userId, userId));
  }
}

export const storage = new DatabaseStorage();
