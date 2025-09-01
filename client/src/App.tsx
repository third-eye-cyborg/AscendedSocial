import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ClientAnalytics } from "@/lib/analytics";
import { NotificationService } from "@/lib/notifications";
import { consentManager } from "@/lib/consent";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Subscribe from "@/pages/subscribe";
import About from "@/pages/about";
import Features from "@/pages/features";
import Pricing from "@/pages/pricing";
import Profile from "@/pages/profile";
import ProfileSettings from "@/pages/profileSettings";
import Post from "@/pages/post";
import Settings from "@/pages/settings";
import Visions from "@/pages/visions";
import Sparks from "@/pages/sparks";
import Community from "@/pages/community";
import Oracle from "@/pages/oracle";
import Onboarding from "@/pages/onboarding";
import SpiritPage from "@/pages/spirit";
import EnergyPage from "@/pages/energy";
import StarmapPage from "@/pages/starmap";
import ExplorePage from "@/pages/explore";
import ZeroTrustPage from "@/pages/zero-trust";
import Unsubscribe from "@/pages/unsubscribe";
import CookiePolicy from "@/pages/cookie-policy";
import DoNotSell from "@/pages/do-not-sell";
import DataRequest from "@/pages/data-request";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import EULA from "./pages/eula";
import Disclaimer from './pages/disclaimer';
import SubscriptionServicesAgreement from './pages/subscription-services-agreement';
import PaymentTerms from './pages/payment-terms';
import CopyrightAssignment from './pages/copyright-assignment';
import CommunityProtection from './pages/community-protection';
import CopyrightPolicy from './pages/copyright-policy';
import ServiceAgreement from './pages/service-agreement';
import ThirdPartyDisclaimer from './pages/third-party-disclaimer';
import { AuthenticatedMarker } from './components/AuthenticatedMarker';

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Initialize analytics, notifications, and privacy banner when user loads
  useEffect(() => {
    // Initialize Enzuzo cookie banner integration
    consentManager.initializeEnzuzo();

    // Initialize push notifications
    NotificationService.initialize().catch(console.error);

    if (user && typeof user === 'object' && 'id' in user) {
      const userId = String(user.id);
      const userData = user as any;

      ClientAnalytics.identify(userId, {
        email: userData.email || '',
        username: userData.username || userData.displayName || '',
        signup_date: userData.createdAt || new Date().toISOString(),
        is_premium: userData.isPremium || false,
      });

      // Set up spiritual profile for notifications
      NotificationService.setSpiritualProfile(userId, {
        username: userData.username || userData.displayName,
        isPremium: userData.isPremium || false,
        journeyStage: 'active'
      });
    }
  }, [user]);

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/about" component={About} />
          <Route path="/features" component={Features} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/energy" component={EnergyPage} />
          <Route path="/community" component={Community} />
          <Route path="/subscribe" component={Subscribe} />
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
        </>
      ) : (
        <>
          <AuthenticatedMarker />
          <Route path="/" component={Home} />
          <Route path="/profile/:userId" component={Profile} />
          <Route path="/post/:postId" component={Post} />
          <Route path="/settings" component={Settings} />
          <Route path="/visions" component={Visions} />
          <Route path="/sparks" component={Sparks} />
          <Route path="/community" component={Community} />
          <Route path="/oracle" component={Oracle} />
          <Route path="/spirit" component={SpiritPage} />
          <Route path="/energy" component={EnergyPage} />
          <Route path="/starmap" component={StarmapPage} />
          <Route path="/explore" component={ExplorePage} />
          <Route path="/zero-trust" component={ZeroTrustPage} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/about" component={About} />
          <Route path="/features" component={Features} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/subscribe" component={Subscribe} />
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
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;