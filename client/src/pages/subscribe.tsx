import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Product IDs mapping to Lemon Squeezy products
const PRODUCT_IDS = {
  MYSTIC: 'mystic_monthly',
  ASCENDED: 'ascended_monthly',
} as const;

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
  
  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // Get checkout configuration from backend
      const response = await apiRequest('POST', '/api/payments/checkout', { productId, plan });
      const data = await response.json();

      if (!data.success || !data.checkout) {
        throw new Error(data.error || 'Failed to get checkout configuration');
      }

      const { checkout } = data;

      // Redirect to Lemon Squeezy checkout
      window.location.href = checkout.checkoutUrl;
      
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
          disabled={isLoading}
          className="w-full bg-primary hover:bg-accent transition-colors"
          data-testid={`button-subscribe-${plan.toLowerCase()}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Opening Checkout...
            </>
          ) : (
            `Choose ${plan}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default function Subscribe() {
  const mysticFeatures = [
    "Unlimited posts and content",
    "Access to all chakra categories",
    "Daily oracle readings",
    "Enhanced energy system",
    "Priority support"
  ];

  const ascendedFeatures = [
    "Everything in Mystic",
    "Advanced oracle insights",
    "Unlimited energy points",
    "Exclusive spiritual content",
    "1-on-1 guidance sessions"
  ];

  return (
    <div className="min-h-screen bg-cosmic flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">
          Choose Your Spiritual Path
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SubscribeForm 
            plan="Mystic"
            price="$12/month"
            features={mysticFeatures}
            productId={PRODUCT_IDS.MYSTIC}
          />
          
          <SubscribeForm 
            plan="Ascended"
            price="$24/month"
            features={ascendedFeatures}
            productId={PRODUCT_IDS.ASCENDED}
          />
        </div>
      </div>
    </div>
  );
}
