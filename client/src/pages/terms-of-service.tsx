export default function TermsOfService() {
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
                  <i className="fas fa-file-contract text-white text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  <span className="hidden sm:inline">Terms of Service</span>
                  <span className="sm:hidden">Terms</span>
                </h1>
                <p className="text-xs text-muted font-medium tracking-wide hidden sm:block">TERMS • CONDITIONS • AGREEMENT</p>
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
                Terms of Service
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Review the terms and conditions that govern your use of Ascended Social, our spiritual community platform and services.
            </p>
          </div>

          {/* Terms of Service Link */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-display font-bold mb-4 text-primary">Terms & Conditions</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                View our complete terms of service to understand the rules, rights, and responsibilities for using our spiritual platform.
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-white/90 text-lg leading-relaxed">
                Our complete terms of service are embedded below. These terms outline your rights and responsibilities when using our spiritual platform.
              </p>
            </div>

            {/* Terms Information Categories */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <div className="bg-cosmic/50 rounded-2xl p-6 border border-primary/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user-check text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white">User Responsibilities</h4>
                </div>
                <p className="text-white/80">
                  Guidelines for appropriate behavior, content creation, and community interaction on our spiritual platform.
                </p>
              </div>

              <div className="bg-cosmic/50 rounded-2xl p-6 border border-green-400/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-handshake text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white">Service Agreement</h4>
                </div>
                <p className="text-white/80">
                  Details about the services we provide, including spiritual features, premium subscriptions, and platform access.
                </p>
              </div>

              <div className="bg-cosmic/50 rounded-2xl p-6 border border-purple-400/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-balance-scale text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white">Rights & Ownership</h4>
                </div>
                <p className="text-white/80">
                  Information about intellectual property rights, content ownership, and licensing terms for the platform.
                </p>
              </div>

              <div className="bg-cosmic/50 rounded-2xl p-6 border border-orange-400/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-exclamation-triangle text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white">Limitations & Disclaimers</h4>
                </div>
                <p className="text-white/80">
                  Important disclaimers about service availability, liability limitations, and spiritual guidance disclaimers.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-primary/40 glass-effect shadow-xl rounded-3xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg mb-6">
                <i className="fas fa-shield-alt text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-primary">Privacy Policy</h3>
              <p className="text-white/90 leading-relaxed mb-6">
                Learn how we protect your personal information and understand your privacy rights on our platform.
              </p>
              <a
                href="/privacy-policy"
                className="group relative bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/30 hover:scale-105 inline-flex items-center space-x-2"
                data-testid="link-privacy-policy"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <i className="fas fa-arrow-right"></i>
                  <span>View Privacy Policy</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              </a>
            </div>

            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-secondary/40 glass-effect shadow-xl rounded-3xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center shadow-lg mb-6">
                <i className="fas fa-question-circle text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-secondary">Need Help?</h3>
              <p className="text-white/90 leading-relaxed mb-6">
                Have questions about our terms or need assistance? Contact our support team for guidance.
              </p>
              <a
                href="mailto:support@ascended.social"
                className="group relative bg-gradient-to-r from-secondary to-primary text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-secondary/30 hover:scale-105 inline-flex items-center space-x-2"
                data-testid="link-support"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <i className="fas fa-envelope"></i>
                  <span>Contact Support</span>
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