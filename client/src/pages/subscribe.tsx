import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SubscribeForm = ({ plan, price, features }: { plan: string; price: string; features: string[] }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePaddleCheckout = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Paddle checkout integration
      // This will redirect to Paddle's hosted checkout page
      toast({
        title: "Redirecting to Checkout",
        description: "You'll be redirected to our secure payment page...",
      });
      
      // Placeholder for Paddle checkout URL
      console.log(`Starting ${plan} subscription checkout with Paddle`);
      
    } catch (error) {
      toast({
        title: "Checkout Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-cosmic-light border-primary/30">
      <CardHeader>
        <CardTitle className="text-accent-light text-center">{plan} Plan</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-3xl font-bold text-primary mb-4">{price}</div>
        <div className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-muted-foreground">
              <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center mr-2">
                <i className="fas fa-check text-cosmic text-xs"></i>
              </div>
              {feature}
            </div>
          ))}
        </div>
        <Button 
          onClick={handlePaddleCheckout}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-accent transition-colors"
          data-testid={`button-subscribe-${plan.toLowerCase()}`}
        >
          {isLoading ? 'Loading...' : `Choose ${plan}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default function Subscribe() {
  return (
    <div className="min-h-screen bg-cosmic text-white">
      {/* Header */}
      <header className="border-b border-primary/30 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <i className="fas fa-lotus text-white"></i>
            </div>
            <span className="text-lg font-display font-bold text-primary">
              Ascended Social
            </span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="text-muted hover:text-white"
            data-testid="button-back"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back
          </Button>
        </div>
      </header>

      {/* Premium Features Overview */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold mb-4">
            <span className="text-accent-light">
              Ascended Social Premium
            </span>
          </h1>
          <p className="text-xl text-subtle">
            Unlock the full power of your spiritual journey
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <SubscribeForm 
            plan="Mystic"
            price="$9.99/month"
            features={[
              "Unlimited energy allocation",
              "Enhanced oracle readings", 
              "Custom sigil generation",
              "Priority community support"
            ]}
          />
          
          <SubscribeForm 
            plan="Enlightened"
            price="$19.99/month"
            features={[
              "All Mystic features",
              "Live streaming capabilities",
              "Premium content creation tools",
              "Advanced starmap features",
              "Personal spiritual advisor"
            ]}
          />
        </div>

        {/* Premium Features Detail */}
        <div className="bg-cosmic-light rounded-xl p-6 border border-primary/30 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-accent-light text-center">Premium Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-check text-cosmic text-sm"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Tarot Readings</h3>
                  <p className="text-muted text-sm">Unlimited personalized tarot consultations</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-check text-cosmic text-sm"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Enhanced Energy Pool</h3>
                  <p className="text-muted text-sm">5x more monthly energy allocation</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-check text-cosmic text-sm"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Custom Sigil Generation</h3>
                  <p className="text-muted text-sm">Create unlimited unique mystical sigils</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-check text-cosmic text-sm"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Premium Content Creation</h3>
                  <p className="text-muted text-sm">Monetize your wisdom with subscriber tiers</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-check text-cosmic text-sm"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Live Streaming</h3>
                  <p className="text-muted text-sm">Host live spiritual sessions and workshops</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-check text-cosmic text-sm"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Advanced Analytics</h3>
                  <p className="text-muted text-sm">Track your spiritual growth journey</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="text-center">
          <div className="text-sm">
            <span className="text-muted">By subscribing, you agree to our </span>
            <a href="/payment-terms" className="text-primary hover:text-primary/80 underline" data-testid="link-payment-terms">
              Payment Terms
            </a>
            <span className="text-muted"> and </span>
            <a href="/terms-of-service" className="text-primary hover:text-primary/80 underline" data-testid="link-terms">
              Terms of Service
            </a>
            <span className="text-muted">. Subscriptions managed by RevenueCat and processed securely by Paddle.</span>
          </div>
        </div>
      </div>
    </div>
  );
}