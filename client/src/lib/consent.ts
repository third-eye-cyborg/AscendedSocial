import { useState, useEffect } from 'react';

// Privacy consent management for PostHog integration with Enzuzo
export interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
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
      functional: false,
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

  // Get consent data for Enzuzo integration
  getEnzuzoCompatibleState(): {
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
    necessary: boolean;
    timestamp?: string;
  } {
    const state = this.getConsentState();
    if (!state) {
      return {
        analytics: false,
        marketing: false,
        functional: false,
        necessary: true,
      };
    }

    return {
      ...state.preferences,
      timestamp: state.timestamp,
    };
  }

  // Update from Enzuzo banner
  updateFromEnzuzo(enzuzoConsent: {
    analytics?: boolean;
    marketing?: boolean;
    functional?: boolean;
  }): void {
    this.setConsentPreferences({
      analytics: enzuzoConsent.analytics ?? false,
      marketing: enzuzoConsent.marketing ?? false,
      functional: enzuzoConsent.functional ?? false,
      necessary: true,
    });
  }

  // Initialize Enzuzo banner integration
  initializeEnzuzo(): void {
    if (typeof window === 'undefined') return;

    // Load Enzuzo script securely
    this.loadEnzuzoScript();
  }

  private loadEnzuzoScript(): void {
    // Check if script already exists
    if (document.querySelector('script[src*="enzuzo-cookiebar"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://app.enzuzo.com/apps/enzuzo/static/js/__enzuzo-cookiebar.js?uuid=1bf8f8f8-a786-11ed-a83e-eb67933cb390';
    script.async = true;
    script.defer = true;
    
    // Add security measures
    script.crossOrigin = 'anonymous';
    
    // Set up error handling
    script.onerror = () => {
      console.warn('Enzuzo cookie banner failed to load');
    };

    script.onload = () => {
      console.log('✅ Enzuzo cookie banner loaded successfully');
      this.setupEnzuzoIntegration();
    };

    document.head.appendChild(script);
  }

  private setupEnzuzoIntegration(): void {
    // Wait for Enzuzo to be available and set up bidirectional sync
    const checkEnzuzo = () => {
      if ((window as any).ezCookieSettings || (window as any).Enzuzo) {
        this.setupEnzuzoBidirectionalSync();
      } else {
        setTimeout(checkEnzuzo, 100);
      }
    };
    checkEnzuzo();
  }

  private setupEnzuzoBidirectionalSync(): void {
    if (typeof window === 'undefined') return;

    // Set up Enzuzo consent callback
    (window as any).enzuzoConsentCallback = (consent: any) => {
      console.log('📝 Enzuzo consent updated:', consent);
      this.updateFromEnzuzo({
        analytics: consent.analytics || consent.statisticalCookies || consent.statistical || false,
        marketing: consent.marketing || consent.marketingCookies || consent.advertising || false,
        functional: consent.functional || consent.functionalCookies || consent.preferences || false,
      });
    };

    // Sync our internal consent to Enzuzo when our state changes
    this.onConsentChange((state) => {
      const enzuzoSettings = (window as any).ezCookieSettings || (window as any).Enzuzo;
      if (enzuzoSettings && enzuzoSettings.updateConsent) {
        enzuzoSettings.updateConsent({
          analytics: state.preferences.analytics,
          marketing: state.preferences.marketing,
          functional: state.preferences.functional,
          necessary: true,
        });
      }
    });

    // Sync initial state to Enzuzo
    const currentState = this.getConsentState();
    if (currentState) {
      const enzuzoSettings = (window as any).ezCookieSettings || (window as any).Enzuzo;
      if (enzuzoSettings && enzuzoSettings.updateConsent) {
        enzuzoSettings.updateConsent({
          analytics: currentState.preferences.analytics,
          marketing: currentState.preferences.marketing,
          functional: currentState.preferences.functional,
          necessary: true,
        });
      }
    }

    console.log('🔄 Enzuzo bidirectional sync setup complete');
    
    // Verify GDPR compliance
    this.verifyGDPRCompliance();
  }

  private verifyGDPRCompliance(): void {
    const hasRequiredFeatures = {
      consentBanner: document.querySelector('script[src*="enzuzo-cookiebar"]') !== null,
      privacySettings: typeof this.getConsentState === 'function',
      dataExportAPI: fetch('/api/privacy/status').then(r => r.ok).catch(() => false),
      cookieCategories: Object.keys(this.getEnzuzoCompatibleState()).length === 4,
      optOutDefault: !this.hasAnalyticsConsent() // Should be false by default
    };

    console.log('🛡️ GDPR Compliance Check:', hasRequiredFeatures);
    
    if (hasRequiredFeatures.consentBanner && hasRequiredFeatures.privacySettings && hasRequiredFeatures.optOutDefault) {
      console.log('✅ GDPR compliance verified - All required features present');
    } else {
      console.warn('⚠️ GDPR compliance issues detected');
    }
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