import {
  users,
  posts,
  comments,
  postEngagements,
  commentEngagements,
  spiritualReadings,
  subscriptions,
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
  type ChakraType,
  type EngagementType,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, count } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
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
  
  // Stats operations
  getUserStats(userId: string): Promise<{
    totalPosts: number;
    totalEngagements: number;
    positiveEnergy: number;
    auraLevel: number;
  }>;
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
}

export const storage = new DatabaseStorage();
