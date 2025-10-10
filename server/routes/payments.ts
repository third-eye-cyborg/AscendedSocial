import { Router } from 'express';
import { z } from 'zod';
import { getPolarService } from '../lib/polar';

const router = Router();

// Initialize Polar service
const polar = getPolarService();

// Validation schema for checkout request
const checkoutSchema = z.object({
  productId: z.enum(['mystic_monthly', 'ascended_monthly'], {
    errorMap: () => ({ message: 'Product ID must be either mystic_monthly or ascended_monthly' })
  }),
  plan: z.string().min(1, 'Plan name is required')
});

/**
 * Get Polar configuration  
 * GET /api/payments/config
 */
router.get('/config', async (req, res) => {
  try {
    res.json({
      provider: 'polar',
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
 * Create checkout session (Polar)
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

    // Map product IDs to Polar price IDs
    // IMPORTANT: Set these environment variables to match your Polar product configuration:
    // - POLAR_PRICE_ID_MYSTIC: Price ID for Mystic plan ($12/month)
    // - POLAR_PRICE_ID_ASCENDED: Price ID for Ascended plan ($24/month)
    // You can find these in your Polar dashboard under Products
    const productMapping: Record<string, { name: string, priceId: string | undefined, price: string }> = {
      'mystic_monthly': { 
        name: 'Mystic Plan', 
        priceId: process.env.POLAR_PRICE_ID_MYSTIC,
        price: '$12/month' 
      },
      'ascended_monthly': { 
        name: 'Ascended Plan', 
        priceId: process.env.POLAR_PRICE_ID_ASCENDED,
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

    // Check if Polar price ID is configured
    if (!product.priceId) {
      console.error(`Polar price ID not configured for product: ${productId}`);
      return res.status(500).json({
        success: false,
        error: 'Payment system is not fully configured. Please contact support.'
      });
    }

    if (!polar) {
      return res.status(503).json({
        success: false,
        error: 'Payment service is not available. Please contact support.'
      });
    }

    // Create checkout session
    const checkout = await polar.createCheckout({
      productPriceId: product.priceId,
      email: (req.user as any)?.email,
      customData: {
        userId: (req.user as any)?.id,
        plan: plan
      },
      successUrl: `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscription-success`
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

    if (!polar) {
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

    if (!polar) {
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

    await polar.cancelSubscription(subscriptionId);
    
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
 * Polar webhook endpoint
 * POST /api/webhooks/polar
 */
router.post('/webhooks/polar', async (req, res) => {
  try {
    if (!polar) {
      console.error('Polar webhook received but service not initialized');
      return res.status(503).json({ error: 'Payment service not available' });
    }

    const signature = req.get('Polar-Signature') || req.get('X-Polar-Signature') || '';
    const payload = JSON.stringify(req.body);
    
    // Verify webhook signature
    if (!polar.validateWebhookSignature(payload, signature)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    await polar.processWebhookEvent(req.body);
    res.status(202).json({ received: true });
    
  } catch (error) {
    console.error('Polar webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
