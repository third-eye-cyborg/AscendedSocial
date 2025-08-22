import { useAuth } from "@/hooks/useAuth";
import Sidebar from "./Sidebar";
import OracleSidebar from "./OracleSidebar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-cosmic text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cosmic/90 backdrop-blur-lg border-b border-primary/30">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <i className="fas fa-lotus text-white text-lg"></i>
              </div>
              <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Ascended Social
              </h1>
            </div>

            {/* Search Bar - Hidden on mobile */}
            {!isMobile && (
              <div className="flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input 
                    type="text" 
                    placeholder="Search posts, users, or spiritual content..." 
                    className="w-full bg-cosmic-light border border-primary/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    data-testid="input-search"
                  />
                </div>
              </div>
            )}

            {/* User Menu and Energy Indicator */}
            <div className="flex items-center space-x-4">
              {/* Energy Indicator - Hidden on mobile */}
              {!isMobile && (user as any) && (
                <div className="flex items-center space-x-2 bg-cosmic-light rounded-lg px-3 py-2">
                  <i className="fas fa-bolt text-golden animate-pulse"></i>
                  <span className="text-sm font-medium" data-testid="text-energy">{(user as any)?.energy || 1000}</span>
                  <span className="text-xs text-gray-400">Energy</span>
                </div>
              )}
              
              {/* User Sigil/Avatar */}
              <div className="sigil-container w-10 h-10 rounded-full p-0.5 animate-glow">
                <div className="w-full h-full bg-cosmic rounded-full flex items-center justify-center">
                  {(user as any)?.sigil ? (
                    <span className="text-xs text-white font-mono" data-testid="text-sigil">{(user as any)?.sigil}</span>
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
                  className="text-gray-400 hover:text-white"
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
            
            <button className="flex flex-col items-center space-y-1 text-gray-400" data-testid="button-videos">
              <i className="fas fa-video"></i>
              <span className="text-xs">Videos</span>
            </button>
            
            <button className="flex flex-col items-center space-y-1 text-gray-400" data-testid="button-oracle">
              <i className="fas fa-eye"></i>
              <span className="text-xs">Oracle</span>
            </button>
            
            <button className="flex flex-col items-center space-y-1 text-gray-400" data-testid="button-energy">
              <i className="fas fa-bolt"></i>
              <span className="text-xs">Energy</span>
            </button>
            
            <button 
              className="flex flex-col items-center space-y-1 text-gray-400"
              onClick={() => window.location.href = '/api/logout'}
              data-testid="button-profile"
            >
              <i className="fas fa-user"></i>
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
