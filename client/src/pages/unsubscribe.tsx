import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Mail, Loader2 } from "lucide-react";

export default function Unsubscribe() {
  const [location] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'not-found'>('loading');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const token = params.get('token');
    
    if (!token) {
      setStatus('not-found');
      setMessage('No unsubscribe token provided');
      return;
    }
    
    // Call unsubscribe API
    fetch(`/api/newsletter/unsubscribe?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage('Failed to unsubscribe');
        }
      })
      .catch(error => {
        console.error('Unsubscribe error:', error);
        setStatus('error');
        setMessage('Network error occurred');
      });
  }, [location]);

  const goHome = () => {
    window.location.href = '/';
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cosmic via-cosmic-light to-cosmic flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-purple-200 bg-white/95 backdrop-blur-sm">
          <CardContent className="text-center p-8">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-purple-600 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Your Request</h2>
            <p className="text-gray-600">Please wait while we unsubscribe you from our newsletter...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cosmic via-cosmic-light to-cosmic flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-green-200 bg-white/95 backdrop-blur-sm" data-testid="card-unsubscribe-success">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">Successfully Unsubscribed</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-700">
              {message || "You have been successfully removed from our newsletter."}
            </p>
            <p className="text-sm text-gray-500">
              We're sorry to see you go, but we respect your decision. You will no longer receive emails from Ascended Social.
            </p>
            <p className="text-sm text-gray-500">
              If you change your mind, you can always subscribe again from our website.
            </p>
            <Button 
              onClick={goHome}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              data-testid="button-go-home"
            >
              Return to Ascended Social
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error or not-found states
  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic via-cosmic-light to-cosmic flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200 bg-white/95 backdrop-blur-sm" data-testid="card-unsubscribe-error">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">
            {status === 'not-found' ? 'Invalid Link' : 'Unsubscribe Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-700">
            {message || "We encountered an error processing your unsubscribe request."}
          </p>
          {status === 'not-found' ? (
            <p className="text-sm text-gray-500">
              The unsubscribe link appears to be invalid or expired. Please try clicking the unsubscribe link in your latest email, or contact us for assistance.
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Please try again later or contact our support team if the problem persists.
            </p>
          )}
          <div className="space-y-2">
            <Button 
              onClick={goHome}
              variant="outline"
              className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
              data-testid="button-go-home-error"
            >
              Return to Ascended Social
            </Button>
            {status !== 'not-found' && (
              <Button 
                onClick={() => window.location.reload()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                data-testid="button-retry"
              >
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}