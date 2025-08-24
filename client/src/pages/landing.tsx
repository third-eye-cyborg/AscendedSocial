import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/ascended-social-high-resolution-logo-transparent (2)_1755890554213.png";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cosmic/80 backdrop-blur-2xl border-b border-primary/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md animate-pulse"></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <img src={logoImage} alt="Ascended Social Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  <span className="hidden sm:inline">Ascended Social</span>
                  <span className="sm:hidden">Ascended</span>
                </h1>
                <p className="text-xs text-muted font-medium tracking-wide hidden sm:block">TRANSCEND • CONNECT • EVOLVE</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/about'}
                className="text-subtle hover:text-primary hover:bg-primary/10 transition-all duration-300"
                data-testid="button-about"
              >
                About
              </Button>
              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/features'}
                className="text-subtle hover:text-primary hover:bg-primary/10 transition-all duration-300"
                data-testid="button-features"
              >
                Features
              </Button>
              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/pricing'}
                className="text-subtle hover:text-primary hover:bg-primary/10 transition-all duration-300"
                data-testid="button-pricing"
              >
                Pricing
              </Button>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="relative group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/25 hover:shadow-xl"
                data-testid="button-login"
              >
                <span className="relative z-10">Enter the Realm</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              </Button>
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden flex items-center space-x-2">
              <Button 
                size="sm"
                onClick={() => window.location.href = '/api/login'}
                className="relative group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold px-3 py-2 rounded-xl transition-all duration-300 shadow-lg"
                data-testid="button-login-mobile"
              >
                <span className="relative z-10">Login</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-primary p-2"
                data-testid="button-mobile-menu"
              >
                <div className="space-y-1">
                  <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                  <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                  <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-cosmic/95 backdrop-blur-xl border-b border-primary/30 md:hidden">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-3">
              <Button
                variant="ghost"
                onClick={() => {
                  window.location.href = '/about';
                  setIsMobileMenuOpen(false);
                }}
                className="text-left justify-start text-white hover:text-primary hover:bg-primary/10 transition-all duration-300"
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
                className="text-left justify-start text-white hover:text-primary hover:bg-primary/10 transition-all duration-300"
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
                className="text-left justify-start text-white hover:text-primary hover:bg-primary/10 transition-all duration-300"
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
                className="text-left justify-start text-white hover:text-primary hover:bg-primary/10 transition-all duration-300"
                data-testid="mobile-nav-community"
              >
                Community
              </Button>
            </nav>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="relative pt-20 sm:pt-24">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center relative z-10">
          {/* Premium Hero Content */}
          <div className="relative">
            {/* Floating Elements */}
            <div className="absolute -top-20 left-1/4 w-2 h-2 bg-primary rounded-full animate-float opacity-60"></div>
            <div className="absolute -top-10 right-1/3 w-1.5 h-1.5 bg-secondary rounded-full animate-float opacity-80" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-32 left-1/6 w-1 h-1 bg-chakra-heart rounded-full animate-float opacity-70" style={{animationDelay: '2s'}}></div>
            
            {/* Main Hero Text */}
            <div className="mb-8 animate-fade-in">
              <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6 backdrop-blur-sm">
                ✨ The Future of Spiritual Connection
              </div>
              <h2 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold mb-6 sm:mb-8 leading-tight sm:leading-none">
                <span className="bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent animate-gradient-x">
                  Ascend Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-secondary via-chakra-crown to-primary bg-clip-text text-transparent">
                  Social Reality
                </span>
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-subtle mb-8 sm:mb-12 leading-relaxed max-w-4xl mx-auto font-light px-4">
                Where ancient wisdom meets cutting-edge technology. Connect with enlightened souls,
                <br className="hidden lg:block" />
                share your spiritual journey, and unlock your highest potential in a sacred digital space.
              </p>
            </div>
            
            {/* Premium CTA Buttons */}
            <div className="flex justify-center items-center mb-12 sm:mb-16 animate-slide-up px-4">
              <Button 
                size="lg" 
                onClick={() => window.location.href = '/api/login'}
                className="group relative bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold px-8 sm:px-12 py-3 sm:py-4 rounded-2xl text-base sm:text-lg transition-all duration-500 shadow-2xl hover:shadow-primary/30 hover:scale-105 w-full max-w-sm sm:max-w-none sm:min-w-[280px]"
                data-testid="button-join"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span className="hidden sm:inline">Begin Your Ascension</span>
                  <span className="sm:hidden">Start Journey</span>
                  <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-col lg:flex-row justify-center items-center gap-8 text-sm text-muted animate-fade-in" style={{animationDelay: '0.5s'}}>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full border-2 border-cosmic flex items-center justify-center text-xs font-bold">A</div>
                  <div className="w-8 h-8 bg-gradient-to-br from-chakra-heart to-chakra-crown rounded-full border-2 border-cosmic flex items-center justify-center text-xs font-bold">S</div>
                  <div className="w-8 h-8 bg-gradient-to-br from-secondary to-chakra-throat rounded-full border-2 border-cosmic flex items-center justify-center text-xs font-bold">M</div>
                </div>
                <span className="font-medium">Join the Community</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star text-sm"></i>)}
                </div>
                <span className="font-medium">Premium Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-shield-alt text-primary"></i>
                <span className="font-medium">Sacred & Secure</span>
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
                    <p className="text-secondary leading-relaxed text-sm sm:text-base lg:text-lg">
                      Receive your unique mystical sigil that represents your spiritual essence and energy signature, crafted by advanced AI consciousness.
                    </p>
                    <div className="mt-4 sm:mt-6 inline-flex items-center text-chakra-heart text-xs sm:text-sm font-semibold">
                      Learn More <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
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
                    <p className="text-secondary leading-relaxed text-lg">
                      AI automatically categorizes your posts by the 7-chakra system, creating a vibrant energy map of your spiritual evolution.
                    </p>
                    <div className="mt-6 inline-flex items-center text-chakra-crown text-sm font-semibold">
                      Explore System <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
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
                    <p className="text-secondary leading-relaxed text-lg">
                      Engage with content using our revolutionary three-tier system: votes, likes, and pure spiritual energy transmission.
                    </p>
                    <div className="mt-6 inline-flex items-center text-primary text-sm font-semibold">
                      Experience Energy <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
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
                  <i className="fas fa-crystal-ball text-white"></i>
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
                  <i className="fas fa-cards-blank text-white"></i>
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
                  <i className="fas fa-video text-cosmic"></i>
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
              onClick={() => window.location.href = '/api/login'}
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
    </div>
  );
}
