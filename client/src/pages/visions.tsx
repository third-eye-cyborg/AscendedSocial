import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Plus, Filter, Calendar, Sparkles, Heart, Lock, Users, Globe } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateVisionModal } from "@/components/CreateVisionModal";
import { VisionCard } from "@/components/VisionCard";
import type { VisionWithAuthor, ChakraType, VisionPrivacy } from "@shared/schema";

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
  root: "Root",
  sacral: "Sacral",
  solar: "Solar Plexus", 
  heart: "Heart",
  throat: "Throat",
  third_eye: "Third Eye",
  crown: "Crown"
};

export default function Visions() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [chakraFilter, setChakraFilter] = useState<ChakraType | "all">("all");
  const [privacyFilter, setPrivacyFilter] = useState<VisionPrivacy | "all">("all");
  const queryClient = useQueryClient();

  // Fetch visions based on current tab and filters
  const { data: visions, isLoading } = useQuery({
    queryKey: ['/api/visions', selectedTab, chakraFilter, privacyFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedTab !== "all") params.set("tab", selectedTab);
      if (chakraFilter !== "all") params.set("chakra", chakraFilter);
      if (privacyFilter !== "all") params.set("privacy", privacyFilter);
      
      const response = await fetch(`/api/visions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch visions');
      return response.json() as VisionWithAuthor[];
    }
  });

  // Fetch user's vision stats
  const { data: stats } = useQuery({
    queryKey: ['/api/visions/stats'],
    queryFn: async () => {
      const response = await fetch('/api/visions/stats');
      if (!response.ok) throw new Error('Failed to fetch vision stats');
      return response.json();
    }
  });

  const getPrivacyIcon = (privacy: VisionPrivacy) => {
    switch (privacy) {
      case "public": return <Globe className="w-3 h-3" />;
      case "friends": return <Users className="w-3 h-3" />;
      case "private": return <Lock className="w-3 h-3" />;
    }
  };

  const getPrivacyLabel = (privacy: VisionPrivacy) => {
    switch (privacy) {
      case "public": return "Public";
      case "friends": return "Friends Only";
      case "private": return "Private";
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto px-4 py-8 xl:px-6 2xl:px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-2xl blur-xl"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Spiritual Visions
                </h1>
                <p className="text-gray-400 mt-1">Manifest your spiritual insights and connect with divine guidance</p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
              data-testid="button-create-vision"
            >
              <Plus className="w-4 h-4 mr-2" />
              Share Vision
            </Button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card className="bg-cosmic-light/50 border-purple-500/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{stats.totalVisions}</div>
                  <div className="text-xs text-gray-400">Total Visions</div>
                </CardContent>
              </Card>
              <Card className="bg-cosmic-light/50 border-green-500/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{stats.manifestedVisions}</div>
                  <div className="text-xs text-gray-400">Manifested</div>
                </CardContent>
              </Card>
              <Card className="bg-cosmic-light/50 border-blue-500/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{stats.averageEnergyLevel}</div>
                  <div className="text-xs text-gray-400">Avg Energy</div>
                </CardContent>
              </Card>
              <Card className="bg-cosmic-light/50 border-yellow-500/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{stats.dominantChakra}</div>
                  <div className="text-xs text-gray-400">Dominant Chakra</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <TabsList className="bg-cosmic-light/50 border border-primary/20">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-white"
                data-testid="tab-all-visions"
              >
                All Visions
              </TabsTrigger>
              <TabsTrigger 
                value="my-visions"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-white"
                data-testid="tab-my-visions"
              >
                My Visions
              </TabsTrigger>
              <TabsTrigger 
                value="friends"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-white"
                data-testid="tab-friends-visions"
              >
                Friends' Visions
              </TabsTrigger>
              <TabsTrigger 
                value="manifested"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-white"
                data-testid="tab-manifested"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Manifested
              </TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="flex gap-3">
              <Select value={chakraFilter} onValueChange={(value) => setChakraFilter(value as ChakraType | "all")}>
                <SelectTrigger className="w-40 bg-cosmic-light/50 border-primary/20" data-testid="select-chakra-filter">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Chakra" />
                </SelectTrigger>
                <SelectContent className="bg-cosmic border-primary/20">
                  <SelectItem value="all">All Chakras</SelectItem>
                  {Object.entries(chakraLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${chakraColors[key as ChakraType]}`} />
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={privacyFilter} onValueChange={(value) => setPrivacyFilter(value as VisionPrivacy | "all")}>
                <SelectTrigger className="w-40 bg-cosmic-light/50 border-primary/20" data-testid="select-privacy-filter">
                  <SelectValue placeholder="Privacy" />
                </SelectTrigger>
                <SelectContent className="bg-cosmic border-primary/20">
                  <SelectItem value="all">All Privacy</SelectItem>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3" />
                      Public
                    </div>
                  </SelectItem>
                  <SelectItem value="friends">
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      Friends Only
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      Private
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vision Content */}
          <TabsContent value={selectedTab} className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-cosmic-light/50 border-primary/20 animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-40 bg-primary/10 rounded-lg mb-4"></div>
                      <div className="h-4 bg-primary/10 rounded mb-2"></div>
                      <div className="h-3 bg-primary/10 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : visions && visions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visions.map((vision) => (
                  <VisionCard 
                    key={vision.id} 
                    vision={vision}
                    onUpdate={() => queryClient.invalidateQueries({ queryKey: ['/api/visions'] })}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-cosmic-light/50 border-primary/20">
                <CardContent className="p-12 text-center">
                  <Eye className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No visions found</h3>
                  <p className="text-gray-500 mb-6">
                    {selectedTab === "my-visions" 
                      ? "Share your first spiritual vision to begin your manifestation journey"
                      : "No visions match your current filters"}
                  </p>
                  {selectedTab === "my-visions" && (
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      data-testid="button-create-first-vision"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Share Your First Vision
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Create Vision Modal */}
        <CreateVisionModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            queryClient.invalidateQueries({ queryKey: ['/api/visions'] });
          }}
        />
    </Layout>
  );
}