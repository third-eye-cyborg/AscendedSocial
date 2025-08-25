import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Clock, Sparkles, Zap, Calendar, TrendingUp, User, Star } from "lucide-react";
import { format } from "date-fns";

interface EvolutionEntry {
  timestamp: string;
  action: string;
  experienceGain: number;
  newExperience: number;
  newLevel: number;
  leveledUp: boolean;
}

interface SpiritQuestionnaire {
  isReligious: boolean;
  isSpiritual: boolean;
  religion?: string;
  spiritualPath?: string;
  beliefs: string;
  offerings: string;
  astrologySign: string;
  timestamp?: string;
  regeneratedAt?: string;
  evolvedAt?: string;
  previousQuestionnaire?: any;
}

interface SpiritEvolution {
  name: string;
  description: string;
  element: string;
  level: number;
  experience: number;
  questionnaire: SpiritQuestionnaire;
  evolution: EvolutionEntry[];
  createdAt: string;
  updatedAt: string;
}

export default function SpiritTimeline() {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  // Get current spirit with evolution history
  const { data: currentSpirit, isLoading } = useQuery<SpiritEvolution>({
    queryKey: ["/api/spirit"],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <Card className="bg-slate-900 border border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentSpirit) {
    return (
      <Card className="bg-slate-900 border border-slate-700">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">No spirit guide found. Generate one to see evolution history!</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare timeline data - combine creation and evolution events
  const timelineEvents = [];

  // Spirit creation event
  timelineEvents.push({
    type: "creation",
    timestamp: currentSpirit.createdAt,
    title: "Spirit Guide Born",
    description: `${currentSpirit.name} manifested as a ${currentSpirit.element} element spirit`,
    questionnaire: currentSpirit.questionnaire,
    level: 1,
    experience: 0,
    icon: Sparkles,
    color: "from-green-500 to-emerald-500"
  });

  // Evolution events from experience gains
  if (currentSpirit.evolution && currentSpirit.evolution.length > 0) {
    currentSpirit.evolution.forEach((evolution, index) => {
      timelineEvents.push({
        type: "evolution",
        timestamp: evolution.timestamp,
        title: evolution.leveledUp ? `Leveled Up to ${evolution.newLevel}!` : "Experience Gained",
        description: `${evolution.action} (+${evolution.experienceGain} XP)`,
        level: evolution.newLevel,
        experience: evolution.newExperience,
        icon: evolution.leveledUp ? TrendingUp : Zap,
        color: evolution.leveledUp ? "from-yellow-500 to-orange-500" : "from-blue-500 to-cyan-500"
      });
    });
  }

  // Check for questionnaire updates (regenerations/evolutions)
  const questionnaire = currentSpirit.questionnaire;
  if (questionnaire?.regeneratedAt) {
    timelineEvents.push({
      type: "regeneration",
      timestamp: questionnaire.regeneratedAt,
      title: "Spirit Evolved (Same Path)",
      description: "Guide transformed while keeping the same spiritual essence",
      questionnaire: questionnaire,
      level: currentSpirit.level,
      experience: currentSpirit.experience,
      icon: Star,
      color: "from-purple-500 to-indigo-500"
    });
  }

  if (questionnaire?.evolvedAt) {
    timelineEvents.push({
      type: "questionnaire_update",
      timestamp: questionnaire.evolvedAt,
      title: "Spiritual Growth & Evolution",
      description: "Updated spiritual insights led to profound transformation",
      questionnaire: questionnaire,
      previousQuestionnaire: questionnaire.previousQuestionnaire,
      level: currentSpirit.level,
      experience: currentSpirit.experience,
      icon: User,
      color: "from-pink-500 to-rose-500"
    });
  }

  // Sort events by timestamp (newest first)
  timelineEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Show only first 3 events unless expanded
  const displayEvents = isExpanded ? timelineEvents : timelineEvents.slice(0, 3);

  return (
    <Card className="bg-slate-900 border border-slate-700 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          Spirit Evolution Timeline
        </CardTitle>
        <p className="text-sm text-gray-400">
          Track your spirit guide's growth and transformations
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayEvents.map((event, index) => {
          const IconComponent = event.icon;
          return (
            <div key={`${event.type}-${event.timestamp}-${index}`} className="relative">
              {/* Timeline line */}
              {index < displayEvents.length - 1 && (
                <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 to-transparent"></div>
              )}
              
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center shadow-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{event.title}</h3>
                    <Badge variant="outline" className="text-xs border-purple-400/50 text-purple-300">
                      Level {event.level}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-2">{event.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(event.timestamp), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                    {event.experience !== undefined && (
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {event.experience} XP
                      </span>
                    )}
                  </div>

                  {/* Show questionnaire changes for creation and evolution events */}
                  {(event.type === "creation" || event.type === "questionnaire_update") && event.questionnaire && (
                    <div className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
                      <h4 className="text-sm font-medium text-purple-300 mb-2">Spiritual Traits</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400">Path:</span>
                          <span className="text-white ml-1">
                            {event.questionnaire.spiritualPath || "Universal"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Sign:</span>
                          <span className="text-white ml-1">{event.questionnaire.astrologySign}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-400">Beliefs:</span>
                          <p className="text-white text-xs mt-1 line-clamp-2">
                            {event.questionnaire.beliefs}
                          </p>
                        </div>
                      </div>
                      
                      {/* Show previous questionnaire changes if available */}
                      {event.previousQuestionnaire && (
                        <div className="mt-3 pt-3 border-t border-slate-600/50">
                          <h5 className="text-xs font-medium text-yellow-300 mb-2">Changes from Previous</h5>
                          <div className="space-y-1 text-xs">
                            {event.questionnaire.beliefs !== event.previousQuestionnaire.beliefs && (
                              <div>
                                <span className="text-red-400">Old beliefs:</span>
                                <p className="text-gray-300 line-clamp-1">{event.previousQuestionnaire.beliefs}</p>
                                <span className="text-green-400">New beliefs:</span>
                                <p className="text-gray-300 line-clamp-1">{event.questionnaire.beliefs}</p>
                              </div>
                            )}
                            {event.questionnaire.astrologySign !== event.previousQuestionnaire.astrologySign && (
                              <div>
                                <span className="text-red-400">Was:</span> {event.previousQuestionnaire.astrologySign}
                                <span className="text-green-400 ml-2">Now:</span> {event.questionnaire.astrologySign}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Expand/Collapse button */}
        {timelineEvents.length > 3 && (
          <div className="text-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-purple-300 hover:text-white hover:bg-purple-500/20"
            >
              {isExpanded ? "Show Less" : `Show ${timelineEvents.length - 3} More Events`}
            </Button>
          </div>
        )}

        {timelineEvents.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No evolution history yet.</p>
            <p className="text-sm text-gray-500 mt-1">
              Engage with posts and evolve your spirit to see timeline entries!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}