
import { useEffect, useRef } from 'react';
import { ConsentManager } from '@/lib/consent';

export default function CookiePolicy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const enzuzoLoaded = useRef(false);

  useEffect(() => {
    const consentManager = ConsentManager.getInstance();
    
    // Ensure Enzuzo script is loaded
    consentManager.initializeEnzuzo();
    
    // Wait for Enzuzo to be available and render the cookie policy
    const checkAndRenderPolicy = () => {
      if (typeof window !== 'undefined' && containerRef.current) {
        const enzuzo = (window as any).Enzuzo || (window as any).ezCookieSettings;
        
        if (enzuzo && !enzuzoLoaded.current) {
          enzuzoLoaded.current = true;
          
          // Try to render the cookie policy in the container
          if (enzuzo.renderPolicy) {
            enzuzo.renderPolicy(containerRef.current);
          } else if (enzuzo.showPolicy) {
            enzuzo.showPolicy();
          } else {
            // Fallback: render the cookie preferences center
            if (enzuzo.showPreferences) {
              enzuzo.showPreferences();
            } else {
              // Final fallback: show a message that the policy is loading
              if (containerRef.current) {
                containerRef.current.innerHTML = `
                  <div class="text-center py-12">
                    <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p class="text-white/80">Loading cookie policy...</p>
                    <p class="text-white/60 text-sm mt-2">If this takes too long, please refresh the page.</p>
                  </div>
                `;
              }
            }
          }
        } else if (!enzuzo) {
          // Enzuzo not loaded yet, keep checking
          setTimeout(checkAndRenderPolicy, 100);
        }
      }
    };

    // Start checking for Enzuzo availability
    checkAndRenderPolicy();
    
    // Listen for Enzuzo to load
    const handleEnzuzoLoad = () => {
      checkAndRenderPolicy();
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('enzuzoLoaded', handleEnzuzoLoad);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('enzuzoLoaded', handleEnzuzoLoad);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-cosmic text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cosmic/80 backdrop-blur-2xl border-b border-primary/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md animate-pulse"></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <i className="fas fa-cookie-bite text-white text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  <span className="hidden sm:inline">Cookie Policy</span>
                  <span className="sm:hidden">Cookies</span>
                </h1>
                <p className="text-xs text-muted font-medium tracking-wide hidden sm:block">PRIVACY • TRANSPARENCY • TRUST</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.location.href = '/'}
                className="group relative bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/30 hover:scale-105"
                data-testid="button-home"
              >
                <span className="relative z-10">Back to Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 mt-8">
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-chakra-heart to-secondary bg-clip-text text-transparent">
                Cookie Policy & Privacy Preferences
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Manage your privacy preferences and understand how we use cookies to enhance your spiritual journey on Ascended Social, including video streaming and media features.
            </p>
          </div>

          {/* Enzuzo Cookie Policy Embed */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8">
            {/* Enzuzo root div - exactly as their instructions specify */}
            <div 
              ref={containerRef}
              id="__enzuzo-root" 
              className="min-h-[500px]" 
              data-testid="enzuzo-cookie-policy"
            ></div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-primary/40 glass-effect shadow-xl rounded-3xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg mb-6">
                <i className="fas fa-shield-alt text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-primary">Your Privacy Matters</h3>
              <p className="text-white/90 leading-relaxed">
                We believe in complete transparency about how your data is used. You have full control over your privacy preferences and can modify them at any time.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-secondary/40 glass-effect shadow-xl rounded-3xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center shadow-lg mb-6">
                <i className="fas fa-cog text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-secondary">Manage Preferences</h3>
              <p className="text-white/90 leading-relaxed">
                Use the cookie banner or preferences center above to customize your experience. Your choices are saved and respected across all devices.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
