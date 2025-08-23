import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ObjectUploader } from "./ObjectUploader";
import { ProfileIcon } from "@/components/ProfileIcon";
import type { UploadResult } from '@uppy/core';
import logoPath from "@assets/ascended-social-high-resolution-logo-transparent (2)_1755904812375.png";

export default function CreatePost() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);

  const createPostMutation = useMutation({
    mutationFn: async (postData: { content: string; imageUrl?: string; videoUrl?: string; type?: string }) => {
      return apiRequest("POST", "/api/posts", postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setContent("");
      setMediaUrl("");
      setMediaType(null);
      toast({
        title: "Post Created",
        description: "Your spiritual insight has been shared with the community",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your post",
        variant: "destructive",
      });
      return;
    }

    const postData: any = {
      content: content.trim(),
      type: mediaType === "video" ? "spark" : "post"
    };

    if (mediaUrl) {
      if (mediaType === "image") {
        postData.imageUrl = mediaUrl;
      } else if (mediaType === "video") {
        postData.videoUrl = mediaUrl;
      }
    }

    createPostMutation.mutate(postData);
  };

  const handleGetUploadParameters = async () => {
    const response = await apiRequest("POST", "/api/objects/upload");
    const data = await response.json();
    return {
      method: 'PUT' as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      const uploadURL = uploadedFile.uploadURL;
      
      try {
        // Set ACL policy for the uploaded file
        const response = await apiRequest("PUT", "/api/media", { mediaURL: uploadURL });
        const data = await response.json();
        
        setMediaUrl(data.objectPath);
        
        // Determine media type based on file type
        const fileName = uploadedFile.name || "";
        if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          setMediaType("image");
        } else if (fileName.match(/\.(mp4|webm|mov|avi)$/i)) {
          setMediaType("video");
        }
        
        toast({
          title: "Upload Complete",
          description: "Your media has been uploaded successfully",
        });
      } catch (error) {
        console.error("Error setting media ACL:", error);
        toast({
          title: "Upload Error",
          description: "Failed to process uploaded media",
          variant: "destructive",
        });
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-cosmic-light via-cosmic-light to-cosmic border border-primary/40 rounded-2xl mb-6 shadow-2xl hover:shadow-primary/10 transition-all duration-300">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start space-x-4">
            {/* User Avatar using ProfileIcon */}
            <div className="relative group">
              <ProfileIcon 
                user={user as any}
                size="md"
                className="sigil-container w-12 h-12 shadow-lg"
                testId="create-post-avatar"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Enhanced Post Content */}
            <div className="flex-1 bg-gradient-to-b from-cosmic/30 to-cosmic-light/30 rounded-xl p-4 border border-primary/20">
              <div className="relative">
                <Textarea
                  placeholder="Share your spiritual insight..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent border-none resize-none text-white placeholder:text-primary/60 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[100px] text-lg leading-relaxed"
                  data-testid="textarea-content"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
              </div>
              
              {/* Media Preview */}
              {mediaUrl && (
                <div className="mt-3 relative">
                  {mediaType === "image" ? (
                    <img 
                      src={mediaUrl} 
                      alt="Upload preview" 
                      className="max-h-48 rounded-lg object-cover"
                      data-testid="image-preview"
                    />
                  ) : (
                    <div className="bg-cosmic rounded-lg p-4 border border-primary/30">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-video text-primary"></i>
                        <span className="text-sm text-white">Video uploaded</span>
                      </div>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-cosmic/80 hover:bg-cosmic text-white"
                    onClick={() => {
                      setMediaUrl("");
                      setMediaType(null);
                    }}
                    data-testid="button-remove-media"
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
              )}
              
              {/* Enhanced Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary/20">
                <div className="flex items-center space-x-6">
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={50 * 1024 * 1024} // 50MB
                    onGetUploadParameters={handleGetUploadParameters}
                    onComplete={handleUploadComplete}
                    buttonClassName="group relative p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-300 border-none shadow-md hover:shadow-lg"
                  >
                    <div className="relative">
                      <i className="fas fa-image text-primary group-hover:text-white transition-colors text-lg" data-testid="button-add-media"></i>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </ObjectUploader>
                  
                  <button 
                    type="button" 
                    className="group relative p-2 rounded-full bg-accent/10 hover:bg-accent/20 transition-all duration-300 shadow-md hover:shadow-lg"
                    onClick={() => alert('Spiritual Analytics - Coming soon! Track your post resonance, chakra alignment, and community impact 📊🔮')}
                    data-testid="button-add-poll"
                  >
                    <div className="relative">
                      <i className="fas fa-poll text-accent group-hover:text-white transition-colors text-lg"></i>
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </button>
                  
                  <div className="flex items-center text-xs text-white/80 ml-2">
                    <i className="fas fa-sparkles mr-1 text-primary"></i>
                    <span>Share your wisdom</span>
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  disabled={!content.trim() || createPostMutation.isPending}
                  className="relative bg-gradient-to-r from-primary via-purple-600 to-accent hover:from-primary/80 hover:via-purple-500 hover:to-accent/80 px-6 py-2.5 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] text-white border border-white/30 overflow-hidden group"
                  data-testid="button-share"
                >
                  {/* Animated background shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="relative z-10">
                    {createPostMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-white/90 font-medium">Ascending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-rocket text-white/90 transform group-hover:translate-y-[-1px] transition-transform duration-200"></i>
                        <span className="text-white/90 font-medium">Ascend</span>
                      </div>
                    )}
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
