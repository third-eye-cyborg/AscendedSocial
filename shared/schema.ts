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
  unique,
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

// User role enum
export const userRoleEnum = pgEnum("user_role", [
  "user",
  "moderator", 
  "admin"
]);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: varchar("username").unique(),
  bio: text("bio"), // User biography/spiritual journey
  sigil: text("sigil"), // AI-generated unique sigil (text format)
  sigilImageUrl: varchar("sigil_image_url"), // AI-generated sigil image
  aura: integer("aura").default(0), // Spiritual aura points
  energy: integer("energy").default(1000), // Monthly energy allocation
  energyLastReset: timestamp("energy_last_reset").defaultNow(),
  isPremium: boolean("is_premium").default(false),
  revenueCatCustomerId: varchar("revenuecat_customer_id"),
  paddleSubscriptionId: varchar("paddle_subscription_id"),
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false),
  astrologySign: varchar("astrology_sign"),
  birthDate: timestamp("birth_date"),
  
  // Privacy settings
  profileVisibility: boolean("profile_visibility").default(true),
  postsVisibility: boolean("posts_visibility").default(true),
  showOnlineStatus: boolean("show_online_status").default(true),
  allowDirectMessages: boolean("allow_direct_messages").default(true),
  showActivityStatus: boolean("show_activity_status").default(true),
  allowTagging: boolean("allow_tagging").default(true),
  
  // Notification settings
  likeNotifications: boolean("like_notifications").default(true),
  commentNotifications: boolean("comment_notifications").default(true),
  energyNotifications: boolean("energy_notifications").default(true),
  followNotifications: boolean("follow_notifications").default(true),
  oracleNotifications: boolean("oracle_notifications").default(true),
  emailNotifications: boolean("email_notifications").default(false),
  
  // Legacy payment fields (keeping for backward compatibility)
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  
  // User moderation fields
  role: userRoleEnum("role").default("user"),
  isBanned: boolean("is_banned").default(false),
  banReason: text("ban_reason"),
  bannedAt: timestamp("banned_at"),
  bannedBy: varchar("banned_by").references(() => users.id),
  banExpiresAt: timestamp("ban_expires_at"),
  isSuspended: boolean("is_suspended").default(false),
  suspensionReason: text("suspension_reason"),
  suspendedAt: timestamp("suspended_at"),
  suspendedBy: varchar("suspended_by").references(() => users.id),
  suspensionExpiresAt: timestamp("suspension_expires_at"),
  warningCount: integer("warning_count").default(0),
  lastWarningAt: timestamp("last_warning_at"),
  
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
  imageUrls: text("image_urls").array(), // Support up to 5 images as JSON array  
  videoUrl: varchar("video_url"),
  cloudflareVideoId: varchar("cloudflare_video_id"), // Cloudflare Stream video ID
  chakra: chakraEnum("chakra").notNull(), // AI-assigned chakra category
  frequency: integer("frequency").default(0), // Post frequency from votes
  type: varchar("type").notNull().default("post"), // "post", "spark", "vision"
  isPremium: boolean("is_premium").default(false), // Premium locked content
  isSpiritual: boolean("is_spiritual").default(false), // User-marked as spiritual content
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
  imageUrl: varchar("image_url"), // AI-generated spirit image
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
export type UserRole = "user" | "moderator" | "admin";

// Bookmarks table
export const bookmarks = pgTable('bookmarks', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: varchar('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const insertBookmarkSchema = createInsertSchema(bookmarks);
export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;

// Spiritual marks table - tracks which users have marked posts as spiritual
export const spiritualMarks = pgTable('spiritual_marks', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: varchar('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const insertSpiritualMarkSchema = createInsertSchema(spiritualMarks);
export type SpiritualMark = typeof spiritualMarks.$inferSelect;
export type InsertSpiritualMark = z.infer<typeof insertSpiritualMarkSchema>;

// Report type enum for flagging posts and users
export const reportTypeEnum = pgEnum("report_type", [
  "spam",
  "harassment",
  "inappropriate_content",
  "hate_speech",
  "violence",
  "misinformation",
  "copyright_violation",
  "fake_profile",
  "other"
]);

// Report status enum for moderation
export const reportStatusEnum = pgEnum("report_status", [
  "pending",
  "reviewed", 
  "resolved",
  "dismissed"
]);

// Reports table for user flagging system
export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reporterId: varchar("reporter_id").notNull().references(() => users.id),
  type: reportTypeEnum("type").notNull(),
  reason: text("reason"), // Additional context from user
  
  // Either report a post or a user (one will be null)
  postId: varchar("post_id").references(() => posts.id, { onDelete: 'cascade' }),
  reportedUserId: varchar("reported_user_id").references(() => users.id),
  
  status: reportStatusEnum("status").default("pending"),
  moderatorNotes: text("moderator_notes"),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  reporterId: true,
  status: true,
  moderatorNotes: true,
  reviewedAt: true,
  reviewedBy: true,
  createdAt: true,
  updatedAt: true,
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type ReportType = "spam" | "harassment" | "inappropriate_content" | "hate_speech" | "violence" | "misinformation" | "copyright_violation" | "fake_profile" | "other";
export type ReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";

// Audit log action types enum for tracking moderation actions
export const auditActionEnum = pgEnum("audit_action", [
  "user_banned",
  "user_unbanned", 
  "user_suspended",
  "user_unsuspended",
  "user_warned",
  "user_role_changed",
  "post_removed",
  "post_restored",
  "comment_removed", 
  "comment_restored",
  "report_reviewed",
  "community_banned",
  "community_created",
  "community_deleted",
  "other_action"
]);

// Audit logs table for tracking all moderation and admin actions
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  action: auditActionEnum("action").notNull(),
  performedBy: varchar("performed_by").notNull().references(() => users.id), // Admin/moderator who performed action
  targetUserId: varchar("target_user_id").references(() => users.id), // User affected by action
  targetPostId: varchar("target_post_id").references(() => posts.id), // Post affected by action
  targetCommentId: varchar("target_comment_id").references(() => comments.id), // Comment affected by action
  targetReportId: varchar("target_report_id").references(() => reports.id), // Report affected by action
  reason: text("reason"), // Reason for the action
  details: jsonb("details"), // Additional details in JSON format
  oldValue: text("old_value"), // Previous value (for changes)
  newValue: text("new_value"), // New value (for changes)
  ipAddress: varchar("ip_address"), // IP address of the admin/moderator
  userAgent: text("user_agent"), // User agent of the admin/moderator
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditAction = "user_banned" | "user_unbanned" | "user_suspended" | "user_unsuspended" | "user_warned" | "user_role_changed" | "post_removed" | "post_restored" | "comment_removed" | "comment_restored" | "report_reviewed" | "community_banned" | "community_created" | "community_deleted" | "other_action";

// ====================================
// PRIVACY & COMPLIANCE MODELS
// ====================================

// Consent types enum
export const consentTypeEnum = pgEnum("consent_type", [
  "analytics",
  "marketing", 
  "functional",
  "necessary"
]);

// Consent status enum
export const consentStatusEnum = pgEnum("consent_status", [
  "given",
  "withdrawn",
  "expired"
]);

// User consent records (replacing Enzuzo)
export const userConsents = pgTable("user_consents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  consentType: consentTypeEnum("consent_type").notNull(),
  status: consentStatusEnum("status").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  version: varchar("version").notNull().default("1.0"), // Privacy policy version
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  source: varchar("source").default("banner"), // banner, settings, api
  expiresAt: timestamp("expires_at"), // For temporary consents
  metadata: jsonb("metadata"), // Additional consent details
});

// DSAR request types enum
export const dsarTypeEnum = pgEnum("dsar_type", [
  "access",      // Data portability request
  "delete",      // Right to be forgotten
  "correct",     // Data rectification
  "restrict",    // Processing restriction
  "object",      // Object to processing
  "portability"  // Data portability
]);

// DSAR status enum
export const dsarStatusEnum = pgEnum("dsar_status", [
  "submitted",
  "verified",
  "processing", 
  "completed",
  "rejected",
  "cancelled"
]);

// Data Subject Access Requests (DSAR)
export const dsarRequests = pgTable("dsar_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: dsarTypeEnum("type").notNull(),
  status: dsarStatusEnum("status").default("submitted"),
  description: text("description"),
  requestedData: text("requested_data").array(), // Specific data categories requested
  verificationToken: varchar("verification_token"), // Email verification
  verificationExpiresAt: timestamp("verification_expires_at"),
  processedBy: varchar("processed_by").references(() => users.id), // Admin who processed
  processedAt: timestamp("processed_at"),
  downloadUrl: varchar("download_url"), // Secure download link for data export
  downloadExpiresAt: timestamp("download_expires_at"),
  rejectionReason: text("rejection_reason"),
  metadata: jsonb("metadata"), // Request-specific details
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ====================================
// PAYMENT & SUBSCRIPTION MODELS  
// ====================================

// RevenueCat entitlement status enum
export const entitlementStatusEnum = pgEnum("entitlement_status", [
  "active",
  "inactive", 
  "expired",
  "cancelled",
  "paused"
]);

// Platform enum for subscriptions
export const platformEnum = pgEnum("platform", [
  "web",
  "ios", 
  "android",
  "stripe", // Legacy Stripe subscriptions
  "paddle"  // New Paddle subscriptions
]);

// RevenueCat entitlements - central source of truth for premium features
export const entitlements = pgTable("entitlements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  revenuecatUserId: varchar("revenuecat_user_id").notNull(), // RevenueCat customer ID
  entitlementId: varchar("entitlement_id").notNull(), // RevenueCat entitlement identifier
  productId: varchar("product_id").notNull(), // Product identifier (premium, pro, etc)
  status: entitlementStatusEnum("status").notNull(),
  platform: platformEnum("platform").notNull(),
  purchaseDate: timestamp("purchase_date"),
  expirationDate: timestamp("expiration_date"), 
  autoRenewStatus: boolean("auto_renew_status").default(true),
  isTrialPeriod: boolean("is_trial_period").default(false),
  trialExpirationDate: timestamp("trial_expiration_date"),
  originalTransactionId: varchar("original_transaction_id"), // Platform transaction ID
  latestTransactionId: varchar("latest_transaction_id"), // Most recent transaction
  subscriptionId: varchar("subscription_id"), // Subscription identifier from platform
  priceInCents: integer("price_in_cents"), // Price in cents
  currency: varchar("currency").default("USD"),
  metadata: jsonb("metadata"), // Platform-specific data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Webhook event types enum
export const webhookTypeEnum = pgEnum("webhook_type", [
  "paddle.subscription.created",
  "paddle.subscription.updated", 
  "paddle.subscription.cancelled",
  "paddle.payment.succeeded",
  "paddle.payment.failed",
  "revenuecat.purchase.made",
  "revenuecat.renewal.succeeded",
  "revenuecat.cancellation",
  "revenuecat.expiration",
  "fides.consent.updated",
  "fides.dsar.completed"
]);

// Webhook processing status enum  
export const webhookStatusEnum = pgEnum("webhook_status", [
  "pending",
  "processing",
  "succeeded", 
  "failed",
  "retry"
]);

// Webhook events for payment and privacy system integration
export const webhookEvents = pgTable("webhook_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").unique(), // External system event ID for idempotency
  type: webhookTypeEnum("type").notNull(),
  status: webhookStatusEnum("status").default("pending"),
  source: varchar("source").notNull(), // paddle, revenuecat, fides
  payload: jsonb("payload").notNull(), // Full webhook payload
  signature: varchar("signature"), // Webhook signature for verification
  processingAttempts: integer("processing_attempts").default(0),
  lastProcessedAt: timestamp("last_processed_at"),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata"), // Processing metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Feature flags for dual-run migration
export const featureFlags = pgTable("feature_flags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull().unique(), // stripe_dual_run, new_privacy_stack, etc
  enabled: boolean("enabled").default(false),
  percentage: integer("percentage").default(0), // Rollout percentage (0-100)
  userId: varchar("user_id").references(() => users.id), // User-specific flag
  metadata: jsonb("metadata"), // Flag configuration
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ====================================
// INSERT SCHEMAS & TYPES
// ====================================

export const insertUserConsentSchema = createInsertSchema(userConsents).omit({
  id: true,
  timestamp: true,
});

export const insertDSARRequestSchema = createInsertSchema(dsarRequests).omit({
  id: true,
  verificationToken: true,
  verificationExpiresAt: true,
  processedBy: true,
  processedAt: true,
  downloadUrl: true,
  downloadExpiresAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEntitlementSchema = createInsertSchema(entitlements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWebhookEventSchema = createInsertSchema(webhookEvents).omit({
  id: true,
  processingAttempts: true,
  lastProcessedAt: true,
  errorMessage: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeatureFlagSchema = createInsertSchema(featureFlags).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ====================================
// TYPES
// ====================================

export type UserConsent = typeof userConsents.$inferSelect;
export type InsertUserConsent = z.infer<typeof insertUserConsentSchema>;
export type ConsentType = "analytics" | "marketing" | "functional" | "necessary";
export type ConsentStatus = "given" | "withdrawn" | "expired";

export type DSARRequest = typeof dsarRequests.$inferSelect;
export type InsertDSARRequest = z.infer<typeof insertDSARRequestSchema>;
export type DSARType = "access" | "delete" | "correct" | "restrict" | "object" | "portability";
export type DSARStatus = "submitted" | "verified" | "processing" | "completed" | "rejected" | "cancelled";

export type Entitlement = typeof entitlements.$inferSelect;
export type InsertEntitlement = z.infer<typeof insertEntitlementSchema>;
export type EntitlementStatus = "active" | "inactive" | "expired" | "cancelled" | "paused";
export type Platform = "web" | "ios" | "android" | "stripe" | "paddle";

export type WebhookEvent = typeof webhookEvents.$inferSelect;
export type InsertWebhookEvent = z.infer<typeof insertWebhookEventSchema>;
export type WebhookType = "paddle.subscription.created" | "paddle.subscription.updated" | "paddle.subscription.cancelled" | "paddle.payment.succeeded" | "paddle.payment.failed" | "revenuecat.purchase.made" | "revenuecat.renewal.succeeded" | "revenuecat.cancellation" | "revenuecat.expiration" | "fides.consent.updated" | "fides.dsar.completed";
export type WebhookStatus = "pending" | "processing" | "succeeded" | "failed" | "retry";

export type FeatureFlag = typeof featureFlags.$inferSelect;
export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;

// Vision privacy enum
export const visionPrivacyEnum = pgEnum("vision_privacy", [
  "public",    // Visible to everyone
  "friends",   // Visible to connected users only
  "private"    // Visible to author only
]);

// Visions table - spiritual visions and insights
export const visions = pgTable("visions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  imageUrl: varchar("image_url"), // Cloudflare Images URL
  videoUrl: varchar("video_url"), // Cloudflare Stream URL
  audioUrl: varchar("audio_url"), // Audio recording URL
  privacy: visionPrivacyEnum("privacy").default("public"),
  chakra: chakraEnum("chakra").notNull(), // AI-assigned chakra category
  symbols: text("symbols").array(), // Associated spiritual symbols
  keywords: text("keywords").array(), // AI-extracted keywords
  spiritualInsights: jsonb("spiritual_insights"), // AI-generated insights
  energyLevel: integer("energy_level").default(0), // Spiritual energy rating
  manifestationDate: timestamp("manifestation_date"), // When vision manifested
  isManifested: boolean("is_manifested").default(false),
  cloudflareImageId: varchar("cloudflare_image_id"), // Cloudflare Images ID
  cloudflareVideoId: varchar("cloudflare_video_id"), // Cloudflare Stream ID
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vision engagements (likes, spiritual marks, etc.)
export const visionEngagements = pgTable("vision_engagements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  visionId: varchar("vision_id").notNull().references(() => visions.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: engagementTypeEnum("type").notNull(),
  energyAmount: integer("energy_amount").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Communities table - spiritual groups and circles
export const communities = pgTable("communities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  creatorId: varchar("creator_id").notNull().references(() => users.id),
  imageUrl: varchar("image_url"), // Cloudflare Images URL
  bannerUrl: varchar("banner_url"), // Cloudflare Images URL
  isPrivate: boolean("is_private").default(false),
  requiresApproval: boolean("requires_approval").default(false),
  memberCount: integer("member_count").default(0),
  maxMembers: integer("max_members").default(1000),
  primaryChakra: chakraEnum("primary_chakra"), // Main spiritual focus
  tags: text("tags").array(), // Community tags/interests
  guidelines: text("guidelines"), // Community rules
  spiritualFocus: text("spiritual_focus").array(), // Areas of focus
  meetingSchedule: jsonb("meeting_schedule"), // Regular meeting times
  cloudflareImageId: varchar("cloudflare_image_id"), // Cloudflare Images ID
  cloudflareBannerId: varchar("cloudflare_banner_id"), // Cloudflare Images ID
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Community membership status enum
export const membershipStatusEnum = pgEnum("membership_status", [
  "pending",
  "active",
  "moderator",
  "admin",
  "banned"
]);

// Community memberships
export const communityMemberships = pgTable("community_memberships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  communityId: varchar("community_id").notNull().references(() => communities.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: membershipStatusEnum("status").default("pending"),
  joinedAt: timestamp("joined_at").defaultNow(),
  invitedBy: varchar("invited_by").references(() => users.id),
  role: varchar("role").default("member"), // member, moderator, admin
  lastActiveAt: timestamp("last_active_at").defaultNow(),
});

// Community posts/discussions
export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  communityId: varchar("community_id").notNull().references(() => communities.id),
  authorId: varchar("author_id").notNull().references(() => users.id),
  title: varchar("title"),
  content: text("content").notNull(),
  imageUrl: varchar("image_url"), // Cloudflare Images URL
  videoUrl: varchar("video_url"), // Cloudflare Stream URL
  type: varchar("type").default("discussion"), // discussion, announcement, event
  isPinned: boolean("is_pinned").default(false),
  chakra: chakraEnum("chakra"), // Optional chakra category
  cloudflareImageId: varchar("cloudflare_image_id"), // Cloudflare Images ID
  cloudflareVideoId: varchar("cloudflare_video_id"), // Cloudflare Stream ID
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Community events
export const communityEvents = pgTable("community_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  communityId: varchar("community_id").notNull().references(() => communities.id),
  creatorId: varchar("creator_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: varchar("location"), // Physical or virtual location
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  isVirtual: boolean("is_virtual").default(false),
  meetingUrl: varchar("meeting_url"), // Virtual meeting link
  imageUrl: varchar("image_url"), // Cloudflare Images URL
  chakraFocus: chakraEnum("chakra_focus"), // Event's spiritual focus
  cloudflareImageId: varchar("cloudflare_image_id"), // Cloudflare Images ID
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Event attendance tracking
export const eventAttendances = pgTable("event_attendances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => communityEvents.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: varchar("status").default("going"), // going, maybe, not_going
  registeredAt: timestamp("registered_at").defaultNow(),
});

// Newsletter subscriptions table - for marketing emails
export const newsletterSubscriptions = pgTable('newsletter_subscriptions', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  email: varchar('email').notNull().unique(),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  isActive: boolean('is_active').default(true),
  subscriptionDate: timestamp('subscription_date').defaultNow(),
  unsubscribeToken: varchar('unsubscribe_token').unique(),
  lastEmailSent: timestamp('last_email_sent'),
  preferences: jsonb('preferences').default('{}'), // Email frequency, content types, etc.
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions);
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;

// Insert schemas for new tables
export const insertVisionSchema = createInsertSchema(visions).omit({
  id: true,
  authorId: true,
  chakra: true,
  spiritualInsights: true,
  energyLevel: true,
  cloudflareImageId: true,
  cloudflareVideoId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommunitySchema = createInsertSchema(communities).omit({
  id: true,
  creatorId: true,
  memberCount: true,
  cloudflareImageId: true,
  cloudflareBannerId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommunityMembershipSchema = createInsertSchema(communityMemberships).omit({
  id: true,
  joinedAt: true,
  lastActiveAt: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  authorId: true,
  cloudflareImageId: true,
  cloudflareVideoId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommunityEventSchema = createInsertSchema(communityEvents).omit({
  id: true,
  creatorId: true,
  currentAttendees: true,
  cloudflareImageId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventAttendanceSchema = createInsertSchema(eventAttendances).omit({
  id: true,
  registeredAt: true,
});

export const insertVisionEngagementSchema = createInsertSchema(visionEngagements).omit({
  id: true,
  userId: true,
  createdAt: true,
});

// Types for new features
export type Vision = typeof visions.$inferSelect;
export type InsertVision = z.infer<typeof insertVisionSchema>;
export type VisionWithAuthor = Vision & { author: User };
export type VisionPrivacy = "public" | "friends" | "private";

export type Community = typeof communities.$inferSelect;
export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
export type CommunityWithCreator = Community & { creator: User };

export type CommunityMembership = typeof communityMemberships.$inferSelect;
export type InsertCommunityMembership = z.infer<typeof insertCommunityMembershipSchema>;
export type MembershipStatus = "pending" | "active" | "moderator" | "admin" | "banned";

export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type CommunityPostWithAuthor = CommunityPost & { author: User };

export type CommunityEvent = typeof communityEvents.$inferSelect;
export type InsertCommunityEvent = z.infer<typeof insertCommunityEventSchema>;
export type CommunityEventWithCreator = CommunityEvent & { creator: User };

export type EventAttendance = typeof eventAttendances.$inferSelect;
export type InsertEventAttendance = z.infer<typeof insertEventAttendanceSchema>;

export type VisionEngagement = typeof visionEngagements.$inferSelect;
export type InsertVisionEngagement = z.infer<typeof insertVisionEngagementSchema>;
