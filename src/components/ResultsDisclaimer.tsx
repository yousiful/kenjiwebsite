import React from 'react';
import { Link } from 'react-router-dom';

export function ResultsDisclaimer() {
  return (
    <div className="w-full py-8 my-6 border-t border-gray-800/80 bg-gray-950/60 rounded-xl px-4 text-center">
      <div className="max-w-4xl mx-auto space-y-3 text-xs text-gray-500">
        <p className="leading-relaxed text-gray-400">
          <strong>FTC Earnings & Results Disclaimer:</strong> Results vary significantly based on business model, existing sales infrastructure, lead volume, offer economics, and execution. KenjiAI makes no guarantees, promises, or representations regarding future earnings, revenue increases, or specific business performance. Case studies, client reviews, and examples cited on this site represent individual results and are not typical or guaranteed outcomes.
        </p>
        <p className="leading-relaxed text-[11px] text-gray-500">
          <strong>Meta & Platform Trademark Notice:</strong> This site is NOT a part of the Facebook™ or Meta™ website or Meta Platforms, Inc. Additionally, this site is NOT endorsed or sponsored by Meta Platforms, Inc. in any way. FACEBOOK™ and META™ are registered trademarks of META PLATFORMS, INC. Google™ and YouTube™ are trademarks of Google LLC.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-[11px] text-gray-400">
          <span>Nataki LLC / KenjiAI • 32 N Gould St, Sheridan, WY 82801</span>
          <span>•</span>
          <Link to="/terms" className="hover:text-blue-400 underline">Terms of Service</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-blue-400 underline">Privacy Policy</Link>
          <span>•</span>
          <Link to="/disclaimer" className="hover:text-blue-400 underline">Full Disclaimer</Link>
        </div>
      </div>
    </div>
  );
}

export default ResultsDisclaimer;
