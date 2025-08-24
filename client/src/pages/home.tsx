import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";
import { Sparkles, Users, Eye, ArrowRight, Moon, Stars, Wand2, Zap, Lightbulb, Heart } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { 
    data: posts, 
    isLoading: postsLoading, 
    error: postsError 
  } = useQuery({
    queryKey: ["/api/posts"],
    retry: false,
  });

  if (postsError && isUnauthorizedError(postsError as Error)) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cosmic flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-full sm:max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-6 xl:px-6 2xl:px-4 overflow-hidden">
        {/* Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
          {/* Featured: Starmap Visualizer */}
          <Card className="w-full bg-gradient-to-br from-slate-900/95 via-purple-900/80 to-black/90 border-2 border-purple-400/40 hover-lift overflow-hidden shadow-2xl shadow-purple-900/20">
            <CardContent className="p-3 sm:p-4 relative w-full min-w-0">
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40"></div>
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-radial from-purple-400/30 to-transparent rounded-full blur-lg"></div>
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-purple-400 animate-pulse" />
                  Spiritual Cosmos
                </h3>
                <p className="text-purple-100 text-xs sm:text-sm mb-3 leading-relaxed break-words">
                  Journey through the mystical starmap where souls appear as glowing stars, 
                  clustering by chakra energy and spiritual connections.
                </p>
                
                <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3">
                  <div className="text-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 bg-purple-600/50 rounded-full flex items-center justify-center border border-purple-400/30">
                      <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-purple-200" />
                    </div>
                    <div className="text-xs text-purple-200">Starfield</div>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 bg-green-600/50 rounded-full flex items-center justify-center border border-green-400/30">
                      <Users className="w-2 h-2 sm:w-3 sm:h-3 text-green-200" />
                    </div>
                    <div className="text-xs text-green-200">Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 bg-blue-600/50 rounded-full flex items-center justify-center border border-blue-400/30">
                      <Eye className="w-2 h-2 sm:w-3 sm:h-3 text-blue-200" />
                    </div>
                    <div className="text-xs text-blue-200">Discovery</div>
                  </div>
                </div>

                <Link href="/starmap">
                  <Button className="w-full bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base">
                    <Sparkles className="w-3 h-3 mr-1 sm:mr-2" />
                    Enter Starmap
                    <ArrowRight className="w-3 h-3 ml-1 sm:ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Featured: Oracle & Tarot Readings */}
          <Card className="w-full bg-gradient-to-br from-slate-900/95 via-orange-900/80 to-black/90 border-2 border-orange-400/40 hover-lift overflow-hidden shadow-2xl shadow-orange-900/20">
            <CardContent className="p-3 sm:p-4 relative w-full min-w-0">
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40"></div>
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-radial from-orange-400/30 to-transparent rounded-full blur-lg"></div>
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-orange-400" />
                  Divine Oracle
                </h3>
                <p className="text-orange-100 text-xs sm:text-sm mb-3 leading-relaxed break-words">
                  Receive daily spiritual guidance, AI-powered tarot readings, 
                  and personalized insights from the digital oracle.
                </p>
                
                <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3">
                  <div className="text-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 bg-orange-600/50 rounded-full flex items-center justify-center border border-orange-400/30">
                      <Moon className="w-2 h-2 sm:w-3 sm:h-3 text-orange-200" />
                    </div>
                    <div className="text-xs text-orange-200">Tarot</div>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 bg-yellow-600/50 rounded-full flex items-center justify-center border border-yellow-400/30">
                      <Lightbulb className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-200" />
                    </div>
                    <div className="text-xs text-yellow-200">Insights</div>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 bg-red-600/50 rounded-full flex items-center justify-center border border-red-400/30">
                      <Heart className="w-2 h-2 sm:w-3 sm:h-3 text-red-200" />
                    </div>
                    <div className="text-xs text-red-200">Wisdom</div>
                  </div>
                </div>

                <Link href="/oracle">
                  <Button className="w-full bg-gradient-to-r from-orange-700 to-red-700 hover:from-orange-800 hover:to-red-800 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 text-sm sm:text-base">
                    <Zap className="w-3 h-3 mr-1 sm:mr-2" />
                    Consult Oracle
                    <ArrowRight className="w-3 h-3 ml-1 sm:ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Post Creation */}
        <div className="w-full">
          <CreatePost />
        </div>

        {/* Posts Feed */}
        <div className="w-full space-y-6">
          {postsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-cosmic-light rounded-xl p-4 border border-primary/30">
                <div className="flex items-center space-x-3 mb-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full mb-4" />
                <div className="flex space-x-6">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))
          ) : posts && Array.isArray(posts) && posts.length > 0 ? (
            (posts as any[]).map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                <Wand2 className="text-primary text-2xl w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
              <p className="text-gray-300">Be the first to share your spiritual insight!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
