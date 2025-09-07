import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { queryClient } from '@/lib/queryClient';

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check URL parameters for mobile bounce
        const urlParams = new URLSearchParams(window.location.search);
        const mobileBounce = urlParams.get('mobile_bounce');
        const mobileReferrer = urlParams.get('mobile_referrer');
        const mobileCallback = urlParams.get('mobile_callback');
        
        console.log('🔄 Auth callback - checking mobile bounce:', {
          mobileBounce,
          mobileReferrer,
          mobileCallback,
          currentUrl: window.location.href
        });

        // Invalidate auth cache since we're now authenticated
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

        if (mobileBounce === 'true' && mobileCallback) {
          // MOBILE BOUNCE: User came from mobile, redirect them back with secure auth token
          const authToken = urlParams.get('auth_token');
          let redirectUrl = decodeURIComponent(mobileCallback);
          
          if (authToken) {
            // Append secure token to mobile callback URL
            const separator = redirectUrl.includes('?') ? '&' : '?';
            redirectUrl += `${separator}auth_token=${authToken}`;
            console.log(`📱 Bouncing back to mobile with secure token: ${redirectUrl.substring(0, 100)}...`);
          } else {
            console.log(`📱 Bouncing back to mobile (no token): ${redirectUrl}`);
          }
          
          window.location.href = redirectUrl;
          return;
        }

        // Regular web app authentication - go to dashboard
        console.log('🏠 Regular web auth - redirecting to dashboard');
        setLocation('/');
        
      } catch (error) {
        console.error('❌ Auth callback error:', error);
        setLocation('/');
      }
    };

    handleAuthCallback();
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-purple-200 font-medium">Completing authentication...</p>
        <p className="text-purple-300 text-sm">Redirecting you to your dashboard</p>
      </div>
    </div>
  );
}