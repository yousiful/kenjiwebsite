import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, BarChart3, Users, MessageCircle, Zap, TrendingUp } from 'lucide-react';

const LiveBusinessDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMetric, setCurrentMetric] = useState(0);

  const businessMetrics = [
    { icon: Users, label: "Active Leads", value: 1247, growth: "+23%" },
    { icon: MessageCircle, label: "AI Conversations", value: 3891, growth: "+156%" },
    { icon: TrendingUp, label: "Conversion Rate", value: "34.2%", growth: "+89%" },
    { icon: BarChart3, label: "Revenue Today", value: "$47,293", growth: "+201%" }
  ];

  const liveActivities = [
    "AI Voice Agent closed $12,400 deal with TechCorp",
    "Smart Campaign generated 47 new qualified leads",
    "Chatbot resolved 23 customer inquiries automatically",
    "Review Agent collected 8 five-star reviews",
    "Content AI published 3 SEO-optimized blog posts",
    "CRM automatically moved 15 prospects to 'Hot Leads'"
  ];

  const [currentActivity, setCurrentActivity] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentActivity((prev) => (prev + 1) % liveActivities.length);
        setCurrentMetric((prev) => (prev + 1) % businessMetrics.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, liveActivities.length, businessMetrics.length]);

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-green-400/5"></div>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              y: [null, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Watch Your Business
            </span>
            <br />
            <span className="text-white">Come Alive in Real-Time</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See how KenjiAI transforms businesses into living, breathing, profit-generating machines
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Live Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Live Business Activity</h3>
              <motion.button
                onClick={() => setIsPlaying(!isPlaying)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gradient-to-r from-blue-600 to-green-500 w-12 h-12 rounded-full flex items-center justify-center text-white"
                data-caption={isPlaying ? "Pause live demo" : "Start live demo"}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </motion.button>
            </div>

            <div className="space-y-4 h-64 overflow-hidden">
              <AnimatePresence mode="wait">
                {liveActivities.map((activity, index) => (
                  <motion.div
                    key={`${activity}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: index === currentActivity ? 1 : 0.3,
                      y: index === currentActivity ? 0 : 10,
                      scale: index === currentActivity ? 1 : 0.95
                    }}
                    transition={{ duration: 0.5 }}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                      index === currentActivity 
                        ? 'bg-gradient-to-r from-blue-600/20 to-green-400/20 border border-blue-400/30' 
                        : 'bg-gray-700/30'
                    }`}
                    data-caption="Real-time AI automation in action"
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      index === currentActivity ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-gray-300 text-sm">{activity}</span>
                    {index === currentActivity && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-green-400 text-xs font-semibold"
                      >
                        LIVE
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Live Metrics Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-8">Real-Time Performance</h3>
            
            <div className="grid grid-cols-2 gap-6">
              {businessMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`p-6 rounded-2xl transition-all duration-500 ${
                    index === currentMetric 
                      ? 'bg-gradient-to-br from-blue-600/30 to-green-400/30 border border-blue-400/50' 
                      : 'bg-gray-700/30 border border-gray-600'
                  }`}
                  data-caption={`${metric.label}: Growing ${metric.growth} with AI automation`}
                >
                  <metric.icon className={`w-8 h-8 mb-4 ${
                    index === currentMetric ? 'text-blue-400' : 'text-gray-400'
                  }`} />
                  <div className={`text-2xl font-bold mb-2 ${
                    index === currentMetric ? 'text-white' : 'text-gray-300'
                  }`}>
                    {metric.value}
                  </div>
                  <div className="text-gray-400 text-sm mb-2">{metric.label}</div>
                  <div className="text-green-400 text-sm font-semibold">{metric.growth}</div>
                </motion.div>
              ))}
            </div>

            {/* Pulse Animation */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl px-4 py-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-semibold">Business Operating at Peak Performance</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <motion.a
            href="https://buy.stripe.com/7sIeWJ1Y93AEdDy6oo"
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-green-500 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl"
            data-caption="Start your business transformation today"
          >
            <Zap className="w-6 h-6" />
            Bring Your Business to Life
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveBusinessDemo;