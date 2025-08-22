import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const { user } = useAuth();

  const { data: userStats } = useQuery({
    queryKey: ["/api/users", (user as any)?.id, "stats"],
    enabled: !!(user as any)?.id,
  });

  if (!user) return null;

  return (
    <aside className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-cosmic-light/50 border-r border-primary/30 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
      {/* User Aura Profile */}
      <Card className="bg-cosmic-light rounded-xl mb-6 aura-visualization border border-primary/30 hover-lift animate-slide-up">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="sigil-container w-12 h-12 rounded-full p-0.5">
              <div className="w-full h-full bg-cosmic rounded-full flex items-center justify-center overflow-hidden">
                {(user as any)?.sigil ? (
                  <span className="text-xs text-white font-mono break-all text-center" data-testid="text-sidebar-sigil">
                    {((user as any)?.sigil as string).slice(0, 3)}
                  </span>
                ) : (
                  <i className="fas fa-om text-white text-lg"></i>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold" data-testid="text-sidebar-username">
                {(user as any)?.username || (user as any)?.email || 'Spiritual Seeker'}
              </h3>
              <p className="text-sm text-primary">Ascending Soul</p>
            </div>
          </div>
          
          {/* Aura Level */}
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Aura Level</span>
              <span className="text-accent-light" data-testid="text-aura-level">
                Level {(userStats as any)?.auraLevel || 1}
              </span>
            </div>
            <div className="w-full bg-cosmic rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full"
                style={{ width: `${Math.min(100, (((userStats as any)?.auraLevel || 1) * 10))}%` }}
              ></div>
            </div>
          </div>

          {/* Spiritual Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <div className="text-accent-light font-semibold" data-testid="text-positive-energy">
                {(userStats as any)?.positiveEnergy || 0}
              </div>
              <div className="text-secondary">Positive Energy</div>
            </div>
            <div className="text-center">
              <div className="text-primary font-semibold" data-testid="text-insights">
                {(userStats as any)?.totalPosts || 0}
              </div>
              <div className="text-secondary">Insights Shared</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Menu */}
      <nav className="space-y-2 mb-6">
        <a 
          href="#" 
          className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary text-white"
          data-testid="link-feed"
        >
          <i className="fas fa-home"></i>
          <span>Feed</span>
        </a>
        <a 
          href="#" 
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-cosmic-light text-secondary hover:text-white transition-colors"
          data-testid="link-visions"
        >
          <i className="fas fa-video"></i>
          <span>Visions</span>
        </a>
        <a 
          href="#" 
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-cosmic-light text-secondary hover:text-white transition-colors"
          data-testid="link-sparks"
        >
          <i className="fas fa-bolt"></i>
          <span>Sparks</span>
        </a>
        <a 
          href="#" 
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-cosmic-light text-secondary hover:text-white transition-colors"
          data-testid="link-oracle"
        >
          <i className="fas fa-eye"></i>
          <span>The Oracle</span>
        </a>
        <a 
          href="#" 
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-cosmic-light text-secondary hover:text-white transition-colors"
          data-testid="link-community"
        >
          <i className="fas fa-users"></i>
          <span>Community</span>
        </a>
      </nav>

      {/* Premium Features */}
      <Card className="bg-cosmic-light rounded-xl border border-primary/30 hover-lift animate-slide-up">
        <CardContent className="p-4">
          <h4 className="font-semibold text-accent-light mb-2 flex items-center">
            <i className="fas fa-crown mr-2"></i>
            Premium Tools
          </h4>
          <div className="space-y-2 text-sm">
            <a 
              href="#" 
              className="block hover:text-accent-light transition-colors duration-200"
              data-testid="link-tarot"
            >
              <i className="fas fa-cards-blank mr-2"></i>AI Tarot Readings
            </a>
            <a 
              href="#" 
              className="block hover:text-accent-light transition-colors duration-200"
              data-testid="link-streaming"
            >
              <i className="fas fa-broadcast-tower mr-2"></i>Live Streaming
            </a>
            <a 
              href="#" 
              className="block hover:text-accent-light transition-colors duration-200"
              data-testid="link-sigils"
            >
              <i className="fas fa-crystal-ball mr-2"></i>Custom Sigils
            </a>
          </div>
          <Button 
            className="w-full mt-3 bg-primary text-white font-semibold hover:bg-primary/90 transition-colors duration-200"
            onClick={() => window.location.href = '/subscribe'}
            data-testid="button-upgrade"
          >
            Upgrade Now
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
