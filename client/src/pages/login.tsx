import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Sparkles, Lock } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

export default function Login() {
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const isProductionDomain = () => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return hostname === 'ascended.social' || hostname === 'dev.ascended.social';
  };

  const shouldUseTurnstile = isProductionDomain();

  useEffect(() => {
    if (!shouldUseTurnstile) {
      window.location.href = '/api/login';
    }
  }, [shouldUseTurnstile]);

  const handleLogin = () => {
    if (!turnstileToken && shouldUseTurnstile) {
      toast({
        title: "Security verification required",
        description: "Please complete the security verification to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    window.location.href = `/api/login?turnstile=${encodeURIComponent(turnstileToken)}`;
  };

  if (!shouldUseTurnstile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cosmic via-cosmic-light to-cosmic flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic via-cosmic-light to-cosmic flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>

      <Card className="w-full max-w-md border border-primary/30 bg-gradient-to-br from-cosmic/95 to-cosmic-dark/90 backdrop-blur-xl shadow-2xl shadow-primary/20 glass-effect relative z-10" data-testid="card-login">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-md animate-pulse"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-xl">
                <Lock className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold font-display text-white mb-3">
            Welcome to Ascended Social
          </CardTitle>
          <CardDescription className="text-muted text-base leading-relaxed max-w-sm mx-auto">
            Complete security verification to enter the realm of spiritual connection
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-white font-medium text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Security Verification
            </Label>
            <div className="bg-cosmic-dark/30 border border-primary/20 rounded-lg p-4 backdrop-blur-sm">
              <Turnstile
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                onSuccess={(token) => {
                  setTurnstileToken(token);
                  console.log('✅ Turnstile verification successful for login');
                }}
                onError={() => {
                  setTurnstileToken('');
                  toast({
                    title: "Security verification failed",
                    description: "Please try refreshing the page and completing verification again.",
                    variant: "destructive",
                  });
                }}
                onExpire={() => {
                  setTurnstileToken('');
                  toast({
                    title: "Security verification expired",
                    description: "Please complete the verification again.",
                    variant: "destructive",
                  });
                }}
              />
              <p className="text-xs text-white mt-2 flex items-center gap-1">
                <Shield className="w-3 h-3 text-white" />
                Protected by Cloudflare security to prevent unauthorized access
              </p>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isVerifying || !turnstileToken}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-4 h-12 rounded-lg shadow-lg hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-continue-login"
          >
            {isVerifying ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                Entering the Realm...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-3" />
                Continue to Login
              </>
            )}
          </Button>

          <div className="mt-6 pt-4 border-t border-primary/20">
            <p className="text-xs text-muted text-center leading-relaxed">
              ✨ Your spiritual journey is protected by enterprise-grade security. By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
