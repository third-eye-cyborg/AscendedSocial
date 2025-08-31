import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MarketingFooter from "@/components/MarketingFooter";
import { useQuery } from "@tanstack/react-query";
import { 
  Zap, 
  Calendar, 
  Info, 
  TrendingUp, 
  Heart, 
  Users, 
  Sparkles,
  Clock,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

export default function EnergyPage() {
  const { user } = useAuth();

  const { data: userStats } = useQuery({
    queryKey: ["/api/users", (user as any)?.id, "stats"],
    enabled: !!(user as any)?.id,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-cosmic flex items-center justify-center">
        <Card className="bg-cosmic-light border-primary/30">
          <CardContent className="p-8 text-center">
            <Zap className="w-16 h-16 text-accent-light mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-4">Energy System</h2>
            <p className="text-gray-300 mb-4">Sign in to manage your spiritual energy</p>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90 text-black font-semibold"
              data-testid="button-sign-in"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentEnergy = (userStats as any)?.energy || 1000;
  const maxEnergy = 1000;
  const energyPercentage = (currentEnergy / maxEnergy) * 100;

  const getEnergyStatus = () => {
    if (currentEnergy >= 800) return { status: 'High', color: 'text-green-400', bgColor: 'bg-green-400/20' };
    if (currentEnergy >= 400) return { status: 'Medium', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20' };
    if (currentEnergy >= 100) return { status: 'Low', color: 'text-orange-400', bgColor: 'bg-orange-400/20' };
    return { status: 'Critical', color: 'text-red-400', bgColor: 'bg-red-400/20' };
  };

  const energyStatus = getEnergyStatus();

  return (
    <div className="min-h-screen bg-cosmic p-4" data-testid="energy-page">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="absolute left-0 top-0 text-white hover:text-primary hover:bg-primary/10 transition-all duration-300"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
            Spiritual Energy
          </h1>
          <p className="text-gray-300">
            Your mystical energy that powers high-impact spiritual interactions
          </p>
        </div>

        {/* Current Energy Status */}
        <Card className="bg-cosmic-light border-primary/30 hover-lift">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center">
                <Zap className="w-6 h-6 mr-3 text-accent-light" />
                Your Energy Level
              </span>
              <Badge className={`${energyStatus.bgColor} ${energyStatus.color} border-0`}>
                {energyStatus.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">
                {currentEnergy}
              </div>
              <div className="text-lg text-gray-300 mb-4">
                out of {maxEnergy} energy points
              </div>
              
              <div className="w-full max-w-md mx-auto">
                <Progress 
                  value={energyPercentage} 
                  max={100} 
                  className="h-4 bg-cosmic"
                  data-testid="energy-progress-bar"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>0</span>
                  <span>{maxEnergy}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-cosmic/30 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-sm text-gray-300">Next Reset</div>
                <div className="text-white font-semibold">Monthly</div>
              </div>
              <div className="text-center p-4 bg-cosmic/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-sm text-gray-300">Usage Rate</div>
                <div className="text-white font-semibold">10 per action</div>
              </div>
              <div className="text-center p-4 bg-cosmic/30 rounded-lg">
                <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-sm text-gray-300">Refresh Type</div>
                <div className="text-white font-semibold">Full Reset</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How Energy Works */}
        <Card className="bg-cosmic-light border-primary/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Info className="w-5 h-5 mr-2 text-accent-light" />
              How Spiritual Energy Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-4">
                Spiritual Energy is your mystical resource for making high-impact connections with the community. 
                Unlike regular likes and comments, energy-powered actions create deeper spiritual bonds and 
                significantly boost your spirit guide's evolution.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                    Energy Actions
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span><strong>Energy Share:</strong> Send spiritual energy to posts you deeply resonate with</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span><strong>Spirit Boost:</strong> Amplify your spirit guide's experience gain (+20 XP)</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span><strong>Mystical Connection:</strong> Form deeper bonds with community members</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-orange-400" />
                    Energy Management
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                      <span><strong>Cost:</strong> 10 energy points per action</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                      <span><strong>Capacity:</strong> 1,000 energy points maximum</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                      <span><strong>Reset:</strong> Full refresh every month</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                      <span><strong>Premium:</strong> Unlimited energy with premium subscription</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Energy vs Regular Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-cosmic-light border-primary/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-400" />
                Regular Actions (Free)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-cosmic/30 rounded-lg">
                  <span className="text-white">Like Posts</span>
                  <Badge variant="outline" className="text-green-400 border-green-400/30">
                    +5 Spirit XP
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-cosmic/30 rounded-lg">
                  <span className="text-white">Upvote Content</span>
                  <Badge variant="outline" className="text-green-400 border-green-400/30">
                    +10 Spirit XP
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-cosmic/30 rounded-lg">
                  <span className="text-white">Add Comments</span>
                  <Badge variant="outline" className="text-green-400 border-green-400/30">
                    +8 Spirit XP
                  </Badge>
                </div>
                <div className="text-xs text-gray-400 mt-4 p-2 bg-cosmic/20 rounded text-center">
                  Use these freely for everyday community engagement
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-cosmic-light border-primary/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                Energy Actions (10 Energy)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-400/30">
                  <span className="text-white">Energy Share</span>
                  <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                    +20 Spirit XP
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-400/30">
                  <span className="text-white">Mystical Bond</span>
                  <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/30">
                    Deep Connection
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg border border-blue-400/30">
                  <span className="text-white">Aura Amplify</span>
                  <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">
                    Enhanced Effect
                  </Badge>
                </div>
                <div className="text-xs text-gray-400 mt-4 p-2 bg-cosmic/20 rounded text-center">
                  Limited but powerful - use wisely for maximum spiritual impact
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips for Energy Management */}
        <Card className="bg-cosmic-light border-primary/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-accent-light" />
              Energy Management Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-white font-semibold">Optimize Your Usage</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Save energy for posts that truly resonate with your spiritual journey</li>
                  <li>• Use energy sharing to support fellow seekers during important moments</li>
                  <li>• Balance energy actions with regular engagement for steady growth</li>
                  <li>• Monitor your energy levels to avoid running out mid-month</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-white font-semibold">Maximize Spirit Growth</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Energy actions give 4x more spirit experience than regular actions</li>
                  <li>• Combine with regular engagement for balanced spiritual development</li>
                  <li>• Premium users get unlimited energy for accelerated growth</li>
                  <li>• Track your spirit's evolution in the Spirit Guide section</li>
                </ul>
              </div>
            </div>

            {currentEnergy < 100 && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                  <div>
                    <h4 className="text-red-400 font-semibold">Low Energy Warning</h4>
                    <p className="text-gray-300 text-sm">
                      Your energy is running low. Consider upgrading to Premium for unlimited energy, 
                      or wait for the monthly reset.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <MarketingFooter />
    </div>
  );
}