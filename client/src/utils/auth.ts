/**
 * Replit Authentication Utility
 * Handles authentication flow for both web and mobile environments
 */

/**
 * Detects if the app is running in a mobile environment
 */
export function isMobileEnvironment(): boolean {
  // Check if running on mobile domains
  const hostname = window.location.hostname;
  const userAgent = navigator.userAgent;
  
  console.log('🔍 [MOBILE-DEBUG] Environment check:', {
    hostname,
    userAgent: userAgent.substring(0, 100) + '...',
    contains_mobile_dev_domain: hostname.includes('f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev'),
    contains_app_ascended: hostname.includes('app.ascended.social'),
    contains_expo: userAgent.includes('Expo'),
    contains_react_native: userAgent.includes('ReactNative')
  });
  
  // Mobile development environment
  if (hostname.includes('f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev')) {
    console.log('🔍 [MOBILE-DEBUG] Detected mobile development environment');
    return true;
  }
  
  // Mobile production environment  
  if (hostname.includes('app.ascended.social')) {
    console.log('🔍 [MOBILE-DEBUG] Detected mobile production environment');
    return true;
  }
  
  // Check user agent for mobile devices (React Native, Expo)
  if (userAgent.includes('Expo') || userAgent.includes('ReactNative')) {
    console.log('🔍 [MOBILE-DEBUG] Detected React Native/Expo environment');
    return true;
  }
  
  console.log('🔍 [MOBILE-DEBUG] Detected web environment');
  return false;
}

/**
 * Checks if the app is running on a production domain
 */
function isProductionDomain(): boolean {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname === 'ascended.social' || hostname === 'dev.ascended.social';
}

/**
 * Gets the correct authentication URL based on environment
 */
export function getAuthUrl(redirectUrl?: string): string {
  try {
    console.log('🔧 [AUTH-DEBUG] getAuthUrl() called with:', { redirectUrl });
    
    const isMobile = isMobileEnvironment();
    const isProd = isProductionDomain();
    
    console.log('🔧 [AUTH-DEBUG] Mobile environment check:', isMobile);
    console.log('🔧 [AUTH-DEBUG] Production domain check:', isProd);
    
    if (isMobile) {
      // Mobile always uses /api/login directly (bypasses Turnstile via state parameter)
      const baseUrl = '/api/login';
      
      console.log('🔍 [AUTH-DEBUG] Replit Auth mobile flow:', {
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
      
      const finalUrl = `${baseUrl}?state=${encodeURIComponent(state)}`;
      console.log('🔧 [AUTH-DEBUG] Generated mobile auth URL:', finalUrl);
      return finalUrl;
    } else {
      // Web authentication - use /login with Turnstile on production
      const baseUrl = isProd ? '/login' : '/api/login';
      
      console.log('🔍 [AUTH-DEBUG] Replit Auth web flow:', {
        platform: 'web', 
        environment: window.location.hostname.includes('ascended.social') ? 'Production' : 'Development',
        redirectUrl: redirectUrl || window.location.origin,
        authEndpoint: baseUrl,
        usesTurnstile: isProd
      });
      
      // Web authentication
      const finalUrl = redirectUrl ? `${baseUrl}?redirectUrl=${encodeURIComponent(redirectUrl)}` : baseUrl;
      console.log('🔧 [AUTH-DEBUG] Generated web auth URL:', finalUrl);
      return finalUrl;
    }
  } catch (error) {
    console.error('❌ [AUTH-DEBUG] Error in getAuthUrl():', error);
    throw error;
  }
}

/**
 * Initiates authentication flow - Uses Replit Auth for all environments
 */
export function initiateAuth(redirectUrl?: string): void {
  try {
    console.log('🚀 [AUTH-DEBUG] initiateAuth() called with:', { redirectUrl });
    
    const authUrl = getAuthUrl(redirectUrl);
    console.log('🔗 [AUTH-DEBUG] Generated auth URL:', authUrl);
    console.log('🌐 [AUTH-DEBUG] Current window.location:', {
      href: window.location.href,
      origin: window.location.origin,
      hostname: window.location.hostname,
      pathname: window.location.pathname
    });
    
    console.log('⏳ [AUTH-DEBUG] About to redirect to:', authUrl);
    window.location.href = authUrl;
    console.log('✅ [AUTH-DEBUG] Redirect command executed');
    
    // Additional debug: Check if redirect actually happened after a short delay
    setTimeout(() => {
      console.log('🔍 [AUTH-DEBUG] Post-redirect check - current URL:', window.location.href);
    }, 100);
    
  } catch (error) {
    console.error('❌ [AUTH-DEBUG] Error in initiateAuth():', error);
    console.error('❌ [AUTH-DEBUG] Error stack:', error instanceof Error ? error.stack : 'No stack available');
  }
}

/**
 * Checks if there's a stored Replit auth token (for mobile apps)
 */
export function getStoredAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('replit_auth_token');
  }
  return null;
}

/**
 * Clears stored Replit auth token
 */
export function clearStoredAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('replit_auth_token');
  }
}