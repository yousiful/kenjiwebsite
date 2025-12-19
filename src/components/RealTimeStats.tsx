import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Zap } from 'lucide-react';

export function RealTimeStats() {
  const [activeUsers, setActiveUsers] = useState(50247);
  const [revenue, setRevenue] = useState(18429);
  const [automation, setAutomation] = useState(127384);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3));
      setRevenue(prev => prev + Math.floor(Math.random() * 100));
      setAutomation(prev => prev + Math.floor(Math.random() * 10));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      label: "Active Users",
      value: activeUsers.toLocaleString(),
      color: "from-blue-500 to-cyan-500",
      growth: "+12% this week"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      label: "Revenue Generated Today",
      value: `$${revenue.toLocaleString()}K`,
      color: "from-green-500 to-emerald-500",
      growth: "+425% avg ROI"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      label: "Tasks Automated Today",
      value: automation.toLocaleString(),
      color: "from-purple-500 to-pink-500",
      growth: "+85% efficiency"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: "Customer Satisfaction",
      value: "4.9/5",
      color: "from-amber-500 to-orange-500",
      growth: "50,000+ reviews"
    }
  ];

  return (
    <section className="py-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/50 rounded-full px-4 py-2 mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-semibold">Live Statistics</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Real-Time Platform Performance
          </h2>
          <p className="text-gray-400 text-lg">
            Watch our community grow and thrive in real-time
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl inline-block mb-4 text-white`}>
                  {stat.icon}
                </div>

                <motion.div
                  key={stat.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-4xl font-bold text-white mb-2"
                >
                  {stat.value}
                </motion.div>

                <div className="text-gray-400 text-sm mb-2">{stat.label}</div>

                <div className={`text-xs bg-gradient-to-r ${stat.color} bg-clip-text text-transparent font-semibold`}>
                  {stat.growth}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 text-sm">
            Numbers update every few seconds. Join thousands of successful entrepreneurs.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
