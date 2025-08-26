import posthog from 'posthog-js';

// Initialize PostHog on the client side
const initializePostHog = () => {
  const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

  if (apiKey && typeof window !== 'undefined') {
    posthog.init(apiKey, {
      api_host: host,
      autocapture: true,
      capture_pageview: true,
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: true,
        maskInputOptions: {
          password: true,
          email: false,
        },
      },
      loaded: (posthog) => {
        if (import.meta.env.DEV) {
          console.log('🔍 PostHog analytics initialized (development mode)');
          posthog.debug();
        }
      },
    });

    console.log('✅ PostHog client analytics initialized');
    return true;
  } else {
    console.warn('⚠️ PostHog client not configured - analytics disabled');
    return false;
  }
};

// Initialize PostHog
const isInitialized = initializePostHog();

export interface SpiritualEventProperties {
  chakraType?: string;
  energyLevel?: number;
  journeyStage?: string;
  spiritualCategory?: string;
  [key: string]: any;
}

export class ClientAnalytics {
  // Track spiritual journey events
  static trackSpiritualEvent(
    eventType: 'meditation_started' | 'oracle_reading_requested' | 'post_created' | 'community_joined' | 'chakra_selected' | 'vision_uploaded',
    properties: SpiritualEventProperties = {}
  ): void {
    if (!isInitialized) return;

    posthog.capture(`spiritual_${eventType}`, {
      ...properties,
      platform: 'web',
      timestamp: new Date().toISOString(),
    });
  }

  // Track user engagement
  static trackEngagement(
    engagementType: 'upvote' | 'downvote' | 'like' | 'comment' | 'share' | 'bookmark',
    targetType: 'post' | 'comment' | 'vision' | 'community',
    targetId: string,
    properties: Record<string, any> = {}
  ): void {
    if (!isInitialized) return;

    posthog.capture('user_engagement', {
      engagement_type: engagementType,
      target_type: targetType,
      target_id: targetId,
      ...properties,
    });
  }

  // Track navigation and page views
  static trackPageView(pageName: string, properties: Record<string, any> = {}): void {
    if (!isInitialized) return;

    posthog.capture('page_viewed', {
      page_name: pageName,
      url: window.location.href,
      referrer: document.referrer,
      ...properties,
    });
  }

  // Track errors and exceptions
  static trackError(error: Error, context: Record<string, any> = {}): void {
    if (!isInitialized) return;

    posthog.capture('error_occurred', {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack?.substring(0, 1000),
      url: window.location.href,
      user_agent: navigator.userAgent,
      ...context,
    });
  }

  // Track form interactions
  static trackFormEvent(
    formName: string,
    eventType: 'started' | 'completed' | 'abandoned' | 'error',
    properties: Record<string, any> = {}
  ): void {
    if (!isInitialized) return;

    posthog.capture(`form_${eventType}`, {
      form_name: formName,
      ...properties,
    });
  }

  // Track button clicks and user actions
  static trackAction(
    actionName: string,
    category: 'navigation' | 'spiritual' | 'social' | 'content' | 'subscription',
    properties: Record<string, any> = {}
  ): void {
    if (!isInitialized) return;

    posthog.capture('user_action', {
      action_name: actionName,
      action_category: category,
      ...properties,
    });
  }

  // Track search and discovery
  static trackSearch(
    searchTerm: string,
    searchType: 'posts' | 'communities' | 'users' | 'oracle',
    resultsCount: number,
    properties: Record<string, any> = {}
  ): void {
    if (!isInitialized) return;

    posthog.capture('search_performed', {
      search_term: searchTerm,
      search_type: searchType,
      results_count: resultsCount,
      ...properties,
    });
  }

  // Track subscription events
  static trackSubscription(
    eventType: 'initiated' | 'completed' | 'cancelled' | 'upgraded',
    tier: string,
    properties: Record<string, any> = {}
  ): void {
    if (!isInitialized) return;

    posthog.capture(`subscription_${eventType}`, {
      subscription_tier: tier,
      ...properties,
    });
  }

  // Identify users
  static identify(userId: string, properties: Record<string, any> = {}): void {
    if (!isInitialized) return;

    posthog.identify(userId, {
      ...properties,
      platform: 'web',
      identified_at: new Date().toISOString(),
    });
  }

  // Update user properties
  static updateProfile(properties: Record<string, any>): void {
    if (!isInitialized) return;

    posthog.people.set(properties);
  }

  // Track feature flag usage
  static trackFeatureFlag(flagName: string, flagValue: any, properties: Record<string, any> = {}): void {
    if (!isInitialized) return;

    posthog.capture('feature_flag_used', {
      flag_name: flagName,
      flag_value: flagValue,
      ...properties,
    });
  }

  // Start session recording
  static startRecording(): void {
    if (!isInitialized) return;
    posthog.startSessionRecording();
  }

  // Stop session recording
  static stopRecording(): void {
    if (!isInitialized) return;
    posthog.stopSessionRecording();
  }

  // Check if feature flag is enabled
  static isFeatureEnabled(flagName: string, defaultValue: boolean = false): boolean {
    if (!isInitialized) return defaultValue;
    return posthog.isFeatureEnabled(flagName) ?? defaultValue;
  }

  // Get feature flag value
  static getFeatureFlag(flagName: string): any {
    if (!isInitialized) return null;
    return posthog.getFeatureFlag(flagName);
  }

  // Reset user (logout)
  static reset(): void {
    if (!isInitialized) return;
    posthog.reset();
  }

  // Group analytics (for communities, organizations)
  static group(groupType: string, groupKey: string, properties: Record<string, any> = {}): void {
    if (!isInitialized) return;
    posthog.group(groupType, groupKey, properties);
  }
}

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    ClientAnalytics.trackError(new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      source: 'global_error_handler',
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    ClientAnalytics.trackError(new Error(event.reason), {
      source: 'unhandled_promise_rejection',
    });
  });
}

export default posthog;
export { posthog };