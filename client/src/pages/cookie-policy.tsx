import { useEffect, useRef } from 'react';
import { ConsentManager } from '@/lib/consent';

export default function CookiePolicy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const enzuzoLoaded = useRef(false);

  useEffect(() => {
    const consentManager = ConsentManager.getInstance();
    
    // Ensure Enzuzo script is loaded
    consentManager.initializeEnzuzo();
    
    // Display the cookie manager when the page loads
    const showCookieManager = () => {
      if (typeof window !== 'undefined') {
        const enzuzo = (window as any).Enzuzo || (window as any).ezCookieSettings;
        
        if (enzuzo && !enzuzoLoaded.current) {
          enzuzoLoaded.current = true;
          
          // Show the cookie preferences/manager
          if (enzuzo.showPreferencesManager) {
            enzuzo.showPreferencesManager();
          } else if (enzuzo.showPreferences) {
            enzuzo.showPreferences();
          } else if (enzuzo.showCookieManager) {
            enzuzo.showCookieManager();
          } else {
            // If no preference manager available, show the banner
            if (enzuzo.showBanner) {
              enzuzo.showBanner();
            }
          }
        } else if (!enzuzo) {
          // Enzuzo not loaded yet, keep checking
          setTimeout(showCookieManager, 100);
        }
      }
    };

    // Start checking for Enzuzo availability
    const timer = setTimeout(showCookieManager, 1000); // Give Enzuzo time to load
    
    return () => {
      clearTimeout(timer);
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

          {/* Cookie Policy Information and Management */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-display font-bold mb-4 text-primary">Cookie Preferences Center</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Click the button below to open your cookie preferences and manage your privacy settings. 
                You can choose which types of cookies you'd like to allow and adjust your preferences at any time.
              </p>
            </div>
            
            <div className="text-center mb-8">
              <button
                onClick={() => {
                  const enzuzo = (window as any).Enzuzo || (window as any).ezCookieSettings;
                  if (enzuzo) {
                    if (enzuzo.showPreferencesManager) {
                      enzuzo.showPreferencesManager();
                    } else if (enzuzo.showPreferences) {
                      enzuzo.showPreferences();
                    } else if (enzuzo.showCookieManager) {
                      enzuzo.showCookieManager();
                    } else if (enzuzo.showBanner) {
                      enzuzo.showBanner();
                    }
                  }
                }}
                className="group relative bg-gradient-to-r from-primary to-secondary text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-primary/30 hover:scale-105 text-lg"
                data-testid="button-manage-cookies"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <i className="fas fa-cog"></i>
                  <span>Manage Cookie Preferences</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Cookie Categories Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-cosmic/50 rounded-2xl p-6 border border-primary/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-check text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white">Essential Cookies</h4>
                </div>
                <p className="text-white/80">
                  Required for basic website functionality, security, and user authentication. These cannot be disabled.
                </p>
              </div>

              <div className="bg-cosmic/50 rounded-2xl p-6 border border-blue-400/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-chart-bar text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white">Analytics Cookies</h4>
                </div>
                <p className="text-white/80">
                  Help us understand how you interact with our platform to improve your spiritual journey experience.
                </p>
              </div>

              <div className="bg-cosmic/50 rounded-2xl p-6 border border-purple-400/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-bullhorn text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white">Marketing Cookies</h4>
                </div>
                <p className="text-white/80">
                  Enable personalized content recommendations and spiritual guidance tailored to your interests.
                </p>
              </div>

              <div className="bg-cosmic/50 rounded-2xl p-6 border border-yellow-400/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user-cog text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white">Preference Cookies</h4>
                </div>
                <p className="text-white/80">
                  Remember your settings, language preferences, and customizations for a personalized experience.
                </p>
              </div>
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