import { Router } from 'express';
import { z } from 'zod';
import { getRevenueCatManager } from '../lib/revenuecat-integration';

const router = Router();

// Initialize RevenueCat manager
const revenueCatConfig = {
  publicKey: process.env.REVENUECAT_PUBLIC_KEY || '',
  secretKey: process.env.REVENUECAT_SECRET_KEY || '',
  paddleVendorId: process.env.PADDLE_VENDOR_ID || '',
  paddleApiKey: process.env.PADDLE_API_KEY || '',
  webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || '',
  enableTestMode: process.env.NODE_ENV !== 'production'
};

const revenueCatManager = getRevenueCatManager(revenueCatConfig);

// Initialize on startup
revenueCatManager.initialize().catch(console.error);

/**
 * Get available subscription products
 * GET /api/payments/products
 */
router.get('/products', async (req, res) => {
  try {
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