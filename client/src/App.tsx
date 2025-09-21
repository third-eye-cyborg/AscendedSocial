import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ClientAnalytics } from "@/lib/analytics";
import { NotificationService } from "@/lib/notifications";
import { consentManager } from "@/lib/consent";
import { useEffect, useMemo, Suspense, lazy } from "react";
import React from 'react';
import { AuthenticatedMarker } from './components/AuthenticatedMarker';

// Critical pages - loaded immediately
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import AuthCallback from "@/pages/auth-callback";
import NotFound from "@/pages/not-found";

// Non-critical pages - lazy loaded
const Subscribe = lazy(() => import("@/pages/subscribe"));
const About = lazy(() => import("@/pages/about"));
const Features = lazy(() => import("@/pages/features"));
const Pricing = lazy(() => import("@/pages/pricing"));
const Profile = lazy(() => import("@/pages/profile"));
const ProfileSettings = lazy(() => import("@/pages/profileSettings"));
const Post = lazy(() => import("@/pages/post"));
const Settings = lazy(() => import("@/pages/settings"));
const Visions = lazy(() => import("@/pages/visions"));
const Sparks = lazy(() => import("@/pages/sparks"));
const Community = lazy(() => import("@/pages/community"));
const Oracle = lazy(() => import("@/pages/oracle"));
const Onboarding = lazy(() => import("@/pages/onboarding"));
const SpiritPage = lazy(() => import("@/pages/spirit"));
const EnergyPage = lazy(() => import("@/pages/energy"));

// Heavy 3D components - lazy loaded with preload
const StarmapPage = lazy(() => import("@/pages/starmap"));
const ExplorePage = lazy(() => import("@/pages/explore"));

// Admin and compliance pages
const AdminDashboard = lazy(() => import("@/pages/admin"));
const AdminLogin = lazy(() => import("@/pages/admin/login"));
const AdminDashboardNew = lazy(() => import("@/pages/admin/dashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/users"));
const AdminModeration = lazy(() => import("@/pages/admin/moderation"));
const AdminTickets = lazy(() => import("@/pages/admin/tickets"));
const AdminSystem = lazy(() => import("@/pages/admin/system"));
const ZeroTrustPage = lazy(() => import("@/pages/zero-trust"));
const Compliance = lazy(() => import("@/pages/compliance"));

// Legal pages
const Unsubscribe = lazy(() => import("@/pages/unsubscribe"));
const CookiePolicy = lazy(() => import("@/pages/cookie-policy"));
const DoNotSell = lazy(() => import("@/pages/do-not-sell"));
const DataRequest = lazy(() => import("@/pages/data-request"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const TermsOfService = lazy(() => import("@/pages/terms-of-service"));
const EULA = lazy(() => import("./pages/eula"));
const Disclaimer = lazy(() => import('./pages/disclaimer'));
const SubscriptionServicesAgreement = lazy(() => import('./pages/subscription-services-agreement'));
const PaymentTerms = lazy(() => import('./pages/payment-terms'));
const CopyrightAssignment = lazy(() => import('./pages/copyright-assignment'));
const CommunityProtection = lazy(() => import('./pages/community-protection'));
const CopyrightPolicy = lazy(() => import('./pages/copyright-policy'));
const ServiceAgreement = lazy(() => import('./pages/service-agreement'));
const ThirdPartyDisclaimer = lazy(() => import('./pages/third-party-disclaimer'));
const VideoPage = lazy(() => import('./pages/video'));
const MobileLogin = lazy(() => import('./pages/mobile-login'));

// Loading fallback component
const LoadingSpinner = React.memo(({ text = "Connecting to the cosmic realm..." }: { text?: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-purple-200 font-medium">{text}</p>
    </div>
  </div>
));
LoadingSpinner.displayName = 'LoadingSpinner';

const Router = React.memo(() => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Memoize user analytics data to prevent re-computation
  const analyticsData = useMemo(() => {
    if (!user || typeof user !== 'object' || !('id' in user)) return null;
    
    const userData = user as any;
    return {
      userId: String(user.id),
      data: {
        email: userData.email || '',
        username: userData.username || userData.displayName || '',
        signup_date: userData.createdAt || new Date().toISOString(),
        is_premium: userData.isPremium || false,
      },
      profile: {
        username: userData.username || userData.displayName,
        isPremium: userData.isPremium || false,
        journeyStage: 'active' as const
      }
    };
  }, [user]);

  // Initialize analytics, notifications, and privacy banner when user loads
  useEffect(() => {
    // Initialize Klaro cookie banner integration
    consentManager.initializeKlaro();

    // Initialize push notifications
    NotificationService.initialize().catch(console.error);
  }, []);

  // Handle user analytics separately to avoid re-running on every render
  useEffect(() => {
    if (analyticsData) {
      ClientAnalytics.identify(analyticsData.userId, analyticsData.data);
      NotificationService.setSpiritualProfile(analyticsData.userId, analyticsData.profile);
    }
  }, [analyticsData]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Switch>
        <Route path="/">{isAuthenticated ? <Home /> : <Landing />}</Route>
        <Route path="/home">{isAuthenticated ? <Home /> : <Landing />}</Route>
        <Route path="/auth/callback" component={AuthCallback} />
        <Route path="/auth/mobile-callback" component={AuthCallback} />
        <Route path="/auth" component={AuthCallback} />
        <Route path="/mobile-login" component={MobileLogin} />
        <Route path="/subscribe" component={Subscribe} />
        <Route path="/about" component={About} />
        <Route path="/features" component={Features} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/profile/:id?" component={Profile} />
        <Route path="/profile-settings" component={ProfileSettings} />
        <Route path="/post/:id" component={Post} />
        <Route path="/video/:type/:id" component={VideoPage} />
        <Route path="/settings" component={Settings} />
        <Route path="/visions" component={Visions} />
        <Route path="/sparks" component={Sparks} />
        <Route path="/community" component={Community} />
        <Route path="/oracle" component={Oracle} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/spirit" component={SpiritPage} />
        <Route path="/energy" component={EnergyPage} />
        <Route path="/starmap">
          <Suspense fallback={<LoadingSpinner text="Initializing 3D starmap..." />}>
            <StarmapPage />
          </Suspense>
        </Route>
        <Route path="/explore">
          <Suspense fallback={<LoadingSpinner text="Loading exploration interface..." />}>
            <ExplorePage />
          </Suspense>
        </Route>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboardNew} />
        <Route path="/admin/users" component={AdminUsers} />
        <Route path="/admin/moderation" component={AdminModeration} />
        <Route path="/admin/tickets" component={AdminTickets} />
        <Route path="/admin/system" component={AdminSystem} />
        <Route path="/admin/analytics" component={AdminDashboardNew} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/zero-trust" component={ZeroTrustPage} />
        <Route path="/compliance" component={Compliance} />
        <Route path="/unsubscribe" component={Unsubscribe} />
        <Route path="/cookie-policy" component={CookiePolicy} />
        <Route path="/do-not-sell" component={DoNotSell} />
        <Route path="/data-request" component={DataRequest} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/eula" component={EULA} />
        <Route path="/disclaimer" component={Disclaimer} />
        <Route path="/subscription-services-agreement" component={SubscriptionServicesAgreement} />
        <Route path="/payment-terms" component={PaymentTerms} />
        <Route path="/copyright-assignment" component={CopyrightAssignment} />
        <Route path="/community-protection" component={CommunityProtection} />
        <Route path="/copyright-policy" component={CopyrightPolicy} />
        <Route path="/service-agreement" component={ServiceAgreement} />
        <Route path="/third-party-disclaimer" component={ThirdPartyDisclaimer} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
});
Router.displayName = 'Router';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <AuthenticatedMarker />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;