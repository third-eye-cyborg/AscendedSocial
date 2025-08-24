import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/PostCard";
import { TrendingUp, TrendingDown, Heart, Users, Sparkles, Filter } from "lucide-react";

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
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
    comments?: number;
  };
}

export default function Explore() {
  const [filterCategory, setFilterCategory] = useState("trending");
  const [chakraFilter, setChakraFilter] = useState("all");
  const [spiritualFilter, setSpiritualFilter] = useState("all");
  const [sortMode, setSortMode] = useState("frequency"); // "frequency", "above_below", "recent"

  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  // Filter and sort posts based on current filters
  const filteredPosts = useMemo(() => {
    if (!(posts as Post[]).length) return [];
    
    let filtered = [...(posts as Post[])] as Post[];
    
    // Apply chakra filter
    if (chakraFilter !== "all") {
      filtered = filtered.filter(post => post.chakra === chakraFilter);
    }
    
    // Apply spiritual filter
    if (spiritualFilter === "spiritual") {
      filtered = filtered.filter(post => post.isSpiritual);
    } else if (spiritualFilter === "non_spiritual") {
      filtered = filtered.filter(post => !post.isSpiritual);
    }
    
    // Apply category filter
    switch (filterCategory) {
      case "trending":
        // Trending = high frequency posts from last 24 hours
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        filtered = filtered
          .filter(post => new Date(post.createdAt) > dayAgo)
          .sort((a, b) => (b.frequency || 0) - (a.frequency || 0));
        break;
      case "for_you":
        // For You = mix of different chakras, moderate to high frequency
        filtered = filtered
          .filter(post => (post.frequency || 0) > -5)
          .sort((a, b) => {
            // Mix by frequency and recency
            const scoreA = (a.frequency || 0) + (new Date(a.createdAt).getTime() / 1000000000);
            const scoreB = (b.frequency || 0) + (new Date(b.createdAt).getTime() / 1000000000);
            return scoreB - scoreA;
          });
        break;
      case "friends":
        // Friends posts (for now, just recent posts)
        filtered = filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "spiritual":
        // Only spiritual posts
        filtered = filtered
          .filter(post => post.isSpiritual)
          .sort((a, b) => (b.frequency || 0) - (a.frequency || 0));
        break;
    }
    
    return filtered;
  }, [posts, filterCategory, chakraFilter, spiritualFilter]);

  // Split posts for above/below view
  const { positivePosts, negativePosts } = useMemo(() => {
    const positive = filteredPosts.filter(post => (post.frequency || 0) >= 0)
      .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
      .slice(0, 10);
    const negative = filteredPosts.filter(post => (post.frequency || 0) < 0)
      .sort((a, b) => (a.frequency || 0) - (b.frequency || 0))
      .slice(0, 10);
    return { positivePosts: positive, negativePosts: negative };
  }, [filteredPosts]);

  const chakraOptions = [
    { value: "all", label: "All Chakras" },
    { value: "root", label: "🔴 Root" },
    { value: "sacral", label: "🟠 Sacral" },
    { value: "solar", label: "🟡 Solar" },
    { value: "heart", label: "💚 Heart" },
    { value: "throat", label: "🔵 Throat" },
    { value: "third_eye", label: "🟣 Third Eye" },
    { value: "crown", label: "🟤 Crown" },
  ];

  const categoryStats = useMemo(() => {
    const spiritual = (posts as Post[]).filter((p: Post) => p.isSpiritual).length;
    const trending = (posts as Post[]).filter((p: Post) => {
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return new Date(p.createdAt) > dayAgo && (p.frequency || 0) > 5;
    }).length;
    
    return { spiritual, trending, total: (posts as Post[]).length };
  }, [posts]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">✨ Discovering cosmic wisdom...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2 bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent">
            🔮 Cosmic Exploration
          </h1>
          <p className="text-white/80 text-lg">
            Discover trending wisdom, spiritual insights, and mystical connections across the universe
          </p>
          
          {/* Quick Stats */}
          <div className="flex items-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>{categoryStats.trending} Trending</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{categoryStats.spiritual} Spiritual</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-pink-400" />
              <span>{categoryStats.total} Total Posts</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <Card className="bg-cosmic-light/50 border-primary/30 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-white">Filters:</span>
              </div>
              
              {/* Category Filter */}
              <div>
                <label className="text-xs text-white/70 block mb-1">Category</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40 bg-cosmic-dark/50 border-primary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic-dark border-primary/30">
                    <SelectItem value="trending">🔥 Trending</SelectItem>
                    <SelectItem value="for_you">✨ For You</SelectItem>
                    <SelectItem value="friends">👥 Friends</SelectItem>
                    <SelectItem value="spiritual">🔮 Spiritual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Chakra Filter */}
              <div>
                <label className="text-xs text-white/70 block mb-1">Chakra</label>
                <Select value={chakraFilter} onValueChange={setChakraFilter}>
                  <SelectTrigger className="w-40 bg-cosmic-dark/50 border-primary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic-dark border-primary/30">
                    {chakraOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Spiritual Filter */}
              <div>
                <label className="text-xs text-white/70 block mb-1">Spiritual</label>
                <Select value={spiritualFilter} onValueChange={setSpiritualFilter}>
                  <SelectTrigger className="w-40 bg-cosmic-dark/50 border-primary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic-dark border-primary/30">
                    <SelectItem value="all">🌌 All Posts</SelectItem>
                    <SelectItem value="spiritual">🔮 Spiritual</SelectItem>
                    <SelectItem value="non_spiritual">💭 General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Sort Mode Toggle */}
            <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-primary/20">
              <span className="text-sm font-semibold text-white">View:</span>
              <div className="flex space-x-2">
                <Button
                  variant={sortMode === "frequency" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortMode("frequency")}
                  className="text-xs"
                >
                  📊 Standard
                </Button>
                <Button
                  variant={sortMode === "above_below" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortMode("above_below")}
                  className="text-xs"
                >
                  ⚡ Above/Below
                </Button>
                <Button
                  variant={sortMode === "recent" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortMode("recent")}
                  className="text-xs"
                >
                  🕒 Recent
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {sortMode === "above_below" ? (
          /* Above/Below Split View */
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Positive Energy Posts */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-semibold text-green-400">✨ Above (Positive Energy)</h2>
                <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-500/30">
                  {positivePosts.length}
                </Badge>
              </div>
              <div className="space-y-4">
                {positivePosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
                {positivePosts.length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    🌟 No positive energy posts found
                  </div>
                )}
              </div>
            </div>
            
            {/* Negative Energy Posts */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-semibold text-red-400">🌊 Below (Constructive Energy)</h2>
                <Badge variant="outline" className="bg-red-900/30 text-red-300 border-red-500/30">
                  {negativePosts.length}
                </Badge>
              </div>
              <div className="space-y-4">
                {negativePosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
                {negativePosts.length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    🌊 No constructive energy posts found
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Standard Grid View */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {filterCategory === "trending" && "🔥 Trending Posts"}
                {filterCategory === "for_you" && "✨ Recommended for You"}
                {filterCategory === "friends" && "👥 Friend Posts"}
                {filterCategory === "spiritual" && "🔮 Spiritual Posts"}
              </h2>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                {filteredPosts.length} posts
              </Badge>
            </div>
            
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔮</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
                  <p className="text-white/60">Try adjusting your filters to discover more content</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}