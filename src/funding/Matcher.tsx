// "Which funding fits me?" Three questions that set the Finder's filters.
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { EMPTY_FILTERS, STATES, type Filters, type FundType } from './logic';

type Money = 'free' | 'repay' | 'equity' | 'any';
type StageAns = 'idea' | 'early' | 'growth' | 'established';

const Q1: [Money, string, string][] = [
  ['free', 'Free money only', 'Grants and competitions'],
  ['repay', 'I can repay it', 'Loans and revenue-based financing'],
  ['equity', 'I would sell a share', 'Accelerators, angels, funds'],
  ['any', 'Not sure yet', 'Show me everything'],
];
const Q2: [StageAns, string][] = [
  ['idea', 'Idea or not launched'],
  ['early', 'Launched, under 2 years'],
  ['growth', 'Growing, real revenue'],
  ['established', 'Established business'],
];

const TYPES: Record<Money, FundType[]> = {
  free: ['grant', 'competition'],
  repay: ['loan', 'rbf'],
  equity: ['equity'],
  any: [],
};

const NOTE: Record<Money, string> = {
  free: 'Showing grants and competitions that fit. These are competitive, so apply to several.',
  repay: 'Showing loans and revenue-based financing. Both are repaid, so compare the total cost before you sign.',
  equity: 'Showing accelerators and angel groups. They invest in exchange for part of your company.',
  any: 'Showing every type that fits, grants first.',
};

export default function Matcher({ onMatch }: { onMatch: (f: Partial<Filters>, note: string) => void }) {
  const [money, setMoney] = useState<Money | ''>('');
  const [stage, setStage] = useState<StageAns | ''>('');
  const [state, setState] = useState('');

  const go = () => {
    if (!money || !stage) return;
    onMatch({ ...EMPTY_FILTERS, types: TYPES[money], stage, state }, `${NOTE[money]}${state ? ' Programs limited to your state come first.' : ''}`);
  };

  const btn = (on: boolean) => `text-left border rounded-xl px-3 py-2.5 text-sm transition-colors ${on ? 'border-blue-400 bg-blue-500/15 text-white' : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500'}`;

  return (
    <section className="bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-blue-400/20 rounded-2xl p-5 sm:p-6 mb-8" aria-labelledby="ff-match" data-no-snapshot>
      <h2 id="ff-match" className="text-xl font-bold text-white flex items-center gap-2 mb-1"><Sparkles className="w-5 h-5 text-blue-300" /> Which funding fits me?</h2>
      <p className="text-sm text-gray-400 mb-5">Three quick questions. Your answers just set the filters below, nothing is saved.</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <fieldset>
          <legend className="text-sm font-semibold text-gray-200 mb-2">1. How do you feel about paying it back?</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {Q1.map(([k, label, sub]) => (
              <button key={k} type="button" aria-pressed={money === k} onClick={() => setMoney(k)} className={btn(money === k)}>
                <span className="font-semibold block">{label}</span><span className="text-xs text-gray-400">{sub}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-semibold text-gray-200 mb-2">2. Where is the business today?</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {Q2.map(([k, label]) => (
              <button key={k} type="button" aria-pressed={stage === k} onClick={() => setStage(k)} className={btn(stage === k)}>{label}</button>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="ff-match-state" className="text-sm font-semibold text-gray-200 mb-2 block">3. Which state are you in?</label>
          <select id="ff-match-state" value={state} onChange={(e) => setState(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-400">
            <option value="">Skip this</option>
            {STATES.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button type="button" onClick={go} disabled={!money || !stage} className="w-full mt-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
            Show my matches
          </button>
          {(!money || !stage) && <p className="text-xs text-gray-500 mt-2">Answer the first two to see matches.</p>}
        </div>
      </div>
    </section>
  );
}
