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
      className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-2 border-green-500/50 rounded-3xl p-8 shadow-2xl"
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex-shrink-0"
        >
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-3xl shadow-lg">
            <Shield className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-3xl font-bold text-white mb-3">
            100% Money-Back Guarantee
          </h3>
          <p className="text-gray-300 text-lg mb-4">
            Not happy with your results in the first 30 days? We'll refund every penny.
            No questions asked. That's how confident we are in our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 text-green-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">30-Day Risk-Free Trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Full Refund Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Keep All Bonuses</span>
            </div>
          </div>
        </div>

        <motion.a
          href="/pricing"
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 shadow-xl"
        >
          <span>Try Risk-Free</span>
          <ArrowRight className="w-5 h-5" />
        </motion.a>
      </div>
    </motion.div>
  );
}
