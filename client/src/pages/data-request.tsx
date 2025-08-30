import { useEffect } from 'react';

export default function DataRequest() {
  useEffect(() => {
    // Remove any existing DSAR script to ensure clean reload
    const existingScript = document.getElementById('__enzuzo-dsar-script');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Clear any existing content
    const rootDiv = document.getElementById('__enzuzo-root');
    if (rootDiv) {
      rootDiv.innerHTML = '';
    }
    
    // Add the DSAR script
    const script = document.createElement('script');
    script.id = '__enzuzo-dsar-script';
    script.src = 'https://app.enzuzo.com/__enzuzo-privacy-app.js?mode=data&apiHost=https://app.enzuzo.com&qt=1756597779382&referral=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDdXN0b21lcklEIjoxODI3OSwiQ3VzdG9tZXJOYW1lIjoiY3VzdC1FU0RQdHVDSSIsIkN1c3RvbWVyTG9nb1VSTCI6IiIsIlJvbGVzIjpbInJlZmVycmFsIl0sIlByb2R1Y3QiOiJlbnRlcnByaXNlIiwiVmVyc2lvbiI6MCwiaXNzIjoiRW56dXpvIEluYy4iLCJuYmYiOjE3NTY1OTczNTB9.ZW9Ke3piBCfm3jsHE_9XChLc7KljrsobSwzzW-5VLjE';
    script.async = true;
    
    // Add load event listener
    script.onload = () => {
      console.log('Enzuzo DSAR script loaded');
    };
    
    script.onerror = () => {
      console.error('Failed to load Enzuzo DSAR script');
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
                  <i className="fas fa-database text-white text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  <span className="hidden sm:inline">Data Request</span>
                  <span className="sm:hidden">DSAR</span>
                </h1>
                <p className="text-xs text-muted font-medium tracking-wide hidden sm:block">DATA RIGHTS • ACCESS • CONTROL</p>
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
                Data Subject Access Request
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Exercise your data privacy rights under GDPR, CCPA, and other privacy regulations. Request access to your personal data, request deletion, or make corrections to your information.
            </p>
          </div>

          {/* Enzuzo DSAR Form Embed */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8">
            <div 
              id="__enzuzo-root"
              className="min-h-[500px]"
              data-testid="enzuzo-dsar-form"
            ></div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-primary/40 glass-effect shadow-xl rounded-3xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg mb-6">
                <i className="fas fa-user-shield text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-primary">Your Data Rights</h3>
              <p className="text-white/90 leading-relaxed">
                You have the right to know what personal information we collect, request access to your data, request deletion, and correct any inaccuracies.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-secondary/40 glass-effect shadow-xl rounded-3xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center shadow-lg mb-6">
                <i className="fas fa-lock text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-secondary">Secure Processing</h3>
              <p className="text-white/90 leading-relaxed">
                All data requests are processed securely and verified to protect your privacy. We respond to requests within the legally required timeframes.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}