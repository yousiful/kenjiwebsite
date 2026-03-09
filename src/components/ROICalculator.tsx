import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, Users, TrendingUp, DollarSign } from 'lucide-react';

interface CalculatorInputs {
  businessType: 'small' | 'medium' | 'large';
  currentRevenue: number;
  teamSize: number;
  hoursPerWeekSpent: number;
}

const businessTypeBenefits = {
  small: {
    automationPercentage: 35,
    revenueGrowth: 35,
    laborCostSavings: 28000,
    productivityGain: 15
  },
  medium: {
    automationPercentage: 50,
    revenueGrowth: 55,
    laborCostSavings: 65000,
    productivityGain: 25
  },
  large: {
    automationPercentage: 65,
    revenueGrowth: 85,
    laborCostSavings: 145000,
    productivityGain: 40
  }
};

export function ROICalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    businessType: 'medium',
    currentRevenue: 500000,
    teamSize: 5,
    hoursPerWeekSpent: 40
  });

  const [showResults, setShowResults] = useState(true);

  const calculations = useMemo(() => {
    const benefits = businessTypeBenefits[inputs.businessType];

    const automatedProcesses = Math.floor(inputs.hoursPerWeekSpent * 0.6);
    const hoursFreedPerWeek = automatedProcesses;
    const hoursFreedPerYear = hoursFreedPerWeek * 52;
    const laborHourValue = (inputs.currentRevenue / (inputs.teamSize * 2000)) * hoursFreedPerWeek;
    const annualLaborSavings = laborHourValue * 52;

    const revenueIncrease = inputs.currentRevenue * (benefits.revenueGrowth / 100);
    const totalAnnualBenefit = annualLaborSavings + revenueIncrease + benefits.laborCostSavings;
    const monthlyBenefit = totalAnnualBenefit / 12;

    const setupAndTrainingCost = 1500;
    const monthlySoftwareCost = inputs.businessType === 'small' ? 375 : inputs.businessType === 'medium' ? 275 : 225;
    const annualSoftwareCost = (monthlySoftwareCost * 12) + setupAndTrainingCost;

    const netAnnualBenefit = totalAnnualBenefit - annualSoftwareCost;
    const roiPercentage = ((netAnnualBenefit / annualSoftwareCost) * 100).toFixed(0);
    const paybackPeriod = (annualSoftwareCost / monthlyBenefit).toFixed(1);

    return {
      automatedProcesses,
      hoursFreedPerWeek,
      hoursFreedPerYear,
      annualLaborSavings: Math.round(annualLaborSavings),
      revenueIncrease: Math.round(revenueIncrease),
      totalAnnualBenefit: Math.round(totalAnnualBenefit),
      monthlyBenefit: Math.round(monthlyBenefit),
      annualSoftwareCost,
      netAnnualBenefit: Math.round(netAnnualBenefit),
      roiPercentage: parseInt(roiPercentage),
      paybackPeriod: parseFloat(paybackPeriod)
    };
  }, [inputs]);

  const handleBusinessTypeChange = (type: 'small' | 'medium' | 'large') => {
    setInputs({ ...inputs, businessType: type });
    setShowResults(true);
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Calculate Your <span className="text-emerald-400">ROI</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See exactly how much time and money you'll save with KenjiAI. Most clients see payback in less than 30 days.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-400" />
              Your Business Profile
            </h3>

            {/* Business Type Selection */}
            <div className="mb-10">
              <label className="block text-sm font-bold text-gray-200 mb-4 uppercase tracking-wide">
                Business Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['small', 'medium', 'large'] as const).map((type) => (
                  <motion.button
                    key={type}
                    onClick={() => handleBusinessTypeChange(type)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all duration-300 capitalize ${
                      inputs.businessType === type
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-gray-800/50 border border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Current Revenue */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-200 mb-3 uppercase tracking-wide">
                Annual Revenue
              </label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-gray-400 font-semibold">$</span>
                <input
                  type="number"
                  value={inputs.currentRevenue}
                  onChange={(e) => setInputs({ ...inputs, currentRevenue: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">Per year before KenjiAI</p>
            </div>

            {/* Team Size */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-200 mb-3 uppercase tracking-wide">
                Team Size
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={inputs.teamSize}
                  onChange={(e) => setInputs({ ...inputs, teamSize: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 min-w-20 text-center">
                  <span className="text-white font-bold">{inputs.teamSize}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Team members</p>
            </div>

            {/* Hours Per Week */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-200 mb-3 uppercase tracking-wide">
                Admin Hours Per Week
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={inputs.hoursPerWeekSpent}
                  onChange={(e) => setInputs({ ...inputs, hoursPerWeekSpent: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 min-w-20 text-center">
                  <span className="text-white font-bold">{inputs.hoursPerWeekSpent}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Spent on manual processes</p>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Main ROI Card */}
            <motion.div
              animate={showResults ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.5 }}
              className="bg-gradient-to-br from-emerald-950/40 to-green-950/40 border border-emerald-500/40 rounded-3xl p-8"
              style={{ boxShadow: '0 0 40px rgba(16, 185, 129, 0.15)' }}
            >
              <div className="text-center mb-6">
                <p className="text-gray-300 text-sm font-semibold uppercase tracking-widest mb-3">Your Estimated Annual</p>
                <div className="flex items-end justify-center gap-2">
                  <span className="text-6xl font-black text-emerald-400">
                    {calculations.netAnnualBenefit.toLocaleString()}
                  </span>
                  <span className="text-2xl text-gray-400 mb-2">NET GAIN</span>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full mb-6"></div>
              <p className="text-center text-gray-300 text-sm">
                After software costs. Based on {inputs.businessType} business automation.
              </p>
            </motion.div>

            {/* 4 Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* ROI % */}
              <motion.div
                animate={showResults ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.5 }}
                className="bg-blue-900/30 border border-blue-500/30 rounded-2xl p-6 text-center"
              >
                <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-2">ROI</p>
                <p className="text-4xl font-black text-blue-400">{calculations.roiPercentage}%</p>
                <p className="text-gray-400 text-xs mt-2">Return on investment</p>
              </motion.div>

              {/* Payback Period */}
              <motion.div
                animate={showResults ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.5 }}
                className="bg-purple-900/30 border border-purple-500/30 rounded-2xl p-6 text-center"
              >
                <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-2">Payback Period</p>
                <p className="text-4xl font-black text-purple-400">{calculations.paybackPeriod}</p>
                <p className="text-gray-400 text-xs mt-2">Months to break even</p>
              </motion.div>

              {/* Monthly Benefit */}
              <motion.div
                animate={showResults ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.5 }}
                className="bg-cyan-900/30 border border-cyan-500/30 rounded-2xl p-6 text-center"
              >
                <p className="text-cyan-300 text-xs font-bold uppercase tracking-widest mb-2">Monthly Savings</p>
                <p className="text-3xl font-black text-cyan-400">
                  ${(calculations.monthlyBenefit).toLocaleString()}
                </p>
                <p className="text-gray-400 text-xs mt-2">Average per month</p>
              </motion.div>

              {/* Hours Freed */}
              <motion.div
                animate={showResults ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.5 }}
                className="bg-orange-900/30 border border-orange-500/30 rounded-2xl p-6 text-center"
              >
                <p className="text-orange-300 text-xs font-bold uppercase tracking-widest mb-2">Hours Freed</p>
                <p className="text-3xl font-black text-orange-400">{calculations.hoursFreedPerYear}</p>
                <p className="text-gray-400 text-xs mt-2">Per year for growth</p>
              </motion.div>
            </div>

            {/* Breakdown Card */}
            <motion.div
              animate={showResults ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.5 }}
              className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6"
            >
              <p className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Benefit Breakdown</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-300">Labor & Time Savings</span>
                  <span className="text-emerald-400 font-bold">${calculations.annualLaborSavings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-300">Revenue Growth Impact</span>
                  <span className="text-emerald-400 font-bold">${calculations.revenueIncrease.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-300 text-sm">Software + Setup Costs</span>
                  <span className="text-red-400 font-bold">-${calculations.annualSoftwareCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 mt-2 pt-3 border-t border-gray-700 bg-gray-800/30 px-3 rounded-lg">
                  <span className="text-white font-bold">Net Annual Benefit</span>
                  <span className="text-2xl font-black text-emerald-400">${calculations.netAnnualBenefit.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Ready to see these results in action? Book a personalized walkthrough and we'll show you exactly how KenjiAI will impact your specific business.
          </p>
          <motion.a
            href="https://go.mediatraffics.com/leads"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300"
          >
            <TrendingUp className="w-5 h-5" />
            Get Your Personalized ROI Analysis
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
