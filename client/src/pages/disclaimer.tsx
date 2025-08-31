
export default function Disclaimer() {
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
                  <i className="fas fa-exclamation-triangle text-white text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  <span className="hidden sm:inline">Legal Disclaimer</span>
                  <span className="sm:hidden">Disclaimer</span>
                </h1>
                <p className="text-xs text-muted font-medium tracking-wide hidden sm:block">LEGAL • DISCLAIMER • PROTECTION</p>
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 mt-8">
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-chakra-heart to-secondary bg-clip-text text-transparent">
                Legal Disclaimer
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Important legal disclaimers for using Ascended Social platform and spiritual services.
            </p>
          </div>

          {/* Disclaimer Content */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8">
            <div className="prose prose-invert max-w-none">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-display font-bold mb-2 text-primary">Ascended Social – Comprehensive Legal Disclaimer</h1>
                <p className="text-white/80 text-lg">Operated by Third Eye Cyborg, LLC</p>
                <div className="mt-4 text-sm text-white/60">
                  <p><strong>Effective Date:</strong> August 30, 2025</p>
                  <p><strong>Version:</strong> 1.0</p>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8">
                <p className="text-yellow-200 font-semibold text-center">
                  <strong>PLEASE READ THIS DISCLAIMER CAREFULLY BEFORE USING ASCENDED SOCIAL. BY ACCESSING OR USING THE PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THIS DISCLAIMER AND ALL RELATED POLICIES.</strong>
                </p>
              </div>

              <div className="space-y-8">
                {/* Section 1 */}
                <section>
                  <h3 className="text-2xl font-bold mb-4 text-primary">1. SPIRITUAL CONTENT DISCLAIMER</h3>
                  <p className="text-white/90 leading-relaxed">
                    Ascended Social is a spiritual community and wellness platform operated by Third Eye Cyborg, LLC. The platform offers spiritual guidance, Oracle readings, tarot features, AI-powered spiritual insights, and user-generated spiritual content. All spiritual content, including but not limited to readings, guidance, and community discussions, is provided for entertainment and personal insight purposes only. Spiritual guidance is not a substitute for professional advice (including but not limited to medical, legal, financial, or therapeutic advice). Results are not guaranteed and individual experiences may vary. Content should not be used for making important life decisions without professional consultation. Ascended Social and Third Eye Cyborg, LLC disclaim responsibility for any decisions made based on spiritual content. All users must be 18 years of age or older to access spiritual readings and features. Spiritual practices and content reflect personal beliefs and are not presented as scientific facts. Intellectual property rights in spiritual methodologies and content are reserved. Users acknowledge personal responsibility for their spiritual practices and interpretations.
                  </p>
                </section>

                {/* Section 2 */}
                <section>
                  <h3 className="text-2xl font-bold mb-4 text-primary">2. NO MEDICAL, LEGAL, OR FINANCIAL ADVICE</h3>
                  <p className="text-white/90 leading-relaxed">
                    No content on Ascended Social constitutes or should be interpreted as medical, legal, financial, or therapeutic advice. The platform does not diagnose, treat, cure, or prevent any medical condition. Users must consult licensed professionals for all health, legal, and financial matters. Platform operators, contributors, and affiliates are not licensed healthcare providers, attorneys, or financial advisors. In case of emergency, users must seek immediate professional medical attention. Spiritual practices and content are intended to complement, not replace, professional treatment. Users acknowledge that they use all platform content at their own risk. This includes, but is not limited to, mental health and spiritual wellness discussions, energy healing, chakra-related content, life guidance, relationship and career advice, and financial prosperity teachings. Ascended Social and Third Eye Cyborg, LLC disclaim all liability for any loss, injury, or damages resulting from reliance on platform content. User responsibility for seeking appropriate professional help is expressly stated. The platform complies with applicable healthcare and professional service regulations.
                  </p>
                </section>

                {/* Section 3 */}
                <section>
                  <h3 className="text-2xl font-bold mb-4 text-primary">3. USER-GENERATED CONTENT (UGC) DISCLAIMER</h3>
                  <p className="text-white/90 leading-relaxed">
                    Ascended Social enables users to post, share, and discuss spiritual experiences, advice, and interpretations. User-generated content (UGC) includes posts, comments, testimonials, spiritual practices, rituals, advice, interpretations, photos, videos, and other media. The platform does not endorse, verify, or take responsibility for the accuracy or reliability of any UGC. Users are solely responsible for their posted content and its accuracy. Spiritual experiences and advice shared by users are personal opinions only. Ascended Social and Third Eye Cyborg, LLC disclaim liability for any harm caused by following user advice or guidance. By posting content, users grant the platform a non-exclusive, royalty-free license to use, display, and distribute their contributions as outlined in the Terms of Service. Users are responsible for ensuring their content does not infringe on third-party rights. The platform provides mechanisms for reporting inappropriate or harmful content and reserves the right to remove content at its discretion. Users agree to abide by all community guidelines. Section 230 of the Communications Decency Act applies where relevant. Users indemnify Ascended Social and Third Eye Cyborg, LLC for any claims arising from their content.
                  </p>
                </section>

                {/* Section 4 */}
                <section>
                  <h3 className="text-2xl font-bold mb-4 text-primary">4. LIMITATION OF LIABILITY</h3>
                  <p className="text-white/90 leading-relaxed">
                    To the fullest extent permitted by law, Ascended Social and Third Eye Cyborg, LLC disclaim all warranties, express or implied, regarding the platform and its content. In no event shall Ascended Social, Third Eye Cyborg, LLC, its affiliates, employees, or contributors be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising from or related to the use of the platform or reliance on any content. Use of the platform is at your own risk.
                  </p>
                </section>

                {/* Section 5 */}
                <section>
                  <h3 className="text-2xl font-bold mb-4 text-primary">5. THIRD-PARTY CONTENT AND LINKS</h3>
                  <p className="text-white/90 leading-relaxed">
                    The platform may contain links to third-party websites, content, or services not owned or controlled by Ascended Social or Third Eye Cyborg, LLC. No endorsement or responsibility is assumed for third-party content. Users access third-party sites at their own risk and are subject to the terms and policies of those sites.
                  </p>
                </section>

                {/* Section 6 */}
                <section>
                  <h3 className="text-2xl font-bold mb-4 text-primary">6. JURISDICTION AND GOVERNING LAW</h3>
                  <p className="text-white/90 leading-relaxed">
                    This disclaimer and all related matters are governed by the laws of the United States, with specific attention to compliance for users in the EU and UK. Users outside the United States are responsible for compliance with local laws. EU/UK users are entitled to statutory rights under applicable consumer protection laws.
                  </p>
                </section>

                {/* Section 7 */}
                <section>
                  <h3 className="text-2xl font-bold mb-4 text-primary">7. AGE RESTRICTIONS AND PARENTAL CONSENT</h3>
                  <p className="text-white/90 leading-relaxed">
                    Ascended Social is intended for users 18 years of age or older. Users under 18 must have parental or guardian consent to use the platform. The platform does not knowingly collect personal information from children under 13.
                  </p>
                </section>

                {/* Section 8 */}
                <section>
                  <h3 className="text-2xl font-bold mb-4 text-primary">8. ACCESSIBILITY AND MULTI-LANGUAGE CONSIDERATIONS</h3>
                  <p className="text-white/90 leading-relaxed">
                    Ascended Social is committed to accessibility and strives to ensure the platform is usable by all individuals, including those with disabilities. For accessibility support, please contact <a href="mailto:support@ascendedsocial.com" className="text-primary underline">support@ascendedsocial.com</a>. The platform may provide content in multiple languages; however, the English version prevails in case of discrepancies.
                  </p>
                </section>

                {/* Section 9 */}
                <section>
                  <h3 className="text-2xl font-bold mb-4 text-primary">9. CONTACT INFORMATION</h3>
                  <p className="text-white/90 leading-relaxed">
                    For legal inquiries or to report content violations, please contact: <a href="mailto:legal@ascendedsocial.com" className="text-primary underline">legal@ascendedsocial.com</a> or Third Eye Cyborg, LLC Legal Department.
                  </p>
                </section>

                {/* Section 10 */}
                <section>
                  <h3 className="text-2xl font-bold mb-4 text-primary">10. LINKS TO RELATED POLICIES</h3>
                  <p className="text-white/90 leading-relaxed">
                    For more information, please review our <a href="/terms-of-service" className="text-primary underline">Terms of Service</a> and <a href="/privacy-policy" className="text-primary underline">Privacy Policy</a>, accessible via the platform footer.
                  </p>
                </section>

                {/* Section 11 */}
                <section>
                  <h3 className="text-2xl font-bold mb-4 text-primary">11. EFFECTIVE DATE, VERSION, AND UPDATES</h3>
                  <p className="text-white/90 leading-relaxed">
                    This disclaimer is effective as of the date stated above. Ascended Social and Third Eye Cyborg, LLC reserve the right to update this disclaimer at any time. Users are encouraged to review this page regularly. Continued use of the platform constitutes acceptance of any changes.
                  </p>
                </section>
              </div>

              <div className="mt-12 pt-8 border-t border-primary/20 text-center">
                <p className="text-white/70">
                  If you have questions about this disclaimer or require further information, please contact us at <a href="mailto:legal@ascendedsocial.com" className="text-primary underline">legal@ascendedsocial.com</a>.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-primary/40 glass-effect shadow-xl rounded-3xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg mb-6">
                <i className="fas fa-file-contract text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-primary">Terms of Service</h3>
              <p className="text-white/90 leading-relaxed mb-6">
                Read our complete terms and conditions that govern your use of Ascended Social.
              </p>
              <a
                href="/terms-of-service"
                className="group relative bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/30 hover:scale-105 inline-flex items-center space-x-2"
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
                Learn how we protect your personal information and spiritual data.
              </p>
              <a
                href="/privacy-policy"
                className="group relative bg-gradient-to-r from-secondary to-primary text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-secondary/30 hover:scale-105 inline-flex items-center space-x-2"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <i className="fas fa-arrow-right"></i>
                  <span>View Privacy</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              </a>
            </div>

            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-purple-400/40 glass-effect shadow-xl rounded-3xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mb-6">
                <i className="fas fa-envelope text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-purple-400">Contact Us</h3>
              <p className="text-white/90 leading-relaxed mb-6">
                Have questions about our legal policies? Contact our legal team.
              </p>
              <a
                href="mailto:legal@ascendedsocial.com"
                className="group relative bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/30 hover:scale-105 inline-flex items-center space-x-2"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <i className="fas fa-envelope"></i>
                  <span>Legal Contact</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
