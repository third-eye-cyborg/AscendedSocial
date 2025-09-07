/**
 * Mobile Authentication Utility
 * Detects mobile environment and routes to appropriate auth endpoint
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
export function getAuthUrl(): string {
  if (isMobileEnvironment()) {
    console.log('🔍 Debugging mobile auth redirect logic:', {
      platform: 'mobile',
      environment: window.location.hostname.includes('app.ascended.social') ? 'Production' : 'Development',
      redirectUrl: window.location.origin,
      authEndpoint: '/api/auth/mobile-login'
    });
    console.log('🎯 Using mobile OAuth flow');
    
    // Mobile authentication with redirect_uri parameter
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth`);
    return `/api/auth/mobile-login?redirect_uri=${redirectUri}&platform=web`;
  } else {
    console.log('🔍 Debugging web auth redirect logic:', {
      platform: 'web', 
      environment: window.location.hostname.includes('ascended.social') ? 'Production' : 'Development',
      redirectUrl: window.location.origin,
      authEndpoint: '/api/login'
    });
    console.log('🎯 Using web OAuth flow');
    
    // Web authentication
    return '/api/login';
  }
}

/**
 * Initiates authentication flow
 */
export function initiateAuth(): void {
  // For mobile environments, use new popup-based authentication
  if (isMobileEnvironment()) {
    window.location.href = '/mobile-auth';
  } else {
    window.location.href = getAuthUrl();
  }
}

/**
 * Enhanced API request function with JWT token support for mobile
 */
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  // For mobile apps, add JWT token from localStorage if available
  const token = localStorage.getItem('auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add JWT token for cross-domain authentication
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};