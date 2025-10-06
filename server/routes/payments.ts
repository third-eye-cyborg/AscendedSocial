import { Router } from 'express';
import { z } from 'zod';
import { getRevenueCatManager } from '../lib/revenuecat-integration';

const router = Router();

// Initialize RevenueCat manager (optional - only if credentials are fully configured)
let revenueCatManager: any = null;

try {
  const revenueCatConfig = {
    publicKey: process.env.REVENUECAT_PUBLIC_KEY || '',
    secretKey: process.env.REVENUECAT_SECRET_KEY || '',
    paddleVendorId: process.env.PADDLE_VENDOR_ID || '',
    paddleApiKey: process.env.PADDLE_API_KEY || '',
    webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || '',
    enableTestMode: process.env.NODE_ENV !== 'production'
  };

  // Only initialize if we have the required credentials
  if (revenueCatConfig.publicKey && revenueCatConfig.secretKey) {
    revenueCatManager = getRevenueCatManager(revenueCatConfig);
    revenueCatManager.initialize().catch(console.error);
  } else {
    console.log('ℹ️ RevenueCat manager not initialized - using direct Paddle integration');
  }
} catch (error) {
  console.error('Failed to initialize RevenueCat manager:', error);
}

/**
 * Get RevenueCat configuration (public key)
 * GET /api/payments/config
 */
router.get('/config', async (req, res) => {
  try {
    res.json({
      publicKey: process.env.REVENUECAT_PUBLIC_KEY || '',
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
 * Get available subscription products
 * GET /api/payments/products
 */
router.get('/products', async (req, res) => {
  try {
    if (!revenueCatManager) {
      return res.status(503).json({
        success: false,
        error: 'RevenueCat service not available'
      });
    }
    
    const products = await revenueCatManager.getProducts();
    res.json({ products });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

/**
 * Create customer in RevenueCat
 * POST /api/payments/customer
 */
router.post('/customer', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!revenueCatManager) {
      return res.status(503).json({
        success: false,
        error: 'RevenueCat service not available'
      });
    }

    const customerId = await revenueCatManager.createCustomer(
      (req.user as any).id,
      (req.user as any).email
    );
    
    res.json({
      success: true,
      customerId
    });
  } catch (error) {
    console.error('Customer creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create customer'
    });
  }
});

// Validation schema for checkout request
const checkoutSchema = z.object({
  productId: z.enum(['mystic_monthly', 'ascended_monthly'], {
    errorMap: () => ({ message: 'Product ID must be either mystic_monthly or ascended_monthly' })
  }),
  plan: z.string().min(1, 'Plan name is required')
});

/**
 * Create checkout session (Paddle via RevenueCat)
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

    // Map product IDs to Paddle price IDs
    // IMPORTANT: Set these environment variables to match your Paddle product configuration:
    // - PADDLE_PRICE_ID_MYSTIC: Price ID for Mystic plan ($12/month)
    // - PADDLE_PRICE_ID_ASCENDED: Price ID for Ascended plan ($24/month)
    // To find your Paddle price IDs:
    // 1. Log into your Paddle dashboard
    // 2. Go to Catalog > Products
    // 3. Copy the price IDs for each subscription tier
    const productMapping: Record<string, { name: string, priceId: string | undefined, price: string }> = {
      'mystic_monthly': { 
        name: 'Mystic Plan', 
        priceId: process.env.PADDLE_PRICE_ID_MYSTIC,
        price: '$12/month' 
      },
      'ascended_monthly': { 
        name: 'Ascended Plan', 
        priceId: process.env.PADDLE_PRICE_ID_ASCENDED,
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

    // Check if Paddle price ID is configured
    if (!product.priceId) {
      console.error(`Paddle price ID not configured for product: ${productId}`);
      return res.status(500).json({
        success: false,
        error: 'Payment system is not fully configured. Please contact support.'
      });
    }

    // Return checkout configuration for Paddle
    res.json({
      success: true,
      checkout: {
        productId,
        priceId: product.priceId,
        productName: product.name,
        price: product.price,
        clientToken: process.env.REVENUECAT_PUBLIC_KEY || '',
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
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
 * Initiate subscription purchase
 * POST /api/payments/subscribe
 */
router.post('/subscribe', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!revenueCatManager) {
      return res.status(503).json({
        success: false,
        error: 'RevenueCat service not available'
      });
    }

    const { productId, paymentData } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required'
      });
    }

    const result = await revenueCatManager.purchaseSubscription(
      (req.user as any).id,
      productId,
      paymentData
    );
    
    res.json(result);
  } catch (error) {
    console.error('Subscription purchase error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process subscription'
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

    if (!revenueCatManager) {
      return res.status(503).json({
        success: false,
        error: 'RevenueCat service not available'
      });
    }

    const subscription = await revenueCatManager.getSubscriptionStatus((req.user as any).id);
    res.json({ subscription });
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

    if (!revenueCatManager) {
      return res.status(503).json({
        success: false,
        error: 'RevenueCat service not available'
      });
    }

    const { subscriptionId } = req.body;
    
    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        error: 'Subscription ID is required'
      });
    }

    const success = await revenueCatManager.cancelSubscription(
      (req.user as any).id,
      subscriptionId
    );
    
    if (success) {
      res.json({
        success: true,
        message: 'Subscription cancelled successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to cancel subscription'
      });
    }
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel subscription'
    });
  }
});

/**
 * Get subscription analytics (admin only)
 * GET /api/payments/analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    // Add admin authentication check here
    if (!(req.user as any)?.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    if (!revenueCatManager) {
      return res.status(503).json({
        success: false,
        error: 'RevenueCat service not available'
      });
    }

    const analytics = await revenueCatManager.getSubscriptionAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

/**
 * RevenueCat webhook endpoint
 * POST /api/payments/webhooks/revenuecat
 */
router.post('/webhooks/revenuecat', async (req, res) => {
  try {
    if (!revenueCatManager) {
      console.error('RevenueCat webhook received but RevenueCat manager not initialized');
      return res.status(503).json({ error: 'RevenueCat service not available' });
    }

    const signature = req.get('X-RevenueCat-Signature');
    const payload = JSON.stringify(req.body);
    
    // Verify webhook signature
    if (!revenueCatManager.validateWebhookSignature(payload, signature || '')) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    await revenueCatManager.processWebhookEvent('revenuecat', req.body);
    res.json({ received: true });
    
  } catch (error) {
    console.error('RevenueCat webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * Paddle webhook endpoint
 * POST /api/payments/webhooks/paddle
 */
router.post('/webhooks/paddle', async (req, res) => {
  try {
    if (!revenueCatManager) {
      console.error('Paddle webhook received but RevenueCat manager not initialized');
      return res.status(503).json({ error: 'RevenueCat service not available' });
    }

    const signature = req.get('X-Paddle-Signature');
    const payload = JSON.stringify(req.body);
    
    // Verify webhook signature
    if (!revenueCatManager.validateWebhookSignature(payload, signature || '')) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    await revenueCatManager.processWebhookEvent('paddle', req.body);
    res.json({ received: true });
    
  } catch (error) {
    console.error('Paddle webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;