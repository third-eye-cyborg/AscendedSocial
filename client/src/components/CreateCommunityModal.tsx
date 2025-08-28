import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Crown, Users, Lock, Globe, Image, X, Sparkles, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { ChakraType } from "@shared/schema";

interface CreateCommunityModalProps {
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
  root: "Root - Grounding & Security",
  sacral: "Sacral - Creativity & Passion",
  solar: "Solar Plexus - Personal Power", 
  heart: "Heart - Love & Compassion",
  throat: "Throat - Communication & Truth",
  third_eye: "Third Eye - Intuition & Wisdom",
  crown: "Crown - Spirituality & Unity"
};

export function CreateCommunityModal({ isOpen, onClose, onSuccess }: CreateCommunityModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [primaryChakra, setPrimaryChakra] = useState<ChakraType | "">("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [guidelines, setGuidelines] = useState("");
  const [spiritualFocus, setSpiritualFocus] = useState<string[]>([]);
  const [newFocus, setNewFocus] = useState("");
  const [maxMembers, setMaxMembers] = useState("1000");
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    cloudflareId?: string;
  } | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCommunityMutation = useMutation({
    mutationFn: async (communityData: any) => {
      const response = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(communityData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create community');
      }

      return response.json();
    },
    onSuccess: () => {
      // Reset form
      setName("");
      setDescription("");
      setIsPrivate(false);
      setRequiresApproval(false);
      setPrimaryChakra("");
      setTags([]);
      setNewTag("");
      setGuidelines("");
      setSpiritualFocus([]);
      setNewFocus("");
      setMaxMembers("1000");
      setUploadedImage(null);

      // Refresh communities data
      queryClient.invalidateQueries({ queryKey: ['/api/communities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/communities/my'] });

      toast({
        title: "🌟 Community Created!",
        description: "Your spiritual community has been created successfully.",
      });

      onSuccess();
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and description for your community.",
        variant: "destructive",
      });
      return;
    }

    const communityData = {
      name: name.trim(),
      description: description.trim(),
      isPrivate,
      requiresApproval,
      primaryChakra: primaryChakra || null,
      tags: tags.length > 0 ? tags : null,
      guidelines: guidelines.trim() || null,
      spiritualFocus: spiritualFocus.length > 0 ? spiritualFocus : null,
      maxMembers: parseInt(maxMembers),
      imageUrl: uploadedImage?.url || null,
      cloudflareImageId: uploadedImage?.cloudflareId || null,
    };

    createCommunityMutation.mutate(communityData);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addFocus = () => {
    if (newFocus.trim() && !spiritualFocus.includes(newFocus.trim()) && spiritualFocus.length < 10) {
      setSpiritualFocus([...spiritualFocus, newFocus.trim()]);
      setNewFocus("");
    }
  };

  const removeFocus = (focusToRemove: string) => {
    setSpiritualFocus(spiritualFocus.filter(focus => focus !== focusToRemove));
  };

  const handleImageUpload = (results: any[]) => {
    if (results.length > 0) {
      const result = results[0];
      setUploadedImage({
        url: result.url,
        cloudflareId: result.cloudflareId,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cosmic border-primary/30 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center">
            <Crown className="w-6 h-6 mr-2 text-primary" />
            Create Spiritual Community
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-cosmic-light/30 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="community-name">Community Name *</Label>
                  <Input
                    id="community-name"
                    placeholder="Sacred Circle of Light"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-cosmic border-primary/30 text-white"
                    data-testid="input-community-name"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-members">Maximum Members</Label>
                  <Input
                    id="max-members"
                    type="number"
                    placeholder="1000"
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(e.target.value)}
                    className="bg-cosmic border-primary/30 text-white"
                    min="10"
                    max="10000"
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="A sacred space for spiritual seekers to connect, share wisdom, and grow together in divine light..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-cosmic border-primary/30 text-white min-h-24"
                  data-testid="textarea-community-description"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-400">{description.length}/1000 characters</p>
              </div>
            </CardContent>
          </Card>

          {/* Spiritual Focus */}
          <Card className="bg-cosmic-light/30 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Spiritual Configuration</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Chakra Focus</Label>
                  <Select value={primaryChakra} onValueChange={(value) => setPrimaryChakra(value as ChakraType | "")}>
                    <SelectTrigger className="bg-cosmic border-primary/30 text-white">
                      <SelectValue placeholder="Select primary chakra (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-cosmic border-primary/30">
                      <SelectItem value="">No primary focus</SelectItem>
                      {Object.entries(chakraLabels).map(([chakra, label]) => (
                        <SelectItem key={chakra} value={chakra}>
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${chakraColors[chakra as keyof typeof chakraColors]} mr-2`}></div>
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Community Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-primary/20 text-primary">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-primary/70 hover:text-primary"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag (e.g., meditation, healing, crystals)"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="bg-cosmic border-primary/30 text-white"
                      maxLength={30}
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      variant="outline"
                      size="sm"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                      disabled={tags.length >= 10}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">{tags.length}/10 tags</p>
                </div>

                {/* Spiritual Focus Areas */}
                <div className="space-y-2">
                  <Label>Spiritual Focus Areas</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {spiritualFocus.map((focus, index) => (
                      <Badge key={index} variant="secondary" className="bg-secondary/20 text-secondary">
                        {focus}
                        <button
                          type="button"
                          onClick={() => removeFocus(focus)}
                          className="ml-2 text-secondary/70 hover:text-secondary"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add focus area (e.g., mindfulness, energy healing)"
                      value={newFocus}
                      onChange={(e) => setNewFocus(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFocus())}
                      className="bg-cosmic border-primary/30 text-white"
                      maxLength={50}
                    />
                    <Button
                      type="button"
                      onClick={addFocus}
                      variant="outline"
                      size="sm"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                      disabled={spiritualFocus.length >= 10}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">{spiritualFocus.length}/10 focus areas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Image */}
          <Card className="bg-cosmic-light/30 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Community Image</h3>
              
              {uploadedImage ? (
                <div className="relative">
                  <img 
                    src={uploadedImage.url} 
                    alt="Community"
                    className="w-full h-48 object-cover rounded-lg border-2 border-primary/30"
                  />
                  <Button
                    type="button"
                    onClick={() => setUploadedImage(null)}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-8">
                  <div className="text-center">
                    <Image className="w-12 h-12 text-primary/60 mx-auto mb-4" />
                    <p className="text-primary mb-2">Upload Community Image</p>
                    <p className="text-sm text-gray-400">Image upload will be available soon</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="bg-cosmic-light/30 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Community Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Private Community</Label>
                    <p className="text-sm text-gray-400">Only invited members can see and join</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className={`w-4 h-4 ${!isPrivate ? 'text-green-500' : 'text-gray-400'}`} />
                    <Switch
                      checked={isPrivate}
                      onCheckedChange={setIsPrivate}
                      data-testid="switch-private-community"
                    />
                    <Lock className={`w-4 h-4 ${isPrivate ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Require Approval</Label>
                    <p className="text-sm text-gray-400">Review join requests before accepting members</p>
                  </div>
                  <Switch
                    checked={requiresApproval}
                    onCheckedChange={setRequiresApproval}
                    data-testid="switch-requires-approval"
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="guidelines">Community Guidelines</Label>
                <Textarea
                  id="guidelines"
                  placeholder="Share the sacred principles and guidelines that will help maintain a harmonious and respectful spiritual environment..."
                  value={guidelines}
                  onChange={(e) => setGuidelines(e.target.value)}
                  className="bg-cosmic border-primary/30 text-white min-h-24"
                  maxLength={2000}
                />
                <p className="text-xs text-gray-400">{guidelines.length}/2000 characters</p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
              data-testid="button-cancel-community"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createCommunityMutation.isPending || !name.trim() || !description.trim()}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
              data-testid="button-create-community-submit"
            >
              {createCommunityMutation.isPending ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Creating Community...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Create Community
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}