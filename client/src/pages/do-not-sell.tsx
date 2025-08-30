import { useEffect } from "react";

export default function DoNotSell() {
  // Ensure the Enzuzo CCPA script loads when the component mounts
  useEffect(() => {
    // Remove any existing script and div to ensure clean reload
    const existingScript = document.getElementById('__enzuzo-root-script');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Clear the div content
    const rootDiv = document.getElementById('__enzuzo-root');
    if (rootDiv) {
      rootDiv.innerHTML = '';
    }
    
    // Add the CCPA script
    const script = document.createElement('script');
    script.id = '__enzuzo-root-script';
    script.src = 'https://app.enzuzo.com/__enzuzo-privacy-app.js?mode=dns&apiHost=https://app.enzuzo.com&qt=1756588733437&referral=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDdXN0b21lcklEIjoxODI3OSwiQ3VzdG9tZXJOYW1lIjoiY3VzdC1FU0RQdHVDSSIsIkN1c3RvbWVyTG9nb1VSTCI6IiIsIlJvbGVzIjpbInJlZmVycmFsIl0sIlByb2R1Y3QiOiJlbnRlcnByaXNlIiwiVmVyc2lvbiI6MCwiaXNzIjoiRW56dXpvIEluYy4iLCJuYmYiOjE3NTY1ODgyODN9.k5Y0Vix9GgLtIfBefvTbfkVc4SkyttgkXW5m9_dSFPU';
    script.async = true;
    
    // Add load event listener
    script.onload = () => {
      console.log('Enzuzo CCPA script loaded');
    };
    
    script.onerror = () => {
      console.error('Failed to load Enzuzo CCPA script');
    };
    
    document.head.appendChild(script);
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
                  <i className="fas fa-user-shield text-white text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  <span className="hidden sm:inline">Do Not Sell My Info</span>
                  <span className="sm:hidden">CCPA</span>
                </h1>
                <p className="text-xs text-muted font-medium tracking-wide hidden sm:block">PRIVACY • RIGHTS • CONTROL</p>
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
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-chakra-heart to-secondary bg-clip-text text-transparent">
                CCPA - Do Not Sell My Personal Information
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              California residents have the right to opt-out of the sale of their personal information under the California Consumer Privacy Act (CCPA).
            </p>
          </div>

          {/* Enzuzo CCPA Form Embed */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8">
            <div 
              id="__enzuzo-root"
              className="min-h-[400px]"
              data-testid="enzuzo-ccpa-form"
            ></div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-primary/40 glass-effect shadow-xl rounded-3xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg mb-6">
                <i className="fas fa-gavel text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-primary">Your CCPA Rights</h3>
              <p className="text-white/90 leading-relaxed">
                Under CCPA, California residents have the right to know what personal information is collected, request deletion of personal information, and opt-out of the sale of personal information.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-secondary/40 glass-effect shadow-xl rounded-3xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center shadow-lg mb-6">
                <i className="fas fa-user-lock text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-secondary">How We Protect You</h3>
              <p className="text-white/90 leading-relaxed">
                We respect your privacy choices and make it easy to exercise your rights. Your opt-out preferences are processed immediately and apply to all future data processing.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}