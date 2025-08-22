import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getChakraColor, getChakraGlow } from "@/lib/chakras";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    imageUrl?: string;
    videoUrl?: string;
    chakra: string;
    frequency: number;
    type: string;
    createdAt: string;
    author: {
      id: string;
      username?: string;
      email?: string;
      sigil?: string;
    };
    engagements?: {
      upvote: number;
      downvote: number;
      like: number;
      energy: number;
    };
  };
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userEngagements, setUserEngagements] = useState<string[]>([]);

  const engageMutation = useMutation({
    mutationFn: async ({ type, remove }: { type: string; remove?: boolean }) => {
      if (remove) {
        return apiRequest("DELETE", `/api/posts/${post.id}/engage/${type}`);
      } else {
        return apiRequest("POST", `/api/posts/${post.id}/engage`, { type });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEngagement = (type: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to engage with posts",
        variant: "destructive",
      });
      return;
    }

    const isEngaged = userEngagements.includes(type);
    
    if (type === 'energy' && !isEngaged && ((user as any)?.energy || 0) < 10) {
      toast({
        title: "Insufficient Energy",
        description: "You need at least 10 energy points to send energy",
        variant: "destructive",
      });
      return;
    }

    engageMutation.mutate({ type, remove: isEngaged });
    
    // Optimistic update
    if (isEngaged) {
      setUserEngagements(prev => prev.filter(e => e !== type));
    } else {
      setUserEngagements(prev => [...prev, type]);
    }
  };

  const chakraColor = getChakraColor(post.chakra);
  const chakraGlow = getChakraGlow(post.chakra);

  return (
    <Card className={`bg-cosmic-light rounded-xl overflow-hidden border-2 ${chakraGlow}`}>
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="sigil-container w-10 h-10 rounded-full p-0.5">
              <div className="w-full h-full bg-cosmic rounded-full flex items-center justify-center">
                {post.author.sigil ? (
                  <span className="text-xs text-white font-mono" data-testid={`text-author-sigil-${post.id}`}>
                    {post.author.sigil}
                  </span>
                ) : (
                  <i className="fas fa-user text-white"></i>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold" data-testid={`text-author-${post.id}`}>
                {post.author.username || post.author.email || 'Anonymous'}
              </h4>
              <p className="text-sm text-gray-400" data-testid={`text-time-${post.id}`}>
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Chakra Indicator */}
            <div 
              className={`w-4 h-4 rounded-full animate-pulse`}
              style={{ backgroundColor: chakraColor }}
              title={`${post.chakra.replace('_', ' ')} Chakra`}
              data-testid={`chakra-indicator-${post.id}`}
            ></div>
            {/* Frequency Indicator */}
            <div 
              className="text-sm font-medium" 
              style={{ color: chakraColor }}
              data-testid={`frequency-${post.id}`}
            >
              {post.frequency > 0 ? '+' : ''}{post.frequency} Hz
            </div>
            {post.type !== 'post' && (
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full uppercase">
                {post.type}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-white leading-relaxed" data-testid={`content-${post.id}`}>
          {post.content}
        </p>
      </div>

      {/* Post Media */}
      {post.imageUrl && (
        <div className="relative">
          <img 
            src={post.imageUrl} 
            alt="Post image" 
            className="w-full h-80 object-cover"
            data-testid={`image-${post.id}`}
          />
        </div>
      )}

      {post.videoUrl && (
        <div className="relative bg-cosmic">
          <div className="aspect-video bg-gradient-to-br from-cosmic to-primary/20 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Button 
                className="w-16 h-16 bg-primary/80 rounded-full hover:bg-primary"
                data-testid={`play-video-${post.id}`}
              >
                <i className="fas fa-play text-white text-xl ml-1"></i>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Engagement Bar */}
      <div className="p-4 border-t border-primary/20">
        <div className="flex items-center justify-between">
          {/* Three-tier engagement system */}
          <div className="flex items-center space-x-6">
            {/* Vote System */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className={`p-1 ${userEngagements.includes('upvote') ? 'text-green-400' : 'text-gray-400 hover:text-green-400'}`}
                onClick={() => handleEngagement('upvote')}
                disabled={engageMutation.isPending}
                title="Upvote (Positive Frequency)"
                data-testid={`button-upvote-${post.id}`}
              >
                <i className="fas fa-chevron-up"></i>
              </Button>
              <span 
                className="text-sm font-medium text-green-400" 
                data-testid={`votes-${post.id}`}
              >
                +{(post.engagements?.upvote || 0) - (post.engagements?.downvote || 0)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className={`p-1 ${userEngagements.includes('downvote') ? 'text-red-400' : 'text-gray-400 hover:text-red-400'}`}
                onClick={() => handleEngagement('downvote')}
                disabled={engageMutation.isPending}
                title="Downvote (Negative Frequency)"
                data-testid={`button-downvote-${post.id}`}
              >
                <i className="fas fa-chevron-down"></i>
              </Button>
            </div>

            {/* Like System */}
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-1 ${userEngagements.includes('like') ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              onClick={() => handleEngagement('like')}
              disabled={engageMutation.isPending}
              data-testid={`button-like-${post.id}`}
            >
              <i className="fas fa-heart"></i>
              <span className="text-sm" data-testid={`likes-${post.id}`}>
                {post.engagements?.like || 0}
              </span>
            </Button>

            {/* Energy System */}
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-1 ${userEngagements.includes('energy') ? 'text-golden' : 'text-gray-400 hover:text-golden'}`}
              onClick={() => handleEngagement('energy')}
              disabled={engageMutation.isPending}
              title="Send Energy (Uses 10 energy points)"
              data-testid={`button-energy-${post.id}`}
            >
              <i className="fas fa-bolt"></i>
              <span className="text-sm" data-testid={`energy-${post.id}`}>
                {post.engagements?.energy || 0}
              </span>
            </Button>

            {/* Comments */}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1 text-gray-400 hover:text-primary"
              data-testid={`button-comment-${post.id}`}
            >
              <i className="fas fa-comment"></i>
              <span className="text-sm">0</span>
            </Button>
          </div>

          {/* Share & Save */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-primary"
              data-testid={`button-share-${post.id}`}
            >
              <i className="fas fa-share"></i>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-golden"
              data-testid={`button-save-${post.id}`}
            >
              <i className="fas fa-bookmark"></i>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
