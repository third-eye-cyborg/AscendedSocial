import { PostHog } from 'posthog-node';

// Server-side PostHog client
let posthogServer: PostHog | null = null;

if (process.env.POSTHOG_API_KEY && process.env.POSTHOG_HOST) {
  try {
    posthogServer = new PostHog(process.env.POSTHOG_API_KEY, {
      host: process.env.POSTHOG_HOST,
      flushAt: 20,
      flushInterval: 30000,
      // Disable geo-location in development to prevent issues
      disableGeoip: process.env.NODE_ENV === 'development',
    });
    console.log('✅ PostHog server analytics initialized');
  } catch (error) {
    console.warn('⚠️ PostHog initialization failed:', error);
    posthogServer = null;
  }
} else {
  console.warn('⚠️ PostHog not configured - analytics disabled');
}

export interface AnalyticsEvent {
  event: string;
  distinctId: string;
  properties?: Record<string, any>;
  groups?: Record<string, string>;
}

export interface UserProfile {
  distinctId: string;
  properties: Record<string, any>;
}

export class AnalyticsService {
  // Track events on the server side
  static async track(event: AnalyticsEvent): Promise<void> {
    if (!posthogServer) {
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics event (offline):', event.event);
      }
      return;
    }

    try {
      posthogServer.capture({
        distinctId: event.distinctId,
        event: event.event,
        properties: {
          ...event.properties,
          timestamp: new Date().toISOString(),
          platform: 'server',
        },
        groups: event.groups,
      });
    } catch (error: any) {
      // Don't spam logs with auth errors in development
      if (process.env.NODE_ENV !== 'development' || !error.message?.includes('401')) {
        console.error('Analytics tracking error:', error);
      }
    }
  }

  // Update user properties
  static async identify(profile: UserProfile): Promise<void> {
    if (!posthogServer) {
      console.log('👤 User identification (offline):', profile.distinctId);
      return;
    }

    try {
      posthogServer.identify({
        distinctId: profile.distinctId,
        properties: profile.properties,
      });
    } catch (error) {
      console.error('Analytics identification error:', error);
    }
  }

  // Track spiritual journey milestones
  static async trackSpiritualEvent(
    userId: string, 
    eventType: 'post_created' | 'oracle_reading' | 'community_joined' | 'vision_shared' | 'chakra_alignment' | 'energy_gained' | 'subscription_upgraded',
    properties: Record<string, any> = {}
  ): Promise<void> {
    await this.track({
      event: `spiritual_${eventType}`,
      distinctId: userId,
      properties: {
        ...properties,
        spiritual_category: this.getSpiritualCategory(eventType),
        journey_stage: properties.journeyStage || 'unknown',
      },
    });
  }

  // Track engagement patterns
  static async trackEngagement(
    userId: string,
    engagementType: 'upvote' | 'downvote' | 'like' | 'comment' | 'share' | 'bookmark',
    targetType: 'post' | 'comment' | 'vision' | 'community',
    targetId: string,
    properties: Record<string, any> = {}
  ): Promise<void> {
    await this.track({
      event: 'user_engagement',
      distinctId: userId,
      properties: {
        ...properties,
        engagement_type: engagementType,
        target_type: targetType,
        target_id: targetId,
        spiritual_impact: properties.spiritualImpact || 'neutral',
      },
    });
  }

  // Track errors and crashes
  static async trackError(
    userId: string | null,
    error: Error,
    context: Record<string, any> = {}
  ): Promise<void> {
    await this.track({
      event: 'error_occurred',
      distinctId: userId || 'anonymous',
      properties: {
        ...context,
        error_name: error.name,
        error_message: error.message,
        error_stack: error.stack?.substring(0, 1000), // Limit stack trace size
        url: context.url || 'unknown',
        user_agent: context.userAgent || 'unknown',
      },
    });
  }

  // Track user authentication events
  static async trackAuth(
    userId: string,
    authEvent: 'login' | 'logout' | 'register' | 'password_reset',
    properties: Record<string, any> = {}
  ): Promise<void> {
    await this.track({
      event: `auth_${authEvent}`,
      distinctId: userId,
      properties: {
        ...properties,
        auth_method: properties.authMethod || 'replit',
      },
    });
  }

  // Track subscription and payment events
  static async trackSubscription(
    userId: string,
    subscriptionEvent: 'created' | 'updated' | 'cancelled' | 'renewed' | 'payment_failed',
    properties: Record<string, any> = {}
  ): Promise<void> {
    await this.track({
      event: `subscription_${subscriptionEvent}`,
      distinctId: userId,
      properties: {
        ...properties,
        subscription_tier: properties.tier || 'free',
        payment_method: properties.paymentMethod || 'unknown',
      },
    });
  }

  // Track newsletter interactions
  static async trackNewsletter(
    email: string,
    newsletterEvent: 'subscribed' | 'unsubscribed' | 'email_opened' | 'link_clicked',
    properties: Record<string, any> = {}
  ): Promise<void> {
    await this.track({
      event: `newsletter_${newsletterEvent}`,
      distinctId: email,
      properties: {
        ...properties,
        communication_channel: 'email',
      },
    });
  }

  // Update user spiritual profile
  static async updateSpiritualProfile(
    userId: string,
    spiritualData: {
      dominantChakra?: string;
      auraLevel?: number;
      energyPoints?: number;
      journeyStage?: string;
      interests?: string[];
      lastActiveDate?: string;
    }
  ): Promise<void> {
    await this.identify({
      distinctId: userId,
      properties: {
        dominant_chakra: spiritualData.dominantChakra,
        aura_level: spiritualData.auraLevel,
        energy_points: spiritualData.energyPoints,
        journey_stage: spiritualData.journeyStage,
        spiritual_interests: spiritualData.interests,
        last_active_date: spiritualData.lastActiveDate,
        profile_updated_at: new Date().toISOString(),
      },
    });
  }

  // Feature flag utilities
  static async isFeatureEnabled(
    userId: string,
    featureKey: string,
    defaultValue: boolean = false
  ): Promise<boolean> {
    if (!posthogServer) {
      return defaultValue;
    }

    try {
      const result = await posthogServer.isFeatureEnabled(featureKey, userId);
      return result ?? defaultValue;
    } catch (error) {
      console.error('Feature flag check error:', error);
      return defaultValue;
    }
  }

  // Get feature flag payload
  static async getFeatureFlag(
    userId: string,
    featureKey: string
  ): Promise<any> {
    if (!posthogServer) {
      return null;
    }

    try {
      return await posthogServer.getFeatureFlag(featureKey, userId);
    } catch (error) {
      console.error('Feature flag payload error:', error);
      return null;
    }
  }

  // Flush events (useful for serverless environments)
  static async flush(): Promise<void> {
    if (posthogServer) {
      await posthogServer.flush();
    }
  }

  // Shutdown analytics (cleanup)
  static async shutdown(): Promise<void> {
    if (posthogServer) {
      await posthogServer.shutdown();
    }
  }

  // Helper method to categorize spiritual events
  private static getSpiritualCategory(eventType: string): string {
    const categories: Record<string, string> = {
      post_created: 'expression',
      oracle_reading: 'guidance',
      community_joined: 'connection',
      vision_shared: 'manifestation',
      chakra_alignment: 'energy_work',
      energy_gained: 'progression',
      subscription_upgraded: 'commitment',
    };
    return categories[eventType] || 'general';
  }
}

// Middleware for automatic request tracking
export function analyticsMiddleware() {
  return (req: any, res: any, next: any) => {
    const startTime = Date.now();
    
    // Track API requests
    res.on('finish', async () => {
      const duration = Date.now() - startTime;
      const userId = req.user?.claims?.sub || req.user?.id || 'anonymous';
      
      await AnalyticsService.track({
        event: 'api_request',
        distinctId: userId,
        properties: {
          method: req.method,
          path: req.path,
          status_code: res.statusCode,
          duration_ms: duration,
          user_agent: req.get('User-Agent'),
          ip_address: req.ip,
          is_authenticated: !!req.user,
        },
      });
    });

    next();
  };
}

export { posthogServer };