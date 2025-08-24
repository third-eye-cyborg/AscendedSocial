import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Subscribe from "@/pages/subscribe";
import About from "@/pages/about";
import Features from "@/pages/features";
import Pricing from "@/pages/pricing";
import Profile from "@/pages/profile";
import ProfileSettings from "@/pages/profileSettings";
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
import Unsubscribe from "@/pages/unsubscribe";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/about" component={About} />
          <Route path="/features" component={Features} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/community" component={Community} />
          <Route path="/subscribe" component={Subscribe} />
          <Route path="/unsubscribe" component={Unsubscribe} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/profile/:userId" component={Profile} />
          <Route path="/settings" component={Settings} />
          <Route path="/visions" component={Visions} />
          <Route path="/sparks" component={Sparks} />
          <Route path="/community" component={Community} />
          <Route path="/oracle" component={Oracle} />
          <Route path="/spirit" component={SpiritPage} />
          <Route path="/energy" component={EnergyPage} />
          <Route path="/starmap" component={StarmapPage} />
          <Route path="/explore" component={ExplorePage} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/about" component={About} />
          <Route path="/features" component={Features} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/subscribe" component={Subscribe} />
          <Route path="/unsubscribe" component={Unsubscribe} />
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
