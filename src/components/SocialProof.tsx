import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, TrendingUp, Users, DollarSign } from 'lucide-react';

const SocialProof: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO",
      company: "Growth Labs",
      avatar: "SC",
      content: "We were drowning trying to keep up with 20 clients. Now we handle over 100 and I haven't hired a single new person. KenjiAI runs the follow-ups, the scheduling, all of it. Our revenue tripled in 6 months.",
      metric: "3x Revenue Growth"
    },
    {
      name: "Marcus Johnson",
      role: "Head of Sales",
      company: "TechGear Pro",
      avatar: "MJ",
      content: "I was skeptical about AI making sales calls. Then it booked 47 qualified meetings in the first month and added over $500K to our pipeline. I don't know why I waited so long.",
      metric: "$500K+ Pipeline"
    },
    {
      name: "Elena Rodriguez",
      role: "Founder",
      company: "DataSync Solutions",
      avatar: "ER",
      content: "We cut our cost per lead by 70% and our close rate went up 250%. The AI handles the first touch, qualifies the lead, and by the time my team gets on a call, the prospect is already warm.",
      metric: "70% Lower CAC"
    },
    {
      name: "David Park",
      role: "Managing Partner",
      company: "Park Properties",
      avatar: "DP",
      content: "I'm a Realtor, not a tech guy. KenjiAI's team set everything up for me. Now my leads get followed up within seconds, appointments book themselves, and I closed 6x more deals last quarter.",
      metric: "650% Deal Volume"
    },
    {
      name: "Lisa Thompson",
      role: "Consultant",
      company: "Thompson Consulting",
      avatar: "LT",
      content: "I went from 500 LinkedIn connections to 50,000 in a year. The content system posts for me, engages for me, and drives inbound leads. I get 3-5 new inquiries a week now without lifting a finger.",
      metric: "100x Network Growth"
    },
    {
      name: "Alex Rivera",
      role: "Agency Owner",
      company: "Digital Dominance",
      avatar: "AR",
      content: "Client retention was my biggest problem. 40% of my clients would churn every year. After setting up automated check-ins and reporting through KenjiAI, retention went to 95%. That alone changed everything.",
      metric: "95% Retention Rate"
    }
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "Businesses Using KenjiAI" },
    { icon: DollarSign, value: "$50M+", label: "Revenue Generated for Clients" },
    { icon: TrendingUp, value: "425%", label: "Average ROI" },
    { icon: Star, value: "4.9/5", label: "Client Rating" }
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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                transition: { duration: 0.3 }
              }}
              role="listitem"
              className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-400/50 rounded-2xl p-6 transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-blue-400/60 mb-4" />

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Metric Badge */}
              <div className="inline-flex items-center bg-gradient-to-r from-blue-500/20 to-green-400/20 border border-blue-400/30 rounded-lg px-3 py-1 mb-4">
                <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-green-400 font-semibold text-sm">{testimonial.metric}</span>
              </div>

              {/* Author */}
              <div className="flex items-center" role="presentation">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-400 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  <div className="text-blue-400 text-sm">{testimonial.company}</div>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;