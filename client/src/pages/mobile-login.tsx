import { useEffect } from 'react';

export default function MobileLogin() {
  useEffect(() => {
    // Get current domain to pass as redirect_uri
    const currentOrigin = window.location.origin;
    const currentUrl = window.location.href;
    
    console.log('🔄 Initiating mobile login from:', currentUrl);
    
    // Determine platform type
    const isReactNativeWeb = currentUrl.includes('f9f72fa6-d1fb-425c-b9c8-6acf959c3a51');
    const platform = isReactNativeWeb ? 'expo-web' : 'web';
    
    // Build the redirect URL for mobile app callback
    const redirectUrl = `${currentOrigin}/auth`;
    
    // Use standard login endpoint with redirectUrl (proper for web-based mobile apps)
    const loginUrl = `/api/login?redirectUrl=${encodeURIComponent(redirectUrl)}`;
    
    console.log('🚀 Redirecting to standard login with mobile redirect:', {
      redirectUrl,
      loginUrl,
      platform
    });
    
    // Redirect to the standard login endpoint (supports webFallback: true)
    window.location.href = loginUrl;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Redirecting to login...</p>
      </div>
    </div>
  );
}