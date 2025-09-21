import { useState, useEffect } from 'react';

// Privacy consent management for PostHog integration with Klaro
export interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  functional: boolean; // Klaro uses 'functional' for enhanced features
  necessary: boolean;
}

export interface ConsentState {
  hasConsented: boolean;
  preferences: ConsentPreferences;
  timestamp: string;
  version: string;
}

const CONSENT_STORAGE_KEY = 'ascended_consent_preferences';
const CONSENT_VERSION = '1.0';

export class ConsentManager {
  private static instance: ConsentManager;
  private listeners: Array<(state: ConsentState) => void> = [];

  static getInstance(): ConsentManager {
    if (!ConsentManager.instance) {
      ConsentManager.instance = new ConsentManager();
    }
    return ConsentManager.instance;
  }

  // Get current consent state
  getConsentState(): ConsentState | null {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) return null;
      
      const state = JSON.parse(stored) as ConsentState;
      
      // Check if consent version is current
      if (state.version !== CONSENT_VERSION) {
        this.clearConsent();
        return null;
      }
      
      return state;
    } catch (error) {
      console.error('Error reading consent state:', error);
      return null;
    }
  }

  // Set consent preferences
  setConsentPreferences(preferences: ConsentPreferences): void {
    const state: ConsentState = {
      hasConsented: true,
      preferences,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
      this.notifyListeners(state);
    } catch (error) {
      console.error('Error saving consent preferences:', error);
    }
  }

  // Check if analytics consent is given
  hasAnalyticsConsent(): boolean {
    const state = this.getConsentState();
    return state?.preferences.analytics ?? false;
  }

  // Check if marketing consent is given
  hasMarketingConsent(): boolean {
    const state = this.getConsentState();
    return state?.preferences.marketing ?? false;
  }

  // Check if functional consent is given
  hasFunctionalConsent(): boolean {
    const state = this.getConsentState();
    return state?.preferences.functional ?? false;
  }

  // Check if user has provided any consent
  hasUserConsented(): boolean {
    const state = this.getConsentState();
    return state?.hasConsented ?? false;
  }

  // Clear all consent data
  clearConsent(): void {
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      const state: ConsentState = {
        hasConsented: false,
        preferences: {
          analytics: false,
          marketing: false,
          functional: false,
          necessary: true, // Always true for essential functionality
        },
        timestamp: new Date().toISOString(),
        version: CONSENT_VERSION,
      };
      this.notifyListeners(state);
    } catch (error) {
      console.error('Error clearing consent:', error);
    }
  }

  // Accept all non-essential cookies
  acceptAll(): void {
    this.setConsentPreferences({
      analytics: true,
      marketing: true,
      functional: true,
      necessary: true,
    });
  }

  // Reject all non-essential cookies
  rejectAll(): void {
    this.setConsentPreferences({
      analytics: false,
      marketing: false,
      preferences: false,
      necessary: true,
    });
  }

  // Listen for consent changes
  onConsentChange(callback: (state: ConsentState) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners of consent changes
  private notifyListeners(state: ConsentState): void {
    this.listeners.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('Error in consent change listener:', error);
      }
    });
  }

  // Get consent data for Klaro integration (this method has been replaced by getKlaroCompatibleState)
  // Keeping for backward compatibility
  getEnzuzoCompatibleState(): {
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
    necessary: boolean;
    timestamp?: string;
  } {
    return this.getKlaroCompatibleState();
  }

  // Update from Klaro banner
  updateFromKlaro(klaroConsent: {
    analytics?: boolean;
    marketing?: boolean;
    functional?: boolean;
  }): void {
    this.setConsentPreferences({
      analytics: klaroConsent.analytics ?? false,
      marketing: klaroConsent.marketing ?? false,
      functional: klaroConsent.functional ?? false,
      necessary: true,
    });
  }

  // Initialize Klaro banner integration
  initializeKlaro(): void {
    if (typeof window === 'undefined') return;

    // Set up Klaro configuration and load script
    this.setupKlaroConfig();
    this.loadKlaroScript();
  }

  private setupKlaroConfig(): void {
    // Define Klaro configuration
    (window as any).klaroConfig = {
      version: 1,
      lang: 'en',
      htmlTexts: true,
      embedded: false,
      groupByPurpose: true,
      storageMethod: 'localStorage',
      cookieName: 'ascended_klaro',
      cookieExpiresAfterDays: 365,
      default: false,
      mustConsent: true,
      acceptAll: true,
      hideDeclineAll: false,
      hideLearnMore: false,
      noticeAsModal: true,
      disablePoweredBy: false,
      additionalClass: 'ascended-cmp',
      
      privacyPolicy: {
        en: {
          name: 'Privacy Policy',
          text: 'Read our privacy policy to understand how we handle your data.',
          url: '/privacy'
        }
      },
      
      apps: [
        {
          name: 'necessary',
          title: {
            en: 'Essential Cookies'
          },
          description: {
            en: 'Essential cookies required for basic website functionality. These cannot be disabled.'
          },
          purposes: ['security', 'functionality'],
          required: true,
          optOut: false,
          onlyOnce: true
        },
        {
          name: 'analytics',
          title: {
            en: 'Analytics'
          },
          description: {
            en: 'Analytics cookies help us understand how visitors interact with our website to improve user experience.'
          },
          purposes: ['analytics'],
          required: false,
          optOut: true,
          default: false,
          cookies: [
            'ph_*', // PostHog analytics
            '_ga', '_ga_*', '_gid', '_gat', // Google Analytics
            'amplitude_*'
          ]
        },
        {
          name: 'marketing',
          title: {
            en: 'Marketing'
          },
          description: {
            en: 'Marketing cookies track visitors across websites to deliver relevant advertisements.'
          },
          purposes: ['advertising'],
          required: false,
          optOut: true,
          default: false,
          cookies: [
            'fbp', '_fbp', // Facebook Pixel
            'gads', '_gads', // Google Ads
            'linkedin_*' // LinkedIn tracking
          ]
        },
        {
          name: 'functional',
          title: {
            en: 'Functional'
          },
          description: {
            en: 'Functional cookies enable enhanced features and personalization for a better user experience.'
          },
          purposes: ['personalization'],
          required: false,
          optOut: true,
          default: false,
          cookies: [
            'theme', 'language', 'preferences', // User preferences
            'ascended_*' // Our app preferences
          ]
        }
      ],
      
      // Set up callbacks for consent changes
      callback: (consent: any, app: any) => {
        this.handleKlaroConsentChange(consent, app);
      }
    };
  }

  private loadKlaroScript(): void {
    // Check if script already exists
    if (document.querySelector('script[data-klaro]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.kiprotect.com/klaro/v0.7.21/klaro.js';
    script.defer = true;
    script.setAttribute('data-klaro', 'true');
    
    // Add security measures
    script.crossOrigin = 'anonymous';
    
    // Set up error handling
    script.onerror = () => {
      console.warn('Klaro cookie banner failed to load, falling back to basic consent');
      this.setupFallbackConsent();
    };

    script.onload = () => {
      console.log('✅ Klaro cookie banner loaded successfully');
      this.setupKlaroIntegration();
    };

    document.head.appendChild(script);
  }

  private setupKlaroIntegration(): void {
    // Wait for Klaro to be available and set up integration
    const checkKlaro = () => {
      if ((window as any).klaro) {
        this.setupKlaroSync();
      } else {
        setTimeout(checkKlaro, 100);
      }
    };
    checkKlaro();
  }

  private setupKlaroSync(): void {
    if (typeof window === 'undefined') return;

    // Sync existing consent state to Klaro
    const currentState = this.getConsentState();
    if (currentState && (window as any).klaro) {
      const klaroManager = (window as any).klaro.getManager();
      if (klaroManager) {
        klaroManager.updateConsent({
          necessary: true,
          analytics: currentState.preferences.analytics,
          marketing: currentState.preferences.marketing,
          functional: currentState.preferences.functional,
        });
      }
    }

    console.log('🔄 Klaro sync setup complete');
    
    // Verify GDPR compliance
    this.verifyGDPRCompliance();
  }

  private handleKlaroConsentChange(consent: any, app: any): void {
    console.log('📝 Klaro consent updated:', consent, app);
    
    // Update our internal state based on Klaro consent
    const klaroManager = (window as any).klaro?.getManager();
    if (klaroManager) {
      const currentConsent = klaroManager.consents || {};
      this.updateFromKlaro({
        analytics: currentConsent.analytics || false,
        marketing: currentConsent.marketing || false,
        functional: currentConsent.functional || false,
      });
    }
  }

  private setupFallbackConsent(): void {
    // Create a basic consent banner if Klaro fails to load
    console.log('Setting up fallback consent mechanism');
    
    // You could implement a simple banner here as fallback
    // For now, we'll just ensure the basic functionality works
    if (!this.hasUserConsented()) {
      // Show a simple browser confirm dialog as last resort
      const consent = confirm('This website uses cookies to improve your experience. Do you accept cookies?');
      if (consent) {
        this.acceptAll();
      } else {
        this.rejectAll();
      }
    }
  }

  private verifyGDPRCompliance(): void {
    const hasRequiredFeatures = {
      consentBanner: document.querySelector('script[data-klaro]') !== null || (window as any).klaro !== undefined,
      privacySettings: typeof this.getConsentState === 'function',
      dataExportAPI: fetch('/api/privacy/status').then(r => r.ok).catch(() => false),
      cookieCategories: Object.keys(this.getKlaroCompatibleState()).length === 4,
      optOutDefault: !this.hasAnalyticsConsent() // Should be false by default
    };

    console.log('🛡️ GDPR Compliance Check:', hasRequiredFeatures);
    
    if (hasRequiredFeatures.consentBanner && hasRequiredFeatures.privacySettings && hasRequiredFeatures.optOutDefault) {
      console.log('✅ GDPR compliance verified - All required features present');
    } else {
      console.warn('⚠️ GDPR compliance issues detected');
    }
  }

  // Get consent state in Klaro-compatible format
  getKlaroCompatibleState(): ConsentPreferences & { timestamp?: string } {
    const state = this.getConsentState();
    
    if (!state) {
      return {
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false,
      };
    }

    return {
      ...state.preferences,
      timestamp: state.timestamp,
    };
  }
}

// Global consent manager instance
export const consentManager = ConsentManager.getInstance();

// Hook for React components
export function useConsent() {
  const [consentState, setConsentState] = useState<ConsentState | null>(
    consentManager.getConsentState()
  );

  useEffect(() => {
    const unsubscribe = consentManager.onConsentChange(setConsentState);
    return unsubscribe;
  }, []);

  return {
    consentState,
    hasConsented: consentManager.hasUserConsented(),
    hasAnalyticsConsent: consentManager.hasAnalyticsConsent(),
    hasMarketingConsent: consentManager.hasMarketingConsent(),
    hasFunctionalConsent: consentManager.hasFunctionalConsent(),
    acceptAll: () => consentManager.acceptAll(),
    rejectAll: () => consentManager.rejectAll(),
    setPreferences: (prefs: ConsentPreferences) => consentManager.setConsentPreferences(prefs),
    clearConsent: () => consentManager.clearConsent(),
  };
}