import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface RelatedSolution {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
  color: string;
}

interface RelatedSolutionsProps {
  solutions: RelatedSolution[];
  title?: string;
  subtitle?: string;
}

export function RelatedSolutions({
  solutions,
  title = "Related Solutions",
  subtitle
}: RelatedSolutionsProps) {
  return (
    <section className="py-16 px-4" style={{ backgroundColor: '#0B0E14' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.path}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={solution.path}
                className="group block h-full bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${solution.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <solution.icon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                  {solution.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {solution.description}
                </p>

                <div className="flex items-center gap-2 text-green-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
