import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import SigilGenerator from "@/components/SigilGenerator";
import { ProfileIcon } from "@/components/ProfileIcon";
import ProfilePictureChanger from "@/components/ProfilePictureChanger";

export default function ProfileSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [username, setUsername] = useState((user as any)?.username || "");

  const regenerateSigilMutation = useMutation({
    mutationFn: () => apiRequest("/api/users/regenerate-sigil", "POST"),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success",
        description: "Your spiritual sigil has been regenerated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to regenerate sigil",
        variant: "destructive",
      });
    },
  });

  const updateUsernameMutation = useMutation({
    mutationFn: (newUsername: string) => 
      apiRequest("/api/users/update-username", "POST", { username: newUsername }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success",
        description: "Username updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update username",
        variant: "destructive",
      });
    },
  });

  const handleRegenerateSigil = () => {
    regenerateSigilMutation.mutate();
  };

  const handleUpdateUsername = () => {
    if (username.trim()) {
      updateUsernameMutation.mutate(username.trim());
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 md:p-6 pt-20">
        <h1 className="text-3xl font-display font-bold mb-6 text-white">Profile Settings</h1>

        {/* Profile Picture Section */}
        <div className="mb-6">
          <ProfilePictureChanger />
        </div>

        {/* Sigil Section */}
        <div className="mb-6">
          <SigilGenerator />
        </div>

        {/* Username Section */}
        <Card className="bg-cosmic-light border-primary/30 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Username</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <ProfileIcon 
                  user={user as any}
                  size="lg"
                  className=""
                  testId="settings-profile-icon"
                />
                <div>
                  <p className="text-subtle mb-1">Your unique spiritual identifier</p>
                  <p className="text-xs text-muted font-mono">{(user as any)?.sigil || "No sigil generated"}</p>
                </div>
              </div>
              <Button
                onClick={handleRegenerateSigil}
                disabled={regenerateSigilMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-black font-semibold"
                data-testid="button-regenerate-sigil"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Regenerate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Username Section */}
        <Card className="bg-cosmic-light border-primary/30">
          <CardHeader>
            <CardTitle className="text-white">Username</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-subtle">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="bg-cosmic border-primary/30 text-white"
                  data-testid="input-username"
                />
              </div>
              <Button
                onClick={handleUpdateUsername}
                disabled={updateUsernameMutation.isPending || !username.trim()}
                className="bg-primary hover:bg-primary/90 text-black font-semibold"
                data-testid="button-update-username"
              >
                <i className="fas fa-save mr-2"></i>
                Update Username
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}