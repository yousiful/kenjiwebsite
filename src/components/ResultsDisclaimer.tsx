import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ResultsDisclaimer() {
  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-sm sm:text-base font-bold text-yellow-400 mb-2">Important Disclaimer: Results May Vary</h3>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-2">
            Any claims, statistics, or examples of revenue increases, ROI percentages, time savings, or business growth are for illustrative purposes only and do not guarantee that you will achieve similar results. Individual results vary based on numerous factors including your business model, industry, experience, effort, and market conditions.
          </p>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            <strong className="text-yellow-400">We make no guarantees regarding your potential results, earnings, or business outcomes.</strong> Your success depends entirely on your own efforts, decisions, and circumstances. Please review our full{' '}
            <Link to="/disclaimer" className="text-blue-400 hover:text-blue-300 underline">
              disclaimer
            </Link>
            {' '}for complete details.
          </p>
        </div>
      </div>
    </div>
  );
}
