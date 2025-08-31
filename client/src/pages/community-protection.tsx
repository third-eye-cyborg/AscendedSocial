import { Link } from "wouter";
import { Shield, Heart, Users, Scale, Eye, Star } from "lucide-react";

export default function CommunityProtection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <div className="flex items-center space-x-2 text-white mb-8 hover:text-purple-300 transition-colors cursor-pointer" data-testid="link-home">
            <Star className="h-6 w-6" />
            <span className="text-xl font-semibold">Ascended Social</span>
          </div>
        </Link>

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4" data-testid="text-page-title">
            Community Protection Framework
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Comprehensive guidelines ensuring a safe, respectful, and spiritually nurturing environment for our sacred community
          </p>
        </div>

        {/* Executive Summary */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-4">
            <Eye className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Executive Summary</h2>
          </div>
          <p className="text-purple-100 mb-4">
            This Community Protection Framework governs the standards that apply to any content that you upload to our website, 
            any interactions with our website, and your participation in the Ascended Social spiritual community.
          </p>
          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-400/20">
            <h3 className="text-lg font-semibold text-white mb-2">Who we are and how to contact us</h3>
            <p className="text-purple-200 mb-2">
              Ascended Social (https://ascendedsocial.com) is a site operated under the control of <strong>Third Eye Cyborg, LLC</strong>. 
              Our company is formally registered under the laws of the United States. Our business address is: 
              <strong> 814 North Granite Drive, Payson, AZ 85541</strong>.
            </p>
            <p className="text-purple-200">
              We are a Limited Liability Company (LLC). If you have any enquiries regarding this community protection policy, 
              please contact our customer service at <strong>support@ascendedsocial.com</strong>.
            </p>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <Heart className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Community Guidelines</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">1. Spiritual Discourse Standards</h3>
              <ul className="text-purple-200 space-y-2">
                <li>• Respectful discussion of diverse spiritual paths and beliefs</li>
                <li>• No discrimination based on spiritual practices, religion, or metaphysical beliefs</li>
                <li>• Encouragement of personal spiritual growth and authentic sharing</li>
                <li>• Prohibition of spiritual gatekeeping or claiming exclusive truth</li>
                <li>• Respect for traditional spiritual practices and cultural heritage</li>
                <li>• Guidelines for sharing channeled or intuitive spiritual content</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">2. Content Quality Expectations</h3>
              <ul className="text-purple-200 space-y-2">
                <li>• Authentic personal spiritual experiences and insights</li>
                <li>• Constructive and supportive community engagement</li>
                <li>• Educational content that promotes spiritual growth</li>
                <li>• Respectful disagreement and diverse perspective sharing</li>
                <li>• Prohibition of fear-based or manipulative spiritual content</li>
                <li>• Guidelines for sharing spiritual advice and guidance responsibly</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">3. Prohibited Content and Behavior</h3>
              <ul className="text-purple-200 space-y-2">
                <li>• Harassment, bullying, or spiritual shaming of community members</li>
                <li>• Hate speech, discrimination, or exclusionary spiritual practices</li>
                <li>• Sexual content, explicit material, or inappropriate personal sharing</li>
                <li>• Spam, commercial promotion without permission, or MLM schemes</li>
                <li>• Misinformation about health, safety, or medical conditions</li>
                <li>• Copyright infringement or unauthorized sharing of spiritual content</li>
                <li>• Doxxing, privacy violations, or sharing personal information without consent</li>
                <li>• Impersonation of spiritual teachers, gurus, or other community members</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">4. Cultural Sensitivity</h3>
              <ul className="text-purple-200 space-y-2">
                <li>• Respect for indigenous spiritual practices and cultural appropriation prevention</li>
                <li>• Guidelines for sharing traditional spiritual teachings and attribution requirements</li>
                <li>• Sensitivity training for moderation team on diverse spiritual traditions</li>
                <li>• Community education about respectful cross-cultural spiritual exchange</li>
                <li>• Expert advisors from various spiritual traditions for complex cultural issues</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
            <h3 className="text-lg font-semibold text-white mb-3">5. Mental Health and Wellness Boundaries</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="text-purple-200 space-y-2">
                <li>• Clear boundaries between spiritual guidance and mental health advice</li>
                <li>• Resources for users experiencing spiritual crises or psychological distress</li>
                <li>• Prohibition of diagnosing mental health conditions through spiritual assessment</li>
              </ul>
              <ul className="text-purple-200 space-y-2">
                <li>• Partnerships with licensed mental health professionals for crisis intervention</li>
                <li>• Guidelines for spiritual practitioners sharing wellness advice responsibly</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content Moderation Framework */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <Users className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Content Moderation Framework</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">6. Reporting Mechanisms</h3>
              <ul className="text-purple-200 space-y-2">
                <li>• User-friendly reporting system for inappropriate content and behavior</li>
                <li>• Community flagging options for various violation types</li>
                <li>• Anonymous reporting capabilities to protect whistleblowers</li>
                <li>• Direct contact methods for urgent safety concerns</li>
                <li>• Clear categorization of violation types for efficient processing</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">7. Moderation Team Structure</h3>
              <ul className="text-purple-200 space-y-2">
                <li>• Community volunteer moderator program with clear guidelines</li>
                <li>• Professional moderation team review for serious violations</li>
                <li>• Regular moderation training focused on spiritual community dynamics</li>
                <li>• Expert consultation for complex spiritual or cultural sensitivity issues</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">8. Review Processes</h3>
              <ul className="text-purple-200 space-y-2">
                <li>• Automated detection systems for clearly prohibited content</li>
                <li>• Human review requirement for nuanced spiritual content disputes</li>
                <li>• Community input consideration for borderline cases</li>
                <li>• Regular policy review based on community feedback and emerging needs</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">9. Community Involvement</h3>
              <ul className="text-purple-200 space-y-2">
                <li>• Community involvement in moderation decisions for borderline cases</li>
                <li>• Regular transparency reports on moderation activities and policy enforcement</li>
                <li>• Community feedback mechanisms for policy suggestions and improvements</li>
                <li>• Public moderation guidelines accessible to all users</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Enforcement Procedures */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <Scale className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Enforcement Procedures</h2>
          </div>

          <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">10. Graduated Warning and Suspension System</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-purple-800/30 rounded-lg">
                <div className="text-2xl text-purple-300 mb-2">1st</div>
                <div className="text-sm text-purple-200">Educational warning with explanation of community standards</div>
              </div>
              <div className="text-center p-4 bg-purple-800/30 rounded-lg">
                <div className="text-2xl text-purple-300 mb-2">2nd</div>
                <div className="text-sm text-purple-200">Temporary content restriction with required guidelines review</div>
              </div>
              <div className="text-center p-4 bg-purple-800/30 rounded-lg">
                <div className="text-2xl text-purple-300 mb-2">3rd</div>
                <div className="text-sm text-purple-200">Account suspension with required appeal process</div>
              </div>
              <div className="text-center p-4 bg-purple-800/30 rounded-lg">
                <div className="text-2xl text-purple-300 mb-2">Serious</div>
                <div className="text-sm text-purple-200">Immediate escalation to account review committee</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">11. Account Suspension & Termination</h3>
              <ul className="text-purple-200 space-y-2">
                <li>• Clear notification to user with specific violation explanation</li>
                <li>• Defined suspension periods based on violation severity (24 hours to 30 days)</li>
                <li>• Required community standards acknowledgment for account reinstatement</li>
                <li>• Loss of certain privileges during suspension period (posting, commenting)</li>
                <li>• Continued access to personal content and private messages during suspension</li>
                <li>• Repeated violations or serious safety threats may result in permanent account termination</li>
                <li>• Final warning notification with 48-hour response window</li>
                <li>• Account review by moderation committee including community representatives</li>
                <li>• Data preservation period allowing content export before deletion</li>
                <li>• IP address and device blocking for serious violations</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">12. Appeals and Due Process Rights</h3>
              <ul className="text-purple-200 space-y-2">
                <li>• Independent appeals review board including community representatives</li>
                <li>• Clear timelines for appeal processing and resolution</li>
                <li>• User right to legal representation during serious violation proceedings</li>
                <li>• Documentation requirements for all moderation decisions and appeals</li>
                <li>• Regular review of terminated accounts for potential policy evolution</li>
              </ul>
            </div>
          </div>
        </div>

        {/* User Rights and Platform Evolution */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-6">User Rights and Protections</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">13. Data Protection and Privacy Safeguards</h3>
              <ul className="text-purple-200 space-y-2">
                <li>• Clear data retention policies for terminated accounts</li>
                <li>• User rights regarding content removal and account deletion</li>
                <li>• Protection of private spiritual sharing and personal information</li>
                <li>• Secure handling of sensitive spiritual content and personal experiences</li>
                <li>• Compliance with privacy laws while maintaining community safety</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">14. Community Participation and Support</h3>
              <ul className="text-purple-200 space-y-2">
                <li>• Community participation rights and feedback mechanisms</li>
                <li>• Protection from harassment and discrimination</li>
                <li>• Access to support resources for vulnerable users</li>
              </ul>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-6">Platform Evolution</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">15. Policy Update Procedures</h3>
              <ul className="text-purple-200 space-y-2">
                <li>• Regular community input on policy effectiveness and needed changes</li>
                <li>• Transparent communication about policy updates and implementation timelines</li>
                <li>• Grandfathering provisions for existing content under previous policies</li>
                <li>• Community vote consideration for major policy changes</li>
                <li>• Expert consultation with spiritual community leaders and legal advisors</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">16. Adaptation to Emerging Practices</h3>
              <ul className="text-purple-200 space-y-2">
                <li>• Proactive approach to new forms of digital spiritual harassment</li>
                <li>• Adaptation to evolving spiritual practices and online community dynamics</li>
                <li>• Integration of AI-powered moderation tools with human spiritual understanding</li>
                <li>• International compliance as community grows globally</li>
                <li>• Technology adaptation while maintaining spiritual community authenticity</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive Services */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Interactive Services</h2>
          <p className="text-purple-200 mb-4">
            We provide interactive services on Ascended Social, including but not limited to:
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-400/20">
              <ul className="text-purple-200 space-y-1">
                <li>• Chat rooms</li>
                <li>• Bulletin boards</li>
                <li>• Forums</li>
              </ul>
            </div>
            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-400/20">
              <ul className="text-purple-200 space-y-1">
                <li>• Community discussions</li>
                <li>• Oracle readings</li>
                <li>• Energy assessments</li>
              </ul>
            </div>
            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-400/20">
              <ul className="text-purple-200 space-y-1">
                <li>• Spiritual guidance sharing</li>
                <li>• Meditation groups</li>
                <li>• Sacred spaces</li>
              </ul>
            </div>
          </div>
          <p className="text-purple-200">
            All interactive services are subject to moderation by our staff members, community volunteer moderators, 
            or automated detection systems. We are committed to minimizing risks to users from third parties when using 
            interactive services. We will determine and implement appropriate moderation solutions in light of identified 
            risks, including a graduated enforcement approach prioritizing education and community safety.
          </p>
          <div className="mt-4 p-4 bg-purple-900/30 rounded-lg border border-purple-400/20">
            <p className="text-purple-200">
              <strong>Age Restriction:</strong> Ascended Social is intended for adults aged 18 and older. 
              Persons under the age of 18 may not use our interactive services. We reserve the right to take 
              appropriate action if we discover that a minor is using the Site without proper authorization.
            </p>
          </div>
        </div>

        {/* Content Standards */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Content Standards</h2>
          <p className="text-purple-200 mb-6">
            These content standards apply to any material you upload, post, or contribute to Ascended Social ("Contribution") 
            and to any interactive services associated with it. All Contributions must comply with every aspect of this Policy.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">A Contribution Must:</h3>
              <ul className="text-purple-200 space-y-2">
                <li>• Where it states facts, ensure that such information is accurate</li>
                <li>• Where it states opinions, ensure that such opinions are genuinely held</li>
                <li>• Comply with all applicable rules and laws in the jurisdiction from which it originates</li>
                <li>• Respect the diversity of spiritual paths and beliefs</li>
                <li>• Not discriminate based on spiritual practices, religion, or metaphysical beliefs</li>
                <li>• Encourage authentic, constructive, and supportive engagement</li>
                <li>• Adhere to guidelines for sharing spiritual advice, channeled content, and personal experiences responsibly</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">A Contribution Must Not Contain:</h3>
              <ul className="text-purple-200 space-y-2">
                <li>• Defamatory, offensive, hateful, inflammatory, or obscene content</li>
                <li>• Threatening, abusive, or harassing material</li>
                <li>• Sexually suggestive or explicit material</li>
                <li>• Content promoting violence or discrimination</li>
                <li>• Copyright infringement or trademark violations</li>
                <li>• Misrepresentations likely to deceive any person</li>
                <li>• Impersonation or identity misrepresentation</li>
                <li>• Spiritual gatekeeping or claims of exclusive spiritual truth</li>
                <li>• Disrespect for traditional spiritual practices or cultural appropriation</li>
                <li>• Irresponsible spiritual advice, including diagnosing mental health conditions</li>
                <li>• Spam, unauthorized commercial promotion, or MLM schemes</li>
                <li>• Health, safety, or medical misinformation</li>
                <li>• Doxxing or privacy violations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Compliance */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Legal Compliance</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">17. Compliance Framework</h3>
              <ul className="text-purple-200 space-y-2">
                <li>• Section 230 safe harbor compliance for user-generated content</li>
                <li>• GDPR compliance for European Union users</li>
                <li>• COPPA compliance for age verification and parental consent</li>
                <li>• Accessibility compliance ensuring inclusive spiritual community participation</li>
                <li>• Regular legal review of policies for compliance with evolving digital platform regulations</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Enforcement Actions</h3>
              <p className="text-purple-200 mb-3">
                Failure to comply with any of our policies may result in:
              </p>
              <ul className="text-purple-200 space-y-2">
                <li>• Educational warnings with community standards explanation</li>
                <li>• Temporary or permanent withdrawal of website access</li>
                <li>• Immediate removal of violating content</li>
                <li>• Legal proceedings for serious violations</li>
                <li>• Disclosure to law enforcement as required</li>
                <li>• Implementation of graduated enforcement procedures</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact and Reporting */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Contact and Reporting</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Policy Questions</h3>
              <p className="text-purple-200 mb-2">
                If you have any questions regarding this Policy:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• Email: <strong>support@ascendedsocial.com</strong></li>
                <li>• Use the reporting mechanisms provided on Ascended Social</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Violation Reporting</h3>
              <p className="text-purple-200 mb-2">
                To report violations of this Framework:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• Use in-platform reporting tools</li>
                <li>• Contact moderation team directly</li>
                <li>• Anonymous reporting available for sensitive issues</li>
                <li>• Emergency contact for urgent safety concerns</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Jurisdiction */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Dispute Resolution and Jurisdiction</h2>
          <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
            <p className="text-purple-200 mb-4">
              All terms of this policy, including its subject matter and formation, are governed by the laws of the 
              <strong> United States of America</strong>. By using the Ascended Social platform and any of its services, 
              you agree that the courts of the United States shall have exclusive jurisdiction over any disputes relating 
              to this acceptable use policy, subject to any mandatory provisions of law that may apply in your place of residence.
            </p>
            <p className="text-purple-200">
              For business entities, both parties agree that the courts of the United States shall have exclusive jurisdiction 
              for any disputes arising between Third Eye Cyborg, LLC (registered address: 814 North Granite Drive, Payson, AZ 85541) 
              and the business entity in connection with the use of the Ascended Social platform.
            </p>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-8 border border-purple-500/30">
          <p className="text-lg text-purple-200 mb-4">
            This Community Protection Framework ensures balanced community protection while maintaining Ascended Social's 
            welcoming spiritual environment and supporting authentic spiritual growth and connection.
          </p>
          <p className="text-sm text-purple-300">
            Last updated: August 31, 2025 | Effective immediately
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/terms-of-service">
              <span className="text-purple-300 hover:text-white transition-colors cursor-pointer" data-testid="link-terms">
                Terms of Service
              </span>
            </Link>
            <Link href="/privacy-policy">
              <span className="text-purple-300 hover:text-white transition-colors cursor-pointer" data-testid="link-privacy">
                Privacy Policy
              </span>
            </Link>
            <Link href="/copyright-assignment">
              <span className="text-purple-300 hover:text-white transition-colors cursor-pointer" data-testid="link-copyright">
                Copyright & IP
              </span>
            </Link>
            <Link href="/payment-terms">
              <span className="text-purple-300 hover:text-white transition-colors cursor-pointer" data-testid="link-payment-terms">
                Payment Terms
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}