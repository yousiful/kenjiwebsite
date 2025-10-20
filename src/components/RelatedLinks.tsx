import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { InternalLink } from '../utils/internalLinks';

interface RelatedLinksProps {
  links: InternalLink[];
  title?: string;
  variant?: 'sidebar' | 'inline' | 'grid' | 'list';
  className?: string;
}

const RelatedLinks: React.FC<RelatedLinksProps> = ({
  links,
  title = 'Related Solutions',
  variant = 'grid',
  className = ''
}) => {
  if (!links || links.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (variant === 'sidebar') {
    return (
      <aside className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-6 ${className}`}>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          {title}
        </h3>
        <ul className="space-y-3">
          {links.map((link, index) => (
            <motion.li
              key={link.url + index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={link.url}
                title={link.title}
                className="group flex items-start gap-2 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0 text-blue-400 group-hover:translate-x-1 transition-transform" />
                <span className="text-sm">{link.anchorText}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </aside>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
        <span className="text-gray-400 text-sm font-medium">Explore:</span>
        {links.map((link, index) => (
          <React.Fragment key={link.url + index}>
            <Link
              to={link.url}
              title={link.title}
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium hover:underline"
            >
              {link.anchorText}
            </Link>
            {index < links.length - 1 && (
              <span className="text-gray-600">•</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 ${className}`}>
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={link.url + index}>
              <Link
                to={link.url}
                title={link.title}
                className="group flex items-center justify-between text-gray-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-gray-700/30"
              >
                <span className="font-medium">{link.anchorText}</span>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <section className={`${className}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link, index) => (
            <motion.div
              key={link.url + index}
              variants={itemVariants}
            >
              <Link
                to={link.url}
                title={link.title}
                className="group block bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {link.anchorText}
                  </h3>
                  <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </div>
                {link.title && (
                  <p className="text-gray-400 text-sm">
                    {link.title}
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default RelatedLinks;
