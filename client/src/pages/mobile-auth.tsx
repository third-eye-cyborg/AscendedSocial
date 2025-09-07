import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { queryClient } from '@/lib/queryClient';

/**
 * Mobile Cross-Domain Authentication Handler
 * 
 * This page handles authentication for mobile apps running on different Replit domains.
 * It uses JWT tokens for cross-domain authentication since Replit Auth is limited to single projects.
 */
export default function MobileAuth() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Authenticating...');

  useEffect(() => {
    const handleMobileAuth = async () => {
      try {
        // Get the backend domain for authentication
        const backendDomain = 'https://6aaaa561-0065-42b7-9a43-fa52389738ae-00-123k4q64cdvhw.spock.replit.dev';
        
        // Open authentication in a popup window
        const authUrl = `${backendDomain}/api/auth/mobile-popup?origin=${encodeURIComponent(window.location.origin)}`;
        const popup = window.open(
          authUrl,
          'auth',
          'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        if (!popup) {
          throw new Error('Popup blocked. Please allow popups for authentication.');
        }

        setMessage('Please complete authentication in the popup window...');

        // Listen for auth completion message from popup
        const handleMessage = (event: MessageEvent) => {
          // Verify origin for security
          if (event.origin !== backendDomain) return;

          if (event.data.type === 'AUTH_SUCCESS' && event.data.token) {
            // Store the JWT token
            localStorage.setItem('auth_token', event.data.token);
            
            // Close popup
            popup.close();
            
            // Verify token with backend
            verifyToken(event.data.token);
          } else if (event.data.type === 'AUTH_ERROR') {
            popup.close();
            setStatus('error');
            setMessage(event.data.message || 'Authentication failed');
          }
        };

        window.addEventListener('message', handleMessage);

        // Check if popup is closed manually
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', handleMessage);
            
            // Only show error if authentication wasn't successful
            if (status === 'loading') {
              setStatus('error');
              setMessage('Authentication was cancelled');
            }
          }
        }, 1000);

      } catch (error) {
        console.error('Mobile auth error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
      }
    };

    const verifyToken = async (token: string) => {
      try {
        const backendDomain = 'https://6aaaa561-0065-42b7-9a43-fa52389738ae-00-123k4q64cdvhw.spock.replit.dev';
        const response = await fetch(`${backendDomain}/api/auth/mobile-verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        const result = await response.json();

        if (result.success && result.valid) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          
          // Invalidate auth cache to trigger refresh
          queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
          
          // Redirect to main app
          setTimeout(() => setLocation('/'), 1000);
        } else {
          throw new Error(result.message || 'Token verification failed');
        }
      } catch (error) {
        console.error('Token verification error:', error);
        setStatus('error');
        setMessage('Authentication verification failed');
        localStorage.removeItem('auth_token');
      }
    };

    // Check if we already have a token
    const existingToken = localStorage.getItem('auth_token');
    if (existingToken) {
      setMessage('Verifying existing authentication...');
      verifyToken(existingToken);
    } else {
      handleMobileAuth();
    }
  }, [setLocation, status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-xl animate-pulse"></div>
          <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-primary via-purple-500 to-secondary rounded-full flex items-center justify-center shadow-2xl border border-white/20">
            <span className="text-2xl">🔮</span>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-white">
            {status === 'loading' && 'Authenticating'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Authentication Failed'}
          </h1>
          
          <p className="text-purple-200">{message}</p>

          {/* Loading spinner */}
          {status === 'loading' && (
            <div className="w-8 h-8 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          )}

          {/* Error - Retry button */}
          {status === 'error' && (
            <button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}