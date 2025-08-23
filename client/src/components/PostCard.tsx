import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getChakraColor, getChakraGlow } from "@/lib/chakras";
import { formatDistanceToNow } from "date-fns";
import { ProfileIcon } from "@/components/ProfileIcon";
import Comments from "./Comments";
import { Zap, Heart, ChevronUp, ChevronDown, MessageCircle, Share2, Bookmark, BookmarkCheck, Settings } from "lucide-react";

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
  const [showComments, setShowComments] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [energyAmount, setEnergyAmount] = useState(10);
  const [energyPopoverOpen, setEnergyPopoverOpen] = useState(false);

  // Fetch user engagement status for this post
  const { data: userEngagementData } = useQuery({
    queryKey: ["/api/posts", post.id, "engage/user"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/posts/${post.id}/engage/user`);
      return response.json();
    },
    enabled: !!user,
  });

  // Set initial engagement state when data is fetched
  useEffect(() => {
    if (userEngagementData?.engagements) {
      setUserEngagements(userEngagementData.engagements);
    }
  }, [userEngagementData]);

  const engageMutation = useMutation({
    mutationFn: async ({ type, remove, energyAmount }: { type: string; remove?: boolean; energyAmount?: number }) => {
      if (remove) {
        return apiRequest("DELETE", `/api/posts/${post.id}/engage/${type}`);
      } else {
        return apiRequest("POST", `/api/posts/${post.id}/engage`, { 
          type, 
          ...(type === 'energy' ? { energyAmount } : {})
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] }); // Refresh user energy
      if (energyPopoverOpen) setEnergyPopoverOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEngagement = (type: string, energyAmountOverride?: number) => {
    if (!user) {
      toast({
        title: "🔮 Mystical Access Required",
        description: "Please enter the spiritual realm to engage with posts",
        variant: "destructive",
      });
      return;
    }

    const isEngaged = userEngagements.includes(type);
    const currentEnergyAmount = energyAmountOverride || energyAmount;
    
    if (type === 'energy' && !isEngaged && ((user as any)?.energy || 0) < currentEnergyAmount) {
      toast({
        title: "⚡ Energy Depleted",
        description: `Your spiritual energy is too low. You need ${currentEnergyAmount} energy points but have ${(user as any)?.energy || 0}.`,
        variant: "destructive",
      });
      return;
    }

    // Visual feedback for successful engagement
    if (!isEngaged) {
      const successMessages = {
        upvote: { title: "✨ Positive Vibrations Sent", description: "Your spiritual approval raises the post's frequency" },
        downvote: { title: "🌊 Constructive Energy Shared", description: "Your feedback helps balance the cosmic harmony" },
        like: { title: "💖 Love Resonance Activated", description: "Your heart chakra connects with this soul" },
        energy: { title: "⚡ Spiritual Energy Transferred", description: `${currentEnergyAmount} energy points sent to amplify this wisdom` }
      };
      
      const message = successMessages[type as keyof typeof successMessages];
      if (message) {
        toast({
          title: message.title,
          description: message.description,
          duration: 3000,
        });
      }
    }

    engageMutation.mutate({ 
      type, 
      remove: isEngaged,
      energyAmount: type === 'energy' ? currentEnergyAmount : undefined
    });
    
    // Optimistic update with mutual exclusion for votes
    if (isEngaged) {
      setUserEngagements(prev => prev.filter(e => e !== type));
    } else {
      setUserEngagements(prev => {
        let newEngagements = [...prev];
        
        // Remove opposite vote for upvote/downvote mutual exclusion
        if (type === 'upvote') {
          newEngagements = newEngagements.filter(e => e !== 'downvote');
        } else if (type === 'downvote') {
          newEngagements = newEngagements.filter(e => e !== 'upvote');
        }
        
        // Add the new engagement
        return [...newEngagements, type];
      });
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/?post=${post.id}`;
    const shareText = `🔮 Sacred wisdom from ${post.author.username || post.author.email || 'a mystical soul'} on Ascended Social:\n\n"${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}"\n\nEmbark on this spiritual journey: ${postUrl} ✨`;
    
    if (navigator.share) {
      // Use native sharing on mobile devices
      navigator.share({
        title: '🌟 Sacred Wisdom from Ascended Social',
        text: shareText,
        url: postUrl,
      }).catch((error) => {
        console.log('Error sharing:', error);
        fallbackShare(shareText);
      });
    } else {
      fallbackShare(shareText);
    }
  };

  const fallbackShare = (text: string) => {
    // Copy to clipboard as fallback
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "🔗 Sacred Link Copied!",
        description: "Spread this mystical wisdom to fellow seekers",
      });
    }).catch(() => {
      // Last resort: show the text in an alert
      alert(`Share this sacred wisdom:\n\n${text}`);
    });
  };

  const handleSave = () => {
    // Toggle saved state (this would integrate with backend saved posts)
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "📜 Removed from Sacred Collection" : "🏛️ Added to Sacred Collection!",
      description: isSaved ? 
        "This wisdom has been released from your spiritual library" : 
        "This sacred knowledge is now preserved in your mystical archives",
      duration: 2500,
    });
  };

  const chakraColor = getChakraColor(post.chakra);
  const chakraGlow = getChakraGlow(post.chakra);

  return (
    <Card className={`bg-cosmic-light rounded-xl overflow-hidden border-2 ${chakraGlow} hover-lift animate-fade-in`}>
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ProfileIcon 
              user={post.author}
              size="sm"
              className="w-10 h-10 sigil-container"
              testId={`post-author-${post.id}`}
            />
            <div>
              <h4 
                className="font-semibold text-white cursor-pointer hover:text-primary transition-colors duration-200" 
                onClick={() => window.location.href = `/profile/${post.author.id}`}
                data-testid={`text-author-${post.id}`}
              >
                {post.author.username || post.author.email || 'Anonymous'}
              </h4>
              <p className="text-sm text-white/70" data-testid={`text-time-${post.id}`}>
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

      {/* Enhanced Engagement Bar */}
      <div className="p-4 border-t border-primary/20 bg-gradient-to-r from-transparent via-primary/5 to-transparent">
        <div className="flex flex-col space-y-3">
          {/* Main Engagement Actions */}
          <div className="flex items-center justify-between">
            {/* Spiritual Frequency Voting */}
            <div className="flex items-center bg-black/40 rounded-xl p-2 border border-primary/30 shadow-lg">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                    userEngagements.includes('upvote') 
                      ? 'text-green-200 bg-green-800/60 shadow-lg shadow-green-400/30' 
                      : 'text-white/80 hover:text-green-300 hover:bg-green-900/30'
                  } ${engageMutation.isPending ? 'animate-pulse' : ''}`}
                  onClick={() => handleEngagement('upvote')}
                  disabled={engageMutation.isPending}
                  title="✨ Raise Spiritual Frequency"
                  data-testid={`button-upvote-${post.id}`}
                >
                  <ChevronUp className="w-5 h-5" />
                  {userEngagements.includes('upvote') && (
                    <div className="absolute inset-0 bg-green-400/30 rounded-lg animate-ping"></div>
                  )}
                </Button>
                
                <div className="px-4 text-center">
                  <div 
                    className={`text-lg font-bold transition-colors duration-300 ${
                      ((post.engagements?.upvote || 0) - (post.engagements?.downvote || 0)) >= 0 
                        ? 'text-green-200 drop-shadow-lg' 
                        : 'text-red-200 drop-shadow-lg'
                    }`}
                    data-testid={`votes-${post.id}`}
                  >
                    {(post.engagements?.upvote || 0) - (post.engagements?.downvote || 0)}
                  </div>
                  <div className="text-xs text-white/70 font-medium tracking-wide">FREQUENCY</div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                    userEngagements.includes('downvote') 
                      ? 'text-red-200 bg-red-800/60 shadow-lg shadow-red-400/30' 
                      : 'text-white/80 hover:text-red-300 hover:bg-red-900/30'
                  } ${engageMutation.isPending ? 'animate-pulse' : ''}`}
                  onClick={() => handleEngagement('downvote')}
                  disabled={engageMutation.isPending}
                  title="🌊 Provide Constructive Balance"
                  data-testid={`button-downvote-${post.id}`}
                >
                  <ChevronDown className="w-5 h-5" />
                  {userEngagements.includes('downvote') && (
                    <div className="absolute inset-0 bg-red-300/30 rounded-lg animate-ping"></div>
                  )}
                </Button>
              </div>
            </div>

            {/* Secondary Actions */}
            <div className="flex items-center space-x-2">
              {/* Mystical Comments */}
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                  showComments 
                    ? 'text-purple-200 bg-purple-800/60 shadow-lg shadow-purple-400/30' 
                    : 'text-white/80 hover:text-purple-300 hover:bg-purple-900/30'
                }`}
                onClick={() => setShowComments(!showComments)}
                title="💬 Join the Sacred Discussion"
                data-testid={`button-comment-${post.id}`}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-semibold" data-testid={`comments-${post.id}`}>
                  0
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-xl text-white/80 hover:text-cyan-300 hover:bg-cyan-900/30 transition-all duration-300 hover:scale-110"
                onClick={handleShare}
                title="🔗 Share Sacred Wisdom"
                data-testid={`button-share-${post.id}`}
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isSaved 
                    ? 'text-amber-200 hover:text-amber-300 bg-amber-900/30' 
                    : 'text-white/80 hover:text-amber-300 hover:bg-amber-900/30'
                }`}
                onClick={handleSave}
                title={isSaved ? "📜 Remove from Sacred Collection" : "📜 Save to Sacred Collection"}
                data-testid={`button-save-${post.id}`}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Resonance & Energy Row */}
          <div className="flex items-center space-x-3">
            {/* Heart Resonance */}
            <div className="flex items-center bg-black/40 rounded-xl px-3 py-2 border border-pink-500/30">
              <Button
                variant="ghost"
                size="sm"
                className={`relative flex items-center space-x-2 p-1 rounded-lg transition-all duration-300 hover:scale-105 ${
                  userEngagements.includes('like') 
                    ? 'text-pink-200 bg-pink-800/40' 
                    : 'text-white/80 hover:text-pink-300'
                } ${engageMutation.isPending ? 'animate-pulse' : ''}`}
                onClick={() => handleEngagement('like')}
                disabled={engageMutation.isPending}
                title="💖 Send Heart Resonance"
                data-testid={`button-like-${post.id}`}
              >
                <Heart className={`w-4 h-4 transition-transform duration-200 ${
                  userEngagements.includes('like') ? 'scale-110 fill-current animate-pulse' : 'hover:scale-110'
                }`} />
                {userEngagements.includes('like') && (
                  <div className="absolute inset-0 bg-pink-300/30 rounded-lg animate-ping"></div>
                )}
              </Button>
              <div className="flex items-center space-x-1 ml-2">
                <span className="text-sm font-bold text-pink-200" data-testid={`likes-${post.id}`}>
                  {post.engagements?.like || 0}
                </span>
                <span className="text-xs text-white/70 font-medium">HEARTS</span>
              </div>
            </div>

            {/* Spiritual Energy Transfer */}
            <div className="flex items-center bg-black/40 rounded-xl px-3 py-2 border border-yellow-500/30">
              <Popover open={energyPopoverOpen} onOpenChange={setEnergyPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`relative flex items-center space-x-1 p-1 rounded-lg transition-all duration-300 hover:scale-105 ${
                      userEngagements.includes('energy') 
                        ? 'text-yellow-200 bg-yellow-800/40' 
                        : 'text-white/80 hover:text-yellow-300'
                    } ${engageMutation.isPending ? 'animate-pulse' : ''}`}
                    disabled={engageMutation.isPending || ((user as any)?.energy || 0) < energyAmount}
                    title={`⚡ Transfer Spiritual Energy (-${energyAmount} energy) | Your Energy: ${(user as any)?.energy || 0}`}
                    data-testid={`button-energy-${post.id}`}
                  >
                    <Zap className={`w-4 h-4 transition-transform duration-200 ${
                      userEngagements.includes('energy') ? 'scale-110 animate-pulse' : 'hover:scale-110'
                    }`} />
                    <Settings className="w-3 h-3 opacity-60" />
                    {((user as any)?.energy || 0) < energyAmount && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                    {userEngagements.includes('energy') && (
                      <div className="absolute inset-0 bg-yellow-300/30 rounded-lg animate-ping"></div>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-cosmic-dark/95 backdrop-blur border border-yellow-500/30" align="start">
                  <div className="space-y-4 p-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-yellow-300 font-semibold text-sm">⚡ Energy Transfer</h4>
                      <span className="text-xs text-white/60">
                        Available: {(user as any)?.energy || 0} energy
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">Energy Amount:</span>
                        <span className="text-yellow-300 font-bold">{energyAmount} points</span>
                      </div>
                      
                      <Slider
                        value={[energyAmount]}
                        onValueChange={([value]) => setEnergyAmount(value)}
                        max={Math.min(50, (user as any)?.energy || 0)}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      
                      <div className="flex justify-between text-xs text-white/60">
                        <span>1 point</span>
                        <span>{Math.min(50, (user as any)?.energy || 0)} points</span>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-900/20 rounded-lg p-3 text-xs text-yellow-200/80">
                      <p>✨ Higher energy amounts provide more spiritual impact and experience points.</p>
                    </div>
                    
                    <Button 
                      className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-semibold"
                      onClick={() => handleEngagement('energy')}
                      disabled={engageMutation.isPending || ((user as any)?.energy || 0) < energyAmount}
                      data-testid={`confirm-energy-${post.id}`}
                    >
                      {engageMutation.isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                          <span>Transferring...</span>
                        </div>
                      ) : (
                        `⚡ Transfer ${energyAmount} Energy`
                      )}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <div className="flex items-center space-x-1 ml-2">
                <span className="text-sm font-bold text-yellow-200" data-testid={`energy-${post.id}`}>
                  {post.engagements?.energy || 0}
                </span>
                <span className="text-xs text-white/70 font-medium">ENERGY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <Comments postId={post.id} isVisible={showComments} />
      </div>
    </Card>
  );
}
