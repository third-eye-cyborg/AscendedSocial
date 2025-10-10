import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SubscribeForm = ({ 
  plan, 
  price, 
  features,
}: { 
  plan: string; 
  price: string; 
  features: string[];
}) => {
  return (
    <Card className="w-full max-w-md mx-auto bg-cosmic-light border-primary/30 relative">
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-cosmic text-sm font-bold px-4 py-1.5 rounded-full shadow-lg z-10">
        Coming Soon
      </div>
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
        <div className="bg-cosmic/50 border border-primary/30 rounded-xl p-4 mb-4">
          <p className="text-white/90 text-sm">
            <i className="fas fa-info-circle text-primary mr-2"></i>
            Payment processing is currently being set up. Check back soon!
          </p>
        </div>
        <Button 
          disabled
          className="w-full bg-primary/50 cursor-not-allowed opacity-60"
          data-testid={`button-subscribe-${plan.toLowerCase()}`}
        >
          Coming Soon
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
          />
          
          <SubscribeForm 
            plan="Ascended"
            price="$24/month"
            features={ascendedFeatures}
          />
        </div>
      </div>
    </div>
  );
}
