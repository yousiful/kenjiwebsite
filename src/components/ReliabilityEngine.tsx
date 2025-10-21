import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Activity, CheckCircle, AlertTriangle, Server, Globe, Lock } from 'lucide-react';

const ReliabilityEngine: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState('optimal');
  const [uptime, setUptime] = useState(99.97);

  const reliabilityFeatures = [
    {
      icon: Shield,
      title: "Fort-Knox Security",
      description: "Military-grade encryption and security protocols protect your business data",
      status: "Active",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      description: "24/7 system health monitoring with instant alerts and auto-healing",
      status: "Monitoring",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Server,
      title: "Global Redundancy",
      description: "Multi-region infrastructure ensures zero downtime and instant failover",
      status: "Distributed",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Zap,
      title: "Chaos Engineering",
      description: "Proactive failure testing makes our system antifragile and resilient",
      status: "Testing",
      color: "from-orange-500 to-red-600"
    }
  ];

  const systemMetrics = [
    { label: "Uptime", value: "99.97%", status: "excellent", icon: CheckCircle },
    { label: "Response Time", value: "< 50ms", status: "optimal", icon: Zap },
    { label: "Error Rate", value: "0.003%", status: "minimal", icon: Shield },
    { label: "Availability", value: "24/7/365", status: "guaranteed", icon: Globe }
  ];

  const securityLayers = [
    "256-bit AES Encryption",
    "Multi-Factor Authentication",
    "Zero-Trust Architecture",
    "SOC 2 Type II Compliance",
    "GDPR & CCPA Compliant",
    "Penetration Testing"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time uptime calculation
      setUptime(prev => Math.min(99.99, prev + Math.random() * 0.001));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900 relative overflow-hidden">
      {/* Security Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-blue-400/5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.15) 1px, transparent 0)`,
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
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Fort-Knox Reliability
            </span>
            <br />
            <span className="text-white">100% Functionality Guaranteed</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Built on enterprise-grade infrastructure with redundancy, monitoring, and security that never sleeps
          </p>
        </motion.div>

        {/* System Status Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">System Status</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold">All Systems Operational</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {systemMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-700/30 border border-gray-600 rounded-2xl p-6 text-center transition-all duration-300"
                data-caption={`${metric.label}: ${metric.status} performance level`}
              >
                <metric.icon className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-2">{metric.value}</div>
                <div className="text-gray-400 text-sm mb-2">{metric.label}</div>
                <div className="text-green-400 text-xs font-semibold uppercase">{metric.status}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reliability Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {reliabilityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gray-800/50 border border-gray-700 hover:border-green-400/50 rounded-2xl p-8 transition-all duration-300"
              data-caption={`${feature.title}: ${feature.description}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-xs font-semibold">
                      {feature.status}
                    </span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security Layers */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-br from-gray-800/50 to-green-900/20 border border-gray-700 rounded-3xl p-8"
        >
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-4">Multi-Layer Security</h3>
            <p className="text-gray-400">Your data is protected by multiple layers of enterprise-grade security</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {securityLayers.map((layer, index) => (
              <motion.div
                key={layer}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-700/30 border border-gray-600 hover:border-green-400/50 rounded-xl p-4 text-center transition-all duration-300"
                data-caption={`Security layer: ${layer}`}
              >
                <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <span className="text-gray-300 text-sm font-medium">{layer}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl px-6 py-3">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">Bank-Level Security Active</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReliabilityEngine;