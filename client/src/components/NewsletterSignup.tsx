import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Sparkles, Shield } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  // Check if Turnstile should be enabled based on domain
  const isProductionDomain = () => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return hostname === 'ascended.social' || 
           hostname === 'dev.ascended.social' || 
           hostname === 'app.ascended.social';
  };

  const shouldUseTurnstile = isProductionDomain();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if Turnstile verification is complete (only for production domains)
    if (shouldUseTurnstile && !turnstileToken) {
      toast({
        title: "Security verification required",
        description: "Please complete the security verification to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          turnstileToken: shouldUseTurnstile ? turnstileToken : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
        toast({
          title: "🌟 Welcome to our spiritual community!",
          description: "You've successfully subscribed to our newsletter. Check your email for a warm welcome message.",
        });
      } else {
        toast({
          title: "Subscription failed",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Unable to subscribe right now. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className="w-full max-w-md mx-auto border border-primary/30 bg-gradient-to-br from-cosmic/95 to-cosmic-dark/90 backdrop-blur-xl shadow-2xl shadow-primary/20">
        <CardContent className="text-center p-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-full blur-lg animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3 font-display">
            ✨ Welcome to the Journey
          </h3>
          <p className="text-muted leading-relaxed">
            You're now part of our spiritual community! Check your email for a special welcome message filled with cosmic wisdom.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto border border-primary/30 bg-gradient-to-br from-cosmic/95 to-cosmic-dark/90 backdrop-blur-xl shadow-2xl shadow-primary/20 glass-effect" data-testid="card-newsletter-signup">
      <CardHeader className="text-center pb-6">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-md animate-pulse"></div>
            <div className="relative w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-xl">
              <Mail className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold font-display text-white mb-3">
          Join Our Spiritual Newsletter
        </CardTitle>
        <CardDescription className="text-muted text-base leading-relaxed max-w-sm mx-auto">
          Receive weekly wisdom, oracle insights, and community updates directly in your inbox
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="newsletter-email" className="text-white font-medium text-sm">
              Email Address *
            </Label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 text-white placeholder:text-muted rounded-lg h-12 backdrop-blur-sm bg-[#2b2d31]"
              data-testid="input-newsletter-email"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="newsletter-firstName" className="text-white font-medium text-sm">
              First Name (Optional)
            </Label>
            <Input
              id="newsletter-firstName"
              type="text"
              placeholder="Your spiritual name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 text-white placeholder:text-muted rounded-lg h-12 backdrop-blur-sm bg-[#2b2d31]"
              data-testid="input-newsletter-firstName"
            />
          </div>
          
          {/* Turnstile Security Verification - Only on Production Domains */}
          {shouldUseTurnstile && (
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
                    console.log('✅ Turnstile verification successful');
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
                  Protected by Cloudflare security to prevent spam
                </p>
              </div>
            </div>
          )}
          <Button
            type="submit"
            disabled={isLoading || !email || (shouldUseTurnstile && !turnstileToken)}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-4 h-12 rounded-lg shadow-lg hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-newsletter-subscribe"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                Awakening Connection...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-3" />
                Begin Your Spiritual Journey
              </>
            )}
          </Button>
        </form>
        <div className="mt-6 pt-4 border-t border-primary/20">
          <p className="text-xs text-muted text-center leading-relaxed">
            ✨ We respect your spiritual journey and sacred inbox. Unsubscribe anytime with loving kindness.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}