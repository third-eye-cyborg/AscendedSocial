import { useState, useEffect } from 'react';
import { consentManager, type ConsentState, type ConsentPreferences } from '@/lib/consent';

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
