export default function PrivacyPolicy() {
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
                  <i className="fas fa-shield-alt text-white text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  <span className="hidden sm:inline">Privacy Policy</span>
                  <span className="sm:hidden">Privacy</span>
                </h1>
                <p className="text-xs text-muted font-medium tracking-wide hidden sm:block">PRIVACY • PROTECTION • TRANSPARENCY</p>
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
                Privacy Policy
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Learn how we protect your personal information and understand your privacy rights on Ascended Social, our spiritual community platform.
            </p>
          </div>

          {/* Privacy Policy Link */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-display font-bold mb-4 text-primary">Privacy Policy</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                View our complete privacy policy to understand how we collect, use, and protect your personal information on our spiritual platform.
              </p>
            </div>
            
            <div className="text-center">
              <a
                href="https://app.enzuzo.com/policies/privacy/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDdXN0b21lcklEIjoxODI3OSwiQ3VzdG9tZXJOYW1lIjoiY3VzdC1FU0RQdHVDSSIsIkN1c3RvbWVyTG9nb1VSTCI6IiIsIlJvbGVzIjpbInJlZmVycmFsIl0sIlByb2R1Y3QiOiJlbnRlcnByaXNlIiwiVmVyc2lvbiI6MCwiaXNzIjoiRW56dXpvIEluYy4iLCJuYmYiOjE3NTY1OTczNTB9.ZW9Ke3piBCfm3jsHE_9XChLc7KljrsobSwzzW-5VLjE"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-r from-primary to-secondary text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-primary/30 hover:scale-105 text-lg inline-flex items-center space-x-2"
                data-testid="link-privacy-policy"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <i className="fas fa-external-link-alt"></i>
                  <span>View Privacy Policy</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              </a>
            </div>

            {/* Privacy Information Categories */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <div className="bg-cosmic/50 rounded-2xl p-6 border border-primary/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-database text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white">Data Collection</h4>
                </div>
                <p className="text-white/80">
                  Information about what personal data we collect, how we collect it, and the legal basis for processing.
                </p>
              </div>

              <div className="bg-cosmic/50 rounded-2xl p-6 border border-green-400/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user-shield text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white">Your Rights</h4>
                </div>
                <p className="text-white/80">
                  Details about your privacy rights under GDPR, CCPA, and other regulations, including access and deletion rights.
                </p>
              </div>

              <div className="bg-cosmic/50 rounded-2xl p-6 border border-purple-400/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-share-alt text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white">Data Sharing</h4>
                </div>
                <p className="text-white/80">
                  Information about when and how we share your data with third parties, including service providers and partners.
                </p>
              </div>

              <div className="bg-cosmic/50 rounded-2xl p-6 border border-orange-400/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-lock text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white">Data Security</h4>
                </div>
                <p className="text-white/80">
                  Details about the security measures we implement to protect your personal information from unauthorized access.
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
              <h3 className="text-2xl font-display font-bold mb-4 text-primary">Data Requests</h3>
              <p className="text-white/90 leading-relaxed mb-6">
                Exercise your data privacy rights by requesting access to your personal information or requesting deletion of your data.
              </p>
              <a
                href="/data-request"
                className="group relative bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/30 hover:scale-105 inline-flex items-center space-x-2"
                data-testid="link-data-request"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <i className="fas fa-arrow-right"></i>
                  <span>Submit Data Request</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              </a>
            </div>

            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-secondary/40 glass-effect shadow-xl rounded-3xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center shadow-lg mb-6">
                <i className="fas fa-cookie-bite text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-secondary">Cookie Management</h3>
              <p className="text-white/90 leading-relaxed mb-6">
                Learn about how we use cookies and manage your cookie preferences to control your browsing experience.
              </p>
              <a
                href="/cookie-policy"
                className="group relative bg-gradient-to-r from-secondary to-primary text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-secondary/30 hover:scale-105 inline-flex items-center space-x-2"
                data-testid="link-cookie-management"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <i className="fas fa-arrow-right"></i>
                  <span>Manage Cookies</span>
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