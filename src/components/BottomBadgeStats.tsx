import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Star, Zap, Users } from 'lucide-react';

interface BadgeStat {
  icon: typeof Gift;
  label: string;
  count: string;
  color: string;
  bgColor: string;
}

const badgeStats: BadgeStat[] = [
  {
    icon: Gift,
    label: 'Free Tools',
    count: '6+',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20'
  },
  {
    icon: Star,
    label: 'Popular Features',
    count: '12+',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20'
  },
  {
    icon: Zap,
    label: 'Automations',
    count: '50+',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20'
  },
  {
    icon: Users,
    label: 'Active Users',
    count: '10K+',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20'
  }
];

export function BottomBadgeStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {badgeStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6 text-center transition-all duration-300 group-hover:border-gray-600 group-hover:shadow-lg">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
                  className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 ${stat.bgColor} rounded-full mb-3`}
                >
                  <stat.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color}`} />
                </motion.div>

                <div className={`text-2xl sm:text-3xl font-bold ${stat.color} mb-1`}>
                  {stat.count}
                </div>

                <div className="text-xs sm:text-sm text-gray-400 font-medium">
                  {stat.label}
                </div>

                <motion.div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at center, ${stat.bgColor.replace('/20', '/10')} 0%, transparent 70%)`
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-400 text-sm">
            Join thousands of businesses using KenjiAI to automate and scale
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
