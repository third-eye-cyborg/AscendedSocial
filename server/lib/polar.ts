import crypto from 'crypto';

interface PolarConfig {
  accessToken: string;
  webhookSecret?: string;
  server?: 'production' | 'sandbox';
}

export class PolarService {
  private config: PolarConfig;
  private baseUrl: string;
  private initialized: boolean = false;

  constructor(config: PolarConfig) {
    this.config = config;
    this.baseUrl = config.server === 'production' 
      ? 'https://api.polar.sh/v1' 
      : 'https://sandbox-api.polar.sh/v1';
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Verify API connection
      const response = await fetch(`${this.baseUrl}/organizations`, {
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Polar API authentication failed: ${response.statusText}`);
      }

      this.initialized = true;
      console.log('✅ Polar service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Polar service:', error);
      throw error;
    }
  }

  async createCheckout(params: {
    productPriceId: string;
    email?: string;
    customData?: Record<string, any>;
    successUrl?: string;
  }): Promise<{ url: string; id: string }> {
    if (!this.initialized) {
      throw new Error('Polar service not initialized');
    }

    const payload: any = {
      product_price_id: params.productPriceId,
    };

    if (params.successUrl) {
      payload.success_url = params.successUrl;
    }

    if (params.email) {
      payload.customer_email = params.email;
    }

    if (params.customData) {
      payload.metadata = params.customData;
    }

    const response = await fetch(`${this.baseUrl}/checkouts/custom`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Failed to create checkout: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      url: data.url,
      id: data.id,
    };
  }

  async getSubscription(subscriptionId: string) {
    if (!this.initialized) {
      throw new Error('Polar service not initialized');
    }

    const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get subscription: ${response.statusText}`);
    }

    return await response.json();
  }

  async listSubscriptions(params?: { customerId?: string }) {
    if (!this.initialized) {
      throw new Error('Polar service not initialized');
    }

    const queryParams = new URLSearchParams();
    if (params?.customerId) {
      queryParams.append('customer_id', params.customerId);
    }

    const url = `${this.baseUrl}/subscriptions?${queryParams}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list subscriptions: ${response.statusText}`);
    }

    return await response.json();
  }

  async cancelSubscription(subscriptionId: string) {
    if (!this.initialized) {
      throw new Error('Polar service not initialized');
    }

    const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel subscription: ${response.statusText}`);
    }

    return await response.json();
  }

  validateWebhookSignature(payload: string, signature: string): boolean {
    if (!this.config.webhookSecret) {
      console.warn('Webhook secret not configured');
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.config.webhookSecret)
      .update(payload)
      .digest('hex');
    
    return expectedSignature === signature;
  }

  async processWebhookEvent(event: any): Promise<void> {
    const eventType = event.type;
    
    console.log(`Processing Polar webhook: ${eventType}`);

    switch (eventType) {
      case 'subscription.created':
        console.log('Subscription created:', event.data);
        break;
      case 'subscription.updated':
        console.log('Subscription updated:', event.data);
        break;
      case 'subscription.canceled':
        console.log('Subscription canceled:', event.data);
        break;
      case 'subscription.revoked':
        console.log('Subscription revoked:', event.data);
        break;
      case 'order.created':
        console.log('Order created:', event.data);
        break;
      case 'checkout.created':
        console.log('Checkout created:', event.data);
        break;
      case 'checkout.updated':
        console.log('Checkout updated:', event.data);
        break;
      default:
        console.log('Unhandled webhook event:', eventType);
    }
  }
}

let polarService: PolarService | null = null;

export function getPolarService(): PolarService | null {
  if (polarService) {
    return polarService;
  }

  const accessToken = process.env.POLAR_ACCESS_TOKEN;
  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
  const server = (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'production' | 'sandbox';

  if (!accessToken) {
    console.log('ℹ️ Polar not configured (missing access token)');
    return null;
  }

  polarService = new PolarService({
    accessToken,
    webhookSecret,
    server
  });

  polarService.initialize().catch(console.error);
  
  return polarService;
}
