import { Router } from 'express';
import { z } from 'zod';
import { getLemonSqueezyService } from '../lib/lemon-squeezy';

const router = Router();

// Initialize Lemon Squeezy service
const lemonSqueezy = getLemonSqueezyService();

// Validation schema for checkout request
const checkoutSchema = z.object({
  productId: z.enum(['mystic_monthly', 'ascended_monthly'], {
    errorMap: () => ({ message: 'Product ID must be either mystic_monthly or ascended_monthly' })
  }),
  plan: z.string().min(1, 'Plan name is required')
});

/**
 * Get Lemon Squeezy configuration  
 * GET /api/payments/config
 */
router.get('/config', async (req, res) => {
  try {
    res.json({
      storeId: process.env.LEMONSQUEEZY_STORE_ID || '',
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
    });
  } catch (error) {
    console.error('Config fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch config'
    });
  }
});

/**
 * Create checkout session (Lemon Squeezy)
 * POST /api/payments/checkout
 */
router.post('/checkout', async (req, res) => {
  try {
    // Validate request body
    const validation = checkoutSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.errors[0].message
      });
    }

    const { productId, plan } = validation.data;

    // Map product IDs to Lemon Squeezy variant IDs
    // IMPORTANT: Set these environment variables to match your Lemon Squeezy product configuration:
    // - LEMONSQUEEZY_VARIANT_ID_MYSTIC: Variant ID for Mystic plan ($12/month)
    // - LEMONSQUEEZY_VARIANT_ID_ASCENDED: Variant ID for Ascended plan ($24/month)
    // To find your Lemon Squeezy variant IDs:
    // 1. Log into your Lemon Squeezy dashboard
    // 2. Go to Products
    // 3. Copy the variant IDs for each subscription tier
    const productMapping: Record<string, { name: string, variantId: string | undefined, price: string }> = {
      'mystic_monthly': { 
        name: 'Mystic Plan', 
        variantId: process.env.LEMONSQUEEZY_VARIANT_ID_MYSTIC,
        price: '$12/month' 
      },
      'ascended_monthly': { 
        name: 'Ascended Plan', 
        variantId: process.env.LEMONSQUEEZY_VARIANT_ID_ASCENDED,
        price: '$24/month' 
      },
    };

    const product = productMapping[productId];
    if (!product) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID'
      });
    }

    // Check if Lemon Squeezy variant ID is configured
    if (!product.variantId) {
      console.error(`Lemon Squeezy variant ID not configured for product: ${productId}`);
      return res.status(500).json({
        success: false,
        error: 'Payment system is not fully configured. Please contact support.'
      });
    }

    if (!lemonSqueezy) {
      return res.status(503).json({
        success: false,
        error: 'Payment service is not available. Please contact support.'
      });
    }

    // Create checkout session
    const checkout = await lemonSqueezy.createCheckoutSession({
      variantId: product.variantId,
      email: (req.user as any)?.email,
      customData: {
        userId: (req.user as any)?.id,
        plan: plan
      }
    });

    // Return checkout URL for redirect
    res.json({
      success: true,
      checkout: {
        productId,
        productName: product.name,
        price: product.price,
        checkoutUrl: checkout.url,
        checkoutId: checkout.id
      }
    });
  } catch (error) {
    console.error('Checkout creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session'
    });
  }
});

/**
 * Get user's subscription status
 * GET /api/payments/subscription
 */
router.get('/subscription', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!lemonSqueezy) {
      return res.status(503).json({
        success: false,
        error: 'Payment service not available'
      });
    }

    // In a real app, you'd store the subscription ID in your database
    // For now, return a placeholder response
    res.json({ 
      subscription: null,
      message: 'No active subscription found'
    });
  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get subscription status'
    });
  }
});

/**
 * Cancel subscription
 * POST /api/payments/cancel
 */
router.post('/cancel', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!lemonSqueezy) {
      return res.status(503).json({
        success: false,
        error: 'Payment service not available'
      });
    }

    const { subscriptionId } = req.body;
    
    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        error: 'Subscription ID is required'
      });
    }

    await lemonSqueezy.cancelSubscription(subscriptionId);
    
    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel subscription'
    });
  }
});

/**
 * Lemon Squeezy webhook endpoint
 * POST /api/webhooks/lemon-squeezy
 */
router.post('/webhooks/lemon-squeezy', async (req, res) => {
  try {
    if (!lemonSqueezy) {
      console.error('Lemon Squeezy webhook received but service not initialized');
      return res.status(503).json({ error: 'Payment service not available' });
    }

    const signature = req.get('X-Signature');
    const payload = JSON.stringify(req.body);
    
    // Verify webhook signature
    if (!lemonSqueezy.validateWebhookSignature(payload, signature || '')) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    await lemonSqueezy.processWebhookEvent(req.body);
    res.json({ received: true });
    
  } catch (error) {
    console.error('Lemon Squeezy webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
