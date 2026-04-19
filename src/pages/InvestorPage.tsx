import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Globe, Zap, Brain, Target, Award, ExternalLink, Download, Mail, Calendar, Rocket, Shield, Crown } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const InvestorPage: React.FC = () => {
  const heroMetrics = [
    { icon: Users, value: "50,000+", label: "Active Users", growth: "+400% YoY" },
    { icon: DollarSign, value: "$150M+", label: "Revenue Generated", growth: "+650% YoY" },
    { icon: Globe, value: "75+", label: "Countries", growth: "+200% YoY" },
    { icon: TrendingUp, value: "425%", label: "Average ROI", growth: "Industry Leading" }
  ];

  const marketOpportunity = [
    {
      title: "AI Business Automation",
      value: "$890B",
      description: "Total addressable market by 2030",
      growth: "28% CAGR",
      icon: Brain
    },
    {
      title: "Conversational AI",
      value: "$32.6B",
      description: "Voice AI market expansion",
      growth: "24% CAGR",
      icon: Zap
    },
    {
      title: "Marketing Automation",
      value: "$25.1B",
      description: "Smart campaign automation",
      growth: "19% CAGR",
      icon: Target
    }
  ];

  const competitiveAdvantages = [
    {
      icon: Crown,
      title: "Complete AI Ecosystem",
      description: "The only platform combining voice AI, marketing automation, CRM, and business intelligence in one unified system",
      metrics: "10x more comprehensive than competitors"
    },
    {
      icon: Rocket,
      title: "Proven Scalability",
      description: "From 0 to 50,000 users in 24 months with 425% average customer ROI and viral growth mechanics",
      metrics: "3.2x faster growth than industry average"
    },
    {
      icon: Shield,
      title: "Defensible Technology",
      description: "Proprietary AI models, 47 pending patents, and deep learning algorithms that improve with every interaction",
      metrics: "18-month technical lead over competition"
    },
    {
      icon: Award,
      title: "Market Leadership",
      description: "Category-defining platform with 89% customer retention and Net Promoter Score of 73",
      metrics: "2x higher retention than industry standard"
    }
  ];

  const financialHighlights = [
    { metric: "Annual Recurring Revenue", value: "$47M", growth: "+380% YoY", trend: "Accelerating" },
    { metric: "Monthly Recurring Revenue", value: "$4.2M", growth: "+52% MoM", trend: "Consistent Growth" },
    { metric: "Customer Acquisition Cost", value: "$89", growth: "-45% YoY", trend: "Decreasing" },
    { metric: "Customer Lifetime Value", value: "$18,700", growth: "+125% YoY", trend: "Increasing" },
    { metric: "Gross Margin", value: "91%", growth: "+4% YoY", trend: "Best in Class" },
    { metric: "Net Revenue Retention", value: "178%", growth: "+23% YoY", trend: "Exceptional" }
  ];

  const useOfFunds = [
    { category: "AI Research & Development", percentage: 45, amount: "$22.5M", description: "Advanced AI models, voice technology, automation engines" },
    { category: "Global Market Expansion", percentage: 25, amount: "$12.5M", description: "International sales, localization, regional partnerships" },
    { category: "Sales & Marketing Scale", percentage: 20, amount: "$10M", description: "Customer acquisition, brand building, channel development" },
    { category: "Strategic Acquisitions", percentage: 10, amount: "$5M", description: "Complementary technologies, talent acquisition, IP portfolio" }
  ];

  const investmentTiers = [
    {
      tier: "Strategic Partner",
      minimum: "$5M+",
      benefits: ["Board seat", "Strategic advisory", "Priority feature development", "Co-marketing opportunities"],
      color: "from-purple-600 to-pink-500"
    },
    {
      tier: "Growth Investor",
      minimum: "$1M+",
      benefits: ["Quarterly updates", "Product roadmap access", "Customer introductions", "Exit priority"],
      color: "from-blue-600 to-cyan-500"
    },
    {
      tier: "Angel Investor",
      minimum: "$100K+",
      benefits: ["Annual investor events", "Product beta access", "Network introductions", "Founder access"],
      color: "from-green-600 to-emerald-500"
    }
  ];

  return (
    <>
      {/* SEO Head */}
      <SEOHead 
        title="Investor Relations" 
        description="Invest in KenjiAI, the leading AI business automation platform. $890B market opportunity, 425% average ROI, 50,000+ users. Series B funding round open."
        keywords="KenjiAI investment, AI startup investment, business automation investment, Series B funding, AI platform investment"
      />
      
      <div className="pt-24 pb-16 bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center mb-6">
                <div 
                  className="w-24 h-24 flex items-center justify-center"
                  style={{
                    backgroundImage: `url('https://assets.cdn.filesafe.space/q5L4ttbBMHNxieXIcTVJ/media/5adccaae-527e-49d4-befc-6410b918c624.gif')`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    filter: 'drop-shadow(0 0 25px rgba(59, 130, 246, 0.5))',
                    mixBlendMode: 'screen' // This helps remove white backgrounds
                  }}
                  data-caption="KenjiAI: The future of business automation"
                />
              </div>
            </motion.div>

            <h1 className="text-6xl sm:text-7xl font-bold text-white mb-8">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Invest in the AI Revolution
              </span>
              <br />
              <span className="text-white">That's Transforming Business</span>
            </h1>
            <p className="text-2xl text-gray-400 max-w-5xl mx-auto leading-relaxed mb-12">
              KenjiAI is building the $100B platform that combines artificial intelligence with human creativity 
              to create the most powerful business automation ecosystem ever conceived.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <motion.a
                href="https://investors.kenjiai.com/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-3"
                data-caption="Access our comprehensive investor portal"
              >
                <Rocket className="w-6 h-6" />
                Access Investor Portal
                <ExternalLink className="w-5 h-5" />
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-800 border border-gray-600 hover:border-blue-400 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center gap-3"
                data-caption="Download our detailed investment deck"
              >
                <Download className="w-6 h-6" />
                Download Pitch Deck
              </motion.button>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          >
            {heroMetrics.map((metric) => (
              <motion.div
                key={metric.label}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-gradient-to-br from-gray-800/50 to-blue-900/20 border border-gray-700 hover:border-blue-400/50 rounded-3xl p-8 text-center transition-all duration-500"
                data-caption={`${metric.label}: ${metric.growth} growth demonstrates our market momentum`}
              >
                <metric.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-3">{metric.value}</div>
                <div className="text-gray-400 mb-3">{metric.label}</div>
                <div className="text-green-400 text-sm font-bold bg-green-400/10 px-3 py-1 rounded-lg">
                  {metric.growth}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Market Opportunity */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-5xl font-bold text-white mb-12 text-center">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Trillion-Dollar Market Opportunity
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {marketOpportunity.map((market, index) => (
                <motion.div
                  key={market.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-gradient-to-br from-gray-800/50 to-blue-900/20 border border-gray-700 hover:border-blue-400/50 rounded-3xl p-8 text-center transition-all duration-500"
                  data-caption={`${market.title}: ${market.growth} growth rate in a ${market.value} market`}
                >
                  <market.icon className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                  <div className="text-5xl font-bold text-white mb-4">{market.value}</div>
                  <h3 className="text-2xl font-semibold text-blue-400 mb-4">{market.title}</h3>
                  <p className="text-gray-400 mb-6">{market.description}</p>
                  <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl text-lg font-bold inline-block">
                    {market.growth}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Competitive Advantages */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-5xl font-bold text-white mb-12 text-center">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Unassailable Competitive Moats
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {competitiveAdvantages.map((advantage, index) => (
                <motion.div
                  key={advantage.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gray-800/50 border border-gray-700 hover:border-blue-400/50 rounded-3xl p-8 transition-all duration-500"
                  data-caption={`${advantage.title}: ${advantage.metrics}`}
                >
                  <advantage.icon className="w-16 h-16 text-blue-400 mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">{advantage.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">{advantage.description}</p>
                  <div className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl text-sm font-semibold inline-block">
                    {advantage.metrics}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Financial Performance */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-20"
          >
            <h2 className="text-5xl font-bold text-white mb-12 text-center">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Exceptional Financial Performance
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {financialHighlights.map((item, index) => (
                <motion.div
                  key={item.metric}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gray-800/50 border border-gray-700 hover:border-green-400/50 rounded-2xl p-6 transition-all duration-300"
                  data-caption={`${item.metric}: ${item.growth} growth showing ${item.trend.toLowerCase()} performance`}
                >
                  <h4 className="text-gray-400 text-sm mb-2">{item.metric}</h4>
                  <div className="text-3xl font-bold text-white mb-2">{item.value}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-green-400 text-sm font-semibold">{item.growth}</div>
                    <div className="text-blue-400 text-xs">{item.trend}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Use of Funds */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mb-20"
          >
            <h2 className="text-5xl font-bold text-white mb-12 text-center">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Strategic Use of Capital
              </span>
            </h2>
            <div className="bg-gradient-to-br from-gray-800/50 to-blue-900/20 border border-gray-700 rounded-3xl p-12">
              <div className="text-center mb-12">
                <div className="text-6xl font-bold text-white mb-4">$50M</div>
                <div className="text-2xl text-blue-400 font-semibold">Series B Funding Round</div>
                <div className="text-gray-400 mt-2">Accelerating global dominance in AI business automation</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {useOfFunds.map((fund, index) => (
                  <motion.div
                    key={fund.category}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                    className="bg-gray-800/30 border border-gray-600 rounded-2xl p-6"
                    data-caption={`${fund.category}: ${fund.description}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-white">{fund.category}</h4>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400">{fund.amount}</div>
                        <div className="text-gray-400 text-sm">{fund.percentage}%</div>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{fund.description}</p>
                    <div className="mt-4 bg-gradient-to-r from-blue-500 to-green-400 h-2 rounded-full">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-green-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${fund.percentage}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Investment Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mb-20"
          >
            <h2 className="text-5xl font-bold text-white mb-12 text-center">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Investment Opportunities
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {investmentTiers.map((tier, index) => (
                <motion.div
                  key={tier.tier}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className={`bg-gradient-to-br ${tier.color}/20 border border-gray-700 hover:border-blue-400/50 rounded-3xl p-8 transition-all duration-500`}
                  data-caption={`${tier.tier}: Minimum investment ${tier.minimum} with exclusive benefits`}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${tier.color} rounded-2xl mb-6`}>
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.tier}</h3>
                  <div className="text-3xl font-bold text-blue-400 mb-6">{tier.minimum}</div>
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <div className={`w-2 h-2 bg-gradient-to-r ${tier.color} rounded-full mr-3`}></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Investment CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-center bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-blue-400/30 rounded-3xl p-16"
          >
            <h2 className="text-5xl font-bold text-white mb-8">
              Join the AI Revolution That's
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Reshaping Business Forever
              </span>
            </h2>
            <p className="text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              Partner with KenjiAI to build the future where AI and human creativity combine to create 
              the most powerful business automation platform ever conceived. This is your opportunity 
              to invest in the next $100B company.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <motion.a
                href="mailto:investors@kenjiai.com"
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-3"
                data-caption="Connect directly with our investment team"
              >
                <Mail className="w-6 h-6" />
                Contact Investment Team
              </motion.a>
              <motion.a
                href="https://calendly.com/kenjiai-investors"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-800 border border-gray-600 hover:border-blue-400 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center gap-3"
                data-caption="Schedule a private investor presentation"
              >
                <Calendar className="w-6 h-6" />
                Schedule Private Demo
              </motion.a>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="text-gray-400">
                <div className="text-sm font-semibold text-blue-400 mb-1">SECURE</div>
                <div className="text-xs">256-bit SSL Encryption</div>
              </div>
              <div className="text-gray-400">
                <div className="text-sm font-semibold text-green-400 mb-1">ACCREDITED</div>
                <div className="text-xs">Qualified Investors Only</div>
              </div>
              <div className="text-gray-400">
                <div className="text-sm font-semibold text-purple-400 mb-1">EXCLUSIVE</div>
                <div className="text-xs">Limited Investment Slots</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default InvestorPage;