import { useState } from 'react';

export default function CookiePolicy() {
  const [activeTab, setActiveTab] = useState('overview');

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

          {/* Cookie Policy Link */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-display font-bold mb-4 text-primary">Cookie Policy & Preferences</h3>
              <p className="text-white/80 text-lg">
                View our complete cookie policy and manage your privacy preferences using our secure hosted policy center.
              </p>
            </div>

            <div className="text-center">
              <p className="text-white/90 text-lg leading-relaxed">
                Our complete cookie policy and privacy preferences are detailed below. You have full control over your privacy settings and can modify them at any time.
              </p>
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

          {/* Privacy Policy Section */}
          <div className="mt-12">
            <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-display font-bold mb-4 text-primary">Privacy Policy</h3>
                <p className="text-white/80 text-lg">
                  Your spiritual journey is personal. Here's how we protect and respect your privacy on Ascended Social.
                </p>
              </div>

              <div className="space-y-8 text-white/90">
                {/* Data Collection */}
                <div className="bg-cosmic/50 rounded-2xl p-6 border border-primary/20">
                  <h4 className="text-xl font-semibold text-primary mb-4 flex items-center">
                    <i className="fas fa-database mr-3"></i>
                    Information We Collect
                  </h4>
                  <div className="space-y-3 text-sm leading-relaxed">
                    <p><strong>Account Information:</strong> Username, email address, spiritual preferences, and profile details you provide.</p>
                    <p><strong>Content:</strong> Posts, comments, visions, and other spiritual content you share on our platform.</p>
                    <p><strong>Usage Data:</strong> How you interact with our platform, including pages visited, features used, and engagement patterns.</p>
                    <p><strong>Analytics:</strong> Anonymous usage statistics to improve our platform and spiritual guidance algorithms.</p>
                    <p><strong>Payment Information:</strong> Billing details processed securely through Polar for premium subscriptions.</p>
                  </div>
                </div>

                {/* Data Usage */}
                <div className="bg-cosmic/50 rounded-2xl p-6 border border-blue-400/20">
                  <h4 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
                    <i className="fas fa-magic mr-3"></i>
                    How We Use Your Information
                  </h4>
                  <div className="space-y-3 text-sm leading-relaxed">
                    <p><strong>Spiritual Guidance:</strong> Personalize your spiritual journey with tailored content and recommendations.</p>
                    <p><strong>Community Building:</strong> Connect you with like-minded spiritual practitioners and communities.</p>
                    <p><strong>Platform Improvement:</strong> Analyze usage patterns to enhance features and user experience.</p>
                    <p><strong>Communication:</strong> Send important updates, newsletters, and spiritual insights you've subscribed to.</p>
                    <p><strong>Safety & Security:</strong> Protect against fraud, abuse, and maintain platform integrity.</p>
                  </div>
                </div>

                {/* Data Sharing */}
                <div className="bg-cosmic/50 rounded-2xl p-6 border border-purple-400/20">
                  <h4 className="text-xl font-semibold text-purple-400 mb-4 flex items-center">
                    <i className="fas fa-share-alt mr-3"></i>
                    Information Sharing
                  </h4>
                  <div className="space-y-3 text-sm leading-relaxed">
                    <p><strong>Third-Party Services:</strong> We work with trusted partners including Polar (payments), PostHog (analytics), OneSignal (emails), and Cloudflare (content delivery).</p>
                    <p><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our users' safety.</p>
                    <p><strong>Community Content:</strong> Posts and comments you make public are visible to other users as intended.</p>
                    <p><strong>No Selling:</strong> We never sell your personal information to third parties.</p>
                  </div>
                </div>

                {/* User Rights */}
                <div className="bg-cosmic/50 rounded-2xl p-6 border border-green-400/20">
                  <h4 className="text-xl font-semibold text-green-400 mb-4 flex items-center">
                    <i className="fas fa-user-shield mr-3"></i>
                    Your Privacy Rights
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm leading-relaxed">
                    <div>
                      <p><strong>Access:</strong> Request a copy of your personal data</p>
                      <p><strong>Rectification:</strong> Correct inaccurate information</p>
                      <p><strong>Erasure:</strong> Request deletion of your data</p>
                    </div>
                    <div>
                      <p><strong>Portability:</strong> Export your data in a readable format</p>
                      <p><strong>Withdraw Consent:</strong> Opt-out of data processing anytime</p>
                      <p><strong>Object:</strong> Restrict certain data processing activities</p>
                    </div>
                  </div>
                </div>

                {/* Data Security */}
                <div className="bg-cosmic/50 rounded-2xl p-6 border border-yellow-400/20">
                  <h4 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center">
                    <i className="fas fa-lock mr-3"></i>
                    Data Security & Retention
                  </h4>
                  <div className="space-y-3 text-sm leading-relaxed">
                    <p><strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard protocols.</p>
                    <p><strong>Access Controls:</strong> Strict employee access controls and regular security audits.</p>
                    <p><strong>Retention:</strong> We keep your data only as long as necessary or until you request deletion.</p>
                    <p><strong>Compliance:</strong> GDPR, CCPA, and other privacy regulation compliant.</p>
                  </div>
                </div>

                {/* Custom Privacy Section */}
                <div className="bg-cosmic/50 rounded-2xl p-6 border border-orange-400/20">
                  <h4 className="text-xl font-semibold text-orange-400 mb-4 flex items-center">
                    <i className="fas fa-star mr-3"></i>
                    Spiritual Data & Energy Privacy
                  </h4>
                  <div className="space-y-3 text-sm leading-relaxed">
                    <p><strong>Sacred Information:</strong> Your spiritual journey data, including visions, energy readings, and personal insights, are treated with the highest level of privacy and respect.</p>
                    <p><strong>Energy Algorithms:</strong> Our spiritual guidance algorithms use anonymized patterns to provide personalized recommendations without storing identifiable spiritual content.</p>
                    <p><strong>Community Sharing:</strong> You have complete control over what spiritual content you share publicly versus keep private in your personal spiritual journal.</p>
                    <p><strong>Third-Party Spiritual Services:</strong> We may integrate with trusted spiritual service providers (tarot readers, astrologers) but never share your personal data without explicit consent.</p>
                    <p><strong>Meditation & Mindfulness:</strong> Session data from guided meditations and mindfulness exercises is processed locally on your device when possible to maintain privacy.</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-cosmic/50 rounded-2xl p-6 border border-secondary/20">
                  <h4 className="text-xl font-semibold text-secondary mb-4 flex items-center">
                    <i className="fas fa-envelope mr-3"></i>
                    Contact & Updates
                  </h4>
                  <div className="space-y-3 text-sm leading-relaxed">
                    <p><strong>Privacy Questions:</strong> Contact us at privacy@ascended.social for any privacy-related inquiries.</p>
                    <p><strong>Data Requests:</strong> Use our privacy dashboard in your profile settings or email us directly.</p>
                    <p><strong>Policy Updates:</strong> We'll notify you of any material changes to this privacy policy.</p>
                    <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                  </div>
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