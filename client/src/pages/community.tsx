import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Search, Users, Calendar, Settings, Heart, Star, Crown, Globe, Lock, Eye, MessageCircle, TrendingUp } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { CreateCommunityModal } from "@/components/CreateCommunityModal";

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrivacy, setSelectedPrivacy] = useState("all");
  const [selectedSort, setSelectedSort] = useState("members");
  const [activeTab, setActiveTab] = useState("discover");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch communities with filters
  const { data: communities, isLoading } = useQuery({
    queryKey: ['/api/communities', searchQuery, selectedCategory, selectedPrivacy, selectedSort],
    enabled: true
  });

  // Fetch user's communities if authenticated  
  const { data: userCommunities } = useQuery({
    queryKey: ['/api/communities/my'],
    enabled: !!user
  });

  const handleJoinCommunity = async (communityId: string) => {
    try {
      const response = await fetch(`/api/communities/${communityId}/join`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['/api/communities'] });
      }
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-cosmic via-cosmic-light to-cosmic flex items-center justify-center p-4">
          <Card className="bg-cosmic-light/50 border-primary/20 max-w-md w-full">
            <CardContent className="p-8 text-center">
              <Crown className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-4">Join Our Spiritual Communities</h1>
              <p className="text-gray-300 mb-6">
                Connect with like-minded souls, share wisdom, and grow together in sacred spiritual circles.
              </p>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="w-full bg-primary hover:bg-primary/80 text-white !text-white"
                data-testid="button-sign-in"
              >
                Sign In to Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-cosmic via-cosmic-light to-cosmic">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-chakra-crown/10 rounded-full blur-2xl animate-float"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                Spiritual Communities
              </h1>
              <p className="text-gray-300">Connect with souls on similar paths and grow together</p>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
              data-testid="button-create-community"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Community
            </Button>
          </div>

          {/* Search and Filters */}
          <Card className="bg-cosmic-light/50 border-primary/20 mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search communities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-cosmic border-primary/30 text-white"
                    data-testid="input-search-communities"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-cosmic border-primary/30 text-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic border-primary/30">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="root">Root Chakra</SelectItem>
                    <SelectItem value="sacral">Sacral Chakra</SelectItem>
                    <SelectItem value="solar">Solar Plexus</SelectItem>
                    <SelectItem value="heart">Heart Chakra</SelectItem>
                    <SelectItem value="throat">Throat Chakra</SelectItem>
                    <SelectItem value="third_eye">Third Eye</SelectItem>
                    <SelectItem value="crown">Crown Chakra</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedPrivacy} onValueChange={setSelectedPrivacy}>
                  <SelectTrigger className="bg-cosmic border-primary/30 text-white">
                    <SelectValue placeholder="Privacy" />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic border-primary/30">
                    <SelectItem value="all">All Communities</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedSort} onValueChange={setSelectedSort}>
                  <SelectTrigger className="bg-cosmic border-primary/30 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic border-primary/30">
                    <SelectItem value="members">Most Members</SelectItem>
                    <SelectItem value="activity">Most Active</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Community Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="bg-cosmic-light/50 border-primary/20">
              <TabsTrigger value="discover" className="data-[state=active]:bg-primary">
                <Globe className="w-4 h-4 mr-2" />
                Discover
              </TabsTrigger>
              <TabsTrigger value="my-communities" className="data-[state=active]:bg-primary">
                <Crown className="w-4 h-4 mr-2" />
                My Communities
              </TabsTrigger>
              <TabsTrigger value="trending" className="data-[state=active]:bg-primary">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="bg-cosmic-light/50 border-primary/20 animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-40 bg-gray-700 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded mb-4"></div>
                        <div className="flex justify-between">
                          <div className="h-3 bg-gray-700 rounded w-20"></div>
                          <div className="h-8 bg-gray-700 rounded w-24"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {communities && Array.isArray(communities) && communities.map((community: any) => (
                    <CommunityCard 
                      key={community.community?.id || community.id} 
                      community={community} 
                      onJoin={handleJoinCommunity}
                    />
                  ))}
                  
                  {(!communities || !Array.isArray(communities) || communities.length === 0) && (
                    <div className="col-span-full text-center py-12">
                      <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">No communities found</h3>
                      <p className="text-gray-500 mb-6">
                        {searchQuery ? "Try adjusting your search filters" : "Be the first to create a spiritual community"}
                      </p>
                      <Button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
                        data-testid="button-create-first-community"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Community
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-communities" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCommunities && Array.isArray(userCommunities) && userCommunities.map((community: any) => (
                  <CommunityCard 
                    key={community.community?.id || community.id} 
                    community={community} 
                    onJoin={handleJoinCommunity}
                    isOwned={true}
                  />
                ))}
                
                {(!userCommunities || !Array.isArray(userCommunities) || userCommunities.length === 0) && (
                  <div className="col-span-full text-center py-12">
                    <Crown className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No communities yet</h3>
                    <p className="text-gray-500 mb-6">
                      Join or create communities to begin your spiritual journey with others
                    </p>
                    <Button 
                      onClick={() => setActiveTab("discover")}
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
                      data-testid="button-discover-communities"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Discover Communities
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="mt-6">
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Trending Communities</h3>
                <p className="text-gray-500">Coming soon - see which communities are gaining spiritual momentum</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Create Community Modal */}
      <CreateCommunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // Modal handles its own success logic
        }}
      />
    </Layout>
  );
}

function CommunityCard({ community, onJoin, isOwned = false }: { 
  community: any; 
  onJoin: (id: string) => void; 
  isOwned?: boolean;
}) {
  const chakraColors = {
    root: "bg-red-500",
    sacral: "bg-orange-500", 
    solar: "bg-yellow-500",
    heart: "bg-green-500",
    throat: "bg-blue-500",
    third_eye: "bg-indigo-500",
    crown: "bg-purple-500"
  };

  return (
    <Card className="bg-cosmic-light/50 border-primary/20 hover:border-primary/40 transition-all duration-300 group hover-lift">
      <CardContent className="p-6">
        {/* Community Image */}
        <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 overflow-hidden">
          {community.community.imageUrl ? (
            <img 
              src={community.community.imageUrl} 
              alt={community.community.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Crown className="w-12 h-12 text-primary/60" />
            </div>
          )}
          
          {/* Privacy Badge */}
          <div className="absolute top-3 right-3">
            {community.community.isPrivate ? (
              <Badge className="bg-red-500/80 text-white">
                <Lock className="w-3 h-3 mr-1" />
                Private
              </Badge>
            ) : (
              <Badge className="bg-green-500/80 text-white">
                <Globe className="w-3 h-3 mr-1" />
                Public
              </Badge>
            )}
          </div>

          {/* Chakra Badge */}
          {community.community.primaryChakra && (
            <div className="absolute top-3 left-3">
              <Badge className={`${chakraColors[community.community.primaryChakra as keyof typeof chakraColors]} text-white`}>
                {community.community.primaryChakra}
              </Badge>
            </div>
          )}
        </div>

        {/* Community Info */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
          {community.community.name}
        </h3>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {community.community.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {community.memberCount || 0} members
          </div>
          <div className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-1" />
            {community.postCount || 0} posts
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          {isOwned ? (
            <Button
              variant="outline"
              size="sm"
              className="border-primary/30 text-primary hover:bg-primary/10"
              data-testid={`button-manage-${community.community.id}`}
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage
            </Button>
          ) : (
            <Button
              onClick={() => onJoin(community.community.id)}
              className={`${community.isUserMember 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80'
              }`}
              size="sm"
              data-testid={`button-join-${community.community.id}`}
            >
              {community.isUserMember ? (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Leave
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Join
                </>
              )}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-primary"
            data-testid={`button-view-${community.community.id}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}