import express from 'express';
import { z } from 'zod';
import { storage } from './storage';
import { InsertWebhookEvent, InsertEntitlement } from '@shared/schema';
import crypto from 'crypto';

const router = express.Router();

// Webhook verification middleware for RevenueCat
const verifyRevenueCatWebhook = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.split('Bearer ')[1];
  if (token !== process.env.REVENUECAT_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Invalid webhook token' });
  }

  next();
};

// Webhook verification middleware for Paddle with raw body verification
const verifyPaddleWebhook = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const signature = req.headers['paddle-signature'] as string;
    if (!signature) {
      return res.status(401).json({ error: 'Missing Paddle signature' });
    }

    // Extract signature components
    const [ts, h1] = signature.split(';').map(part => part.split('=')[1]);
    
    if (!ts || !h1) {
      return res.status(401).json({ error: 'Invalid signature format' });
    }

    // Verify signature using raw body (stored by raw body parser)
    const rawBody = (req as any).rawBody || Buffer.from(JSON.stringify(req.body));
    const payload = ts + ':' + rawBody;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.PADDLE_WEBHOOK_SECRET || '')
      .update(payload)
      .digest('hex');

    if (h1 !== expectedSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Check timestamp (prevent replay attacks)
    const timestampMs = parseInt(ts) * 1000;
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (Math.abs(currentTime - timestampMs) > fiveMinutes) {
      return res.status(401).json({ error: 'Request too old' });
    }

    next();
  } catch (error) {
    console.error('Paddle webhook verification failed:', error);
    return res.status(401).json({ error: 'Verification failed' });
  }
};

// RevenueCat webhook event schema
const revenueCatEventSchema = z.object({
  api_version: z.string(),
  event: z.object({
    id: z.string(),
    type: z.enum([
      'INITIAL_PURCHASE',
      'RENEWAL',
      'CANCELLATION',
      'BILLING_ISSUE',
      'PRODUCT_CHANGE',
      'EXPIRATION',
      'TRANSFER'
    ]),
    event_timestamp_ms: z.number(),
    app_user_id: z.string(),
    original_app_user_id: z.string().optional(),
    aliases: z.array(z.string()).optional(),
    subscriber_attributes: z.record(z.any()).optional(),
    entitlements: z.record(z.object({
      expires_date: z.string(),
      product_identifier: z.string(),
      purchase_date: z.string()
    })).optional(),
    product_id: z.string().optional(),
    period_type: z.string().optional(),
    purchased_at_ms: z.number().optional(),
    expiration_at_ms: z.number().optional()
  })
});

// Paddle webhook event schema
const paddleEventSchema = z.object({
  event_id: z.string(),
  event_type: z.enum([
    'subscription.created',
    'subscription.updated', 
    'subscription.canceled',
    'transaction.completed',
    'transaction.payment_failed'
  ]),
  occurred_at: z.string(),
  data: z.object({
    id: z.string(),
    status: z.string().optional(),
    customer_id: z.string().optional(),
    custom_data: z.record(z.any()).optional(),
    items: z.array(z.object({
      product: z.object({
        id: z.string(),
        name: z.string()
      }),
      price: z.object({
        id: z.string(),
        unit_amount: z.object({
          amount: z.string(),
          currency_code: z.string()
        })
      })
    })).optional()
  })
});

// Use raw body parser for webhook signature verification
router.use('/webhooks/*', express.raw({ type: 'application/json' }), (req, res, next) => {
  // Store raw body for signature verification
  (req as any).rawBody = req.body;
  // Parse JSON manually for processing
  if (req.body && req.body.length > 0) {
    try {
      req.body = JSON.parse(req.body.toString());
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }
  next();
});

// RevenueCat webhook handler
router.post('/webhooks/revenuecat', verifyRevenueCatWebhook, async (req, res) => {
  try {
    const validatedData = revenueCatEventSchema.parse(req.body);
    const { event } = validatedData;

    console.log(`RevenueCat webhook: ${event.type} for user ${event.app_user_id}`);

    // Store webhook event for idempotency (check if already processed)
    try {
      await storage.createWebhookEvent({
        eventId: event.id,
        type: `revenuecat.${event.type.toLowerCase()}` as any,
        source: 'revenuecat',
        payload: req.body,
        status: 'pending'
      });
    } catch (error) {
      // Event already exists (unique constraint violation)
      console.log(`Webhook event ${event.id} already processed`);
      return res.status(200).json({ status: 'already_processed' });
    }

    // Process the event asynchronously
    setImmediate(() => processRevenueCatEvent(event));

    // Respond immediately to RevenueCat
    res.status(200).json({ status: 'received' });

  } catch (error) {
    console.error('RevenueCat webhook processing error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
});

// Paddle webhook handler
router.post('/webhooks/paddle', verifyPaddleWebhook, async (req, res) => {
  try {
    const validatedData = paddleEventSchema.parse(req.body);
    const { event_id, event_type, data } = validatedData;

    console.log(`Paddle webhook: ${event_type} for event ${event_id}`);

    // Store webhook event for idempotency (check if already processed)
    try {
      await storage.createWebhookEvent({
        eventId: event_id,
        type: `paddle.${event_type}` as any,
        source: 'paddle',
        payload: req.body,
        status: 'pending'
      });
    } catch (error) {
      // Event already exists (unique constraint violation)
      console.log(`Webhook event ${event_id} already processed`);
      return res.status(200).json({ status: 'already_processed' });
    }

    // Process the event asynchronously
    setImmediate(() => processPaddleEvent(validatedData));

    // Respond immediately to Paddle
    res.status(200).json({ status: 'received' });

  } catch (error) {
    console.error('Paddle webhook processing error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
});

// Process RevenueCat webhook events
async function processRevenueCatEvent(event: any) {
  try {
    // Get all user IDs associated with this customer (handles transfers/aliases)
    const userIds = [
      event.app_user_id,
      event.original_app_user_id,
      ...(event.aliases || [])
    ].filter(Boolean);

    // Find user in database
    const user = await findUserByAnyId(userIds);
    if (!user) {
      console.error(`No user found for RevenueCat IDs: ${userIds.join(', ')}`);
      return;
    }

    switch (event.type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
        await handleSubscriptionActivation(user.id, event);
        break;
      
      case 'CANCELLATION':
        await handleSubscriptionCancellation(user.id, event);
        break;
      
      case 'EXPIRATION':
        await handleSubscriptionExpiration(user.id, event);
        break;
      
      case 'BILLING_ISSUE':
        await handleBillingIssue(user.id, event);
        break;
      
      case 'PRODUCT_CHANGE':
        await handleProductChange(user.id, event);
        break;
      
      default:
        console.log(`Unhandled RevenueCat event type: ${event.type}`);
    }

    // Update webhook event status
    await storage.updateWebhookEventStatus(event.id, 'succeeded');

  } catch (error) {
    console.error('Failed to process RevenueCat event:', error);
    
    // Update webhook event with error
    await storage.updateWebhookEventStatus(event.id, 'failed', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Process Paddle webhook events
async function processPaddleEvent(webhookData: any) {
  try {
    const { event_id, event_type, data } = webhookData;
    
    // Extract user ID from custom data
    const customData = data.custom_data || {};
    const userId = customData.user_id;
    
    if (!userId) {
      console.error(`No user_id found in Paddle webhook custom data for event ${event_id}`);
      return;
    }

    switch (event_type) {
      case 'transaction.completed':
        await handlePaddlePaymentSuccess(userId, data);
        break;
      
      case 'transaction.payment_failed':
        await handlePaddlePaymentFailed(userId, data);
        break;
      
      case 'subscription.created':
      case 'subscription.updated':
        await handlePaddleSubscriptionUpdate(userId, data);
        break;
      
      case 'subscription.canceled':
        await handlePaddleSubscriptionCanceled(userId, data);
        break;
      
      default:
        console.log(`Unhandled Paddle event type: ${event_type}`);
    }

    // Update webhook event status
    await db.update(webhookEvents)
      .set({ 
        status: 'succeeded',
        lastProcessedAt: new Date()
      })
      .where(eq(webhookEvents.eventId, event_id));

  } catch (error) {
    console.error('Failed to process Paddle event:', error);
    
    // Update webhook event with error
    await db.update(webhookEvents)
      .set({ 
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        lastProcessedAt: new Date()
      })
      .where(eq(webhookEvents.eventId, webhookData.event_id));
  }
}

// Helper functions
async function findUserByAnyId(userIds: string[]) {
  for (const id of userIds) {
    const user = await db.select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    if (user.length > 0) {
      return user[0];
    }
  }
  return null;
}

async function handleSubscriptionActivation(userId: string, event: any) {
  console.log(`Activating subscription for user ${userId}`);
  
  // Update user premium status
  await db.update(users)
    .set({ isPremium: true })
    .where(eq(users.id, userId));

  // Create/update entitlements
  if (event.entitlements) {
    for (const [entitlementId, entitlement] of Object.entries(event.entitlements)) {
      const ent = entitlement as { expires_date: string; product_identifier: string; purchase_date: string };
      await db.insert(entitlements).values({
        userId,
        revenuecatUserId: event.app_user_id,
        entitlementId,
        productId: ent.product_identifier,
        status: 'active',
        platform: 'web',
        purchaseDate: new Date(ent.purchase_date),
        expirationDate: new Date(ent.expires_date),
        autoRenewStatus: true
      }).onConflictDoUpdate({
        target: [entitlements.userId, entitlements.entitlementId],
        set: {
          status: 'active',
          expirationDate: new Date(ent.expires_date),
          updatedAt: new Date()
        }
      });
    }
  }
}

async function handleSubscriptionCancellation(userId: string, event: any) {
  console.log(`Cancelling subscription for user ${userId}`);
  
  // Update entitlements status
  await db.update(entitlements)
    .set({ 
      status: 'cancelled',
      autoRenewStatus: false,
      updatedAt: new Date()
    })
    .where(eq(entitlements.userId, userId));
}

async function handleSubscriptionExpiration(userId: string, event: any) {
  console.log(`Subscription expired for user ${userId}`);
  
  // Update user premium status
  await db.update(users)
    .set({ isPremium: false })
    .where(eq(users.id, userId));

  // Update entitlements status
  await db.update(entitlements)
    .set({ 
      status: 'expired',
      updatedAt: new Date()
    })
    .where(eq(entitlements.userId, userId));
}

async function handleBillingIssue(userId: string, event: any) {
  console.log(`Billing issue for user ${userId}`);
  
  // Could send notification, update status, etc.
  // For now, just log the issue
}

async function handleProductChange(userId: string, event: any) {
  console.log(`Product change for user ${userId}`);
  
  // Handle subscription upgrade/downgrade
  if (event.entitlements) {
    for (const [entitlementId, entitlement] of Object.entries(event.entitlements)) {
      const ent = entitlement as { expires_date: string; product_identifier: string; purchase_date: string };
      await db.update(entitlements)
        .set({
          productId: ent.product_identifier,
          purchaseDate: new Date(ent.purchase_date),
          expirationDate: new Date(ent.expires_date),
          updatedAt: new Date()
        })
        .where(and(
          eq(entitlements.userId, userId),
          eq(entitlements.entitlementId, entitlementId)
        ));
    }
  }
}

async function handlePaddlePaymentSuccess(userId: string, data: any) {
  console.log(`Paddle payment success for user ${userId}`);
  
  // Extract RevenueCat product mapping from custom data
  const customData = data.custom_data || {};
  const revenueCatProductId = customData.revenuecat_product_id;
  
  if (revenueCatProductId) {
    // Sync to RevenueCat if needed
    console.log(`Syncing Paddle purchase to RevenueCat: ${revenueCatProductId}`);
  }
}

async function handlePaddlePaymentFailed(userId: string, data: any) {
  console.log(`Paddle payment failed for user ${userId}`);
  
  // Handle failed payment - could send notification, etc.
}

async function handlePaddleSubscriptionUpdate(userId: string, data: any) {
  console.log(`Paddle subscription update for user ${userId}`);
  
  // Update subscription status based on Paddle data
  if (data.status === 'active') {
    await storage.updateUser(userId, { isPremium: true });
  }
}

async function handlePaddleSubscriptionCanceled(userId: string, data: any) {
  console.log(`Paddle subscription canceled for user ${userId}`);
  
  // Handle subscription cancellation
  await storage.updateUser(userId, { isPremium: false });
}

export default router;