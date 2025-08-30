import { useEffect, useState } from "react";

// Extend Window interface to include Enzuzo
declare global {
  interface Window {
    Enzuzo?: {
      showBanner?: () => void;
      showSettings?: () => void;
      openWidget?: () => void;
      hideBanner?: () => void;
    };
  }
}

export default function CookiePolicy() {
  const [enzuzoLoaded, setEnzuzoLoaded] = useState(false);

  useEffect(() => {
    // Remove any existing script and div to ensure clean reload
    const existingScript = document.getElementById('__enzuzo-cookie-script');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Clear the div content
    const rootDiv = document.getElementById('__enzuzo-root');
    if (rootDiv) {
      rootDiv.innerHTML = '';
    }
    
    // Add the Enzuzo cookie policy script (similar to CCPA script but for cookie management)
    const script = document.createElement('script');
    script.id = '__enzuzo-cookie-script';
    script.src = 'https://app.enzuzo.com/__enzuzo-privacy-app.js?mode=cookie-manager&apiHost=https://app.enzuzo.com&qt=1756588733437&referral=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDdXN0b21lcklEIjoxODI3OSwiQ3VzdG9tZXJOYW1lIjoiY3VzdC1FU0RQdHVDSSIsIkN1c3RvbWVyTG9nb1VSTCI6IiIsIlJvbGVzIjpbInJlZmVycmFsIl0sIlByb2R1Y3QiOiJlbnRlcnByaXNlIiwiVmVyc2lvbiI6MCwiaXNzIjoiRW56dXpvIEluYy4iLCJuYmYiOjE3NTY1ODgyODN9.k5Y0Vix9GgLtIfBefvTbfkVc4SkyttgkXW5m9_dSFPU';
    script.async = true;
    
    // Add load event listener
    script.onload = () => {
      console.log('Enzuzo cookie policy script loaded');
      setEnzuzoLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load Enzuzo cookie policy script');
    };
    
    document.head.appendChild(script);
    
    // Clean up function
    return () => {
      const scriptToRemove = document.getElementById('__enzuzo-cookie-script');
      if (scriptToRemove) {
        scriptToRemove.remove();
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
            <div 
              id="__enzuzo-root"
              className="min-h-[500px]"
              data-testid="enzuzo-cookie-policy"
            >
              {!enzuzoLoaded && (
                <div className="text-center py-12">
                  <div className="animate-pulse mb-4">
                    <div className="w-8 h-8 bg-primary/30 rounded-full mx-auto mb-4 animate-bounce"></div>
                    <div className="font-medium text-[#6f788c]">Loading cookie policy widget...</div>
                    <div className="text-white/60 text-sm mt-2">This may take a few moments</div>
                  </div>
                </div>
              )}
            </div>
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