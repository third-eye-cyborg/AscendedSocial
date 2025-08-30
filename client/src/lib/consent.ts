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