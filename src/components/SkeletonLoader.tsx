import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{backgroundColor: '#0B0E14'}}>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(2px 2px at 20px 30px, #ffffff, transparent)',
          backgroundSize: '200px 200px'
        }}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="space-y-8"
          >
            <div className="h-8 bg-gray-800 rounded-full w-64 mx-auto" />

            <div className="h-24 bg-gray-800 rounded-2xl w-full max-w-4xl mx-auto" />

            <div className="h-16 bg-gray-800 rounded-xl w-3/4 mx-auto" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-800 rounded-xl" />
              ))}
            </div>

            <div className="h-16 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-2xl w-80 mx-auto" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{backgroundColor: '#0B0E14'}}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="space-y-6"
        >
          <div className="h-6 bg-gray-800/60 rounded-full w-48 mx-auto" />
          <div className="h-32 bg-gray-800/60 rounded-2xl w-full max-w-4xl mx-auto" />
          <div className="h-12 bg-gray-800/60 rounded-xl w-3/4 mx-auto" />
          <div className="h-20 bg-gray-800/60 rounded-2xl w-96 mx-auto" />
        </motion.div>
      </div>
    </div>
  );
};
