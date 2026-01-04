import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Phone, MapPin, Twitter, Linkedin, Github, HelpCircle, Gift, Star, Tag, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const links = {
    company: [
      { name: "About", href: "/" },
      { name: "Contact", href: "mailto:care@kenjiai.com" },
      { name: "Careers", href: "/investors" },
      { name: "Press", href: "/investors" }
    ],
    legal: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Disclaimer", href: "/disclaimer" },
      { name: "Security", href: "/knowledge" }
    ],
    solutions: [
      { name: "AI Automation", href: "/ai-automation" },
      { name: "Voice Agents", href: "/voice-agents" },
      { name: "Voice AI", href: "/voice-ai" },
      { name: "Marketing Automation", href: "/marketing-automation" },
      { name: "CRM & Sales", href: "/crm" }
    ],
    tools: [
      { name: "Free Tools", href: "/free-tools" },
      { name: "Prompt Generator", href: "https://prompt.kenjiai.com", external: true },
      { name: "PR Pro", href: "https://prpro.kenjiai.com/", external: true },
      { name: "Sales Coach", href: "https://salescoach.kenjiai.com/", external: true }
    ],
    support: [
      { name: "Help Center", href: "https://support.kenjiai.com/", external: true },
      { name: "Community", href: "https://startlearning.kenjiai.com/", external: true },
      { name: "Status", href: "https://support.kenjiai.com/", external: true },
      { name: "Contact Support", href: "https://support.kenjiai.com/", external: true }
    ],
    education: [
      { name: "Educational Hub", href: "https://startlearning.kenjiai.com/", external: true },
      { name: "AI Courses", href: "https://startlearning.kenjiai.com/", external: true },
      { name: "Become a Partner", href: "https://closers.kenjiai.com/", external: true },
      { name: "Tax Strategies", href: "https://startlearning.kenjiai.com/", external: true }
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

              {/* Contact Info */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                  <a href="mailto:care@kenjiai.com" className="hover:text-blue-400 transition-colors">
                    care@kenjiai.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                  <div className="flex flex-col">
                    <a href="tel:+18286772148" className="hover:text-blue-400 transition-colors font-medium">
                      (828) 677-2148
                    </a>
                    <span className="text-xs text-gray-500">Speak directly with Kenji</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                  <span>San Francisco, CA</span>
                </div>
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
                <h4 id="footer-solutions" className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Solutions</h4>
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
                <h4 id="footer-tools" className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Tools</h4>
                <ul className="space-y-2 sm:space-y-3" role="list">
                  {links.tools.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
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

              {/* Education Links */}
              <div role="navigation" aria-labelledby="footer-education">
                <h4 id="footer-education" className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Education</h4>
                <ul className="space-y-2 sm:space-y-3" role="list">
                  {links.education.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
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

              {/* Company Links */}
              <div role="navigation" aria-labelledby="footer-company">
                <h4 id="footer-company" className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
                <ul className="space-y-2 sm:space-y-3" role="list">
                  {links.company.map((link) => (
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

              {/* Support Links */}
              <div role="navigation" aria-labelledby="footer-support">
                <h4 id="footer-support" className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
                <ul className="space-y-2 sm:space-y-3" role="list">
                  {links.support.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
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
                <h4 id="footer-legal" className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
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
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 py-6 sm:py-8"
          role="contentinfo"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Urgent Coupon Code Section */}
            <div className="w-full bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 border border-red-500/50 rounded-xl p-4 sm:p-6 mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 animate-pulse"></div>
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col items-center sm:items-start gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-red-400 animate-pulse" />
                    <span className="text-red-400 font-bold text-sm sm:text-base uppercase tracking-wider">Limited Time Offer!</span>
                  </div>
                  <p className="text-gray-200 text-xs sm:text-sm text-center sm:text-left">
                    Get started today - Use coupon code for exclusive savings
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-yellow-400 rounded-lg px-6 py-3">
                    <Tag className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-bold text-lg sm:text-xl tracking-wider">KENJ4LFE</span>
                  </div>
                  <span className="text-yellow-400 text-xs font-semibold animate-pulse">Offer expires soon!</span>
                </div>
                <Link
                  to="/pricing"
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Claim Now
                </Link>
              </div>
            </div>

            {/* Quick Access */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400 mb-4">
              <Link to="/free-tools" className="flex items-center gap-2 hover:text-green-400 transition-colors font-medium">
                <Gift className="w-4 h-4" />
                Free Tools
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 w-full">
              <p className="text-gray-400 text-xs sm:text-sm">
                © {new Date().getFullYear()} KenjiAI. All Rights Reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
                <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
                <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
                <Link to="/disclaimer" className="hover:text-blue-400 transition-colors">Disclaimer</Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;