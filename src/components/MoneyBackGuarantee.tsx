import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, CheckCircle } from 'lucide-react';

export function MoneyBackGuarantee() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-4 border-green-500/60 rounded-3xl p-10 shadow-2xl relative overflow-hidden"
      style={{ boxShadow: '0 0 60px rgba(16, 185, 129, 0.4)' }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/20 to-green-500/10 animate-pulse"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex-shrink-0"
        >
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-3xl shadow-2xl">
            <Shield className="w-24 h-24 text-white" />
          </div>
        </motion.div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-4xl md:text-5xl font-black text-white mb-4">
            100% Money-Back Guarantee
          </h3>
          <p className="text-gray-200 text-xl mb-6 leading-relaxed">
            Not happy with your results in the first 30 days? We'll refund every penny.
            No questions asked. That's how confident we are in our platform.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-green-300">
            <div className="flex items-center justify-center md:justify-start gap-3 bg-green-500/10 backdrop-blur-sm rounded-xl p-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-bold text-base">30-Day Risk-Free</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3 bg-green-500/10 backdrop-blur-sm rounded-xl p-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-bold text-base">Full Refund</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3 bg-green-500/10 backdrop-blur-sm rounded-xl p-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-bold text-base">Keep All Bonuses</span>
            </div>
          </div>
        </div>

        <motion.a
          href="#pricing-cards"
          whileHover={{ scale: 1.08, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-3 shadow-2xl hover:shadow-green-500/50 transition-all duration-300"
        >
          <span>Try Risk-Free</span>
          <ArrowRight className="w-6 h-6" />
        </motion.a>
      </div>
    </motion.div>
  );
}
