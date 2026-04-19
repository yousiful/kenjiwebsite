import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Globe, Zap, Brain, Target, Award, ExternalLink, Download, Mail, Calendar, Rocket, Shield, Crown } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const YieldCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(50000);
  
  const annualYield = amount * 0.045;
  const projected5Year = amount + (annualYield * 5); // Simple APY to total return for simple illustration.
  
  return (
    <div className="relative z-10">
      <div className="mb-10">
        <div className="flex justify-between items-end mb-4">
          <label className="text-gray-300 font-semibold text-lg">Initial Investment Amount</label>
          <div className="text-4xl font-bold text-white bg-gray-950 px-5 py-2 rounded-xl border border-gray-700">
            {formatCurrency(amount)}
          </div>
        </div>
        
        {/* Customized Neon Range Slider */}
        <div className="relative py-4">
          <input 
            type="range" 
            min="10000" 
            max="1000000" 
            step="5000" 
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer relative z-20 outline-none"
            style={{
              background: `linear-gradient(to right, #34D399 0%, #34D399 ${(amount - 10000) / (1000000 - 10000) * 100}%, #1F2937 ${(amount - 10000) / (1000000 - 10000) * 100}%, #1F2937 100%)`
            }}
          />
          <style>{`
            input[type=range]::-webkit-slider-thumb {
              appearance: none;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: #10B981;
              cursor: pointer;
              box-shadow: 0 0 20px rgba(16, 185, 129, 0.8), 0 0 0 4px rgba(16, 185, 129, 0.2);
              transition: transform 0.1s;
            }
            input[type=range]::-webkit-slider-thumb:hover {
              transform: scale(1.15);
            }
          `}</style>
        </div>
        
        <div className="flex justify-between text-sm text-gray-500 font-medium px-1">
          <span>$10k</span>
          <span>$250k</span>
          <span>$500k</span>
          <span>$1M+</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6">
          <div className="text-gray-400 mb-2 font-medium flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" /> Guaranteed Annual Payout
          </div>
          <div className="text-3xl font-bold text-green-400">
            +{formatCurrency(annualYield)}<span className="text-lg text-green-500/70">/yr</span>
          </div>
          <div className="text-sm font-semibold text-gray-500 mt-2 bg-gray-900 inline-block px-3 py-1 rounded-md">
            Fixed 4.5% APY
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-green-500/20">
            <TrendingUp className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="text-gray-300 mb-2 font-medium">Projected 5-Year Value</div>
            <div className="text-4xl font-bold text-white mb-2 shadow-sm drop-shadow-md">
              {formatCurrency(projected5Year)}
            </div>
            <div className="text-green-400 text-sm font-bold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Total net gain: {formatCurrency(annualYield * 5)}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center border-t border-gray-800 pt-8 mt-4">
        <p className="text-gray-400 mb-6 text-sm">Funds begin accruing 4.5% interest immediately upon clearance. Withdraw easily with standard lock-up disclosures.</p>
        <motion.a
          href="https://buy.stripe.com/00w14m6XP6FW9XV751aMU1H"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 rounded-2xl text-xl font-bold text-gray-900 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all"
        >
          <Zap className="w-6 h-6" />
          Invest {formatCurrency(amount)} Now
        </motion.a>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
          <Shield className="w-4 h-4 text-gray-400" />
          Secured by Stripe Bank-Grade Routing
        </div>
      </div>
    </div>
  );
};

const InvestorPage: React.FC = () => {

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

          {/* Investor Yield Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mb-24"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-green-400 font-bold text-sm tracking-wide uppercase">Guaranteed Fixed Yield</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Calculate Your Returns
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Secure a fixed <span className="text-green-400 font-bold">4.5% Annual Percentage Yield</span>, paid out directly to your account.
              </p>
            </div>

            <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-700/50 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
              {/* Neon Glow Background Effect */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-green-500/10 blur-[80px] pointer-events-none group-hover:bg-green-500/20 transition-colors duration-1000"></div>
              
              <YieldCalculator />
              
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