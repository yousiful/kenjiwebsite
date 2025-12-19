import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Award, CheckCircle, Zap, Clock } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Bank-Level Security",
      subtext: "256-bit encryption"
    },
    {
      icon: <Lock className="w-5 h-5" />,
      text: "GDPR Compliant",
      subtext: "Your data protected"
    },
    {
      icon: <Award className="w-5 h-5" />,
      text: "SOC 2 Certified",
      subtext: "Enterprise standard"
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: "99.97% Uptime",
      subtext: "Always available"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      text: "Instant Setup",
      subtext: "Live in 5 minutes"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      text: "24/7 Support",
      subtext: "Expert assistance"
    }
  ];

  return (
    <section className="py-6 bg-gray-900/50 border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-2">
            Trusted by Industry Leaders
          </h3>
          <p className="text-gray-400">
            Enterprise-grade security and reliability you can count on
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 rounded-xl p-4 text-center transition-all duration-300"
            >
              <div className="flex justify-center mb-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg text-white">
                  {badge.icon}
                </div>
              </div>
              <div className="text-white font-semibold text-sm mb-1">{badge.text}</div>
              <div className="text-gray-400 text-xs">{badge.subtext}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 flex flex-wrap justify-center gap-6 text-gray-400 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>PCI DSS Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>ISO 27001 Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>HIPAA Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            <span>Privacy Shield Certified</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
