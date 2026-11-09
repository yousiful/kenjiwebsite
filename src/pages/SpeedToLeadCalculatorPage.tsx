import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageSchema from '../components/PageSchema';
import { Timer, ArrowRight, Copy, Check, Share2, Zap, Clock, AlertTriangle } from 'lucide-react';

const money = (n: number) =>
  `${n < 0 ? '-' : ''}$${Math.abs(Math.round(n)).toLocaleString()}`;

// How well a lead closes at a given response time, relative to answering within 5 minutes (1.0).
// Deliberately gentler than the published research (HBR 2011 found ~7x at the one-hour mark; we use ~1.8x).
const CURVE: [number, number][] = [
  [5, 1],
  [10, 0.85],
  [30, 0.65],
  [60, 0.55],
  [240, 0.45],
  [1440, 0.38],
  [4320, 0.33],
  [10080, 0.3],
];

const relativeClose = (minutes: number): number => {
  if (minutes <= CURVE[0][0]) return 1;
  const last = CURVE[CURVE.length - 1];
  if (minutes >= last[0]) return last[1];
  for (let i = 1; i < CURVE.length; i++) {
    const [t1, v1] = CURVE[i];
    if (minutes <= t1) {
      const [t0, v0] = CURVE[i - 1];
      const f = Math.log(minutes / t0) / Math.log(t1 / t0);
      return v0 + (v1 - v0) * f;
    }
  }
  return last[1];
};

const UNITS = { minutes: 1, hours: 60, days: 1440 } as const;
type Unit = keyof typeof UNITS;

const ROWS: { label: string; minutes: number }[] = [
  { label: 'Under 5 minutes', minutes: 5 },
  { label: '30 minutes', minutes: 30 },
  { label: '1 hour', minutes: 60 },
  { label: '4 hours', minutes: 240 },
  { label: '24 hours', minutes: 1440 },
  { label: '3 days', minutes: 4320 },
];

const pct = (n: number) => `${n.toFixed(n < 10 ? 1 : 0)}%`;

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

const SpeedToLeadCalculatorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';

  const [leads, setLeads] = useState(100);
  const [dealValue, setDealValue] = useState(1500);
  const [closeRate, setCloseRate] = useState(10);
  const [time, setTime] = useState(2);
  const [unit, setUnit] = useState<Unit>('hours');
  const [copied, setCopied] = useState(false);

  const r = useMemo(() => {
    const minutes = time * UNITS[unit];
    const factor = relativeClose(minutes);
    // Close rate if every lead were answered within 5 minutes, capped at 100%.
    const fastRate = Math.min(100, factor > 0 ? closeRate / factor : closeRate);
    const customersNow = leads * (closeRate / 100);
    const customersFast = leads * (fastRate / 100);
    const extraCustomers = Math.max(0, customersFast - customersNow);
    const lostMonthly = extraCustomers * dealValue;
    const perLead = leads > 0 ? lostMonthly / leads : 0;
    const rows = ROWS.map((row) => {
      const rate = Math.min(100, fastRate * relativeClose(row.minutes));
      return { ...row, rate, revenue: leads * (rate / 100) * dealValue };
    });
    const status: 'fast' | 'slow' | 'cold' = minutes <= 5 ? 'fast' : minutes <= 60 ? 'slow' : 'cold';
    return { minutes, fastRate, customersNow, customersFast, extraCustomers, lostMonthly, perLead, rows, status };
  }, [leads, dealValue, closeRate, time, unit]);

  const verdict = {
    fast: {
      icon: Zap,
      color: 'text-emerald-300',
      box: 'border-emerald-500/40 bg-emerald-950/40',
      title: 'You are already answering fast',
      body: 'Under 5 minutes puts you ahead of most businesses. The next leak to check is nights, weekends, and calls that go to voicemail, since your average can hide those.',
    },
    slow: {
      icon: Clock,
      color: 'text-amber-300',
      box: 'border-amber-500/40 bg-amber-950/30',
      title: 'Leads are cooling while they wait',
      body: `By the time you reply, many of these people have already filled out a competitor's form. Getting under 5 minutes is worth about ${money(r.lostMonthly)} a month at your numbers.`,
    },
    cold: {
      icon: AlertTriangle,
      color: 'text-red-300',
      box: 'border-red-500/40 bg-red-950/30',
      title: 'Most of your leads are cold by the time you call',
      body: `Every lead you answer this late costs you about ${money(r.perLead)} in sales you would likely have closed. An instant text reply on every form is the cheapest fix you can make this week.`,
    },
  }[r.status];
  const VerdictIcon = verdict.icon;

  const currentRowIndex = (() => {
    let best = 0;
    ROWS.forEach((row, i) => {
      if (Math.abs(Math.log(Math.max(r.minutes, 1) / row.minutes)) < Math.abs(Math.log(Math.max(r.minutes, 1) / ROWS[best].minutes))) best = i;
    });
    return best;
  })();

  const embedCode = `<iframe src="https://kenjiai.com/tools/speed-to-lead-calculator?embed=true" width="100%" height="900" frameborder="0" style="border:1px solid #1f2937;border-radius:16px;" title="Speed to Lead Calculator"></iframe>
<p style="font-size:12px;color:#9ca3af;text-align:center;margin-top:8px;font-family:sans-serif;">Calculator by <a href="https://kenjiai.com" target="_blank" style="color:#3b82f6;">KenjiAI</a></p>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const faqs = [
    {
      q: 'What is speed to lead?',
      a: 'The time between a lead coming in (a form, a call, an ad message) and someone from your business actually reaching that person. It is measured in minutes, and for most businesses it is the cheapest sales number to improve.',
    },
    {
      q: 'What is a good lead response time?',
      a: 'Under 5 minutes. A 2011 Harvard Business Review study of 2,241 US companies found firms that reached out within an hour were nearly 7 times as likely to qualify the lead as firms that waited longer, and over 60 times as likely as firms that waited a day. The average response time in that study was 42 hours.',
    },
    {
      q: 'How does this calculator work out lost revenue?',
      a: 'It treats your close rate today as the result of your current response time. It then estimates the close rate you would get answering within 5 minutes using a drop-off curve: a lead answered in 1 hour closes about 55% as well as one answered in 5 minutes, and one answered in 24 hours about 38% as well. Extra customers times your deal value is the revenue you are leaving behind.',
    },
    {
      q: 'Are these numbers exaggerated?',
      a: 'They lean the other way. The published research shows gaps of 7x or more at the one-hour mark. We use under 2x, so the figure here is one you can defend to a partner or an accountant. Your real gap is probably larger.',
    },
    {
      q: 'Does speed to lead matter for phone calls too?',
      a: 'More than for forms. A call that goes to voicemail is a lead with no response at all, and most callers dial the next business on the list instead of leaving a message. Count missed calls in your response time, not only web leads.',
    },
    {
      q: 'How do I get my response time under 5 minutes?',
      a: 'Send an instant text reply to every new form lead, route leads to a phone that rings instead of an inbox someone checks later, and have calls answered after hours by a person or an AI receptionist. Then check your average once a week so it does not drift.',
    },
  ];

  return (
    <div className={`min-h-screen ${isEmbed ? 'bg-gray-900 p-4' : 'pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-white'}`}>
      <PageSchema path="/tools/speed-to-lead-calculator" name={"Speed to Lead Calculator: What Slow Lead Response Costs You"} description={"Free speed to lead calculator. Enter your leads, deal value, close rate, and lead response time to see the revenue you lose every month by answering leads late."} />
      <Helmet>
        <title>Speed to Lead Calculator: Lead Response Time Cost | KenjiAI</title>
        <meta
          name="description"
          content="Free speed to lead calculator. Enter your leads, deal value, close rate, and lead response time to see the revenue you lose every month by answering leads late."
        />
        <link rel="canonical" href="https://kenjiai.com/tools/speed-to-lead-calculator" />
        <meta property="og:title" content="Speed to Lead Calculator | KenjiAI" />
        <meta property="og:description" content="See how much revenue slow lead response costs you each month, and what answering in under 5 minutes is worth." />
        <meta property="og:url" content="https://kenjiai.com/tools/speed-to-lead-calculator" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'KenjiAI Speed to Lead Calculator',
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
              <Timer className="w-3.5 h-3.5" />
              Free Tool
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Speed to Lead Calculator
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              See how much revenue your lead response time costs you each month, and what answering every lead in under 5 minutes is worth.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-gray-800/80 border border-gray-700/70 rounded-2xl p-6 sm:p-8 space-y-5">
            <Field label="New leads per month" value={leads} onChange={setLeads} step={10} hint="Forms, calls, and ad messages combined." />
            <Field label="Average deal value" prefix="$" value={dealValue} onChange={setDealValue} step={50} hint="What one new customer is worth to you." />
            <Field
              label="Close rate today"
              suffix="%"
              value={closeRate}
              onChange={(v) => setCloseRate(Math.min(100, v))}
              step={0.5}
              hint="Out of every 100 leads, how many become customers."
            />
            <div>
              <span className="text-sm font-medium text-gray-300">Average time to first response</span>
              <div className="mt-1.5 flex gap-2">
                <div className="flex-1 min-w-0 flex items-center rounded-lg border border-gray-700 bg-gray-900/70 focus-within:border-blue-500">
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={unit === 'minutes' ? 5 : 1}
                    value={Number.isFinite(time) ? time : ''}
                    onChange={(e) => setTime(Math.max(0, Number(e.target.value)))}
                    aria-label="Response time"
                    className="w-full min-w-0 bg-transparent px-3 py-2.5 text-white text-base outline-none"
                  />
                </div>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as Unit)}
                  aria-label="Response time unit"
                  className="rounded-lg border border-gray-700 bg-gray-900/70 px-3 py-2.5 text-white text-base outline-none focus:border-blue-500"
                >
                  <option value="minutes">minutes</option>
                  <option value="hours">hours</option>
                  <option value="days">days</option>
                </select>
              </div>
              <span className="mt-1 block text-[11px] text-gray-500">
                Not sure? Submit your own website form and time the reply. Count nights and weekends.
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Revenue lost to slow response</span>
              <div className={`text-3xl sm:text-4xl font-extrabold mt-1 ${r.lostMonthly > 0 ? 'text-red-300' : 'text-emerald-300'}`}>
                {money(r.lostMonthly)} <span className="text-sm font-normal text-gray-400">/ month</span>
              </div>
              <span className="text-[11px] text-gray-500">{money(r.lostMonthly * 12)} a year</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Customers now</span>
                <div className="text-2xl font-bold text-white mt-1">{r.customersNow.toFixed(1)}</div>
                <span className="text-[11px] text-gray-500">per month at {pct(closeRate)}</span>
              </div>
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Under 5 minutes</span>
                <div className="text-2xl font-bold text-blue-300 mt-1">{r.customersFast.toFixed(1)}</div>
                <span className="text-[11px] text-gray-500">per month at {pct(r.fastRate)}</span>
              </div>
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Customers missed</span>
                <div className="text-2xl font-bold text-white mt-1">{r.extraCustomers.toFixed(1)}</div>
                <span className="text-[11px] text-gray-500">per month</span>
              </div>
              <div className="bg-gray-800/80 border border-gray-700/70 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Cost per late lead</span>
                <div className="text-2xl font-bold text-white mt-1">{money(r.perLead)}</div>
                <span className="text-[11px] text-gray-500">in lost sales</span>
              </div>
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
              Want every lead answered in under a minute? Take the 60-second quiz
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>

        <div className="mt-8 bg-gray-800/60 border border-gray-700/60 rounded-2xl p-5 sm:p-6">
          <h2 className="text-lg font-bold text-white">What each response time is worth to you</h2>
          <p className="text-xs text-gray-400 mt-1 mb-4">Monthly revenue from the same {leads.toLocaleString()} leads, answered at different speeds.</p>
          <div className="space-y-2">
            {r.rows.map((row, i) => {
              const max = r.rows[0].revenue || 1;
              const isYou = i === currentRowIndex;
              return (
                <div key={row.label} className={`rounded-lg px-3 py-2 ${isYou ? 'bg-blue-500/10 border border-blue-500/40' : 'border border-transparent'}`}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-gray-300">
                      {row.label}
                      {isYou && <span className="ml-2 text-[10px] uppercase tracking-wider font-semibold text-blue-300">closest to you</span>}
                    </span>
                    <span className="text-white font-semibold tabular-nums whitespace-nowrap">
                      {money(row.revenue)} <span className="text-gray-500 font-normal text-xs">({pct(row.rate)})</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-gray-900">
                    <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${Math.max(2, (row.revenue / max) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {!isEmbed && (
          <>
            <div className="mt-16 border-t border-gray-800 pt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Speed to lead questions people ask</h2>
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

export default SpeedToLeadCalculatorPage;
