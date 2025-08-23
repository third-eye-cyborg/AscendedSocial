import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/ascended-social-high-resolution-logo-transparent (2)_1755890554213.png";

export default function Features() {
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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md animate-pulse"></div>
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <img src={logoImage} alt="Ascended Social Logo" className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Ascended Social
                </h1>
                <p className="text-xs text-muted font-medium tracking-wide">TRANSCEND • CONNECT • EVOLVE</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-6xl font-display font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Platform Features
              </span>
            </h2>
            <p className="text-2xl text-subtle mb-8 leading-relaxed max-w-4xl mx-auto">
              Discover the revolutionary tools designed to elevate your spiritual journey and connect you with like-minded souls.
            </p>
          </div>

          {/* Core Features Grid */}
          <div className="mb-20">
            <h3 className="text-4xl font-display font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-chakra-heart to-chakra-crown bg-clip-text text-transparent">
                Core Features
              </span>
            </h3>
            
            <div className="grid lg:grid-cols-3 gap-8 mb-12 animate-slide-up">
              {/* AI-Generated Sigils */}
              <Card className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-heart/40 glass-effect shadow-xl rounded-3xl overflow-hidden hover-lift">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-chakra-heart/20 rounded-2xl blur-md animate-pulse"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-chakra-heart to-chakra-heart/80 rounded-2xl flex items-center justify-center shadow-xl">
                      <i className="fas fa-magic text-white text-2xl"></i>
                    </div>
                  </div>
                  <h4 className="text-2xl font-display font-bold mb-4 text-chakra-heart">AI-Generated Sigils</h4>
                  <p className="text-secondary leading-relaxed mb-4">
                    Receive a unique mystical sigil that represents your spiritual essence and energy signature, crafted by advanced AI consciousness.
                  </p>
                  <ul className="text-subtle text-sm space-y-2">
                    <li className="flex items-center"><i className="fas fa-check text-chakra-heart mr-2"></i>Personalized spiritual symbols</li>
                    <li className="flex items-center"><i className="fas fa-check text-chakra-heart mr-2"></i>AI-powered energy analysis</li>
                    <li className="flex items-center"><i className="fas fa-check text-chakra-heart mr-2"></i>Evolution tracking over time</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Chakra Intelligence */}
              <Card className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-crown/40 glass-effect shadow-xl rounded-3xl overflow-hidden hover-lift">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-chakra-crown/20 rounded-2xl blur-md animate-pulse"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-chakra-crown to-chakra-crown/80 rounded-2xl flex items-center justify-center shadow-xl">
                      <i className="fas fa-eye text-white text-2xl"></i>
                    </div>
                  </div>
                  <h4 className="text-2xl font-display font-bold mb-4 text-chakra-crown">Chakra Intelligence</h4>
                  <p className="text-secondary leading-relaxed mb-4">
                    AI automatically categorizes your posts by the 7-chakra system, creating a vibrant energy map of your spiritual evolution.
                  </p>
                  <ul className="text-subtle text-sm space-y-2">
                    <li className="flex items-center"><i className="fas fa-check text-chakra-crown mr-2"></i>Automatic content categorization</li>
                    <li className="flex items-center"><i className="fas fa-check text-chakra-crown mr-2"></i>Energy balance insights</li>
                    <li className="flex items-center"><i className="fas fa-check text-chakra-crown mr-2"></i>Growth visualization</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Sacred Energy System */}
              <Card className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden hover-lift">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-md animate-pulse"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl">
                      <i className="fas fa-bolt text-white text-2xl"></i>
                    </div>
                  </div>
                  <h4 className="text-2xl font-display font-bold mb-4 text-primary">Sacred Energy System</h4>
                  <p className="text-secondary leading-relaxed mb-4">
                    Engage with content using our revolutionary three-tier system: votes, likes, and pure spiritual energy transmission.
                  </p>
                  <ul className="text-subtle text-sm space-y-2">
                    <li className="flex items-center"><i className="fas fa-check text-primary mr-2"></i>Three interaction levels</li>
                    <li className="flex items-center"><i className="fas fa-check text-primary mr-2"></i>Energy-based engagement</li>
                    <li className="flex items-center"><i className="fas fa-check text-primary mr-2"></i>Community resonance tracking</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mb-20">
            <h3 className="text-4xl font-display font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Premium Features
              </span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8 animate-slide-up">
              <div className="space-y-6">
                {/* Oracle Readings */}
                <Card className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <i className="fas fa-crystal-ball text-white"></i>
                      </div>
                      <div>
                        <h4 className="text-xl font-display font-bold text-primary mb-2">Daily Oracle Readings</h4>
                        <p className="text-secondary leading-relaxed">
                          Receive personalized spiritual guidance and wisdom each day through AI-powered oracle readings tailored to your energy signature.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sparks & Visions */}
                <Card className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-chakra-heart/40 glass-effect shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-chakra-heart rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <i className="fas fa-video text-white"></i>
                      </div>
                      <div>
                        <h4 className="text-xl font-display font-bold text-chakra-heart mb-2">Sparks & Visions</h4>
                        <p className="text-secondary leading-relaxed">
                          Share quick spiritual insights (Sparks) or longer-form wisdom videos (Visions) to inspire and connect with your community.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Aura Tracking */}
                <Card className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-chakra-crown/40 glass-effect shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-chakra-crown rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <i className="fas fa-heartbeat text-white"></i>
                      </div>
                      <div>
                        <h4 className="text-xl font-display font-bold text-chakra-crown mb-2">Aura Tracking</h4>
                        <p className="text-secondary leading-relaxed">
                          Monitor your spiritual growth through an intelligent aura system that evolves with your consciousness and community interactions.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* AI Tarot */}
                <Card className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-secondary/40 glass-effect shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <i className="fas fa-cards-blank text-white"></i>
                      </div>
                      <div>
                        <h4 className="text-xl font-display font-bold text-secondary mb-2">AI Tarot Readings</h4>
                        <p className="text-secondary leading-relaxed">
                          Access deep tarot insights generated by advanced AI consciousness, providing personalized guidance for your spiritual path.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sacred Circles */}
                <Card className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <i className="fas fa-users text-white"></i>
                      </div>
                      <div>
                        <h4 className="text-xl font-display font-bold text-primary mb-2">Sacred Circles</h4>
                        <p className="text-secondary leading-relaxed">
                          Join or create intimate spiritual communities focused on specific practices, traditions, or growth themes.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Energy Analytics */}
                <Card className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-chakra-heart/40 glass-effect shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-chakra-heart rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <i className="fas fa-chart-line text-white"></i>
                      </div>
                      <div>
                        <h4 className="text-xl font-display font-bold text-chakra-heart mb-2">Energy Analytics</h4>
                        <p className="text-secondary leading-relaxed">
                          Track your spiritual growth patterns, energy fluctuations, and community impact through detailed analytics and insights.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center animate-slide-up">
            <Card className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-12">
                <h3 className="text-4xl font-display font-bold mb-6">
                  <span className="bg-gradient-to-r from-primary via-chakra-heart to-secondary bg-clip-text text-transparent">
                    Experience the Magic
                  </span>
                </h3>
                <p className="text-xl text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
                  Join thousands of awakened souls using these transformative features to elevate their consciousness and connect with their spiritual tribe.
                </p>
                <div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
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
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => window.location.href = '/pricing'}
                    className="group border-2 border-white/50 text-white bg-cosmic/70 hover:border-primary hover:text-white hover:bg-primary transition-all duration-300 backdrop-blur-sm px-12 py-4 rounded-2xl text-lg font-semibold"
                    data-testid="button-pricing"
                  >
                    <span className="flex items-center gap-3">
                      <i className="fas fa-dollar-sign"></i>
                      View Pricing
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}