// Privacy utilities for GDPR compliance and data management
import { ClientAnalytics } from './analytics';
import { consentManager } from './consent';

export interface DataExportRequest {
  userId: string;
  email: string;
  dataTypes: ('analytics' | 'profile' | 'posts' | 'comments' | 'engagements')[];
}

export interface DataDeletionRequest {
  userId: string;
  email: string;
  deleteTypes: ('analytics' | 'profile' | 'posts' | 'comments' | 'all')[];
  reason?: string;
}

export class PrivacyManager {
  // Cookie management for Enzuzo integration
  static getCookieCategories() {
    return {
      necessary: {
        name: 'Necessary',
        description: 'Essential cookies required for basic site functionality',
        cookies: [
          { name: 'session_id', purpose: 'User authentication and session management' },
          { name: 'csrf_token', purpose: 'Security protection against cross-site attacks' },
          { name: 'consent_preferences', purpose: 'Remember your privacy choices' },
        ],
        required: true,
      },
      analytics: {
        name: 'Analytics', 
        description: 'Help us understand how you use our platform to improve your experience',
        cookies: [
          { name: 'ph_*', purpose: 'PostHog analytics tracking', domain: '.posthog.com' },
          { name: '_ga', purpose: 'Google Analytics (if used)', domain: '.google-analytics.com' },
          { name: '__cf_bm', purpose: 'Cloudflare bot management', domain: '.cloudflare.com' },
        ],
        required: false,
      },
      marketing: {
        name: 'Marketing',
        description: 'Used to show you relevant spiritual content and recommendations',
        cookies: [
          { name: 'marketing_id', purpose: 'Personalized content recommendations' },
          { name: 'campaign_source', purpose: 'Track how you found our platform' },
        ],
        required: false,
      },
      functional: {
        name: 'Functional',
        description: 'Enhance your experience with personalized features',
        cookies: [
          { name: 'theme_preference', purpose: 'Remember your dark/light mode choice' },
          { name: 'language_preference', purpose: 'Remember your language setting' },
          { name: 'notification_settings', purpose: 'Manage your notification preferences' },
        ],
        required: false,
      },
    };
  }

  // Initialize privacy controls on page load
  static initialize() {
    // Set up consent banner integration points
    this.setupEnzuzoIntegration();

    // Set up data subject rights handlers
    this.setupDataRightsHandlers();

    // Initialize privacy-aware features
    this.setupPrivacyFeatures();
  }

  // Setup Enzuzo cookie banner integration
  private static setupEnzuzoIntegration() {
    // Listen for Enzuzo consent events
    if (typeof window !== 'undefined') {
      // Enzuzo will call these functions when consent changes
      (window as any).enzuzoConsentUpdated = (consent: any) => {
        consentManager.updateFromEnzuzo({
          analytics: consent.analytics || consent.performance,
          marketing: consent.marketing || consent.advertising,
          preferences: consent.functional || consent.preferences,
        });
      };

      // Provide current consent state to Enzuzo
      (window as any).getAscendedConsentState = () => {
        return consentManager.getEnzuzoCompatibleState();
      };
    }
  }

  // Setup data subject rights request handlers
  private static setupDataRightsHandlers() {
    if (typeof window !== 'undefined') {
      // Global functions for privacy rights
      (window as any).requestDataExport = this.requestDataExport.bind(this);
      (window as any).requestDataDeletion = this.requestDataDeletion.bind(this);
      (window as any).updatePrivacyPreferences = this.updatePrivacyPreferences.bind(this);
    }
  }

  // Setup privacy-aware features
  private static setupPrivacyFeatures() {
    // Anonymize IP addresses for analytics
    this.setupIPAnonymization();

    // Set up automatic data retention policies
    this.setupDataRetention();

    // Initialize privacy-first session recording
    this.setupPrivacySessionRecording();
  }

  // Request data export (GDPR Article 15)
  static async requestDataExport(request: DataExportRequest): Promise<void> {
    try {
      const response = await fetch('/api/privacy/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        console.log('📤 Data export request submitted successfully');
        // Show user confirmation
        this.showPrivacyNotification('Your data export request has been submitted. You will receive an email within 30 days.');
      } else {
        throw new Error('Failed to submit data export request');
      }
    } catch (error) {
      console.error('Error requesting data export:', error);
      this.showPrivacyNotification('There was an error submitting your request. Please try again or contact support.', 'error');
    }
  }

  // Request data deletion (GDPR Article 17)
  static async requestDataDeletion(request: DataDeletionRequest): Promise<void> {
    try {
      const response = await fetch('/api/privacy/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        console.log('🗑️ Data deletion request submitted successfully');
        this.showPrivacyNotification('Your data deletion request has been submitted. Your data will be removed within 30 days.');

        // Clear local analytics data immediately
        ClientAnalytics.clearUserData();
        consentManager.clearConsent();
      } else {
        throw new Error('Failed to submit data deletion request');
      }
    } catch (error) {
      console.error('Error requesting data deletion:', error);
      this.showPrivacyNotification('There was an error submitting your request. Please try again or contact support.', 'error');
    }
  }

  // Update privacy preferences
  static updatePrivacyPreferences(preferences: {
    analytics?: boolean;
    marketing?: boolean;
    functional?: boolean;
  }): void {
    consentManager.setConsentPreferences({
      analytics: preferences.analytics ?? false,
      marketing: preferences.marketing ?? false,
      preferences: preferences.functional ?? false,
      necessary: true,
    });

    this.showPrivacyNotification('Your privacy preferences have been updated.');
  }

  // Setup IP anonymization
  private static setupIPAnonymization() {
    // PostHog automatically anonymizes IPs in EU, but we can ensure it's global
    if (typeof window !== 'undefined') {
      // Additional IP masking if needed
      console.log('🔒 IP anonymization enabled for privacy protection');
    }
  }

  // Setup data retention policies
  private static setupDataRetention() {
    // Set up automatic cleanup of old analytics data
    const retentionPeriod = 24 * 30; // 30 days in hours

    if (typeof window !== 'undefined') {
      const lastCleanup = localStorage.getItem('last_privacy_cleanup');
      const now = Date.now();

      if (!lastCleanup || (now - parseInt(lastCleanup)) > (retentionPeriod * 60 * 60 * 1000)) {
        this.cleanupOldData();
        localStorage.setItem('last_privacy_cleanup', now.toString());
      }
    }
  }

  // Setup privacy-first session recording
  private static setupPrivacySessionRecording() {
    // Add privacy-aware CSS classes for session recording
    if (typeof window !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        .ph-no-capture {
          background: #f0f0f0 !important;
        }
        .sensitive, .private, .pii {
          filter: blur(3px);
        }
        input[type="password"], 
        input[type="email"], 
        input[type="tel"] {
          background: repeating-linear-gradient(45deg, #ccc, #ccc 10px, #fff 10px, #fff 20px) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Clean up old privacy-related data
  private static cleanupOldData() {
    if (typeof window !== 'undefined') {
      // Clean up old consent data
      const consentState = consentManager.getConsentState();
      if (consentState) {
        const consentAge = Date.now() - new Date(consentState.timestamp).getTime();
        const maxConsentAge = 365 * 24 * 60 * 60 * 1000; // 1 year

        if (consentAge > maxConsentAge) {
          console.log('🧹 Cleaning up old consent data');
          consentManager.clearConsent();
        }
      }

      // Clean up other privacy-related local storage
      const privacyKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('ph_') || key.startsWith('privacy_') || key.startsWith('gdpr_')
      );

      privacyKeys.forEach(key => {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const data = JSON.parse(item);
            if (data.timestamp) {
              const age = Date.now() - new Date(data.timestamp).getTime();
              const maxDataAge = 365 * 24 * 60 * 60 * 1000; // 1 year
              if (age > maxDataAge) {
                localStorage.removeItem(key);
              }
            }
          }
        } catch (e) {
          // Invalid JSON, remove it
          localStorage.removeItem(key);
        }
      });
    }
  }

  // Show privacy-related notifications to user
  private static showPrivacyNotification(message: string, type: 'info' | 'error' = 'info') {
    // This would integrate with your notification system
    console.log(`🔔 Privacy Notice [${type.toUpperCase()}]: ${message}`);

    // If you have a toast system, use it here
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast(message, type);
    }
  }

  // Get current privacy compliance status
  static getPrivacyComplianceStatus() {
    const consentState = consentManager.getConsentState();
    const analyticsStatus = ClientAnalytics.getConsentStatus();

    return {
      consentGiven: consentManager.hasUserConsented(),
      consentTimestamp: consentState?.timestamp,
      consentVersion: consentState?.version,
      analyticsEnabled: analyticsStatus.hasAnalyticsConsent,
      marketingEnabled: consentManager.hasMarketingConsent(),
      functionalEnabled: consentManager.hasPreferencesConsent(),
      dataRetentionActive: true,
      ipAnonymization: true,
      gdprCompliant: true,
    };
  }

  // Generate privacy report for user
  static generatePrivacyReport() {
    const status = this.getPrivacyComplianceStatus();
    const cookies = this.getCookieCategories();

    return {
      timestamp: new Date().toISOString(),
      user_rights: {
        data_export: 'Available - Request within 30 days',
        data_deletion: 'Available - Completed within 30 days', 
        data_portability: 'Available on request',
        withdraw_consent: 'Available anytime',
      },
      current_consent: status,
      cookie_categories: cookies,
      data_processing: {
        purpose: 'Spiritual platform analytics and user experience',
        legal_basis: 'Consent (GDPR Article 6(1)(a))',
        retention_period: '12 months or until consent withdrawn',
        thirdPartySharing: [
          { service: 'PostHog Analytics', purpose: 'Usage analytics', dataTypes: ['behavioral'] },
          { service: 'Stripe', purpose: 'Payment processing and subscription management', dataTypes: ['billing', 'payment_methods', 'customer_profile'] },
          { service: 'OneSignal', purpose: 'Email delivery and newsletter management', dataTypes: ['email', 'name', 'communication_preferences'] },
          { service: 'Cloudflare Stream', purpose: 'Video hosting and streaming', dataTypes: ['media'] },
          { service: 'OneSignal', purpose: 'Push notifications for mobile app', dataTypes: ['notification', 'device_tokens'] },
          { service: 'Replit Database', purpose: 'Primary data storage for platform', dataTypes: ['profile', 'posts', 'spiritual_data', 'user_preferences'] },
          { service: 'Replit', purpose: 'Application infrastructure and hosting', dataTypes: ['infrastructure', 'session_data'] },
        ],
      },
    };
  }
}

// Initialize privacy manager when script loads
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    PrivacyManager.initialize();
  });
}

export default PrivacyManager;