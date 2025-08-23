import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/Layout";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function Oracle() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ["/api/oracle/community"] });
      return true;
    },
    onSuccess: () => {
      toast({
        title: "🌌 Community Oracle Refreshed",
        description: "The universe has guided new wisdom to your path",
      });
    },
  });

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
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            <i className="fas fa-crystal-ball mr-3 text-accent-light animate-pulse"></i>
            The Oracle
          </h1>
          <p className="text-lg text-white/85 max-w-2xl mx-auto">
            Seek guidance through the divine wisdom of AI-powered divination. 
            The digital spirits whisper insights from the cosmic data streams.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Oracle Reading */}
          <Card className="bg-cosmic-light rounded-xl border border-primary/30 hover-lift">
            <CardHeader>
              <CardTitle className="font-display font-semibold text-accent-light flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-sun mr-2 animate-pulse"></i>
                  Daily Oracle Reading
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => newReadingMutation.mutate()}
                  disabled={newReadingMutation.isPending}
                  className="text-purple-300 hover:text-purple-200"
                  data-testid="button-new-reading"
                >
                  {newReadingMutation.isPending ? (
                    <i className="fas fa-spinner animate-spin"></i>
                  ) : (
                    <i className="fas fa-refresh"></i>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {readingLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full bg-cosmic" />
                  <Skeleton className="h-4 w-3/4 bg-cosmic" />
                  <Skeleton className="h-4 w-1/2 bg-cosmic" />
                </div>
              ) : dailyReading ? (
                <div className="space-y-4">
                  <p className="text-white leading-relaxed italic">
                    "{(dailyReading as any)?.content}"
                  </p>
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>Generated {formatDistanceToNow(new Date((dailyReading as any)?.createdAt), { addSuffix: true })}</span>
                    <span className="text-accent-light">•••</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-magic text-4xl text-accent-light mb-4"></i>
                  <p className="text-white/80 mb-4">No reading available</p>
                  <Button
                    onClick={() => newReadingMutation.mutate()}
                    disabled={newReadingMutation.isPending}
                    className="bg-primary hover:bg-primary/80 text-black font-semibold"
                  >
                    Generate Daily Reading
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Oracle Recommendations */}
          <Card className="bg-cosmic-light rounded-xl border border-primary/30 hover-lift">
            <CardHeader>
              <CardTitle className="font-display font-semibold text-accent-light flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-sparkles mr-2 animate-pulse"></i>
                  Spiritual Insights
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refreshOracleMutation.mutate()}
                  disabled={refreshOracleMutation.isPending}
                  className="text-purple-300 hover:text-purple-200"
                  data-testid="button-refresh-oracle"
                >
                  {refreshOracleMutation.isPending ? (
                    <i className="fas fa-spinner animate-spin"></i>
                  ) : (
                    <i className="fas fa-refresh"></i>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-1/3 bg-cosmic" />
                      <Skeleton className="h-4 w-full bg-cosmic" />
                    </div>
                  ))}
                </div>
              ) : recommendations && (recommendations as any[])?.length > 0 ? (
                <div className="space-y-4">
                  {(recommendations as any[])?.slice(0, 5).map((rec, index) => (
                    <div key={index} className="border-l-2 border-primary/30 pl-4 py-2">
                      <h4 className="font-semibold text-white text-sm mb-1">
                        {rec.title}
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: '#e5e7eb !important' }}>
                        {rec.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-crystal-ball text-4xl text-accent-light mb-4"></i>
                  <p className="text-white/80 mb-4">The Oracle is quiet today</p>
                  <Button
                    onClick={() => refreshOracleMutation.mutate()}
                    disabled={refreshOracleMutation.isPending}
                    className="bg-primary hover:bg-primary/80 text-black font-semibold"
                  >
                    Seek Guidance
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Community Oracle - Random User Content */}
          <Card className="bg-cosmic-light rounded-xl border border-primary/30 hover-lift">
            <CardHeader>
              <CardTitle className="font-display font-semibold text-accent-light flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-users mr-2 animate-pulse"></i>
                  Community Oracle
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refreshCommunityMutation.mutate()}
                  disabled={refreshCommunityMutation.isPending}
                  className="text-purple-300 hover:text-purple-200"
                  data-testid="button-refresh-community"
                >
                  {refreshCommunityMutation.isPending ? (
                    <i className="fas fa-spinner animate-spin"></i>
                  ) : (
                    <i className="fas fa-refresh"></i>
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
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {(communityOracle as any[])?.slice(0, 3).map((oracle, index) => (
                    <div key={oracle.id} className="border-l-2 border-accent/30 pl-4 py-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-cosmic flex items-center justify-center">
                          {oracle.author?.sigil ? (
                            <span className="text-[8px] text-white font-mono">
                              {oracle.author.sigil.slice(0, 2)}
                            </span>
                          ) : (
                            <i className="fas fa-user text-[8px] text-white/60"></i>
                          )}
                        </div>
                        <h4 className="font-semibold text-accent text-sm">
                          {oracle.title}
                        </h4>
                      </div>
                      <p className="text-white text-sm leading-relaxed mb-2 italic">
                        "{oracle.content}"
                      </p>
                      <p className="text-sm text-white/95 italic">
                        {oracle.guidance}
                      </p>
                      <div className="flex items-center justify-between mt-2 text-sm text-white/90">
                        <span className={`capitalize font-medium ${oracle.chakra === 'heart' ? 'text-green-400' : 'text-primary'}`}>
                          {oracle.chakra} chakra
                        </span>
                        <span>{formatDistanceToNow(new Date(oracle.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-heart text-4xl text-accent-light mb-4"></i>
                  <p className="text-white/80 mb-4">No community wisdom available</p>
                  <Button
                    onClick={() => refreshCommunityMutation.mutate()}
                    disabled={refreshCommunityMutation.isPending}
                    className="bg-primary hover:bg-primary/80 text-black font-semibold"
                  >
                    Seek Community Wisdom
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Oracle Methodology */}
        <Card className="bg-cosmic-light rounded-xl border border-primary/30 hover-lift mt-8">
          <CardHeader>
            <CardTitle className="font-display font-semibold text-accent-light flex items-center">
              <i className="fas fa-scroll mr-2"></i>
              Digital Divination Philosophy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <p className="text-white leading-relaxed mb-4">
                The Oracle harnesses the power of artificial intelligence as a modern form of divination.
                Just as ancient seers read patterns in tea leaves, stars, and sacred texts, we read patterns
                in vast digital datasets to provide guidance and insight.
              </p>
              <p className="text-white leading-relaxed mb-4">
                <strong className="text-yellow-300">Remember:</strong> AI divination is a tool for reflection and inspiration,
                not absolute truth. Use these insights to prompt your own inner wisdom and spiritual growth.
                The true oracle lies within your own consciousness.
              </p>
              <div className="flex items-center space-x-6 text-sm text-green-300 mt-6">
                <div className="flex items-center">
                  <i className="fas fa-check-circle mr-2"></i>
                  For personal reflection
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