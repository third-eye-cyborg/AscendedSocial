import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import logoImage from "@assets/ascended-social-high-resolution-logo-transparent (2)_1755890554213.png";

export default function Community() {
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
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative pt-20 sm:pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
              <i className="fas fa-users text-primary text-2xl sm:text-3xl"></i>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">Sacred Community</h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Connect with like-minded souls, join sacred circles, and participate in group meditations and spiritual discussions.
            </p>
          </div>

          {/* Demo Data Notice */}
          <div className="mb-6">
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <i className="fas fa-info-circle text-amber-400"></i>
                <h3 className="text-amber-400 font-semibold">Demo Content</h3>
              </div>
              <p className="text-amber-200/90 text-sm">
                The circles, events, and community stats shown below are demo data to showcase how the community will look once users begin creating content and joining activities.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Sacred Circles */}
            <div className="lg:col-span-2">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Sacred Circles</h2>
              <div className="space-y-4">
                {[
                  {
                    name: "Daily Meditation Circle",
                    members: 234,
                    description: "Join us for daily group meditation sessions at sunrise and sunset.",
                    type: "Meditation",
                    active: true
                  },
                  {
                    name: "Crystal Healing Society",
                    members: 156,
                    description: "Share knowledge about crystal properties and healing techniques.",
                    type: "Healing",
                    active: true
                  },
                  {
                    name: "Astrology & Moon Phases",
                    members: 89,
                    description: "Discuss celestial influences and planetary alignments.",
                    type: "Astrology",
                    active: false
                  },
                  {
                    name: "Tarot & Divination",
                    members: 178,
                    description: "Share readings and explore divination techniques together.",
                    type: "Divination",
                    active: true
                  }
                ].map((circle, index) => (
                  <Card key={index} className="bg-cosmic-light border border-primary/30 hover-lift">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-white">{circle.name}</h3>
                            {circle.active && (
                              <Badge className="bg-green-500/20 text-green-400 text-xs">
                                <i className="fas fa-circle text-xs mr-1"></i>
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{circle.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <span><i className="fas fa-users mr-1"></i>{circle.members} members</span>
                            <Badge variant="outline" className="text-xs text-white">
                              {circle.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-primary/30 hover:bg-primary/50 text-white"
                        onClick={() => alert(`Joining ${circle.name}...\n\nThis feature will be fully implemented soon! 🕉️`)}
                      >
                        Join Circle
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Community Stats & Features */}
            <div className="space-y-6">
              <Card className="bg-cosmic-light border border-primary/30">
                <CardHeader>
                  <CardTitle className="text-accent-light flex items-center">
                    <i className="fas fa-chart-line mr-2"></i>
                    Community Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">1,247</div>
                    <div className="text-sm text-gray-300">Active Seekers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-light">42</div>
                    <div className="text-sm text-gray-300">Sacred Circles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">8</div>
                    <div className="text-sm text-gray-300">Live Sessions Today</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-cosmic-light border border-primary/30">
                <CardHeader>
                  <CardTitle className="text-accent-light flex items-center">
                    <i className="fas fa-calendar-alt mr-2"></i>
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border-l-2 border-primary pl-3">
                    <div className="text-sm font-medium text-white">Full Moon Meditation</div>
                    <div className="text-xs text-gray-400">Tonight at 9 PM EST</div>
                  </div>
                  <div className="border-l-2 border-accent-light pl-3">
                    <div className="text-sm font-medium text-white">Crystal Healing Workshop</div>
                    <div className="text-xs text-gray-400">Tomorrow at 2 PM EST</div>
                  </div>
                  <div className="border-l-2 border-secondary pl-3">
                    <div className="text-sm font-medium text-white">Astrology Reading Circle</div>
                    <div className="text-xs text-gray-400">Thursday at 7 PM EST</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-cosmic-light border border-primary/30">
                <CardHeader>
                  <CardTitle className="text-accent-light flex items-center">
                    <i className="fas fa-plus-circle mr-2"></i>
                    Create Your Own Circle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">
                    Start your own sacred circle and invite others to join your spiritual practice.
                  </p>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/80 text-white"
                    onClick={() => alert('Creating Sacred Circles...\n\nThis feature will allow you to start your own spiritual community! Coming soon! 🕉️')}
                  >
                    Create Circle
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center mt-12">
            <Card className="bg-cosmic-light border border-primary/30 max-w-2xl mx-auto">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  🕉️ Feature In Development
                </h3>
                <p className="text-gray-300 mb-4">
                  The Sacred Community platform is being developed to facilitate group meditations, 
                  spiritual discussions, and meaningful connections between seekers. 
                  Stay tuned for this transformative feature!
                </p>
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="bg-primary hover:bg-primary/80 text-white"
                >
                  Return to Feed
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}