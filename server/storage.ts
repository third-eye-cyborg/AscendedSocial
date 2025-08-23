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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, count, ilike, or, ne } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(userId: string, updates: Partial<User>): Promise<User>;
  updateUserSigil(userId: string, sigil: string): Promise<User>;
  updateUserEnergy(userId: string, energy: number): Promise<User>;
  updateUserAura(userId: string, aura: number): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User>;
  
  // Post operations
  createPost(post: InsertPost, authorId: string): Promise<Post>;
  getPost(id: string): Promise<PostWithAuthor | undefined>;
  getPosts(limit?: number, offset?: number): Promise<PostWithAuthor[]>;
  getUserPosts(userId: string, limit?: number): Promise<PostWithAuthor[]>;
  updatePostChakra(postId: string, chakra: ChakraType): Promise<Post>;
  
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
  createSpirit(userId: string, spiritData: { name: string; description: string; element: string; questionnaire: any }): Promise<any>;
  getUserSpirit(userId: string): Promise<any | null>;
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

  async updateUserSigil(userId: string, sigil: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ sigil, updatedAt: new Date() })
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
        videoUrl: posts.videoUrl,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isPremium: posts.isPremium,
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
        videoUrl: posts.videoUrl,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isPremium: posts.isPremium,
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
        videoUrl: posts.videoUrl,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isPremium: posts.isPremium,
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
        videoUrl: posts.videoUrl,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isPremium: posts.isPremium,
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
        videoUrl: posts.videoUrl,
        chakra: posts.chakra,
        frequency: posts.frequency,
        type: posts.type,
        isPremium: posts.isPremium,
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

  // Engagement operations
  async createEngagement(engagement: InsertEngagement, userId: string): Promise<Engagement> {
    // Remove existing engagement of same type if exists
    await db
      .delete(postEngagements)
      .where(
        and(
          eq(postEngagements.postId, engagement.postId),
          eq(postEngagements.userId, userId),
          eq(postEngagements.type, engagement.type)
        )
      );

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
      .values({ ...engagement, userId })
      .returning();

    // Update post frequency
    await this.updatePostFrequency(engagement.postId);
    
    return newEngagement;
  }

  async removeEngagement(postId: string, userId: string, type: EngagementType): Promise<void> {
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

  async getPostEngagements(postId: string): Promise<{ [key in EngagementType]: number }> {
    const engagements = await db
      .select({
        type: postEngagements.type,
        count: count(),
      })
      .from(postEngagements)
      .where(eq(postEngagements.postId, postId))
      .groupBy(postEngagements.type);

    const result = {
      upvote: 0,
      downvote: 0,
      like: 0,
      energy: 0,
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
    const frequency = engagements.upvote - engagements.downvote + 
                     engagements.like + (engagements.energy * 2);
    
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
    return result;
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
  async createSpirit(userId: string, spiritData: { name: string; description: string; element: string; questionnaire: any }): Promise<any> {
    const [spirit] = await db
      .insert(spirits)
      .values({
        userId,
        name: spiritData.name,
        description: spiritData.description,
        element: spiritData.element as 'fire' | 'water' | 'earth' | 'air',
        questionnaire: spiritData.questionnaire,
        level: 1,
        experience: 0,
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
}

export const storage = new DatabaseStorage();
