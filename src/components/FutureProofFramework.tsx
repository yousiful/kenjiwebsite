import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Globe, Code, Database, Cloud, Zap, Shield, Infinity } from 'lucide-react';

const FutureProofFramework: React.FC = () => {
  const [activeArchitecture, setActiveArchitecture] = useState(0);
  const [scalingMetrics, setScalingMetrics] = useState({
    requests: 2847293,
    regions: 15,
    uptime: 99.97
  });

  const architectureFeatures = [
    {
      icon: Cloud,
      title: "Serverless Architecture",
      description: "Auto-scaling infrastructure that grows with your business—pay only for what you use",
      capability: "Infinite scalability",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Globe,
      title: "Global Edge Network",
      description: "Lightning-fast performance worldwide with 50+ edge locations",
      capability: "< 50ms response time globally",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Code,
      title: "API-First Design",
      description: "Every feature accessible via secure APIs for seamless integrations",
      capability: "1000+ integration possibilities",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Database,
      title: "Data Portability",
      description: "Your data, your control—export anytime, anywhere, in any format",
      capability: "Complete data ownership",
      color: "from-orange-500 to-red-600"
    }
  ];

  const scalingCapabilities = [
    { metric: "Concurrent Users", current: "50K", max: "10M+", icon: Globe },
    { metric: "API Requests/sec", current: "100K", max: "1M+", icon: Zap },
    { metric: "Data Processing", current: "1TB/day", max: "100TB/day", icon: Database },
    { metric: "Global Regions", current: "15", max: "50+", icon: Cloud }
  ];

  const futureFeatures = [
    {
      title: "Quantum AI Integration",
      description: "Next-generation quantum computing for unprecedented business insights",
      timeline: "2026",
      status: "Research"
    },
    {
      title: "Neural Business Networks",
      description: "AI that connects businesses for collaborative growth opportunities",
      timeline: "2025",
      status: "Development"
    },
    {
      title: "Predictive Market Modeling",
      description: "AI that predicts market changes 12 months in advance",
      timeline: "2025",
      status: "Beta"
    },
    {
      title: "Autonomous Business Operations",
      description: "Fully self-managing business systems that require zero human intervention",
      timeline: "2027",
      status: "Concept"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveArchitecture((prev) => (prev + 1) % architectureFeatures.length);
      setScalingMetrics(prev => ({
        requests: prev.requests + Math.floor(Math.random() * 1000),
        regions: prev.regions,
        uptime: Math.min(99.99, prev.uptime + Math.random() * 0.001)
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, [architectureFeatures.length]);

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 relative overflow-hidden">
      {/* Futuristic Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-400/5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Future-Proof Framework
            </span>
            <br />
            <span className="text-white">Built for Infinite Scale</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Architecture designed for the next decade—scalable, adaptable, and ready for whatever the future brings
          </p>
        </motion.div>

        {/* Real-time Scaling Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">Live Scaling Metrics</h3>
            <div className="flex items-center gap-2">
              <Infinity className="w-6 h-6 text-blue-400 animate-spin" />
              <span className="text-blue-400 font-semibold">Auto-Scaling Active</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {scalingCapabilities.map((capability, index) => (
              <motion.div
                key={capability.metric}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-700/30 border border-gray-600 hover:border-blue-400/50 rounded-2xl p-6 text-center transition-all duration-300"
                data-caption={`${capability.metric}: Currently handling ${capability.current}, can scale to ${capability.max}`}
              >
                <capability.icon className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-1">{capability.current}</div>
                <div className="text-gray-400 text-sm mb-2">{capability.metric}</div>
                <div className="text-blue-400 text-xs">Max: {capability.max}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Architecture Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {architectureFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`p-8 rounded-2xl transition-all duration-500 cursor-pointer ${
                index === activeArchitecture
                  ? 'bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-blue-400/50'
                  : 'bg-gray-800/50 border border-gray-700 hover:border-blue-400/30'
              }`}
              onClick={() => setActiveArchitecture(index)}
              data-caption={`${feature.title}: ${feature.capability}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">{feature.description}</p>
                  <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm font-semibold inline-block">
                    {feature.capability}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Future Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-br from-gray-800/50 to-purple-900/20 border border-gray-700 rounded-3xl p-8"
        >
          <div className="text-center mb-8">
            <Rocket className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-4">Future Roadmap</h3>
            <p className="text-gray-400">Pioneering the next generation of business automation technology</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {futureFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gray-700/30 border border-gray-600 hover:border-purple-400/50 rounded-2xl p-6 transition-all duration-300"
                data-caption={`${feature.title}: Coming ${feature.timeline}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-lg font-bold text-white">{feature.title}</h4>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-purple-400 text-sm font-semibold">{feature.timeline}</span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                      feature.status === 'Beta' ? 'bg-green-500/20 text-green-400' :
                      feature.status === 'Development' ? 'bg-blue-500/20 text-blue-400' :
                      feature.status === 'Research' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {feature.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-xl px-6 py-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">Future-Ready Architecture</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FutureProofFramework;