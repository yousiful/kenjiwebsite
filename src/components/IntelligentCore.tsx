import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, MessageCircle, TrendingUp, Users, Eye, Lightbulb } from 'lucide-react';

const IntelligentCore: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [aiInsights, setAiInsights] = useState(0);

  const intelligentFeatures = [
    {
      icon: Brain,
      title: "Proactive Personalization",
      description: "AI learns from every interaction to anticipate your needs before you know them",
      capability: "Predicts user actions with 94% accuracy",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Forecast market trends, customer behavior, and business opportunities",
      capability: "Identifies opportunities 6 months ahead",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Zap,
      title: "Intelligent Automation",
      description: "AI automates complex workflows while learning to optimize continuously",
      capability: "Reduces manual work by 87%",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: MessageCircle,
      title: "Natural Language AI",
      description: "Conversational AI that understands context, emotion, and business intent",
      capability: "Human-like conversations at scale",
      color: "from-orange-500 to-red-600"
    }
  ];

  const aiInsightData = [
    "Identified 23% increase in conversion potential for Q2",
    "Predicted customer churn risk for 47 accounts",
    "Optimized campaign timing for 156% better engagement",
    "Discovered new market segment worth $2.3M opportunity",
    "Automated 89% of routine customer service inquiries",
    "Personalized content for 10,000+ individual users"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % intelligentFeatures.length);
      setAiInsights((prev) => (prev + 1) % aiInsightData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [intelligentFeatures.length, aiInsightData.length]);

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative overflow-hidden">
      {/* Neural Network Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-400/10"></div>
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/60 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
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
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              The Intelligent Core
            </span>
            <br />
            <span className="text-white">Your AI Brain</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            True artificial intelligence that learns, predicts, and evolves with your business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* AI Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {intelligentFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                whileHover={{ scale: 1.02, x: 10 }}
                className={`p-6 rounded-2xl transition-all duration-500 cursor-pointer ${
                  index === activeFeature
                    ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-400/50'
                    : 'bg-gray-800/50 border border-gray-700 hover:border-purple-400/30'
                }`}
                onClick={() => setActiveFeature(index)}
                data-caption={`${feature.title}: ${feature.capability}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 mb-3">{feature.description}</p>
                    <div className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg text-sm font-semibold inline-block">
                      {feature.capability}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Live AI Insights */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <Eye className="w-8 h-8 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">Live AI Insights</h3>
            </div>

            <div className="space-y-4 h-80 overflow-hidden">
              {aiInsightData.map((insight, index) => (
                <motion.div
                  key={`${insight}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: index === aiInsights ? 1 : 0.3,
                    y: index === aiInsights ? 0 : 10,
                    scale: index === aiInsights ? 1 : 0.95
                  }}
                  transition={{ duration: 0.5 }}
                  className={`p-4 rounded-xl transition-all duration-500 ${
                    index === aiInsights
                      ? 'bg-gradient-to-r from-purple-600/20 to-blue-400/20 border border-purple-400/30'
                      : 'bg-gray-700/30'
                  }`}
                  data-caption="Real-time AI intelligence at work"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === aiInsights ? 'bg-purple-400 animate-pulse' : 'bg-gray-500'
                    }`}></div>
                    <Lightbulb className={`w-4 h-4 ${
                      index === aiInsights ? 'text-purple-400' : 'text-gray-500'
                    }`} />
                    <span className="text-gray-300 text-sm flex-1">{insight}</span>
                    {index === aiInsights && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-purple-400 text-xs font-semibold"
                      >
                        NEW
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-xl px-4 py-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-semibold">AI Learning & Optimizing</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Intelligence Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { icon: Brain, label: "AI Decisions/Day", value: "2.3M", color: "text-purple-400" },
            { icon: Target, label: "Prediction Accuracy", value: "94.7%", color: "text-blue-400" },
            { icon: Zap, label: "Process Optimization", value: "87%", color: "text-green-400" },
            { icon: Users, label: "Personalized Experiences", value: "50K+", color: "text-pink-400" }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 hover:border-purple-400/50 rounded-2xl p-6 text-center transition-all duration-300"
              data-caption={`${metric.label}: Powered by advanced AI algorithms`}
            >
              <metric.icon className={`w-8 h-8 ${metric.color} mx-auto mb-4`} />
              <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
              <div className="text-gray-400 text-sm">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default IntelligentCore;