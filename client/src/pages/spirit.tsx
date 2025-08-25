import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SpiritAvatar from "@/components/SpiritAvatar";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, TrendingUp, Zap, Star, Heart, Users, MessageCircle, Clock, Trophy, ArrowUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Spirit } from "@shared/schema";

export default function SpiritPage() {
  const { user } = useAuth();

  const { data: spirit, isLoading } = useQuery<Spirit | null>({
    queryKey: ["/api/spirit"],
    enabled: !!user,
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/users", (user as any)?.id, "stats"],
    enabled: !!(user as any)?.id,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-cosmic flex items-center justify-center">
        <Card className="bg-cosmic-light border-primary/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-4">Welcome to Spirit Realm</h2>
            <p className="text-gray-300 mb-4">Sign in to discover your spiritual companion</p>
            <Button className="bg-primary hover:bg-primary/90 text-black font-semibold">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cosmic p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-cosmic-light/30 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-cosmic-light/30 rounded-lg" />
              <div className="h-64 bg-cosmic-light/30 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!spirit) {
    return (
      <div className="min-h-screen bg-cosmic flex items-center justify-center">
        <Card className="bg-cosmic-light border-primary/30 max-w-md">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-16 h-16 text-accent-light mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-4">Your Spirit Awaits</h2>
            <p className="text-gray-300 mb-4">
              Complete your onboarding journey to discover your unique spirit guide
            </p>
            <Button 
              className="bg-primary hover:bg-primary/90 text-black font-semibold"
              onClick={() => window.location.href = '/onboarding'}
              data-testid="button-begin-journey"
            >
              Begin Spiritual Journey
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getExperienceStats = () => {
    const currentExp = spirit?.experience || 0;
    const currentLevel = spirit?.level || 1;
    const expForCurrentLevel = (currentLevel - 1) * 100;
    const expForNextLevel = currentLevel * 100;
    const progressInLevel = currentExp - expForCurrentLevel;
    const progressPercent = (progressInLevel / 100) * 100;

    return {
      currentExp,
      currentLevel,
      expForNextLevel,
      progressInLevel,
      progressPercent,
      expToNextLevel: expForNextLevel - currentExp
    };
  };

  const expStats = getExperienceStats();

  const getEngagementBonus = (type: string) => {
    const bonuses = {
      'like_engagement': '+5 XP',
      'upvote_engagement': '+10 XP',
      'energy_engagement': '+20 XP',
      'downvote_engagement': '+2 XP',
      'comment_creation': '+8 XP'
    };
    return bonuses[type as keyof typeof bonuses] || '+? XP';
  };

  return (
    <div className="min-h-screen bg-cosmic p-4" data-testid="spirit-page">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            Your Spirit Guide
          </h1>
          <p className="text-gray-300">
            Your spiritual companion that grows through your journey
          </p>
        </div>

        {/* Main Spirit Display */}
        <Card className="bg-cosmic-light border-primary/30 hover-lift">
          <CardContent className="p-8">
            <SpiritAvatar userId={(user as any)?.id} showDetails={true} size="lg" />
          </CardContent>
        </Card>

        {/* Stats and Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Experience & Level */}
          <Card className="bg-cosmic-light border-primary/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-accent-light" />
                Experience & Growth
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  Level {expStats.currentLevel}
                </div>
                <div className="text-sm text-gray-300">
                  {expStats.currentExp} / {expStats.expForNextLevel} XP
                </div>
              </div>
              
              <div className="w-full bg-cosmic rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, expStats.progressPercent)}%` }}
                />
              </div>
              
              <div className="text-center">
                <div className="text-accent-light font-semibold">
                  {expStats.expToNextLevel} XP to next level
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Activities */}
          <Card className="bg-cosmic-light border-primary/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-accent-light" />
                Ways to Grow Your Spirit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-cosmic/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-white text-sm">Like posts</span>
                </div>
                <Badge variant="outline" className="text-green-400 border-green-400/30">
                  +5 XP
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-cosmic/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm">Upvote content</span>
                </div>
                <Badge variant="outline" className="text-green-400 border-green-400/30">
                  +10 XP
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-cosmic/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm">Share comments</span>
                </div>
                <Badge variant="outline" className="text-green-400 border-green-400/30">
                  +8 XP
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-cosmic/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-white text-sm">Share energy</span>
                </div>
                <Badge variant="outline" className="text-green-400 border-green-400/30">
                  +20 XP
                </Badge>
              </div>

              <div className="text-xs text-gray-400 mt-4 p-2 bg-cosmic/20 rounded text-center">
                Your spirit evolves as you engage with the community!
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Stats */}
        <Card className="bg-cosmic-light border-primary/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-accent-light" />
              Community Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {(userStats as any)?.totalPosts || 0}
                </div>
                <div className="text-sm text-gray-300">Posts Shared</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent-light">
                  {(userStats as any)?.totalEngagements || 0}
                </div>
                <div className="text-sm text-gray-300">Engagements</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {(userStats as any)?.positiveEnergy || 0}
                </div>
                <div className="text-sm text-gray-300">Positive Energy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-400">
                  {(userStats as any)?.auraLevel || 1}
                </div>
                <div className="text-sm text-gray-300">Aura Level</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evolution Timeline */}
        <Card className="bg-cosmic-light border-primary/30" data-testid="spirit-timeline">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-accent-light" />
              Evolution Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
            {spirit?.evolution && (spirit.evolution as any[]).length > 0 ? (
              <div className="space-y-4">
                {(spirit.evolution as any[])
                  .slice()
                  .reverse()
                  .map((event: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-cosmic/30 rounded-lg hover:bg-cosmic/50 transition-colors">
                      <div className="flex-shrink-0">
                        {event.leveledUp ? (
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-white" data-testid="icon-level-up" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-cosmic rounded-full flex items-center justify-center border border-primary/30">
                            <ArrowUp className="w-5 h-5 text-accent-light" data-testid="icon-experience-gain" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white font-semibold" data-testid={`text-timeline-action-${index}`}>
                            {event.leveledUp ? `Leveled up to Level ${event.newLevel}!` : event.action}
                          </h4>
                          <Badge variant="outline" className="text-green-400 border-green-400/30 text-xs">
                            +{event.experienceGain} XP
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-2" data-testid={`text-timeline-details-${index}`}>
                          {event.leveledUp 
                            ? `Reached ${event.newExperience} total experience points and advanced to the next level!`
                            : `Total experience: ${event.newExperience} XP`
                          }
                        </p>
                        <p className="text-gray-400 text-xs" data-testid={`text-timeline-time-${index}`}>
                          {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">No Evolution History Yet</h3>
                <p className="text-gray-300 text-sm">
                  Start engaging with the community to see your spirit's growth journey!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}