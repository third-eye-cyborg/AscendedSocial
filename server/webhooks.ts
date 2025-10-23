import express from 'express';
import { z } from 'zod';
import { storage } from './storage';
import { InsertWebhookEvent } from '@shared/schema';
import crypto from 'crypto';

const router = express.Router();

// Webhook verification middleware for Polar
const verifyPolarWebhook = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const signature = req.headers['x-polar-signature'] as string;
    
    if (!signature) {
      return res.status(401).json({ error: 'Missing Polar signature' });
    }

    // Get raw body for signature verification
    const rawBody = JSON.stringify(req.body);
    
    // Verify signature using webhook secret
    const expectedSignature = crypto
      .createHmac('sha256', process.env.POLAR_WEBHOOK_SECRET || '')
      .update(rawBody)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      console.error('Polar webhook signature verification failed');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    next();
  } catch (error) {
    console.error('Polar webhook verification failed:', error);
    res.status(500).json({ error: 'Webhook verification failed' });
  }
};

// Polar webhook event schema
const polarEventSchema = z.object({
  id: z.string(),
  type: z.enum([
    'checkout.created',
    'checkout.updated',
    'subscription.created',
    'subscription.updated',
    'subscription.canceled',
    'subscription.revoked',
    'payment.succeeded',
    'payment.failed'
  ]),
  data: z.record(z.any()),
  created_at: z.string(),
});

// Polar webhook handler
router.post('/webhooks/polar', verifyPolarWebhook, async (req, res) => {
  try {
    const validatedData = polarEventSchema.parse(req.body);
    const { id: event_id, type: event_type, data } = validatedData;

    console.log(`Polar webhook: ${event_type} for event ${event_id}`);

    // Store webhook event for processing
    const webhookEvent: InsertWebhookEvent = {
      eventId: event_id,
      type: `polar.${event_type}` as any,
      source: 'polar',
      payload: data,
      signature: req.headers['x-polar-signature'] as string,
      status: 'pending',
    };

    await storage.createWebhookEvent(webhookEvent);

    // Process webhook asynchronously
    setImmediate(() => processPolarEvent(validatedData));

    // Respond immediately to Polar
    res.json({ received: true });
    
  } catch (error) {
    console.error('Polar webhook processing error:', error);
    res.status(400).json({ error: 'Invalid webhook payload' });
  }
});

// Process Polar webhook events
async function processPolarEvent(webhookData: any) {
  const { id: event_id, type: event_type, data } = webhookData;

  try {
    // Extract user ID from custom data
    const userId = data.custom_data?.user_id;
    
    if (!userId) {
      console.error(`No user_id found in Polar webhook custom data for event ${event_id}`);
      return;
    }

    // Find user by ID
    const user = await storage.getUserById(userId);
    if (!user) {
      console.error(`No user found for Polar webhook event ${event_id}`);
      return;
    }

    // Handle different event types
    switch (event_type) {
      case 'checkout.created':
        console.log(`Checkout created for user ${userId}`);
        break;

      case 'subscription.created':
        await handlePolarSubscriptionCreated(userId, data);
        break;

      case 'subscription.updated':
        await handlePolarSubscriptionUpdate(userId, data);
        break;

      case 'subscription.canceled':
        await handlePolarSubscriptionCanceled(userId, data);
        break;

      case 'payment.succeeded':
        await handlePolarPaymentSuccess(userId, data);
        break;

      case 'payment.failed':
        await handlePolarPaymentFailed(userId, data);
        break;

      default:
        console.log(`Unhandled Polar event type: ${event_type}`);
    }

    // Update webhook event status to succeeded
    await storage.updateWebhookEventStatus(event_id, 'succeeded');

  } catch (error) {
    console.error('Failed to process Polar event:', error);
    
    // Update webhook event with error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await storage.updateWebhookEventStatus(event_id, 'failed', errorMessage);
  }
}

// Handler functions for Polar events
async function handlePolarSubscriptionCreated(userId: string, data: any) {
  console.log(`Processing subscription creation for user ${userId}`);
  
  // Update user to premium status
  await storage.updateUserPremiumStatus(userId, {
    isPremium: true,
    polarSubscriptionId: data.id,
    polarCustomerId: data.customer_id
  });
}

async function handlePolarSubscriptionUpdate(userId: string, data: any) {
  console.log(`Processing subscription update for user ${userId}`);
  
  // Update subscription details if needed
  await storage.updateUserPremiumStatus(userId, {
    polarSubscriptionId: data.id
  });
}

async function handlePolarSubscriptionCanceled(userId: string, data: any) {
  console.log(`Processing subscription cancellation for user ${userId}`);
  
  // Remove premium status
  await storage.updateUserPremiumStatus(userId, {
    isPremium: false,
    polarSubscriptionId: null
  });
}

async function handlePolarPaymentSuccess(userId: string, data: any) {
  console.log(`Processing successful payment for user ${userId}`);
  
  // Payment succeeded - subscription should already be active
}

async function handlePolarPaymentFailed(userId: string, data: any) {
  console.log(`Processing failed payment for user ${userId}`);
  
  // Handle failed payment - might need to notify user or downgrade
}

export default router;
