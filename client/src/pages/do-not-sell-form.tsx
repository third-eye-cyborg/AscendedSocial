import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { ShieldOff, CheckCircle } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

interface DoNotSellRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  turnstileToken?: string;
}

export default function DoNotSellFormPage() {
  const { toast } = useToast();
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<DoNotSellRequest>({
    email: '',
    firstName: '',
    lastName: ''
  });

  // Check if Turnstile should be enabled
  const isProductionDomain = () => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return hostname === 'ascended.social' || 
           hostname === 'dev.ascended.social' || 
           hostname === 'app.ascended.social';
  };

  const shouldUseTurnstile = isProductionDomain();

  const doNotSellMutation = useMutation({
    mutationFn: (request: DoNotSellRequest) =>
      fetch('/api/privacy/do-not-sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...request,
          turnstileToken: shouldUseTurnstile ? turnstileToken : undefined
        })
      }).then(res => res.json()),
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Request Processed Successfully",
        description: "Your Do Not Sell request has been recorded and will be honored immediately."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (shouldUseTurnstile && !turnstileToken) {
      toast({
        title: "Security verification required",
        description: "Please complete the security verification to continue.",
        variant: "destructive",
      });
      return;
    }

    doNotSellMutation.mutate(formData);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-md border-purple-500/30">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
              <CardTitle className="text-2xl text-white">Request Confirmed</CardTitle>
              <CardDescription className="text-purple-200">
                Your Do Not Sell preference has been recorded successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
                <p className="text-purple-200 mb-2">
                  Your personal information will not be sold or shared with third parties for marketing purposes.
                </p>
                <p className="text-white font-semibold mt-4">Email: {formData.email}</p>
              </div>
              <p className="text-purple-300 text-sm">
                This preference is effective immediately and applies to all future data processing activities.
                You can manage your privacy preferences at any time.
              </p>
              <Link href="/">
                <Button className="mt-4" data-testid="button-home">
                  Return to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ShieldOff className="h-16 w-16 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4" data-testid="text-page-title">
            Do Not Sell My Personal Information
          </h1>
          <p className="text-xl text-purple-200">
            Exercise your CCPA rights
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">
              CCPA Do Not Sell Request
            </CardTitle>
            <CardDescription className="text-purple-200">
              Under the California Consumer Privacy Act (CCPA), you have the right to opt-out of the sale of your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-400/20 mb-6">
              <h3 className="text-white font-semibold mb-2">What This Means:</h3>
              <ul className="text-purple-200 text-sm space-y-1 list-disc list-inside">
                <li>We will not sell your personal information to third parties</li>
                <li>We will not share your data for advertising purposes</li>
                <li>Your preference will be stored and honored across all our services</li>
                <li>This does not affect data sharing required for service operation</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50"
                  data-testid="input-email"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">First Name (Optional)</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50"
                    data-testid="input-firstname"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">Last Name (Optional)</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50"
                    data-testid="input-lastname"
                  />
                </div>
              </div>

              {shouldUseTurnstile && (
                <div className="flex justify-center">
                  <Turnstile
                    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                    onSuccess={setTurnstileToken}
                    onError={() => console.error('Turnstile verification failed')}
                    onExpire={() => setTurnstileToken('')}
                  />
                </div>
              )}

              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-400/20">
                <p className="text-purple-200 text-sm">
                  <strong>Privacy Notice:</strong> This request is processed in accordance with CCPA regulations.
                  Your preference is stored securely on our EU-based Cloudflare D1 database and managed through
                  Fides privacy infrastructure with Probo audit logging. We never sell personal information
                  to third parties for advertising purposes.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={doNotSellMutation.isPending}
                data-testid="button-submit"
              >
                {doNotSellMutation.isPending ? 'Processing...' : 'Submit Do Not Sell Request'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/">
                <span className="text-purple-300 hover:text-white transition-colors text-sm cursor-pointer">
                  ← Back to Home
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-purple-300 text-sm">
          <p>For questions about your privacy rights, contact us at:</p>
          <a href="mailto:privacy@ascended.social" className="text-white hover:text-purple-200">
            privacy@ascended.social
          </a>
          <p className="mt-2">
            EU Representative: <strong>Prighter</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
