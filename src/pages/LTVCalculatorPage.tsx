import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageSchema from '../components/PageSchema';
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
      {suffix && <span className="pr-3 text-gray-500 text-sm whitespace-nowrap">{suffix}</span>}
    </div>
    {hint && <span className="mt-1 block text-[11px] text-gray-500">{hint}</span>}
  </label>
);

const LTVCalculatorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';

  const [aov, setAov] = useState(200);
  const [frequency, setFrequency] = useState(4);
  const [lifespan, setLifespan] = useState(3);
  const [margin, setMargin] = useState(50);
  const [cac, setCac] = useState(300);
  const [copied, setCopied] = useState(false);

  const r = useMemo(() => {
    const revenueLtv = aov * frequency * lifespan;
    const ltv = revenueLtv * (margin / 100);
    const ratio = cac > 0 ? ltv / cac : 0;
    const maxCac = ltv / 3;
    const monthlyProfit = (aov * frequency * (margin / 100)) / 12;
    const payback = monthlyProfit > 0 ? cac / monthlyProfit : 0;
    const status: 'profit' | 'even' | 'loss' = ratio >= 3 ? 'profit' : ratio >= 1 ? 'even' : 'loss';
    return { revenueLtv, ltv, ratio, maxCac, monthlyProfit, payback, status };
  }, [aov, frequency, lifespan, margin, cac]);

  const verdict = {
    profit: {
      icon: TrendingUp,
      color: 'text-emerald-300',
      box: 'border-emerald-500/40 bg-emerald-950/40',
      title: 'Healthy LTV:CAC ratio',
      body:
        r.ratio > 5
          ? `At ${r.ratio.toFixed(1)}:1 you are likely underspending. You could pay up to ${money(r.maxCac)} per customer and still hold 3:1, which means more budget and faster growth.`
          : `Each customer returns ${r.ratio.toFixed(1)}x what it costs to get them. You have room to spend up to ${money(r.maxCac)} per customer and stay at 3:1.`,
    },
    even: {
      icon: Minus,
      color: 'text-amber-300',
      box: 'border-amber-500/40 bg-amber-950/30',
      title: 'Thin margin for error',
      body: `You make money on each customer, but not much once overhead comes out. Get your cost per customer under ${money(r.maxCac)} or get customers buying more often before adding budget.`,
    },
    loss: {
      icon: TrendingDown,
      color: 'text-red-300',
      box: 'border-red-500/40 bg-red-950/30',
      title: 'You lose money on every customer',
      body: `A customer is worth ${money(r.ltv)} in gross profit and costs ${money(cac)} to get. Fix the offer, the follow-up, or repeat sales before you spend more on ads.`,
    },
  }[r.status];
  const VerdictIcon = verdict.icon;

  const embedCode = `<iframe src="https://kenjiai.com/tools/ltv-calculator?embed=true" width="100%" height="900" frameborder="0" style="border:1px solid #1f2937;border-radius:16px;" title="Customer Lifetime Value Calculator"></iframe>
<p style="font-size:12px;color:#9ca3af;text-align:center;margin-top:8px;font-family:sans-serif;">Calculator by <a href="https://kenjiai.com" target="_blank" style="color:#3b82f6;">KenjiAI</a></p>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const faqs = [
    {
      q: 'What is customer lifetime value?',
      a: 'The total a customer is worth to your business over the whole time they buy from you. This calculator shows it two ways: total revenue, and gross profit after your delivery costs. Use the profit number for ad decisions.',
    },
    {
      q: 'How do you calculate LTV?',
      a: 'Average purchase value times purchases per year times years a customer stays, then times your gross margin. A $200 purchase, 4 times a year, for 3 years is $2,400 in revenue. At a 50% margin that customer is worth $1,200 in profit.',
    },
    {
      q: 'What is a good LTV to CAC ratio?',
      a: 'Around 3:1 is the common target. Under 1:1 you lose money on every customer. Between 1:1 and 3:1 you profit on paper but overhead eats most of it. Well above 5:1 usually means you could spend more to grow faster.',
    },
    {
      q: 'What is the most I should pay to get a customer?',
      a: 'Your profit LTV divided by 3. If a customer is worth $1,200 in gross profit, keep your cost per customer under $400. That leaves room for overhead and profit.',
    },
    {
      q: 'How do I estimate customer lifespan?',
      a: 'If you track monthly churn, divide 1 by your churn rate to get months, then divide by 12. At 5% monthly churn, customers stay about 20 months, or 1.7 years. If you do not track it, look at how long your average past customer kept buying.',
    },
    {
      q: 'What is CAC payback period?',
      a: 'How many months of a customer\'s gross profit it takes to pay back what you spent to get them. Under 12 months is solid for most small businesses. A long payback ties up cash even when the LTV:CAC ratio looks good.',
    },
  ];

  return (
    <div className={`min-h-screen ${isEmbed ? 'bg-gray-900 p-4' : 'pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-white'}`}>
      <PageSchema path="/tools/ltv-calculator" name={"Customer Lifetime Value (LTV) Calculator"} description={"Free customer lifetime value calculator. Enter purchase value, frequency, lifespan, margin, and acquisition cost to get LTV, your LTV:CAC ratio, max allowable CAC, and payback period."} />
      <Helmet>
        <title>Customer Lifetime Value (LTV) Calculator with LTV:CAC | KenjiAI</title>
        <meta
          name="description"
          content="Free customer lifetime value calculator. Enter purchase value, frequency, lifespan, margin, and acquisition cost to get LTV, your LTV:CAC ratio, max allowable CAC, and payback period."
        />
        <link rel="canonical" href="https://kenjiai.com/tools/ltv-calculator" />
        <meta property="og:title" content="Customer Lifetime Value (LTV) Calculator | KenjiAI" />
        <meta property="og:description" content="Find out what a customer is really worth and the most you can pay to get one." />
        <meta property="og:url" content="https://kenjiai.com/tools/ltv-calculator" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'KenjiAI Customer Lifetime Value Calculator',
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
              Customer Lifetime Value Calculator
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              See what one customer is worth in real profit, how that compares to what you pay to get them, and the most you can afford to spend per customer.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-gray-800/80 border border-gray-700/70 rounded-2xl p-6 sm:p-8 space-y-5">
            <Field label="Average purchase value" prefix="$" value={aov} onChange={setAov} step={10} hint="What a customer pays you on a typical purchase or monthly bill." />
            <Field label="Purchases per year" value={frequency} onChange={setFrequency} step={0.5} hint="Use 12 for a monthly subscription or retainer." />
            <Field label="Years a customer stays" suffix="years" value={lifespan} onChange={setLifespan} step={0.5} hint="Know your monthly churn? Lifespan in years is 1 / churn / 12." />
            <Field
              label="Gross profit margin"
              suffix="%"
              value={margin}
              onChange={(v) => setMargin(Math.min(100, v))}
              hint="What is left after product, delivery, and labor. Service businesses often sit at 50-70%, e-commerce at 20-40%."
            />
            <Field label="Cost to get one customer (CAC)" prefix="$" value={cac} onChange={setCac} step={10} hint="Ad spend plus sales costs, divided by new customers." />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Profit LTV</span>
                <div className="text-3xl font-extrabold text-white mt-1">{money(r.ltv)}</div>
                <span className="text-[11px] text-gray-500">{money(r.revenueLtv)} in revenue</span>
              </div>
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">LTV:CAC ratio</span>
                <div className="text-3xl font-extrabold text-blue-300 mt-1">{r.ratio.toFixed(1)}:1</div>
                <span className="text-[11px] text-gray-500">target 3:1</span>
              </div>
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Max CAC at 3:1</span>
                <div className="text-2xl font-bold text-white mt-1">{money(r.maxCac)}</div>
                <span className="text-[11px] text-gray-500">per customer</span>
              </div>
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">CAC payback</span>
                <div className="text-2xl font-bold text-white mt-1">{r.payback.toFixed(1)} mo</div>
                <span className="text-[11px] text-gray-500">{money(r.monthlyProfit)} profit / month</span>
              </div>
            </div>

            <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Profit per customer after CAC</span>
              <div className={`text-3xl font-extrabold mt-1 ${r.ltv - cac >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                {money(r.ltv - cac)}
              </div>
              <span className="text-[11px] text-gray-500">
                {money(r.ltv)} lifetime gross profit minus {money(cac)} to get the customer. Break-even CAC is {money(r.ltv)}.
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
              Want help lowering your cost per customer? Take the 60-second quiz
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>

        {!isEmbed && (
          <>
            <div className="mt-16 border-t border-gray-800 pt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Lifetime value questions people ask</h2>
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

export default LTVCalculatorPage;
