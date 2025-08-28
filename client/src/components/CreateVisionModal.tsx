import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Eye, Users, Lock, Globe, Image, Video, Mic, X, Sparkles } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from '@uppy/core';
import type { VisionPrivacy, ChakraType } from "@shared/schema";

interface CreateVisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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

const chakraLabels = {
  root: "Root - Grounding & Survival",
  sacral: "Sacral - Creativity & Passion",
  solar: "Solar Plexus - Personal Power", 
  heart: "Heart - Love & Compassion",
  throat: "Throat - Communication & Truth",
  third_eye: "Third Eye - Intuition & Wisdom",
  crown: "Crown - Spirituality & Connection"
};

export function CreateVisionModal({ isOpen, onClose, onSuccess }: CreateVisionModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState<VisionPrivacy>("public");
  const [selectedChakra, setSelectedChakra] = useState<ChakraType | "">("");
  const [symbols, setSymbols] = useState<string[]>([]);
  const [newSymbol, setNewSymbol] = useState("");
  const [manifestationDate, setManifestationDate] = useState("");
  const [uploadedMedia, setUploadedMedia] = useState<{
    url: string;
    type: 'image' | 'video' | 'audio';
    cloudflareId?: string;
  } | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createVisionMutation = useMutation({
    mutationFn: async (visionData: any) => {
      const response = await fetch('/api/visions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visionData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create vision');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Vision Created",
        description: "Your spiritual vision has been shared with the universe",
      });
      resetForm();
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create vision. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setTitle("");
    setContent("");
    setPrivacy("public");
    setSelectedChakra("");
    setSymbols([]);
    setNewSymbol("");
    setManifestationDate("");
    setUploadedMedia(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and description for your vision",
        variant: "destructive",
      });
      return;
    }

    const visionData = {
      title: title.trim(),
      content: content.trim(),
      privacy,
      symbols: symbols.filter(s => s.trim()),
      manifestationDate: manifestationDate ? new Date(manifestationDate).toISOString() : undefined,
      imageUrl: uploadedMedia?.type === 'image' ? uploadedMedia.url : undefined,
      videoUrl: uploadedMedia?.type === 'video' ? uploadedMedia.url : undefined,
      audioUrl: uploadedMedia?.type === 'audio' ? uploadedMedia.url : undefined,
      cloudflareImageId: uploadedMedia?.type === 'image' ? uploadedMedia.cloudflareId : undefined,
      cloudflareVideoId: uploadedMedia?.type === 'video' ? uploadedMedia.cloudflareId : undefined,
    };

    createVisionMutation.mutate(visionData);
  };

  const addSymbol = () => {
    if (newSymbol.trim() && !symbols.includes(newSymbol.trim())) {
      setSymbols([...symbols, newSymbol.trim()]);
      setNewSymbol("");
    }
  };

  const removeSymbol = (symbolToRemove: string) => {
    setSymbols(symbols.filter(s => s !== symbolToRemove));
  };

  const handleMediaUpload = async () => {
    // Get upload URL from backend
    const response = await fetch('/api/visions/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'vision' }),
    });

    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { uploadUrl } = await response.json();
    return { method: 'PUT' as const, url: uploadUrl };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful.length > 0) {
      const file = result.successful[0];
      const fileType = file.type as string;
      
      let mediaType: 'image' | 'video' | 'audio';
      if (fileType.startsWith('image/')) mediaType = 'image';
      else if (fileType.startsWith('video/')) mediaType = 'video';
      else if (fileType.startsWith('audio/')) mediaType = 'audio';
      else return;

      // Process the uploaded file URL to get the final media URL
      setUploadedMedia({
        url: file.uploadURL as string,
        type: mediaType,
      });

      toast({
        title: "Media Uploaded",
        description: "Your media has been uploaded successfully",
      });
    }
  };

  const getPrivacyIcon = (privacyLevel: VisionPrivacy) => {
    switch (privacyLevel) {
      case "public": return <Globe className="w-4 h-4" />;
      case "friends": return <Users className="w-4 h-4" />;
      case "private": return <Lock className="w-4 h-4" />;
    }
  };

  const getPrivacyLabel = (privacyLevel: VisionPrivacy) => {
    switch (privacyLevel) {
      case "public": return "Public - Visible to everyone";
      case "friends": return "Friends Only - Visible to connected users";
      case "private": return "Private - Only visible to you";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-cosmic border-primary/20 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Eye className="w-5 h-5 text-purple-400" />
            Share Your Spiritual Vision
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Vision Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your vision a meaningful title..."
              className="bg-cosmic-light/50 border-primary/20 text-white"
              data-testid="input-vision-title"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Vision Description *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your spiritual vision in detail... What did you see, feel, or experience?"
              className="bg-cosmic-light/50 border-primary/20 text-white min-h-[120px]"
              data-testid="textarea-vision-content"
              required
            />
          </div>

          {/* Privacy */}
          <div className="space-y-2">
            <Label>Vision Privacy</Label>
            <Select value={privacy} onValueChange={(value) => setPrivacy(value as VisionPrivacy)}>
              <SelectTrigger className="bg-cosmic-light/50 border-primary/20 text-white" data-testid="select-vision-privacy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-cosmic border-primary/20">
                {(["public", "friends", "private"] as VisionPrivacy[]).map((level) => (
                  <SelectItem key={level} value={level}>
                    <div className="flex items-center gap-2">
                      {getPrivacyIcon(level)}
                      {getPrivacyLabel(level)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chakra Selection */}
          <div className="space-y-2">
            <Label>Primary Chakra (Optional)</Label>
            <Select value={selectedChakra} onValueChange={(value) => setSelectedChakra(value as ChakraType)}>
              <SelectTrigger className="bg-cosmic-light/50 border-primary/20 text-white" data-testid="select-vision-chakra">
                <SelectValue placeholder="Select the chakra this vision relates to..." />
              </SelectTrigger>
              <SelectContent className="bg-cosmic border-primary/20">
                {Object.entries(chakraLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${chakraColors[key as ChakraType]}`} />
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Symbols */}
          <div className="space-y-2">
            <Label>Spiritual Symbols</Label>
            <div className="flex gap-2">
              <Input
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                placeholder="Add symbols you encountered..."
                className="bg-cosmic-light/50 border-primary/20 text-white flex-1"
                data-testid="input-vision-symbol"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSymbol())}
              />
              <Button 
                type="button" 
                onClick={addSymbol}
                className="bg-primary/20 hover:bg-primary/30"
                data-testid="button-add-symbol"
              >
                Add
              </Button>
            </div>
            {symbols.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {symbols.map((symbol, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-primary/20 text-white"
                    data-testid={`badge-symbol-${index}`}
                  >
                    {symbol}
                    <button
                      type="button"
                      onClick={() => removeSymbol(symbol)}
                      className="ml-2 hover:text-red-400"
                      data-testid={`button-remove-symbol-${index}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Manifestation Date */}
          <div className="space-y-2">
            <Label htmlFor="manifestationDate">Expected Manifestation Date (Optional)</Label>
            <Input
              id="manifestationDate"
              type="date"
              value={manifestationDate}
              onChange={(e) => setManifestationDate(e.target.value)}
              className="bg-cosmic-light/50 border-primary/20 text-white"
              data-testid="input-manifestation-date"
            />
          </div>

          {/* Media Upload */}
          <div className="space-y-2">
            <Label>Vision Media (Optional)</Label>
            <Card className="bg-cosmic-light/50 border-primary/20">
              <CardContent className="p-4">
                {uploadedMedia ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {uploadedMedia.type === 'image' && <Image className="w-4 h-4" />}
                      {uploadedMedia.type === 'video' && <Video className="w-4 h-4" />}
                      {uploadedMedia.type === 'audio' && <Mic className="w-4 h-4" />}
                      <span className="text-sm">Media uploaded successfully</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadedMedia(null)}
                      data-testid="button-remove-media"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={50 * 1024 * 1024} // 50MB
                    onGetUploadParameters={handleMediaUpload}
                    onComplete={handleUploadComplete}
                    buttonClassName="w-full bg-cosmic-light/30 hover:bg-cosmic-light/50 border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2 py-8">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <div className="text-center">
                        <p className="text-sm font-medium">Upload Vision Media</p>
                        <p className="text-xs text-gray-400">Images, videos, or audio recordings</p>
                      </div>
                    </div>
                  </ObjectUploader>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700 hover:text-white hover:border-gray-500"
              data-testid="button-cancel-vision"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createVisionMutation.isPending}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              data-testid="button-create-vision"
            >
              {createVisionMutation.isPending ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Creating Vision...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Share Vision
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}