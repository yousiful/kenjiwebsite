import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Mail, 
  Star, 
  Calendar, 
  Globe, 
  Zap, 
  Edit, 
  MessageCircle, 
  Users, 
  CreditCard,
  BookOpen,
  Award,
  QrCode,
  TrendingUp,
  BarChart3,
  UserCheck,
  HelpCircle,
  Search,
  Workflow,
  Target,
  DollarSign
} from 'lucide-react';

const Features: React.FC = () => {
  const featureGroups = [
    {
      title: "Lead Generation & Ads",
      color: "from-blue-400 to-cyan-500",
      features: [
        {
          icon: Target,
          title: "AI-Powered Ad Campaigns",
          description: "Done-for-you ads that fill your CRM with qualified leads on autopilot",
          color: "from-blue-500 to-blue-600",
          roi: "3x more qualified leads"
        },
        {
          icon: Globe,
          title: "High-Converting Landing Pages",
          description: "AI-built pages and funnels optimized for maximum conversion rates",
          color: "from-cyan-500 to-cyan-600",
          roi: "85% higher conversions"
        },
        {
          icon: Search,
          title: "SEO That Drives Traffic",
          description: "Automated SEO optimization that ranks your content and brings organic leads",
          color: "from-lime-500 to-lime-600",
          roi: "500% more organic traffic"
        },
        {
          icon: Edit,
          title: "Content Marketing Engine",
          description: "AI blog writer creating SEO content that attracts and converts prospects",
          color: "from-red-500 to-red-600",
          roi: "300% more organic leads"
        },
        {
          icon: Calendar,
          title: "Social Media Automation",
          description: "AI-generated content that engages followers and converts them to customers",
          color: "from-sky-500 to-sky-600",
          roi: "250% more social sales"
        },
        {
          icon: BarChart3,
          title: "Marketing Analytics",
          description: "Real-time insights showing what's working and where to invest more",
          color: "from-amber-500 to-amber-600",
          roi: "Data-driven decisions"
        }
      ]
    },
    {
      title: "AI Sales & CRM",
      color: "from-green-400 to-emerald-500",
      features: [
        {
          icon: Mic,
          title: "AI Voice Agents",
          description: "AI agents handling sales calls, qualifying leads, and closing deals 24/7",
          color: "from-blue-500 to-blue-600",
          roi: "300% more deals closed"
        },
        {
          icon: MessageCircle,
          title: "Smart Chatbots",
          description: "Intelligent conversations that qualify leads and guide prospects to purchase",
          color: "from-sky-500 to-sky-600",
          roi: "24/7 sales automation"
        },
        {
          icon: TrendingUp,
          title: "Predictive CRM",
          description: "Advanced CRM with lifetime value prediction and retention automation",
          color: "from-slate-500 to-slate-600",
          roi: "Higher customer value"
        },
        {
          icon: Mail,
          title: "Email & SMS Campaigns",
          description: "AI-powered campaigns optimized for maximum revenue and conversions",
          color: "from-purple-500 to-purple-600",
          roi: "400% higher conversions"
        },
        {
          icon: DollarSign,
          title: "Revenue Workflows",
          description: "Smart automation that nurtures leads and converts them to customers",
          color: "from-green-500 to-green-600",
          roi: "425% average ROI"
        },
        {
          icon: Star,
          title: "Review & Reputation System",
          description: "Automated review collection building trust and driving more sales",
          color: "from-yellow-500 to-yellow-600",
          roi: "Trust-driven growth"
        }
      ]
    },
    {
      title: "Operations & Automation",
      color: "from-purple-400 to-pink-500",
      features: [
        {
          icon: Users,
          title: "Community Management",
          description: "Build engaged communities with automated monetization and membership tiers",
          color: "from-pink-500 to-pink-600",
          roi: "Recurring revenue"
        },
        {
          icon: BookOpen,
          title: "Course Creation Platform",
          description: "AI-created courses with automated marketing and sales funnels",
          color: "from-indigo-500 to-indigo-600",
          roi: "Passive income"
        },
        {
          icon: UserCheck,
          title: "Membership Management",
          description: "Automated membership system with tiered pricing and churn prevention",
          color: "from-teal-500 to-teal-600",
          roi: "Predictable revenue"
        },
        {
          icon: Target,
          title: "Affiliate Program System",
          description: "Complete affiliate program with tracking, commissions, and recruitment",
          color: "from-violet-500 to-violet-600",
          roi: "10x multiplication"
        },
        {
          icon: CreditCard,
          title: "Payment Processing",
          description: "Integrated payments with subscription optimization and upsells",
          color: "from-fuchsia-500 to-fuchsia-600",
          roi: "Optimized revenue"
        },
        {
          icon: Workflow,
          title: "Business Automation",
          description: "Smart workflows automating repetitive tasks and operations",
          color: "from-cyan-500 to-cyan-600",
          roi: "85% time savings"
        }
      ]
    }
  ];

  return (
    <section className="py-12 bg-gray-900 relative overflow-hidden" aria-labelledby="features-heading">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-green-400/20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
          role="region"
        >
          <h2 id="features-heading" className="text-4xl sm:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Every Feature Designed to Make You Money
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto">
            Stop paying for tools that don't generate revenue. Every feature in KenjiAI is built to automate your business,
            close more deals, and put money in your pocket while you sleep.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" role="list">
          {featureGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: groupIndex * 0.2 }}
              className="space-y-6"
            >
              <div className="text-center pb-4 border-b border-gray-700">
                <h3 className={`text-2xl font-bold bg-gradient-to-r ${group.color} bg-clip-text text-transparent`}>
                  {group.title}
                </h3>
              </div>

              {group.features.map((feature, featureIndex) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: groupIndex * 0.2 + featureIndex * 0.1 }}
                  whileHover={{
                    scale: 1.03,
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                  role="listitem"
                  className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-400/50 rounded-xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
                  data-caption={`${feature.title}: ${feature.roi}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>

                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-gray-400 text-xs leading-relaxed group-hover:text-gray-300 transition-colors mb-3">
                        {feature.description}
                      </p>
                      <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-semibold inline-block">
                        {feature.roi}
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
          role="region"
          aria-labelledby="features-cta"
        >
          <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-blue-400/30 rounded-3xl p-8">
            <h3 id="features-cta" className="text-3xl font-bold text-white mb-4">
              Ready to Start Making Money with AI?
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Join 50,000+ businesses using KenjiAI to automate operations, close more deals, 
              and generate revenue 24/7. Average ROI: 425% in first 90 days.
            </p>
            <motion.a
              href="/pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
            >
              Start Making Money Today
              <Zap className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;