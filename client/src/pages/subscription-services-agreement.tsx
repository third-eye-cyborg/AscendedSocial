export default function SubscriptionServicesAgreement() {
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
                  <i className="fas fa-file-signature text-white text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  <span className="hidden sm:inline">Subscription Services Agreement</span>
                  <span className="sm:hidden">SSA</span>
                </h1>
                <p className="text-xs text-muted font-medium tracking-wide hidden sm:block">SUBSCRIPTION • SERVICES • AGREEMENT</p>
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
                Subscription Services Agreement
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Review the agreement that governs your subscription to Ascended Social's premium spiritual services and features.
            </p>
          </div>

          {/* SSA Link */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-display font-bold mb-4 text-primary">Subscription Agreement</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                View our complete subscription services agreement to understand the terms for premium spiritual features, billing, and subscription management.
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-white/90 text-lg leading-relaxed">
                Our complete subscription services agreement is embedded below. This governs the terms for premium spiritual features and billing.
              </p>
            </div>

            {/* Additional Information */}
            <div className="mt-8 pt-6 border-t border-primary/20">
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="bg-cosmic/50 rounded-2xl p-6 border border-blue-400/20">
                  <h4 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
                    <i className="fas fa-star mr-3"></i>
                    Premium Features
                  </h4>
                  <div className="space-y-3 text-white/80 leading-relaxed">
                    <p><strong>Unlimited Energy:</strong> Share infinite spiritual energy with the community</p>
                    <p><strong>Enhanced Oracle:</strong> Access to advanced AI-powered spiritual guidance</p>
                    <p><strong>Priority Support:</strong> Dedicated spiritual guidance and technical support</p>
                    <p><strong>Advanced Analytics:</strong> Deep insights into your spiritual growth journey</p>
                  </div>
                </div>

                <div className="bg-cosmic/50 rounded-2xl p-6 border border-purple-400/20">
                  <h4 className="text-xl font-semibold text-purple-400 mb-4 flex items-center">
                    <i className="fas fa-credit-card mr-3"></i>
                    Subscription Terms
                  </h4>
                  <div className="space-y-3 text-white/80 leading-relaxed">
                    <p><strong>Billing:</strong> Monthly or annual subscription options available</p>
                    <p><strong>Cancellation:</strong> Cancel anytime with immediate effect</p>
                    <p><strong>Refunds:</strong> Prorated refunds for unused subscription periods</p>
                    <p><strong>Auto-Renewal:</strong> Subscriptions renew automatically unless canceled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-12 text-center">
            <div className="bg-cosmic/30 rounded-2xl p-8 border border-primary/30">
              <h3 className="text-2xl font-display font-bold mb-4 text-primary">
                Questions About Your Subscription?
              </h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Our spiritual support team is here to help you with any subscription-related questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="mailto:support@ascended.social"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-blue-400 hover:to-purple-400 transition-all duration-300"
                  data-testid="link-support-email"
                >
                  <i className="fas fa-envelope"></i>
                  <span>Email Support</span>
                </a>
                <span className="text-white/60 hidden sm:inline">•</span>
                <a 
                  href="/data-request"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-green-400 hover:to-blue-400 transition-all duration-300"
                  data-testid="link-data-request"
                >
                  <i className="fas fa-user-shield"></i>
                  <span>Data Rights</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}