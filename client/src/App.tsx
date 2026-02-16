import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { consentManager } from "@/lib/consent";
import React, { useEffect, useMemo, Suspense, lazy, Component, ReactNode } from "react";
import { AuthenticatedMarker } from './components/AuthenticatedMarker';

console.log("🚀 App.tsx loading...");

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null; stack?: string }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, stack: "" };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: any) {
    console.error("❌ App crashed:", {
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
    this.setState({ stack: info.componentStack });
  }
  render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || "An unexpected error occurred";
      const isNetworkError = errorMsg.includes("401") || errorMsg.includes("404") || errorMsg.includes("5");
      
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0a1a", color: "#e2d5f0", fontFamily: "sans-serif", padding: 20, textAlign: "center" }}>
          <div style={{ maxWidth: 600 }}>
            <h1 style={{ fontSize: 24, marginBottom: 12 }}>⚠️ Something went wrong</h1>
            <div style={{ background: "#1a1527", border: "1px solid #7c3aed", borderRadius: 8, padding: 12, marginBottom: 16, textAlign: "left" }}>
              <p style={{ fontSize: 12, fontFamily: "monospace", margin: 0, marginBottom: 8, opacity: 0.8 }}>Error Message:</p>
              <p style={{ fontSize: 14, fontFamily: "monospace", margin: 0, marginBottom: 12, color: "#fbbf24", wordBreak: "break-all" }}>{errorMsg}</p>
              {this.state.stack && (
                <>
                  <p style={{ fontSize: 12, fontFamily: "monospace", margin: 0, marginBottom: 8, opacity: 0.8 }}>Component Stack:</p>
                  <pre style={{ fontSize: 11, fontFamily: "monospace", margin: 0, maxHeight: 200, overflow: "auto", opacity: 0.7, whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.4 }}>{this.state.stack}</pre>
                </>
              )}
            </div>
            {isNetworkError && (
              <p style={{ fontSize: 12, marginBottom: 16, opacity: 0.6 }}>💡 This appears to be a network error. Your connection to the server may be unstable.</p>
            )}
            <button onClick={() => window.location.reload()} style={{ padding: "10px 24px", background: "#7c3aed", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 16 }}>🔄 Refresh</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Critical pages - loaded immediately
const LoginScreen = lazy(() => import("@/pages/loginScreen"));
const Home = lazy(() => import("@/pages/home"));
const AuthCallback = lazy(() => import("@/pages/auth-callback"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Login = lazy(() => import("@/pages/login"));

// Non-critical pages - lazy loaded
const Subscribe = lazy(() => import("@/pages/subscribe"));
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
const DSARPage = lazy(() => import("@/pages/dsar"));
const DoNotSellForm = lazy(() => import("@/pages/do-not-sell-form"));
const PrivacyManagement = lazy(() => import("@/pages/privacy-management"));
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

function LoadingSpinner({ text = "Connecting to the cosmic realm..." }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-purple-200 font-medium">{text}</p>
      </div>
    </div>
  );
}

function Router() {
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

  useEffect(() => {
    try {
      consentManager.initializeTermsHub();
    } catch (e) {
      console.warn('TermsHub init failed:', e);
    }
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = consentManager.onConsentChange((consentState) => {
        if (consentState.hasConsented && analyticsData) {
          if (consentState.preferences.analytics) {
            import("@/lib/analytics").then(({ ClientAnalytics }) => {
              ClientAnalytics.identify(analyticsData.userId, analyticsData.data);
            }).catch(() => {});
          }
          if (consentState.preferences.marketing) {
            import("@/lib/notifications").then(({ NotificationService }) => {
              NotificationService.initialize().catch(() => {});
              NotificationService.setSpiritualProfile(analyticsData.userId, analyticsData.profile);
            }).catch(() => {});
          }
        }
      });

      const existingConsent = consentManager.getConsentState();
      if (existingConsent?.hasConsented && analyticsData) {
        if (existingConsent.preferences.analytics) {
          import("@/lib/analytics").then(({ ClientAnalytics }) => {
            ClientAnalytics.identify(analyticsData.userId, analyticsData.data);
          }).catch(() => {});
        }
        if (existingConsent.preferences.marketing) {
          import("@/lib/notifications").then(({ NotificationService }) => {
            NotificationService.initialize().catch(() => {});
            NotificationService.setSpiritualProfile(analyticsData.userId, analyticsData.profile);
          }).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Consent/analytics init failed:', e);
    }

    return () => { if (unsubscribe) unsubscribe(); };
  }, [analyticsData]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Switch>
        <Route path="/">{isAuthenticated ? <Home /> : <LoginScreen />}</Route>
        <Route path="/home">{isAuthenticated ? <Home /> : <LoginScreen />}</Route>
        <Route path="/login" component={Login} />
        <Route path="/auth/callback" component={AuthCallback} />
        <Route path="/auth-callback" component={AuthCallback} />
        <Route path="/auth/mobile-callback" component={AuthCallback} />
        <Route path="/auth" component={AuthCallback} />
        <Route path="/mobile-login" component={MobileLogin} />
        <Route path="/subscribe" component={Subscribe} />
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
        <Route path="/dashboard">
          <Redirect to="/admin/dashboard" />
        </Route>
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
        <Route path="/dsar" component={DSARPage} />
        <Route path="/do-not-sell-form" component={DoNotSellForm} />
        <Route path="/privacy-management" component={PrivacyManagement} />
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
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <TooltipProvider>
          <Router />
          <AuthenticatedMarker />
          <Toaster />
        </TooltipProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;