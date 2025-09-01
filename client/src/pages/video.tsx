import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import { formatDistanceToNow } from "date-fns";
import { ProfileIcon } from "@/components/ProfileIcon";
import { getChakraColor } from "@/lib/chakras";
import { Helmet } from "react-helmet";

interface VideoPost {
  id: string;
  content: string;
  videoUrl: string;
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
}

interface Vision {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  createdAt: string;
  author: {
    id: string;
    username?: string;
    email?: string;
  };
  symbols?: string[];
  manifestationDate?: string;
}

export default function VideoPage() {
  const { id, type } = useParams();
  const [, setLocation] = useLocation();

  // Fetch video data based on type (post or vision)
  const { data: videoData, isLoading, error } = useQuery({
    queryKey: [`/api/${type}s/${id}`],
    enabled: !!id && !!type,
  });

  const goBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-purple-200 font-medium">Loading mystical video...</p>
        </div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <Card className="p-8 text-center bg-cosmic/30 border-primary/20">
          <h2 className="text-xl font-semibold text-white mb-4">Video Not Found</h2>
          <p className="text-gray-300 mb-6">The mystical video you're looking for has vanished into the cosmic void.</p>
          <Button onClick={goBack} className="bg-primary hover:bg-primary/90">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Realm
          </Button>
        </Card>
      </div>
    );
  }

  const isPost = type === 'post';
  const post = isPost ? (videoData as VideoPost) : null;
  const vision = !isPost ? (videoData as Vision) : null;
  const videoUrl = isPost ? post?.videoUrl : vision?.videoUrl;
  const title = isPost ? `${post?.author.username || 'Mystic'}'s Vision` : vision?.title;
  const description = isPost ? post?.content : vision?.description;
  const author = isPost ? post?.author : vision?.author;
  const createdAt = isPost ? post?.createdAt : vision?.createdAt;

  if (!videoUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <Card className="p-8 text-center bg-cosmic/30 border-primary/20">
          <h2 className="text-xl font-semibold text-white mb-4">No Video Available</h2>
          <p className="text-gray-300 mb-6">This mystical content doesn't contain a video.</p>
          <Button onClick={goBack} className="bg-primary hover:bg-primary/90">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Realm
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Helmet>
        <title>{title} - Ascended Social</title>
        <meta name="description" content={description?.slice(0, 160)} />
      </Helmet>
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              onClick={goBack}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-3 flex-1">
              <ProfileIcon user={author as any} size="sm" />
              <div>
                <h1 className="text-lg font-semibold text-white truncate">{title}</h1>
                <p className="text-sm text-gray-400">
                  {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            
            {isPost && post?.chakra && (
              <Badge 
                className={`${getChakraColor(post.chakra)} border-0 text-white shadow-lg`}
                data-testid="badge-chakra"
              >
                {post.chakra.replace('_', ' ')}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Video Player */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <VideoPlayer
          videoUrl={videoUrl}
          title={title}
          description={description}
          autoPlay={true}
          className="mb-6"
        />
        
        {/* Content Details */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            {description && (
              <Card className="p-6 bg-cosmic/30 border-primary/20">
                <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{description}</p>
              </Card>
            )}
            
            {/* Vision-specific details */}
            {vision && (
              <>
                {vision.symbols && vision.symbols.length > 0 && (
                  <Card className="p-6 bg-cosmic/30 border-primary/20">
                    <h3 className="text-lg font-semibold text-white mb-3">Spiritual Symbols</h3>
                    <div className="flex flex-wrap gap-2">
                      {vision.symbols.map((symbol, index) => (
                        <Badge 
                          key={index}
                          variant="outline"
                          className="border-primary/30 text-primary"
                          data-testid={`badge-symbol-${index}`}
                        >
                          {symbol}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}
                
                {vision.manifestationDate && (
                  <Card className="p-6 bg-cosmic/30 border-primary/20">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">Expected Manifestation</h3>
                        <p className="text-gray-300">
                          {new Date(vision.manifestationDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <Card className="p-6 bg-cosmic/30 border-primary/20">
              <h3 className="text-lg font-semibold text-white mb-4">Created By</h3>
              <div className="flex items-center gap-3">
                <ProfileIcon user={author as any} size="md" />
                <div>
                  <p className="font-medium text-white">
                    {author?.username || 'Mystical Being'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Spiritual Creator
                  </p>
                </div>
              </div>
            </Card>
            
            {/* Engagement Stats for Posts */}
            {isPost && post?.engagements && (
              <Card className="p-6 bg-cosmic/30 border-primary/20">
                <h3 className="text-lg font-semibold text-white mb-4">Spiritual Resonance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-gray-300">Likes</span>
                    </div>
                    <span className="text-white font-medium">{post.engagements.like}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">Energy</span>
                    </div>
                    <span className="text-white font-medium">{post.engagements.energy}</span>
                  </div>
                  
                  {post.frequency && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-secondary" />
                        <span className="text-gray-300">Frequency</span>
                      </div>
                      <span className="text-white font-medium">{post.frequency}Hz</span>
                    </div>
                  )}
                </div>
              </Card>
            )}
            
            {/* Action Buttons */}
            <Card className="p-6 bg-cosmic/30 border-primary/20">
              <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-primary/20 hover:bg-primary/30 text-white border border-primary/30"
                  data-testid="button-share"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Vision
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full border-primary/30 text-white hover:bg-primary/10"
                  data-testid="button-comment"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Discuss
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}