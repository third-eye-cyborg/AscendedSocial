import { Link } from "wouter";
import { Shield, AlertCircle, Users, Scale, FileCheck, Cloud, Zap, Database } from "lucide-react";
import ASLogo from "@assets/ASLogo.png";

export default function ThirdPartyDisclaimer() {
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
            <Shield className="h-16 w-16 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4" data-testid="text-page-title">
            Third-Party Service Disclaimers
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Comprehensive disclaimers governing third-party service integrations and dependencies for Ascended Social
          </p>
        </div>

        {/* Application and Interpretation */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <FileCheck className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Application and Interpretation</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">1.1 Scope of Application</h3>
              <p className="text-purple-200">
                These Third-Party Service Disclaimers are applicable to all Engagements between <strong>Third Eye Cyborg, LLC</strong>, 
                a limited liability company operating under the business name Ascended Social, with its principal place of business at 
                <strong> 814 North Granite Drive, Payson, AZ 85541</strong>, and you, the client.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">1.2 Professional Standards</h3>
              <p className="text-purple-200">
                We shall perform the Engagement with due observance of the applicable professional rules and regulations 
                and all relevant national and international legislation and regulations, including those governing digital services, 
                data privacy, and third-party service integrations.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">1.3 Key Definitions</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-purple-200 mb-2">
                    <strong>"Cloud services"</strong> means services via the internet whereby the firm uses software, 
                    hardware, and storage space of third parties, including but not limited to:
                  </p>
                  <ul className="text-purple-200 space-y-1 ml-4">
                    <li>• OpenAI (AI-powered spiritual guidance)</li>
                    <li>• Stripe (payment processing)</li>
                    <li>• PostHog (analytics)</li>
                    <li>• OneSignal (notifications)</li>
                    <li>• Cloudflare (security and delivery)</li>
                    <li>• Notion (documentation)</li>
                  </ul>
                </div>
                <div>
                  <p className="text-purple-200 mb-2">
                    <strong>"Engagement"</strong> means the oral or written agreement in which we undertake to provide 
                    services to you, including access to the Ascended Social platform and its features.
                  </p>
                  <p className="text-purple-200 mt-4">
                    <strong>"We/Us/Firm"</strong> means Third Eye Cyborg, LLC, the legal entity to whom the Engagement is issued.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Obligations */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <Users className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Your Obligations</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">3.1 Information and Documentation</h3>
              <p className="text-purple-200">
                If an Engagement requires your cooperation, you shall provide us with all information and documents 
                that we require for proper and timely execution, including accurate registration information, payment details 
                for subscription services, and consent for third-party service integrations. You are responsible for maintaining 
                the accuracy of such information throughout the duration of the Engagement.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">3.2 Legal Structure Disclosure</h3>
              <p className="text-purple-200">
                You shall inform us without delay of the legal and control structure of the group to which you belong, 
                and of any changes therein, as well as of all other financial and other alliances in which you participate 
                or to which you belong, all in the broadest sense of the word.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">3.3 Decision Responsibility</h3>
              <p className="text-purple-200 mb-3">
                You alone bear responsibility for determining the scope of the Engagement and for taking decisions based on our services. 
                This includes responsibility for selecting, integrating, and relying upon third-party services such as:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <ul className="text-purple-200 space-y-1">
                  <li>• OpenAI</li>
                  <li>• Stripe</li>
                  <li>• PostHog</li>
                </ul>
                <ul className="text-purple-200 space-y-1">
                  <li>• OneSignal</li>
                  <li>• Cloudflare</li>
                  <li>• Notion</li>
                </ul>
                <ul className="text-purple-200 space-y-1">
                  <li>• Other external providers</li>
                  <li>• Spiritual guidance tools</li>
                  <li>• AI-generated content</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">3.4 Information Accuracy</h3>
              <p className="text-purple-200">
                We shall perform the Engagement based on financial and other information provided to us. You undertake to ensure 
                that information you provide is correct and complete. You agree that if we receive information from third parties, 
                including data from integrated services, we may rely on such information without independent verification.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">3.5 Additional Costs and Delays</h3>
              <p className="text-purple-200">
                Any additional costs and damage resulting from failure to make requested information, facilities, and/or staff available 
                shall be for your account and risk. This includes delays or issues arising from third-party service outages, 
                data inaccuracy, or integration failures.
              </p>
            </div>
          </div>
        </div>

        {/* Execution of Services */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <Zap className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Execution of the Engagement</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">4.1 Best Efforts Obligation</h3>
              <p className="text-purple-200">
                We shall provide all services to the best of our knowledge and ability, and in accordance with professional standards. 
                Where services are delivered through or rely upon third-party providers (including AI-powered content, payment processing, 
                analytics, notifications, infrastructure, or documentation management), our obligations are subject to the operational 
                availability and performance of such third-party services.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">4.2 Service Execution Method</h3>
              <p className="text-purple-200">
                We shall determine how the Engagement will be executed and by whom, except where explicitly intended to be performed 
                by a specific person. Where the Engagement involves third-party integrations, we reserve the right to select, modify, 
                or replace such third-party providers as necessary, with reasonable notice to you.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">4.3 Additional Services</h3>
              <p className="text-purple-200">
                We may provide and charge for additional services if needed for compliance with applicable legislation and regulations, 
                including services required to ensure compliance with data protection laws, third-party service agreements, 
                or regulatory requirements applicable to integrated external services.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">4.4 Information Management</h3>
              <p className="text-purple-200">
                Information provided to us by you shall be returned upon request after completion of the Engagement. 
                We shall keep our own electronic working files containing copies of relevant documents, which shall remain our property. 
                Our administration serves as full evidence for you, except where you provide evidence to the contrary.
              </p>
            </div>
          </div>
        </div>

        {/* Confidentiality and Data Protection */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <Database className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Confidentiality and Data Protection</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">5.1 Confidentiality Standards</h3>
              <p className="text-purple-200">
                Unless required by law or professional regulations, we and persons assigned by us shall neither disclose 
                confidential information and personal data nor provide such information to third parties. We act in accordance 
                with local data protection laws and the General Data Protection Regulation (GDPR) where applicable.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">5.2 Third-Party Service Providers</h3>
              <p className="text-purple-200 mb-3">
                You acknowledge that we may utilize third-party service providers, including providers of AI-powered tools, 
                payment processors, analytics platforms, communication services, infrastructure, and content management systems. 
                These services may process, store, or transmit your data according to their respective terms and privacy policies.
              </p>
              <p className="text-purple-200">
                We disclaim liability for any acts or omissions of such third-party service providers, including service outages, 
                data breaches, or changes in service functionality, except to the extent required by law.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">5.3 Information Sharing Authorization</h3>
              <p className="text-purple-200 mb-3">
                You agree that we may process confidential information and personal data within the scope of the Engagement, 
                compliance with statutory obligations, risk management, and internal business purposes, including sharing with:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-purple-200 space-y-1">
                  <li>• The firm's teams involved in the Engagement</li>
                  <li>• Parties involved in execution of the Engagement</li>
                  <li>• Subcontractors and IT service providers</li>
                </ul>
                <ul className="text-purple-200 space-y-1">
                  <li>• Third-party experts supplementing our services</li>
                  <li>• Our insurers, legal, or financial advisers</li>
                  <li>• Cloud service providers for business operations</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">5.4 Anonymous Data Usage</h3>
              <p className="text-purple-200">
                You agree that we may use confidential information and personal data provided by you – provided it is anonymous 
                and identity cannot be derived from it – for compiling best practices, statistics, research purposes, and benchmarking.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">5.10 Cloud Services Authorization</h3>
              <p className="text-purple-200">
                To support our business operation we have the right to use Cloud services, including but not limited to 
                Cloudflare for content delivery and security, Cloudflare R2 for storage, as well as other cloud-based third-party 
                service providers necessary for the operation and optimization of Ascended Social.
              </p>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Intellectual Property</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">6.1 Our IP Rights</h3>
              <p className="text-purple-200 mb-3">
                We, Third Eye Cyborg, LLC, doing business as Ascended Social, reserve all intellectual property rights 
                in relation to products of the intellect that we use or develop within the framework of the Engagement, including:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• Proprietary platform features</li>
                <li>• AI-powered oracle readings</li>
                <li>• Chakra assessments</li>
                <li>• Spiritual guidance tools</li>
                <li>• Computer programs and system designs</li>
                <li>• Working methods and opinions</li>
                <li>• Brands and logos</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">6.2 Usage Restrictions</h3>
              <p className="text-purple-200 mb-3">
                You are explicitly prohibited from reproducing, publishing, or using for commercial purposes, 
                whether alone or involving third parties, those products including:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• Computer programs and systems designs</li>
                <li>• Working methods and opinions</li>
                <li>• Contracts and model contracts</li>
                <li>• Brands and logos</li>
                <li>• Other products of the intellect</li>
              </ul>
              <p className="text-purple-200 mt-3">
                These products may not be reproduced, published, or used for commercial purposes without our prior written consent.
              </p>
            </div>
          </div>
        </div>

        {/* Third-Party Service Specific Disclaimers */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <Cloud className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Third-Party Service Disclaimers</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">(a) AI and Machine Learning Services</h3>
              <p className="text-purple-200">
                All AI-generated spiritual content is provided for informational and entertainment purposes only and is powered 
                by OpenAI's language models. Such content does not constitute supernatural, mystical, or professional spiritual advice. 
                We do not guarantee the accuracy, completeness, or spiritual authenticity of AI-generated insights, and you assume 
                all risks associated with reliance on such content.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">(b) Payment Processing</h3>
              <p className="text-purple-200">
                Payment processing is handled by Stripe, Inc. and is subject to Stripe's terms of service and privacy policy. 
                We do not store your payment information and disclaim liability for any payment processing errors, delays, 
                or disputes arising from Stripe's systems. You are responsible for maintaining accurate payment details and 
                monitoring your subscription charges.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">(c) Analytics and Tracking</h3>
              <p className="text-purple-200">
                User analytics are collected via PostHog to improve platform functionality. Data processing is governed by 
                PostHog's privacy policy. We are not responsible for any data security breaches or unauthorized access to 
                analytics data by PostHog or its affiliates.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">(d) Communication Services</h3>
              <p className="text-purple-200">
                Push notifications and communications are delivered through OneSignal, subject to their terms and privacy practices. 
                We disclaim liability for notification delivery failures, delays, or content issues resulting from OneSignal's systems.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">(e) Infrastructure and Security</h3>
              <p className="text-purple-200">
                Platform security, content delivery, and storage are supported by Cloudflare. We are not liable for service outages, 
                content delivery delays, or security interruptions caused by Cloudflare's infrastructure.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">(f) External Content and Integrations</h3>
              <p className="text-purple-200">
                Links to external spiritual resources and integrations with third-party spiritual tools are provided for your convenience. 
                We do not endorse or verify the content of external sites and disclaim responsibility for their accuracy, safety, or appropriateness.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">(g) Legal Compliance</h3>
              <p className="text-purple-200">
                We comply with applicable laws and regulations regarding third-party service disclosure and user notification. 
                You acknowledge that some third-party services are essential for platform operation and may not be individually opted out.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">(h) Service Modification</h3>
              <p className="text-purple-200">
                We reserve the right to modify, replace, or discontinue third-party service integrations with reasonable advance notice. 
                We will notify you of any significant changes affecting your use of the platform and provide migration assistance where appropriate.
              </p>
            </div>
          </div>
        </div>

        {/* Liability Framework */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <Scale className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Liability Framework</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">11.1 Liability Limitation</h3>
              <p className="text-purple-200 mb-3">
                We, Third Eye Cyborg, LLC, operating Ascended Social at 814 North Granite Drive, Payson, AZ 85541, 
                shall provide our Services to the best of our ability and exercise due care. If errors are made as a result 
                of incorrect or incomplete information provided by you or third parties, we shall not be liable for consequential damage.
              </p>
              <p className="text-purple-200">
                Our total liability for any errors that would have been prevented if we had exercised due care is limited 
                to a maximum of five times the fee paid for the specific services from which the errors resulted.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">11.2 Multiple Entity Engagements</h3>
              <p className="text-purple-200">
                If the Engagement is carried out for more than one legal entity/person, the limitation of liability 
                shall apply to all these entities/persons jointly. In the event of liability, it is up to this group 
                to share the maximum amount of damages awarded among themselves.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">11.3 Client Indemnification</h3>
              <p className="text-purple-200">
                You shall indemnify us and hold us harmless against any claims by third parties, including claims arising 
                from the use or malfunction of integrated third-party services such as AI-powered features, payment processors, 
                analytics providers, notification services, infrastructure providers, or external content resources.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">11.5 Excluded Damages</h3>
              <p className="text-purple-200">
                We shall not be held liable for any consequential, indirect or punitive damages and/or loss of profit.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">11.7 Limitation Period</h3>
              <p className="text-purple-200">
                Your rights of action with respect to us arising from the Engagement shall lapse after one year from the date 
                on which the damage first manifested itself and in any event after five years from the date on which the 
                event causing the damage occurred.
              </p>
            </div>
          </div>
        </div>

        {/* Force Majeure */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <AlertCircle className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Force Majeure</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">13.1 Covered Events</h3>
              <p className="text-purple-200 mb-3">
                If we are prevented from fulfilling our obligations by reason of any supervening event beyond our control, 
                we shall not be deemed to be in breach of our obligations. Covered events include:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• War, national emergency, flood, earthquake</li>
                <li>• Strike, lockout</li>
                <li>• Disruption of third-party services or infrastructure</li>
                <li>• AI providers, payment processors, analytics platforms</li>
                <li>• Notification services, content delivery networks</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">13.2 Extended Incapacity</h3>
              <p className="text-purple-200">
                If the period of such incapacity exceeds 6 months, this Engagement shall automatically be terminated 
                unless the parties first agree otherwise in writing. We will immediately give notice of force majeure 
                events and take all reasonable steps to resume performance of our obligations.
              </p>
            </div>
          </div>
        </div>

        {/* Governing Law */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Governing Law and Jurisdiction</h2>
          <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
            <p className="text-purple-200 mb-4">
              This document is governed by and construed in accordance with the <strong>laws of the United States</strong>. 
              Each party irrevocably and unconditionally submits to the non-exclusive jurisdiction of the United States courts 
              and waives any right to object to an action being brought in those courts.
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
                <p>Business Name: Ascended Social</p>
                <p>Address: 814 North Granite Drive, Payson, AZ 85541</p>
                <p>Email: legal@ascended.social</p>
                <p>Support: support@ascended.social</p>
              </div>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Third-Party Services</h3>
              <p className="text-purple-200 mb-3">
                For questions about integrated third-party services:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• AI Services: OpenAI</li>
                <li>• Payment Processing: Stripe, Inc.</li>
                <li>• Analytics: PostHog</li>
                <li>• Notifications: OneSignal</li>
                <li>• Infrastructure: Cloudflare</li>
                <li>• Documentation: Notion</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-8 border border-purple-500/30">
          <p className="text-lg text-purple-200 mb-4">
            These Third-Party Service Disclaimers ensure comprehensive protection and clear limitations regarding 
            external service dependencies while maintaining the integrity and professional operation of Ascended Social 
            spiritual community platform by Third Eye Cyborg, LLC.
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
            <Link href="/service-agreement">
              <span className="text-purple-300 hover:text-white transition-colors cursor-pointer" data-testid="link-service-agreement">
                Service Agreement
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}