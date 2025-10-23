import { z } from 'zod';

// GDPR/CCPA Data Subject Request schemas
export const dataSubjectRequestSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  requestType: z.enum(['access', 'delete', 'rectify', 'portability', 'restrict', 'object']),
  status: z.enum(['pending', 'processing', 'completed', 'rejected']),
  description: z.string().optional(),
  verificationMethod: z.enum(['email', 'identity_document', 'account_access']),
  verificationStatus: z.enum(['pending', 'verified', 'failed']),
  requestedData: z.array(z.string()).optional(), // Specific data categories requested
  legalBasis: z.string().optional(),
  processingNotes: z.string().optional(),
  completedAt: z.date().optional(),
  expiresAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createDataSubjectRequestSchema = z.object({
  email: z.string().email(),
  requestType: z.enum(['access', 'delete', 'rectify', 'portability', 'restrict', 'object']),
  description: z.string().optional(),
  verificationMethod: z.enum(['email', 'identity_document', 'account_access']),
  requestedData: z.array(z.string()).optional(),
  legalBasis: z.string().optional(),
});

// Consent Management schemas
export const consentRecordSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().optional(), // Anonymous users won't have userId
  sessionId: z.string(),
  purposes: z.object({
    necessary: z.boolean(),
    analytics: z.boolean(),
    marketing: z.boolean(),
    functional: z.boolean(),
    personalization: z.boolean().optional(),
  }),
  lawfulBasis: z.enum(['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests']),
  consentMethod: z.enum(['banner', 'form', 'api', 'implied']),
  ipAddress: z.string(),
  userAgent: z.string(),
  language: z.string().default('en'),
  jurisdiction: z.string(), // e.g., 'EU', 'CA', 'US-CA'
  version: z.string(), // Privacy policy/consent version
  source: z.string().optional(), // Where consent was collected
  withdrawnAt: z.date().optional(),
  expiresAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const updateConsentSchema = z.object({
  purposes: z.object({
    necessary: z.boolean().optional(),
    analytics: z.boolean().optional(),
    marketing: z.boolean().optional(),
    functional: z.boolean().optional(),
    personalization: z.boolean().optional(),
  }).partial(),
  consentMethod: z.enum(['banner', 'form', 'api', 'update']).optional(),
});

// Privacy Configuration schemas
export const privacyConfigSchema = z.object({
  id: z.string().uuid(),
  dataRetentionPeriods: z.object({
    user_data: z.number(), // days
    analytics_data: z.number(),
    logs: z.number(),
    marketing_data: z.number(),
    session_data: z.number(),
  }),
  automaticDeletion: z.boolean(),
  consentExpirationDays: z.number(),
  dsarResponseDays: z.number().default(30), // GDPR requires 30 days
  breachNotificationHours: z.number().default(72), // GDPR requires 72 hours
  dataProcessors: z.array(z.object({
    name: z.string(),
    category: z.string(),
    purpose: z.string(),
    dataTransfer: z.boolean(),
    adequacyDecision: z.boolean(),
    safeguards: z.string().optional(),
  })),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Security Scan Results schemas
export const securityScanResultSchema = z.object({
  id: z.string().uuid(),
  tool: z.enum(['snyk', 'bearer', 'semgrep', 'replit-semgrep']),
  scanType: z.enum(['vulnerability', 'dependency', 'code_quality', 'security', 'privacy']),
  status: z.enum(['running', 'completed', 'failed', 'cancelled']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  findings: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    category: z.string(),
    file: z.string().optional(),
    line: z.number().optional(),
    recommendation: z.string(),
    references: z.array(z.string()).optional(),
  })),
  metadata: z.record(z.any()).optional(),
  startedAt: z.date(),
  completedAt: z.date().optional(),
  createdAt: z.date(),
});

// Payment & Subscription schemas (Polar integration)
export const subscriptionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  polarCustomerId: z.string(),
  productId: z.string(),
  status: z.enum(['active', 'cancelled', 'expired', 'in_trial', 'paused']),
  platform: z.enum(['web', 'ios', 'android']),
  originalPurchaseDate: z.date(),
  expirationDate: z.date().optional(),
  autoRenewStatus: z.boolean(),
  isInIntroOfferPeriod: z.boolean().default(false),
  introOfferType: z.enum(['free_trial', 'pay_as_you_go', 'pay_up_front']).optional(),
  priceUSD: z.number(),
  currency: z.string().default('USD'),
  billingCycle: z.enum(['monthly', 'yearly', 'weekly', 'lifetime']),
  polarTransactionId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const paymentEventSchema = z.object({
  id: z.string().uuid(),
  subscriptionId: z.string(),
  eventType: z.enum([
    'purchase', 'renewal', 'cancellation', 'refund', 
    'billing_issue', 'expiration', 'trial_started', 'trial_ended'
  ]),
  amount: z.number(),
  currency: z.string().default('USD'),
  polarEventId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  processedAt: z.date().optional(),
  createdAt: z.date(),
});

// Export TypeScript types
export type DataSubjectRequest = z.infer<typeof dataSubjectRequestSchema>;
export type CreateDataSubjectRequest = z.infer<typeof createDataSubjectRequestSchema>;
export type ConsentRecord = z.infer<typeof consentRecordSchema>;
export type UpdateConsent = z.infer<typeof updateConsentSchema>;
export type PrivacyConfig = z.infer<typeof privacyConfigSchema>;
export type SecurityScanResult = z.infer<typeof securityScanResultSchema>;
export type Subscription = z.infer<typeof subscriptionSchema>;
export type PaymentEvent = z.infer<typeof paymentEventSchema>;