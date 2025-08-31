import { Link } from "wouter";
import { Shield, Copyright, FileText, Users, AlertTriangle, BookOpen } from "lucide-react";
import ASLogo from "@assets/ASLogo.png";

export default function CopyrightPolicy() {
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
            <Copyright className="h-16 w-16 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4" data-testid="text-page-title">
            Copyright Policy
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Comprehensive copyright protection and intellectual property management framework for Third Eye Cyborg, LLC
          </p>
        </div>

        {/* Policy Statement */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Policy Statement</h2>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
            <p className="text-purple-200 mb-4">
              <strong>Third Eye Cyborg, LLC</strong> acknowledges that copyright is a valuable part of our intellectual property portfolio. 
              To ensure that Third Eye Cyborg, LLC can maintain, use and protect its copyright, the company expects all members of 
              staff to act in compliance with this copyright policy.
            </p>
            <p className="text-purple-200">
              This copyright policy is not part of a member of staff's contract of employment and can be amended at any time. 
              Any breach of this copyright policy is a serious indiscretion and may result in disciplinary action up to and 
              including termination of employment.
            </p>
          </div>
        </div>

        {/* People Covered */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <Users className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">People Covered by this Policy</h2>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
            <p className="text-purple-200">
              This policy is applicable to all persons working for <strong>Third Eye Cyborg, LLC</strong> at all levels, including:
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <ul className="text-purple-200 space-y-2">
                <li>• Directors</li>
                <li>• Senior managers</li>
                <li>• Employees</li>
              </ul>
              <ul className="text-purple-200 space-y-2">
                <li>• Consultants</li>
                <li>• Part-time staff</li>
                <li>• Casual staff</li>
              </ul>
              <ul className="text-purple-200 space-y-2">
                <li>• Contractors</li>
                <li>• Freelancers</li>
                <li>• Volunteers</li>
              </ul>
            </div>
            <p className="text-purple-200 mt-4">
              (Collectively referred to as "staff" throughout the rest of this policy)
            </p>
          </div>
        </div>

        {/* What is Covered */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <BookOpen className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">What is Covered by the Policy?</h2>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
            <p className="text-purple-200 mb-4">
              This copyright policy applies to all original work created by or contracted for development by the company 
              and its members of staff including, but not limited to:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Legal & Compliance Documents</h3>
                <ul className="text-purple-200 space-y-2">
                  <li>• International compliance documents</li>
                  <li>• Data protection impact assessments</li>
                  <li>• GDPR compliance frameworks</li>
                  <li>• Cookie consent management policies</li>
                  <li>• Data deletion request procedures</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Platform Content & Technology</h3>
                <ul className="text-purple-200 space-y-2">
                  <li>• User-generated spiritual content</li>
                  <li>• Platform analytics and algorithms</li>
                  <li>• Oracle AI system documentation</li>
                  <li>• Spiritual guidance frameworks</li>
                  <li>• Related documentation for Ascended Social</li>
                </ul>
              </div>
            </div>
            <p className="text-purple-200 mt-4">
              All works created for <strong>Ascended Social</strong>, a spiritual community and wellness platform operated by Third Eye Cyborg, LLC.
            </p>
          </div>
        </div>

        {/* Establishing Copyright Protection */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <Shield className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Establishing Copyright Protection</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Work Marking Requirements</h3>
              <p className="text-purple-200 mb-3">
                Upon creation, the author should mark all original works, whether draft or final versions, with the following:
              </p>
              <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-400/20">
                <code className="text-purple-100 text-sm">
                  "This original work was created by [NAME], [JOB TITLE], on [DATE]"
                </code>
              </div>
              <p className="text-purple-200 mt-3">
                If possible, each piece of original work should be signed by the author.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Copyright Record System</h3>
              <p className="text-purple-200 mb-3">
                Complete records shall be established and maintained by the <strong>Legal Team</strong> for storage and easy access to copyright records.
              </p>
              <p className="text-purple-200">
                The following information should be recorded in the system:
              </p>
              <ul className="text-purple-200 space-y-1 mt-2">
                <li>• Key development stages and staff involved</li>
                <li>• All draft designs demonstrating work development</li>
                <li>• Relevant internal correspondence</li>
                <li>• Date of publication (if published)</li>
                <li>• Complete author details and position</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Use of Copyright Notice</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Standard Copyright Notice</h3>
              <p className="text-purple-200 mb-3">
                If original work created by a member of staff is to be published, a copyright notice shall be included:
              </p>
              <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-400/20">
                <code className="text-purple-100 text-sm">
                  "© [year of publication], Third Eye Cyborg, LLC"
                </code>
              </div>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Updated Works</h3>
              <p className="text-purple-200 mb-3">
                If such a work is updated, changed, or amended in any way, the original date and date of update, 
                change or amendment shall be included in the copyright notice.
              </p>
              <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-400/20">
                <code className="text-purple-100 text-sm">
                  "© 2024-2025, Third Eye Cyborg, LLC. Last updated: [DATE]"
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Ownership and Third Parties */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-6">Ownership of Copyright</h2>
            
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Employee-Created Works</h3>
              <p className="text-purple-200">
                Third Eye Cyborg, LLC's employment agreements govern ownership of copyright (and other intellectual property rights) 
                and situations whereby an employee produces original work during the course of employment.
              </p>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Third-Party Commissioned Work</h3>
              <p className="text-purple-200 mb-3">
                If a member of staff commissions work from a third party, they should discuss with the 
                <strong> Legal Team</strong> to determine whether any action is needed to maintain ownership and protect any resultant copyright.
              </p>
              <p className="text-purple-200">
                Consider whether any assignment, license, or other arrangement regarding the copyright is required. 
                The Legal Team should maintain complete records of any contractual arrangements with third-party contractors.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-6">Third-Party Copyright</h2>
            
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Respecting Third-Party Rights</h3>
              <p className="text-purple-200 mb-3">
                Staff should respect third-party copyright when carrying out their duties. Members of staff should consider 
                whether any third-party copyright applies to any resource, including:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• User-generated spiritual content</li>
                <li>• Analytics data</li>
                <li>• Third-party service integrations</li>
                <li>• Electronic or hard copy resources</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Infringement Prevention</h3>
              <p className="text-purple-200">
                Members of staff should refrain from using any resource, the use of which would constitute 
                an infringement of third-party copyright.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Infringement */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <div className="flex items-center mb-6">
            <AlertTriangle className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Actual or Suspected Copyright Infringement</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Infringement of Our Copyright</h3>
              <p className="text-purple-200 mb-3">
                If a member of staff becomes aware or reasonably believes that there has been an infringement, 
                by a third party, of Third Eye Cyborg, LLC's copyright, that member of staff should promptly 
                inform the <strong>Legal Team</strong> with details including:
              </p>
              <ul className="text-purple-200 space-y-2">
                <li>• Nature of the work infringed</li>
                <li>• Identity of the suspected infringing party</li>
                <li>• Any relevant supporting documentation</li>
                <li>• Evidence of the infringement</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Colleague Infringement</h3>
              <p className="text-purple-200 mb-3">
                If a member of staff reasonably believes there has been copyright infringement by a colleague 
                of a third party's rights, they should promptly notify the <strong>Legal Team</strong>.
              </p>
              <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-400/20">
                <p className="text-purple-200 text-sm">
                  <strong>Contact:</strong> legal@ascended.social
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Requests to Use Company Work */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Dealing with Requests to Use or Reproduce Company Work</h2>
          <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
            <p className="text-purple-200 mb-4">
              Any requests, whether internal or external, to use or replicate any of the company's resources or works should be 
              referred to the <strong>Legal Team</strong> for deliberation. This includes but is not limited to:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="text-purple-200 space-y-2">
                <li>• Platform content and documentation</li>
                <li>• Proprietary algorithms and data</li>
                <li>• Spiritual guidance frameworks</li>
                <li>• Oracle AI system components</li>
              </ul>
              <ul className="text-purple-200 space-y-2">
                <li>• User interface designs</li>
                <li>• Marketing materials</li>
                <li>• Training documentation</li>
                <li>• Internal processes and procedures</li>
              </ul>
            </div>
            <p className="text-purple-200 mt-4">
              The Legal Team shall keep records of any licenses or other forms of consent given in response to any requests made by any persons.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Copyright Questions</h3>
              <p className="text-purple-200 mb-2">
                For all copyright-related inquiries:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• Email: <strong>legal@ascended.social</strong></li>
                <li>• Business Address: <strong>814 North Granite Drive, Payson, AZ 85541</strong></li>
                <li>• Company: <strong>Third Eye Cyborg, LLC</strong></li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Copyright Infringement Reports</h3>
              <p className="text-purple-200 mb-2">
                To report copyright infringement:
              </p>
              <ul className="text-purple-200 space-y-1">
                <li>• DMCA Agent: <strong>dmca@ascendedsocial.com</strong></li>
                <li>• Legal Team: <strong>legal@ascended.social</strong></li>
                <li>• General Support: <strong>support@ascendedsocial.com</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Company Information</h2>
          <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Third Eye Cyborg, LLC</h3>
                <ul className="text-purple-200 space-y-1">
                  <li>• Business Address: 814 North Granite Drive, Payson, AZ 85541</li>
                  <li>• Platform: Ascended Social (https://ascendedsocial.com)</li>
                  <li>• Business Type: Limited Liability Company (LLC)</li>
                  <li>• Jurisdiction: United States</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Policy Information</h3>
                <ul className="text-purple-200 space-y-1">
                  <li>• This policy can be amended at any time</li>
                  <li>• Policy breaches may result in disciplinary action</li>
                  <li>• All staff levels are covered by this policy</li>
                  <li>• Regular training and updates provided</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-8 border border-purple-500/30">
          <p className="text-lg text-purple-200 mb-4">
            This Copyright Policy ensures comprehensive protection of Third Eye Cyborg, LLC's intellectual property 
            while maintaining compliance with copyright laws and fostering innovation within our spiritual community platform.
          </p>
          <p className="text-sm text-purple-300">
            © 2025 Third Eye Cyborg, LLC | Last updated: August 31, 2025 | Effective immediately
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