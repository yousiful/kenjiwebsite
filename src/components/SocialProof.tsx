import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, TrendingUp, Users, DollarSign, CheckCircle } from 'lucide-react';

const SocialProof: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Digital Marketing Agency Owner",
      company: "Growth Labs",
      avatar: "SC",
      content: "KenjiAI transformed our agency completely. We went from managing 20 clients manually to handling 100+ with AI automation. Our revenue tripled in 6 months.",
      metric: "3x Revenue Growth",
      verified: true
    },
    {
      name: "Marcus Johnson",
      role: "E-commerce Entrepreneur",
      company: "TechGear Pro",
      avatar: "MJ",
      content: "The voice agents alone have closed over $500K in deals while I sleep. This isn't just software, it's like having a team of expert salespeople working 24/7.",
      metric: "$500K+ in Sales",
      verified: true
    },
    {
      name: "Elena Rodriguez",
      role: "SaaS Founder",
      company: "DataSync Solutions",
      avatar: "ER",
      content: "We reduced our customer acquisition cost by 70% and increased conversion rates by 250%. KenjiAI pays for itself within the first week.",
      metric: "70% Lower CAC",
      verified: true
    },
    {
      name: "David Park",
      role: "Real Estate Investor",
      company: "Park Properties",
      avatar: "DP",
      content: "From lead generation to deal closing, KenjiAI handles everything. I've scaled from 2 deals per month to 15 deals per month with the same effort.",
      metric: "650% Deal Increase",
      verified: true
    },
    {
      name: "Lisa Thompson",
      role: "Consultant",
      company: "Thompson Consulting",
      avatar: "LT",
      content: "The AI blog writer and social media planner have made me a thought leader in my industry. My LinkedIn following grew from 500 to 50K in 8 months.",
      metric: "10,000% Growth",
      verified: true
    },
    {
      name: "Alex Rivera",
      role: "Agency Owner",
      company: "Digital Dominance",
      avatar: "AR",
      content: "Client retention went from 60% to 95% because our AI systems deliver consistent results. We're the go-to agency in our market now.",
      metric: "95% Retention Rate",
      verified: true
    },
    {
      name: "Jennifer Wu",
      role: "Online Course Creator",
      company: "WuLearning",
      avatar: "JW",
      content: "Successfully launched my entire course platform using KenjiAI. The automation handles everything from student onboarding to certificate delivery. Made $250K in my first quarter.",
      metric: "$250K First Quarter",
      verified: true
    },
    {
      name: "Robert Martinez",
      role: "Fitness Coach",
      company: "FitLife Pro",
      avatar: "RM",
      content: "KenjiAI's voice agents book consultations while I'm training clients. Went from 10 clients to 150+ clients in 5 months. The automation is incredible.",
      metric: "15x Client Growth",
      verified: true
    },
    {
      name: "Amanda Foster",
      role: "Legal Services Provider",
      company: "Foster Legal Solutions",
      avatar: "AF",
      content: "The CRM and automation tools helped me scale my legal practice without hiring. Now serving 500+ clients with the same small team. ROI was immediate.",
      metric: "500+ Clients Served",
      verified: true
    }
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "Active Users" },
    { icon: DollarSign, value: "$50M+", label: "Revenue Generated" },
    { icon: TrendingUp, value: "300%", label: "Average ROI" },
    { icon: Star, value: "4.9/5", label: "User Rating" }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900 relative overflow-hidden" aria-labelledby="testimonials-heading">
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
            <span className="bg-gradient-to-r from-pink-400 via-orange-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Business Automation Success Stories & Results
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
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-xl mb-4">
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
              <div className="inline-flex items-center bg-gradient-to-r from-green-500/20 to-blue-400/20 border border-green-400/30 rounded-lg px-3 py-1 mb-4">
                <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-green-400 font-semibold text-sm">{testimonial.metric}</span>
              </div>

              {/* Verified Badge */}
              {testimonial.verified && (
                <div className="inline-flex items-center bg-blue-500/20 border border-blue-400/30 rounded-lg px-2 py-1 mb-4 ml-2">
                  <CheckCircle className="w-3 h-3 text-blue-400 mr-1" />
                  <span className="text-blue-400 font-semibold text-xs">Verified Customer</span>
                </div>
              )}

              {/* Author */}
              <div className="flex items-center" role="presentation">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
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