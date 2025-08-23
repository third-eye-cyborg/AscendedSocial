import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const { data: userStats } = useQuery({
    queryKey: ["/api/users", (user as any)?.id, "stats"],
    enabled: !!(user as any)?.id,
  });

  if (!user) return null;

  return (
    <aside className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-cosmic-light/50 border-r border-primary/30 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent z-40">
      {/* User Aura Profile */}
      <Card className="bg-cosmic-light rounded-xl mb-6 aura-visualization border border-primary/30 hover-lift animate-slide-up">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="sigil-container w-12 h-12 rounded-full p-0.5 flex-shrink-0">
              <div className="w-full h-full bg-cosmic rounded-full flex items-center justify-center overflow-hidden">
                {(user as any)?.profileImageUrl ? (
                  <img 
                    src={(user as any).profileImageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full"
                    data-testid="img-sidebar-profile"
                  />
                ) : (user as any)?.sigil ? (
                  <div className="text-center leading-none p-1">
                    <pre className="text-[6px] text-white font-mono whitespace-pre-wrap break-words" data-testid="text-sidebar-sigil">
                      {(user as any).sigil}
                    </pre>
                  </div>
                ) : (
                  <i className="fas fa-om text-white text-lg"></i>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <h3 className="font-semibold text-white text-sm truncate max-w-full" data-testid="text-sidebar-username" title={(user as any)?.username || (user as any)?.email || 'Spiritual Seeker'}>
                {(user as any)?.username || (user as any)?.email || 'Spiritual Seeker'}
              </h3>
              <p className="text-xs text-primary truncate">Ascending Soul</p>
            </div>
          </div>
          
          {/* Aura Level */}
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white">Aura Level</span>
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
              <div className="text-white/90">Positive Energy</div>
            </div>
            <div className="text-center">
              <div className="text-primary font-semibold" data-testid="text-insights">
                {(userStats as any)?.totalPosts || 0}
              </div>
              <div className="text-white/90">Insights Shared</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Menu */}
      <nav className="space-y-2 mb-6">
        <Link href="/">
          <button 
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
              location === "/" ? "bg-primary text-white" : "hover:bg-cosmic-light text-white hover:text-accent-light"
            }`}
            data-testid="link-feed"
          >
            <i className="fas fa-home"></i>
            <span>Feed</span>
          </button>
        </Link>
        <Link href="/visions">
          <button 
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
              location === "/visions" ? "bg-primary text-white" : "hover:bg-cosmic-light text-white hover:text-accent-light"
            }`}
            data-testid="link-visions"
          >
            <i className="fas fa-video"></i>
            <span>Visions</span>
          </button>
        </Link>
        <Link href="/sparks">
          <button 
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
              location === "/sparks" ? "bg-primary text-white" : "hover:bg-cosmic-light text-white hover:text-accent-light"
            }`}
            data-testid="link-sparks"
          >
            <i className="fas fa-bolt"></i>
            <span>Sparks</span>
          </button>
        </Link>
        <Link href="/community">
          <button 
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
              location === "/community" ? "bg-primary text-white" : "hover:bg-cosmic-light text-white hover:text-accent-light"
            }`}
            data-testid="link-community"
          >
            <i className="fas fa-users"></i>
            <span>Community</span>
          </button>
        </Link>
        <Link href="/oracle">
          <button 
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
              location === "/oracle" ? "bg-primary text-white" : "hover:bg-cosmic-light text-white hover:text-accent-light"
            }`}
            data-testid="link-oracle"
          >
            <i className="fas fa-eye"></i>
            <span>Oracle</span>
          </button>
        </Link>
        <Link href={`/profile/${(user as any)?.id}`}>
          <button 
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
              location === `/profile/${(user as any)?.id}` ? "bg-primary text-white" : "hover:bg-cosmic-light text-white hover:text-accent-light"
            }`}
            data-testid="link-profile"
          >
            <i className="fas fa-user-circle"></i>
            <span>Profile</span>
          </button>
        </Link>
      </nav>

      {/* Premium Features */}
      <Card className="bg-cosmic-light rounded-xl border border-primary/30 hover-lift animate-slide-up">
        <CardContent className="p-4">
          <h4 className="font-semibold text-accent-light mb-2 flex items-center">
            <i className="fas fa-crown mr-2"></i>
            Premium Tools
          </h4>
          <div className="space-y-2 text-sm">
            <button 
              onClick={() => alert('AI Tarot Readings - Premium feature coming soon! Unlock mystical insights with AI-powered tarot spreads 🃏✨')}
              className="block text-white hover:text-accent-light transition-colors duration-200 w-full text-left"
              data-testid="link-tarot"
            >
              <i className="fas fa-cards-blank mr-2"></i>AI Tarot Readings
            </button>
            <button 
              onClick={() => alert('Live Streaming - Share your spiritual journey live! Premium meditation sessions and workshops 📡🧘‍♀️')}
              className="block text-white hover:text-accent-light transition-colors duration-200 w-full text-left"
              data-testid="link-streaming"
            >
              <i className="fas fa-broadcast-tower mr-2"></i>Live Streaming
            </button>
            <button 
              onClick={() => alert('Custom Sigils - Generate personalized spiritual symbols! AI-created sigils based on your energy ⚡🎨')}
              className="block text-white hover:text-accent-light transition-colors duration-200 w-full text-left"
              data-testid="link-sigils"
            >
              <i className="fas fa-crystal-ball mr-2"></i>Custom Sigils
            </button>
          </div>
          <Button 
            className="w-full mt-3 bg-primary text-white font-semibold hover:bg-primary/90 transition-colors duration-200"
            onClick={() => {
              alert('✨ Premium Subscription ✨\n\nUnlock:\n• Unlimited energy points\n• Advanced oracle readings\n• Custom sigil generation\n• Priority support\n\nSubscription page coming soon!');
            }}
            data-testid="button-upgrade"
          >
            <i className="fas fa-crown mr-2"></i>
            Upgrade Now
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
