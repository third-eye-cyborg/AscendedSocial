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
      <CardContent className="p-3 sm:p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start space-x-2 sm:space-x-4">
            {/* User Avatar using ProfileIcon */}
            <div className="relative group">
              <ProfileIcon 
                user={user as any}
                size="md"
                className="sigil-container w-10 h-10 sm:w-12 sm:h-12 shadow-lg"
                testId="create-post-avatar"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Enhanced Post Content */}
            <div className="flex-1 bg-gradient-to-b from-cosmic/30 to-cosmic-light/30 rounded-xl p-3 sm:p-4 border border-primary/20">
              <div className="relative">
                <Textarea
                  placeholder="Share your spiritual insight..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent border-none resize-none text-white placeholder:text-primary/60 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[80px] sm:min-h-[100px] text-sm sm:text-lg leading-relaxed"
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
              
              {/* Clean Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-primary/20 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {/* Simple File Upload */}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="file-upload"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const params = await handleGetUploadParameters();
                          
                          const response = await fetch(params.url, {
                            method: params.method,
                            body: file,
                            headers: {
                              'Content-Type': file.type,
                            },
                          });
                          
                          if (response.ok) {
                            const publicUrl = params.url.split('?')[0];
                            
                            // Set ACL policy for the uploaded file
                            const aclResponse = await apiRequest("PUT", "/api/media", { mediaURL: params.url });
                            const aclData = await aclResponse.json();
                            
                            setMediaUrl(aclData.objectPath);
                            setMediaType("image");
                            
                            toast({
                              title: "Image uploaded successfully",
                              description: "Your image is ready to share",
                            });
                          }
                        } catch (error) {
                          console.error('Upload failed:', error);
                          toast({
                            title: "Upload failed",
                            description: "Please try again",
                            variant: "destructive",
                          });
                        }
                      }
                    }}
                    data-testid="input-file-upload"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-white text-xs sm:text-sm"
                    data-testid="button-add-media"
                  >
                    <i className="fas fa-image"></i>
                    <span>Add Image</span>
                  </label>
                  
                  <div className="hidden sm:flex items-center text-xs text-white/60">
                    <i className="fas fa-sparkles mr-1 text-primary/70"></i>
                    <span>Share your wisdom</span>
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  disabled={!content.trim() || createPostMutation.isPending}
                  className="bg-primary hover:bg-primary/80 px-4 sm:px-6 py-2 rounded-lg transition-colors text-white font-medium text-sm sm:text-base w-full sm:w-auto"
                  data-testid="button-share"
                >
                  {createPostMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                      <span>Sharing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-paper-plane"></i>
                      <span>Share</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
