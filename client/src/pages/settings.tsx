import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import SigilGenerator from "@/components/SigilGenerator";
import ProfilePictureChanger from "@/components/ProfilePictureChanger";
import PostCard from "@/components/PostCard";
import { Link } from "wouter";
import { 
  User, 
  Shield, 
  Bell, 
  Heart, 
  Zap, 
  MessageCircle, 
  ChevronUp, 
  Bookmark, 
  Gem,
  Activity,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  imageUrls?: string[];
  videoUrl?: string;
  chakra: string;
  frequency: number;
  type: string;
  isSpiritual?: boolean;
  createdAt: string;
  author: {
    id: string;
    username?: string;
    email?: string;
    sigil?: string;
  };
  engagements?: {
    upvote: number;
    downvote: number;
    like: number;
    energy: number;
  };
}

export default function Settings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [username, setUsername] = useState((user as any)?.username || "");
  
  // Privacy settings state
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [postsVisibility, setPostsVisibility] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowDirectMessages, setAllowDirectMessages] = useState(true);
  const [showActivityStatus, setShowActivityStatus] = useState(true);
  const [allowTagging, setAllowTagging] = useState(true);

  // Notification settings state  
  const [likeNotifications, setLikeNotifications] = useState(true);
  const [commentNotifications, setCommentNotifications] = useState(true);
  const [energyNotifications, setEnergyNotifications] = useState(true);
  const [followNotifications, setFollowNotifications] = useState(true);
  const [oracleNotifications, setOracleNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  // User activity queries
  const { data: likedPosts = [] } = useQuery<Post[]>({
    queryKey: [`/api/users/${(user as any)?.id}/activity/liked`],
    enabled: !!(user as any)?.id,
  });

  const { data: energyGivenPosts = [] } = useQuery<Post[]>({
    queryKey: [`/api/users/${(user as any)?.id}/activity/energy-given`],
    enabled: !!(user as any)?.id,
  });

  const { data: votedPosts = [] } = useQuery<Post[]>({
    queryKey: [`/api/users/${(user as any)?.id}/activity/voted`],
    enabled: !!(user as any)?.id,
  });

  const { data: commentedPosts = [] } = useQuery<Post[]>({
    queryKey: [`/api/users/${(user as any)?.id}/activity/commented`],
    enabled: !!(user as any)?.id,
  });

  const { data: bookmarkedPosts = [] } = useQuery<Post[]>({
    queryKey: ["/api/bookmarks"],
    enabled: !!(user as any)?.id,
    select: (data: any) => data || []
  });

  const { data: spiritualPosts = [] } = useQuery<Post[]>({
    queryKey: [`/api/users/${(user as any)?.id}/activity/spiritual`],
    enabled: !!(user as any)?.id,
  });

  const regenerateSigilMutation = useMutation({
    mutationFn: () => apiRequest("/api/users/regenerate-sigil", "POST"),
    onSuccess: () => {
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

  const handleUpdateUsername = () => {
    if (username.trim()) {
      updateUsernameMutation.mutate(username.trim());
    }
  };

  // Helper function to strip HTML and get plain text
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const ActivitySection = ({ title, posts, icon }: { title: string; posts: Post[]; icon: React.ReactNode }) => (
    <Card className="mb-6 bg-cosmic-light border-cosmic-light">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          {icon}
          {title}
          <Badge variant="secondary" className="bg-primary/20 text-primary">{posts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <p className="text-gray-400">No posts found in this category.</p>
        ) : (
          <div className="h-80 overflow-hidden">
            <ScrollArea className="h-full w-full">
              <div className="space-y-3 pr-4">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/?post=${post.id}`}
                    className="block cursor-pointer"
                    data-testid={`activity-post-link-${post.id}`}
                  >
                    <div className="border border-primary/20 rounded-lg p-4 bg-cosmic/50 hover:bg-cosmic/80 transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-primary/20">
                      <p className="text-sm text-white mb-3 line-clamp-3 leading-relaxed">
                        {stripHtml(post.content)}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <span className="capitalize bg-primary/20 text-primary px-2 py-1 rounded-full">
                            {post.chakra}
                          </span>
                          {post.frequency && (
                            <span className="text-yellow-400">✨ {post.frequency}Hz</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          <span className="text-primary hover:text-primary/80 transition-colors">
                            View →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-6 pt-20">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display font-bold text-white">Settings</h1>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-cosmic-light border-primary/30">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-300">Profile</TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-300">Privacy</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-300">Notifications</TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-300">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Picture Section */}
            <Card className="bg-cosmic-light border-cosmic-light">
              <CardHeader>
                <CardTitle className="text-white">Profile Picture</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfilePictureChanger />
              </CardContent>
            </Card>

            {/* Username Section */}
            <Card className="bg-cosmic-light border-cosmic-light">
              <CardHeader>
                <CardTitle className="text-white">Username</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="bg-cosmic border-primary/30 text-white placeholder:text-gray-400 focus:border-primary"
                  />
                </div>
                <Button 
                  onClick={handleUpdateUsername}
                  disabled={updateUsernameMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {updateUsernameMutation.isPending ? "Updating..." : "Update Username"}
                </Button>
              </CardContent>
            </Card>

            {/* Sigil Section */}
            <Card className="bg-cosmic-light border-cosmic-light">
              <CardHeader>
                <CardTitle className="text-white">Spiritual Sigil</CardTitle>
                <p className="text-gray-400 text-sm">Your unique spiritual signature</p>
              </CardHeader>
              <CardContent>
                <SigilGenerator />
                <div className="mt-4">
                  <Button 
                    onClick={() => regenerateSigilMutation.mutate()}
                    disabled={regenerateSigilMutation.isPending}
                    variant="outline"
                    className="border-primary text-white hover:bg-primary hover:text-white bg-transparent"
                  >
                    {regenerateSigilMutation.isPending ? "Regenerating..." : "Regenerate Sigil"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-cosmic-light border-cosmic-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="w-5 h-5" />
                  Privacy & Visibility
                </CardTitle>
                <p className="text-gray-400 text-sm">Control who can see your content and interact with you</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Profile Visibility</Label>
                    <p className="text-sm text-gray-400">Allow others to view your profile</p>
                  </div>
                  <Switch
                    checked={profileVisibility}
                    onCheckedChange={setProfileVisibility}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-600"
                  />
                </div>

                <Separator className="bg-primary/20" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Posts Visibility</Label>
                    <p className="text-sm text-gray-400">Make your posts visible to community</p>
                  </div>
                  <Switch
                    checked={postsVisibility}
                    onCheckedChange={setPostsVisibility}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-600"
                  />
                </div>

                <Separator className="bg-primary/20" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Online Status</Label>
                    <p className="text-sm text-gray-400">Show when you're active</p>
                  </div>
                  <Switch
                    checked={showOnlineStatus}
                    onCheckedChange={setShowOnlineStatus}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-600"
                  />
                </div>

                <Separator className="bg-primary/20" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Direct Messages</Label>
                    <p className="text-sm text-gray-400">Allow others to message you</p>
                  </div>
                  <Switch
                    checked={allowDirectMessages}
                    onCheckedChange={setAllowDirectMessages}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-600"
                  />
                </div>

                <Separator className="bg-primary/20" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Activity Status</Label>
                    <p className="text-sm text-gray-400">Show your recent activity to others</p>
                  </div>
                  <Switch
                    checked={showActivityStatus}
                    onCheckedChange={setShowActivityStatus}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-600"
                  />
                </div>

                <Separator className="bg-primary/20" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Allow Tagging</Label>
                    <p className="text-sm text-gray-400">Let others tag you in posts and comments</p>
                  </div>
                  <Switch
                    checked={allowTagging}
                    onCheckedChange={setAllowTagging}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-600"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-cosmic-light border-cosmic-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <p className="text-gray-400 text-sm">Choose what notifications you'd like to receive</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Like Notifications</Label>
                    <p className="text-sm text-gray-400">When someone likes your posts</p>
                  </div>
                  <Switch
                    checked={likeNotifications}
                    onCheckedChange={setLikeNotifications}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-600"
                  />
                </div>

                <Separator className="bg-primary/20" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Comment Notifications</Label>
                    <p className="text-sm text-gray-400">When someone comments on your posts</p>
                  </div>
                  <Switch
                    checked={commentNotifications}
                    onCheckedChange={setCommentNotifications}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-600"
                  />
                </div>

                <Separator className="bg-primary/20" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Energy Notifications</Label>
                    <p className="text-sm text-gray-400">When someone gives energy to your posts</p>
                  </div>
                  <Switch
                    checked={energyNotifications}
                    onCheckedChange={setEnergyNotifications}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-600"
                  />
                </div>

                <Separator className="bg-primary/20" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Follow Notifications</Label>
                    <p className="text-sm text-gray-400">When someone follows you or connects</p>
                  </div>
                  <Switch
                    checked={followNotifications}
                    onCheckedChange={setFollowNotifications}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-600"
                  />
                </div>

                <Separator className="bg-primary/20" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Oracle Notifications</Label>
                    <p className="text-sm text-gray-400">Daily readings and spiritual guidance</p>
                  </div>
                  <Switch
                    checked={oracleNotifications}
                    onCheckedChange={setOracleNotifications}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-600"
                  />
                </div>

                <Separator className="bg-primary/20" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Email Notifications</Label>
                    <p className="text-sm text-gray-400">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-600"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-white">Your Activity</h2>
            </div>

            <ActivitySection
              title="Posts You Liked"
              posts={likedPosts}
              icon={<Heart className="w-5 h-5 text-red-400" />}
            />

            <ActivitySection
              title="Posts You Gave Energy To"
              posts={energyGivenPosts}
              icon={<Zap className="w-5 h-5 text-yellow-400" />}
            />

            <ActivitySection
              title="Posts You Voted On"
              posts={votedPosts}
              icon={<ChevronUp className="w-5 h-5 text-blue-400" />}
            />

            <ActivitySection
              title="Posts You Commented On"
              posts={commentedPosts}
              icon={<MessageCircle className="w-5 h-5 text-green-400" />}
            />

            <ActivitySection
              title="Bookmarked Posts"
              posts={bookmarkedPosts}
              icon={<Bookmark className="w-5 h-5 text-purple-400" />}
            />

            <ActivitySection
              title="Posts You Marked as Spiritual"
              posts={spiritualPosts}
              icon={<Gem className="w-5 h-5 text-violet-400" />}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}