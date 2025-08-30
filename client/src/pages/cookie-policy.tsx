import { useEffect } from "react";

export default function CookiePolicy() {
  useEffect(() => {
    // No special script loading needed for static cookie policy content
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

          {/* Cookie Policy Content */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8">
            <div className="prose prose-lg max-w-none text-white/90">
              
              {/* Cookie Preferences Button */}
              <div className="text-center mb-8 p-6 bg-primary/10 rounded-2xl border border-primary/30">
                <h3 className="text-xl font-semibold text-primary mb-3">Manage Your Cookie Preferences</h3>
                <p className="text-white/80 mb-4">Click below to customize your cookie settings and privacy preferences.</p>
                <button 
                  onClick={() => {
                    if (window.Enzuzo && window.Enzuzo.showBanner) {
                      window.Enzuzo.showBanner();
                    } else {
                      alert('Cookie preferences are loading. Please try again in a moment.');
                    }
                  }}
                  className="bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-primary/30 hover:scale-105"
                  data-testid="button-cookie-preferences"
                >
                  Open Cookie Preferences
                </button>
              </div>

              {/* Cookie Policy Content */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-2xl font-bold text-primary mb-4">What Are Cookies?</h3>
                  <p className="leading-relaxed">
                    Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and enabling certain features of our spiritual platform.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold text-primary mb-4">Types of Cookies We Use</h3>
                  
                  <div className="space-y-6">
                    <div className="border border-primary/20 rounded-lg p-6 bg-cosmic/30">
                      <h4 className="text-xl font-semibold text-secondary mb-3">Essential Cookies</h4>
                      <p className="leading-relaxed mb-3">
                        These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                      </p>
                      <p className="text-sm text-white/70">
                        <strong>Examples:</strong> Session management, authentication, load balancing
                      </p>
                    </div>

                    <div className="border border-primary/20 rounded-lg p-6 bg-cosmic/30">
                      <h4 className="text-xl font-semibold text-secondary mb-3">Analytics Cookies</h4>
                      <p className="leading-relaxed mb-3">
                        These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our spiritual platform.
                      </p>
                      <p className="text-sm text-white/70">
                        <strong>Examples:</strong> PostHog analytics, page views, user journeys
                      </p>
                    </div>

                    <div className="border border-primary/20 rounded-lg p-6 bg-cosmic/30">
                      <h4 className="text-xl font-semibold text-secondary mb-3">Functional Cookies</h4>
                      <p className="leading-relaxed mb-3">
                        These cookies enable enhanced functionality and personalization, such as remembering your spiritual preferences and customization settings.
                      </p>
                      <p className="text-sm text-white/70">
                        <strong>Examples:</strong> Theme preferences, language settings, user preferences
                      </p>
                    </div>

                    <div className="border border-primary/20 rounded-lg p-6 bg-cosmic/30">
                      <h4 className="text-xl font-semibold text-secondary mb-3">Marketing Cookies</h4>
                      <p className="leading-relaxed mb-3">
                        These cookies are used to deliver relevant content and track the effectiveness of our spiritual community outreach.
                      </p>
                      <p className="text-sm text-white/70">
                        <strong>Examples:</strong> Social media integration, content personalization
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-bold text-primary mb-4">Your Choices</h3>
                  <div className="space-y-4">
                    <p className="leading-relaxed">
                      You have several options for managing cookies on Ascended Social:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Use our cookie preference center (button above) to customize your settings</li>
                      <li>Modify your browser settings to block or delete cookies</li>
                      <li>Opt out of analytics tracking while maintaining essential functionality</li>
                      <li>Contact us if you have questions about our cookie practices</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-bold text-primary mb-4">Third-Party Services</h3>
                  <p className="leading-relaxed mb-4">
                    Our spiritual platform integrates with several trusted third-party services that may set their own cookies:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-primary/20 rounded-lg p-4 bg-cosmic/20">
                      <h5 className="font-semibold text-secondary mb-2">PostHog Analytics</h5>
                      <p className="text-sm text-white/80">Privacy-first analytics for improving user experience</p>
                    </div>
                    <div className="border border-primary/20 rounded-lg p-4 bg-cosmic/20">
                      <h5 className="font-semibold text-secondary mb-2">Google Cloud Storage</h5>
                      <p className="text-sm text-white/80">Secure storage for your spiritual content and media</p>
                    </div>
                    <div className="border border-primary/20 rounded-lg p-4 bg-cosmic/20">
                      <h5 className="font-semibold text-secondary mb-2">Stripe Payments</h5>
                      <p className="text-sm text-white/80">Secure payment processing for premium features</p>
                    </div>
                    <div className="border border-primary/20 rounded-lg p-4 bg-cosmic/20">
                      <h5 className="font-semibold text-secondary mb-2">Replit Authentication</h5>
                      <p className="text-sm text-white/80">Secure login and user management</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-bold text-primary mb-4">Contact Us</h3>
                  <p className="leading-relaxed">
                    If you have any questions about our cookie policy or privacy practices, please contact us. We're committed to transparency in our spiritual community.
                  </p>
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/30">
                    <p className="text-sm text-white/80">
                      <strong>Last Updated:</strong> August 30, 2025<br/>
                      <strong>Effective Date:</strong> This policy is effective immediately upon posting.
                    </p>
                  </div>
                </section>
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