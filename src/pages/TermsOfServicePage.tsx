import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Scale, UserCheck, CreditCard, Ban, AlertCircle } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | KenjiAI</title>
        <meta name="description" content="KenjiAI Terms of Service - Legal terms and conditions for using our AI automation platform." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-gray-900 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Scale className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Terms of Service</h1>
          </div>

          <p className="text-center text-gray-400 mb-8">Last Updated: December 19, 2024</p>

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Agreement to Terms</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and KenjiAI ("Company," "we," "us," or "our") concerning your access to and use of the KenjiAI website and services.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                <p className="text-gray-300 leading-relaxed font-semibold">
                  BY ACCESSING OR USING OUR SERVICES, YOU AGREE TO BE BOUND BY THESE TERMS. IF YOU DISAGREE WITH ANY PART OF THESE TERMS, YOU MAY NOT ACCESS OR USE OUR SERVICES.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Eligibility and Account Registration</h2>
              </div>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">Eligibility</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                You must be at least 18 years old and have the legal capacity to enter into contracts to use our services. By using our services, you represent and warrant that you meet these eligibility requirements.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">Account Creation</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                To access certain features, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security and confidentiality of your password</li>
                <li>Immediately notify us of any unauthorized use of your account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
              </ul>

              <p className="text-gray-300 leading-relaxed">
                We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Services and Pricing</h2>
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">Service Description</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                KenjiAI provides AI-powered automation tools and services for business operations. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without notice.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">Pricing and Payment</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>All prices are subject to change without notice</li>
                <li>Payment is required in advance for subscription services</li>
                <li>All fees are non-refundable unless otherwise stated</li>
                <li>You are responsible for all taxes associated with your purchase</li>
                <li>Failure to pay may result in service suspension or termination</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">Subscriptions</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Subscription services automatically renew unless you cancel before the renewal date. You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of the current billing period.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">Refund Policy</h3>
              <p className="text-gray-300 leading-relaxed">
                Refunds are provided at our sole discretion. Please contact our support team within 30 days of purchase to request a refund. Refunds are not guaranteed and will be evaluated on a case-by-case basis.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Ban className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-white">Acceptable Use Policy</h2>
              </div>

              <p className="text-gray-300 leading-relaxed mb-4">
                You agree NOT to use our services to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Violate any laws, regulations, or third-party rights</li>
                <li>Engage in fraudulent, misleading, or deceptive practices</li>
                <li>Transmit harmful code, viruses, or malicious software</li>
                <li>Attempt to gain unauthorized access to our systems or networks</li>
                <li>Interfere with or disrupt the integrity of our services</li>
                <li>Harvest or collect data from our services through automated means</li>
                <li>Impersonate any person or entity</li>
                <li>Engage in spam, phishing, or unsolicited communications</li>
                <li>Use our services for any illegal or unauthorized purpose</li>
                <li>Reverse engineer, decompile, or disassemble our software</li>
                <li>Resell or redistribute our services without permission</li>
              </ul>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <p className="text-gray-300 leading-relaxed font-semibold">
                  Violation of this Acceptable Use Policy may result in immediate termination of your account and legal action.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property Rights</h2>

              <h3 className="text-xl font-semibold text-white mb-3">Our Property</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                All content, features, and functionality of our services, including but not limited to text, graphics, logos, software, and design, are owned by KenjiAI and protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">License Grant</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We grant you a limited, non-exclusive, non-transferable, revocable license to access and use our services for your personal or business use in accordance with these Terms.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">Your Content</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                You retain ownership of any content you upload to our services. By uploading content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content solely for the purpose of providing our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Data and Privacy</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Your use of our services is also governed by our Privacy Policy. By using our services, you consent to our collection and use of personal data as outlined in the Privacy Policy.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We implement reasonable security measures to protect your data, but we cannot guarantee absolute security. You use our services at your own risk.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">Disclaimers and Warranties</h2>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-4">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">AS-IS BASIS</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Merchantability, fitness for a particular purpose, or non-infringement</li>
                  <li>Uninterrupted, timely, secure, or error-free operation</li>
                  <li>Accuracy, reliability, or completeness of content or results</li>
                  <li>Compatibility with your systems or requirements</li>
                </ul>
              </div>

              <p className="text-gray-300 leading-relaxed">
                We disclaim all warranties to the fullest extent permitted by law. Your use of our services is at your sole risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>

              <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-6">
                <p className="text-gray-300 leading-relaxed mb-4 font-semibold">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL KENJIAI, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                  <li>Indirect, incidental, special, consequential, or punitive damages</li>
                  <li>Loss of profits, revenue, data, or business opportunities</li>
                  <li>Service interruptions or data loss</li>
                  <li>Costs of substitute services</li>
                  <li>Personal injury or property damage</li>
                </ul>
                <p className="text-gray-300 leading-relaxed font-semibold">
                  OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM, OR $100, WHICHEVER IS GREATER.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Indemnification</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree to indemnify, defend, and hold harmless KenjiAI and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising from:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Your use or misuse of our services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your content or data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason, including breach of these Terms.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Upon termination:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Your right to use our services ceases immediately</li>
                <li>All provisions of these Terms that should survive termination remain in effect</li>
                <li>We may delete your account and data</li>
                <li>You remain liable for all charges incurred before termination</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Dispute Resolution</h2>

              <h3 className="text-xl font-semibold text-white mb-3">Governing Law</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law provisions.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">Arbitration</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Any dispute arising from these Terms or our services shall be resolved through binding arbitration rather than in court, except that you may assert claims in small claims court if they qualify.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">Class Action Waiver</h3>
              <p className="text-gray-300 leading-relaxed">
                You agree to resolve disputes with us on an individual basis and waive your right to participate in class actions or class-wide arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">General Provisions</h2>

              <h3 className="text-xl font-semibold text-white mb-3">Modifications</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website. Your continued use after changes constitutes acceptance of the modified Terms.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">Entire Agreement</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                These Terms, together with our Privacy Policy and any other legal notices published on our website, constitute the entire agreement between you and KenjiAI.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">Severability</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">No Waiver</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our failure to enforce any right or provision of these Terms shall not be deemed a waiver of such right or provision.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">Assignment</h3>
              <p className="text-gray-300 leading-relaxed">
                You may not assign or transfer these Terms without our prior written consent. We may assign these Terms without restriction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-700/50 rounded-xl p-6">
                <p className="text-gray-300"><strong className="text-white">Email:</strong> legal@kenjiai.com</p>
                <p className="text-gray-300 mt-2"><strong className="text-white">Website:</strong> https://kenjiai.com</p>
              </div>
            </section>

            <section>
              <div className="bg-blue-500/10 border-2 border-blue-500/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-3">Acknowledgment</h3>
                <p className="text-gray-300 leading-relaxed font-semibold">
                  BY USING KENJIAI SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE OUR SERVICES.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
