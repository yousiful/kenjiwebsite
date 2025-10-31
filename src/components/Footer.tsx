import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Phone, MapPin, Twitter, Linkedin, Github, HelpCircle, Gift, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import NAPInfo from './NAPInfo';

const Footer: React.FC = () => {
  const links = {
    company: [
      { name: "About", href: "/" },
      { name: "Contact", href: "mailto:care@kenjiai.com" },
      { name: "Pricing", href: "/pricing" },
      { name: "Investors", href: "/investors" },
      { name: "Careers", href: "/investors" },
      { name: "Press", href: "/investors" }
    ],
    legal: [
      { name: "Terms", href: "/knowledge" },
      { name: "Privacy", href: "/knowledge" },
      { name: "Security", href: "/knowledge" },
      { name: "Compliance", href: "/knowledge" }
    ],
    solutions: [
      { name: "AI Automation", href: "/ai-automation" },
      { name: "Voice Agents", href: "/voice-agents" },
      { name: "Voice AI", href: "/voice-ai" },
      { name: "Marketing Automation", href: "/marketing-automation" },
      { name: "CRM & Sales", href: "/crm" }
    ],
    tools: [
      { name: "Free Tools", href: "/free-tools", badge: "Popular" },
      { name: "Prompt Generator", href: "https://prompt.kenjiai.com", external: true, badge: "Free" },
      { name: "PR Pro", href: "https://prpro.kenjiai.com/", external: true, badge: "Free" },
      { name: "Sales Coach", href: "https://salescoach.kenjiai.com/", external: true, badge: "Free" },
      { name: "ViralPost Pro", href: "https://viralpost.kenjiai.com", external: true, badge: "Free" }
    ],
    support: [
      { name: "Help Center", href: "https://support.kenjiai.com/" },
      { name: "Community", href: "/knowledge" },
      { name: "Status", href: "https://support.kenjiai.com/" },
      { name: "Contact Support", href: "https://support.kenjiai.com/" }
    ],
    education: [
      { name: "Educational Hub", href: "/knowledge", badge: "New" },
      { name: "AI Courses", href: "/knowledge" },
      { name: "Tax Strategies", href: "/knowledge" },
      { name: "Investment Training", href: "/knowledge" }
    ]
  };

  const socialLinks = [ 
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Github, href: "https://github.com", label: "GitHub" }
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800 relative overflow-hidden" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-400/20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-8 sm:mb-12">
            {/* Left Side - Brand & Contact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo & Description */}
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                  aria-label="KenjiAI Logo"
                  style={{
                    backgroundImage: `url('https://assets.cdn.filesafe.space/q5L4ttbBMHNxieXIcTVJ/media/5adccaae-527e-49d4-befc-6410b918c624.gif')`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))',
                    mixBlendMode: 'screen'
                  }}
                />
                <span className="text-xl sm:text-2xl font-bold text-white">KenjiAI</span>
              </div>
              
              <p className="text-gray-400 text-sm sm:text-lg mb-6 sm:mb-8 max-w-md leading-relaxed">
                The AI platform that makes you money while you sleep. Voice agents that close deals 24/7, 
                smart workflows that run your business, and automation that pays for itself.
              </p>

              {/* Free Tools Highlight */}
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  <span className="text-green-400 font-semibold text-sm sm:text-base">Free AI Tools</span>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm">
                  Try our powerful AI tools completely free - start making money with AI today!
                </p>
                <Link 
                  to="/free-tools"
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-xs sm:text-sm font-semibold mt-2" 
                  aria-label="Access free AI tools"
                >
                  Start Making Money Free
                  <Star className="w-3 h-3" />
                </Link>
              </div>

              {/* Contact Info with NAP */}
              <div className="space-y-3 sm:space-y-4">
                <NAPInfo variant="compact" showIcons={true} />
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                  <a
                    href="https://support.kenjiai.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Support Center
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 mt-6 sm:mt-8">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={`${social.label}-${index}`}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-400 rounded-lg flex items-center justify-center transition-all duration-300 group"
                  >
                    <social.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Links */}
            <motion.nav
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8"
              aria-label="Footer Navigation"
            >
              {/* Solutions Links */}
              <div role="navigation" aria-labelledby="footer-solutions">
                <p id="footer-solutions" className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Solutions</p>
                <ul className="space-y-2 sm:space-y-3" role="list">
                  {links.solutions.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-xs sm:text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools Links */}
              <div role="navigation" aria-labelledby="footer-tools">
                <p id="footer-tools" className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Tools</p>
                <ul className="space-y-2 sm:space-y-3" role="list">
                  {links.tools.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 text-xs sm:text-sm"
                        >
                          {link.name}
                          {link.badge && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              link.badge === 'Free' ? 'bg-green-500/20 text-green-400' :
                              link.badge === 'Popular' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {link.badge}
                            </span>
                          )}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 text-xs sm:text-sm"
                        >
                          {link.name}
                          {link.badge && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              link.badge === 'Free' ? 'bg-green-500/20 text-green-400' :
                              link.badge === 'Popular' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Education Links */}
              <div role="navigation" aria-labelledby="footer-education">
                <p id="footer-education" className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Education</p>
                <ul className="space-y-2 sm:space-y-3" role="list">
                  {links.education.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 text-xs sm:text-sm"
                      >
                        {link.name}
                        {link.badge && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            link.badge === 'New' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div role="navigation" aria-labelledby="footer-company">
                <p id="footer-company" className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</p>
                <ul className="space-y-2 sm:space-y-3" role="list">
                  {links.company.map((link) => (
                    <li key={link.name}>
                      {link.href.startsWith('mailto:') ? (
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 text-xs sm:text-sm"
                        >
                          {link.name}
                          {link.badge && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              link.badge === 'Popular' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {link.badge}
                            </span>
                          )}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 text-xs sm:text-sm"
                        >
                          {link.name}
                          {link.badge && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              link.badge === 'Popular' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support Links */}
              <div role="navigation" aria-labelledby="footer-support">
                <p id="footer-support" className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</p>
                <ul className="space-y-2 sm:space-y-3" role="list">
                  {links.support.map((link) => (
                    <li key={link.name}>
                      {link.href.startsWith('http') ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-xs sm:text-sm"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-xs sm:text-sm"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div role="navigation" aria-labelledby="footer-legal">
                <p id="footer-legal" className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</p>
                <ul className="space-y-2 sm:space-y-3" role="list">
                  {links.legal.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-xs sm:text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.nav>
          </div>
        </div>

        {/* Bottom Bar */}
        {/* Legal Disclaimers Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 pt-6 sm:pt-8"
          role="contentinfo"
        >
          {/* FTC Disclosure & Earnings Disclaimer */}
          <div className="max-w-5xl mx-auto mb-6 sm:mb-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-6">
              <h3 className="text-white font-semibold text-sm sm:text-base mb-3">
                FTC Disclosure & Earnings Disclaimer
              </h3>
              <div className="text-gray-400 text-xs sm:text-sm space-y-2 leading-relaxed">
                <p>
                  <strong className="text-gray-300">Results Disclaimer:</strong> The revenue figures, earnings claims, and success stories mentioned on this website (including but not limited to "$500K+/month" and similar statements) represent exceptional results and are not typical. These figures are provided for illustrative purposes only and should not be construed as a guarantee, promise, or assurance of earnings. Individual results will vary and depend on many factors including but not limited to individual capacity, experience, business acumen, market conditions, and level of commitment.
                </p>
                <p>
                  <strong className="text-gray-300">No Guarantee of Results:</strong> KenjiAI makes no guarantees concerning the level of success you may experience. Your results will depend on your individual effort, dedication, business experience, and market factors beyond our control. We cannot and do not guarantee that you will achieve any particular result, earn any specific amount of money, or achieve success by using our products, services, or information.
                </p>
                <p>
                  <strong className="text-gray-300">Testimonials & Case Studies:</strong> Any testimonials, case studies, or success stories presented on this website are based on the experiences of a few individuals and do not necessarily represent what you should expect. Past performance is not indicative of future results. These results are not typical and your experience may differ significantly.
                </p>
                <p>
                  <strong className="text-gray-300">FTC Compliance:</strong> In accordance with Federal Trade Commission (FTC) guidelines, we are required to inform you that the earnings and income representations made on this website are aspirational statements of your earnings potential. The success of any business venture depends on many factors including market conditions, competition, individual effort, and circumstances beyond our control. We make no guarantee that you will achieve similar results.
                </p>
                <p>
                  <strong className="text-gray-300">Material Connections:</strong> This website may contain affiliate links, sponsored content, or compensated endorsements. We may receive commissions or compensation when you click on links or purchase products through our website. This compensation helps support our business but does not influence our recommendations or editorial content.
                </p>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="max-w-5xl mx-auto mb-6 sm:mb-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-6">
              <h3 className="text-white font-semibold text-sm sm:text-base mb-3">
                Limitation of Liability & Legal Disclaimers
              </h3>
              <div className="text-gray-400 text-xs sm:text-sm space-y-2 leading-relaxed">
                <p>
                  <strong className="text-gray-300">Use at Your Own Risk:</strong> The information, products, and services provided on this website are provided "as is" without warranties of any kind, either express or implied. Your use of this website and any services, products, or information obtained through this website is at your sole risk and responsibility.
                </p>
                <p>
                  <strong className="text-gray-300">No Professional Advice:</strong> The content on this website is for informational and educational purposes only and should not be construed as professional, legal, financial, tax, investment, or business advice. You should consult with qualified professionals (attorneys, accountants, financial advisors) before making any business, legal, or financial decisions.
                </p>
                <p>
                  <strong className="text-gray-300">Limitation of Liability:</strong> To the maximum extent permitted by law, KenjiAI, its affiliates, officers, directors, employees, agents, and licensors shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from or related to your use of this website, our products, or services, including but not limited to loss of profits, loss of data, loss of business opportunities, or business interruption, even if we have been advised of the possibility of such damages.
                </p>
                <p>
                  <strong className="text-gray-300">Third-Party Links:</strong> This website may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of these third-party sites. Your use of third-party websites is at your own risk and subject to the terms and conditions of those websites.
                </p>
                <p>
                  <strong className="text-gray-300">Accuracy of Information:</strong> While we strive to provide accurate and up-to-date information, we make no representations or warranties about the accuracy, completeness, or reliability of any information on this website. Information may become outdated, and we reserve the right to modify content without notice.
                </p>
              </div>
            </div>
          </div>

          {/* Regulatory Compliance */}
          <div className="max-w-5xl mx-auto mb-6 sm:mb-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-6">
              <h3 className="text-white font-semibold text-sm sm:text-base mb-3">
                Regulatory Compliance & User Responsibilities
              </h3>
              <div className="text-gray-400 text-xs sm:text-sm space-y-2 leading-relaxed">
                <p>
                  <strong className="text-gray-300">Compliance Responsibility:</strong> You are solely responsible for ensuring that your use of our products, services, and information complies with all applicable federal, state, and local laws and regulations in your jurisdiction. This includes but is not limited to advertising laws, consumer protection laws, privacy laws (including GDPR, CCPA), anti-spam laws (CAN-SPAM Act), and FTC regulations.
                </p>
                <p>
                  <strong className="text-gray-300">Business Practices:</strong> You agree to conduct your business in an ethical and lawful manner. You will not use our products or services for any illegal, fraudulent, deceptive, or misleading purposes. You are responsible for all representations, claims, and disclosures you make in connection with your business activities.
                </p>
                <p>
                  <strong className="text-gray-300">Intellectual Property:</strong> All content, trademarks, logos, service marks, and intellectual property on this website are owned by or licensed to KenjiAI and are protected by copyright, trademark, and other intellectual property laws. You may not use, reproduce, distribute, or create derivative works from our content without express written permission.
                </p>
                <p>
                  <strong className="text-gray-300">Data Privacy:</strong> We are committed to protecting your privacy. Our collection, use, and disclosure of personal information is governed by our Privacy Policy. By using this website, you consent to our data practices as described in our Privacy Policy and agree to comply with applicable data protection laws.
                </p>
                <p>
                  <strong className="text-gray-300">Indemnification:</strong> You agree to indemnify, defend, and hold harmless KenjiAI, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising from your use of this website, violation of these terms, or violation of any rights of another party.
                </p>
                <p>
                  <strong className="text-gray-300">Dispute Resolution:</strong> Any disputes arising from your use of this website or our services shall be governed by the laws of the United States and the state in which KenjiAI operates, without regard to conflict of law provisions. You agree to submit to the exclusive jurisdiction of the courts in that location.
                </p>
              </div>
            </div>
          </div>

          {/* User Agreement */}
          <div className="max-w-5xl mx-auto mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-xl p-4 sm:p-6">
              <h3 className="text-white font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Important User Agreement
              </h3>
              <div className="text-gray-300 text-xs sm:text-sm space-y-2 leading-relaxed">
                <p>
                  <strong className="text-white">By using this website, you acknowledge and agree that:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>You have read, understood, and agree to be bound by all terms, conditions, and disclaimers on this page</li>
                  <li>You understand that results are not guaranteed and may vary significantly</li>
                  <li>You are responsible for your own business decisions and actions</li>
                  <li>You will seek professional advice before making significant business or financial decisions</li>
                  <li>You will comply with all applicable laws and regulations in your jurisdiction</li>
                  <li>You acknowledge that this website may be updated, and continued use constitutes acceptance of any changes</li>
                </ul>
                <p className="mt-3 text-blue-300 font-medium">
                  If you do not agree with any part of these terms, disclaimers, or conditions, please discontinue use of this website immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Review Notice */}
          <div className="max-w-5xl mx-auto mb-6 sm:mb-8">
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4">
              <p className="text-yellow-200 text-xs sm:text-sm text-center">
                <strong>Legal Notice:</strong> This legal language is provided for general compliance purposes. It is strongly recommended that you have this reviewed and customized by a qualified attorney licensed in your jurisdiction to ensure it meets your specific business needs and complies with all applicable laws.
              </p>
            </div>
          </div>

          {/* Copyright & Links */}
          <div className="text-center border-t border-gray-800 pt-6">
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
              © {new Date().getFullYear()} KenjiAI. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
              <Link to="/knowledge" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
              <Link to="/knowledge" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
              <Link to="/knowledge" className="hover:text-blue-400 transition-colors">Cookie Policy</Link>
              <Link to="/knowledge" className="hover:text-blue-400 transition-colors">Disclaimer</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;