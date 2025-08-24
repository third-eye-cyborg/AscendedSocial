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
  type ChakraType,
  type EngagementType,
  notifications,
  bookmarks,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, count, ilike, or, ne, sum } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(userId: string, updates: Partial<User>): Promise<User>;
  updateUserSigil(userId: string, sigil: string, sigilImageUrl?: string): Promise<User>;
  updateUserEnergy(userId: string, energy: number): Promise<User>;
  updateUserAura(userId: string, aura: number): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User>;
  
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
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
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

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        updatedAt: new Date() 
      })
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

  async getUserPosts(userId: string, limit = 20): Promise<PostWithAuthor[]> {
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
      .where(ilike(posts.content, `%${query}%`))
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
          ilike(users.username, `%${query}%`),
          ilike(users.email, `%${query}%`)
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
    // Get regular engagement counts (upvote, downvote, like)
    const engagements = await db
      .select({
        type: postEngagements.type,
        count: count(),
      })
      .from(postEngagements)
      .where(
        and(
          eq(postEngagements.postId, postId),
          ne(postEngagements.type, 'energy')
        )
      )
      .groupBy(postEngagements.type);

    // Get total energy amount from energy engagements
    const totalEnergyAmount = await db
      .select({ totalEnergy: sum(postEngagements.energyAmount) })
      .from(postEngagements)
      .where(
        and(
          eq(postEngagements.postId, postId),
          eq(postEngagements.type, 'energy')
        )
      );

    // Get comment count separately
    const [{ count: commentCount }] = await db
      .select({ count: count() })
      .from(comments)
      .where(eq(comments.postId, postId));

    const result = {
      upvote: 0,
      downvote: 0,
      like: 0,
      energy: Number(totalEnergyAmount[0]?.totalEnergy || 0),
      comments: commentCount || 0,
    };

    engagements.forEach(({ type, count }) => {
      result[type as EngagementType] = count;
    });

    return result;
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
    const engagements = await this.getPostEngagements(postId);
    
    // Get total energy amount from all energy engagements
    const totalEnergyAmount = await db
      .select({ totalEnergy: sum(postEngagements.energyAmount) })
      .from(postEngagements)
      .where(
        and(
          eq(postEngagements.postId, postId),
          eq(postEngagements.type, 'energy')
        )
      );
    
    const energySum = Number(totalEnergyAmount[0]?.totalEnergy || 0);
    const frequency = engagements.upvote - engagements.downvote + 
                     engagements.like + Math.floor(energySum * 0.2); // Energy worth 0.2 frequency per point
    
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
          sql`${spiritualReadings.createdAt} >= ${today}`
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
        conditions.push(sql`users.aura >= ${filters.minAura}`);
      }
      if (filters?.maxAura) {
        conditions.push(sql`users.aura <= ${filters.maxAura}`);
      }
      if (filters?.minEnergy) {
        conditions.push(sql`users.energy >= ${filters.minEnergy}`);
      }
      if (filters?.maxEnergy) {
        conditions.push(sql`users.energy <= ${filters.maxEnergy}`);
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
      .where(sql`${spiritualMarks.postId} IN (${postIds.map(id => `'${id}'`).join(',')})`)
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
        content: posts.content,
        imageUrl: posts.imageUrl,
        imageUrls: posts.imageUrls,
        videoUrl: posts.videoUrl,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isSpiritual: posts.isSpiritual,
        createdAt: posts.createdAt,
        authorId: posts.authorId,
        author: {
          id: users.id,
          email: users.email,
          username: users.username,
          sigil: users.sigil,
          sigilImageUrl: users.sigilImageUrl,
        },
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
        content: posts.content,
        imageUrl: posts.imageUrl,
        imageUrls: posts.imageUrls,
        videoUrl: posts.videoUrl,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isSpiritual: posts.isSpiritual,
        createdAt: posts.createdAt,
        authorId: posts.authorId,
        author: {
          id: users.id,
          email: users.email,
          username: users.username,
          sigil: users.sigil,
          sigilImageUrl: users.sigilImageUrl,
        },
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
        content: posts.content,
        imageUrl: posts.imageUrl,
        imageUrls: posts.imageUrls,
        videoUrl: posts.videoUrl,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isSpiritual: posts.isSpiritual,
        createdAt: posts.createdAt,
        authorId: posts.authorId,
        author: {
          id: users.id,
          email: users.email,
          username: users.username,
          sigil: users.sigil,
          sigilImageUrl: users.sigilImageUrl,
        },
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
        content: posts.content,
        imageUrl: posts.imageUrl,
        imageUrls: posts.imageUrls,
        videoUrl: posts.videoUrl,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isSpiritual: posts.isSpiritual,
        createdAt: posts.createdAt,
        authorId: posts.authorId,
        commentCreatedAt: comments.createdAt,
        author: {
          id: users.id,
          email: users.email,
          username: users.username,
          sigil: users.sigil,
          sigilImageUrl: users.sigilImageUrl,
        },
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
        content: posts.content,
        imageUrl: posts.imageUrl,
        imageUrls: posts.imageUrls,
        videoUrl: posts.videoUrl,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isSpiritual: posts.isSpiritual,
        createdAt: posts.createdAt,
        authorId: posts.authorId,
        author: {
          id: users.id,
          email: users.email,
          username: users.username,
          sigil: users.sigil,
          sigilImageUrl: users.sigilImageUrl,
        },
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
}

export const storage = new DatabaseStorage();
