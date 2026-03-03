import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Bell, MessageSquare, Star, Heart, Gamepad2, Share2 } from 'lucide-react';

const EngagementEngine: React.FC = () => {
  const [activeUser, setActiveUser] = useState(0);
  const [communityStats, setCommunityStats] = useState({
    activeUsers: 47293,
    dailyInteractions: 156847,
    communityScore: 9.2
  });

  const engagementFeatures = [
    {
      icon: Gamepad2,
      title: "Gamified Experience",
      description: "Achievement systems, progress tracking, and rewards that make business growth addictive",
      metric: "89% daily return rate",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Connect with like-minded entrepreneurs, share wins, and collaborate on growth",
      metric: "50K+ active community",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "AI-powered alerts that deliver value, not noise. Perfectly timed insights.",
      metric: "94% open rate",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: MessageSquare,
      title: "Feedback Loop",
      description: "Your voice shapes our roadmap. Every suggestion is heard and considered.",
      metric: "72% feature adoption",
      color: "from-orange-500 to-red-600"
    }
  ];

  const userJourney = [
    { stage: "Discovery", users: "New Users", count: 1247, color: "text-blue-400" },
    { stage: "Activation", users: "Active Users", count: 8934, color: "text-green-400" },
    { stage: "Engagement", users: "Power Users", count: 23567, color: "text-purple-400" },
    { stage: "Advocacy", users: "Champions", count: 12849, color: "text-pink-400" }
  ];

  const achievements = [
    { title: "First Sale", description: "Closed your first AI-assisted deal", icon: Trophy, rarity: "Common" },
    { title: "Automation Master", description: "Set up 10+ automated workflows", icon: Star, rarity: "Rare" },
    { title: "Community Leader", description: "Helped 50+ community members", icon: Heart, rarity: "Epic" },
    { title: "Growth Hacker", description: "Achieved 300% ROI milestone", icon: Trophy, rarity: "Legendary" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUser((prev) => (prev + 1) % userJourney.length);
      setCommunityStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10),
        dailyInteractions: prev.dailyInteractions + Math.floor(Math.random() * 50),
        communityScore: Math.min(10, prev.communityScore + Math.random() * 0.01)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [userJourney.length]);

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative overflow-hidden">
      {/* Community Network Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-400/5"></div>
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/40 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              The Engagement Engine
            </span>
            <br />
            <span className="text-white">Building Loyal Communities</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            A community of entrepreneurs helping each other succeed
          </p>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-3xl p-8 text-center"
            data-caption="Active community members engaging daily"
          >
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <div className="text-4xl font-bold text-white mb-2">{communityStats.activeUsers.toLocaleString()}</div>
            <div className="text-purple-400 font-semibold">Active Users</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-3xl p-8 text-center"
            data-caption="Daily interactions within our community"
          >
            <MessageSquare className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <div className="text-4xl font-bold text-white mb-2">{communityStats.dailyInteractions.toLocaleString()}</div>
            <div className="text-blue-400 font-semibold">Daily Interactions</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-3xl p-8 text-center"
            data-caption="Community satisfaction and engagement score"
          >
            <Star className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <div className="text-4xl font-bold text-white mb-2">{communityStats.communityScore.toFixed(1)}/10</div>
            <div className="text-green-400 font-semibold">Community Score</div>
          </motion.div>
        </motion.div>

        {/* Engagement Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {engagementFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gray-800/50 border border-gray-700 hover:border-purple-400/50 rounded-2xl p-8 transition-all duration-300"
              data-caption={`${feature.title}: ${feature.metric}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">{feature.description}</p>
                  <div className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg text-sm font-semibold inline-block">
                    {feature.metric}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* User Journey */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 mb-16"
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">User Journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {userJourney.map((stage, index) => (
              <motion.div
                key={stage.stage}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`p-6 rounded-2xl transition-all duration-500 ${
                  index === activeUser
                    ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-400/50'
                    : 'bg-gray-700/30 border border-gray-600'
                }`}
                data-caption={`${stage.stage}: ${stage.count} ${stage.users.toLowerCase()}`}
              >
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${stage.color}`}>{stage.count.toLocaleString()}</div>
                  <div className="text-white font-semibold mb-1">{stage.users}</div>
                  <div className="text-gray-400 text-sm">{stage.stage}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievement System */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-br from-gray-800/50 to-purple-900/20 border border-gray-700 rounded-3xl p-8"
        >
          <div className="text-center mb-8">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-4">Achievement System</h3>
            <p className="text-gray-400">Unlock achievements as you grow your business with KenjiAI</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-700/30 border border-gray-600 hover:border-yellow-400/50 rounded-2xl p-6 text-center transition-all duration-300"
                data-caption={`${achievement.title}: ${achievement.description}`}
              >
                <achievement.icon className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">{achievement.title}</h4>
                <p className="text-gray-400 text-sm mb-3">{achievement.description}</p>
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  achievement.rarity === 'Legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                  achievement.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-400' :
                  achievement.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {achievement.rarity}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EngagementEngine;