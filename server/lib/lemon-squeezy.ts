import { 
  lemonSqueezySetup, 
  createCheckout,
  getCheckout,
  listSubscriptions,
  getSubscription,
  updateSubscription,
  cancelSubscription as lsCancelSubscription,
  type Checkout,
  type Subscription
} from '@lemonsqueezy/lemonsqueezy.js';

interface LemonSqueezyConfig {
  apiKey: string;
  storeId: string;
  webhookSecret?: string;
}

export class LemonSqueezyService {
  private config: LemonSqueezyConfig;
  private initialized: boolean = false;

  constructor(config: LemonSqueezyConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    lemonSqueezySetup({
      apiKey: this.config.apiKey,
      onError: (error) => {
        console.error('Lemon Squeezy API Error:', error);
      }
    });

    this.initialized = true;
    console.log('✅ Lemon Squeezy initialized successfully');
  }

  async createCheckoutSession(params: {
    variantId: string;
    email?: string;
    customData?: Record<string, any>;
  }): Promise<{ url: string; id: string }> {
    if (!this.initialized) {
      throw new Error('Lemon Squeezy service not initialized');
    }

    const checkoutOptions: any = {};
    
    if (params.email || params.customData) {
      checkoutOptions.checkoutData = {
        email: params.email,
        custom: params.customData
      };
    }

    const { data, error } = await createCheckout(
      this.config.storeId,
      params.variantId,
      checkoutOptions
    );

    if (error) {
      throw new Error(`Failed to create checkout: ${error.message}`);
    }

    if (!data) {
      throw new Error('No checkout data returned');
    }

    return {
      url: data.data.attributes.url,
      id: data.data.id
    };
  }

  async getCheckoutById(checkoutId: string) {
    if (!this.initialized) {
      throw new Error('Lemon Squeezy service not initialized');
    }

    const { data, error } = await getCheckout(checkoutId);
    
    if (error) {
      throw new Error(`Failed to get checkout: ${error.message}`);
    }

    return data;
  }

  async getSubscriptionStatus(subscriptionId: string) {
    if (!this.initialized) {
      throw new Error('Lemon Squeezy service not initialized');
    }

    const { data, error } = await getSubscription(subscriptionId);
    
    if (error) {
      throw new Error(`Failed to get subscription: ${error.message}`);
    }

    return data;
  }

  async getUserSubscriptions(customerId: string) {
    if (!this.initialized) {
      throw new Error('Lemon Squeezy service not initialized');
    }

    const { data, error } = await listSubscriptions({
      filter: {
        storeId: this.config.storeId
      }
    });
    
    if (error) {
      throw new Error(`Failed to list subscriptions: ${error.message}`);
    }

    return data;
  }

  async pauseSubscription(subscriptionId: string) {
    if (!this.initialized) {
      throw new Error('Lemon Squeezy service not initialized');
    }

    const { data, error } = await updateSubscription(subscriptionId, {
      pause: {
        mode: 'void'
      }
    });

    if (error) {
      throw new Error(`Failed to pause subscription: ${error.message}`);
    }

    return data;
  }

  async cancelSubscription(subscriptionId: string) {
    if (!this.initialized) {
      throw new Error('Lemon Squeezy service not initialized');
    }

    const { data, error } = await lsCancelSubscription(subscriptionId);

    if (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }

    return data;
  }

  validateWebhookSignature(payload: string, signature: string): boolean {
    if (!this.config.webhookSecret) {
      console.warn('Webhook secret not configured');
      return false;
    }

    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha256', this.config.webhookSecret)
      .update(payload)
      .digest('hex');
    
    return hash === signature;
  }

  async processWebhookEvent(event: any): Promise<void> {
    const eventType = event.meta?.event_name;
    
    console.log(`Processing Lemon Squeezy webhook: ${eventType}`);

    switch (eventType) {
      case 'subscription_created':
        console.log('Subscription created:', event.data);
        break;
      case 'subscription_updated':
        console.log('Subscription updated:', event.data);
        break;
      case 'subscription_cancelled':
        console.log('Subscription cancelled:', event.data);
        break;
      case 'subscription_resumed':
        console.log('Subscription resumed:', event.data);
        break;
      case 'subscription_expired':
        console.log('Subscription expired:', event.data);
        break;
      case 'subscription_paused':
        console.log('Subscription paused:', event.data);
        break;
      case 'subscription_unpaused':
        console.log('Subscription unpaused:', event.data);
        break;
      case 'order_created':
        console.log('Order created:', event.data);
        break;
      default:
        console.log('Unhandled webhook event:', eventType);
    }
  }
}

let lemonSqueezyService: LemonSqueezyService | null = null;

export function getLemonSqueezyService(): LemonSqueezyService | null {
  if (lemonSqueezyService) {
    return lemonSqueezyService;
  }

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  if (!apiKey || !storeId) {
    console.log('ℹ️ Lemon Squeezy not configured (missing API key or store ID)');
    return null;
  }

  lemonSqueezyService = new LemonSqueezyService({
    apiKey,
    storeId,
    webhookSecret
  });

  lemonSqueezyService.initialize().catch(console.error);
  
  return lemonSqueezyService;
}
