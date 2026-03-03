import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Phone, MapPin, Twitter, Linkedin, Youtube, ArrowRight, Shield, Star, Users, Clock, CheckCircle, Gift, Headphones as HeadphonesIcon, Lock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  const navLinks = {
    company: [
      { name: 'Pricing', href: '/pricing' },
      { name: 'Free Tools', href: '/free-tools' },
      { name: 'Knowledge Base', href: '/knowledge' },
      { name: 'Investors', href: '/investors' },
      { name: 'Become a Partner', href: 'https://closers.kenjiai.com/', external: true },
    ],
    legal: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  ];

  const trustBadges = [
    { icon: Shield, label: '256-bit SSL' },
    { icon: Lock, label: 'GDPR Compliant' },
    { icon: Award, label: '30-Day Guarantee' },
    { icon: CheckCircle, label: 'SOC 2 Ready' },
  ];

  const socialProof = [
    { icon: Star, value: '4.9/5', label: 'Avg. Rating', color: '#FBBF24' },
    { icon: Users, value: '2,400+', label: 'Active Clients', color: '#34D399' },
    { icon: Clock, value: '99.9%', label: 'Uptime SLA', color: '#60A5FA' },
    { icon: Zap, value: '$2.1M+', label: 'Revenue Generated', color: '#F97316' },
  ];

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

      {/* Social Proof Strip */}
      <div className="relative z-10 border-b border-gray-800 bg-gray-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {socialProof.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${stat.color}18`, border: `1px solid ${stat.color}30` }}
                >
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-none">{stat.value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12">

          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-4"
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-9 h-9 rounded-full"
                aria-label="KenjiAI Logo"
                style={{
                  backgroundImage: `url('https://assets.cdn.filesafe.space/q5L4ttbBMHNxieXIcTVJ/media/5adccaae-527e-49d4-befc-6410b918c624.gif')`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  filter: 'drop-shadow(0 0 10px rgba(59,130,246,0.35))',
                  mixBlendMode: 'screen',
                }}
              />
              <span className="text-xl font-bold text-white tracking-tight">KenjiAI</span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
              AI tools that actually help you make money. We handle the tech so you can focus on growing your business.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-400 flex items-center justify-center transition-all duration-300 group border border-gray-700 hover:border-transparent"
                >
                  <s.icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Nav Links */}
          <motion.nav
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8"
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

            {/* Trust Badges */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">Security</h4>
              <div className="space-y-2">
                {trustBadges.map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2">
                    <badge.icon className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    <span className="text-gray-500 text-xs">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.nav>
        </div>
      </div>

      {/* Guarantee Bar */}
      <div className="relative z-10 border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Award className="w-4 h-4 text-yellow-400 shrink-0" />
              <span><span className="text-white font-semibold">30-Day Money-Back Guarantee</span> — No questions asked</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-700" />
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4 text-blue-400 shrink-0" />
              <span><span className="text-white font-semibold">Your data is always secure</span> — 256-bit encryption</span>
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
