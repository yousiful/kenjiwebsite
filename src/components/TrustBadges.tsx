import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Star, Award, Users, Headset } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    {
      icon: <Lock className="w-5 h-5" />,
      text: "Secure Checkout",
      subtext: "Payments processed by Stripe"
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      text: "30-Day Guarantee",
      subtext: "Full refund, no hoops"
    },
    {
      icon: <Star className="w-5 h-5" />,
      text: "Verified Client Reviews",
      subtext: "Real reviews, not stock quotes"
    },
    {
      icon: <Award className="w-5 h-5" />,
      text: "Founder-Led",
      subtext: "13+ years in paid acquisition"
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "500+ Businesses Served",
      subtext: "$3.35M+ client revenue generated"
    },
    {
      icon: <Headset className="w-5 h-5" />,
      text: "Real Human Support",
      subtext: "Not chatbots"
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
            Why Business Owners Trust KenjiAI
          </h3>
          <p className="text-gray-400">
            No fine print, no fake certifications, just what's actually true
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
      </div>
    </section>
  );
}
