import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { queryClient } from '@/lib/queryClient';

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check URL parameters for Replit mobile authentication
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const state = urlParams.get('state');
        
        console.log('🔄 Replit Auth callback processing:', {
          hasToken: !!token,
          state,
          currentUrl: window.location.href
        });

        // Invalidate auth cache since we're now authenticated
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

        if (token && state && state !== 'default') {
          // Mobile authentication - handle token and redirect
          try {
            const stateData = JSON.parse(state);
            const mobileCallback = stateData.callback || stateData.redirectUri;
            
            if (mobileCallback) {
              const separator = mobileCallback.includes('?') ? '&' : '?';
              const redirectUrl = `${mobileCallback}${separator}token=${token}`;
              console.log(`📱 Mobile auth redirect: ${redirectUrl.substring(0, 100)}...`);
              window.location.href = redirectUrl;
              return;
            }
          } catch {
            // State is not JSON, handle as simple string
            console.log('📱 Simple state parameter, storing token for mobile app');
            
            // Store token in localStorage for mobile apps to pick up
            localStorage.setItem('auth_token', token);
            localStorage.setItem('replit_auth_token', token);
            
            // Try to communicate with mobile app via postMessage
            if (window.parent !== window) {
              window.parent.postMessage({ 
                type: 'replit_auth_success', 
                token,
                state 
              }, '*');
            }
          }
        }

        if (token && (!state || state === 'default')) {
          // Web fallback: persist token for iframe contexts where cookies may be blocked
          localStorage.setItem('auth_token', token);
          localStorage.setItem('replit_auth_token', token);
        }

        // Regular web app authentication - go to dashboard
        console.log('🏠 Replit web auth - redirecting to dashboard');
        setLocation('/');
        
      } catch (error) {
        console.error('❌ Replit auth callback error:', error);
        setLocation('/?error=auth_failed');
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