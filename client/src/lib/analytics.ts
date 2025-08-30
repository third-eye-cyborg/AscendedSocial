import posthog from 'posthog-js';
import { consentManager } from './consent';

// Initialize PostHog with privacy-first configuration
const initializePostHog = () => {
  const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

  if (apiKey && typeof window !== 'undefined') {
    posthog.init(apiKey, {
      api_host: host,
      
      // Privacy-first settings
      autocapture: false, // Disabled by default, enabled only with consent
      capture_pageview: false, // Disabled by default, enabled only with consent
      disable_session_recording: true, // Disabled by default
      
      // Enhanced privacy settings
      respect_dnt: true, // Respect Do Not Track
      opt_out_capturing_by_default: true, // Opt-out by default
      opt_out_persistence_by_default: true,
      disable_cookie: false, // We'll manage this through consent
      
      // Data minimization
      property_blacklist: [
        '$current_url', // Can contain sensitive data
        '$screen_height',
        '$screen_width',
        '$viewport_height', 
        '$viewport_width',
        '$referrer', // May contain sensitive data
        '$referring_domain'
      ],
      
      // Session recording with privacy protection
      session_recording: {
        maskAllInputs: true,
        maskInputOptions: {
          password: true,
          email: true, // Enhanced privacy - mask emails
          tel: true,
        },
        maskTextSelector: '.sensitive, .private, .pii',
        blockClass: 'ph-no-capture',
        blockSelector: '.sensitive-block',
        collectFonts: false, // Privacy enhancement
        recordCrossOriginIframes: false,
      },
      
      // Advanced privacy settings
      sanitize_properties: (properties, event) => {
        // Remove or sanitize sensitive properties
        const sanitized = { ...properties };
        
        // Remove IP-related data
        delete sanitized.$ip;
        delete sanitized.$geoip_city_name;
        delete sanitized.$geoip_country_code;
        delete sanitized.$geoip_subdivision_1_code;
        
        // Sanitize URLs to remove query parameters that might contain PII
        if (sanitized.$current_url) {
          try {
            const url = new URL(sanitized.$current_url);
            sanitized.$current_url = `${url.origin}${url.pathname}`;
          } catch (e) {
            delete sanitized.$current_url;
          }
        }
        
        return sanitized;
      },
      
      loaded: (posthog) => {
        if (import.meta.env.DEV) {
          console.log('🔍 PostHog analytics initialized (development mode)');
          posthog.debug();
        }
        
        // Set up consent management
        setupConsentManagement(posthog);
      },
    });

    console.log('✅ PostHog client analytics initialized with privacy protection');
    return true;
  } else {
    console.warn('⚠️ PostHog client not configured - analytics disabled');
    return false;
  }
};

// Setup consent management integration
const setupConsentManagement = (posthogInstance: typeof posthog) => {
  // Check initial consent state
  const hasConsent = consentManager.hasAnalyticsConsent();
  
  if (hasConsent) {
    enableAnalytics(posthogInstance);
  } else {
    disableAnalytics(posthogInstance);
  }
  
  // Listen for consent changes
  consentManager.onConsentChange((consentState) => {
    if (consentState.preferences.analytics) {
      enableAnalytics(posthogInstance);
    } else {
      disableAnalytics(posthogInstance);
    }
  });
};

// Enable analytics features with consent
const enableAnalytics = (posthogInstance: typeof posthog) => {
  posthogInstance.opt_in_capturing();
  posthogInstance.set_config({ 
    autocapture: true,
    capture_pageview: true,
    disable_session_recording: false
  });
  console.log('📊 Analytics enabled with user consent');
};

// Disable analytics features without consent
const disableAnalytics = (posthogInstance: typeof posthog) => {
  posthogInstance.opt_out_capturing();
  posthogInstance.set_config({ 
    autocapture: false,
    capture_pageview: false,
    disable_session_recording: true
  });
  console.log('🚫 Analytics disabled - no user consent');
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
  // Check if tracking is allowed
  private static canTrack(): boolean {
    return isInitialized && consentManager.hasAnalyticsConsent();
  }

  // Track spiritual journey events
  static trackSpiritualEvent(
    eventType: 'meditation_started' | 'oracle_reading_requested' | 'post_created' | 'community_joined' | 'chakra_selected' | 'vision_uploaded',
    properties: SpiritualEventProperties = {}
  ): void {
    if (!this.canTrack()) return;

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
    if (!this.canTrack()) return;

    posthog.capture('user_engagement', {
      engagement_type: engagementType,
      target_type: targetType,
      target_id: targetId,
      ...properties,
    });
  }

  // Track navigation and page views
  static trackPageView(pageName: string, properties: Record<string, any> = {}): void {
    if (!this.canTrack()) return;

    posthog.capture('page_viewed', {
      page_name: pageName,
      url: window.location.href,
      referrer: document.referrer,
      ...properties,
    });
  }

  // Track errors and exceptions (allowed for necessary functionality)
  static trackError(error: Error, context: Record<string, any> = {}): void {
    if (!isInitialized) return; // Only check if initialized, errors are necessary

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
    if (!this.canTrack()) return;

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
    if (!this.canTrack()) return;

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
    if (!this.canTrack()) return;

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
    if (!this.canTrack()) return;

    posthog.capture(`subscription_${eventType}`, {
      subscription_tier: tier,
      ...properties,
    });
  }

  // Identify users
  static identify(userId: string, properties: Record<string, any> = {}): void {
    if (!this.canTrack()) return;

    posthog.identify(userId, {
      ...properties,
      platform: 'web',
      identified_at: new Date().toISOString(),
    });
  }

  // Update user properties
  static updateProfile(properties: Record<string, any>): void {
    if (!this.canTrack()) return;

    posthog.people.set(properties);
  }

  // Track feature flag usage
  static trackFeatureFlag(flagName: string, flagValue: any, properties: Record<string, any> = {}): void {
    if (!this.canTrack()) return;

    posthog.capture('feature_flag_used', {
      flag_name: flagName,
      flag_value: flagValue,
      ...properties,
    });
  }

  // Start session recording (only with consent)
  static startRecording(): void {
    if (!this.canTrack()) return;
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
    if (!this.canTrack()) return;
    posthog.group(groupType, groupKey, properties);
  }

  // Privacy controls
  static clearUserData(): void {
    if (!isInitialized) return;
    posthog.reset();
    console.log('🗑️ User analytics data cleared');
  }

  // Get consent status
  static getConsentStatus() {
    return {
      hasAnalyticsConsent: consentManager.hasAnalyticsConsent(),
      hasMarketingConsent: consentManager.hasMarketingConsent(),
      hasFunctionalConsent: consentManager.hasFunctionalConsent(),
      isInitialized: isInitialized,
    };
  }

  // Enable analytics with consent
  static enableWithConsent(): void {
    if (!isInitialized) return;
    enableAnalytics(posthog);
  }

  // Disable analytics
  static disable(): void {
    if (!isInitialized) return;
    disableAnalytics(posthog);
  }
}

// Global error handler (essential functionality - no consent required)
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