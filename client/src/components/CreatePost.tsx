import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ObjectUploader } from "./ObjectUploader";
import type { UploadResult } from '@uppy/core';

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
    <Card className="bg-cosmic-light rounded-xl mb-6 border border-primary/30">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start space-x-3">
            {/* User Sigil */}
            <div className="sigil-container w-10 h-10 rounded-full p-0.5 flex-shrink-0">
              <div className="w-full h-full bg-cosmic rounded-full flex items-center justify-center">
                {(user as any)?.sigil ? (
                  <span className="text-xs text-white font-mono" data-testid="text-user-sigil">
                    {(user as any)?.sigil}
                  </span>
                ) : (
                  <i className="fas fa-lotus text-white"></i>
                )}
              </div>
            </div>
            
            {/* Post Content */}
            <div className="flex-1">
              <Textarea
                placeholder="Share your spiritual insight..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-transparent border-none resize-none text-white placeholder:text-muted focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[80px]"
                data-testid="textarea-content"
              />
              
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
                        <span className="text-sm text-subtle">Video uploaded</span>
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
              
              {/* Actions */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-4 text-muted">
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={50 * 1024 * 1024} // 50MB
                    onGetUploadParameters={handleGetUploadParameters}
                    onComplete={handleUploadComplete}
                    buttonClassName="hover:text-primary transition-colors p-0 h-auto bg-transparent border-none"
                  >
                    <i className="fas fa-image" data-testid="button-add-media"></i>
                  </ObjectUploader>
                  
                  <button 
                    type="button" 
                    className="hover:text-primary transition-colors"
                    data-testid="button-add-poll"
                  >
                    <i className="fas fa-poll"></i>
                  </button>
                </div>
                
                <Button 
                  type="submit"
                  disabled={!content.trim() || createPostMutation.isPending}
                  className="bg-primary hover:bg-primary/80 px-6 py-2 font-medium"
                  data-testid="button-share"
                >
                  {createPostMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sharing...</span>
                    </div>
                  ) : (
                    "Share"
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
