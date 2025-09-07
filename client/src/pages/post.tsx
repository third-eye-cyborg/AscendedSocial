import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { initiateAuth } from "@/utils/auth";

export default function Post() {
  const { postId } = useParams();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: post, isLoading, error } = useQuery({
    queryKey: [`/api/posts/${postId}`],
    enabled: !!postId,
  });

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Card className="bg-cosmic-light border border-primary/30">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
              <p className="text-white/70 mb-6">Please sign in to view this post</p>
              <Button 
                onClick={() => initiateAuth()}
                className="bg-primary hover:bg-primary/80"
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-6 pb-20 sm:pb-6">
          {/* Back Button Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-10 w-20" />
          </div>
          
          {/* Post Skeleton */}
          <Card className="bg-cosmic-light rounded-xl border-2 border-primary/20">
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-32 w-full mb-4" />
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-8 w-12" />
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/')}
              className="text-white hover:text-primary"
              data-testid="button-back-to-home"
            >
              ← Back to Home
            </Button>
          </div>
          
          <Card className="bg-cosmic-light border border-primary/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-red-400 text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Post Not Found</h2>
              <p className="text-white/70 mb-6">
                This post may have been removed or you don't have permission to view it.
              </p>
              <Button 
                onClick={() => setLocation('/')}
                className="bg-primary hover:bg-primary/80"
                data-testid="button-return-home"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20 sm:pb-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="text-white hover:text-primary transition-colors bg-cosmic-light/50 hover:bg-cosmic-light/70 border border-primary/20"
            data-testid="button-back-to-home"
          >
            ← Back to Home
          </Button>
        </div>
        
        {/* Post Content */}
        <div className="animate-fade-in">
          <PostCard 
            post={post as any}
          />
        </div>
      </div>
    </Layout>
  );
}