import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getChakraColor, getChakraGlow } from "@/lib/chakras";
import { formatDistanceToNow } from "date-fns";
import { ProfileIcon } from "@/components/ProfileIcon";
import Comments from "./Comments";
import { Zap, Heart, ChevronUp, ChevronDown, MessageCircle, Share2, Bookmark, BookmarkCheck, Settings, Sparkles, Gem } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    imageUrl?: string;
    videoUrl?: string;
    chakra: string;
    frequency: number;
    type: string;
    isSpiritual?: boolean;
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
    spiritualCount?: number;
  };
}

// Chakra descriptions for tooltips
const getChakraDescription = (chakra: string): string => {
  const descriptions: Record<string, string> = {
    root: "Survival, grounding, material security, stability",
    sacral: "Creativity, sexuality, emotional well-being, pleasure", 
    solar: "Personal power, confidence, willpower, self-esteem",
    heart: "Love, compassion, relationships, emotional healing",
    throat: "Communication, truth, self-expression, authenticity",
    third_eye: "Intuition, wisdom, psychic abilities, inner vision",
    crown: "Spirituality, enlightenment, divine connection, transcendence"
  };
  return descriptions[chakra] || "Universal spiritual energy";
};

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userEngagements, setUserEngagements] = useState<string[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [energyAmount, setEnergyAmount] = useState(10);
  const [energyPopoverOpen, setEnergyPopoverOpen] = useState(false);
  const [clickEffects, setClickEffects] = useState<{[key: string]: boolean}>({});
  const [isMarkedSpiritual, setIsMarkedSpiritual] = useState(post.isSpiritual || false);
  const [spiritualCount, setSpiritualCount] = useState(post.spiritualCount || 0);
  const [userSpiritualMark, setUserSpiritualMark] = useState(false);
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null);

  // Check if post is bookmarked
  const { data: bookmarks = [] } = useQuery<string[]>({
    queryKey: ["/api/bookmarks"],
    enabled: !!user,
  });
  
  useEffect(() => {
    if (bookmarks.includes(post.id)) {
      setIsSaved(true);
    }
  }, [bookmarks, post.id]);

  // Fetch user engagement status for this post
  const { data: userEngagementData } = useQuery({
    queryKey: ["/api/posts", post.id, "engage/user"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/posts/${post.id}/engage/user`);
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch user spiritual mark status for this post
  const { data: spiritualMarkData } = useQuery({
    queryKey: ["/api/posts", post.id, "spiritual-mark/user"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/posts/${post.id}/spiritual-mark/user`);
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

  // Set initial spiritual mark state when data is fetched
  useEffect(() => {
    if (spiritualMarkData) {
      setUserSpiritualMark(spiritualMarkData.marked || false);
      setSpiritualCount(spiritualMarkData.count || 0);
    }
  }, [spiritualMarkData]);

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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] }); // Refresh user energy
      if (energyPopoverOpen) setEnergyPopoverOpen(false);
      
      // Trigger click effect
      setClickEffects(prev => ({ ...prev, [variables.type]: true }));
      setTimeout(() => {
        setClickEffects(prev => ({ ...prev, [variables.type]: false }));
      }, 600);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSpiritualToggle = async () => {
    try {
      await apiRequest("PATCH", `/api/posts/${post.id}`, {
        isSpiritual: !isMarkedSpiritual
      });
      setIsMarkedSpiritual(!isMarkedSpiritual);
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: !isMarkedSpiritual ? "🔮 Marked as Spiritual" : "📝 Unmarked as Spiritual",
        description: !isMarkedSpiritual ? 
          "This post is now flagged as spiritual content" : 
          "This post is no longer flagged as spiritual content",
        duration: 2000,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update spiritual status",
        variant: "destructive",
      });
    }
  };

  const handleSpiritualMark = async () => {
    try {
      const response = await apiRequest("POST", `/api/posts/${post.id}/spiritual-mark`);
      const data = await response.json();
      
      setUserSpiritualMark(data.marked);
      setSpiritualCount(data.count);
      
      queryClient.invalidateQueries({ queryKey: ["/api/posts", post.id, "spiritual-mark/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      
      toast({
        title: "Success",
        description: data.marked ? 'Added spiritual mark' : 'Removed spiritual mark',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle spiritual mark",
        variant: "destructive",
      });
    }
  };

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
    
    // Energy transfers are permanent - prevent attempts to remove them
    if (type === 'energy' && isEngaged) {
      toast({
        title: "⚡ Energy Transfer is Permanent",
        description: "Your spiritual energy has been permanently transferred to this post. This cannot be reversed.",
        variant: "destructive",
      });
      return;
    }
    
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
      remove: isEngaged && type !== 'energy', // Never remove energy engagements
      energyAmount: type === 'energy' ? currentEnergyAmount : undefined
    });
    
    // Optimistic update with mutual exclusion for votes
    // Energy engagements cannot be removed once made
    if (isEngaged && type !== 'energy') {
      setUserEngagements(prev => prev.filter(e => e !== type));
    } else if (!isEngaged) {
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

  const saveMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/posts/${post.id}/bookmark`, {
        bookmarked: !isSaved
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
    }
  });

  const handleSave = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    
    toast({
      title: newSavedState ? "🏛️ Added to Sacred Collection!" : "📜 Removed from Sacred Collection",
      description: newSavedState ? 
        "This sacred knowledge is now preserved in your mystical archives" : 
        "This wisdom has been released from your spiritual library",
      duration: 2500,
    });
    
    saveMutation.mutate();
  };

  const chakraColor = getChakraColor(post.chakra);
  const chakraGlow = getChakraGlow(post.chakra);

  return (
    <Card className={`post-card-container bg-cosmic-light rounded-xl border-2 ${chakraGlow} hover-lift animate-fade-in`}>
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
            {/* Frequency Indicator with Chakra Tooltip */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="text-sm font-medium cursor-help hover:scale-105 transition-transform" 
                    style={{ color: chakraColor }}
                    data-testid={`frequency-${post.id}`}
                  >
                    {post.frequency > 0 ? '+' : ''}{post.frequency} Hz
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-cosmic-dark/95 border-primary/30 backdrop-blur max-w-sm z-50">
                  <div className="space-y-3 p-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: chakraColor }}
                      ></div>
                      <span className="text-white font-semibold capitalize">
                        {post.chakra.replace('_', ' ')} Chakra
                      </span>
                    </div>
                    
                    <div className="text-sm text-white/90">
                      <div className="mb-2">
                        <span className="text-accent-light font-medium">Frequency:</span> {post.frequency > 0 ? '+' : ''}{post.frequency} Hz
                      </div>
                      <div className="mb-2">
                        <span className="text-accent-light font-medium">Energy Type:</span> {getChakraDescription(post.chakra)}
                      </div>
                      <div className="text-xs text-white/70 mt-2 pt-2 border-t border-primary/20">
                        This post was automatically categorized by AI based on its spiritual content and energy signature.
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
        <div 
          className="post-content text-white leading-relaxed" 
          data-testid={`content-${post.id}`}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Post Media - Expandable */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <>
          <div className="relative">
            {post.imageUrls.length === 1 ? (
              <Dialog>
                <DialogTrigger asChild>
                  <img 
                    src={post.imageUrls[0]} 
                    alt="Post image" 
                    className="w-full h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    data-testid={`image-${post.id}-0`}
                  />
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] bg-black/95 border-primary/30">
                  <div className="p-8">
                    <img 
                      src={post.imageUrls[0]} 
                      alt="Post image expanded" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            ) : post.imageUrls.length === 2 ? (
              <div className="grid grid-cols-2 gap-2">
                {post.imageUrls.map((url, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <img
                        src={url}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        data-testid={`image-${post.id}-${index}`}
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] bg-black/95 border-primary/30">
                      <div className="relative p-8">
                        <img 
                          src={url} 
                          alt={`Post image ${index + 1} expanded`} 
                          className="w-full h-full object-contain rounded-lg"
                        />
                        <div className="absolute top-2 left-2 text-white text-sm bg-black/70 px-3 py-1 rounded-full">
                          {index + 1} of {post.imageUrls.length}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <img
                      src={post.imageUrls[0]}
                      alt="Post image 1"
                      className="w-full h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      data-testid={`image-${post.id}-0`}
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] bg-black/95 border-primary/30">
                    <div className="relative p-8">
                      <img 
                        src={post.imageUrls[0]} 
                        alt="Post image 1 expanded" 
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <div className="absolute top-2 left-2 text-white text-sm bg-black/70 px-3 py-1 rounded-full">
                        1 of {post.imageUrls.length}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="grid grid-rows-2 gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <img
                        src={post.imageUrls[1]}
                        alt="Post image 2"
                        className="w-full h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        data-testid={`image-${post.id}-1`}
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] bg-black/95 border-primary/30">
                      <div className="relative p-8">
                        <img 
                          src={post.imageUrls[1]} 
                          alt="Post image 2 expanded" 
                          className="w-full h-full object-contain rounded-lg"
                        />
                        <div className="absolute top-2 left-2 text-white text-sm bg-black/70 px-3 py-1 rounded-full">
                          2 of {post.imageUrls.length}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <div className="relative">
                    <Dialog>
                      <DialogTrigger asChild>
                        <img
                          src={post.imageUrls[2]}
                          alt="Post image 3"
                          className="w-full h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          data-testid={`image-${post.id}-2`}
                        />
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] bg-black/95 border-primary/30">
                        <div className="relative p-8">
                          <img 
                            src={post.imageUrls[2]} 
                            alt="Post image 3 expanded" 
                            className="w-full h-full object-contain rounded-lg"
                          />
                          <div className="absolute top-2 left-2 text-white text-sm bg-black/70 px-3 py-1 rounded-full">
                            3 of {post.imageUrls.length}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {post.imageUrls.length > 3 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-lg pointer-events-none">
                        +{post.imageUrls.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
              📸 {post.imageUrls.length} image{post.imageUrls.length > 1 ? 's' : ''}
            </div>
          </div>
        </>
      )}
      {/* Fallback to single image for backward compatibility - Expandable */}
      {!post.imageUrls && post.imageUrl && (
        <div className="relative">
          <Dialog>
            <DialogTrigger asChild>
              <img 
                src={post.imageUrl} 
                alt="Post image" 
                className="w-full h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                data-testid={`image-${post.id}`}
              />
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] bg-black/95 border-primary/30">
              <div className="p-8">
                <img 
                  src={post.imageUrl} 
                  alt="Post image expanded" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </DialogContent>
          </Dialog>
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
            📸 1 image
          </div>
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
                  className={`relative p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    userEngagements.includes('upvote') 
                      ? 'text-green-100 bg-gradient-to-r from-green-600 to-green-500 shadow-md' 
                      : 'text-white/80 hover:text-green-300 hover:bg-green-900/20'
                  } ${engageMutation.isPending ? 'opacity-75' : ''} ${
                    clickEffects.upvote ? 'scale-125 rotate-12' : ''
                  }`}
                  onClick={() => handleEngagement('upvote')}
                  disabled={engageMutation.isPending}
                  title="✨ Raise Spiritual Frequency"
                  data-testid={`button-upvote-${post.id}`}
                >
                  <ChevronUp className="w-5 h-5" />
                  {clickEffects.upvote && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-green-300 text-xs font-bold animate-bounce pointer-events-none">
                      +1 ✨
                    </div>
                  )}
                </Button>
                
                <div className="px-4 text-center">
                  <div 
                    className={`text-lg font-bold transition-colors duration-300 ${
                      post.frequency >= 0 
                        ? 'text-green-200 drop-shadow-lg' 
                        : 'text-red-200 drop-shadow-lg'
                    }`}
                    data-testid={`votes-${post.id}`}
                  >
                    {post.frequency > 0 ? '+' : ''}{post.frequency}
                  </div>
                  <div className="text-xs text-white/70 font-medium tracking-wide">FREQUENCY</div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    userEngagements.includes('downvote') 
                      ? 'text-red-100 bg-gradient-to-r from-red-600 to-red-500 shadow-md' 
                      : 'text-white/80 hover:text-red-300 hover:bg-red-900/20'
                  } ${engageMutation.isPending ? 'opacity-75' : ''} ${
                    clickEffects.downvote ? 'scale-125 -rotate-12' : ''
                  }`}
                  onClick={() => handleEngagement('downvote')}
                  disabled={engageMutation.isPending}
                  title="🌊 Provide Constructive Balance"
                  data-testid={`button-downvote-${post.id}`}
                >
                  <ChevronDown className="w-5 h-5" />
                  {clickEffects.downvote && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-blue-300 text-xs font-bold animate-bounce pointer-events-none">
                      -1 🌊
                    </div>
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
                    ? 'text-white bg-purple-800/60 shadow-lg shadow-purple-400/30' 
                    : 'text-white/80 hover:text-purple-300 hover:bg-purple-900/30'
                }`}
                onClick={() => setShowComments(!showComments)}
                title="💬 Join the Sacred Discussion"
                data-testid={`button-comment-${post.id}`}
              >
                <MessageCircle className="w-4 h-4" />
                <span className={`text-sm font-bold bg-purple-900/20 px-1 rounded ${
                  showComments ? 'text-white' : 'text-purple-100'
                }`} data-testid={`comments-${post.id}`}>
                  {(post.engagements as any)?.comments || 0}
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
                    ? 'text-amber-300 hover:text-amber-200 bg-amber-900/40 shadow-lg shadow-amber-500/30' 
                    : 'text-white/80 hover:text-amber-300 hover:bg-amber-900/30'
                }`}
                onClick={handleSave}
                title={isSaved ? "📜 Remove from Sacred Collection" : "📜 Save to Sacred Collection"}
                data-testid={`button-save-${post.id}`}
              >
                <Bookmark className={`w-4 h-4 transition-all duration-300 ${
                  isSaved ? 'fill-amber-400 stroke-amber-400' : 'fill-transparent stroke-current'
                }`} />
              </Button>
              
              {/* Spirit Toggle Button */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                    userSpiritualMark 
                      ? 'text-purple-200 hover:text-purple-300 bg-purple-900/40 shadow-lg shadow-purple-500/30' 
                      : 'text-white/80 hover:text-purple-300 hover:bg-purple-900/30'
                  }`}
                  onClick={handleSpiritualMark}
                  title={userSpiritualMark ? "🔮 Remove Spiritual Mark" : "🔮 Mark as Spiritual"}
                  data-testid={`button-spirit-mark-${post.id}`}
                >
                  <Gem className={`w-4 h-4 ${
                    userSpiritualMark ? 'fill-purple-400 text-purple-400' : ''
                  }`} />
                </Button>
                {spiritualCount > 0 && (
                  <span className="text-xs font-bold text-purple-300 bg-purple-900/30 px-1.5 py-0.5 rounded-full border border-purple-500/30 shadow-sm">
                    {spiritualCount}
                  </span>
                )}
                {(user as any)?.id === post.author.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-1 rounded-lg transition-all duration-300 ${
                      isMarkedSpiritual
                        ? 'text-violet-300 hover:text-violet-200 bg-violet-900/30'
                        : 'text-white/40 hover:text-violet-300 hover:bg-violet-900/20'
                    }`}
                    onClick={handleSpiritualToggle}
                    title={isMarkedSpiritual ? "🔮 Remove Author Flag" : "🔮 Mark as Spiritual (Author)"}
                    data-testid={`button-spirit-author-${post.id}`}
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Resonance & Energy Row */}
          <div className="flex items-center space-x-3">
            {/* Heart Resonance */}
            <div className="flex items-center bg-black/40 rounded-xl px-3 py-2 border border-pink-500/30">
              <Button
                variant="ghost"
                size="sm"
                className={`relative flex items-center space-x-2 p-1 rounded-lg transition-all duration-200 hover:scale-105 ${
                  userEngagements.includes('like') 
                    ? 'text-white/90 hover:bg-pink-900/40' 
                    : 'text-white/80 hover:text-pink-300 hover:bg-pink-900/30'
                } ${engageMutation.isPending ? 'animate-pulse' : ''}`}
                onClick={() => handleEngagement('like')}
                disabled={engageMutation.isPending}
                title="💖 Send Heart Resonance"
                data-testid={`button-like-${post.id}`}
              >
                <Heart className={`w-4 h-4 transition-all duration-200 ${
                  userEngagements.includes('like') 
                    ? 'fill-pink-500 text-pink-500 drop-shadow-lg' 
                    : 'hover:scale-110 hover:text-pink-400'
                }`} />
                {clickEffects.like && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-pink-300 text-xs font-bold animate-fade-in pointer-events-none">
                    +LOVE
                  </div>
                )}
              </Button>
              <div className="flex items-center space-x-1 ml-2">
                <span className="text-lg font-bold text-pink-100 drop-shadow-md bg-pink-900/20 px-2 py-1 rounded" data-testid={`likes-${post.id}`}>
                  {post.engagements?.like || 0}
                </span>
                <span className="text-xs text-pink-200/90 font-medium tracking-wide">HEARTS</span>
              </div>
            </div>

            {/* Spiritual Energy Transfer */}
            <div className="flex items-center bg-black/40 rounded-xl px-3 py-2 border border-yellow-500/30">
              <Popover open={energyPopoverOpen} onOpenChange={setEnergyPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`relative flex items-center space-x-1 p-1 rounded-lg transition-all duration-200 hover:scale-105 ${
                      userEngagements.includes('energy') 
                        ? 'text-white/90 hover:bg-yellow-900/40' 
                        : 'text-white/80 hover:text-yellow-300 hover:bg-yellow-900/30'
                    } ${engageMutation.isPending ? 'opacity-75' : ''}`}
                    disabled={engageMutation.isPending || ((user as any)?.energy || 0) < energyAmount}
                    title={`⚡ Transfer Spiritual Energy (-${energyAmount} energy) | Your Energy: ${(user as any)?.energy || 0}`}
                    data-testid={`button-energy-${post.id}`}
                  >
                    <Zap className={`w-4 h-4 transition-all duration-200 ${
                      userEngagements.includes('energy') 
                        ? 'fill-yellow-500 text-yellow-500 drop-shadow-lg' 
                        : 'hover:scale-110 hover:text-yellow-400'
                    }`} />
                    <Settings className="w-3 h-3 opacity-60" />
                    {((user as any)?.energy || 0) < energyAmount && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full opacity-80"></div>
                    )}
                    {clickEffects.energy && (
                      <div className="absolute -top-6 -left-2 text-yellow-300 text-xs font-bold animate-fade-in pointer-events-none">
                        +{energyAmount} ENERGY
                      </div>
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
                      <p>✨ Energy transfers spiritual power to boost the post's frequency!</p>
                      <p className="mt-1 text-yellow-300/60">• Contributes to frequency calculation (×0.2 per point)</p>
                      <p className="text-yellow-300/60">• Higher amounts = more impact + XP</p>
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
                <span className="text-lg font-bold text-yellow-100 drop-shadow-md bg-yellow-900/20 px-2 py-1 rounded" data-testid={`energy-${post.id}`}>
                  {post.engagements?.energy || 0}
                </span>
                <span className="text-xs text-yellow-200/90 font-medium tracking-wide">ENERGY</span>
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
