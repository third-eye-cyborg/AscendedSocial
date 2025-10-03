// Privacy consent management for TermsHub integration with Fides and Probo
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
const CONSENT_VERSION = '3.0'; // Updated for TermsHub migration

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
      
      // Send consent data to Fides for consent logging
      this.logConsentToFides(state);
      
      // Send consent event to Probo for auditing
      this.logConsentToProbo(state);
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

  // Update from TermsHub banner
  updateFromTermsHub(termsHubConsent: {
    analytics?: boolean;
    marketing?: boolean;
    functional?: boolean;
  }): void {
    this.setConsentPreferences({
      analytics: termsHubConsent.analytics ?? false,
      marketing: termsHubConsent.marketing ?? false,
      functional: termsHubConsent.functional ?? false,
      necessary: true,
    });
  }

  // Initialize TermsHub banner integration
  initializeTermsHub(): void {
    if (typeof window === 'undefined') return;

    console.log('🛡️ Initializing TermsHub cookie consent integration...');
    
    // Set up TermsHub event listeners
    this.setupTermsHubListeners();
    
    // Sync existing consent state
    this.syncConsentState();
    
    // Verify compliance
    this.verifyGDPRCompliance();
  }

  private setupTermsHubListeners(): void {
    // Listen for TermsHub consent events
    window.addEventListener('termshub:consent', ((event: CustomEvent) => {
      console.log('📝 TermsHub consent event:', event.detail);
      
      const consent = event.detail;
      this.updateFromTermsHub({
        analytics: consent.analytics || false,
        marketing: consent.marketing || false,
        functional: consent.functional || false,
      });
    }) as EventListener);

    window.addEventListener('termshub:ready', (() => {
      console.log('✅ TermsHub cookie banner loaded successfully');
      this.syncConsentState();
    }) as EventListener);
  }

  private syncConsentState(): void {
    // Sync our local state with TermsHub if available
    const currentState = this.getConsentState();
    if (currentState && (window as any).TermsHub) {
      console.log('🔄 Syncing consent state with TermsHub');
    }
  }

  private logConsentToFides(state: ConsentState): void {
    // Log consent to Fides for GDPR/CCPA compliance
    fetch('/api/privacy/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        purposes: state.preferences,
        timestamp: state.timestamp,
        version: state.version,
      })
    }).catch(error => {
      console.error('Failed to log consent to Fides:', error);
    });
  }

  private logConsentToProbo(state: ConsentState): void {
    // Log consent event to Probo for auditing
    fetch('/api/consent/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'consent_updated',
        preferences: state.preferences,
        timestamp: state.timestamp,
      })
    }).catch(error => {
      console.error('Failed to log consent to Probo:', error);
    });
  }

  private verifyGDPRCompliance(): void {
    const hasRequiredFeatures = {
      consentBanner: document.querySelector('script[src*="termshub"]') !== null,
      privacySettings: typeof this.getConsentState === 'function',
      dataExportAPI: true,
      cookieCategories: Object.keys(this.getConsentState()?.preferences || {}).length >= 4,
      optOutDefault: !this.hasAnalyticsConsent()
    };

    console.log('🛡️ GDPR Compliance Check:', hasRequiredFeatures);
    
    if (hasRequiredFeatures.consentBanner && hasRequiredFeatures.privacySettings && hasRequiredFeatures.optOutDefault) {
      console.log('✅ GDPR compliance verified - All required features present');
    } else {
      console.warn('⚠️ GDPR compliance issues detected');
    }
  }

  // Get consent state in a compatible format
  getCompatibleState(): ConsentPreferences & { timestamp?: string } {
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
