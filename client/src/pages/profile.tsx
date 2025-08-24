import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import SigilGenerator from "@/components/SigilGenerator";
import SpiritGenerator from "@/components/SpiritGenerator";
import ExpandableImage from "@/components/ExpandableImage";
import ProfilePictureChanger from "@/components/ProfilePictureChanger";
import { getChakraColor } from "@/lib/chakras";
import { formatDistanceToNow } from "date-fns";
import { ProfileIcon } from "@/components/ProfileIcon";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    bio: "",
  });

  const { data: userProfile, isLoading: userLoading } = useQuery({
    queryKey: ["/api/users", userId],
    enabled: !!userId,
  });

  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/users", userId, "stats"],
    enabled: !!userId,
  });

  const { data: userPosts, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/users", userId, "posts"],
    enabled: !!userId,
  });

  const isOwnProfile = currentUser && (currentUser as any)?.id === userId;

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: { username?: string; bio?: string }) => {
      return apiRequest("PUT", `/api/users/${userId}`, profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId] });
      setIsEditModalOpen(false);
      toast({
        title: "✨ Profile Updated!",
        description: "Your spiritual profile has been updated successfully",
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

  // Initialize form when profile data loads
  useEffect(() => {
    if (userProfile) {
      setEditForm({
        username: (userProfile as any)?.username || "",
        bio: (userProfile as any)?.bio || "",
      });
    }
  }, [userProfile]);

  const handleSaveProfile = () => {
    if (!editForm.username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }
    updateProfileMutation.mutate(editForm);
  };

  if (userLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="bg-cosmic-light border border-primary/30">
                <CardHeader>
                  <div className="flex flex-col items-center">
                    <Skeleton className="w-24 h-24 rounded-full mb-4" />
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-8 w-48 mb-6" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full mb-4" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!userProfile) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
              <i className="fas fa-user-slash text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-subtle mb-2">User not found</h3>
            <p className="text-muted">This spiritual seeker seems to have vanished into the ether.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const profile = userProfile as any;
  const stats = userStats as any;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20 sm:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-cosmic-light border border-primary/30 hover-lift animate-fade-in">
              <CardHeader>
                <div className="flex flex-col items-center text-center">
                  {/* Profile Avatar using unified ProfileIcon */}
                  <div className="mb-4">
                    {(profile as any)?.profileImageUrl || (profile as any)?.sigilImageUrl ? (
                      <ExpandableImage
                        src={(profile as any)?.profileImageUrl || (profile as any)?.sigilImageUrl}
                        alt="Profile Picture"
                        title={`${(profile as any)?.username || 'User'}'s ${(profile as any)?.profileImageUrl ? 'Profile Picture' : 'Spiritual Sigil'}`}
                      >
                        <ProfileIcon 
                          user={profile}
                          size="xl"
                          className="shadow-2xl"
                          testId="profile-avatar"
                        />
                      </ExpandableImage>
                    ) : (
                      <ProfileIcon 
                        user={profile}
                        size="xl"
                        className="shadow-2xl"
                        testId="profile-avatar"
                      />
                    )}
                  </div>

                  {/* User Info */}
                  <h2 className="text-xl font-semibold text-white mb-1" data-testid="text-profile-name">
                    {profile?.username || profile?.email || 'Spiritual Seeker'}
                  </h2>
                  <p className="text-sm text-muted mb-3">
                    Joined {formatDistanceToNow(new Date(profile?.createdAt || Date.now()), { addSuffix: true })}
                  </p>

                  {/* Aura Level */}
                  <div className="w-full mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Aura Level</span>
                      <span className="text-primary" data-testid="text-profile-aura">
                        Level {stats?.auraLevel || 1}
                      </span>
                    </div>
                    <div className="w-full bg-cosmic rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (stats?.auraLevel || 1) * 10)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Spiritual Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary" data-testid="text-profile-posts">
                      {stats?.totalPosts || 0}
                    </div>
                    <div className="text-xs text-muted">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-accent-light" data-testid="text-profile-energy">
                      {stats?.totalEngagements || 0}
                    </div>
                    <div className="text-xs text-muted">Engagements</div>
                  </div>
                </div>

                {/* Premium Status */}
                {profile?.isPremium && (
                  <div className="text-center py-3 px-4 bg-gradient-to-r from-primary/20 to-accent-light/20 rounded-lg border border-primary/30">
                    <i className="fas fa-crown text-accent-light mb-2"></i>
                    <p className="text-sm font-medium text-accent-light">Premium Member</p>
                    <p className="text-xs text-muted">Ascended Soul</p>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  {isOwnProfile ? (
                    <>
                      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full bg-primary hover:bg-primary/80"
                            data-testid="button-edit-profile"
                          >
                            <i className="fas fa-edit mr-2"></i>
                            Edit Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-cosmic-light border border-primary/30 text-white max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-accent-light">Edit Your Spiritual Profile</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="username" className="text-white">Username</Label>
                              <Input
                                id="username"
                                value={editForm.username}
                                onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                                placeholder="Enter your spiritual name"
                                className="bg-cosmic border-primary/30 text-white"
                                data-testid="input-edit-username"
                              />
                            </div>
                            <div>
                              <Label htmlFor="bio" className="text-white">Bio</Label>
                              <Textarea
                                id="bio"
                                value={editForm.bio}
                                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                                placeholder="Share your spiritual journey..."
                                className="bg-cosmic border-primary/30 text-white min-h-[80px]"
                                data-testid="textarea-edit-bio"
                              />
                            </div>
                            <div className="flex space-x-3">
                              <Button
                                variant="outline"
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 bg-transparent border-primary/50 text-white hover:bg-primary/20 hover:text-white"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleSaveProfile}
                                disabled={updateProfileMutation.isPending}
                                className="flex-1 bg-primary hover:bg-primary/80"
                                data-testid="button-save-profile"
                              >
                                {updateProfileMutation.isPending ? (
                                  <>
                                    <i className="fas fa-spinner animate-spin mr-2"></i>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-save mr-2"></i>
                                    Save
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <ProfilePictureChanger />
                      <SigilGenerator />
                      <SpiritGenerator />
                    </>
                  ) : (
                    <>
                      <Button 
                        className="w-full bg-primary hover:bg-primary/80"
                        data-testid="button-follow"
                      >
                        <i className="fas fa-plus mr-2"></i>
                        Follow
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full border-primary/50 text-primary hover:bg-primary/10"
                        data-testid="button-message"
                      >
                        <i className="fas fa-envelope mr-2"></i>
                        Message
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Posts Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-display font-semibold text-white">
                {isOwnProfile ? 'Your' : `${profile?.username || 'Their'}'s`} Posts
              </h3>
              <div className="text-sm text-muted">
                {stats?.totalPosts || 0} spiritual insights shared
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {postsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-cosmic-light rounded-xl p-4 border border-primary/30">
                    <div className="flex items-center space-x-3 mb-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-20 w-full mb-4" />
                    <div className="flex space-x-6">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                ))
              ) : userPosts && Array.isArray(userPosts) && userPosts.length > 0 ? (
                <>
                  {(userPosts as any[]).map((post: any) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                    <i className="fas fa-feather text-primary text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-subtle mb-2">
                    {isOwnProfile ? "You haven't posted yet" : "No posts yet"}
                  </h3>
                  <p className="text-muted mb-4">
                    {isOwnProfile 
                      ? "Share your spiritual journey with the community" 
                      : "This seeker hasn't shared their insights yet"
                    }
                  </p>
                  {isOwnProfile && (
                    <Button 
                      onClick={() => window.location.href = '/'}
                      className="bg-primary hover:bg-primary/80"
                    >
                      Create Your First Post
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}