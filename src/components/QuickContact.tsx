import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, X } from 'lucide-react';

const QuickContact: React.FC = () => {
  const [step, setStep] = useState<'menu' | 'q1' | 'q2' | 'unqualified' | 'qualified'>('menu');
  const [revenue, setRevenue] = useState<string>('');
  const [volume, setVolume] = useState<string>('');

  const handleClose = () => {
    setIsOpen(false);
    setStep('menu');
  };

  const handleSelectRevenue = (rev: string) => {
    setRevenue(rev);
    if (rev === 'under_15k') {
      setStep('unqualified');
    } else {
      setStep('q2');
    }
  };

  const handleSelectVolume = (vol: string) => {
    setVolume(vol);
    if (vol === 'under_25') {
      setStep('unqualified');
    } else {
      setStep('qualified');
    }
  };

  return (
    <>
      {/* Floating Contact Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.4 }}
        className="fixed bottom-6 right-6 z-[9998]"
      >
        <motion.button
          onClick={() => {
            if (isOpen) handleClose();
            else setIsOpen(true);
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl flex items-center justify-center relative group"
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)'
          }}
          aria-label="Contact and Qualify"
        >
          {isOpen ? (
            <X className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          )}
        </motion.button>
      </motion.div>

      {/* Contact & Qualification Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[9998] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden w-[310px] sm:w-[340px]"
          >
            {step === 'menu' && (
              <>
                <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                  <h3 className="text-white font-bold text-base mb-0.5">Connect With KenjiAI</h3>
                  <p className="text-blue-100 text-xs">AI Call Centers & Inbound Client Acquisition</p>
                </div>

                <div className="p-3.5 space-y-2.5">
                  <button
                    onClick={() => setStep('q1')}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-sm">Apply For DFY Call Center</div>
                      <div className="text-gray-400 text-xs">30-second qualification</div>
                    </div>
                  </button>

                  <a
                    href="tel:+12133440705"
                    className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-full bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-sm">Call Our Team</div>
                      <div className="text-gray-400 text-xs">(213) 344-0705</div>
                    </div>
                  </a>
                </div>

                <div className="px-4 py-2.5 bg-gray-800/50 border-t border-gray-700">
                  <p className="text-gray-400 text-[11px] text-center">
                    Mon - Fri • 9 AM - 6 PM EST
                  </p>
                </div>
              </>
            )}

            {step === 'q1' && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 tracking-wide uppercase">Question 1 of 2</span>
                  <button onClick={() => setStep('menu')} className="text-xs text-gray-500 hover:text-gray-300">Back</button>
                </div>
                <h4 className="text-white font-semibold text-sm leading-snug">
                  What is your business's current average monthly revenue?
                </h4>
                <div className="space-y-1.5 pt-1">
                  {[
                    { id: 'under_15k', label: 'Under $15,000 / month' },
                    { id: '15k_50k', label: '$15,000 – $50,000 / month' },
                    { id: '50k_150k', label: '$50,000 – $150,000 / month' },
                    { id: 'over_150k', label: '$150,000+ / month' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectRevenue(opt.id)}
                      className="w-full text-left px-3 py-2 rounded-lg bg-gray-800 hover:bg-blue-600/30 border border-gray-700 hover:border-blue-500 text-xs text-gray-200 transition-colors"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'q2' && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 tracking-wide uppercase">Question 2 of 2</span>
                  <button onClick={() => setStep('q1')} className="text-xs text-gray-500 hover:text-gray-300">Back</button>
                </div>
                <h4 className="text-white font-semibold text-sm leading-snug">
                  How many inbound calls or leads do you receive each month?
                </h4>
                <div className="space-y-1.5 pt-1">
                  {[
                    { id: 'under_25', label: 'Under 25 calls / month' },
                    { id: '25_100', label: '25 – 100 calls / month' },
                    { id: '100_500', label: '100 – 500 calls / month' },
                    { id: 'over_500', label: '500+ calls / month' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectVolume(opt.id)}
                      className="w-full text-left px-3 py-2 rounded-lg bg-gray-800 hover:bg-blue-600/30 border border-gray-700 hover:border-blue-500 text-xs text-gray-200 transition-colors"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'unqualified' && (
              <div className="p-5 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto text-lg">
                  💡
                </div>
                <h4 className="text-white font-bold text-sm">Recommended Next Step</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Our Done-For-You AI Call Centers are engineered for companies with established call volume. You can access our free AI growth tools right now!
                </p>
                <div className="pt-2 space-y-2">
                  <a
                    href="/free-tools"
                    className="block w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
                  >
                    Access Free AI Tools
                  </a>
                  <button
                    onClick={() => setStep('menu')}
                    className="text-xs text-gray-500 hover:text-gray-300 underline"
                  >
                    Back to Contact
                  </button>
                </div>
              </div>
            )}

            {step === 'qualified' && (
              <div className="p-5 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto text-lg">
                  🎯
                </div>
                <h4 className="text-white font-bold text-sm">You Qualify for a VIP Call</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Your volume and scale qualify for a custom Done-For-You AI Call Center and inbound acquisition audit.
                </p>
                <div className="pt-2 space-y-2">
                  <a
                    href="https://go.mediatraffics.com/leads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-emerald-600/30"
                  >
                    Select VIP Call Time →
                  </a>
                  <button
                    onClick={() => setStep('menu')}
                    className="text-xs text-gray-500 hover:text-gray-300 underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickContact;
