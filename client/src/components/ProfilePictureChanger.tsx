import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ProfileIcon } from "@/components/ProfileIcon";

export default function ProfilePictureChanger() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get user data
  const { data: user } = useQuery({ queryKey: ["/api/auth/user"] });

  const changeProfilePictureMutation = useMutation({
    mutationFn: async (imageUrl: string) => {
      return apiRequest("PUT", "/api/profile-image", { imageUrl });
    },
    onSuccess: async () => {
      setImageUrl("");
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been changed",
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

  const removeProfilePictureMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PUT", "/api/profile-image", { imageUrl: null });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profile Picture Removed",
        description: "Your profile picture has been removed",
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please choose an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please choose an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Use server-side upload endpoint to avoid CORS issues
      const formData = new FormData();
      formData.append('image', file);
      
      const uploadResponse = await fetch('/api/upload-profile-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || `Upload failed: ${uploadResponse.status}`);
      }
      
      const data = await uploadResponse.json();
      console.log("Upload successful:", data);
      
      // The response includes the updated user with new profile image
      // Refresh the cache to show the new image
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      toast({
        title: "Upload Successful",
        description: "Your profile picture has been updated",
      });
      
      // Clear file input
      event.target.value = '';
      
    } catch (error) {
      console.error("Upload error details:", error);
      toast({
        title: "Upload Failed",
        description: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-slate-900 border border-slate-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-accent-light flex items-center">
          <i className="fas fa-user-circle mr-2"></i>
          Profile Picture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4">
            <ProfileIcon 
              user={user as any}
              size="xl"
              className="shadow-lg"
              testId="current-profile-picture"
            />
          </div>
          <p className="text-sm text-white/90 mb-4">
            {(user as any)?.profileImageUrl ? "Your current profile picture" : "Using your sigil as profile display"}
          </p>
        </div>

        <div className="space-y-3">
          {/* File Upload Option */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-white/90 font-medium">Upload Image File</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="bg-slate-800 border border-slate-600 rounded-md p-2 text-white file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary file:text-black file:font-medium hover:file:bg-primary/80"
              data-testid="input-file-upload"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-400">Or use URL</span>
            </div>
          </div>

          {/* URL Input Option */}
          <div className="flex flex-col space-y-2">
            <Input
              type="url"
              placeholder="Enter image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder-gray-400"
              data-testid="input-image-url"
            />
            <Button
              onClick={() => changeProfilePictureMutation.mutate(imageUrl)}
              disabled={changeProfilePictureMutation.isPending || isUploading || !imageUrl.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-change-picture"
            >
              {changeProfilePictureMutation.isPending ? "Updating..." : "Change Picture"}
            </Button>
          </div>

          {(user as any)?.profileImageUrl && (
            <Button
              onClick={() => removeProfilePictureMutation.mutate()}
              disabled={removeProfilePictureMutation.isPending}
              variant="outline"
              className="w-full bg-transparent border-red-500/60 text-white hover:bg-red-600/20 hover:text-white"
              data-testid="button-remove-picture"
            >
              {removeProfilePictureMutation.isPending ? "Removing..." : "Remove Picture"}
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-400 mt-3">
          <p>• Upload files up to 5MB in size</p>
          <p>• Or use a direct image URL (ending in .jpg, .png, etc.)</p>
          <p>• Removing your picture will show your sigil instead</p>
        </div>
      </CardContent>
    </Card>
  );
}