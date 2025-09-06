import { useEffect } from 'react';

export default function MobileLogin() {
  useEffect(() => {
    // Get current domain to pass as redirect_uri
    const currentOrigin = window.location.origin;
    const currentUrl = window.location.href;
    
    console.log('🔄 Initiating mobile login from:', currentUrl);
    
    // Determine platform type
    const isReactNativeWeb = currentUrl.includes('095b9124-ae0d-4cdf-a44b-bdc917e288fa');
    const platform = isReactNativeWeb ? 'expo-web' : 'web';
    
    // Build the mobile login URL with proper parameters
    const mobileLoginUrl = `/api/auth/mobile-login?redirect_uri=${encodeURIComponent(currentOrigin)}&platform=${platform}`;
    
    console.log('🚀 Redirecting to mobile login:', mobileLoginUrl);
    
    // Redirect to the server endpoint for mobile authentication
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