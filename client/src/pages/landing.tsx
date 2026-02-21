import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MarketingFooter from "@/components/MarketingFooter";
import logoImage from "@assets/ascended-social-high-resolution-logo-transparent (2)_1755890554213.png";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { initiateAuth } from "@/utils/auth";

// Debug: Test if the auth function is imported correctly
console.log('🔍 [IMPORT-DEBUG] Landing page loaded, initiateAuth function:', typeof initiateAuth);

// Add a global function for testing
if (typeof window !== 'undefined') {
  (window as any).testAuthRedirect = () => {
    console.log('🧪 [GLOBAL-TEST] Manual auth test triggered');
    console.log('🧪 [GLOBAL-TEST] Current URL:', window.location.href);
    console.log('🧪 [GLOBAL-TEST] About to redirect to /api/login');
    window.location.href = '/api/login';
  };
  console.log('🔍 [GLOBAL-TEST] testAuthRedirect function added to window');
}
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  
  // Handle authentication errors from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const description = urlParams.get('description');
    
    if (error) {
      let errorMessage = 'Authentication failed. Please try again.';
      
      switch (error) {
        case 'auth_failed':
          errorMessage = 'Authentication was not completed. Please try signing in again.';
          break;
        case 'user_creation_failed':
          errorMessage = 'Unable to create your account. Please contact support.';
          break;
        case 'access_denied':
          errorMessage = 'Access was denied. You may have declined the authorization.';
          break;
        case 'invalid_request':
          errorMessage = 'Invalid authentication request. Please try again.';
          break;
        case 'unauthorized_client':
          errorMessage = 'Authentication service error. Please contact support.';
          break;
        default:
          if (description) {
            errorMessage = decodeURIComponent(description);
          }
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [toast]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic via-cosmic-light to-cosmic text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-chakra-crown/10 rounded-full blur-2xl animate-float"></div>
      </div>
      
      {/* Starfield Effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse opacity-40" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-2/3 left-1/6 w-1 h-1 bg-white rounded-full animate-pulse opacity-80" style={{animationDelay: '1.2s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse opacity-50" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/6 right-1/6 w-1 h-1 bg-white rounded-full animate-pulse opacity-70" style={{animationDelay: '0.8s'}}></div>
      </div>

      {/* Premium Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-3xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-secondary flex items-center justify-center shadow-2xl border border-white/10">
                  <img src={logoImage} alt="Ascended Social Logo" className="w-6 h-6 lg:w-8 lg:h-8" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent">
                  Ascended Social
                </h1>
                <p className="text-xs text-white/60 font-medium tracking-[0.1em] uppercase">Transcend • Connect • Evolve</p>
              </div>
            </div>
            
            {/* Premium Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <nav className="flex items-center space-x-1 bg-white/5 rounded-2xl p-1 border border-white/10 backdrop-blur-xl ml-[20px] mr-[20px]">
                <Button 
                  variant="ghost"
                  onClick={() => window.location.href = '/about'}
                  className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl px-4 py-2.5 text-sm font-medium"
                  data-testid="button-about"
                >
                  About
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => window.location.href = '/features'}
                  className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl px-4 py-2.5 text-sm font-medium"
                  data-testid="button-features"
                >
                  Features
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => window.location.href = '/pricing'}
                  className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl px-4 py-2.5 text-sm font-medium"
                  data-testid="button-pricing"
                >
                  Pricing
                </Button>
              </nav>
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  console.log('🖱️ [CLICK-DEBUG] Desktop login button clicked', e);
                  console.log('🖱️ [CLICK-DEBUG] Event details:', { 
                    type: e.type, 
                    target: e.target, 
                    currentTarget: e.currentTarget,
                    bubbles: e.bubbles,
                    defaultPrevented: e.defaultPrevented
                  });
                  console.log('🖱️ [CLICK-DEBUG] Function type:', typeof initiateAuth);
                  console.log('🖱️ [CLICK-DEBUG] About to call initiateAuth()...');
                  
                  // Try both the imported function and a direct redirect
                  try {
                    initiateAuth();
                  } catch (error) {
                    console.error('🖱️ [CLICK-DEBUG] Error calling initiateAuth:', error);
                    console.log('🖱️ [CLICK-DEBUG] Falling back to direct redirect');
                    window.location.href = '/api/login';
                  }
                  console.log('🖱️ [CLICK-DEBUG] initiateAuth() call completed');
                  
                  // Also try a delayed redirect as fallback
                  setTimeout(() => {
                    console.log('🖱️ [CLICK-DEBUG] Timeout fallback - attempting direct redirect');
                    if (window.location.pathname === '/') {
                      window.location.href = '/api/login';
                    }
                  }, 1000);
                }}
                className="relative group bg-gradient-to-r from-primary via-purple-500 to-secondary hover:shadow-2xl hover:shadow-primary/25 text-white font-medium px-8 py-3 rounded-2xl transition-all duration-500 hover:scale-105 border border-white/20 ml-4"
                data-testid="button-login"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Enter the Realm
                  <i className="fas fa-arrow-right text-sm group-hover:translate-x-0.5 transition-transform duration-300"></i>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center space-x-3">
              <Button 
                onClick={() => {
                  console.log('🖱️ [CLICK-DEBUG] Mobile login button clicked');
                  console.log('🖱️ [CLICK-DEBUG] Calling initiateAuth()...');
                  initiateAuth();
                }}
                className="relative group bg-gradient-to-r from-primary to-secondary text-white font-medium px-6 py-2.5 rounded-xl transition-all duration-300 shadow-xl border border-white/20"
                data-testid="button-login-mobile"
              >
                <span className="relative z-10 text-sm">Enter</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2.5 rounded-xl transition-all duration-300"
                data-testid="button-mobile-menu"
              >
                <div className="space-y-1.5">
                  <div className={`w-5 h-0.5 bg-current transition-all duration-500 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                  <div className={`w-5 h-0.5 bg-current transition-all duration-500 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                  <div className={`w-5 h-0.5 bg-current transition-all duration-500 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Premium Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-20 left-0 right-0 z-40 bg-black/20 backdrop-blur-3xl border-b border-white/10 lg:hidden">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <nav className="flex flex-col space-y-1">
              <Button
                variant="ghost"
                onClick={() => {
                  window.location.href = '/about';
                  setIsMobileMenuOpen(false);
                }}
                className="text-left justify-start text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl py-3 px-4 text-base font-medium"
                data-testid="mobile-nav-about"
              >
                About
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  window.location.href = '/features';
                  setIsMobileMenuOpen(false);
                }}
                className="text-left justify-start text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl py-3 px-4 text-base font-medium"
                data-testid="mobile-nav-features"
              >
                Features
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  window.location.href = '/pricing';
                  setIsMobileMenuOpen(false);
                }}
                className="text-left justify-start text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl py-3 px-4 text-base font-medium"
                data-testid="mobile-nav-pricing"
              >
                Pricing
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  window.location.href = '/community';
                  setIsMobileMenuOpen(false);
                }}
                className="text-left justify-start text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl py-3 px-4 text-base font-medium"
                data-testid="mobile-nav-community"
              >
                Community
              </Button>
            </nav>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="relative pt-28 lg:pt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 text-center relative z-10">
          {/* Premium Hero Content */}
          <div className="relative">
            {/* Floating Orbs */}
            <div className="absolute -top-12 left-1/4 w-3 h-3 bg-gradient-to-r from-primary to-purple-400 rounded-full animate-float opacity-40 blur-sm"></div>
            <div className="absolute -top-6 right-1/3 w-2 h-2 bg-gradient-to-r from-secondary to-pink-400 rounded-full animate-float opacity-60 blur-sm" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-40 left-1/6 w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-float opacity-50 blur-sm" style={{animationDelay: '2s'}}></div>
            
            {/* Main Hero Text */}
            <div className="mb-12 lg:mb-16 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/90 text-sm font-medium backdrop-blur-xl">
                <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                The Future of Spiritual Connection
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-[0.9] tracking-tight">
                <span className="block bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                  Ascend Your
                </span>
                <span className="block bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent animate-gradient-x">
                  Social Reality
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-white/70 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
                Where ancient wisdom meets cutting-edge technology.
                <span className="hidden lg:inline"><br /></span>
                <span className="lg:hidden"> </span>
                Connect with enlightened souls and unlock your highest potential.
              </p>
            </div>
            
            {/* Premium CTA */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16 lg:mb-20">
              <Button 
                onClick={() => {
                  console.log('🖱️ [CLICK-DEBUG] Main CTA "Begin Your Ascension" button clicked');
                  console.log('🖱️ [CLICK-DEBUG] Calling initiateAuth()...');
                  initiateAuth();
                }}
                className="group relative bg-gradient-to-r from-primary via-purple-500 to-secondary hover:shadow-2xl hover:shadow-primary/25 text-white font-semibold px-10 py-4 rounded-2xl text-lg transition-all duration-500 hover:scale-105 border border-white/20 min-w-[280px]"
                data-testid="button-join"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Begin Your Ascension
                  <i className="fas fa-sparkles group-hover:rotate-12 transition-transform duration-300"></i>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Button>
              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/features'}
                className="group text-white/80 hover:text-white border border-white/20 hover:border-white/40 font-medium px-8 py-4 rounded-2xl text-lg transition-all duration-300 hover:bg-white/5 backdrop-blur-xl min-w-[200px]"
                data-testid="button-learn-more"
              >
                <span className="flex items-center justify-center gap-2">
                  Learn More
                  <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform duration-300"></i>
                </span>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 lg:gap-12 text-white/60">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-500 rounded-full border-2 border-white/20 flex items-center justify-center text-sm font-bold backdrop-blur-xl">A</div>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-secondary rounded-full border-2 border-white/20 flex items-center justify-center text-sm font-bold backdrop-blur-xl">S</div>
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary to-pink-500 rounded-full border-2 border-white/20 flex items-center justify-center text-sm font-bold backdrop-blur-xl">+</div>
                </div>
                <div className="text-left">
                  <div className="text-white font-medium text-sm">Growing Community</div>
                  <div className="text-white/50 text-xs">Spiritual seekers worldwide</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex text-amber-400 text-lg">
                  {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                </div>
                <div className="text-left">
                  <div className="text-white font-medium text-sm">Premium Experience</div>
                  <div className="text-white/50 text-xs">Crafted with care</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-xl">
                  <i className="fas fa-shield-alt text-primary text-lg"></i>
                </div>
                <div className="text-left">
                  <div className="text-white font-medium text-sm">Sacred & Secure</div>
                  <div className="text-white/50 text-xs">Privacy protected</div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Features Grid */}
          <div className="mt-32 mb-32">
            <div className="text-center mb-16 animate-fade-in">
              <h3 className="text-5xl font-display font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Mystical Features
                </span>
              </h3>
              <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
                Harness the power of AI-enhanced spirituality to elevate your consciousness and connect with your tribe.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-7xl mx-auto animate-slide-up">
              {/* Feature 1 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-chakra-heart/20 to-transparent rounded-3xl blur-xl transition-all duration-500 group-hover:blur-2xl group-hover:from-chakra-heart/30"></div>
                <Card className="relative bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-heart/40 backdrop-blur-xl rounded-3xl overflow-hidden hover-lift shadow-2xl group-hover:shadow-chakra-heart/30 glass-effect">
                  <CardContent className="p-6 sm:p-8 lg:p-10 text-center relative">
                    <div className="relative mb-6 sm:mb-8">
                      <div className="absolute inset-0 bg-chakra-heart/20 rounded-2xl blur-md animate-pulse"></div>
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-chakra-heart to-chakra-heart/80 rounded-2xl flex items-center justify-center shadow-xl">
                        <i className="fas fa-magic text-white text-xl sm:text-2xl"></i>
                      </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold mb-3 sm:mb-4 text-chakra-heart">AI-Generated Sigils</h3>
                    <p className="text-muted leading-relaxed text-sm sm:text-base lg:text-lg">
                      Receive your unique mystical sigil that represents your spiritual essence and energy signature, crafted by advanced AI consciousness.
                    </p>
                    <div className="mt-4 sm:mt-6 inline-flex items-center text-xs sm:text-sm font-semibold">
                      <span className="text-chakra-heart">Learn More</span> <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300 text-chakra-heart"></i>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature 2 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-chakra-crown/20 to-transparent rounded-3xl blur-xl transition-all duration-500 group-hover:blur-2xl group-hover:from-chakra-crown/30"></div>
                <Card className="relative bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-crown/40 backdrop-blur-xl rounded-3xl overflow-hidden hover-lift shadow-2xl group-hover:shadow-chakra-crown/30 glass-effect">
                  <CardContent className="p-10 text-center relative">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-chakra-crown/20 rounded-2xl blur-md animate-pulse"></div>
                      <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-chakra-crown to-chakra-crown/80 rounded-2xl flex items-center justify-center shadow-xl">
                        <i className="fas fa-eye text-white text-2xl"></i>
                      </div>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 text-chakra-crown">Chakra Intelligence</h3>
                    <p className="text-muted leading-relaxed text-lg">
                      AI automatically categorizes your posts by the 7-chakra system, creating a vibrant energy map of your spiritual evolution.
                    </p>
                    <div className="mt-6 inline-flex items-center text-chakra-crown text-sm font-semibold">
                      Explore System <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300 text-chakra-crown"></i>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature 3 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-xl transition-all duration-500 group-hover:blur-2xl group-hover:from-primary/30"></div>
                <Card className="relative bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-primary/40 backdrop-blur-xl rounded-3xl overflow-hidden hover-lift shadow-2xl group-hover:shadow-primary/30 glass-effect">
                  <CardContent className="p-10 text-center relative">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-md animate-pulse"></div>
                      <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl">
                        <i className="fas fa-bolt text-white text-2xl"></i>
                      </div>
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 text-primary">Sacred Energy System</h3>
                    <p className="text-muted leading-relaxed text-lg">
                      Engage with content using our revolutionary three-tier system: votes, likes, and pure spiritual energy transmission.
                    </p>
                    <div className="mt-6 inline-flex items-center text-sm font-semibold">
                      <span className="text-primary">Experience Energy</span> <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300 text-primary"></i>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Spiritual Features */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 rounded-2xl p-8 border border-primary/40 glass-effect shadow-xl">
            <h3 className="text-3xl font-display font-bold mb-6 text-center">
              <span className="text-accent-light">
                Mystical Features
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-eye text-white"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">Daily Oracle Readings</h4>
                  <p className="text-subtle text-sm">
                    Receive personalized spiritual guidance and wisdom each day through AI-powered readings.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-moon text-white"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary mb-1">AI Tarot Readings</h4>
                  <p className="text-subtle text-sm">
                    Premium users can access deep tarot insights generated by advanced AI consciousness.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-video text-white"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-accent-light mb-1">Sparks & Visions</h4>
                  <p className="text-subtle text-sm">
                    Share short spiritual moments (Sparks) and longer wisdom videos (Visions).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-chakra-heart rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-heartbeat text-white"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-chakra-heart mb-1">Aura Tracking</h4>
                  <p className="text-subtle text-sm">
                    Monitor your spiritual growth through an intelligent aura system that evolves with you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Premium Call to Action */}
      <section className="relative py-24 overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic via-cosmic-light/50 to-cosmic"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-secondary/5"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-1/4 w-3 h-3 bg-primary/40 rounded-full animate-bounce-slow opacity-60"></div>
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-secondary/50 rounded-full animate-float opacity-80"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-chakra-heart/60 rounded-full animate-pulse"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="inline-block px-6 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in">
              ✨ Join the Ascended Community
            </div>
            
            <h3 className="text-6xl font-display font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent">
                Ready to Transform
              </span>
              <br />
              <span className="bg-gradient-to-r from-secondary via-chakra-crown to-primary bg-clip-text text-transparent">
                Your Reality?
              </span>
            </h3>
            
            <p className="text-2xl text-subtle mb-12 leading-relaxed max-w-4xl mx-auto">
              Join thousands of awakened souls on their journey of spiritual ascension. 
              <br className="hidden lg:block" />
              Your transformation begins with a single conscious choice.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-slide-up px-4">
            <Button 
              size="lg"
              onClick={() => initiateAuth()}
              className="group relative bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold px-8 sm:px-12 lg:px-16 py-4 sm:py-6 rounded-2xl text-lg sm:text-xl transition-all duration-500 shadow-2xl hover:shadow-primary/40 hover:scale-105 w-full sm:w-auto sm:min-w-[280px] lg:min-w-[320px]"
              data-testid="button-cta"
            >
              <span className="relative z-10 flex items-center justify-center gap-3 sm:gap-4">
                <span className="hidden sm:inline">Begin Your Ascension</span>
                <span className="sm:hidden">Start Journey</span>
                <i className="fas fa-rocket group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform duration-500"></i>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="group border-2 border-white/50 text-white bg-cosmic/70 hover:border-primary hover:text-white hover:bg-primary transition-all duration-300 backdrop-blur-sm px-8 sm:px-12 lg:px-16 py-4 sm:py-6 rounded-2xl text-lg sm:text-xl font-semibold w-full sm:w-auto sm:min-w-[280px] lg:min-w-[320px]"
              data-testid="button-contact"
            >
              <span className="flex items-center justify-center gap-3 sm:gap-4">
                <i className="fas fa-comments"></i>
                <span className="hidden sm:inline">Connect with Us</span>
                <span className="sm:hidden">Contact</span>
              </span>
            </Button>
          </div>
          
          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-muted text-sm animate-fade-in" style={{animationDelay: '0.8s'}}>
            <div className="flex items-center gap-2">
              <i className="fas fa-lock text-primary"></i>
              <span>256-bit Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-users text-primary"></i>
              <span>Growing Community</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-star text-yellow-400"></i>
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-globe text-secondary"></i>
              <span>Global Community</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-br from-cosmic-dark/50 to-cosmic/30">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-secondary/15 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6 animate-fade-in">
            Stay Connected to Your{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Spiritual Journey
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted mb-12 animate-fade-in max-w-2xl mx-auto" style={{animationDelay: '0.2s'}}>
            Join thousands of spiritual seekers who receive weekly wisdom, oracle insights, and community updates directly in their inbox.
          </p>
          
          <div className="flex justify-center animate-fade-in" style={{animationDelay: '0.4s'}}>
            <NewsletterSignup />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <MarketingFooter />
    </div>
  );
}
