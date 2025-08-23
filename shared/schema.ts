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
  bio: text("bio"), // User biography/spiritual journey
  sigil: text("sigil"), // AI-generated unique sigil
  aura: integer("aura").default(0), // Spiritual aura points
  energy: integer("energy").default(1000), // Monthly energy allocation
  energyLastReset: timestamp("energy_last_reset").defaultNow(),
  isPremium: boolean("is_premium").default(false),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false),
  astrologySign: varchar("astrology_sign"),
  birthDate: timestamp("birth_date"),
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
  energyAmount: integer("energy_amount").default(1), // Amount of energy spent (1-50 for energy type)
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

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // 'comment', 'engagement', 'oracle', 'profile_view'
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  relatedId: varchar("related_id"), // post id, user id, comment id, etc.
  relatedType: varchar("related_type"), // 'post', 'user', 'comment'
  triggerUserId: varchar("trigger_user_id").references(() => users.id), // who triggered the notification
  createdAt: timestamp("created_at").defaultNow(),
});

// Spiritual connection status enum
export const connectionStatusEnum = pgEnum("connection_status", [
  "pending",
  "accepted", 
  "declined",
  "blocked"
]);

// User Spirits - AI-generated spiritual entities
export const spirits = pgTable("spirits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  element: varchar("element"), // fire, water, earth, air
  level: integer("level").default(1),
  experience: integer("experience").default(0),
  questionnaire: jsonb("questionnaire"), // Store original answers
  evolution: jsonb("evolution").default('[]'), // Track spirit changes over time
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User connections for spiritual bonding
export const connections = pgTable("connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requesterId: varchar("requester_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  status: connectionStatusEnum("status").default("pending"),
  bondLevel: integer("bond_level").default(0),
  lastInteraction: timestamp("last_interaction"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Daily spiritual interactions between connected users
export const spiritualInteractions = pgTable("spiritual_interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  connectionId: varchar("connection_id").notNull().references(() => connections.id),
  initiatorId: varchar("initiator_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // "view_profile", "like_post", "comment", "energy_share"
  experienceGained: integer("experience_gained").default(1),
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

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertSpiritSchema = createInsertSchema(spirits).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConnectionSchema = createInsertSchema(connections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSpiritualInteractionSchema = createInsertSchema(spiritualInteractions).omit({
  id: true,
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
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type NotificationWithTriggerUser = Notification & { triggerUser?: User };
export type Subscription = typeof subscriptions.$inferSelect;
export type Spirit = typeof spirits.$inferSelect;
export type NewSpirit = typeof spirits.$inferInsert;
export type Connection = typeof connections.$inferSelect;
export type NewConnection = typeof connections.$inferInsert;
export type SpiritualInteraction = typeof spiritualInteractions.$inferSelect;
export type NewSpiritualInteraction = typeof spiritualInteractions.$inferInsert;
export type ChakraType = "root" | "sacral" | "solar" | "heart" | "throat" | "third_eye" | "crown";
export type EngagementType = "upvote" | "downvote" | "like" | "energy";
export type ConnectionStatus = "pending" | "accepted" | "declined" | "blocked";
