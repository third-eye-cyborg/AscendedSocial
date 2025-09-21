export default function EULA() {
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
                  <i className="fas fa-scroll text-white text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  <span className="hidden sm:inline">End User License Agreement</span>
                  <span className="sm:hidden">EULA</span>
                </h1>
                <p className="text-xs text-muted font-medium tracking-wide hidden sm:block">LICENSE • AGREEMENT • SOFTWARE</p>
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
                End User License Agreement
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Review the software license agreement that governs your use of Ascended Social platform and applications.
            </p>
          </div>

          {/* EULA Link */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-display font-bold mb-4 text-primary">Software License Agreement</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                View our complete End User License Agreement to understand the terms for using our spiritual platform software and applications.
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-white/90 text-lg leading-relaxed">
                Our complete End User License Agreement is embedded below. This agreement governs your use of our spiritual platform software.
              </p>
            </div>

            {/* EULA Information Categories */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <div className="bg-cosmic/50 rounded-2xl p-6 border border-primary/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-key text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white">License Grant</h4>
                </div>
                <p className="text-white/80">
                  Details about the software license granted to you, including permitted uses and restrictions.
                </p>
              </div>

              <div className="bg-cosmic/50 rounded-2xl p-6 border border-green-400/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-copyright text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white">Intellectual Property</h4>
                </div>
                <p className="text-white/80">
                  Information about software ownership, copyright protection, and intellectual property rights.
                </p>
              </div>

              <div className="bg-cosmic/50 rounded-2xl p-6 border border-purple-400/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-ban text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white">Usage Restrictions</h4>
                </div>
                <p className="text-white/80">
                  Prohibited uses of the software, including reverse engineering, redistribution, and modification limits.
                </p>
              </div>

              <div className="bg-cosmic/50 rounded-2xl p-6 border border-orange-400/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-sync-alt text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white">Updates & Support</h4>
                </div>
                <p className="text-white/80">
                  Terms regarding software updates, maintenance, and technical support availability.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-primary/40 glass-effect shadow-xl rounded-3xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg mb-6">
                <i className="fas fa-file-contract text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-primary">Terms of Service</h3>
              <p className="text-white/90 leading-relaxed mb-6">
                Review the terms and conditions that govern your use of our spiritual platform and services.
              </p>
              <a
                href="/terms-of-service"
                className="group relative bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/30 hover:scale-105 inline-flex items-center space-x-2"
                data-testid="link-terms-of-service"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <i className="fas fa-arrow-right"></i>
                  <span>View Terms</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              </a>
            </div>

            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-secondary/40 glass-effect shadow-xl rounded-3xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center shadow-lg mb-6">
                <i className="fas fa-shield-alt text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-secondary">Privacy Policy</h3>
              <p className="text-white/90 leading-relaxed mb-6">
                Learn how we protect your personal information and understand your privacy rights.
              </p>
              <a
                href="/privacy-policy"
                className="group relative bg-gradient-to-r from-secondary to-primary text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-secondary/30 hover:scale-105 inline-flex items-center space-x-2"
                data-testid="link-privacy-policy"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <i className="fas fa-arrow-right"></i>
                  <span>View Privacy Policy</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}