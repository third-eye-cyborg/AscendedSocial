import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function OracleSidebar() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: dailyReading, isLoading: readingLoading } = useQuery({
    queryKey: ["/api/readings/daily"],
    enabled: !!user,
  });

  const { data: recommendations, isLoading: recsLoading } = useQuery({
    queryKey: ["/api/oracle/recommendations"],
    enabled: !!user,
  });

  // Mutation to generate new daily reading
  const newReadingMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/readings/daily");
      if (!response.ok) {
        throw new Error('Failed to generate new reading');
      }
      const newReading = await response.json();
      // Immediately update the cache with new data
      queryClient.setQueryData(["/api/readings/daily"], newReading);
      return newReading;
    },
    onError: (error) => {
      console.error('Failed to generate new reading:', error);
    },
  });

  // Mutation to refresh oracle recommendations
  const refreshOracleMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/oracle/recommendations");
      if (!response.ok) {
        throw new Error('Failed to refresh oracle recommendations');
      }
      const newRecommendations = await response.json();
      // Immediately update the cache with new data
      queryClient.setQueryData(["/api/oracle/recommendations"], newRecommendations);
      return newRecommendations;
    },
    onError: (error) => {
      console.error('Failed to refresh oracle recommendations:', error);
    },
  });

  if (!user) return null;

  return (
    <aside className="w-80 fixed right-0 top-16 h-[calc(100vh-4rem)] bg-cosmic-light/50 border-l border-primary/30 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent z-40">
      {/* Daily Oracle Reading */}
      <Card className="bg-slate-900 border border-slate-700 shadow-lg rounded-xl mb-6 hover-lift animate-scale-in">
        <CardHeader>
          <CardTitle className="font-display font-semibold text-accent-light flex items-center">
            <i className="fas fa-crystal-ball mr-2 animate-pulse"></i>
            Daily Oracle Reading
          </CardTitle>
        </CardHeader>
        <CardContent>
          {readingLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : dailyReading ? (
            <>
              <div className="mb-4">
                <div className="w-full h-32 bg-cosmic rounded-lg flex items-center justify-center border border-primary/30">
                  <i className="fas fa-moon text-4xl text-accent-light animate-gentle-pulse"></i>
                </div>
              </div>

              <div 
                className="text-sm text-white leading-relaxed mb-3"
                data-testid="text-daily-reading"
              >
                {(dailyReading as any)?.content}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span data-testid="text-reading-title">
                  {(dailyReading as any)?.metadata?.title || 'Daily Wisdom'}
                </span>
                <span>Today</span>
              </div>

              <Button 
                className="w-full mt-3 bg-primary/30 hover:bg-primary/50 text-white font-medium transition-colors duration-200"
                onClick={() => {
                  console.log('Get New Reading button clicked');
                  newReadingMutation.mutate();
                }}
                disabled={newReadingMutation.isPending}
                data-testid="button-new-reading"
              >
                {newReadingMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner animate-spin mr-2"></i>
                    Channeling...
                  </>
                ) : (
                  "Get New Reading"
                )}
              </Button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-secondary text-sm">No reading available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* The Oracle Recommendations */}
      <Card className="bg-slate-900 border border-slate-700 shadow-lg rounded-xl mb-6 hover-lift animate-scale-in">
        <CardHeader>
          <CardTitle className="font-display font-semibold text-primary flex items-center">
            <i className="fas fa-eye mr-2"></i>
            The Oracle Suggests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recommendations && Array.isArray(recommendations) && recommendations.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
              {(recommendations as any[]).map((rec: any, index: number) => (
                <div 
                  key={index}
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-cosmic-light/50 cursor-pointer transition-colors"
                  data-testid={`recommendation-${index}`}
                >
                  <div className="sigil-container w-8 h-8 rounded-full p-0.5 flex-shrink-0">
                    <div className="w-full h-full bg-cosmic rounded-full flex items-center justify-center">
                      <i className="fas fa-mandala text-white text-xs"></i>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {rec.type} • {rec.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-secondary text-sm">No recommendations available</p>
            </div>
          )}

          <Button 
            className="w-full mt-3 bg-primary/20 hover:bg-primary/30 text-white border border-primary/40 hover:border-primary/60 text-sm font-medium transition-all duration-200 rounded-lg"
            onClick={() => {
              console.log('Refresh Oracle button clicked');
              refreshOracleMutation.mutate();
            }}
            disabled={refreshOracleMutation.isPending}
            data-testid="button-refresh-oracle"
          >
            <i className={`fas ${refreshOracleMutation.isPending ? 'fa-spinner animate-spin' : 'fa-sync-alt'} mr-2 text-primary`}></i>
            {refreshOracleMutation.isPending ? 'Channeling...' : 'Refresh Oracle'}
          </Button>
        </CardContent>
      </Card>

      {/* Trending Chakras */}
      <Card className="bg-cosmic-light rounded-xl mb-6 border border-primary/30">
        <CardHeader>
          <CardTitle className="font-display font-semibold text-white">Trending Chakras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-white">Heart Chakra</span>
              </div>
              <span className="text-xs text-gray-300">847 posts</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span className="text-sm text-white">Crown Chakra</span>
              </div>
              <span className="text-xs text-gray-300">623 posts</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-white">Throat Chakra</span>
              </div>
              <span className="text-xs text-gray-300">591 posts</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-indigo-700"></div>
                <span className="text-sm text-white">Third Eye</span>
              </div>
              <span className="text-xs text-gray-300">472 posts</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-cosmic-light rounded-xl border border-primary/30">
        <CardHeader>
          <CardTitle className="font-display font-semibold text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start px-3 py-2 text-white hover:text-accent-light hover:bg-cosmic-light"
              onClick={() => {
                // Scroll to the create post form and focus on the Quill editor
                const createPostForm = document.querySelector('[data-testid="create-post-avatar"]')?.closest('.bg-gradient-to-br') as HTMLElement;
                if (createPostForm) {
                  createPostForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  
                  // Try to focus on the Quill editor after a short delay
                  setTimeout(() => {
                    const quillEditor = createPostForm.querySelector('.ql-editor') as HTMLElement;
                    if (quillEditor) {
                      quillEditor.focus();
                    }
                  }, 500);
                }
              }}
              data-testid="button-create-post"
            >
              <i className="fas fa-feather mr-2 text-accent-light"></i>
              Create Post
            </Button>
            
            <Link href="/community">
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-white hover:text-accent-light hover:bg-cosmic-light"
                data-testid="button-explore-users"
              >
                <i className="fas fa-users mr-2 text-primary"></i>
                Find Spiritual Friends
              </Button>
            </Link>
            
            <Link href="/community">
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-white hover:text-accent-light hover:bg-cosmic-light"
                data-testid="button-join-community"
              >
                <i className="fas fa-circle mr-2 text-green-400"></i>
                Join Sacred Circle
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              className="w-full justify-start px-3 py-2 text-white hover:text-accent-light hover:bg-cosmic-light"
              onClick={() => {
                // Show daily affirmation modal or navigate to affirmation page
                const affirmations = [
                  'I am aligned with my highest purpose and spiritual truth.',
                  'Divine energy flows through me, bringing peace and clarity.',
                  'I trust the universe to guide me on my spiritual journey.',
                  'My chakras are balanced, and my energy radiates love.',
                  'I am connected to the infinite wisdom within me.'
                ];
                const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
                alert(`✨ Daily Affirmation ✨\n\n${randomAffirmation}`);
              }}
              data-testid="button-daily-affirmation"
            >
              <i className="fas fa-heart mr-2 text-pink-400"></i>
              Daily Affirmation
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
