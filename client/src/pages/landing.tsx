import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-cosmic text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cosmic/90 backdrop-blur-lg border-b border-primary/30">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <i className="fas fa-lotus text-white text-lg"></i>
              </div>
              <h1 className="text-xl font-display font-bold text-primary">
                Ascended Social
              </h1>
            </div>
            
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/80"
              data-testid="button-login"
            >
              Enter the Realm
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="aura-visualization rounded-3xl p-12 mb-12">
            <h2 className="text-5xl font-display font-bold mb-6 text-white">
              Ascend Your Social Experience
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              A mystical social platform where spirituality meets technology. 
              Connect with like-minded souls, share your journey, and discover your true potential.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => window.location.href = '/api/login'}
                className="bg-primary hover:bg-primary/80 text-white font-semibold px-8 py-3"
                data-testid="button-join"
              >
                Begin Your Ascension
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10"
                data-testid="button-learn"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-cosmic-light border-primary/30 chakra-glow-heart">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-chakra-heart rounded-full flex items-center justify-center">
                  <i className="fas fa-user-circle text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-chakra-heart">AI-Generated Sigils</h3>
                <p className="text-gray-300">
                  Receive your unique mystical sigil that represents your spiritual essence and energy signature.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-cosmic-light border-primary/30 chakra-glow-crown">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-chakra-crown rounded-full flex items-center justify-center">
                  <i className="fas fa-eye text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-chakra-crown">Chakra Categorization</h3>
                <p className="text-gray-300">
                  AI automatically categorizes your posts by the 7-chakra system, creating a vibrant energy map.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-cosmic-light border-primary/30 chakra-glow-throat">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                  <i className="fas fa-bolt text-cosmic text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-accent-light">Energy System</h3>
                <p className="text-gray-300">
                  Engage with content using a unique three-tier system: votes, likes, and spiritual energy.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Spiritual Features */}
          <div className="bg-cosmic-light rounded-2xl p-8 border border-primary/30">
            <h3 className="text-3xl font-display font-bold mb-6 text-center">
              <span className="text-accent-light">
                Mystical Features
              </span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-crystal-ball text-white"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">Daily Oracle Readings</h4>
                  <p className="text-gray-300 text-sm">
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
                  <p className="text-gray-300 text-sm">
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
                  <p className="text-gray-300 text-sm">
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
                  <p className="text-gray-300 text-sm">
                    Monitor your spiritual growth through an intelligent aura system that evolves with you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Call to Action */}
      <section className="bg-cosmic-light py-16 border-t border-primary/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-display font-bold mb-4">
            Ready to Transform Your Social Experience?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of spiritual seekers on their journey of ascension.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-primary hover:bg-primary/80 text-white font-semibold px-12 py-4 text-lg"
            data-testid="button-cta"
          >
            Start Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
}
