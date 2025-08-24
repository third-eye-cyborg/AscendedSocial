import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/ascended-social-high-resolution-logo-transparent (2)_1755890554213.png";

export default function Pricing() {
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
                onClick={() => window.location.href = '/api/login'}
                className="relative group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/25 hover:shadow-xl"
                data-testid="button-login"
              >
                <span className="relative z-10">Enter the Realm</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              </Button>
            </div>

            {/* Mobile Login Button */}
            <div className="md:hidden">
              <Button 
                size="sm"
                onClick={() => window.location.href = '/api/login'}
                className="relative group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300 shadow-lg"
                data-testid="button-login-mobile"
              >
                <span className="relative z-10">Login</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-24 sm:pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Choose Your Path
              </span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-subtle mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto px-4">
              Select the subscription that aligns with your spiritual journey and unlock the full potential of conscious connection.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 animate-slide-up">
            {/* Seeker Plan */}
            <Card className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-heart/40 glass-effect shadow-xl rounded-3xl overflow-hidden hover-lift">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-chakra-heart to-chakra-heart/80 rounded-2xl flex items-center justify-center shadow-xl mb-4">
                    <i className="fas fa-seedling text-white text-2xl"></i>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-chakra-heart mb-2">Seeker</h3>
                  <p className="text-subtle mb-4">Perfect for those beginning their spiritual journey</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">Free</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <i className="fas fa-check text-chakra-heart mr-3"></i>
                    <span className="text-secondary">Basic community access</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-chakra-heart mr-3"></i>
                    <span className="text-secondary">Share posts & connect</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-chakra-heart mr-3"></i>
                    <span className="text-secondary">Basic energy tracking</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-chakra-heart mr-3"></i>
                    <span className="text-secondary">Weekly oracle reading</span>
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-gradient-to-r from-chakra-heart to-chakra-heart/80 hover:from-chakra-heart/90 hover:to-chakra-heart/70 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-seeker"
                >
                  Start Free
                </Button>
              </CardContent>
            </Card>

            {/* Mystic Plan - Popular */}
            <Card className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border-2 border-primary/60 glass-effect shadow-2xl rounded-3xl hover-lift relative">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-secondary px-6 py-2 rounded-full text-white font-bold text-sm shadow-lg">
                Most Popular
              </div>
              <CardContent className="p-8 pt-12">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl mb-4">
                    <i className="fas fa-eye text-white text-2xl"></i>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-primary mb-2">Mystic</h3>
                  <p className="text-subtle mb-4">For dedicated practitioners seeking deeper insights</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">$12</span>
                    <span className="text-muted">/month</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <i className="fas fa-check text-primary mr-3"></i>
                    <span className="text-secondary">Everything in Seeker</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-primary mr-3"></i>
                    <span className="text-secondary">Personal AI sigil generation</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-primary mr-3"></i>
                    <span className="text-secondary">Daily oracle readings</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-primary mr-3"></i>
                    <span className="text-secondary">Chakra intelligence system</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-primary mr-3"></i>
                    <span className="text-secondary">Advanced aura tracking</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-primary mr-3"></i>
                    <span className="text-secondary">Sacred circles access</span>
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg"
                  onClick={() => window.location.href = '/subscribe'}
                  data-testid="button-mystic"
                >
                  Choose Mystic
                </Button>
              </CardContent>
            </Card>

            {/* Ascended Plan */}
            <Card className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-crown/40 glass-effect shadow-xl rounded-3xl overflow-hidden hover-lift">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-chakra-crown to-chakra-crown/80 rounded-2xl flex items-center justify-center shadow-xl mb-4">
                    <i className="fas fa-crown text-white text-2xl"></i>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-chakra-crown mb-2">Ascended</h3>
                  <p className="text-subtle mb-4">For spiritual leaders and advanced practitioners</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">$24</span>
                    <span className="text-muted">/month</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <i className="fas fa-check text-chakra-crown mr-3"></i>
                    <span className="text-secondary">Everything in Mystic</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-chakra-crown mr-3"></i>
                    <span className="text-secondary">AI tarot readings</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-chakra-crown mr-3"></i>
                    <span className="text-secondary">Create sacred circles</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-chakra-crown mr-3"></i>
                    <span className="text-secondary">Advanced energy analytics</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-chakra-crown mr-3"></i>
                    <span className="text-secondary">Priority community support</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-chakra-crown mr-3"></i>
                    <span className="text-secondary">Unlimited visions & sparks</span>
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-gradient-to-r from-chakra-crown to-chakra-crown/80 hover:from-chakra-crown/90 hover:to-chakra-crown/70 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                  onClick={() => window.location.href = '/subscribe'}
                  data-testid="button-ascended"
                >
                  Choose Ascended
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mb-16 animate-fade-in">
            <h3 className="text-4xl font-display font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/30 glass-effect shadow-lg rounded-2xl">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-display font-bold text-primary mb-3">Can I change plans anytime?</h4>
                    <p className="text-secondary leading-relaxed">
                      Absolutely! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the next billing cycle.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/30 glass-effect shadow-lg rounded-2xl">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-display font-bold text-primary mb-3">Is there a free trial?</h4>
                    <p className="text-secondary leading-relaxed">
                      The Seeker plan is completely free forever. For premium plans, we offer a 7-day free trial to experience all features.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/30 glass-effect shadow-lg rounded-2xl">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-display font-bold text-primary mb-3">What payment methods do you accept?</h4>
                    <p className="text-secondary leading-relaxed">
                      We accept all major credit cards, PayPal, and bank transfers. All payments are securely processed and encrypted.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/30 glass-effect shadow-lg rounded-2xl">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-display font-bold text-primary mb-3">Do you offer refunds?</h4>
                    <p className="text-secondary leading-relaxed">
                      We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll provide a full refund.
                    </p>
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
                    Ready to Ascend?
                  </span>
                </h3>
                <p className="text-xl text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
                  Join thousands of souls on their journey to higher consciousness. Start with our free plan or unlock premium features today.
                </p>
                <div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg"
                    onClick={() => window.location.href = '/api/login'}
                    className="group relative bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold px-12 py-4 rounded-2xl text-lg transition-all duration-500 shadow-2xl hover:shadow-primary/30 hover:scale-105"
                    data-testid="button-start-free"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Start Free Today
                      <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => window.location.href = '/subscribe'}
                    className="group border-2 border-white/50 text-white bg-cosmic/70 hover:border-primary hover:text-white hover:bg-primary transition-all duration-300 backdrop-blur-sm px-12 py-4 rounded-2xl text-lg font-semibold"
                    data-testid="button-subscribe"
                  >
                    <span className="flex items-center gap-3">
                      <i className="fas fa-credit-card"></i>
                      Choose Premium
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