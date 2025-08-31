import { Link } from "wouter";
import { FileText, Users, Shield, Scale, AlertTriangle, Handshake, DollarSign, Clock } from "lucide-react";
import ASLogo from "@assets/ASLogo.png";

export default function ServiceAgreement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <div className="flex items-center space-x-2 text-white mb-8 hover:text-purple-300 transition-colors cursor-pointer" data-testid="link-home">
            <div className="w-6 h-6 rounded overflow-hidden">
              <img 
                src={ASLogo} 
                alt="Ascended Social Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-semibold">Ascended Social</span>
          </div>
        </Link>

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FileText className="h-16 w-16 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4" data-testid="text-page-title">
            Service Agreement
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Comprehensive service terms governing the provision of Ascended Social spiritual community platform
          </p>
        </div>

        {/* Agreement Overview */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-4">
            <Handshake className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Service Agreement Overview</h2>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
            <p className="text-purple-200 mb-4">
              This Service Agreement is entered into between:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">The Company</h3>
                <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-400/20">
                  <p className="text-purple-200"><strong>Third Eye Cyborg, LLC</strong></p>
                  <p className="text-purple-200">Principal place of business:</p>
                  <p className="text-purple-200"><strong>814 North Granite Drive, Payson, AZ 85541</strong></p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">The Customer</h3>
                <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-400/20">
                  <p className="text-purple-200">Any individual or entity subscribing to</p>
                  <p className="text-purple-200"><strong>Ascended Social</strong> services</p>
                  <p className="text-purple-200">Spiritual community and wellness platform</p>
                </div>
              </div>
            </div>
            <p className="text-purple-200 mt-4">
              The Company will use commercially reasonable efforts to provide the Customer with the Services described herein, 
              and the Customer shall pay the Company the Fees in accordance with the agreed schedule.
            </p>
          </div>
        </div>

        {/* Key Definitions */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Key Definitions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Services</h3>
              <p className="text-purple-200 mb-3">
                The services and deliverables including but not limited to:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• Provision, maintenance, and support of Ascended Social platform</li>
                <li>• AI-powered spiritual features and Oracle readings</li>
                <li>• Community interaction tools and spiritual guidance</li>
                <li>• Technical and business protection services</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Service Term</h3>
              <p className="text-purple-200 mb-3">
                Agreement duration and renewal terms:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• Automatically renewed for additional periods</li>
                <li>• 30-day notice required for termination</li>
                <li>• Subject to completion of deliverables when applicable</li>
                <li>• Extensions granted for good reason delays</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Fees</h3>
              <p className="text-purple-200">
                The fees calculated as per the fee schedule for spiritual community platform services, 
                AI-powered features, premium subscriptions, and related technical services.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Deliverables</h3>
              <p className="text-purple-200">
                Platform access, AI-powered spiritual tools, community features, user account management, 
                payment integration, and comprehensive documentation.
              </p>
            </div>
          </div>
        </div>

        {/* Company Obligations */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <Shield className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Company Obligations</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">2.1 Service Performance</h3>
              <p className="text-purple-200">
                The Company shall with reasonable care, skill and diligence and in a good and professional manner 
                carry out the Services under this Agreement, including ensuring business protection, liability limitations, 
                indemnification, and force majeure protections for the Ascended Social platform.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">2.2 Competent Personnel</h3>
              <p className="text-purple-200">
                The Company shall at all reasonable times appoint a competent person in charge and any instructions 
                given to them by the Customer shall be deemed to have been issued to the Company.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">2.3 Legal Compliance</h3>
              <p className="text-purple-200">
                The Company shall comply with all applicable statutes, regulations, and requirements relating to 
                data protection, consumer protection, and online platform operations in the United States and other applicable jurisdictions.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">2.4 Account Management</h3>
              <p className="text-purple-200">
                As part of the registration process, the Customer will identify an administrative user name and password. 
                The Company reserves the right to refuse registration of, or cancel passwords it deems inappropriate.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">2.5 Service Modifications</h3>
              <p className="text-purple-200 mb-3">
                The Company may change operational aspects of the Services or substitute them with other services, ensuring:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• Customer's business is not materially disrupted</li>
                <li>• No increase to Service Charges without advance agreement</li>
                <li>• Reasonable notice of significant changes</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">2.6 Security Suspension</h3>
              <p className="text-purple-200">
                The Company may suspend Customer access if system integrity, security, or performance is threatened 
                by Customer activities, including misuse of AI features, violation of community guidelines, or interference 
                with proprietary algorithms.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Obligations */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <Users className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Customer Obligations</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">3.1 Prohibited Activities</h3>
              <p className="text-purple-200 mb-3">Customer will not, directly or indirectly:</p>
              <ul className="text-purple-200 space-y-2">
                <li>• Reverse engineer, decompile, or discover source code of Services or Software</li>
                <li>• Modify, translate, or create derivative works based on the Services</li>
                <li>• Use Services for timesharing or third-party benefit</li>
                <li>• Remove proprietary notices or labels</li>
                <li>• Develop competing spiritual or wellness platforms</li>
                <li>• Misuse AI-generated content or community features</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">3.2 Compliance and Indemnification</h3>
              <p className="text-purple-200 mb-3">
                Customer represents and warrants use of Services only in compliance with Company policies and applicable laws. 
                Customer agrees to indemnify Company against damages from:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• Misuse of AI-generated spiritual guidance</li>
                <li>• Intellectual property rights infringement</li>
                <li>• Privacy or data protection law violations</li>
                <li>• Harm caused through community interactions</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">3.3 Equipment and Security</h3>
              <p className="text-purple-200">
                Customer is responsible for obtaining and maintaining equipment needed to access Services, 
                including maintaining security of equipment, accounts, passwords, and files. This includes devices 
                used to access Ascended Social platform and ensuring confidentiality of login credentials and spiritual content.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">3.4 Customer Group Responsibilities</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-purple-200 space-y-2">
                  <li>• Provide access to facilities as reasonably required</li>
                  <li>• Promptly provide information and assistance needed</li>
                  <li>• Ensure personnel availability for consultation</li>
                  <li>• Not cause Company to breach supplier obligations</li>
                </ul>
                <ul className="text-purple-200 space-y-2">
                  <li>• Ensure safety of Company employees and contractors</li>
                  <li>• Use Services solely for Ascended Social participation</li>
                  <li>• Comply with security arrangements and protocols</li>
                  <li>• Indemnify against unauthorized access or misuse</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Liability Framework */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <Scale className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Company Liability Framework</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">5.1 Service Standards</h3>
              <p className="text-purple-200">
                <strong>Third Eye Cyborg, LLC</strong> shall use reasonable efforts consistent with industry standards 
                to maintain Services in a manner minimizing errors and interruptions. Services may be temporarily unavailable 
                for maintenance or emergency situations beyond Company control.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">5.2 Service Disclaimer</h3>
              <p className="text-purple-200">
                Services are provided "as is" and Company disclaims all warranties, including merchantability and fitness 
                for particular purpose. Company specifically disclaims warranty regarding accuracy, completeness, or reliability 
                of spiritual content, AI-generated guidance, or user-generated content.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">5.3 Breach Remedies</h3>
              <p className="text-purple-200">
                If Company breaches service obligations, Customer's sole remedy is to require prompt repeat or remedial services. 
                For force majeure events or third-party failures, Company will use best efforts to restore services within 72 hours.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">5.4 Liability Limitation</h3>
              <p className="text-purple-200 mb-3">
                Total Company liability shall not exceed total Fees paid by Customer in the twelve (12) months preceding the claim. 
                Company shall not be liable for:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• Indirect, incidental, consequential, punitive, or special damages</li>
                <li>• Lost profits or emotional distress</li>
                <li>• Damages from user reliance on spiritual or AI content</li>
                <li>• Service outages or data loss beyond Company control</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Intellectual Property Rights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">8.1 Company IP Ownership</h3>
              <p className="text-purple-200 mb-3">
                Third Eye Cyborg, LLC owns and retains all rights to:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• Services and Software, including improvements</li>
                <li>• Software and applications developed for Services</li>
                <li>• All related intellectual property rights</li>
                <li>• AI algorithms and spiritual guidance systems</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">8.2 Customer License</h3>
              <p className="text-purple-200">
                Company grants Customer a worldwide, non-exclusive, royalty-free license to use Company IP 
                for the Service Term duration, solely to enable reasonable use of Services. Customer may not sub-license 
                or transfer any Company intellectual property rights.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">8.3 Customer Data Rights</h3>
              <p className="text-purple-200">
                Customer owns all rights, title, and interest in Customer Data. Company may collect and analyze 
                data relating to platform performance and usage to improve Services and develop other offerings.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">8.4 Usage Restrictions</h3>
              <p className="text-purple-200">
                Customer shall use Proprietary Software solely for Ascended Social business purposes and shall not 
                copy, adapt, decompile, or reverse engineer any part of the Software, nor make it available to third parties.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <DollarSign className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Payment Terms</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">7.1 Invoicing</h3>
              <p className="text-purple-200 mb-3">
                Customer will be invoiced for Services and expenses according to the fee schedule. 
                Payment terms are due within 30 days upon receipt of proper invoice.
              </p>
              <p className="text-purple-200">
                Payments not received within 30 days will be subject to a 5% penalty per calendar month.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">7.2 Additional Usage</h3>
              <p className="text-purple-200">
                If Customer usage exceeds service capacity or requires additional fees, Customer will be billed accordingly. 
                Company may change Fees upon 30 days notice. Billing disputes must be reported within 60 days.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">7.3 Expense Reimbursement</h3>
              <p className="text-purple-200">
                Customer will be invoiced for out-of-pocket expenses including meals, lodging, transportation, 
                and business expenses according to Third Eye Cyborg, LLC's published policies.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">7.4 Cost Increases</h3>
              <p className="text-purple-200">
                If third-party costs associated with Service provision increase, Company may increase Service Charges 
                upon prior written notice to Customer to reflect that increase.
              </p>
            </div>
          </div>
        </div>

        {/* Termination */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <AlertTriangle className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Termination Provisions</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">10.1 Immediate Termination Events</h3>
              <p className="text-purple-200 mb-3">Either party may terminate immediately for:</p>
              <ul className="text-purple-200 space-y-1">
                <li>• Failure to pay within 30 days of amount due</li>
                <li>• Insolvency or bankruptcy proceedings</li>
                <li>• Material breach not remedied within 30 days of notice</li>
                <li>• Cessation of material business operations</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">10.2 Termination Consequences</h3>
              <p className="text-purple-200 mb-3">Upon termination:</p>
              <ul className="text-purple-200 space-y-1">
                <li>• Customer licenses immediately cease</li>
                <li>• All confidential information must be returned or destroyed</li>
                <li>• Customer must pay all accrued amounts</li>
                <li>• Company may immediately disconnect access to Services</li>
                <li>• Survival of liability, IP, confidentiality, and termination clauses</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Service Level Agreement */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <Clock className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Service Level Terms</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Availability Commitment</h3>
              <p className="text-purple-200 mb-3">
                Services shall be available 99.9% measured monthly, excluding:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• Holidays, weekends, and scheduled maintenance</li>
                <li>• Third-party connection outages</li>
                <li>• Force majeure events and cyber attacks</li>
                <li>• Government-ordered shutdowns</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Downtime Credits</h3>
              <p className="text-purple-200 mb-3">
                For downtime lasting longer than one hour:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• 5% Service fee credit per 30-minute period</li>
                <li>• Maximum one credit per day</li>
                <li>• Customer must notify within 24 hours</li>
                <li>• Credits not redeemable for cash</li>
                <li>• Maximum one week of fees per month</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Technical Support</h3>
              <p className="text-purple-200 mb-3">
                Support provided via telephone and email:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• Weekdays 9:00 AM - 5:00 PM (excluding Federal Holidays)</li>
                <li>• Email support available 24/7 at support@ascendedsocial.com</li>
                <li>• Response within one business day</li>
                <li>• Helpdesk tickets for issue tracking</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Platform Services</h3>
              <p className="text-purple-200 mb-3">
                Ascended Social platform includes:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• AI-powered spiritual community features</li>
                <li>• Oracle readings and sigil generation</li>
                <li>• Spiritual guidance and community interaction</li>
                <li>• Secure payment integration for premium features</li>
                <li>• User account management and documentation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Governing Law */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Governing Law and Jurisdiction</h2>
          <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
            <p className="text-purple-200 mb-4">
              This Agreement is governed by and construed in accordance with the <strong>laws of the United States</strong>. 
              Each party irrevocably and unconditionally submits to the exclusive jurisdiction of the United States courts 
              and waives any right to object to actions being brought in those courts.
            </p>
            <p className="text-purple-200">
              The parties shall use all reasonable endeavors to resolve any dispute amicably and in good faith before 
              pursuing legal action.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Company Contact</h3>
              <div className="space-y-1 text-purple-200">
                <p><strong>Third Eye Cyborg, LLC</strong></p>
                <p>Address: 814 North Granite Drive, Payson, AZ 85541</p>
                <p>Email: legal@ascended.social</p>
                <p>Support: support@ascendedsocial.com</p>
              </div>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Service Notices</h3>
              <p className="text-purple-200 mb-3">
                Notices are deemed delivered:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• By hand: when delivered</li>
                <li>• By email: time of receipt (business day before 5 PM)</li>
                <li>• By post: 10 AM second business day after posting</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-8 border border-purple-500/30">
          <p className="text-lg text-purple-200 mb-4">
            This Service Agreement ensures comprehensive protection and clear obligations for both Third Eye Cyborg, LLC 
            and Customers of the Ascended Social spiritual community platform, supporting authentic spiritual growth 
            and connection through professional service delivery.
          </p>
          <p className="text-sm text-purple-300">
            © 2025 Third Eye Cyborg, LLC | Effective Date: August 31, 2025
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
              <span className="text-purple-300 hover:text-white transition-colors cursor-pointer" data-testid="link-copyright-assignment">
                Copyright & IP
              </span>
            </Link>
            <Link href="/copyright-policy">
              <span className="text-purple-300 hover:text-white transition-colors cursor-pointer" data-testid="link-copyright-policy">
                Copyright Policy
              </span>
            </Link>
            <Link href="/community-protection">
              <span className="text-purple-300 hover:text-white transition-colors cursor-pointer" data-testid="link-community-protection">
                Community Protection
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