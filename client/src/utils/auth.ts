/**
 * WorkOS Authentication Utility
 * Handles authentication flow for both web and mobile environments
 */

/**
 * Detects if the app is running in a mobile environment
 */
export function isMobileEnvironment(): boolean {
  // Check if running on mobile domains
  const hostname = window.location.hostname;
  
  // Mobile development environment
  if (hostname.includes('f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev')) {
    return true;
  }
  
  // Mobile production environment  
  if (hostname.includes('app.ascended.social')) {
    return true;
  }
  
  // Check user agent for mobile devices (React Native, Expo)
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Expo') || userAgent.includes('ReactNative')) {
    return true;
  }
  
  return false;
}

/**
 * Gets the correct authentication URL based on environment
 */
export function getAuthUrl(redirectUrl?: string): string {
  const baseUrl = '/api/login';
  
  if (isMobileEnvironment()) {
    console.log('🔍 WorkOS mobile auth flow:', {
      platform: 'mobile',
      environment: window.location.hostname.includes('app.ascended.social') ? 'Production' : 'Development',
      redirectUrl: redirectUrl || window.location.origin,
      authEndpoint: baseUrl
    });
    
    // Mobile authentication with state parameter for callback
    const state = JSON.stringify({
      platform: 'mobile',
      callback: redirectUrl || `${window.location.origin}/auth-callback`,
      redirectUri: redirectUrl || window.location.origin
    });
    
    return `${baseUrl}?state=${encodeURIComponent(state)}`;
  } else {
    console.log('🔍 WorkOS web auth flow:', {
      platform: 'web', 
      environment: window.location.hostname.includes('ascended.social') ? 'Production' : 'Development',
      redirectUrl: redirectUrl || window.location.origin,
      authEndpoint: baseUrl
    });
    
    // Web authentication
    return redirectUrl ? `${baseUrl}?redirectUrl=${encodeURIComponent(redirectUrl)}` : baseUrl;
  }
}

/**
 * Initiates authentication flow - Uses WorkOS AuthKit for all environments
 */
export function initiateAuth(redirectUrl?: string): void {
  window.location.href = getAuthUrl(redirectUrl);
}

/**
 * Checks if there's a stored WorkOS auth token (for mobile apps)
 */
export function getStoredAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('workos_auth_token');
  }
  return null;
}

/**
 * Clears stored WorkOS auth token
 */
export function clearStoredAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('workos_auth_token');
  }
}