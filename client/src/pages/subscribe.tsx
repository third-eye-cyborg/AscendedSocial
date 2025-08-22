import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.warn('Missing Stripe public key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY ? 
  loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY) : null;

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Welcome to Ascended Social Premium!",
      });
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-cosmic-light border-primary/30">
      <CardHeader>
        <CardTitle className="text-golden text-center">Complete Your Ascension</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          <Button 
            type="submit" 
            disabled={!stripe}
            className="w-full bg-golden text-cosmic hover:bg-golden/90 font-semibold"
            data-testid="button-subscribe"
          >
            Subscribe to Premium
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Create subscription as soon as the page loads
    apiRequest("POST", "/api/get-or-create-subscription")
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Error creating subscription:", error);
        setError("Failed to initialize payment. Please try again.");
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-cosmic text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-cosmic-light border-destructive/50">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-destructive/20 rounded-full flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-destructive text-2xl"></i>
            </div>
            <h2 className="text-xl font-semibold mb-2">Payment Error</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
              data-testid="button-home"
            >
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-cosmic text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Preparing your ascension...</p>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-cosmic text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-cosmic-light border-destructive/50">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Payment Unavailable</h2>
            <p className="text-gray-400">Payment processing is not available at this time.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic text-white">
      {/* Header */}
      <header className="border-b border-primary/30 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <i className="fas fa-lotus text-white"></i>
            </div>
            <span className="text-lg font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ascended Social
            </span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="text-gray-400 hover:text-white"
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
            <span className="bg-gradient-to-r from-golden to-primary bg-clip-text text-transparent">
              Ascended Social Premium
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Unlock the full power of your spiritual journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-golden">Premium Features</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-golden rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-check text-cosmic text-sm"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Tarot Readings</h3>
                  <p className="text-gray-400 text-sm">Unlimited personalized tarot consultations</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-golden rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-check text-cosmic text-sm"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Enhanced Energy Pool</h3>
                  <p className="text-gray-400 text-sm">5x more monthly energy allocation</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-golden rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-check text-cosmic text-sm"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Custom Sigil Generation</h3>
                  <p className="text-gray-400 text-sm">Create unlimited unique mystical sigils</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-golden rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-check text-cosmic text-sm"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Premium Content Creation</h3>
                  <p className="text-gray-400 text-sm">Monetize your wisdom with subscriber tiers</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-golden rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-check text-cosmic text-sm"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Live Streaming</h3>
                  <p className="text-gray-400 text-sm">Host live spiritual sessions and workshops</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <SubscribeForm />
            </Elements>
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center bg-cosmic-light rounded-xl p-6 border border-golden/30">
          <div className="text-3xl font-bold text-golden mb-2">$9.99/month</div>
          <p className="text-gray-400">Cancel anytime • Start your 7-day free trial</p>
        </div>
      </div>
    </div>
  );
}
