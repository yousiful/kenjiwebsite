import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight, Shield, Star, Headphones as HeadphonesIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {

  const navLinks = {
    company: [
      { name: 'Pricing', href: '/pricing' },
      { name: 'Free Tools', href: '/free-tools' },
      { name: 'Funding & Credit', href: '/funding' },
      { name: 'Knowledge Base', href: '/knowledge' },
      { name: 'Become a Partner', href: 'https://closers.kenjiai.com/', external: true },
    ],
    legal: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ],
  };

  return (
    <footer className="bg-gray-950 border-t border-gray-800 relative overflow-hidden" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl" />
      </div>

      {/* CTA Banner */}
      <div className="relative z-10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex flex-col lg:flex-row items-center justify-between gap-8"
          >
            <div className="text-center lg:text-left max-w-xl">
              <p className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-2">
                Ready to get started?
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
                See what KenjiAI can do.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                  Get started in minutes.
                </span>
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Join 2,400+ businesses using KenjiAI to handle calls, manage leads, and close more deals.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                to="/pricing"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #10B981)',
                  boxShadow: '0 0 20px rgba(59,130,246,0.35)',
                }}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://safeclick.kenjiai.com/widget/booking/jB82SG2CBq9Nh8103IfC"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-gray-200 border border-gray-700 hover:border-blue-500 hover:text-blue-400 transition-all duration-300 bg-gray-900/50"
              >
                <HeadphonesIcon className="w-4 h-4" />
                Book a Free Call
              </a>
            </div>
          </motion.div>
        </div>
      </div>


      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12">

          {/* Nav Links */}
          <motion.nav
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="lg:col-span-12 grid grid-cols-2 sm:grid-cols-3 gap-8"
            aria-label="Footer Navigation"
          >
            {/* Company */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">Company</h4>
              <ul className="space-y-2.5">
                {navLinks.company.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-400 text-sm transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link to={link.href} className="text-gray-500 hover:text-blue-400 text-sm transition-colors duration-200">
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">Legal</h4>
              <ul className="space-y-2.5">
                {navLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-gray-500 hover:text-blue-400 text-sm transition-colors duration-200">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compliance & Contact */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">Contact & Address</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-gray-500 text-xs leading-relaxed">
                    32 N Gould St<br />
                    Sheridan, WY 82801
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <a href="mailto:support@kenjiai.com" className="text-gray-500 hover:text-blue-400 text-xs transition-colors">
                    support@kenjiai.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <a href="tel:+18312634402" className="text-gray-500 hover:text-blue-400 text-xs transition-colors">
                    (831) 263-4402
                  </a>
                </li>
              </ul>
            </div>
          </motion.nav>
        </div>
      </div>

      {/* Guarantee Bar */}
      <div className="relative z-10 border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4 text-blue-400 shrink-0" />
              <span><span className="text-white font-semibold">Your data is always secure</span> • 256-bit encryption</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-700" />
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Star className="w-4 h-4 text-yellow-400 shrink-0" />
              <span><span className="text-white font-semibold">4.9-star rated</span> across 500+ reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-600 text-xs">
              © {new Date().getFullYear()} KenjiAI. All Rights Reserved.
            </p>
            <div className="flex items-center gap-5 text-xs text-gray-600">
              <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy</Link>
              <Link to="/disclaimer" className="hover:text-blue-400 transition-colors">Disclaimer</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
