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
              size="lg"
              className="w-full h-full"
              testId="current-profile-picture"
            />
          </div>
          <p className="text-sm text-white/90 mb-4">
            {(user as any)?.profileImageUrl ? "Your current profile picture" : "Using your sigil as profile display"}
          </p>
        </div>

        <div className="space-y-3">
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
              disabled={changeProfilePictureMutation.isPending || !imageUrl.trim()}
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
              className="w-full bg-transparent border-red-600/50 text-red-400 hover:bg-red-600/20"
              data-testid="button-remove-picture"
            >
              {removeProfilePictureMutation.isPending ? "Removing..." : "Remove Picture"}
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-400 mt-3">
          <p>• Use a direct image URL (ending in .jpg, .png, etc.)</p>
          <p>• Removing your picture will show your sigil instead</p>
        </div>
      </CardContent>
    </Card>
  );
}