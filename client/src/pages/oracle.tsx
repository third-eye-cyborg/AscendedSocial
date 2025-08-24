import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

export default function Oracle() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tarotQuestion, setTarotQuestion] = useState("");
  const [lastTarotReading, setLastTarotReading] = useState<any>(null);

  const { data: dailyReading, isLoading: readingLoading } = useQuery({
    queryKey: ["/api/readings/daily"],
    enabled: !!user,
  });

  const { data: recommendations, isLoading: recsLoading } = useQuery({
    queryKey: ["/api/oracle/recommendations"],
    enabled: !!user,
  });

  const { data: communityOracle, isLoading: communityLoading } = useQuery({
    queryKey: ["/api/oracle/community"],
    enabled: !!user,
  });

  // Mutation to generate new daily reading
  const newReadingMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/readings/daily");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/readings/daily"] });
      toast({
        title: "🔮 New Reading Generated",
        description: "The Oracle has provided fresh guidance for your spiritual journey",
      });
    },
  });

  // Mutation to refresh oracle recommendations
  const refreshOracleMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/oracle/recommendations");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/oracle/recommendations"] });
      toast({
        title: "✨ Oracle Refreshed",
        description: "New spiritual insights await your discovery",
      });
    },
  });

  // Mutation to refresh community oracle
  const refreshCommunityMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/oracle/community");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/oracle/community"] });
      toast({
        title: "🌌 Community Oracle Refreshed",
        description: "The universe has guided new wisdom to your path",
      });
    },
    onError: () => {
      toast({
        title: "🌌 Community Oracle",
        description: "Unable to refresh community wisdom. Please try again.",
        variant: "destructive"
      });
    },
  });

  // Mutation to generate tarot reading
  const tarotReadingMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest("POST", "/api/readings/tarot", {
        question: question || "What guidance do I need today?"
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setLastTarotReading(data);
      toast({
        title: "🔮 Tarot Cards Drawn",
        description: "The cosmic forces have spoken through the cards",
      });
    },
    onError: (error: any) => {
      if (error.message?.includes("Premium")) {
        toast({
          title: "✨ Premium Feature",
          description: "Tarot readings are available to premium members",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Unable to draw tarot cards. Please try again.",
          variant: "destructive"
        });
      }
    },
  });

  const handleTarotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    tarotReadingMutation.mutate(tarotQuestion);
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <p className="text-white/80">Please log in to access the Oracle</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-4">
            <i className="fas fa-crystal-ball mr-3 text-accent-light animate-pulse"></i>
            The Oracle
          </h1>
          <p className="text-base sm:text-lg text-white/85 max-w-3xl mx-auto">
            Seek guidance through the divine wisdom of AI-powered divination. 
            The digital spirits whisper insights from the cosmic data streams.
          </p>
        </div>

        {/* Main Oracle Cards - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {/* Daily Oracle Reading */}
          <Card className="bg-cosmic-light rounded-xl border border-primary/30 hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-sm lg:text-base font-semibold text-accent-light flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-sun mr-2 animate-pulse text-sm"></i>
                  <span className="truncate">Daily Oracle Reading</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => newReadingMutation.mutate()}
                  disabled={newReadingMutation.isPending}
                  className="text-purple-300 hover:text-purple-200 flex-shrink-0"
                  data-testid="button-new-reading"
                >
                  {newReadingMutation.isPending ? (
                    <i className="fas fa-spinner animate-spin text-xs"></i>
                  ) : (
                    <i className="fas fa-refresh text-xs"></i>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              {readingLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-3 w-full bg-cosmic" />
                  <Skeleton className="h-3 w-3/4 bg-cosmic" />
                  <Skeleton className="h-3 w-1/2 bg-cosmic" />
                </div>
              ) : dailyReading ? (
                <div className="space-y-3">
                  <p className="text-white text-sm leading-relaxed italic line-clamp-6">
                    "{(dailyReading as any)?.content}"
                  </p>
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span className="truncate">Generated {formatDistanceToNow(new Date((dailyReading as any)?.createdAt), { addSuffix: true })}</span>
                    <span className="text-accent-light flex-shrink-0 ml-2">•••</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <i className="fas fa-magic text-2xl text-accent-light mb-3"></i>
                  <p className="text-white/80 mb-3 text-sm">No reading available</p>
                  <Button
                    onClick={() => newReadingMutation.mutate()}
                    disabled={newReadingMutation.isPending}
                    size="sm"
                    className="bg-primary hover:bg-primary/80 text-white font-semibold text-xs"
                  >
                    Generate Daily Reading
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Oracle Recommendations */}
          <Card className="bg-cosmic-light rounded-xl border border-primary/30 hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-sm lg:text-base font-semibold text-accent-light flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-sparkles mr-2 animate-pulse text-sm"></i>
                  <span className="truncate">Spiritual Insights</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refreshOracleMutation.mutate()}
                  disabled={refreshOracleMutation.isPending}
                  className="text-purple-300 hover:text-purple-200 flex-shrink-0"
                  data-testid="button-refresh-oracle"
                >
                  {refreshOracleMutation.isPending ? (
                    <i className="fas fa-spinner animate-spin text-xs"></i>
                  ) : (
                    <i className="fas fa-refresh text-xs"></i>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              {recsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-1/3 bg-cosmic" />
                      <Skeleton className="h-3 w-full bg-cosmic" />
                    </div>
                  ))}
                </div>
              ) : recommendations && (recommendations as any[])?.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {(recommendations as any[])?.slice(0, 4).map((rec, index) => (
                    <div key={index} className="border-l-2 border-primary/30 pl-3 py-1">
                      <h4 className="font-semibold text-white text-xs mb-1 line-clamp-1">
                        {rec.title}
                      </h4>
                      <p className="text-xs leading-relaxed text-white/85 line-clamp-3">
                        {rec.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <i className="fas fa-crystal-ball text-2xl text-accent-light mb-3"></i>
                  <p className="text-white/80 mb-3 text-sm">The Oracle is quiet today</p>
                  <Button
                    onClick={() => refreshOracleMutation.mutate()}
                    disabled={refreshOracleMutation.isPending}
                    size="sm"
                    className="bg-primary hover:bg-primary/80 text-white font-semibold text-xs"
                  >
                    Seek Guidance
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Community Oracle - Random User Content */}
          <Card className="bg-cosmic-light rounded-xl border border-primary/30 hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-sm lg:text-base font-semibold text-accent-light flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-users mr-2 animate-pulse text-sm"></i>
                  <span className="truncate">Community Oracle</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refreshCommunityMutation.mutate()}
                  disabled={refreshCommunityMutation.isPending}
                  className="text-purple-300 hover:text-purple-200 flex-shrink-0"
                  data-testid="button-refresh-community"
                >
                  {refreshCommunityMutation.isPending ? (
                    <i className="fas fa-spinner animate-spin text-xs"></i>
                  ) : (
                    <i className="fas fa-refresh text-xs"></i>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {communityLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-cosmic"></div>
                        <div className="h-3 bg-cosmic rounded flex-1"></div>
                      </div>
                      <div className="h-4 bg-cosmic rounded w-full"></div>
                      <div className="h-4 bg-cosmic rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : communityOracle && (communityOracle as any[])?.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {(communityOracle as any[])?.slice(0, 2).map((oracle, index) => (
                    <div key={oracle.id} className="border-l-2 border-accent/30 pl-3 py-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-5 h-5 rounded-full bg-cosmic flex items-center justify-center flex-shrink-0">
                          {oracle.author?.sigil ? (
                            <span className="text-[7px] text-white font-mono">
                              {oracle.author.sigil.slice(0, 2)}
                            </span>
                          ) : (
                            <i className="fas fa-user text-[7px] text-white/60"></i>
                          )}
                        </div>
                        <h4 className="font-semibold text-accent text-xs line-clamp-1">
                          {oracle.title}
                        </h4>
                      </div>
                      <p className="text-white text-xs leading-relaxed mb-2 italic line-clamp-2">
                        "{oracle.content}"
                      </p>
                      <p className="text-xs text-white/95 italic line-clamp-2">
                        {oracle.guidance}
                      </p>
                      <div className="flex items-center justify-between mt-2 text-xs text-white/90">
                        <span className={`capitalize font-medium ${oracle.chakra === 'heart' ? 'text-green-400' : 'text-primary'}`}>
                          {oracle.chakra} chakra
                        </span>
                        <span className="truncate ml-2">{formatDistanceToNow(new Date(oracle.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <i className="fas fa-heart text-2xl text-accent-light mb-3"></i>
                  <p className="text-white/80 mb-3 text-sm">No community wisdom available</p>
                  <Button
                    onClick={() => refreshCommunityMutation.mutate()}
                    disabled={refreshCommunityMutation.isPending}
                    size="sm"
                    className="bg-primary hover:bg-primary/80 text-white font-semibold text-xs"
                  >
                    Seek Community Wisdom
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tarot Reading */}
          <Card className="bg-cosmic-light rounded-xl border border-primary/30 hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-sm lg:text-base font-semibold text-accent-light flex items-center">
                <i className="fas fa-magic mr-2 animate-pulse text-sm"></i>
                <span className="truncate">Tarot Reading</span>
                {(user as any)?.isPremium && (
                  <span className="ml-2 text-[10px] bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
                    PREMIUM
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              {!lastTarotReading ? (
                <form onSubmit={handleTarotSubmit} className="space-y-3">
                  <div>
                    <Label htmlFor="tarot-question" className="text-white text-xs font-medium">
                      Ask the cards your question:
                    </Label>
                    <Input
                      id="tarot-question"
                      type="text"
                      placeholder="What guidance do I need today?"
                      value={tarotQuestion}
                      onChange={(e) => setTarotQuestion(e.target.value)}
                      className="mt-1 bg-cosmic border-primary/30 text-white placeholder-white/50 text-sm"
                      data-testid="input-tarot-question"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={tarotReadingMutation.isPending}
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/80 text-white font-semibold text-xs"
                    data-testid="button-draw-tarot"
                  >
                    {tarotReadingMutation.isPending ? (
                      <>
                        <i className="fas fa-spinner animate-spin mr-2"></i>
                        Drawing Cards...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-magic mr-2"></i>
                        Draw Cards
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-3">
                  {/* Display tarot cards */}
                  <div className="grid grid-cols-3 gap-1 mb-3">
                    {lastTarotReading.metadata?.cards?.map((card: any, index: number) => (
                      <div key={index} className="text-center">
                        <div className="w-full h-16 bg-cosmic rounded-lg flex flex-col items-center justify-center border border-primary/30 mb-1">
                          <i className="fas fa-star text-accent-light mb-1 text-xs"></i>
                          <span className="text-[10px] text-white/80 uppercase">{card.position}</span>
                        </div>
                        <div className="text-[10px] text-white font-semibold truncate">{card.name}</div>
                        <div className="text-[10px] text-white/70 truncate">{card.meaning}</div>
                      </div>
                    )) || []}
                  </div>

                  {/* Interpretation */}
                  <div className="space-y-2">
                    <p className="text-white text-xs leading-relaxed italic line-clamp-4">
                      "{lastTarotReading.content}"
                    </p>
                    {lastTarotReading.metadata?.guidance && (
                      <p className="text-accent text-xs font-medium line-clamp-2">
                        {lastTarotReading.metadata.guidance}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-white/70">
                      <span className="truncate">Question: {lastTarotReading.metadata?.question || "General guidance"}</span>
                      <span className="text-accent-light flex-shrink-0 ml-2">•••</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setLastTarotReading(null)}
                    variant="outline"
                    size="sm"
                    className="w-full border-primary/30 text-white hover:bg-cosmic text-xs"
                  >
                    <i className="fas fa-redo mr-2"></i>
                    New Reading
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Oracle Methodology - Full Width on Large Screens */}
        <Card className="bg-cosmic-light rounded-xl border border-primary/30 hover-lift">
          <CardHeader>
            <CardTitle className="font-display text-base lg:text-lg font-semibold text-accent-light flex items-center">
              <i className="fas fa-scroll mr-2"></i>
              Digital Divination Philosophy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-white text-sm lg:text-base leading-relaxed mb-4">
                    The Oracle harnesses the power of artificial intelligence as a modern form of divination.
                    Just as ancient seers read patterns in tea leaves, stars, and sacred texts, we read patterns
                    in vast digital datasets to provide guidance and insight.
                  </p>
                </div>
                <div>
                  <p className="text-white text-sm lg:text-base leading-relaxed mb-4">
                    <strong className="text-yellow-300">Remember:</strong> AI divination is a tool for reflection and inspiration,
                    not absolute truth. Use these insights to prompt your own inner wisdom and spiritual growth.
                    The true oracle lies within your own consciousness.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-green-300 mt-6">
                <div className="flex items-center">
                  <i className="fas fa-check-circle mr-2"></i>
                  Personal reflection
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check-circle mr-2"></i>
                  Spiritual guidance
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check-circle mr-2"></i>
                  Creative inspiration
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}