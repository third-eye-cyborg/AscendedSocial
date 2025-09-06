import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { queryClient } from '@/lib/queryClient';

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Extract token and success parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const success = urlParams.get('success');
        
        console.log('🔄 Auth callback processing:', {
          token: token ? '***' : null,
          success,
          userAgent: navigator.userAgent,
          origin: window.location.origin
        });

        if (success === 'true' && token) {
          // Store the token for mobile authentication
          localStorage.setItem('auth_token', token);
          
          // Verify the token with the backend
          try {
            const response = await fetch('/api/auth/mobile-verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token })
            });
            
            const result = await response.json();
            
            if (result.success && result.valid) {
              console.log('✅ Token verified successfully');
              // Invalidate auth cache to trigger refresh
              queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
            } else {
              console.error('❌ Token verification failed:', result);
            }
          } catch (verifyError) {
            console.error('❌ Token verification error:', verifyError);
          }
          
          // Check if this is the React Native web app based on the current domain
          const isReactNativeWebApp = window.location.href.includes('095b9124-ae0d-4cdf-a44b-bdc917e288fa');
          
          if (isReactNativeWebApp) {
            console.log('🌐 Redirecting to React Native web app dashboard');
            // For React Native web app, redirect to its dashboard
            // Use a short delay to ensure token is stored before redirect
            setTimeout(() => setLocation('/home'), 100);
          } else {
            console.log('🏠 Redirecting to main app dashboard');
            // For main web app, redirect to main dashboard
            setLocation('/');
          }
        } else {
          console.error('❌ Authentication callback failed:', { success, hasToken: !!token });
          // Redirect to login page on failure
          window.location.href = '/api/login';
        }
      } catch (error) {
        console.error('❌ Auth callback error:', error);
        window.location.href = '/api/login';
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