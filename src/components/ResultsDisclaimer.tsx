import React from 'react';
import { Link } from 'react-router-dom';

export function ResultsDisclaimer() {
  return (
    <p className="text-gray-600 text-xs text-center max-w-2xl mx-auto px-4">
      Results vary and are not guaranteed. Any figures, guarantees, or examples referenced are illustrative, not typical.
      This site is not part of, or endorsed by, Facebook/Meta or Google. See our{' '}
      <Link to="/disclaimer" className="underline hover:text-blue-400">full disclaimer</Link>.
    </p>
  );
}
export default ResultsDisclaimer;
