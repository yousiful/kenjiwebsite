import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, X } from 'lucide-react';

const QuickContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Contact Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.4 }}
        className="fixed bottom-6 right-6 z-[9998]"
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl flex items-center justify-center relative group"
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)'
          }}
        >
          {isOpen ? (
            <X className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          )}

          {/* Pulse Animation */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
          )}
        </motion.button>
      </motion.div>

      {/* Contact Options Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[9998] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
            style={{ width: '280px' }}
          >
            <div className="p-4 bg-gradient-to-r from-green-600 to-emerald-600">
              <h3 className="text-white font-bold text-lg mb-1">Get Instant Help</h3>
              <p className="text-green-100 text-sm">Choose your preferred way to connect</p>
            </div>

            <div className="p-3 space-y-2">
              {/* Book a Call */}
              <a
                href="https://go.mediatraffics.com/leads"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">Book a Call</div>
                  <div className="text-gray-400 text-xs">Free 30-min strategy call</div>
                </div>
              </a>

              {/* Call Us */}
              <a
                href="tel:+18286772148"
                className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">Call Now</div>
                  <div className="text-gray-400 text-xs">(828) 677-2148</div>
                </div>
              </a>
            </div>

            <div className="px-4 py-3 bg-gray-800/50 border-t border-gray-700">
              <p className="text-gray-400 text-xs text-center">
                Available Monday to Friday, 9 AM to 6 PM EST
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickContact;
