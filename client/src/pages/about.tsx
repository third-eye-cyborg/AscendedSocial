import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/ascended-social-high-resolution-logo-transparent (2)_1755890554213.png";

export default function About() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic via-cosmic-light to-cosmic text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-chakra-crown/10 rounded-full blur-2xl animate-float"></div>
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
                onClick={() => window.location.href = '/'}
                className="text-subtle hover:text-primary hover:bg-primary/10 transition-all duration-300"
                data-testid="button-home"
              >
                Home
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
                  window.location.href = '/';
                  setIsMobileMenuOpen(false);
                }}
                className="text-left justify-start text-white hover:text-primary hover:bg-primary/10 transition-all duration-300"
                data-testid="mobile-nav-home"
              >
                Home
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

      {/* Main Content */}
      <main className="relative pt-20 sm:pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                About Ascended Social
              </span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-subtle mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto px-4">
              Where ancient wisdom meets cutting-edge technology to create the future of spiritual connection.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-20 animate-slide-up">
            <Card className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-12">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl mb-6">
                    <i className="fas fa-heart text-white text-2xl"></i>
                  </div>
                  <h3 className="text-4xl font-display font-bold mb-6 text-primary">Our Mission</h3>
                </div>
                <p className="text-xl text-secondary leading-relaxed text-center max-w-4xl mx-auto">
                  We believe that true spiritual growth happens in community. Ascended Social is designed to be a sacred digital space where seekers, healers, and enlightened souls can connect, share wisdom, and support each other on their journey to higher consciousness.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values Grid */}
          <div className="mb-20">
            <h3 className="text-4xl font-display font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-chakra-heart to-chakra-crown bg-clip-text text-transparent">
                Our Core Values
              </span>
            </h3>
            
            <div className="grid lg:grid-cols-3 gap-8 animate-slide-up">
              {/* Value 1 */}
              <Card className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-heart/40 glass-effect shadow-xl rounded-3xl overflow-hidden hover-lift">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-chakra-heart to-chakra-heart/80 rounded-xl flex items-center justify-center shadow-lg mb-6">
                    <img src={logoImage} alt="Ascended Social Logo" className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-display font-bold mb-4 text-chakra-heart">Authentic Connection</h4>
                  <p className="text-secondary leading-relaxed">
                    We foster genuine relationships built on vulnerability, trust, and mutual respect for each person's unique spiritual journey.
                  </p>
                </CardContent>
              </Card>

              {/* Value 2 */}
              <Card className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-crown/40 glass-effect shadow-xl rounded-3xl overflow-hidden hover-lift">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-chakra-crown to-chakra-crown/80 rounded-xl flex items-center justify-center shadow-lg mb-6">
                    <i className="fas fa-eye text-white text-xl"></i>
                  </div>
                  <h4 className="text-2xl font-display font-bold mb-4 text-chakra-crown">Sacred Technology</h4>
                  <p className="text-secondary leading-relaxed">
                    We harness the power of AI and technology not to replace human intuition, but to enhance and amplify our natural spiritual gifts.
                  </p>
                </CardContent>
              </Card>

              {/* Value 3 */}
              <Card className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden hover-lift">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg mb-6">
                    <i className="fas fa-infinity text-white text-xl"></i>
                  </div>
                  <h4 className="text-2xl font-display font-bold mb-4 text-primary">Inclusive Wisdom</h4>
                  <p className="text-secondary leading-relaxed">
                    We welcome all spiritual traditions and paths, believing that wisdom comes in many forms and every soul has something valuable to share.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Vision Section */}
          <div className="mb-20 animate-fade-in">
            <Card className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-secondary/40 glass-effect shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-12">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-secondary to-chakra-crown rounded-2xl flex items-center justify-center shadow-xl mb-6">
                    <i className="fas fa-star text-white text-2xl"></i>
                  </div>
                  <h3 className="text-4xl font-display font-bold mb-6 text-secondary">Our Vision</h3>
                </div>
                <p className="text-xl text-secondary leading-relaxed text-center max-w-4xl mx-auto">
                  We envision a world where technology serves consciousness, where digital spaces feel sacred, and where every person has access to the tools and community they need to awaken to their highest potential. Ascended Social is just the beginning of this revolution in spiritual connection.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center animate-slide-up">
            <h3 className="text-4xl font-display font-bold mb-8">
              <span className="bg-gradient-to-r from-primary via-chakra-heart to-secondary bg-clip-text text-transparent">
                Ready to Begin?
              </span>
            </h3>
            <p className="text-xl text-subtle mb-8 max-w-3xl mx-auto">
              Join a community of awakened souls on a journey of transformation and connection.
            </p>
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="group relative bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold px-12 py-4 rounded-2xl text-lg transition-all duration-500 shadow-2xl hover:shadow-primary/30 hover:scale-105"
              data-testid="button-join"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Your Journey
                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}