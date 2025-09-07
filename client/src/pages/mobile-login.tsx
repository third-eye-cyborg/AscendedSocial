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
    
    // Mobile apps should use the mobile-login endpoint specifically
    const mobileLoginUrl = `/api/auth/mobile-login?redirect_uri=${encodeURIComponent(currentOrigin)}&platform=${platform}`;
    
    console.log('🚀 Redirecting to mobile-login endpoint:', {
      currentOrigin,
      platform,
      mobileLoginUrl
    });
    
    // Redirect to the mobile-specific authentication endpoint
    window.location.href = mobileLoginUrl;
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