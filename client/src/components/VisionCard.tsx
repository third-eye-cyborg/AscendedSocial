import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Eye, Heart, Share2, Bookmark, MoreVertical, Calendar, 
  Sparkles, Lock, Users, Globe, Play, Volume2, Image as ImageIcon 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { VisionWithAuthor, VisionPrivacy } from "@shared/schema";

interface VisionCardProps {
  vision: VisionWithAuthor;
  onUpdate?: () => void;
}

const chakraColors = {
  root: "bg-red-500",
  sacral: "bg-orange-500", 
  solar: "bg-yellow-500",
  heart: "bg-green-500",
  throat: "bg-blue-500",
  third_eye: "bg-indigo-500",
  crown: "bg-purple-500"
};

export function VisionCard({ vision, onUpdate }: VisionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const engageMutation = useMutation({
    mutationFn: async ({ type, energyAmount }: { type: string; energyAmount?: number }) => {
      const response = await fetch(`/api/visions/${vision.id}/engage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, energyAmount }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to engage with vision');
      }
      
      return response.json();
    },
    onSuccess: () => {
      onUpdate?.();
      queryClient.invalidateQueries({ queryKey: ['/api/visions'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to engage with vision",
        variant: "destructive",
      });
    },
  });

  const manifestMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/visions/${vision.id}/manifest`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark as manifested');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Vision Manifested! ✨",
        description: "Congratulations on bringing your vision into reality",
      });
      onUpdate?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark vision as manifested",
        variant: "destructive",
      });
    },
  });

  const getPrivacyIcon = (privacy: VisionPrivacy) => {
    switch (privacy) {
      case "public": return <Globe className="w-3 h-3" />;
      case "friends": return <Users className="w-3 h-3" />;
      case "private": return <Lock className="w-3 h-3" />;
    }
  };

  const handleEngage = (type: string, energyAmount?: number) => {
    engageMutation.mutate({ type, energyAmount });
  };

  const shouldTruncateContent = vision.content.length > 200;
  const displayContent = isExpanded || !shouldTruncateContent 
    ? vision.content 
    : `${vision.content.substring(0, 200)}...`;

  return (
    <Card className="bg-cosmic-light/50 border-primary/20 hover:border-primary/40 transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="w-10 h-10">
              <AvatarImage src={vision.author.profileImageUrl || ""} />
              <AvatarFallback className="bg-primary/20 text-white">
                {vision.author.username?.[0]?.toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm truncate">
                  {vision.author.username || 'Anonymous'}
                </h3>
                {getPrivacyIcon(vision.privacy)}
              </div>
              <p className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(vision.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold text-white leading-tight">{vision.title}</h2>
          
          {/* Chakra and Status Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {vision.chakra && (
              <Badge 
                className={`${chakraColors[vision.chakra]} text-white text-xs`}
                data-testid={`badge-chakra-${vision.chakra}`}
              >
                {vision.chakra.replace('_', ' ').toUpperCase()}
              </Badge>
            )}
            {vision.isManifested && (
              <Badge className="bg-green-500 text-white text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Manifested
              </Badge>
            )}
            {vision.energyLevel > 0 && (
              <Badge variant="outline" className="border-yellow-500 text-yellow-400 text-xs">
                Energy: {vision.energyLevel}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Vision Content */}
        <div className="space-y-3">
          <p className="text-gray-300 leading-relaxed text-sm">
            {displayContent}
          </p>
          
          {shouldTruncateContent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary/80 p-0 h-auto text-xs"
              data-testid="button-expand-vision"
            >
              {isExpanded ? "Show less" : "Read more"}
            </Button>
          )}
        </div>

        {/* Media */}
        {(vision.imageUrl || vision.videoUrl || vision.audioUrl) && (
          <div className="space-y-2">
            {vision.imageUrl && (
              <div className="relative rounded-lg overflow-hidden bg-cosmic-light/30">
                <img 
                  src={vision.imageUrl} 
                  alt="Vision visualization"
                  className="w-full h-48 object-cover"
                  data-testid="image-vision-media"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black/50 text-white">
                    <ImageIcon className="w-3 h-3 mr-1" />
                    Image
                  </Badge>
                </div>
              </div>
            )}
            
            {vision.videoUrl && (
              <div className="relative rounded-lg overflow-hidden bg-cosmic-light/30 h-48 flex items-center justify-center">
                <Button className="bg-black/50 hover:bg-black/70" data-testid="button-play-video">
                  <Play className="w-6 h-6" />
                </Button>
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black/50 text-white">
                    Video
                  </Badge>
                </div>
              </div>
            )}
            
            {vision.audioUrl && (
              <div className="flex items-center gap-3 p-3 bg-cosmic-light/30 rounded-lg">
                <Button size="sm" className="bg-primary/20 hover:bg-primary/30" data-testid="button-play-audio">
                  <Volume2 className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">Audio recording</p>
                  <div className="w-full bg-primary/20 h-1 rounded-full mt-1">
                    <div className="bg-primary h-1 rounded-full w-0"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Symbols */}
        {vision.symbols && vision.symbols.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-medium">Spiritual Symbols:</p>
            <div className="flex flex-wrap gap-1">
              {vision.symbols.map((symbol, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="border-primary/30 text-primary text-xs"
                  data-testid={`badge-symbol-${index}`}
                >
                  {symbol}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Manifestation Date */}
        {vision.manifestationDate && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>
              Expected manifestation: {new Date(vision.manifestationDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-primary/20">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEngage('like')}
              className="text-gray-400 hover:text-red-400 hover:bg-red-400/10"
              data-testid="button-like-vision"
            >
              <Heart className="w-4 h-4 mr-1" />
              <span className="text-xs">Resonate</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEngage('energy', 5)}
              className="text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10"
              data-testid="button-send-energy"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              <span className="text-xs">Send Energy</span>
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-blue-400 hover:bg-blue-400/10"
              data-testid="button-share-vision"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-green-400 hover:bg-green-400/10"
              data-testid="button-bookmark-vision"
            >
              <Bookmark className="w-4 h-4" />
            </Button>

            {/* Manifest Button - only for vision author */}
            {!vision.isManifested && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => manifestMutation.mutate()}
                disabled={manifestMutation.isPending}
                className="text-gray-400 hover:text-purple-400 hover:bg-purple-400/10"
                data-testid="button-manifest-vision"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}