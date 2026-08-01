import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';

const REVIEW_WIDGET_SRC = 'https://reputationhub.site/reputation/assets/review-widget.js';

const SocialProof: React.FC = () => {
  useEffect(() => {
    if (document.querySelector(`script[src="${REVIEW_WIDGET_SRC}"]`)) return;
    const script = document.createElement('script');
    script.src = REVIEW_WIDGET_SRC;
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const stats = [
    { icon: Users, value: "500+", label: "Clients Served" },
    { icon: DollarSign, value: "$3.35M+", label: "Client Revenue Generated" },
    { icon: Target, value: "36,490+", label: "Leads Delivered" },
    { icon: TrendingUp, value: "425%", label: "Average ROI" }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900 relative overflow-hidden" aria-labelledby="testimonials-heading">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
          role="region"
        >
          <h2 id="testimonials-heading" className="text-4xl sm:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Trusted by Thousands
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            Join the businesses already crushing it with KenjiAI
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-green-400 rounded-xl mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Real Client Reviews (live GHL/LeadConnector widget) */}
        <div className="rounded-2xl overflow-hidden">
          {/* min-height fallback: without it the iframe renders 0-tall on mobile
              whenever the widget's resize script loads late or is blocked. */}
          <iframe
            className="lc_reviews_widget min-h-[560px] sm:min-h-[420px]"
            src="https://reputationhub.site/reputation/widgets/review_widget/q5L4ttbBMHNxieXIcTVJ"
            frameBorder="0"
            scrolling="no"
            style={{ minWidth: '100%', width: '100%' }}
            title="KenjiAI Customer Reviews"
          />
        </div>
      </div>
    </section>
  );
};

export default SocialProof;