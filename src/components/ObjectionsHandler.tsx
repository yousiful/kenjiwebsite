import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Clock, Users, Shield, CheckCircle } from 'lucide-react';

interface Objection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  response: string;
  cta: string;
}

const OBJECTIONS: Objection[] = [
  {
    id: 'team',
    title: 'Do I need a technical team?',
    icon: <Users className="w-6 h-6" />,
    description: 'Many businesses worry about needing developers or tech experts to implement AI automation.',
    response: 'No technical skills required. Our platform is designed for non-technical users. We handle the setup for you, provide training for your team, and offer 24/7 support. Most clients are up and running within 5 minutes.',
    cta: 'Learn About Our Setup Service'
  },
  {
    id: 'time',
    title: 'How much time does implementation take?',
    icon: <Clock className="w-6 h-6" />,
    description: 'Businesses often worry about lengthy implementation periods that disrupt operations.',
    response: 'Implementation takes about 1 day from start to finish. We handle the technical setup, configure your automations, and train your team. You\'ll be generating results within 24 hours. Most clients report measurable ROI within 30 days.',
    cta: 'See Our Implementation Timeline'
  },
  {
    id: 'integration',
    title: 'Will this work with our current tools?',
    icon: <Shield className="w-6 h-6" />,
    description: 'Companies with existing software stacks worry about compatibility and data migration.',
    response: 'KenjiAI integrates with 500+ tools and platforms including Stripe, HubSpot, Salesforce, Gmail, Zapier, and more. Our team manages all integrations and data migration for you. No manual work required—everything syncs automatically.',
    cta: 'See All Integrations'
  },
  {
    id: 'guarantee',
    title: 'What if it doesn\'t work for us?',
    icon: <CheckCircle className="w-6 h-6" />,
    description: 'The risk of paying for something that doesn\'t deliver results is a common concern.',
    response: '100% Money-Back Guarantee. If you\'re not seeing results within 30 days, we refund every penny. No questions asked. That\'s how confident we are. Plus, you keep all bonuses and training materials we provide.',
    cta: 'Learn About Our Guarantee'
  },
  {
    id: 'support',
    title: 'What kind of support do you offer?',
    icon: <MessageCircle className="w-6 h-6" />,
    description: 'Businesses need assurance that help is available when problems arise.',
    response: 'You get 24/7 email support, daily training sessions, and a dedicated Slack channel with our team. Annual clients get priority support and a dedicated account manager. We\'re here to help you succeed.',
    cta: 'View Support Options'
  }
];

export function ObjectionsHandler() {
  const [selectedObjection, setSelectedObjection] = useState<string | null>(null);

  return (
    <>
      {/* Full Page Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900/0 via-gray-900/30 to-gray-900/0">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Common Questions <span className="text-cyan-400">Answered</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Still unsure? Here are answers to the questions we hear most from businesses considering KenjiAI.
            </p>
          </motion.div>

          {/* Objections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OBJECTIONS.map((objection, index) => (
              <motion.button
                key={objection.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                onClick={() => setSelectedObjection(selectedObjection === objection.id ? null : objection.id)}
                className="text-left"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group h-full bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer overflow-hidden relative"
                >
                  {/* Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 text-white">
                        {objection.icon}
                      </div>
                      <h3 className="text-lg font-bold text-white leading-tight mt-0.5">
                        {objection.title}
                      </h3>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                      {objection.description}
                    </p>

                    {/* Answer (appears when expanded) */}
                    <AnimatePresence>
                      {selectedObjection === objection.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-700 pt-4 mt-4"
                        >
                          <p className="text-emerald-300 text-sm leading-relaxed mb-4">
                            {objection.response}
                          </p>
                          <motion.a
                            href="https://go.mediatraffics.com/leads"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ x: 4 }}
                            className="inline-flex items-center gap-2 text-cyan-400 font-semibold text-sm hover:text-cyan-300 transition-colors"
                          >
                            {objection.cta}
                            <span>→</span>
                          </motion.a>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Expand indicator */}
                    <div className="mt-4 text-xs text-gray-500 font-semibold uppercase tracking-wide flex items-center gap-1">
                      {selectedObjection === objection.id ? 'Click to collapse' : 'Click to expand'}
                      <motion.span
                        animate={{ rotate: selectedObjection === objection.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        ▼
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              </motion.button>
            ))}
          </div>

          {/* Still Unsure CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 text-center bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-3xl p-12"
          >
            <h3 className="text-2xl font-bold text-white mb-3">Still Have Questions?</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Book a 15-minute call with our team. We'll answer any questions and show you exactly how KenjiAI works for your business.
            </p>
            <motion.a
              href="https://go.mediatraffics.com/leads"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              Schedule Your Call
            </motion.a>
          </motion.div>
        </div>
      </div>

    </>
  );
}
