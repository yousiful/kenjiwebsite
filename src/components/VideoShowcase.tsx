import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronRight } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: 'demo' | 'testimonial' | 'tutorial';
  views?: number;
}

const VIDEOS: Video[] = [
  {
    id: 'demo-1',
    title: 'Complete Platform Walkthrough',
    description: 'See every feature of KenjiAI in action - from AI voice agents to automation workflows',
    thumbnail: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    duration: '12:34',
    category: 'demo',
    views: 2847
  },
  {
    id: 'testimonial-1',
    title: 'How We Generate $500K/Month',
    description: 'Real case study: How a service-based business scaled 10x with KenjiAI automation',
    thumbnail: 'https://images.pexels.com/photos/3182747/pexels-photo-3182747.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    duration: '8:16',
    category: 'testimonial',
    views: 5234
  },
  {
    id: 'tutorial-1',
    title: 'Setting Up Your First AI Agent (5 Minutes)',
    description: 'Step-by-step guide to launch your first AI voice agent without any code',
    thumbnail: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    duration: '5:42',
    category: 'tutorial',
    views: 3912
  },
  {
    id: 'testimonial-2',
    title: 'From Manual to Automated in 7 Days',
    description: 'See how a CRM manager automated 30 hours of weekly work using KenjiAI workflows',
    thumbnail: 'https://images.pexels.com/photos/3183196/pexels-photo-3183196.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    duration: '9:28',
    category: 'testimonial',
    views: 4156
  },
  {
    id: 'tutorial-2',
    title: 'Email Sequences That Convert (Complete Guide)',
    description: 'Learn how to build email automation sequences that generate revenue on autopilot',
    thumbnail: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    duration: '14:07',
    category: 'tutorial'
  },
  {
    id: 'demo-2',
    title: 'AI Voice Agents Explained',
    description: 'Understand how AI voice agents answer calls, qualify leads, and schedule appointments',
    thumbnail: 'https://images.pexels.com/photos/3182818/pexels-photo-3182818.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    duration: '11:22',
    category: 'demo',
    views: 6821
  }
];

const categoryLabels = {
  demo: 'Product Demo',
  testimonial: 'Success Story',
  tutorial: 'How-To Guide'
};

const categoryColors = {
  demo: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  testimonial: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  tutorial: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
};

export function VideoShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'demo' | 'testimonial' | 'tutorial'>('all');
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);

  const filteredVideos = selectedCategory === 'all'
    ? VIDEOS
    : VIDEOS.filter(v => v.category === selectedCategory);

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900/0 via-gray-900/20 to-gray-900/0">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Learn from <span className="text-blue-400">Real Examples</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Watch how successful businesses are using KenjiAI to save time, reduce costs, and grow revenue
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          {(['all', 'demo', 'testimonial', 'tutorial'] as const).map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-800/50 border border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              {category === 'all' ? 'All Videos' : categoryLabels[category]}
            </motion.button>
          ))}
        </motion.div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
              className="group relative bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm cursor-pointer hover:border-gray-600 transition-all duration-300"
            >
              {/* Thumbnail Container */}
              <div className="relative w-full h-48 overflow-hidden bg-gray-800">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Play Button Overlay */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors duration-300"
                >
                  <motion.div
                    animate={hoveredVideo === video.id ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-2xl"
                  >
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </motion.div>
                </motion.div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-black/80 px-2.5 py-1 rounded text-xs font-bold text-white">
                  {video.duration}
                </div>

                {/* Category Badge */}
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold border ${categoryColors[video.category]}`}>
                  {categoryLabels[video.category]}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {video.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                  {video.description}
                </p>

                {/* Footer Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  {video.views && (
                    <span className="text-xs text-gray-500">
                      {(video.views / 1000).toFixed(1)}K views
                    </span>
                  )}
                  <motion.button
                    whileHover={{ x: 4 }}
                    className="text-blue-400 hover:text-blue-300 font-semibold text-sm flex items-center gap-1 transition-colors"
                  >
                    Watch Now
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Hover Border Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-3xl p-10"
        >
          <h3 className="text-2xl font-bold text-white mb-3">Want to See More?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Schedule a personalized demo and our team will walk you through how KenjiAI works for your specific business.
          </p>
          <motion.a
            href="https://go.mediatraffics.com/leads"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
          >
            <Play className="w-5 h-5" />
            Schedule Your Demo
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
