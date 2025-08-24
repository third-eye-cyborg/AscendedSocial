import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Sparkles } from 'lucide-react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <Card className="w-full max-w-md mx-auto border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
        <CardContent className="text-center p-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-2">
            ✨ Welcome to the Journey
          </h3>
          <p className="text-purple-600 dark:text-purple-300">
            You're now part of our spiritual community! Check your email for a special welcome message.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950" data-testid="card-newsletter-signup">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-br from-purple-700 to-pink-700 bg-clip-text text-transparent">
          Join Our Spiritual Newsletter
        </CardTitle>
        <CardDescription className="text-purple-600 dark:text-purple-300">
          Receive weekly wisdom, oracle insights, and community updates directly in your inbox
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newsletter-email" className="text-purple-800 dark:text-purple-200">
              Email Address *
            </Label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
              data-testid="input-newsletter-email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newsletter-firstName" className="text-purple-800 dark:text-purple-200">
              First Name (Optional)
            </Label>
            <Input
              id="newsletter-firstName"
              type="text"
              placeholder="Your spiritual name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
              data-testid="input-newsletter-firstName"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3"
            data-testid="button-newsletter-subscribe"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Subscribing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Subscribe to Newsletter
              </>
            )}
          </Button>
        </form>
        <p className="text-xs text-purple-500 dark:text-purple-400 mt-4 text-center">
          ✨ We respect your spiritual journey. Unsubscribe anytime with a single click.
        </p>
      </CardContent>
    </Card>
  );
}