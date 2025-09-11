import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, AlertTriangle } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { admin, isLoading, isAuthenticated } = useAdminAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Parse URL parameters for auth errors
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    
    if (errorParam) {
      switch (errorParam) {
        case 'auth_failed':
          setError('Authentication failed. Please try again.');
          break;
        case 'unauthorized':
          setError('You are not authorized for admin access.');
          break;
        case 'login_failed':
          setError('Login failed. Please contact support.');
          break;
        default:
          setError('An authentication error occurred.');
      }
    }
  }, []);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && admin) {
      setLocation("/admin/dashboard");
    }
  }, [isAuthenticated, admin, setLocation]);

  const handleLogin = () => {
    // Clear any previous errors
    setError(null);
    // Redirect to admin login endpoint
    window.location.href = "/api/admin/login";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-purple-200 font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-purple-200">Ascended Social Administration</p>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">
              Admin Sign In
            </CardTitle>
            <CardDescription className="text-center text-purple-200">
              Authorized administrators only
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-900/50 border-red-500/50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="text-center space-y-2 py-4">
                <Lock className="w-12 h-12 text-purple-400 mx-auto" />
                <p className="text-sm text-purple-200">
                  Access is restricted to authorized administrators. You'll be redirected to Replit for secure authentication.
                </p>
              </div>

              <Button 
                onClick={handleLogin}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
                data-testid="button-admin-login"
              >
                {isLoading ? "Authenticating..." : "Sign In with Replit"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <Link href="/" className="text-purple-300 hover:text-purple-200 text-sm">
            ← Back to Ascended Social
          </Link>
          <p className="text-xs text-purple-400">
            Admin access is logged and monitored
          </p>
        </div>
      </div>
    </div>
  );
}