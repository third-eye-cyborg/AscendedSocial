import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ProfileIcon } from "@/components/ProfileIcon";
import { getChakraColor } from "@/lib/chakras";
import { formatDistanceToNow } from "date-fns";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  type: 'post' | 'user';
  id: string;
  title: string;
  content: string;
  author?: {
    id: string;
    username?: string;
    email?: string;
    sigil?: string;
  };
  chakra?: string;
  createdAt?: string;
  auraLevel?: number;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"all" | "posts" | "users">("all");

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ["/api/search", searchQuery, searchType],
    enabled: searchQuery.length >= 2,
    retry: false,
  });

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'user') {
      window.location.href = `/profile/${result.id}`;
    } else if (result.type === 'post') {
      // Close modal and scroll to the post if it exists on the current page
      onClose();
      setTimeout(() => {
        const postElement = document.querySelector(`[data-testid="post-${result.id}"]`);
        if (postElement) {
          postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add a subtle highlight effect
          postElement.classList.add('ring-2', 'ring-primary', 'ring-opacity-50');
          setTimeout(() => {
            postElement.classList.remove('ring-2', 'ring-primary', 'ring-opacity-50');
          }, 3000);
        } else {
          // If post not found on current page, navigate to home page
          window.location.href = `/`;
        }
      }, 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cosmic-light border-primary/30 max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-white font-display">Search Ascended Social</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex space-x-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for posts, users, spiritual insights..."
              className="flex-1 bg-cosmic border-primary/30 text-white placeholder:text-muted focus:border-primary"
              data-testid="input-search"
              autoFocus
            />
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-primary/50 text-primary hover:bg-primary/10"
              data-testid="button-close-search"
            >
              <i className="fas fa-times"></i>
            </Button>
          </div>

          {/* Search Type Filters */}
          <div className="flex space-x-2">
            <Button
              variant={searchType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSearchType("all")}
              className={`${searchType === "all" ? "bg-primary text-white" : "border-primary/50 text-primary hover:bg-primary/10"}`}
              data-testid="filter-all"
            >
              All
            </Button>
            <Button
              variant={searchType === "posts" ? "default" : "outline"}
              size="sm"
              onClick={() => setSearchType("posts")}
              className={`${searchType === "posts" ? "bg-primary text-white" : "border-primary/50 text-primary hover:bg-primary/10"}`}
              data-testid="filter-posts"
            >
              Posts
            </Button>
            <Button
              variant={searchType === "users" ? "default" : "outline"}
              size="sm"
              onClick={() => setSearchType("users")}
              className={`${searchType === "users" ? "bg-primary text-white" : "border-primary/50 text-primary hover:bg-primary/10"}`}
              data-testid="filter-users"
            >
              Users
            </Button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {searchQuery.length < 2 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-search text-primary text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-subtle mb-2">Search the spiritual realm</h3>
                <p className="text-muted text-sm">Enter at least 2 characters to begin your search</p>
              </div>
            ) : isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-cosmic rounded-lg p-4 border border-primary/20">
                    <div className="flex items-start space-x-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-400 text-xl"></i>
                </div>
                <p className="text-muted">Search encountered an error</p>
              </div>
            ) : searchResults && Array.isArray(searchResults) && searchResults.length > 0 ? (
              (searchResults as SearchResult[]).map((result, index) => (
                <div
                  key={`${result.type}-${result.id}-${index}`}
                  className="bg-cosmic rounded-lg p-4 border border-primary/20 cursor-pointer hover:border-primary/50 hover:bg-cosmic-light/50 transition-all duration-200"
                  onClick={() => handleResultClick(result)}
                  data-testid={`search-result-${result.type}-${result.id}`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Result Icon/Avatar */}
                    <div className="flex-shrink-0">
                      {result.type === 'user' ? (
                        <ProfileIcon 
                          user={result.author}
                          size="sm"
                          className="w-8 h-8"
                          testId={`search-user-${result.id}`}
                        />
                      ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${result.chakra ? `bg-${getChakraColor(result.chakra)}/20` : 'bg-primary/20'}`}>
                          <i className="fas fa-feather text-primary text-xs"></i>
                        </div>
                      )}
                    </div>

                    {/* Result Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-white truncate" data-testid={`search-title-${result.id}`}>
                          {result.title}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs border-primary/50 text-primary ${result.type === 'user' ? 'bg-accent-light/10' : 'bg-primary/10'}`}
                        >
                          {result.type === 'user' ? 'User' : 'Post'}
                        </Badge>
                        {result.chakra && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs border-${getChakraColor(result.chakra)}/50 text-${getChakraColor(result.chakra)}-light`}
                          >
                            {result.chakra}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-subtle line-clamp-2 mb-2" data-testid={`search-content-${result.id}`}>
                        {result.content}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted">
                        {result.type === 'post' && result.author && (
                          <span>by {result.author.username || result.author.email || 'Anonymous'}</span>
                        )}
                        {result.type === 'user' && result.auraLevel && (
                          <span>Aura Level {result.auraLevel}</span>
                        )}
                        {result.createdAt && (
                          <span>{formatDistanceToNow(new Date(result.createdAt), { addSuffix: true })}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-search text-primary text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-subtle mb-2">No results found</h3>
                <p className="text-muted text-sm">
                  Try searching with different keywords or explore the spiritual realm differently
                </p>
              </div>
            )}
          </div>

          {/* Search Tips */}
          {searchQuery.length < 2 && (
            <div className="border-t border-primary/20 pt-4">
              <h4 className="text-sm font-medium text-subtle mb-2">Search tips:</h4>
              <ul className="text-xs text-muted space-y-1">
                <li>• Search for spiritual concepts: "meditation", "chakras", "awakening"</li>
                <li>• Find users by username or spiritual interests</li>
                <li>• Use quotes for exact phrases: "inner peace"</li>
                <li>• Explore by chakra types: root, sacral, solar, heart, throat, third_eye, crown</li>
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}