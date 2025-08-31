import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Code, Smartphone, Database, Brain, Users, Star, ArrowLeft } from "lucide-react";
import ASLogo from "@assets/ASLogo.png";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic via-cosmic-dark to-cosmic relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
            <a href="/" className="inline-flex items-center gap-2" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </a>
          </Button>
        </div>
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            About Ascended Social
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            A sacred digital space for spiritual growth, connection, and enlightenment, 
            created by Third Eye Cyborg to foster authentic community engagement.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12 border border-primary/30 bg-cosmic/20 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-display text-white mb-4">Our Mission</CardTitle>
            <CardDescription className="text-lg text-muted">
              Transforming digital connections through spiritual technology
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted leading-relaxed max-w-4xl mx-auto">
              Ascended Social represents a revolutionary approach to social networking. We believe in creating 
              powerful software solutions that enhance human connections through technology. Our platform is 
              designed to bring people together in meaningful ways, creating spaces where content and 
              interactions foster authentic community engagement around spiritual growth and enlightenment.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border border-primary/30 bg-cosmic/20 backdrop-blur-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white">AI-Powered Content Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted text-center">
                Our proprietary content management system leverages semantic analysis algorithms to evaluate 
                and categorize content based on spiritual frequency and chakra alignment.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-primary/30 bg-cosmic/20 backdrop-blur-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white">Personalized Oracle System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted text-center">
                Our AI-powered recommendation system analyzes content sentiment and spiritual context, 
                delivering tailored oracle readings and guidance based on your spiritual journey.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-primary/30 bg-cosmic/20 backdrop-blur-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white">Spiritual Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted text-center">
                Building a network of spiritual seekers who share wisdom, collaborate on growth, 
                and support each other's enlightenment journey through our sacred digital space.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* About Third Eye Cyborg */}
        <Card className="mb-12 border border-primary/30 bg-cosmic/20 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-display text-white mb-4">About Third Eye Cyborg</CardTitle>
            <CardDescription className="text-lg text-muted">
              The innovative technology company behind Ascended Social
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-muted leading-relaxed mb-6">
                  Third Eye Cyborg is a cutting-edge technology company specializing in rapid development 
                  of React and React Native applications with PostgreSQL in the Replit environment. We 
                  leverage AI tools like Replit's AI agent and Cursor to build applications at lightning 
                  speed, enabling small teams or individual developers to create powerful web and mobile solutions.
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-primary">
                    <Code className="w-5 h-5" />
                    <span className="text-white">React & TypeScript</span>
                  </div>
                  <div className="flex items-center space-x-2 text-primary">
                    <Smartphone className="w-5 h-5" />
                    <span className="text-white">React Native</span>
                  </div>
                  <div className="flex items-center space-x-2 text-primary">
                    <Database className="w-5 h-5" />
                    <span className="text-white">PostgreSQL</span>
                  </div>
                  <div className="flex items-center space-x-2 text-primary">
                    <Brain className="w-5 h-5" />
                    <span className="text-white">AI-Enhanced Development</span>
                  </div>
                </div>
                <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                  <a 
                    href="https://thirdeyecyborg.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                    data-testid="button-visit-tec"
                  >
                    <span className="text-[#ffffff]">Visit Third Eye Cyborg</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-8 backdrop-blur-sm border border-primary/30">
                  <h3 className="text-2xl font-bold text-white mb-4">Our Philosophy</h3>
                  <p className="text-muted leading-relaxed">
                    "We believe in creating powerful software solutions that enhance human connections 
                    through technology. Our platforms are designed to bring people together in meaningful 
                    ways, creating spaces where content and interactions foster authentic community engagement."
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="border border-primary/30 bg-cosmic/20 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display text-white">Connect With Us</CardTitle>
            <CardDescription className="text-muted">
              Ready to join the spiritual technology revolution?
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                <a href="mailto:support@ascendedsocial.com" data-testid="button-contact-support">
                  Contact Support
                </a>
              </Button>
              <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                <a href="/api/login" data-testid="button-join-platform">
                  Join Our Platform
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}