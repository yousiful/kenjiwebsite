import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageSchema from '../components/PageSchema';
import { Percent, ArrowRight, Copy, Check, Share2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const money = (n: number) => {
  const abs = Math.abs(n);
  const s = abs < 100 && abs % 1 !== 0
    ? abs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.round(abs).toLocaleString();
  return `${n < 0 ? '-' : ''}$${s}`;
};
const pct = (n: number) => `${Number.isFinite(n) ? n.toFixed(1) : '0.0'}%`;

interface FieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
}

const Field: React.FC<FieldProps> = ({ label, hint, value, onChange, prefix, suffix, step = 1 }) => (
  <label className="block">
    <span className="text-sm font-medium text-gray-300">{label}</span>
    <div className="mt-1.5 flex items-center rounded-lg border border-gray-700 bg-gray-900/70 focus-within:border-blue-500">
      {prefix && <span className="pl-3 text-gray-500 text-sm">{prefix}</span>}
      <input
        type="number"
        inputMode="decimal"
        min={0}
        step={step}
        value={Number.isFinite(value) ? value : ''}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="w-full min-w-0 bg-transparent px-3 py-2.5 text-white text-base outline-none"
      />
      {suffix && <span className="pr-3 text-gray-500 text-sm">{suffix}</span>}
    </div>
    {hint && <span className="mt-1 block text-[11px] text-gray-500">{hint}</span>}
  </label>
);

const REFERENCE_MARGINS = [10, 20, 25, 30, 40, 50, 60, 70];

const ProfitMarginCalculatorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';

  const [cost, setCost] = useState(600);
  const [price, setPrice] = useState(1000);
  const [targetMargin, setTargetMargin] = useState(50);
  const [jobs, setJobs] = useState(20);
  const [copied, setCopied] = useState(false);

  const r = useMemo(() => {
    const profit = price - cost;
    const margin = price > 0 ? (profit / price) * 100 : 0;
    const markup = cost > 0 ? (profit / cost) * 100 : 0;
    const monthlyProfit = profit * jobs;
    const safeTarget = Math.min(targetMargin, 99);
    const targetPrice = cost / (1 - safeTarget / 100);
    const targetMarkup = cost > 0 ? ((targetPrice - cost) / cost) * 100 : 0;
    const raise = targetPrice - price;
    const status: 'healthy' | 'thin' | 'loss' = profit <= 0 ? 'loss' : margin >= targetMargin ? 'healthy' : 'thin';
    return { profit, margin, markup, monthlyProfit, safeTarget, targetPrice, targetMarkup, raise, status };
  }, [cost, price, targetMargin, jobs]);

  const verdict = {
    healthy: {
      icon: TrendingUp,
      color: 'text-emerald-300',
      box: 'border-emerald-500/40 bg-emerald-950/40',
      title: 'You are at or above your target margin',
      body: `You keep ${money(r.profit)} of every ${money(price)} job. At ${jobs} jobs a month that is ${money(r.monthlyProfit)} before overhead like rent, software, and your own pay.`,
    },
    thin: {
      icon: Minus,
      color: 'text-amber-300',
      box: 'border-amber-500/40 bg-amber-950/30',
      title: 'Your margin is under your target',
      body: `To hit a ${pct(r.safeTarget)} margin you need to charge ${money(r.targetPrice)}, which is ${money(r.raise)} more per job. Or bring your cost down to ${money(price * (1 - r.safeTarget / 100))} at today's price.`,
    },
    loss: {
      icon: TrendingDown,
      color: 'text-red-300',
      box: 'border-red-500/40 bg-red-950/30',
      title: 'This price loses money',
      body: `Your cost is ${money(cost)} and you charge ${money(price)}. Every job at this price costs you ${money(Math.abs(r.profit))}. A ${pct(r.safeTarget)} margin needs a price of ${money(r.targetPrice)}.`,
    },
  }[r.status];
  const VerdictIcon = verdict.icon;

  const embedCode = `<iframe src="https://kenjiai.com/tools/profit-margin-calculator?embed=true" width="100%" height="900" frameborder="0" style="border:1px solid #1f2937;border-radius:16px;" title="Profit Margin and Markup Calculator"></iframe>
<p style="font-size:12px;color:#9ca3af;text-align:center;margin-top:8px;font-family:sans-serif;">Calculator by <a href="https://kenjiai.com" target="_blank" style="color:#3b82f6;">KenjiAI</a></p>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const faqs = [
    {
      q: 'What is the difference between margin and markup?',
      a: 'Both use the same profit, they divide by different numbers. Margin is profit divided by the price. Markup is profit divided by your cost. A job that costs $600 and sells for $1,000 has a $400 profit, a 40% margin, and a 66.7% markup.',
    },
    {
      q: 'How do I calculate profit margin?',
      a: 'Subtract your cost from your price, then divide by the price and multiply by 100. ($1,000 - $600) / $1,000 = 0.40, so a 40% margin.',
    },
    {
      q: 'How do I calculate markup?',
      a: 'Subtract your cost from your price, then divide by your cost and multiply by 100. ($1,000 - $600) / $600 = 0.667, so a 66.7% markup.',
    },
    {
      q: 'What price do I charge to get a certain margin?',
      a: 'Divide your cost by (1 minus the margin you want). For a 50% margin on a $600 job: $600 / 0.50 = $1,200. Adding 50% to your cost only gets you $900, which is a 33% margin.',
    },
    {
      q: 'What is a good profit margin for a service business?',
      a: 'Most trades and home service businesses aim for a 40% to 60% gross margin on each job, because rent, trucks, insurance, software, and the owner\'s salary still have to come out of what is left. Under 30% gross usually leaves very little once overhead is paid.',
    },
    {
      q: 'Should I count my own labor in the cost?',
      a: 'Yes. Put in what you would pay someone else to do the work, even if you do it yourself. If you leave it out, the margin looks great on paper and you end up working for free.',
    },
  ];

  return (
    <div className={`min-h-screen ${isEmbed ? 'bg-gray-900 p-4' : 'pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-white'}`}>
      <PageSchema path="/tools/profit-margin-calculator" name={"Profit Margin & Markup Calculator"} description={"Free profit margin and markup calculator for service businesses. Enter your cost and price to get margin, markup, and profit, or pick a target margin and get the price to charge."} />
      <Helmet>
        <title>Profit Margin & Markup Calculator | KenjiAI</title>
        <meta
          name="description"
          content="Free profit margin and markup calculator for service businesses. Enter your cost and price to get margin, markup, and profit, or pick a target margin and get the price to charge."
        />
        <link rel="canonical" href="https://kenjiai.com/tools/profit-margin-calculator" />
        <meta property="og:title" content="Profit Margin & Markup Calculator | KenjiAI" />
        <meta property="og:description" content="See your real margin and markup on every job, and the price you need to charge to hit your target." />
        <meta property="og:url" content="https://kenjiai.com/tools/profit-margin-calculator" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'KenjiAI Profit Margin & Markup Calculator',
                applicationCategory: 'BusinessApplication',
                operatingSystem: 'Web',
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                publisher: { '@type': 'Organization', name: 'KenjiAI', url: 'https://kenjiai.com' },
              },
              {
                '@type': 'FAQPage',
                mainEntity: faqs.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              },
            ],
          })}
        </script>
      </Helmet>

      <div className="max-w-5xl mx-auto">
        {!isEmbed && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Percent className="w-3.5 h-3.5" />
              Free Tool
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Profit Margin & Markup Calculator
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              Enter what a job costs you and what you charge. See your margin, your markup, and the price you need to hit the margin you want.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-gray-800/80 border border-gray-700/70 rounded-2xl p-6 sm:p-8 space-y-5">
            <Field
              label="Your cost per job"
              prefix="$"
              value={cost}
              onChange={setCost}
              step={10}
              hint="Labor (including your own time), materials, subcontractors, and any fees tied to this job."
            />
            <Field label="What you charge the customer" prefix="$" value={price} onChange={setPrice} step={10} />
            <Field
              label="Target profit margin"
              suffix="%"
              value={targetMargin}
              onChange={(v) => setTargetMargin(Math.min(99, v))}
              hint="Many service businesses aim for 40-60% so overhead and owner pay are covered."
            />
            <Field label="Jobs per month" value={jobs} onChange={setJobs} hint="Used only for the monthly profit figure." />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Profit margin</span>
                <div className={`text-3xl font-extrabold mt-1 ${r.profit >= 0 ? 'text-white' : 'text-red-300'}`}>{pct(r.margin)}</div>
              </div>
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Markup</span>
                <div className="text-3xl font-extrabold text-blue-300 mt-1">{pct(r.markup)}</div>
              </div>
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Profit per job</span>
                <div className={`text-2xl font-bold mt-1 ${r.profit >= 0 ? 'text-white' : 'text-red-300'}`}>{money(r.profit)}</div>
              </div>
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Profit per month</span>
                <div className={`text-2xl font-bold mt-1 ${r.monthlyProfit >= 0 ? 'text-white' : 'text-red-300'}`}>{money(r.monthlyProfit)}</div>
                <span className="text-[11px] text-gray-500">{jobs} jobs</span>
              </div>
            </div>

            <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Price for a {pct(r.safeTarget)} margin</span>
              <div className="text-3xl font-extrabold mt-1 text-emerald-300">{money(r.targetPrice)}</div>
              <span className="text-[11px] text-gray-500">
                That is a {pct(r.targetMarkup)} markup on your {money(cost)} cost.
                {r.raise > 0.005 ? ` ${money(r.raise)} more than you charge now.` : ' You already charge this or more.'}
              </span>
            </div>

            <div className={`rounded-xl border p-4 ${verdict.box}`}>
              <div className={`flex items-center gap-2 font-bold ${verdict.color}`}>
                <VerdictIcon className="w-5 h-5 shrink-0" />
                {verdict.title}
              </div>
              <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">{verdict.body}</p>
            </div>

            <a
              href="https://kenjiai.com/growth-quiz"
              target={isEmbed ? '_blank' : '_self'}
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm text-center transition-colors"
            >
              Want more jobs at that price? Take the 60-second quiz
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>

        <div className="mt-10 bg-gray-800/60 border border-gray-700/70 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white mb-1">Margin to markup cheat sheet</h2>
          <p className="text-sm text-gray-400 mb-4">
            Adding 30% to your cost does not give you a 30% margin. Here is the markup each margin really takes, and the price on your {money(cost)} cost.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-gray-400">
                  <th className="py-2 pr-4 font-medium">Margin</th>
                  <th className="py-2 pr-4 font-medium">Markup needed</th>
                  <th className="py-2 font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {REFERENCE_MARGINS.map((m) => (
                  <tr key={m} className="border-t border-gray-700/60 text-gray-200">
                    <td className="py-2 pr-4">{m}%</td>
                    <td className="py-2 pr-4">{pct((m / (100 - m)) * 100)}</td>
                    <td className="py-2">{money(cost / (1 - m / 100))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {!isEmbed && (
          <>
            <div className="mt-16 border-t border-gray-800 pt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Margin and markup questions people ask</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                {faqs.map((f) => (
                  <div key={f.q} className="bg-gray-800/40 border border-gray-800 rounded-xl p-5">
                    <h3 className="font-semibold text-white mb-2">{f.q}</h3>
                    <p className="text-gray-400 leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                <Share2 className="w-4 h-4" />
                Embed this calculator
              </div>
              <p className="text-sm text-gray-400 mb-4">Free to use on your own site or blog. Paste this snippet.</p>
              <div className="relative">
                <pre className="bg-gray-950/80 border border-gray-800 text-gray-300 p-4 pt-12 sm:pt-4 rounded-xl text-xs overflow-x-auto font-mono">{embedCode}</pre>
                <button
                  type="button"
                  onClick={copyEmbed}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy code'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfitMarginCalculatorPage;
