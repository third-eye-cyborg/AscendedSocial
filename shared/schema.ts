import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: varchar("username").unique(),
  sigil: text("sigil"), // AI-generated unique sigil
  aura: integer("aura").default(0), // Spiritual aura points
  energy: integer("energy").default(1000), // Monthly energy allocation
  energyLastReset: timestamp("energy_last_reset").defaultNow(),
  isPremium: boolean("is_premium").default(false),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chakra enum for post categorization
export const chakraEnum = pgEnum("chakra", [
  "root",      // Red - survival, grounding
  "sacral",    // Orange - creativity, sexuality
  "solar",     // Yellow - personal power
  "heart",     // Green - love, compassion
  "throat",    // Blue - communication, truth
  "third_eye", // Indigo - intuition, wisdom
  "crown"      // Violet - spirituality, connection
]);

// Posts table
export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  imageUrl: varchar("image_url"),
  videoUrl: varchar("video_url"),
  chakra: chakraEnum("chakra").notNull(), // AI-assigned chakra category
  frequency: integer("frequency").default(0), // Post frequency from votes
  type: varchar("type").notNull().default("post"), // "post", "spark", "vision"
  isPremium: boolean("is_premium").default(false), // Premium locked content
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Engagement types enum
export const engagementTypeEnum = pgEnum("engagement_type", [
  "upvote",
  "downvote", 
  "like",
  "energy"
]);

// Post engagements
export const postEngagements = pgTable("post_engagements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull().references(() => posts.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: engagementTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Comments table
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull().references(() => posts.id),
  authorId: varchar("author_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Comment engagements
export const commentEngagements = pgTable("comment_engagements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  commentId: varchar("comment_id").notNull().references(() => comments.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: engagementTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Spiritual readings
export const spiritualReadings = pgTable("spiritual_readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // "daily", "tarot", "oracle"
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // Card info, symbols, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// User subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subscriberId: varchar("subscriber_id").notNull().references(() => users.id),
  creatorId: varchar("creator_id").notNull().references(() => users.id),
  tier: varchar("tier").notNull(), // Subscription tier level
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  username: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  authorId: true,
  chakra: true,
  frequency: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  authorId: true,
  createdAt: true,
});

export const insertEngagementSchema = createInsertSchema(postEngagements).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertReadingSchema = createInsertSchema(spiritualReadings).omit({
  id: true,
  userId: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
export type PostWithAuthor = Post & { author: User };
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
export type CommentWithAuthor = Comment & { author: User };
export type InsertEngagement = z.infer<typeof insertEngagementSchema>;
export type Engagement = typeof postEngagements.$inferSelect;
export type InsertReading = z.infer<typeof insertReadingSchema>;
export type SpiritualReading = typeof spiritualReadings.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type ChakraType = "root" | "sacral" | "solar" | "heart" | "throat" | "third_eye" | "crown";
export type EngagementType = "upvote" | "downvote" | "like" | "energy";
