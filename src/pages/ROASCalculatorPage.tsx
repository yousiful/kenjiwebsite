import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowRight, Copy, Check, Share2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const money = (n: number) =>
  `${n < 0 ? '-' : ''}$${Math.abs(Math.round(n)).toLocaleString()}`;

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
        className="w-full bg-transparent px-3 py-2.5 text-white text-base outline-none"
      />
      {suffix && <span className="pr-3 text-gray-500 text-sm">{suffix}</span>}
    </div>
    {hint && <span className="mt-1 block text-[11px] text-gray-500">{hint}</span>}
  </label>
);

const ROASCalculatorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';

  const [spend, setSpend] = useState(3000);
  const [revenue, setRevenue] = useState(9000);
  const [aov, setAov] = useState(150);
  const [margin, setMargin] = useState(40);
  const [copied, setCopied] = useState(false);

  const r = useMemo(() => {
    const roas = spend > 0 ? revenue / spend : 0;
    const breakEven = margin > 0 ? 100 / margin : 0;
    const grossProfit = revenue * (margin / 100);
    const profitAfterAds = grossProfit - spend;
    const purchases = aov > 0 ? revenue / aov : 0;
    const cpa = purchases > 0 ? spend / purchases : 0;
    const maxCpa = aov * (margin / 100);
    const acos = revenue > 0 ? (spend / revenue) * 100 : 0;
    const status: 'profit' | 'even' | 'loss' =
      breakEven === 0 ? 'loss' : roas > breakEven * 1.03 ? 'profit' : roas >= breakEven * 0.97 ? 'even' : 'loss';
    return { roas, breakEven, grossProfit, profitAfterAds, purchases, cpa, maxCpa, acos, status };
  }, [spend, revenue, aov, margin]);

  const verdict = {
    profit: {
      icon: TrendingUp,
      color: 'text-emerald-300',
      box: 'border-emerald-500/40 bg-emerald-950/40',
      title: 'Your ads are making money',
      body: `You clear break-even by ${(r.roas - r.breakEven).toFixed(2)}x. This campaign can take more budget. Raise spend 20% at a time and watch that ROAS holds above ${r.breakEven.toFixed(2)}.`,
    },
    even: {
      icon: Minus,
      color: 'text-amber-300',
      box: 'border-amber-500/40 bg-amber-950/30',
      title: 'You are roughly breaking even',
      body: `Your ads pay for themselves and leave almost nothing over. Get your cost per purchase under ${money(r.maxCpa)} or raise your order value before adding budget.`,
    },
    loss: {
      icon: TrendingDown,
      color: 'text-red-300',
      box: 'border-red-500/40 bg-red-950/30',
      title: 'Your ads are losing money',
      body: `You need a ${r.breakEven.toFixed(2)} ROAS to break even and you are at ${r.roas.toFixed(2)}. Fix the offer, the targeting, or the follow-up before you spend more.`,
    },
  }[r.status];
  const VerdictIcon = verdict.icon;

  const embedCode = `<iframe src="https://kenjiai.com/tools/roas-calculator?embed=true" width="100%" height="820" frameborder="0" style="border:1px solid #1f2937;border-radius:16px;" title="ROAS and Break-Even Calculator"></iframe>
<p style="font-size:12px;color:#9ca3af;text-align:center;margin-top:8px;font-family:sans-serif;">Calculator by <a href="https://kenjiai.com" target="_blank" style="color:#3b82f6;">KenjiAI</a></p>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const faqs = [
    {
      q: 'What is ROAS?',
      a: 'Return on ad spend. Revenue from ads divided by what you spent on those ads. Spend $1,000 and make $4,000 and your ROAS is 4.0.',
    },
    {
      q: 'What is a good ROAS?',
      a: 'Whatever clears your break-even ROAS. A business with 25% margins needs a 4.0 just to break even, while a business with 70% margins is profitable at 1.5. That is why a single "good ROAS" number is misleading.',
    },
    {
      q: 'How do you calculate break-even ROAS?',
      a: 'Divide 1 by your gross profit margin. At a 40% margin, 1 / 0.40 = 2.5. Anything under 2.5 loses money once product and delivery costs come out.',
    },
    {
      q: 'What is the most I can pay to get one customer?',
      a: 'Your average order value times your margin. At a $150 order and 40% margin you can pay up to $60 per purchase before the sale stops making money. Repeat buyers raise that ceiling.',
    },
    {
      q: 'Is ROAS the same as ROI?',
      a: 'No. ROAS only looks at revenue against ad spend. ROI subtracts all your costs, including product, labor, and software. A campaign can show a 3.0 ROAS and still lose money.',
    },
  ];

  return (
    <div className={`min-h-screen ${isEmbed ? 'bg-gray-900 p-4' : 'pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-white'}`}>
      <Helmet>
        <title>ROAS Calculator & Break-Even ROAS Calculator | KenjiAI</title>
        <meta
          name="description"
          content="Free ROAS calculator. Enter ad spend, revenue, order value, and margin to get your ROAS, break-even ROAS, max cost per purchase, and profit after ad spend."
        />
        <link rel="canonical" href="https://kenjiai.com/tools/roas-calculator" />
        <meta property="og:title" content="ROAS & Break-Even Calculator | KenjiAI" />
        <meta property="og:description" content="Find out if your ads are actually making money, and the most you can pay per customer." />
        <meta property="og:url" content="https://kenjiai.com/tools/roas-calculator" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'KenjiAI ROAS & Break-Even Calculator',
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
              <Calculator className="w-3.5 h-3.5" />
              Free Tool
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              ROAS & Break-Even Calculator
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              Find out if your ads are actually making money once your costs come out, and the most you can afford to pay for one customer.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-gray-800/80 border border-gray-700/70 rounded-2xl p-6 sm:p-8 space-y-5">
            <Field label="Monthly ad spend" prefix="$" value={spend} onChange={setSpend} step={50} />
            <Field label="Revenue from those ads" prefix="$" value={revenue} onChange={setRevenue} step={50} />
            <Field label="Average order value" prefix="$" value={aov} onChange={setAov} hint="What one customer pays you on a typical purchase." />
            <Field
              label="Gross profit margin"
              suffix="%"
              value={margin}
              onChange={(v) => setMargin(Math.min(100, v))}
              hint="What is left after product, delivery, and labor. Service businesses often sit at 50-70%, e-commerce at 20-40%."
            />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Your ROAS</span>
                <div className="text-3xl font-extrabold text-white mt-1">{r.roas.toFixed(2)}</div>
              </div>
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Break-even ROAS</span>
                <div className="text-3xl font-extrabold text-blue-300 mt-1">{r.breakEven.toFixed(2)}</div>
              </div>
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Cost per purchase</span>
                <div className="text-2xl font-bold text-white mt-1">{money(r.cpa)}</div>
                <span className="text-[11px] text-gray-500">{Math.round(r.purchases)} purchases</span>
              </div>
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Max you can pay</span>
                <div className="text-2xl font-bold text-white mt-1">{money(r.maxCpa)}</div>
                <span className="text-[11px] text-gray-500">per customer</span>
              </div>
            </div>

            <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Profit after ad spend</span>
              <div className={`text-3xl font-extrabold mt-1 ${r.profitAfterAds >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                {money(r.profitAfterAds)} <span className="text-sm font-normal text-gray-400">/ month</span>
              </div>
              <span className="text-[11px] text-gray-500">
                {money(r.grossProfit)} gross profit minus {money(spend)} ad spend. Ad cost is {r.acos.toFixed(0)}% of revenue.
              </span>
            </div>

            <div className={`rounded-xl border p-4 ${verdict.box}`}>
              <div className={`flex items-center gap-2 font-bold ${verdict.color}`}>
                <VerdictIcon className="w-5 h-5" />
                {verdict.title}
              </div>
              <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">{verdict.body}</p>
            </div>

            <a
              href="https://kenjiai.com/growth-quiz"
              target={isEmbed ? '_blank' : '_self'}
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
            >
              Want us to look at your ads? Take the 60-second quiz
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {!isEmbed && (
          <>
            <div className="mt-16 border-t border-gray-800 pt-12">
              <h2 className="text-2xl font-bold text-white mb-6">ROAS questions people ask</h2>
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
                <pre className="bg-gray-950/80 border border-gray-800 text-gray-300 p-4 rounded-xl text-xs overflow-x-auto font-mono">{embedCode}</pre>
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

export default ROASCalculatorPage;
