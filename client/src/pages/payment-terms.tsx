export default function PaymentTerms() {
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
                  <i className="fas fa-credit-card text-white text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  <span className="hidden sm:inline">Payment Terms</span>
                  <span className="sm:hidden">Payment</span>
                </h1>
                <p className="text-xs text-muted font-medium tracking-wide hidden sm:block">BILLING • REFUNDS • CANCELLATION</p>
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
                Payment Terms
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Premium Subscription Payment, Billing, Refund, and Cancellation Policy for Ascended Social
            </p>
          </div>

          {/* Executive Summary */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8 mb-8">
            <h3 className="text-3xl font-display font-bold mb-4 text-primary">Executive Summary</h3>
            <p className="text-white/90 text-lg leading-relaxed">
              This document outlines the payment, billing, refund, and cancellation policies for Ascended Social, a spiritual community and wellness platform operated by Third Eye Cyborg, LLC. It covers subscription terms, refund eligibility, billing procedures, cancellation rights, dispute resolution, and compliance with U.S. and international regulations. All payments are processed via Polar, and these policies are designed to protect both users and the company while ensuring transparency and fairness.
            </p>
          </div>

          {/* Definitions */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-secondary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8 mb-8">
            <h3 className="text-3xl font-display font-bold mb-6 text-secondary">Definitions</h3>
            <div className="grid gap-4">
              <div className="border-l-4 border-primary pl-4">
                <p className="text-white/90"><strong className="text-primary">"Ascended Social":</strong> The spiritual community and wellness platform operated by Third Eye Cyborg, LLC.</p>
              </div>
              <div className="border-l-4 border-secondary pl-4">
                <p className="text-white/90"><strong className="text-secondary">"User":</strong> Any individual subscribing to premium services on Ascended Social.</p>
              </div>
              <div className="border-l-4 border-chakra-heart pl-4">
                <p className="text-white/90"><strong className="text-chakra-heart">"Subscription":</strong> Monthly ($20/month) or annual ($200/year) premium membership.</p>
              </div>
              <div className="border-l-4 border-chakra-throat pl-4">
                <p className="text-white/90"><strong className="text-chakra-throat">"Digital Services":</strong> Intangible services including AI Oracle readings, tarot features, unlimited energy, premium community access, and custom sigil generation.</p>
              </div>
              <div className="border-l-4 border-chakra-solar pl-4">
                <p className="text-white/90"><strong className="text-chakra-solar">"Polar":</strong> The exclusive payment processor for all transactions.</p>
              </div>
              <div className="border-l-4 border-chakra-sacral pl-4">
                <p className="text-white/90"><strong className="text-chakra-sacral">"Free Trial":</strong> 7-day period with full refund eligibility if canceled during trial.</p>
              </div>
              <div className="border-l-4 border-chakra-root pl-4">
                <p className="text-white/90"><strong className="text-chakra-root">"Pro-rated Refund":</strong> Refund calculated based on unused subscription time.</p>
              </div>
            </div>
          </div>

          {/* Detailed Terms */}
          <div className="space-y-8">
            {/* Subscription Billing */}
            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-primary/40 glass-effect shadow-xl rounded-3xl p-8">
              <h3 className="text-2xl font-display font-bold mb-6 text-primary flex items-center">
                <i className="fas fa-calendar-alt mr-3"></i>
                1. Subscription Billing
              </h3>
              <ul className="space-y-3 text-white/90 leading-relaxed">
                <li className="flex items-start"><i className="fas fa-circle text-primary text-xs mt-2 mr-3"></i>Subscriptions are billed automatically on a recurring monthly or annual basis via Polar.</li>
                <li className="flex items-start"><i className="fas fa-circle text-primary text-xs mt-2 mr-3"></i>The signup date establishes the billing anniversary.</li>
                <li className="flex items-start"><i className="fas fa-circle text-primary text-xs mt-2 mr-3"></i>Users must provide and maintain a valid credit/debit card. Accepted cards: Visa, MasterCard, American Express, Discover.</li>
                <li className="flex items-start"><i className="fas fa-circle text-primary text-xs mt-2 mr-3"></i>All charges are in USD. International users may incur currency conversion fees; Ascended Social is not responsible for exchange rate fluctuations.</li>
                <li className="flex items-start"><i className="fas fa-circle text-primary text-xs mt-2 mr-3"></i>Applicable taxes (sales tax, VAT, GST) are added as required by law.</li>
                <li className="flex items-start"><i className="fas fa-circle text-primary text-xs mt-2 mr-3"></i>Price changes require 30 days' advance notice and apply to the next billing cycle.</li>
              </ul>
            </div>

            {/* Payment Processing */}
            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-secondary/40 glass-effect shadow-xl rounded-3xl p-8">
              <h3 className="text-2xl font-display font-bold mb-6 text-secondary flex items-center">
                <i className="fas fa-shield-alt mr-3"></i>
                2. Payment Processing
              </h3>
              <ul className="space-y-3 text-white/90 leading-relaxed">
                <li className="flex items-start"><i className="fas fa-circle text-secondary text-xs mt-2 mr-3"></i>Polar is the exclusive payment processor; all transactions are PCI DSS compliant.</li>
                <li className="flex items-start"><i className="fas fa-circle text-secondary text-xs mt-2 mr-3"></i>Payment authorization and capture are managed by Polar. Stored payment methods are secured per Polar's standards.</li>
                <li className="flex items-start"><i className="fas fa-circle text-secondary text-xs mt-2 mr-3"></i>Failed payments trigger automatic retries (immediate, 3 days, 7 days, final attempt at 10 days). Users have a 7-day grace period to resolve issues.</li>
                <li className="flex items-start"><i className="fas fa-circle text-secondary text-xs mt-2 mr-3"></i>Accounts are suspended after 7 days of non-payment and terminated after 30 days. Outstanding balances may be pursued for collection.</li>
              </ul>
            </div>

            {/* Refund Policy */}
            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-heart/40 glass-effect shadow-xl rounded-3xl p-8">
              <h3 className="text-2xl font-display font-bold mb-6 text-chakra-heart flex items-center">
                <i className="fas fa-undo-alt mr-3"></i>
                3. Refund Policy
              </h3>
              <ul className="space-y-3 text-white/90 leading-relaxed">
                <li className="flex items-start"><i className="fas fa-circle text-chakra-heart text-xs mt-2 mr-3"></i>Users may cancel subscriptions at any time. Pro-rated refunds are provided for unused subscription periods, except for consumed digital services (e.g., completed readings, generated sigils).</li>
                <li className="flex items-start"><i className="fas fa-circle text-chakra-heart text-xs mt-2 mr-3"></i>No refunds for digital services already delivered or for energy points consumed.</li>
                <li className="flex items-start"><i className="fas fa-circle text-chakra-heart text-xs mt-2 mr-3"></i>7-day free trial: Full refund if canceled within trial period.</li>
                <li className="flex items-start"><i className="fas fa-circle text-chakra-heart text-xs mt-2 mr-3"></i>Refunds are processed within 5-10 business days to the original payment method.</li>
                <li className="flex items-start"><i className="fas fa-circle text-chakra-heart text-xs mt-2 mr-3"></i>Refunds may be denied for violations of terms, chargebacks, or if premium benefits have been fully consumed.</li>
              </ul>
              
              <div className="mt-6 p-4 bg-cosmic/60 rounded-xl border border-chakra-heart/30">
                <h4 className="text-lg font-semibold text-chakra-heart mb-3">Refund Examples:</h4>
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-start"><i className="fas fa-arrow-right text-chakra-heart text-sm mt-1 mr-2"></i>Mid-cycle monthly cancellation (15 days in): Refund for unused 15 days.</li>
                  <li className="flex items-start"><i className="fas fa-arrow-right text-chakra-heart text-sm mt-1 mr-2"></i>Annual cancellation after 3 months: Refund for remaining 9 months.</li>
                  <li className="flex items-start"><i className="fas fa-arrow-right text-chakra-heart text-sm mt-1 mr-2"></i>No refunds for promotional pricing if benefits have been used.</li>
                </ul>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-throat/40 glass-effect shadow-xl rounded-3xl p-8">
              <h3 className="text-2xl font-display font-bold mb-6 text-chakra-throat flex items-center">
                <i className="fas fa-times-circle mr-3"></i>
                4. Subscription Cancellation Policy
              </h3>
              <ul className="space-y-3 text-white/90 leading-relaxed">
                <li className="flex items-start"><i className="fas fa-circle text-chakra-throat text-xs mt-2 mr-3"></i>Users can cancel via account settings, Polar customer portal, or by contacting support.</li>
                <li className="flex items-start"><i className="fas fa-circle text-chakra-throat text-xs mt-2 mr-3"></i>Cancellations take effect immediately, but users retain access until the end of the paid period unless otherwise specified.</li>
                <li className="flex items-start"><i className="fas fa-circle text-chakra-throat text-xs mt-2 mr-3"></i>Free trial cancellations incur no charges.</li>
                <li className="flex items-start"><i className="fas fa-circle text-chakra-throat text-xs mt-2 mr-3"></i>Accounts terminated for non-payment or violations lose premium access immediately; data is retained for 90 days for potential reactivation.</li>
                <li className="flex items-start"><i className="fas fa-circle text-chakra-throat text-xs mt-2 mr-3"></i>Premium content access is removed upon cancellation; user-generated content remains public.</li>
                <li className="flex items-start"><i className="fas fa-circle text-chakra-throat text-xs mt-2 mr-3"></i>Users may export personal data before account deletion. Permanent deletion is available upon request (GDPR compliance).</li>
              </ul>
            </div>

            {/* Procedures */}
            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-solar/40 glass-effect shadow-xl rounded-3xl p-8">
              <h3 className="text-2xl font-display font-bold mb-6 text-chakra-solar flex items-center">
                <i className="fas fa-cogs mr-3"></i>
                5. Procedures
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-chakra-solar mb-3">To cancel, users may:</h4>
                  <ol className="space-y-2 text-white/90 leading-relaxed ml-4">
                    <li className="flex items-start"><span className="text-chakra-solar font-bold mr-2">1.</span>Log in and use the self-service cancellation option.</li>
                    <li className="flex items-start"><span className="text-chakra-solar font-bold mr-2">2.</span>Contact support via email or chat.</li>
                    <li className="flex items-start"><span className="text-chakra-solar font-bold mr-2">3.</span>Use the Polar customer portal.</li>
                  </ol>
                </div>
                <ul className="space-y-3 text-white/90 leading-relaxed">
                  <li className="flex items-start"><i className="fas fa-circle text-chakra-solar text-xs mt-2 mr-3"></i>Upon cancellation, a confirmation email and final invoice are sent.</li>
                  <li className="flex items-start"><i className="fas fa-circle text-chakra-solar text-xs mt-2 mr-3"></i>Refunds (if applicable) are calculated and processed within 5-10 business days.</li>
                  <li className="flex items-start"><i className="fas fa-circle text-chakra-solar text-xs mt-2 mr-3"></i>Service restoration is possible within 90 days of cancellation, subject to payment method verification.</li>
                </ul>
              </div>
            </div>

            {/* Customer Rights & Company Obligations */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-sacral/40 glass-effect shadow-xl rounded-3xl p-8">
                <h3 className="text-2xl font-display font-bold mb-6 text-chakra-sacral flex items-center">
                  <i className="fas fa-user-shield mr-3"></i>
                  6. Customer Rights
                </h3>
                <ul className="space-y-3 text-white/90 leading-relaxed">
                  <li className="flex items-start"><i className="fas fa-check text-chakra-sacral text-sm mt-1 mr-3"></i>Right to clear billing, refund, and cancellation information.</li>
                  <li className="flex items-start"><i className="fas fa-check text-chakra-sacral text-sm mt-1 mr-3"></i>Right to dispute unauthorized charges via Polar's dispute process.</li>
                  <li className="flex items-start"><i className="fas fa-check text-chakra-sacral text-sm mt-1 mr-3"></i>Right to data export and deletion (GDPR/CCPA compliance).</li>
                  <li className="flex items-start"><i className="fas fa-check text-chakra-sacral text-sm mt-1 mr-3"></i>Right to receive timely notifications of policy changes.</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-root/40 glass-effect shadow-xl rounded-3xl p-8">
                <h3 className="text-2xl font-display font-bold mb-6 text-chakra-root flex items-center">
                  <i className="fas fa-building mr-3"></i>
                  7. Company Obligations
                </h3>
                <ul className="space-y-3 text-white/90 leading-relaxed">
                  <li className="flex items-start"><i className="fas fa-check text-chakra-root text-sm mt-1 mr-3"></i>Provide transparent billing and refund procedures.</li>
                  <li className="flex items-start"><i className="fas fa-check text-chakra-root text-sm mt-1 mr-3"></i>Process refunds and cancellations promptly.</li>
                  <li className="flex items-start"><i className="fas fa-check text-chakra-root text-sm mt-1 mr-3"></i>Maintain PCI DSS and data privacy compliance.</li>
                  <li className="flex items-start"><i className="fas fa-check text-chakra-root text-sm mt-1 mr-3"></i>Notify users of major service or policy changes with 30 days' notice.</li>
                  <li className="flex items-start"><i className="fas fa-check text-chakra-root text-sm mt-1 mr-3"></i>Retain user data securely for 90 days post-cancellation.</li>
                </ul>
              </div>
            </div>

            {/* Dispute Resolution */}
            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-primary/40 glass-effect shadow-xl rounded-3xl p-8">
              <h3 className="text-2xl font-display font-bold mb-6 text-primary flex items-center">
                <i className="fas fa-gavel mr-3"></i>
                8. Dispute Resolution
              </h3>
              <ul className="space-y-3 text-white/90 leading-relaxed">
                <li className="flex items-start"><i className="fas fa-circle text-primary text-xs mt-2 mr-3"></i>Users may dispute charges through Polar or by contacting Ascended Social support.</li>
                <li className="flex items-start"><i className="fas fa-circle text-primary text-xs mt-2 mr-3"></i>Disputes are addressed within 10 business days.</li>
                <li className="flex items-start"><i className="fas fa-circle text-primary text-xs mt-2 mr-3"></i>Polar's chargeback and dispute procedures apply.</li>
                <li className="flex items-start"><i className="fas fa-circle text-primary text-xs mt-2 mr-3"></i>Unresolved disputes may be escalated to binding arbitration under U.S. law.</li>
              </ul>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-secondary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8 mt-8">
            <h3 className="text-3xl font-display font-bold mb-6 text-secondary">Frequently Asked Questions</h3>
            <div className="grid gap-6">
              <div className="bg-cosmic/50 rounded-xl p-4 border border-secondary/20">
                <h4 className="text-lg font-semibold text-secondary mb-2">Q: How do I cancel my subscription?</h4>
                <p className="text-white/90">A: Use your account settings, the Polar portal, or contact support.</p>
              </div>
              <div className="bg-cosmic/50 rounded-xl p-4 border border-primary/20">
                <h4 className="text-lg font-semibold text-primary mb-2">Q: When will I receive my refund?</h4>
                <p className="text-white/90">A: Within 5-10 business days if eligible.</p>
              </div>
              <div className="bg-cosmic/50 rounded-xl p-4 border border-chakra-heart/20">
                <h4 className="text-lg font-semibold text-chakra-heart mb-2">Q: What happens if my payment fails?</h4>
                <p className="text-white/90">A: You have a 7-day grace period to update your payment method before suspension.</p>
              </div>
              <div className="bg-cosmic/50 rounded-xl p-4 border border-chakra-throat/20">
                <h4 className="text-lg font-semibold text-chakra-throat mb-2">Q: Can I get a refund for a completed tarot reading or sigil?</h4>
                <p className="text-white/90">A: No, refunds are not available for consumed digital services.</p>
              </div>
              <div className="bg-cosmic/50 rounded-xl p-4 border border-chakra-solar/20">
                <h4 className="text-lg font-semibold text-chakra-solar mb-2">Q: How is my data handled after cancellation?</h4>
                <p className="text-white/90">A: Data is retained for 90 days for reactivation or export, then deleted upon request.</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8 mt-8">
            <h3 className="text-3xl font-display font-bold mb-6 text-primary">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-cosmic/50 rounded-xl p-6 border border-primary/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <i className="fas fa-headset text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-primary">Customer Support</h4>
                </div>
                <p className="text-white/90 mb-3">For billing questions, refund requests, and subscription support:</p>
                <a href="mailto:support@ascended.social" className="text-primary hover:text-primary/80 font-medium">
                  support@ascended.social
                </a>
              </div>
              
              <div className="bg-cosmic/50 rounded-xl p-6 border border-secondary/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                    <i className="fas fa-balance-scale text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-secondary">Legal Inquiries</h4>
                </div>
                <p className="text-white/90 mb-3">For legal matters and policy questions:</p>
                <a href="mailto:legal@ascended.social" className="text-secondary hover:text-secondary/80 font-medium">
                  legal@ascended.social
                </a>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <div className="bg-cosmic/50 rounded-xl p-4 border border-chakra-heart/20">
                <h4 className="text-lg font-semibold text-chakra-heart mb-2">Mailing Address</h4>
                <p className="text-white/90">
                  Third Eye Cyborg, LLC<br />
                  814 North Granite Drive<br />
                  Payson, AZ 85541<br />
                  United States
                </p>
              </div>
            </div>
          </div>

          {/* Compliance Footer */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-chakra-crown/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8 mt-8">
            <h3 className="text-2xl font-display font-bold mb-4 text-chakra-crown">Compliance and Legal Framework</h3>
            <p className="text-white/90 leading-relaxed mb-4">
              This policy complies with U.S. federal and state laws, the EU General Data Protection Regulation (GDPR), UK Consumer Rights Act, Canadian PIPEDA, Australian Consumer Law, and Polar's terms of service. PCI DSS, anti-money laundering, and KYC requirements are met through Polar. Dispute and chargeback procedures follow Polar's protocols. International payment acceptance is subject to Polar's limitations.
            </p>
            <p className="text-white/80 text-center font-medium">
              By subscribing to Ascended Social, you acknowledge and accept these payment, billing, refund, and cancellation policies.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}