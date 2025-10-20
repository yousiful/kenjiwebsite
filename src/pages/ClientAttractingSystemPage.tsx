import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Zap, CheckCircle, ArrowRight, Star, Target, MessageSquare, Calendar, BarChart3, Phone, Mail } from 'lucide-react';

const ClientAttractingSystemPage: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: "AI-Powered Lead Targeting",
      description: "Our AI identifies and targets your ideal clients based on your specific criteria"
    },
    {
      icon: MessageSquare,
      title: "Automated Outreach",
      description: "Multi-channel campaigns that run on autopilot across email, SMS, and social media"
    },
    {
      icon: Phone,
      title: "AI Voice Qualification",
      description: "Voice agents pre-qualify leads and book appointments automatically"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Leads book directly into your calendar with automated reminders"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track every lead, conversation, and conversion in your dashboard"
    },
    {
      icon: Mail,
      title: "Follow-Up Automation",
      description: "Never lose a lead with intelligent nurture sequences"
    }
  ];

  const benefits = [
    "10-50+ qualified leads delivered monthly",
    "Complete AI-powered outreach system",
    "Voice AI agents for lead qualification",
    "Automated appointment booking",
    "Multi-channel campaign management",
    "CRM integration & data sync",
    "Email & SMS automation included",
    "Real-time lead notifications",
    "Custom targeting & segmentation",
    "24/7 system operation"
  ];

  const testimonials = [
    {
      name: "Michael Chen",
      role: "Real Estate Broker",
      quote: "Generated 37 qualified appointments in the first month. This system paid for itself 10x over."
    },
    {
      name: "Sarah Martinez",
      role: "Insurance Agent",
      quote: "Finally stopped cold calling. The AI does all the prospecting while I focus on closing deals."
    },
    {
      name: "David Thompson",
      role: "Marketing Agency Owner",
      quote: "Scaled from 5 to 25 clients in 90 days. The automated follow-up alone is worth the investment."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Client Attracting System | KenjiAI - Automated Lead Generation</title>
        <meta name="description" content="Complete AI-powered client attracting system. Get qualified leads on autopilot with automated outreach, follow-up, and engagement." />
      </Helmet>

      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 bg-gradient-to-b from-[#0038FF]/20 via-black to-black">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0038FF]/20 via-transparent to-transparent"></div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-[#0038FF]/20 border border-[#0038FF] rounded-full px-6 py-2 mb-8">
                <Star className="w-5 h-5 text-[#0038FF]" />
                <span className="text-white text-sm font-bold uppercase tracking-wide">Done-For-You Lead System</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                Stop Chasing Clients.<br />
                <span className="text-[#0038FF]">Start Attracting Them.</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed">
                Complete AI-Powered Client Acquisition System
              </p>

              <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
                Get 10-50+ qualified leads every month while you focus on closing deals. Our AI handles prospecting, outreach, qualification, and appointment booking automatically.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <motion.a
                  href="/pricing"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#0038FF] text-white px-10 py-5 rounded-lg font-bold text-lg uppercase tracking-wide hover:bg-[#0038FF]/90 hover:shadow-2xl hover:shadow-[#0038FF]/50 transition-all"
                >
                  Get Started Now
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </motion.a>

                <motion.a
                  href="mailto:care@kenjiai.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent text-white px-10 py-5 rounded-lg font-bold text-lg uppercase tracking-wide border-2 border-white hover:bg-white hover:text-black transition-all"
                >
                  Talk to an Expert
                </motion.a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-4xl font-black text-[#0038FF] mb-2">10-50+</div>
                  <div className="text-gray-400 uppercase text-sm font-semibold">Qualified Leads/Month</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-[#0038FF] mb-2">24/7</div>
                  <div className="text-gray-400 uppercase text-sm font-semibold">AI Working For You</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-[#0038FF] mb-2">100%</div>
                  <div className="text-gray-400 uppercase text-sm font-semibold">Done-For-You</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
                Complete Lead Generation System
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Six powerful AI-driven components working 24/7 to fill your pipeline with qualified prospects
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-xl p-8 hover:border-[#0038FF] transition-all duration-300"
                >
                  <div className="bg-[#0038FF]/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#0038FF]/20 transition-all">
                    <feature.icon className="w-8 h-8 text-[#0038FF]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 px-4 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase">
                  Everything Included
                </h2>
                <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                  A complete, done-for-you client acquisition system. No software to learn, no campaigns to manage, no leads to chase.
                </p>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="flex items-start gap-4 group"
                    >
                      <CheckCircle className="w-6 h-6 text-[#0038FF] flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-300 text-lg">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0038FF]/30 to-transparent rounded-2xl blur-xl"></div>

                <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#0038FF] rounded-2xl p-10">
                  <div className="text-center mb-8">
                    <div className="inline-block bg-[#0038FF]/20 px-4 py-2 rounded-full mb-4">
                      <span className="text-[#0038FF] font-bold uppercase text-sm tracking-wide">Limited Time Offer</span>
                    </div>
                    <div className="text-6xl font-black text-white mb-2">$497</div>
                    <div className="text-gray-400 text-xl mb-2">/month</div>
                    <div className="text-sm text-gray-500">Billed monthly • No contracts</div>
                  </div>

                  <div className="bg-black/50 rounded-xl p-6 mb-8 border border-gray-800">
                    <div className="text-sm text-gray-400 mb-3 uppercase tracking-wide">Expected Results:</div>
                    <div className="flex items-end gap-2 mb-2">
                      <div className="text-5xl font-black text-[#0038FF]">10-50+</div>
                      <div className="text-gray-400 text-lg mb-2">leads</div>
                    </div>
                    <div className="text-gray-300">Qualified appointments per month</div>
                    <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-500">
                      Average client value: $2,000 - $10,000+
                    </div>
                  </div>

                  <motion.a
                    href="/pricing"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="block bg-[#0038FF] text-white px-8 py-5 rounded-lg font-bold text-lg text-center uppercase tracking-wide hover:bg-[#0038FF]/90 hover:shadow-2xl hover:shadow-[#0038FF]/50 transition-all mb-4"
                  >
                    Start Now - Get Your First Leads
                  </motion.a>

                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-400">✓ No setup fees</p>
                    <p className="text-sm text-gray-400">✓ Cancel anytime</p>
                    <p className="text-sm text-gray-400">✓ First leads within 7-14 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase">
                Real Results From Real Businesses
              </h2>
              <p className="text-xl text-gray-400">See what our clients are saying</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-xl p-8 hover:border-[#0038FF]/50 transition-all"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#0038FF] text-[#0038FF]" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                  <div className="border-t border-gray-800 pt-4">
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-black">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0038FF]/30 via-[#0038FF]/10 to-transparent rounded-2xl blur-2xl"></div>

              <div className="relative bg-gradient-to-r from-[#0038FF]/20 to-transparent border-2 border-[#0038FF] rounded-2xl p-12 md:p-16 text-center">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase leading-tight">
                  Ready to Stop Chasing Clients?
                </h2>
                <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
                  Let AI do the prospecting while you focus on closing deals.
                </p>
                <p className="text-lg text-gray-400 mb-10">
                  Get your first qualified leads within 7-14 days.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <motion.a
                    href="/pricing"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#0038FF] text-white px-12 py-6 rounded-lg font-bold text-xl uppercase tracking-wide hover:bg-[#0038FF]/90 hover:shadow-2xl hover:shadow-[#0038FF]/50 transition-all inline-flex items-center justify-center gap-3"
                  >
                    Start Attracting Clients Now
                    <ArrowRight className="w-6 h-6" />
                  </motion.a>
                </div>

                <p className="text-sm text-gray-500">
                  No contracts • Cancel anytime • Results guaranteed
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ClientAttractingSystemPage;
