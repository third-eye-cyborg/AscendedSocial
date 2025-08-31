export default function CopyrightAssignment() {
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
                  <i className="fas fa-copyright text-white text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  <span className="hidden sm:inline">Copyright & IP</span>
                  <span className="sm:hidden">Copyright</span>
                </h1>
                <p className="text-xs text-muted font-medium tracking-wide hidden sm:block">INTELLECTUAL PROPERTY • CONTENT • PROTECTION</p>
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
                Copyright & Intellectual Property
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Comprehensive intellectual property protection and content licensing framework for Ascended Social
            </p>
          </div>

          {/* Executive Summary */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-primary/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8 mb-8">
            <h3 className="text-3xl font-display font-bold mb-4 text-primary">Intellectual Property Overview</h3>
            <p className="text-white/90 text-lg leading-relaxed">
              This document outlines the comprehensive intellectual property protection framework for Ascended Social, a spiritual community platform operated by Third Eye Cyborg, LLC. It covers DMCA compliance, user content licensing, copyright assignment, and protection of proprietary spiritual algorithms and technologies.
            </p>
          </div>

          {/* DMCA Takedown Policy */}
          <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-secondary/40 glass-effect shadow-xl rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-display font-bold mb-6 text-secondary flex items-center">
              <i className="fas fa-shield-alt mr-3"></i>
              DMCA Takedown Policy
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-secondary mb-3">Protected Content Types</h4>
                <ul className="space-y-2 text-white/90 leading-relaxed">
                  <li className="flex items-start"><i className="fas fa-circle text-secondary text-xs mt-2 mr-3"></i>Text posts about spiritual experiences and guidance</li>
                  <li className="flex items-start"><i className="fas fa-circle text-secondary text-xs mt-2 mr-3"></i>Images including spiritual artwork, chakra diagrams, and personal photos</li>
                  <li className="flex items-start"><i className="fas fa-circle text-secondary text-xs mt-2 mr-3"></i>Custom-generated sigils and spiritual symbols</li>
                  <li className="flex items-start"><i className="fas fa-circle text-secondary text-xs mt-2 mr-3"></i>Audio recordings of spiritual practices and meditations</li>
                  <li className="flex items-start"><i className="fas fa-circle text-secondary text-xs mt-2 mr-3"></i>Video content including spiritual teachings and practices</li>
                  <li className="flex items-start"><i className="fas fa-circle text-secondary text-xs mt-2 mr-3"></i>Community discussions and collaborative spiritual content</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-secondary mb-3">DMCA Agent Contact</h4>
                <div className="bg-cosmic/50 rounded-xl p-4 border border-secondary/30">
                  <p className="text-white/90">
                    <strong>Company:</strong> Third Eye Cyborg, LLC<br />
                    <strong>Platform:</strong> Ascended Social<br />
                    <strong>Email:</strong> <a href="mailto:dmca@ascendedsocial.com" className="text-secondary hover:text-secondary/80">dmca@ascendedsocial.com</a><br />
                    <strong>Address:</strong> 814 North Granite Drive, Payson, AZ 85541
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-secondary mb-3">Takedown Process</h4>
                <div className="grid gap-4">
                  <div className="border-l-4 border-secondary pl-4">
                    <p className="text-white/90"><strong className="text-secondary">Step 1:</strong> Submit valid DMCA notice with required elements</p>
                  </div>
                  <div className="border-l-4 border-chakra-heart pl-4">
                    <p className="text-white/90"><strong className="text-chakra-heart">Step 2:</strong> 24-48 hour response time for content removal</p>
                  </div>
                  <div className="border-l-4 border-chakra-throat pl-4">
                    <p className="text-white/90"><strong className="text-chakra-throat">Step 3:</strong> User notification and counter-notice opportunity</p>
                  </div>
                  <div className="border-l-4 border-chakra-solar pl-4">
                    <p className="text-white/90"><strong className="text-chakra-solar">Step 4:</strong> Content restoration if valid counter-notice filed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Intellectual Property Rights */}
          <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-heart/40 glass-effect shadow-xl rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-display font-bold mb-6 text-chakra-heart flex items-center">
              <i className="fas fa-brain mr-3"></i>
              Proprietary Platform Assets
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-chakra-heart mb-3">Core Technology</h4>
                <ul className="space-y-2 text-white/90">
                  <li className="flex items-start"><i className="fas fa-code text-chakra-heart text-sm mt-1 mr-2"></i>Spiritual algorithms and energy calculation systems</li>
                  <li className="flex items-start"><i className="fas fa-robot text-chakra-heart text-sm mt-1 mr-2"></i>Proprietary Oracle AI and divination systems</li>
                  <li className="flex items-start"><i className="fas fa-star text-chakra-heart text-sm mt-1 mr-2"></i>Sigil generation algorithms and formulas</li>
                  <li className="flex items-start"><i className="fas fa-database text-chakra-heart text-sm mt-1 mr-2"></i>Chakra mapping and progress tracking</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-chakra-heart mb-3">Brand & Design</h4>
                <ul className="space-y-2 text-white/90">
                  <li className="flex items-start"><i className="fas fa-trademark text-chakra-heart text-sm mt-1 mr-2"></i>Ascended Social brand and logos</li>
                  <li className="flex items-start"><i className="fas fa-palette text-chakra-heart text-sm mt-1 mr-2"></i>Platform UI/UX design and flows</li>
                  <li className="flex items-start"><i className="fas fa-pen text-chakra-heart text-sm mt-1 mr-2"></i>Original spiritual content by Third Eye Cyborg</li>
                  <li className="flex items-start"><i className="fas fa-chart-line text-chakra-heart text-sm mt-1 mr-2"></i>User engagement optimization systems</li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Content License Agreement */}
          <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-throat/40 glass-effect shadow-xl rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-display font-bold mb-6 text-chakra-throat flex items-center">
              <i className="fas fa-users mr-3"></i>
              User Content Licensing
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-chakra-throat mb-3">User Content Categories</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-white/90">
                    <li className="flex items-start"><i className="fas fa-book text-chakra-throat text-sm mt-1 mr-2"></i>Personal spiritual experiences and journeys</li>
                    <li className="flex items-start"><i className="fas fa-comments text-chakra-throat text-sm mt-1 mr-2"></i>Community posts and discussions</li>
                    <li className="flex items-start"><i className="fas fa-image text-chakra-throat text-sm mt-1 mr-2"></i>Uploaded photos, videos, and multimedia</li>
                    <li className="flex items-start"><i className="fas fa-magic text-chakra-throat text-sm mt-1 mr-2"></i>Custom sigils and spiritual symbols</li>
                  </ul>
                  <ul className="space-y-2 text-white/90">
                    <li className="flex items-start"><i className="fas fa-crystal-ball text-chakra-throat text-sm mt-1 mr-2"></i>Oracle reading interpretations</li>
                    <li className="flex items-start"><i className="fas fa-vision text-chakra-throat text-sm mt-1 mr-2"></i>Vision board creations</li>
                    <li className="flex items-start"><i className="fas fa-star text-chakra-throat text-sm mt-1 mr-2"></i>Reviews and testimonials</li>
                    <li className="flex items-start"><i className="fas fa-graduation-cap text-chakra-throat text-sm mt-1 mr-2"></i>Educational spiritual content</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-chakra-throat mb-3">Licensing Terms</h4>
                <div className="bg-cosmic/50 rounded-xl p-4 border border-chakra-throat/30">
                  <p className="text-white/90 mb-3">
                    By posting content on Ascended Social, users grant Third Eye Cyborg, LLC a <strong className="text-chakra-throat">non-exclusive, worldwide, royalty-free license</strong> to:
                  </p>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start"><i className="fas fa-arrow-right text-chakra-throat text-sm mt-1 mr-2"></i>Display and distribute content on the platform</li>
                    <li className="flex items-start"><i className="fas fa-arrow-right text-chakra-throat text-sm mt-1 mr-2"></i>Use content for platform promotion and marketing</li>
                    <li className="flex items-start"><i className="fas fa-arrow-right text-chakra-throat text-sm mt-1 mr-2"></i>Modify content for platform optimization</li>
                    <li className="flex items-start"><i className="fas fa-arrow-right text-chakra-throat text-sm mt-1 mr-2"></i>Sublicense for platform operations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* User Rights and Protections */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-solar/40 glass-effect shadow-xl rounded-3xl p-8">
              <h3 className="text-2xl font-display font-bold mb-6 text-chakra-solar flex items-center">
                <i className="fas fa-user-shield mr-3"></i>
                User Rights
              </h3>
              <ul className="space-y-3 text-white/90 leading-relaxed">
                <li className="flex items-start"><i className="fas fa-check text-chakra-solar text-sm mt-1 mr-3"></i>Retain ownership of original content</li>
                <li className="flex items-start"><i className="fas fa-check text-chakra-solar text-sm mt-1 mr-3"></i>Attribution rights and credit requirements</li>
                <li className="flex items-start"><i className="fas fa-check text-chakra-solar text-sm mt-1 mr-3"></i>Content removal rights and procedures</li>
                <li className="flex items-start"><i className="fas fa-check text-chakra-solar text-sm mt-1 mr-3"></i>Privacy protection for personal sharing</li>
                <li className="flex items-start"><i className="fas fa-check text-chakra-solar text-sm mt-1 mr-3"></i>Data portability and export rights</li>
                <li className="flex items-start"><i className="fas fa-check text-chakra-solar text-sm mt-1 mr-3"></i>DMCA counter-notification protection</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-sacral/40 glass-effect shadow-xl rounded-3xl p-8">
              <h3 className="text-2xl font-display font-bold mb-6 text-chakra-sacral flex items-center">
                <i className="fas fa-shield-alt mr-3"></i>
                Platform Protections
              </h3>
              <ul className="space-y-3 text-white/90 leading-relaxed">
                <li className="flex items-start"><i className="fas fa-check text-chakra-sacral text-sm mt-1 mr-3"></i>Content moderation for community standards</li>
                <li className="flex items-start"><i className="fas fa-check text-chakra-sacral text-sm mt-1 mr-3"></i>Sacred content respect requirements</li>
                <li className="flex items-start"><i className="fas fa-check text-chakra-sacral text-sm mt-1 mr-3"></i>Cultural sensitivity enforcement</li>
                <li className="flex items-start"><i className="fas fa-check text-chakra-sacral text-sm mt-1 mr-3"></i>Anti-exploitation measures</li>
                <li className="flex items-start"><i className="fas fa-check text-chakra-sacral text-sm mt-1 mr-3"></i>Secure content storage and access</li>
                <li className="flex items-start"><i className="fas fa-check text-chakra-sacral text-sm mt-1 mr-3"></i>Intellectual property violation response</li>
              </ul>
            </div>
          </div>

          {/* Copyright Assignment Agreement */}
          <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-chakra-root/40 glass-effect shadow-xl rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-display font-bold mb-6 text-chakra-root flex items-center">
              <i className="fas fa-file-contract mr-3"></i>
              Copyright Assignment Framework
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-chakra-root mb-3">Assignment Scope</h4>
                <p className="text-white/90 mb-4">
                  This framework governs the assignment of intellectual property rights for works created for or in connection with the Ascended Social platform, ensuring comprehensive protection of Third Eye Cyborg, LLC's proprietary assets.
                </p>
                
                <div className="bg-cosmic/50 rounded-xl p-4 border border-chakra-root/30">
                  <h5 className="text-md font-semibold text-chakra-root mb-2">Covered Works Include:</h5>
                  <ul className="space-y-1 text-white/80 text-sm">
                    <li>• Proprietary spiritual algorithms and calculation systems</li>
                    <li>• Custom sigil generation systems and methodologies</li>
                    <li>• Oracle AI technology and divination systems</li>
                    <li>• Platform design, UI/UX, and user experience flows</li>
                    <li>• Original spiritual content and educational materials</li>
                    <li>• Content and intellectual property protection documentation</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-chakra-root mb-3">Key Assignment Terms</h4>
                <div className="grid gap-4">
                  <div className="border-l-4 border-chakra-root pl-4">
                    <p className="text-white/90"><strong className="text-chakra-root">Comprehensive Transfer:</strong> Complete assignment of rights, title, and interest worldwide</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <p className="text-white/90"><strong className="text-primary">Moral Rights:</strong> Optional reservation or waiver of moral rights by assignor</p>
                  </div>
                  <div className="border-l-4 border-secondary pl-4">
                    <p className="text-white/90"><strong className="text-secondary">Future Works:</strong> Includes derivative works and future improvements</p>
                  </div>
                  <div className="border-l-4 border-chakra-heart pl-4">
                    <p className="text-white/90"><strong className="text-chakra-heart">Enforcement Rights:</strong> Full rights to pursue infringement actions and damages</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enforcement and Compliance */}
          <div className="bg-gradient-to-br from-cosmic/90 to-cosmic/70 border border-primary/40 glass-effect shadow-xl rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-display font-bold mb-6 text-primary flex items-center">
              <i className="fas fa-gavel mr-3"></i>
              Enforcement and Compliance
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-primary mb-3">Legal Compliance</h4>
                <ul className="space-y-2 text-white/90">
                  <li className="flex items-start"><i className="fas fa-balance-scale text-primary text-sm mt-1 mr-2"></i>Digital Millennium Copyright Act (DMCA)</li>
                  <li className="flex items-start"><i className="fas fa-trademark text-primary text-sm mt-1 mr-2"></i>Lanham Act trademark protection</li>
                  <li className="flex items-start"><i className="fas fa-lock text-primary text-sm mt-1 mr-2"></i>Trade secret protection measures</li>
                  <li className="flex items-start"><i className="fas fa-globe text-primary text-sm mt-1 mr-2"></i>International IP considerations</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-primary mb-3">Monitoring Systems</h4>
                <ul className="space-y-2 text-white/90">
                  <li className="flex items-start"><i className="fas fa-search text-primary text-sm mt-1 mr-2"></i>Automated copyright detection</li>
                  <li className="flex items-start"><i className="fas fa-shield text-primary text-sm mt-1 mr-2"></i>Brand mention monitoring</li>
                  <li className="flex items-start"><i className="fas fa-eye text-primary text-sm mt-1 mr-2"></i>Spiritual symbol similarity detection</li>
                  <li className="flex items-start"><i className="fas fa-bell text-primary text-sm mt-1 mr-2"></i>IP violation reporting system</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-chakra-crown/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8 mb-8">
            <h3 className="text-3xl font-display font-bold mb-6 text-chakra-crown">IP Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-cosmic/50 rounded-xl p-6 border border-primary/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <i className="fas fa-copyright text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-primary">DMCA Agent</h4>
                </div>
                <p className="text-white/90 mb-3">For copyright takedown notices and IP violations:</p>
                <a href="mailto:dmca@ascendedsocial.com" className="text-primary hover:text-primary/80 font-medium">
                  dmca@ascendedsocial.com
                </a>
              </div>
              
              <div className="bg-cosmic/50 rounded-xl p-6 border border-secondary/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                    <i className="fas fa-balance-scale text-white text-sm"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-secondary">Legal Inquiries</h4>
                </div>
                <p className="text-white/90 mb-3">For IP licensing and legal matters:</p>
                <a href="mailto:legal@ascended.social" className="text-secondary hover:text-secondary/80 font-medium">
                  legal@ascended.social
                </a>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <div className="bg-cosmic/50 rounded-xl p-4 border border-chakra-heart/20">
                <h4 className="text-lg font-semibold text-chakra-heart mb-2">Business Address</h4>
                <p className="text-white/90">
                  Third Eye Cyborg, LLC<br />
                  814 North Granite Drive<br />
                  Payson, AZ 85541<br />
                  United States
                </p>
              </div>
            </div>
          </div>

          {/* Legal Framework Footer */}
          <div className="bg-gradient-to-br from-cosmic/95 to-cosmic/85 border border-chakra-crown/40 glass-effect shadow-xl rounded-3xl overflow-hidden p-8">
            <h3 className="text-2xl font-display font-bold mb-4 text-chakra-crown">Legal Framework and Compliance</h3>
            <p className="text-white/90 leading-relaxed mb-4">
              This intellectual property framework complies with U.S. federal and state laws, including the Digital Millennium Copyright Act (DMCA), Lanham Act, Economic Espionage Act, and Uniform Trade Secrets Act. International compliance includes EU Copyright Directive, GDPR impact on IP, and Digital Services Act obligations. Special considerations for spiritual content include traditional knowledge protection, cultural sensitivity, and interfaith content respect.
            </p>
            <p className="text-white/80 text-center font-medium">
              By using Ascended Social, you acknowledge and accept this comprehensive intellectual property protection framework and agree to respect the rights of all content creators and Third Eye Cyborg, LLC's proprietary assets.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}