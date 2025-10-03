import { Link } from "wouter";

import ASLogo from "@assets/ASLogo.png";

export default function MarketingFooter() {
  return (
    <footer className="relative z-10 bg-cosmic/80 backdrop-blur-lg border-t border-primary/20 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={ASLogo} 
                  alt="Ascended Social Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Ascended Social
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A sacred digital space for spiritual growth, connection, and enlightenment.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/features">
                  <span 
                    className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer"
                    data-testid="link-features"
                  >
                    Features
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <span 
                    className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer"
                    data-testid="link-pricing"
                  >
                    Pricing
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/energy">
                  <span 
                    className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer"
                    data-testid="link-energy"
                  >
                    Energy System
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/community">
                  <span 
                    className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer"
                    data-testid="link-community"
                  >
                    Community
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <span 
                    className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer"
                    data-testid="link-about"
                  >
                    About Us
                  </span>
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:support@ascended.social"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                  data-testid="link-contact"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a 
                  href="#manage_cookies" 
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                  data-testid="link-cookie-preferences"
                >
                  Cookie Preferences
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://portal.termshub.io/ascended.social/cookie_policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                  data-testid="link-cookie-policy"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <Link href="/do-not-sell-form">
                  <span 
                    className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer"
                    data-testid="link-do-not-sell"
                  >
                    Do Not Sell My Info
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/dsar">
                  <span 
                    className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer"
                    data-testid="link-data-request"
                  >
                    Data Request (DSAR)
                  </span>
                </Link>
              </li>
              <li>
                <a 
                  href="https://portal.termshub.io/ascended.social/privacy_policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                  data-testid="link-privacy-policy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="https://portal.termshub.io/ascended.social/website_tos/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                  data-testid="link-terms-of-service"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="https://portal.termshub.io/ascended.social/refund_policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                  data-testid="link-refund-policy"
                >
                  Refund Policy
                </a>
              </li>
              <li>
                <Link href="/payment-terms">
                  <span 
                    className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer"
                    data-testid="link-payment-terms"
                  >
                    Payment Terms
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/copyright-assignment">
                  <span 
                    className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer"
                    data-testid="link-copyright-assignment"
                  >
                    Copyright & IP
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/community-protection">
                  <span 
                    className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer"
                    data-testid="link-community-protection"
                  >
                    Community Protection
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/copyright-policy">
                  <span 
                    className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer"
                    data-testid="link-copyright-policy"
                  >
                    Copyright Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/service-agreement">
                  <span 
                    className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer"
                    data-testid="link-service-agreement"
                  >
                    Service Agreement
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/third-party-disclaimer">
                  <span 
                    className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer"
                    data-testid="link-third-party-disclaimer"
                  >
                    Third-Party Disclaimer
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/eula">
                  <span 
                    className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer"
                    data-testid="link-eula"
                  >
                    EULA
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/subscription-services-agreement">
                  <span 
                    className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer"
                    data-testid="link-ssa"
                  >
                    Subscription Agreement
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/disclaimer">
                  <span 
                    className="text-gray-400 hover:text-primary transition-colors text-sm cursor-pointer"
                    data-testid="link-disclaimer"
                  >
                    Disclaimer
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="border-t border-primary/20 pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-white font-semibold mb-2">Connect With Us</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://thirdeyecyborg.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-cosmic-light rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                  data-testid="link-website"
                >
                  <i className="fas fa-globe"></i>
                </a>
                <a 
                  href="https://x.com/thirdeyecyborg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-cosmic-light rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                  data-testid="link-twitter"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a 
                  href="https://github.com/third-eye-cyborg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-cosmic-light rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                  data-testid="link-github"
                >
                  <i className="fab fa-github"></i>
                </a>
                <a 
                  href="https://www.linkedin.com/company/69946724/admin/dashboard/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-cosmic-light rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                  data-testid="link-linkedin"
                >
                  <i className="fab fa-linkedin"></i>
                </a>
                <a 
                  href="https://www.youtube.com/@thirdeyecyborg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-cosmic-light rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                  data-testid="link-youtube"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm mb-2">
                Join the spiritual revolution
              </p>
              <a 
                href="/api/login"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-2 rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 cursor-pointer"
                data-testid="button-join-community"
              >
                <i className="fas fa-star"></i>
                <span>Enter the Realm</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-4 md:mb-0">
              <span>© 2025 Third Eye Cyborg, LLC. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <i className="fas fa-heart text-primary mx-1"></i>
              <span>for the spiritual community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}