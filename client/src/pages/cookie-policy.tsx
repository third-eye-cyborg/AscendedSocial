import { useEffect } from "react";

export default function CookiePolicy() {
  useEffect(() => {
    // Clean up any existing script
    const existingScript = document.getElementById('enzuzo-cookie-script');
    if (existingScript) {
      existingScript.remove();
    }

    // Clear the container
    const container = document.getElementById('__enzuzo-root');
    if (container) {
      container.innerHTML = '';
    }

    // Add a delay to ensure DOM is ready
    setTimeout(() => {
      // Create a button to trigger the existing cookie banner preferences
      const container = document.getElementById('__enzuzo-root');
      if (container) {
        container.innerHTML = `
          <div class="p-8 text-center">
            <div class="mb-6">
              <h3 class="text-xl font-semibold text-black mb-4">Manage Your Cookie Preferences</h3>
              <p class="text-black/80 mb-6">Click the button below to access your cookie preferences and manage how we use cookies on your spiritual journey.</p>
            </div>
            <button 
              onclick="if(window.Enzuzo && window.Enzuzo.showBanner) { window.Enzuzo.showBanner(); } else { alert('Cookie preferences are loading. Please try again in a moment.'); }"
              class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
            >
              Open Cookie Preferences
            </button>
            <div class="mt-6 text-sm text-black/60">
              <p>This will open the cookie banner where you can:</p>
              <ul class="mt-2 space-y-1">
                <li>• Accept or decline optional cookies</li>
                <li>• View detailed information about each cookie type</li>
                <li>• Manage your privacy preferences</li>
              </ul>
            </div>
          </div>
        `;
      }
    }, 100);

    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById('enzuzo-cookie-script');
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
            <style>{`
              /* Comprehensive Enzuzo styling fixes for cookie policy */
              #__enzuzo-root * {
                color: black !important;
              }
              
              #__enzuzo-root h1,
              #__enzuzo-root h2,
              #__enzuzo-root h3,
              #__enzuzo-root h4,
              #__enzuzo-root h5,
              #__enzuzo-root h6 {
                color: black !important;
                font-weight: 600 !important;
                margin-bottom: 16px !important;
              }
              
              #__enzuzo-root p,
              #__enzuzo-root span,
              #__enzuzo-root div {
                color: black !important;
                line-height: 1.5 !important;
              }
              
              #__enzuzo-root label {
                color: black !important;
                font-weight: 500 !important;
                display: block !important;
                margin-bottom: 8px !important;
              }
              
              #__enzuzo-root select {
                background-color: white !important;
                color: black !important;
                border: 2px solid #d1d5db !important;
                padding: 12px !important;
                border-radius: 8px !important;
                font-size: 14px !important;
                width: 100% !important;
                margin-bottom: 16px !important;
              }
              
              #__enzuzo-root select option {
                background-color: white !important;
                color: black !important;
              }
              
              #__enzuzo-root button {
                background-color: #8b5cf6 !important;
                color: white !important;
                border: none !important;
                padding: 12px 24px !important;
                border-radius: 8px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                margin-top: 16px !important;
              }
              
              #__enzuzo-root button:hover {
                background-color: #7c3aed !important;
              }
              
              /* Material-UI component fixes */
              #__enzuzo-root .MuiSelect-root,
              #__enzuzo-root .MuiInputBase-root {
                background-color: white !important;
                color: black !important;
              }
              
              #__enzuzo-root .MuiSelect-icon {
                color: black !important;
              }
              
              #__enzuzo-root .MuiTypography-root {
                color: black !important;
              }
              
              #__enzuzo-root .MuiFormLabel-root,
              #__enzuzo-root .MuiInputLabel-root {
                color: black !important;
              }
              
              /* Accordion and toggle fixes */
              #__enzuzo-root .MuiAccordion-root {
                background-color: white !important;
                margin-bottom: 16px !important;
              }
              
              #__enzuzo-root .MuiSwitch-root {
                margin: 8px !important;
              }
            `}</style>
            <div 
              id="__enzuzo-root"
              className="min-h-[500px] text-black bg-white/10 rounded-lg p-6"
              data-testid="enzuzo-cookie-policy"
            >
              <div className="text-center py-12">
                <div className="animate-pulse mb-4">
                  <div className="w-8 h-8 bg-primary/30 rounded-full mx-auto mb-4 animate-bounce"></div>
                  <div className="text-black font-medium">Loading cookie policy widget...</div>
                  <div className="text-black/60 text-sm mt-2">This may take a few moments</div>
                </div>
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