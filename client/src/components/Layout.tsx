import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "./Sidebar";
import OracleSidebar from "./OracleSidebar";
import SearchModal from "./SearchModal";
import NotificationsModal from "./NotificationsModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import logoPath from "@assets/ascended-social-high-resolution-logo-transparent (2)_1755904812375.png";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Get unread notifications count
  const { data: unreadCount } = useQuery<number>({
    queryKey: ["/api/notifications/unread-count"],
    enabled: !!(user as any)?.id,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <div className="min-h-screen bg-cosmic text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cosmic/90 backdrop-blur-lg border-b border-primary/30">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-1 shadow-lg">
                <img 
                  src={logoPath} 
                  alt="Ascended Social" 
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>
              <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Ascended Social
              </h1>
            </div>

            {/* Search Bar - Hidden on mobile */}
            {!isMobile && (
              <div className="flex-1 max-w-md mx-8">
                <div 
                  className="relative w-full cursor-pointer"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <div 
                    className="w-full bg-cosmic-light border border-primary/30 rounded-lg pl-10 pr-4 py-2 text-gray-300 hover:border-primary/50 transition-colors duration-200"
                    data-testid="search-trigger"
                  >
                    Search posts, users, or spiritual content...
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Search Button */}
            {isMobile && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-300 hover:text-primary"
                data-testid="button-search-mobile"
              >
                <i className="fas fa-search"></i>
              </Button>
            )}

            {/* User Menu and Energy Indicator */}
            <div className="flex items-center space-x-4">
              {/* Notifications Bell */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsNotificationsOpen(true)}
                  className="text-gray-300 hover:text-primary relative"
                  data-testid="button-notifications"
                >
                  <i className="fas fa-bell"></i>
                  {unreadCount && unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 bg-red-600 text-white border-0 min-w-[20px]"
                      data-testid="notification-badge"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Energy Indicator - Hidden on mobile */}
              {!isMobile && (user as any) && (
                <div className="flex items-center space-x-2 bg-cosmic-light rounded-lg px-3 py-2">
                  <i className="fas fa-bolt text-accent-light"></i>
                  <span className="text-sm font-medium" data-testid="text-energy">{(user as any)?.energy || 1000}</span>
                  <span className="text-xs text-gray-300">Energy</span>
                </div>
              )}
              
              {/* User Sigil/Avatar */}
              <div className="sigil-container w-10 h-10 rounded-full p-0.5 animate-glow">
                <div className="w-full h-full bg-cosmic rounded-full flex items-center justify-center overflow-hidden">
                  {(user as any)?.sigil ? (
                    <span className="text-[10px] text-white font-mono break-all text-center" data-testid="text-sigil">
                      {((user as any)?.sigil as string).slice(0, 3)}
                    </span>
                  ) : (
                    <i className="fas fa-lotus text-white text-lg"></i>
                  )}
                </div>
              </div>

              {/* Logout Button - Hidden on mobile */}
              {!isMobile && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = '/api/logout'}
                  className="text-gray-300 hover:text-white"
                  data-testid="button-logout"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="pt-16 flex">
        {/* Left Sidebar - Hidden on mobile */}
        {!isMobile && <Sidebar />}

        {/* Main Content */}
        <div className={`flex-1 ${!isMobile ? 'lg:ml-64 lg:mr-80' : ''}`}>
          {children}
        </div>

        {/* Right Sidebar - Hidden on mobile */}
        {!isMobile && <OracleSidebar />}
      </main>

      {/* Mobile Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-cosmic-light border-t border-primary/30 px-4 py-2 z-50">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center space-y-1 text-primary" data-testid="button-home">
              <i className="fas fa-home"></i>
              <span className="text-xs">Feed</span>
            </button>
            
            <button className="flex flex-col items-center space-y-1 text-gray-300" data-testid="button-videos">
              <i className="fas fa-video"></i>
              <span className="text-xs">Videos</span>
            </button>
            
            <button className="flex flex-col items-center space-y-1 text-gray-300" data-testid="button-oracle">
              <i className="fas fa-eye"></i>
              <span className="text-xs">Oracle</span>
            </button>
            
            <button className="flex flex-col items-center space-y-1 text-gray-300" data-testid="button-energy">
              <i className="fas fa-bolt"></i>
              <span className="text-xs">Energy</span>
            </button>
            
            <button 
              className="flex flex-col items-center space-y-1 text-gray-300"
              onClick={() => window.location.href = '/api/logout'}
              data-testid="button-logout-mobile"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="text-xs">Logout</span>
            </button>
          </div>
        </nav>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Notifications Modal */}
      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </div>
  );
}
