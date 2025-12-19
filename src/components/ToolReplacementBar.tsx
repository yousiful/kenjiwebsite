import React from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

const tools = [
  'ClickFunnels',
  'Kajabi',
  'Calendly',
  'HubSpot',
  'Mailchimp',
  'ActiveCampaign',
  'GoHighLevel',
  'Salesforce',
  'Zapier',
  'Memberful',
  'Teachable',
  'ConvertKit',
  'Intercom',
  'Drift',
  'Acuity',
  'Thinkific',
  'Kartra',
  'ClickFunnels',
  'Kajabi',
  'Calendly',
];

export function ToolReplacementBar() {
  return (
    <div className="py-16 overflow-hidden relative" style={{backgroundColor: '#0B0E14'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span style={{
              background: 'linear-gradient(90deg, #E9338E 0%, #4B52FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Replace 17+ Tools With One Platform
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Stop paying for a dozen different subscriptions. KenjiAI consolidates everything into one powerful growth engine.
          </p>
        </motion.div>
      </div>

      {/* Scrolling Tools Bar */}
      <div className="relative py-8">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0B0E14] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0B0E14] to-transparent z-10"></div>

        {/* Scrolling container */}
        <div className="flex gap-4 animate-scroll">
          {tools.map((tool, index) => (
            <motion.div
              key={`${tool}-${index}`}
              className="group flex-shrink-0 relative"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative bg-gray-800/60 backdrop-blur-sm border border-red-500/40 rounded-xl px-6 py-4 flex items-center gap-3 overflow-hidden">
                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
                </div>

                <X className="w-5 h-5 text-red-400 flex-shrink-0 relative z-10" />
                <span className="text-gray-300 font-medium whitespace-nowrap relative z-10">
                  {tool}
                </span>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Replacement Arrow and Result */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="max-w-4xl mx-auto px-4 mt-12"
      >
        <div className="flex flex-col items-center gap-6">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight className="w-12 h-12 text-green-400 rotate-90" />
          </motion.div>

          <motion.div
            className="relative group w-full"
            whileHover={{ scale: 1.02 }}
          >
            <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 backdrop-blur-sm border border-green-400/50 rounded-2xl p-8 text-center overflow-hidden">
              {/* Animated shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-shine-slow"></div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl"></div>

              <div className="relative z-10">
                <h3 className="text-3xl sm:text-4xl font-bold mb-2" style={{
                  background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  One KenjiAI Platform
                </h3>
                <p className="text-lg text-gray-300 mb-4">
                  All-in-one growth engine that does everything better
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-4 py-2 bg-green-500/20 border border-green-400/40 rounded-full text-green-400 text-sm font-semibold">
                    Save $2,000+/month
                  </span>
                  <span className="px-4 py-2 bg-blue-500/20 border border-blue-400/40 rounded-full text-blue-400 text-sm font-semibold">
                    10X More Powerful
                  </span>
                  <span className="px-4 py-2 bg-purple-500/20 border border-purple-400/40 rounded-full text-purple-400 text-sm font-semibold">
                    Done-For-You Setup
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }

        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }

        @keyframes shine-slow {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }

        .animate-shine-slow {
          animation: shine-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
