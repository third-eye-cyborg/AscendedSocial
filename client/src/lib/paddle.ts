// Paddle Billing integration
import { initializePaddle, getPaddleInstance } from '@paddle/paddle-js';

interface PaddleConfig {
  vendorId: string;
  environment: 'sandbox' | 'production';
  checkout?: {
    displayMode?: 'inline' | 'overlay';
    theme?: 'light' | 'dark';
    locale?: string;
  };
}

interface PaddleProduct {
  paddleProductId: string;
  revenueCatProductId: string;
  name: string;
  price: string;
  billingCycle: 'monthly' | 'yearly' | 'one-time';
  description?: string;
}

export class PaddleService {
  private paddle: any = null;
  private isInitialized = false;
  private config: PaddleConfig | null = null;

  /**
   * Initialize Paddle SDK
   */
  async initialize(config: PaddleConfig): Promise<void> {
    try {
      if (this.isInitialized) {
        console.warn('Paddle already initialized');
        return;
      }

      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        console.warn('Paddle SDK can only be used in browser environment');
        return;
      }

      // Initialize Paddle SDK
      await initializePaddle({
        environment: config.environment,
        seller: parseInt(config.vendorId),
        checkout: {
          settings: {
            displayMode: config.checkout?.displayMode || 'overlay',
            theme: config.checkout?.theme || 'dark',
            locale: config.checkout?.locale || 'en',
            allowLogout: false,
            frameTarget: 'self',
            frameInitialHeight: 450
          }
        }
      });

      this.paddle = getPaddleInstance();
      this.config = config;
      this.isInitialized = true;
      console.log('Paddle initialized successfully');

    } catch (error) {
      console.error('Failed to initialize Paddle:', error);
      throw error;
    }
  }

  /**
   * Get Paddle instance
   */
  private getInstance(): any {
    if (!this.isInitialized || !this.paddle) {
      throw new Error('Paddle not initialized. Call initialize() first.');
    }
    return this.paddle;
  }

  /**
   * Open checkout for a product
   */
  async openCheckout(options: any): Promise<void> {
    try {
      const paddle = this.getInstance();
      await paddle.Checkout.open(options);
    } catch (error) {
      console.error('Failed to open Paddle checkout:', error);
      throw error;
    }
  }

  /**
   * Purchase a product with simplified parameters
   */
  async purchaseProduct(
    productId: string, 
    customerEmail?: string,
    customData?: Record<string, any>
  ): Promise<void> {
    try {
      const checkoutOptions: any = {
        items: [{ priceId: productId, quantity: 1 }],
        settings: {
          displayMode: this.config?.checkout?.displayMode || 'overlay',
          theme: this.config?.checkout?.theme || 'dark',
          locale: this.config?.checkout?.locale || 'en'
        }
      };

      // Add customer email if provided
      if (customerEmail) {
        checkoutOptions.customer = { email: customerEmail };
      }

      // Add custom data if provided
      if (customData) {
        checkoutOptions.customData = customData;
      }

      await this.openCheckout(checkoutOptions);
    } catch (error) {
      console.error('Failed to purchase product:', error);
      throw error;
    }
  }

  /**
   * Get price preview for products
   */
  async getPricePreview(request: any): Promise<any> {
    try {
      const paddle = this.getInstance();
      return await paddle.PricePreview(request);
    } catch (error) {
      console.error('Failed to get price preview:', error);
      throw error;
    }
  }

  /**
   * Update checkout settings
   */
  updateSettings(settings: any): void {
    try {
      const paddle = this.getInstance();
      paddle.Update({
        checkout: {
          settings: {
            ...this.config?.checkout,
            ...settings
          }
        }
      });
    } catch (error) {
      console.error('Failed to update Paddle settings:', error);
      throw error;
    }
  }

  /**
   * Check initialization status
   */
  isInitializedAndReady(): boolean {
    return this.isInitialized && this.paddle !== null;
  }

  /**
   * Get current configuration
   */
  getConfig(): PaddleConfig | null {
    return this.config;
  }
}

// Export singleton instance
export const paddleService = new PaddleService();

// Helper function to initialize Paddle with environment variables
export const initializePaddleService = async (): Promise<void> => {
  const vendorId = import.meta.env.VITE_PADDLE_VENDOR_ID;
  const environment = (import.meta.env.VITE_PADDLE_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';

  if (!vendorId) {
    console.warn('VITE_PADDLE_VENDOR_ID not found - Paddle features will be disabled');
    return;
  }

  await paddleService.initialize({
    vendorId,
    environment,
    checkout: {
      displayMode: 'overlay',
      theme: 'dark',
      locale: 'en'
    }
  });
};

// Product constants based on config
export const PADDLE_PRODUCTS = {
  PREMIUM_MONTHLY: 'premium_monthly',
  PREMIUM_YEARLY: 'premium_yearly',
  ENERGY_BOOST: 'energy_boost'
} as const;

export type PaddleProductId = typeof PADDLE_PRODUCTS[keyof typeof PADDLE_PRODUCTS];

// Helper to create checkout data with RevenueCat mapping
export const createCheckoutData = (
  userId: string,
  productId: PaddleProductId,
  revenueCatProductId: string
) => ({
  user_id: userId,
  revenuecat_product_id: revenueCatProductId,
  paddle_product_id: productId,
  timestamp: Date.now()
});