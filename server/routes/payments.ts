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
      status: 'coming_soon',
      message: 'Payment processing is coming soon',
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
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
    // Payment processing is currently unavailable
    return res.status(503).json({
      success: false,
      error: 'Payment processing is coming soon. Premium subscriptions are not yet available.'
    });

    // The code below will be used once Polar integration is complete:
    /*
    const validation = checkoutSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.errors[0].message
      });
    }

    const { productId, plan } = validation.data;

    const productMapping: Record<string, { name: string, polarProductId: string | undefined, price: string }> = {
      'mystic_monthly': { 
        name: 'Mystic Plan', 
        polarProductId: process.env.POLAR_PRODUCT_ID_MYSTIC,
        price: '$12/month' 
      },
      'ascended_monthly': { 
        name: 'Ascended Plan', 
        polarProductId: process.env.POLAR_PRODUCT_ID_ASCENDED,
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

    if (!product.polarProductId) {
      console.error(`Polar product ID not configured for: ${productId}`);
      return res.status(500).json({
        success: false,
        error: 'Payment system is not fully configured.'
      });
    }

    if (!polar) {
      return res.status(503).json({
        success: false,
        error: 'Payment service is not available.'
      });
    }

    const checkout = await polar.createCheckoutSession({
      productId: product.polarProductId,
      email: (req.user as any)?.email,
      customData: {
        userId: (req.user as any)?.id,
        plan: plan
      }
    });

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
    */
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

    res.json({ 
      subscription: null,
      status: 'coming_soon',
      message: 'Premium subscriptions are coming soon'
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

    return res.status(503).json({
      success: false,
      error: 'Subscription management is coming soon'
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

    const signature = req.get('X-Polar-Signature');
    const payload = JSON.stringify(req.body);
    
    // Verify webhook signature
    if (!polar.validateWebhookSignature(payload, signature || '')) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    await polar.processWebhookEvent(req.body);
    res.json({ received: true });
    
  } catch (error) {
    console.error('Polar webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
