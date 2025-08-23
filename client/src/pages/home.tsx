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
import { Sparkles, Users, Eye, ArrowRight } from "lucide-react";

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
      <div className="max-w-2xl mx-auto px-4 py-6 xl:px-6 2xl:px-4">
        {/* Featured: Starmap Visualizer */}
        <Card className="bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-black/60 border-2 border-purple-400/30 mb-6 hover-lift overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-purple-400/20 to-transparent rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-purple-400 animate-pulse" />
                    Explore the Spiritual Cosmos
                  </h3>
                  <p className="text-purple-200 text-sm mb-4">
                    Journey through the mystical starmap where souls appear as glowing stars, 
                    clustering by chakra energy and spiritual connections in a breathtaking 3D universe.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-purple-600/30 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-300" />
                  </div>
                  <div className="text-xs text-purple-300">Cosmic Starfield</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-green-600/30 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-300" />
                  </div>
                  <div className="text-xs text-green-300">Connection Web</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-blue-600/30 rounded-full flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-300" />
                  </div>
                  <div className="text-xs text-blue-300">Soul Discovery</div>
                </div>
              </div>

              <Link href="/starmap">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Enter the Starmap
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Post Creation */}
        <CreatePost />

        {/* Posts Feed */}
        <div className="space-y-6">
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
                <i className="fas fa-feather text-primary text-2xl"></i>
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
