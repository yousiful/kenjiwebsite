import React from 'react';
import { motion } from 'framer-motion';
import { Users, Brain, Zap, TrendingUp, Target, Heart } from 'lucide-react';

const BusinessTransformation: React.FC = () => {
  const transformationSteps = [
    {
      icon: Users,
      title: "Human Insight",
      description: "Your team's creativity, intuition, and strategic thinking",
      color: "from-blue-500 to-cyan-400",
      position: { x: 0, y: 0 }
    },
    {
      icon: Brain,
      title: "AI Intelligence",
      description: "Machine learning, automation, and data processing power",
      color: "from-green-500 to-emerald-400",
      position: { x: 1, y: 0 }
    },
    {
      icon: Zap,
      title: "Fusion Power",
      description: "The magical combination that amplifies both capabilities",
      color: "from-purple-500 to-pink-400",
      position: { x: 0.5, y: 1 }
    }
  ];

  const businessOutcomes = [
    { icon: TrendingUp, label: "300% Growth", value: "Average Revenue Increase" },
    { icon: Target, label: "85% Efficiency", value: "Process Automation" },
    { icon: Heart, label: "95% Satisfaction", value: "Customer Experience" }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              AI + Human = 
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Business Magic
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            We don't replace humans—we amplify them. KenjiAI combines artificial intelligence with human creativity 
            to create businesses that are more powerful, more efficient, and more human than ever before.
          </p>
        </motion.div>

        {/* Transformation Visualization */}
        <div className="relative max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-2 gap-8 mb-8">
            {transformationSteps.slice(0, 2).map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group relative"
                data-caption={`${step.title}: ${step.description}`}
              >
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-400/50 rounded-3xl p-8 text-center transition-all duration-500">
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Fusion Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6, type: "spring", bounce: 0.4 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 w-16 h-16 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">+</span>
              </div>
            </div>
          </motion.div>

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.9 }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="group relative max-w-md mx-auto"
            data-caption="The result: Supercharged business performance that combines the best of both worlds"
          >
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-purple-400/50 rounded-3xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-400 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Fusion Power</h3>
              <p className="text-gray-300 leading-relaxed">The magical combination that amplifies both capabilities</p>
            </div>
          </motion.div>
        </div>

        {/* Business Outcomes */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {businessOutcomes.map((outcome, index) => (
            <motion.div
              key={outcome.label}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 hover:border-green-400/50 rounded-2xl p-6 text-center transition-all duration-300"
              data-caption={`${outcome.value}: Real results from AI-human collaboration`}
            >
              <outcome.icon className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">{outcome.label}</div>
              <div className="text-gray-400">{outcome.value}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BusinessTransformation;