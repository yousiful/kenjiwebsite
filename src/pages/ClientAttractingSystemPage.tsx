import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Zap, CheckCircle, ArrowRight, Star } from 'lucide-react';

const ClientAttractingSystemPage: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: "Automated Lead Generation",
      description: "AI-powered system that finds and qualifies leads 24/7"
    },
    {
      icon: TrendingUp,
      title: "Smart Follow-Up",
      description: "Never miss a follow-up with intelligent automation"
    },
    {
      icon: Zap,
      title: "Instant Engagement",
      description: "Respond to leads in seconds, not hours"
    }
  ];

  const benefits = [
    "Get 10-50 qualified leads per month",
    "Automated outreach and follow-up",
    "AI voice agents handle initial calls",
    "CRM integration and management",
    "Email and SMS campaigns included",
    "24/7 lead qualification"
  ];

  return (
    <>
      <Helmet>
        <title>Client Attracting System | KenjiAI - Automated Lead Generation</title>
        <meta name="description" content="Complete AI-powered client attracting system. Get qualified leads on autopilot with automated outreach, follow-up, and engagement." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900/20 to-gray-900">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
                <Star className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-semibold">Most Popular System</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Client Attracting System
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Stop chasing clients. Let our AI-powered system bring qualified leads to you automatically.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <motion.a
                  href="/pricing"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                >
                  Get Started Now
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </motion.a>

                <motion.a
                  href="mailto:care@kenjiai.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-800 text-white px-8 py-4 rounded-xl font-bold text-lg border border-gray-700 hover:bg-gray-700 transition-all"
                >
                  Talk to an Expert
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              How It Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all"
                >
                  <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  What's Included
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Everything you need to attract, engage, and convert clients on complete autopilot.
                </p>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                      <span className="text-gray-300 text-lg">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">$497</div>
                  <div className="text-gray-400 mb-6">per month</div>

                  <div className="bg-gray-900/50 rounded-xl p-6 mb-6 text-left">
                    <div className="text-sm text-gray-400 mb-2">Average Results:</div>
                    <div className="text-3xl font-bold text-green-400 mb-1">10-50</div>
                    <div className="text-gray-300">qualified leads per month</div>
                  </div>

                  <motion.a
                    href="/pricing"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                  >
                    Start Attracting Clients
                  </motion.a>

                  <p className="text-sm text-gray-400 mt-4">
                    No setup fees • Cancel anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-12"
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Stop Chasing Clients?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Let our AI system do the heavy lifting while you focus on closing deals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/pricing"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all inline-flex items-center justify-center gap-2"
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ClientAttractingSystemPage;
