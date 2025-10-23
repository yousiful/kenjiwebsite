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
  const features = [
    {
      icon: Mic,
      title: "AI Voice Agents That Close Deals",
      description: "AI agents that handle sales calls, qualify leads, and close deals 24/7 - generating revenue while you sleep",
      color: "from-blue-500 to-blue-600",
      roi: "300% more deals closed"
    },
    {
      icon: DollarSign,
      title: "Revenue-Generating Workflows",
      description: "Smart automation that identifies opportunities, nurtures leads, and converts prospects into paying customers",
      color: "from-green-500 to-green-600",
      roi: "425% average ROI"
    },
    {
      icon: Mail,
      title: "Profit-Driven Email Campaigns",
      description: "AI-powered campaigns that automatically optimize for maximum revenue and customer lifetime value",
      color: "from-purple-500 to-purple-600",
      roi: "400% higher conversions"
    },
    {
      icon: Users,
      title: "Community That Pays You",
      description: "Build engaged communities with automated monetization, membership tiers, and revenue-sharing features",
      color: "from-pink-500 to-pink-600",
      roi: "Recurring revenue streams"
    },
    {
      icon: BookOpen,
      title: "Courses That Sell Themselves",
      description: "AI-created courses with automated marketing, sales funnels, and student engagement that maximize profits",
      color: "from-indigo-500 to-indigo-600",
      roi: "Passive income generation"
    },
    {
      icon: Edit,
      title: "Content That Converts to Cash",
      description: "AI blog writer that creates SEO-optimized content designed to drive traffic and generate leads",
      color: "from-red-500 to-red-600",
      roi: "300% more organic leads"
    },
    {
      icon: UserCheck,
      title: "Memberships That Scale Revenue",
      description: "Automated membership management with tiered pricing, retention optimization, and churn prevention",
      color: "from-teal-500 to-teal-600",
      roi: "Predictable monthly revenue"
    },
    {
      icon: Target,
      title: "Affiliate System That Multiplies Income",
      description: "Complete affiliate program with automated tracking, commissions, and partner recruitment",
      color: "from-violet-500 to-violet-600",
      roi: "10x revenue multiplication"
    },
    {
      icon: Calendar,
      title: "Social Media That Sells",
      description: "AI-generated content with automated posting designed to drive engagement and convert followers to customers",
      color: "from-cyan-500 to-cyan-600",
      roi: "250% more social sales"
    },
    {
      icon: BarChart3,
      title: "Analytics That Predict Profit",
      description: "Real-time insights and predictive analytics that identify the highest-value opportunities",
      color: "from-amber-500 to-amber-600",
      roi: "Data-driven growth"
    },
    {
      icon: Search,
      title: "SEO That Drives Revenue",
      description: "Automated SEO optimization that ranks your content and drives high-converting organic traffic",
      color: "from-lime-500 to-lime-600",
      roi: "500% more organic revenue"
    },
    {
      icon: Globe,
      title: "Websites That Convert Visitors to Buyers",
      description: "AI-built websites and funnels optimized for maximum conversion rates and customer acquisition",
      color: "from-rose-500 to-rose-600",
      roi: "85% higher conversion rates"
    },
    {
      icon: MessageCircle,
      title: "Chatbots That Qualify and Close",
      description: "Intelligent conversations that qualify leads, handle objections, and guide prospects to purchase",
      color: "from-sky-500 to-sky-600",
      roi: "24/7 sales automation"
    },
    {
      icon: CreditCard,
      title: "Payment Systems That Maximize Revenue",
      description: "Integrated payment processing with subscription optimization, upsells, and revenue recovery",
      color: "from-fuchsia-500 to-fuchsia-600",
      roi: "Optimized payment flows"
    },
    {
      icon: TrendingUp,
      title: "CRM That Predicts Customer Value",
      description: "Advanced customer relationship management with lifetime value prediction and retention automation",
      color: "from-slate-500 to-slate-600",
      roi: "Higher customer lifetime value"
    },
    {
      icon: Star,
      title: "Review System That Builds Trust & Sales",
      description: "Automated review collection and reputation management that builds trust and drives more sales",
      color: "from-yellow-500 to-yellow-600",
      roi: "Trust-driven revenue growth"
    }
  ];

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden" aria-labelledby="features-heading">
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
              AI Automation Platform Features That Drive Revenue
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto">
            Stop paying for tools that don't generate revenue. Every feature in KenjiAI is built to automate your business, 
            close more deals, and put money in your pocket while you sleep.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { duration: 0.3 }
              }}
              role="listitem"
              className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-400/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
              data-caption={`${feature.title}: ${feature.roi}`}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors mb-4">
                {feature.description}
              </p>

              {/* ROI Badge */}
              <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-xs font-semibold inline-block">
                💰 {feature.roi}
              </div>

              {/* Hover Effect Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
              href="https://freedom.kenjiai.com/checkout-4912-2457-3370"
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