import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Product IDs mapping to RevenueCat/Paddle products
const PRODUCT_IDS = {
  MYSTIC: 'mystic_monthly',
  ASCENDED: 'ascended_monthly',
} as const;

// Initialize Paddle
declare global {
  interface Window {
    Paddle?: any;
  }
}

const SubscribeForm = ({ 
  plan, 
  price, 
  features,
  productId,
}: { 
  plan: string; 
  price: string; 
  features: string[];
  productId: string;
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPaddleReady, setIsPaddleReady] = useState(false);

  useEffect(() => {
    // Load Paddle.js script
    const loadPaddle = () => {
      if (window.Paddle) {
        setIsPaddleReady(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.async = true;
      script.onload = () => {
        setIsPaddleReady(true);
      };
      script.onerror = () => {
        console.error('Failed to load Paddle.js');
        toast({
          title: "Loading Error",
          description: "Failed to load payment system. Please refresh the page.",
          variant: "destructive",
        });
      };
      document.head.appendChild(script);
    };

    loadPaddle();
  }, [toast]);
  
  const handleCheckout = async () => {
    if (!isPaddleReady) {
      toast({
        title: "Please wait",
        description: "Payment system is still loading...",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get checkout configuration from backend
      const response = await apiRequest<{
        success: boolean;
        checkout: {
          productId: string;
          priceId: string;
          productName: string;
          price: string;
          clientToken: string;
          environment: string;
        };
      }>('/api/payments/checkout', {
        method: 'POST',
        body: JSON.stringify({ productId, plan })
      });

      if (!response.success || !response.checkout) {
        throw new Error('Failed to get checkout configuration');
      }

      const { checkout } = response;

      // Validate that we have a valid client token
      if (!checkout.clientToken) {
        throw new Error('Payment system is not configured. Please contact support.');
      }

      // Initialize Paddle with the client token
      if (window.Paddle) {
        window.Paddle.Environment.set(checkout.environment === 'production' ? 'production' : 'sandbox');
        window.Paddle.Initialize({
          token: checkout.clientToken,
          eventCallback: (event: any) => {
            if (event.name === 'checkout.completed') {
              toast({
                title: "Success!",
                description: "Your subscription is now active.",
              });
              // Redirect to success page
              window.location.href = '/subscription-success';
            } else if (event.name === 'checkout.closed') {
              setIsLoading(false);
            }
          }
        });

        // Open checkout
        window.Paddle.Checkout.open({
          items: [{ priceId: checkout.priceId, quantity: 1 }],
          customData: {
            productId: checkout.productId,
            plan: plan
          }
        });

        toast({
          title: "Checkout Opened",
          description: "Complete your payment to activate your subscription.",
        });
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Error",
        description: error instanceof Error ? error.message : "Failed to open checkout. Please try again.",
        variant: "destructive",
      });
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
          onClick={handleCheckout}
          disabled={isLoading || !isPaddleReady}
          className="w-full bg-primary hover:bg-accent transition-colors"
          data-testid={`button-subscribe-${plan.toLowerCase()}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Opening Checkout...
            </>
          ) : !isPaddleReady ? (
            'Initializing...'
          ) : (
            `Choose ${plan}`
          )}
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
            price="$12/month"
            productId={PRODUCT_IDS.MYSTIC}
            features={[
              "Personal AI sigil generation",
              "Daily oracle readings", 
              "Chakra intelligence system",
              "Advanced aura tracking",
              "Sacred circles access"
            ]}
          />
          
          <SubscribeForm 
            plan="Ascended"
            price="$24/month"
            productId={PRODUCT_IDS.ASCENDED}
            features={[
              "Everything in Mystic",
              "AI tarot readings",
              "Create sacred circles",
              "Advanced energy analytics",
              "Priority community support",
              "Unlimited visions & sparks"
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
