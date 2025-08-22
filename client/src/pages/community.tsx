import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Community() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
            <i className="fas fa-users text-primary text-3xl"></i>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-4">Sacred Community</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Connect with like-minded souls, join sacred circles, and participate in group meditations and spiritual discussions.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sacred Circles */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">Sacred Circles</h2>
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
                          <Badge variant="outline" className="text-xs">
                            {circle.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-primary/30 hover:bg-primary/50"
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
                  <div className="text-sm font-medium text-white">Crystal Bowl Healing</div>
                  <div className="text-xs text-gray-400">Tomorrow at 2 PM EST</div>
                </div>
                <div className="border-l-2 border-green-400 pl-3">
                  <div className="text-sm font-medium text-white">Group Tarot Reading</div>
                  <div className="text-xs text-gray-400">Sunday at 7 PM EST</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cosmic-light border border-primary/30">
              <CardHeader>
                <CardTitle className="text-accent-light flex items-center">
                  <i className="fas fa-plus-circle mr-2"></i>
                  Create Your Circle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">
                  Start your own sacred circle and invite others to join your spiritual practice.
                </p>
                <Button 
                  className="w-full bg-primary hover:bg-primary/80"
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
                className="bg-primary hover:bg-primary/80"
              >
                Return to Feed
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}