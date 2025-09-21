// RevenueCat Web SDK integration
// Note: RevenueCat Web SDK is designed for client-side use only

interface RevenueCatConfig {
  apiKey: string;
  appUserId?: string;
}

interface CustomerInfo {
  entitlements: {
    active: Record<string, any>;
    all: Record<string, any>;
  };
  originalAppUserId: string;
  originalApplicationVersion: string;
  requestDate: string;
  firstSeen: string;
  managementURL: string | null;
}

interface PurchaseResult {
  customerInfo: CustomerInfo;
  error?: Error;
}

export class RevenueCatService {
  private purchases: any = null;
  private isConfigured = false;

  /**
   * Configure RevenueCat SDK
   */
  async configure(config: RevenueCatConfig): Promise<void> {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        console.warn('RevenueCat Web SDK can only be used in browser environment');
        return;
      }

      // Dynamically import RevenueCat SDK to avoid SSR issues
      const { Purchases } = await import('@revenuecat/purchases-js');
      
      // Ensure we only configure once
      if (this.isConfigured) {
        console.warn('RevenueCat already configured');
        return;
      }

      this.purchases = Purchases.configure({
        apiKey: config.apiKey,
        appUserId: config.appUserId || undefined
      });

      this.isConfigured = true;
      console.log('RevenueCat configured successfully');

    } catch (error) {
      console.error('Failed to configure RevenueCat:', error);
      throw error;
    }
  }

  /**
   * Get RevenueCat instance
   */
  private async getInstance(): Promise<any> {
    if (!this.isConfigured || !this.purchases) {
      throw new Error('RevenueCat not configured. Call configure() first.');
    }
    return this.purchases;
  }

  /**
   * Get current customer info including entitlements
   */
  async getCustomerInfo(): Promise<CustomerInfo> {
    try {
      const purchases = await this.getInstance();
      return await purchases.getCustomerInfo();
    } catch (error) {
      console.error('Failed to get customer info:', error);
      throw error;
    }
  }

  /**
   * Get available offerings and packages
   */
  async getOfferings(): Promise<any[]> {
    try {
      const purchases = await this.getInstance();
      const offerings = await purchases.getOfferings();
      return Object.values(offerings.all || {});
    } catch (error) {
      console.error('Failed to get offerings:', error);
      throw error;
    }
  }

  /**
   * Purchase a package
   */
  async purchasePackage(packageToPurchase: any): Promise<PurchaseResult> {
    try {
      const purchases = await this.getInstance();
      const result = await purchases.purchasePackage(packageToPurchase);
      
      return {
        customerInfo: result.customerInfo,
        error: undefined
      };
    } catch (error) {
      console.error('Purchase failed:', error);
      return {
        customerInfo: {} as CustomerInfo,
        error: error as Error
      };
    }
  }

  /**
   * Check if user has active entitlement
   */
  async hasActiveEntitlement(entitlementId: string): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      const entitlement = customerInfo.entitlements.active[entitlementId];
      return !!entitlement;
    } catch (error) {
      console.error('Failed to check entitlement:', error);
      return false;
    }
  }

  /**
   * Get all active entitlements
   */
  async getActiveEntitlements(): Promise<Record<string, any>> {
    try {
      const customerInfo = await this.getCustomerInfo();
      return customerInfo.entitlements.active || {};
    } catch (error) {
      console.error('Failed to get active entitlements:', error);
      return {};
    }
  }

  /**
   * Restore purchases (for user switching devices)
   */
  async restorePurchases(): Promise<CustomerInfo> {
    try {
      const purchases = await this.getInstance();
      const result = await purchases.restorePurchases();
      return result.customerInfo;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw error;
    }
  }

  /**
   * Switch to a different user
   */
  async logIn(appUserId: string): Promise<CustomerInfo> {
    try {
      const purchases = await this.getInstance();
      const result = await purchases.logIn(appUserId);
      return result.customerInfo;
    } catch (error) {
      console.error('Failed to log in user:', error);
      throw error;
    }
  }

  /**
   * Switch to anonymous user
   */
  async logOut(): Promise<CustomerInfo> {
    try {
      const purchases = await this.getInstance();
      const result = await purchases.logOut();
      return result.customerInfo;
    } catch (error) {
      console.error('Failed to log out user:', error);
      throw error;
    }
  }

  /**
   * Get subscription management URL
   */
  async getManagementURL(): Promise<string | null> {
    try {
      const purchases = await this.getInstance();
      return await purchases.getManagementURL();
    } catch (error) {
      console.error('Failed to get management URL:', error);
      return null;
    }
  }

  /**
   * Check configuration status
   */
  isConfiguredAndReady(): boolean {
    return this.isConfigured && this.purchases !== null;
  }
}

// Export singleton instance
export const revenueCatService = new RevenueCatService();

// Helper function to initialize RevenueCat with environment variables
export const initializeRevenueCat = async (userId?: string): Promise<void> => {
  const apiKey = import.meta.env.VITE_REVENUECAT_PUBLIC_KEY;
  
  if (!apiKey) {
    console.warn('VITE_REVENUECAT_PUBLIC_KEY not found - RevenueCat features will be disabled');
    return;
  }

  await revenueCatService.configure({
    apiKey,
    appUserId: userId
  });
};

// Entitlement constants
export const ENTITLEMENTS = {
  PREMIUM: 'premium',
  UNLIMITED_ENERGY: 'unlimited_energy',
  ADVANCED_SPIRITUAL_TOOLS: 'advanced_spiritual_tools'
} as const;

export type EntitlementId = typeof ENTITLEMENTS[keyof typeof ENTITLEMENTS];