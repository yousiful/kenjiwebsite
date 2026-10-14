import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageSchema from '../components/PageSchema';
import { Wallet, ArrowRight, Copy, Check, Share2, Info } from 'lucide-react';

const DAYS_PER_MONTH = 30.4;
// Meta's learning phase wants roughly 50 optimization events per ad set per week.
const LEARNING_EVENTS_PER_WEEK = 50;

const money = (n: number) =>
  `${n < 0 ? '-' : ''}$${Math.abs(Math.round(n)).toLocaleString()}`;

const money2 = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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

type Mode = 'leads' | 'sales';

const FacebookAdsBudgetCalculatorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';

  const [mode, setMode] = useState<Mode>('leads');
  const [customers, setCustomers] = useState(20);
  const [cpl, setCpl] = useState(40);
  const [closeRate, setCloseRate] = useState(20);
  const [cpa, setCpa] = useState(35);
  const [saleValue, setSaleValue] = useState(1500);
  const [copied, setCopied] = useState(false);

  const r = useMemo(() => {
    const isLeads = mode === 'leads';
    const rate = isLeads ? closeRate / 100 : 1;
    const results = isLeads ? (rate > 0 ? customers / rate : 0) : customers;
    const costPerResult = isLeads ? cpl : cpa;
    const monthly = results * costPerResult;
    const daily = monthly / DAYS_PER_MONTH;
    const costPerCustomer = customers > 0 ? monthly / customers : 0;
    const revenue = customers * saleValue;
    const roas = monthly > 0 ? revenue / monthly : 0;
    const perWeek = results / (DAYS_PER_MONTH / 7);
    return { results, monthly, daily, costPerCustomer, revenue, roas, perWeek };
  }, [mode, customers, cpl, closeRate, cpa, saleValue]);

  const resultWord = mode === 'leads' ? 'leads' : 'purchases';
  const learningOk = r.perWeek >= LEARNING_EVENTS_PER_WEEK;

  const embedCode = `<iframe src="https://kenjiai.com/tools/facebook-ads-budget-calculator?embed=true" width="100%" height="900" frameborder="0" style="border:1px solid #1f2937;border-radius:16px;" title="Facebook Ads Budget Calculator"></iframe>
<p style="font-size:12px;color:#9ca3af;text-align:center;margin-top:8px;font-family:sans-serif;">Calculator by <a href="https://kenjiai.com" target="_blank" style="color:#3b82f6;">KenjiAI</a></p>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const faqs = [
    {
      q: 'How much should I spend on Facebook ads?',
      a: 'Work backwards from the customers you want. Customers wanted divided by your close rate gives leads needed. Leads needed times your cost per lead gives the monthly budget. Want 20 customers, close 20% of leads, pay $40 a lead: 100 leads x $40 = $4,000 a month, about $132 a day.',
    },
    {
      q: 'What is a normal cost per lead on Facebook?',
      a: 'It swings a lot by industry and offer. Home services and local businesses often land somewhere around $20 to $80 per lead, while legal, finance, and high-ticket B2B can run well past $100. Use your own numbers if you have them. If you are starting fresh, budget for the high end and let real data bring it down.',
    },
    {
      q: 'Is $10 or $20 a day enough for Facebook ads?',
      a: 'It can get you some results, but it is usually too little to exit the learning phase. Meta wants around 50 conversions per ad set per week to optimize properly. At $40 a lead, that is about $2,000 a week. Small budgets still work, they just learn slower and cost more per result for longer.',
    },
    {
      q: 'Should I set a daily or lifetime budget?',
      a: 'Daily budgets are easier to manage for always-on lead generation because spend stays steady and you can scale 20% at a time. Lifetime budgets suit fixed-date promotions like a sale or event. Meta can spend up to 75% over your daily budget on a given day, but it averages out across the week.',
    },
    {
      q: 'How do I lower my cost per customer?',
      a: 'There are two levers. Lower the cost per lead with a stronger offer and better creative, or raise your close rate by calling leads back fast. Going from a 20% to a 30% close rate cuts your cost per customer by a third without touching the ads.',
    },
  ];

  return (
    <div className={`min-h-screen ${isEmbed ? 'bg-gray-900 p-4' : 'pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-white'}`}>
      <PageSchema path="/tools/facebook-ads-budget-calculator" name={"Facebook Ads Budget Calculator: How Much to Spend"} description={"Free Facebook ads budget calculator. Enter the customers you want, your cost per lead, and close rate to get the daily and monthly Meta ads budget you need."} />
      <Helmet>
        <title>Facebook Ads Budget Calculator: How Much to Spend | KenjiAI</title>
        <meta
          name="description"
          content="Free Facebook ads budget calculator. Enter the customers you want, your cost per lead, and close rate to get the daily and monthly Meta ads budget you need."
        />
        <link rel="canonical" href="https://kenjiai.com/tools/facebook-ads-budget-calculator" />
        <meta property="og:title" content="Facebook Ads Budget Calculator | KenjiAI" />
        <meta property="og:description" content="Work out the daily Facebook and Instagram ad budget you need to hit your customer goal." />
        <meta property="og:url" content="https://kenjiai.com/tools/facebook-ads-budget-calculator" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'KenjiAI Facebook Ads Budget Calculator',
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
              <Wallet className="w-3.5 h-3.5" />
              Free Tool
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Facebook Ads Budget Calculator
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              Tell it how many customers you want each month. It tells you the daily budget to set in Meta Ads Manager.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-gray-800/80 border border-gray-700/70 rounded-2xl p-6 sm:p-8 space-y-5">
            <div>
              <span className="text-sm font-medium text-gray-300">What do your ads get you?</span>
              <div className="mt-1.5 grid grid-cols-2 gap-2 rounded-lg bg-gray-900/70 border border-gray-700 p-1">
                {([
                  ['leads', 'Leads I follow up'],
                  ['sales', 'Online sales'],
                ] as [Mode, string][]).map(([m, label]) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      mode === m ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <Field
              label={mode === 'leads' ? 'New customers wanted per month' : 'Sales wanted per month'}
              value={customers}
              onChange={setCustomers}
            />
            {mode === 'leads' ? (
              <>
                <Field
                  label="Cost per lead"
                  prefix="$"
                  value={cpl}
                  onChange={setCpl}
                  hint="Check Ads Manager. Starting out? Local businesses often see $20-80."
                />
                <Field
                  label="Close rate (leads that become customers)"
                  suffix="%"
                  value={closeRate}
                  onChange={(v) => setCloseRate(Math.min(100, v))}
                  hint="Out of every 10 leads, how many end up paying you? 2 of 10 is 20%."
                />
              </>
            ) : (
              <Field
                label="Cost per purchase"
                prefix="$"
                value={cpa}
                onChange={setCpa}
                hint="What Meta reports per purchase. Shown as cost per result in Ads Manager."
              />
            )}
            <Field
              label={mode === 'leads' ? 'Average value of one customer' : 'Average order value'}
              prefix="$"
              value={saleValue}
              onChange={setSaleValue}
              step={10}
            />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-gray-800/80 border border-blue-500/40 rounded-xl p-5">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Daily budget to set</span>
              <div className="text-4xl font-extrabold text-blue-300 mt-1">
                {money2(r.daily)} <span className="text-sm font-normal text-gray-400">/ day</span>
              </div>
              <span className="text-[11px] text-gray-500">{money(r.monthly)} a month across all your ad sets.</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">{resultWord} needed</span>
                <div className="text-2xl font-bold text-white mt-1">{Math.ceil(r.results).toLocaleString()}</div>
                <span className="text-[11px] text-gray-500">per month</span>
              </div>
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Cost per customer</span>
                <div className="text-2xl font-bold text-white mt-1">{money(r.costPerCustomer)}</div>
                <span className="text-[11px] text-gray-500">ad spend only</span>
              </div>
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Revenue from ads</span>
                <div className="text-2xl font-bold text-emerald-300 mt-1">{money(r.revenue)}</div>
                <span className="text-[11px] text-gray-500">per month</span>
              </div>
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">ROAS</span>
                <div className="text-2xl font-bold text-white mt-1">{r.roas.toFixed(2)}</div>
                <span className="text-[11px] text-gray-500">revenue per $1 spent</span>
              </div>
            </div>

            <div
              className={`rounded-xl border p-4 ${
                learningOk ? 'border-emerald-500/40 bg-emerald-950/40' : 'border-amber-500/40 bg-amber-950/30'
              }`}
            >
              <div className={`flex items-center gap-2 font-bold ${learningOk ? 'text-emerald-300' : 'text-amber-300'}`}>
                <Info className="w-5 h-5" />
                {learningOk ? 'Enough volume for Meta to learn' : 'Expect a slower learning phase'}
              </div>
              <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">
                {learningOk
                  ? `About ${Math.round(r.perWeek)} ${resultWord} a week clears the roughly ${LEARNING_EVENTS_PER_WEEK} per week Meta needs to optimize one ad set. Keep it to one ad set until it stabilizes.`
                  : `About ${Math.round(r.perWeek)} ${resultWord} a week is under the roughly ${LEARNING_EVENTS_PER_WEEK} Meta wants per ad set. Run a single ad set and give it two to three weeks before judging the numbers.`}
              </p>
            </div>

            <a
              href="https://kenjiai.com/growth-quiz"
              target={isEmbed ? '_blank' : '_self'}
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
            >
              Want us to plan your ad budget? Take the 60-second quiz
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {!isEmbed && (
          <>
            <div className="mt-16 border-t border-gray-800 pt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Facebook ad budget questions people ask</h2>
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

export default FacebookAdsBudgetCalculatorPage;
