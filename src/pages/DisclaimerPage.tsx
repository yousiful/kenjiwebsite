import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, TrendingUp, DollarSign, BarChart, Shield, FileText } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <>
      <Helmet>
        <title>Disclaimer | KenjiAI</title>
        <meta name="description" content="Important disclaimers about KenjiAI services, results, and limitations." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-gray-900 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <AlertTriangle className="w-12 h-12 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Disclaimer</h1>
          </div>

          <p className="text-center text-gray-400 mb-8">Last Updated: December 19, 2024</p>

          <div className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-yellow-400 mb-3">Important Notice</h2>
            <p className="text-gray-300 leading-relaxed">
              Please read this disclaimer carefully before using KenjiAI services. By accessing or using our website and services, you acknowledge and agree to the terms outlined in this disclaimer.
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-white">Results Disclaimer</h2>
              </div>

              <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-6 mb-4">
                <h3 className="text-xl font-bold text-red-400 mb-3">NO GUARANTEED RESULTS</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong>Individual results may vary.</strong> Any claims, statistics, or examples of revenue increases, ROI percentages, time savings, or business growth mentioned on our website, marketing materials, or communications are for illustrative purposes only and do not guarantee that you will achieve similar results.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The testimonials, case studies, and success stories shared are not typical results. Your results will depend on numerous factors including but not limited to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Your business model, industry, and market conditions</li>
                  <li>Your level of experience and expertise</li>
                  <li>The time and effort you invest in using our platform</li>
                  <li>Your existing customer base and resources</li>
                  <li>External economic factors beyond our control</li>
                  <li>Your commitment to implementing our recommendations</li>
                  <li>The quality of your products or services</li>
                  <li>Your marketing strategies and execution</li>
                </ul>
              </div>

              <p className="text-gray-300 leading-relaxed mb-4">
                <strong className="text-white">We make no promises, guarantees, or warranties</strong> that you will achieve any specific financial results, sales increases, profit margins, or business outcomes by using our AI automation platform.
              </p>

              <div className="bg-gray-700/50 rounded-xl p-6 mb-4">
                <h3 className="text-lg font-bold text-white mb-3">Examples of Claims That Are NOT Guarantees:</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>"425% Average ROI" - This is an average of specific case studies and not a guarantee of your results</li>
                  <li>"Save 40+ hours per week" - Time savings vary greatly based on current workflows and implementation</li>
                  <li>"10X Your Revenue" - Revenue increases depend entirely on individual business factors</li>
                  <li>"Close Deals 24/7" - Deal closing rates depend on your products, market, and sales process</li>
                  <li>"300% More Leads" - Lead generation results vary based on marketing efforts and market conditions</li>
                </ul>
              </div>

              <p className="text-gray-300 leading-relaxed">
                <strong className="text-red-400">YOU ACCEPT FULL RESPONSIBILITY</strong> for your business decisions and understand that past performance does not indicate future results. Success requires dedication, effort, and multiple factors beyond just using our software.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">Earnings and Income Disclaimer</h2>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-4">
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-white">We make no income claims or guarantees.</strong> Any examples of earnings, revenue, or financial success are based on specific circumstances and should not be interpreted as common, typical, or expected results.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Many factors will determine your actual results, and no guarantees are made that you will achieve results similar to those described. You may make more, less, or nothing at all.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-yellow-400">There is significant risk involved in any business venture.</strong> You could lose money, time, and resources. Do not use our services if you cannot afford the possibility of loss.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <BarChart className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Performance and Functionality Disclaimer</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                While we strive to provide reliable and high-quality AI automation services:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>We do not guarantee uninterrupted, error-free, or completely secure service</li>
                <li>AI systems may occasionally produce unexpected or incorrect outputs</li>
                <li>System performance may vary based on factors beyond our control</li>
                <li>Integration with third-party services may be affected by external changes</li>
                <li>Technical issues may temporarily impact service availability</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-white">We are not liable for any business losses, missed opportunities, or damages</strong> resulting from service interruptions, technical issues, or AI system limitations.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Professional Advice Disclaimer</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                KenjiAI provides software tools and automation services. <strong className="text-white">We do not provide legal, financial, tax, accounting, or other professional advice.</strong>
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Any information or suggestions provided through our platform are for general informational purposes only and should not be construed as professional advice. You should:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Consult with qualified professionals before making business decisions</li>
                <li>Seek legal advice for compliance with applicable laws and regulations</li>
                <li>Consult financial advisors regarding investment and business strategies</li>
                <li>Verify all information independently before relying on it</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Testimonials and Case Studies Disclaimer</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Testimonials and case studies presented on our website represent individual experiences and are not representative of typical results. These individuals may have:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Prior experience or expertise in their field</li>
                <li>Existing business infrastructure and resources</li>
                <li>Invested additional time, money, and effort beyond our services</li>
                <li>Favorable market conditions or timing</li>
                <li>Received compensation or incentives for their testimonials</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-white">These testimonials do not guarantee similar outcomes.</strong> Your results will be unique to your circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Links and Services</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our website and services may contain links to third-party websites or integrate with third-party services. We are not responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>The content, accuracy, or availability of third-party sites</li>
                <li>The privacy practices or terms of third-party services</li>
                <li>Any damage or loss caused by third-party interactions</li>
                <li>Changes or discontinuation of third-party services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-white">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>We are not liable for any indirect, incidental, special, or consequential damages</li>
                  <li>We are not responsible for lost profits, revenue, data, or business opportunities</li>
                  <li>Our total liability shall not exceed the amount you paid for our services</li>
                  <li>We provide services "as is" without warranties of any kind</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">User Responsibility</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                By using KenjiAI, you acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>You are solely responsible for your use of our services</li>
                <li>You will comply with all applicable laws and regulations</li>
                <li>You will not rely solely on our platform for business decisions</li>
                <li>You understand the risks associated with business operations</li>
                <li>You accept full responsibility for any outcomes, positive or negative</li>
                <li>You will conduct your own due diligence before making decisions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Regulatory Compliance</h2>
              <p className="text-gray-300 leading-relaxed">
                Users are responsible for ensuring their use of KenjiAI services complies with all applicable laws, regulations, and industry standards in their jurisdiction. This includes but is not limited to data protection laws, consumer protection regulations, marketing laws, and industry-specific regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to This Disclaimer</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify this disclaimer at any time. Changes become effective immediately upon posting. Your continued use of our services after changes indicates acceptance of the updated disclaimer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have questions about this disclaimer, please contact us:
              </p>
              <div className="bg-gray-700/50 rounded-xl p-6">
                <p className="text-gray-300"><strong className="text-white">Email:</strong> legal@kenjiai.com</p>
                <p className="text-gray-300 mt-2"><strong className="text-white">Website:</strong> https://kenjiai.com</p>
              </div>
            </section>

            <section>
              <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-3">FINAL REMINDER</h3>
                <p className="text-gray-300 leading-relaxed font-semibold">
                  BY USING KENJIAI SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREED TO THIS DISCLAIMER. YOU ACCEPT ALL RISKS ASSOCIATED WITH USING OUR SERVICES AND UNDERSTAND THAT RESULTS VARY SIGNIFICANTLY BETWEEN USERS. NO GUARANTEES OF ANY KIND ARE MADE REGARDING YOUR POTENTIAL RESULTS, EARNINGS, OR BUSINESS OUTCOMES.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
