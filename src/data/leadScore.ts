/* Lead Leak Score quiz (kenjiai.com/lead-score), Yousif 2026-10-25.
   A longer, branched quiz modeled on a real estate "seller readiness" quiz that cut cost per lead
   from $87 to $18 and raised lead quality: the first answer picks the path, every question makes the
   owner look at their own numbers, and the results page pays them back for their time.
   Shared by the page and netlify/functions/lead-score.ts, so scoring and qualifying can't drift. */

export type Answers = Record<string, string>;
export type Option = { value: string; label: string };
export type Question = { id: string; title: string; help?: string; options: Option[]; show?: (a: Answers) => boolean };

const paid = (a: Answers) => ['boost', 'agency', 'self'].includes(a.ads);

export const QUESTIONS: Question[] = [
  {
    id: 'ads', title: 'What are you doing for ads right now?',
    options: [
      { value: 'none', label: 'Nothing paid. Referrals and word of mouth' },
      { value: 'boost', label: 'Boosting posts now and then' },
      { value: 'agency', label: 'Paying an agency or freelancer' },
      { value: 'self', label: 'Running Meta or Google ads myself' },
    ],
  },
  {
    id: 'industry', title: 'What kind of business is it?',
    options: [
      { value: 'home', label: 'Home services or contracting' },
      { value: 'health', label: 'Health, wellness or med spa' },
      { value: 'professional', label: 'Legal, tax or financial services' },
      { value: 'realestate', label: 'Real estate' },
      { value: 'coaching', label: 'Coaching, consulting or courses' },
      { value: 'ecommerce', label: 'Ecommerce' },
      { value: 'other', label: 'Something else' },
    ],
  },
  {
    id: 'deal', title: 'What’s a new customer worth to you, on average?', help: 'The first sale plus what they usually buy after.',
    options: [
      { value: 'under_500', label: 'Under $500' },
      { value: '500_2k', label: '$500 to $2,000' },
      { value: '2k_10k', label: '$2,000 to $10,000' },
      { value: '10k_plus', label: '$10,000 or more' },
    ],
  },
  {
    id: 'revenue', title: 'Roughly how much does the business bring in each month?',
    options: [
      { value: 'under_10k', label: 'Under $10K' },
      { value: '10k_30k', label: '$10K to $30K' },
      { value: '30k_100k', label: '$30K to $100K' },
      { value: '100k_1m', label: '$100K to $1M' },
      { value: '1m_plus', label: '$1M or more' },
    ],
  },
  // ---- running some kind of paid ads
  {
    id: 'spend', title: 'How much goes into ads each month?', show: paid,
    options: [
      { value: 'under_500', label: 'Under $500' },
      { value: '500_2k', label: '$500 to $2,000' },
      { value: '2k_5k', label: '$2,000 to $5,000' },
      { value: '5k_15k', label: '$5,000 to $15,000' },
      { value: '15k_plus', label: '$15,000 or more' },
    ],
  },
  {
    id: 'cpl', title: 'What does one lead cost you right now?', show: paid,
    options: [
      { value: 'under_20', label: 'Under $20' },
      { value: '20_50', label: '$20 to $50' },
      { value: '50_150', label: '$50 to $150' },
      { value: '150_plus', label: 'More than $150' },
      { value: 'unknown', label: 'Honestly, I’m not sure' },
    ],
  },
  {
    id: 'quality', title: 'Out of 10 leads, how many are real buyers?', show: paid,
    options: [
      { value: '0_1', label: 'One or none' },
      { value: '2_3', label: 'Two or three' },
      { value: '4_6', label: 'Four to six' },
      { value: '7_plus', label: 'Seven or more' },
    ],
  },
  {
    id: 'agency_pay', title: 'How do you pay your agency?', show: (a) => a.ads === 'agency',
    options: [
      { value: 'retainer', label: 'A flat monthly retainer' },
      { value: 'pct_spend', label: 'A percent of ad spend' },
      { value: 'per_lead', label: 'Per lead' },
      { value: 'per_result', label: 'Only when I get a customer' },
    ],
  },
  {
    id: 'self_time', title: 'How many hours a week go into running the ads?', show: (a) => a.ads === 'self',
    options: [
      { value: 'under_2', label: 'Under 2 hours' },
      { value: '2_5', label: '2 to 5 hours' },
      { value: '5_10', label: '5 to 10 hours' },
      { value: '10_plus', label: 'More than 10 hours' },
    ],
  },
  {
    id: 'tracking', title: 'Can you see which ads turn into paying customers?', show: paid,
    options: [
      { value: 'yes', label: 'Yes, down to the ad' },
      { value: 'partly', label: 'Partly. I know leads, not sales' },
      { value: 'no', label: 'No' },
    ],
  },
  // ---- no paid ads yet
  {
    id: 'flow', title: 'How steady are new customers right now?', show: (a) => a.ads === 'none',
    options: [
      { value: 'steady', label: 'Steady, every month' },
      { value: 'feast', label: 'Good months and slow months' },
      { value: 'slow', label: 'Slower than I want' },
    ],
  },
  {
    id: 'why_not', title: 'What’s kept you from running ads?', show: (a) => a.ads === 'none',
    options: [
      { value: 'burned', label: 'Tried before and lost money' },
      { value: 'howto', label: 'Not sure how to do it right' },
      { value: 'time', label: 'No time to manage it' },
      { value: 'trust', label: 'Haven’t found someone I trust with it' },
    ],
  },
  // ---- everyone: what happens after the lead
  {
    id: 'speed', title: 'When a new lead comes in, how fast does someone reach out?',
    options: [
      { value: '5min', label: 'Within 5 minutes' },
      { value: 'hour', label: 'Within the hour' },
      { value: 'sameday', label: 'Same day' },
      { value: 'nextday', label: 'Next day or later' },
      { value: 'unsure', label: 'I don’t really know' },
    ],
  },
  {
    id: 'calls', title: 'What happens to calls you miss?',
    options: [
      { value: 'answered', label: 'We don’t miss calls. Someone always answers' },
      { value: 'vm', label: 'They go to voicemail' },
      { value: 'callback', label: 'We call back when we can' },
      { value: 'lost', label: 'A lot of them never get called back' },
    ],
  },
  {
    id: 'close', title: 'Out of 10 people you actually talk to, how many buy?',
    options: [
      { value: '0_2', label: 'Two or fewer' },
      { value: '3_4', label: 'Three or four' },
      { value: '5_6', label: 'Five or six' },
      { value: '7_plus', label: 'Seven or more' },
    ],
  },
  {
    id: 'budget', title: 'How much can you put toward growth each month?', help: 'Ad spend plus done-for-you help, together.',
    options: [
      { value: 'under_1k', label: 'Under $1,000' },
      { value: '1k_3k', label: '$1,000 to $3,000' },
      { value: '3k_10k', label: '$3,000 to $10,000' },
      { value: '10k_plus', label: '$10,000 or more' },
    ],
  },
  {
    id: 'timeline', title: 'If we find leaks worth fixing, when would you want to start?',
    options: [
      { value: 'now', label: 'Right away' },
      { value: '30_days', label: 'Within 30 days' },
      { value: '1_3_months', label: 'In 1 to 3 months' },
      { value: 'researching', label: 'I’m just researching for now' },
    ],
  },
  {
    id: 'decision', title: 'Who makes the call on an investment like this?',
    options: [
      { value: 'me', label: 'Me' },
      { value: 'partner', label: 'Me and a business partner' },
      { value: 'someone_else', label: 'Someone else' },
    ],
  },
];

export const visibleQuestions = (a: Answers) => QUESTIONS.filter((q) => !q.show || q.show(a));

/** Keeps only answers to questions on this person's path, with known values. */
export function cleanAnswers(raw: unknown): Answers {
  const src = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const out: Answers = {};
  for (const q of QUESTIONS) {
    const v = String(src[q.id] ?? '');
    if (q.options.some((o) => o.value === v)) out[q.id] = v;
  }
  for (const q of QUESTIONS) if (q.show && !q.show(out)) delete out[q.id];
  return out;
}

// Same bar as /growth-quiz (Yousif 2026-10-07): $10K+/mo, $1K+/mo to grow, not just researching, decides.
const DISQUALIFY: Record<string, string[]> = {
  revenue: ['under_10k'], budget: ['under_1k'], timeline: ['researching'], decision: ['someone_else'],
};
export const isQualified = (a: Answers) => Object.entries(DISQUALIFY).every(([q, bad]) => a[q] && !bad.includes(a[q]));

export type Leak = { id: string; points: number; title: string; why: string; fix: string };

const DEAL_MID: Record<string, number> = { under_500: 300, '500_2k': 1200, '2k_10k': 5000, '10k_plus': 15000 };
const CPL_MID: Record<string, number> = { under_20: 15, '20_50': 35, '50_150': 100, '150_plus': 200 };

/** 100 = nothing leaking. Each leak takes points off; the results page shows the biggest three. */
export function scoreAnswers(a: Answers): { score: number; leaks: Leak[]; grade: string; yearlyPerCustomer: number } {
  const leaks: Leak[] = [];
  const add = (id: string, points: number, title: string, why: string, fix: string) => { if (points > 0) leaks.push({ id, points, title, why, fix }); };

  add('speed', ({ hour: 8, sameday: 15, nextday: 22, unsure: 18 } as Record<string, number>)[a.speed] || 0,
    'Leads wait too long to hear from you',
    'Someone who just asked for a quote is ready right now. By the time you call back, they’re often talking to the next business.',
    'Call or text every new lead within a minute, nights and weekends included. An AI assistant can do this for you.');
  add('calls', ({ vm: 8, callback: 10, lost: 18 } as Record<string, number>)[a.calls] || 0,
    'Missed calls are walking away',
    'Most people who hit voicemail don’t leave a message. They call the next number on the list.',
    'Answer every call, or text back the moment one is missed, so the conversation keeps going.');
  add('close', ({ '0_2': 15, '3_4': 8, '5_6': 3 } as Record<string, number>)[a.close] || 0,
    'Conversations aren’t turning into sales',
    'If few of the people you talk to buy, the problem is usually who reaches you or how the first call goes, not how many leads you get.',
    'Filter leads before the call and use a simple, tested call script with follow-up for the ones who don’t buy on day one.');
  if (paid(a)) {
    add('quality', ({ '0_1': 15, '2_3': 10, '4_6': 4 } as Record<string, number>)[a.quality] || 0,
      'You’re paying for tire kickers',
      'Cheap, easy forms bring in people who were never going to buy, and you pay for every one of them.',
      'Ads and forms that ask real questions up front, like this quiz did, so serious buyers come through and the rest don’t.');
    const cpl = CPL_MID[a.cpl]; const deal = DEAL_MID[a.deal];
    if (a.cpl === 'unknown') add('cpl', 10, 'You don’t know what a lead costs', 'Without that number you can’t tell a winning ad from a losing one, so budget leaks into both.', 'Track cost per lead and cost per customer for every ad, every week.');
    else if (cpl && deal && cpl > deal * 0.1) add('cpl', 12, 'Leads cost too much for what a customer is worth', 'At your numbers, a few bad weeks of leads can eat the profit from the customers they bring.', 'Shift budget to the ads that bring buyers, not the cheapest clicks, and cut the rest fast.');
    add('tracking', ({ no: 12, partly: 6 } as Record<string, number>)[a.tracking] || 0,
      'You can’t see which ads make money',
      'Most accounts have a few ads doing the real work and others quietly burning budget. Without sales tracking they look the same.',
      'Connect sales back to the ad that brought them, then put the budget behind the winners.');
    if (a.agency_pay === 'retainer' || a.agency_pay === 'pct_spend') add('agency', 6, 'You pay for activity, not results',
      'A retainer or percent of spend gets paid whether or not you get customers.',
      'Tie what you pay to the results you get.');
    if (a.self_time === '5_10' || a.self_time === '10_plus') add('time', 6, 'Ads are eating your week',
      'Hours spent in Ads Manager are hours not spent closing or running the business.',
      'Hand the daily work to a team that does it every day, and keep the decisions.');
  } else {
    add('flow', ({ feast: 8, slow: 12 } as Record<string, number>)[a.flow] || 0,
      'Growth depends on referrals',
      'Referrals are great customers, but you can’t turn them up when you need more work.',
      'Add one steady paid channel with a filter in front of it, so new customers come in every week.');
  }
  leaks.sort((x, y) => y.points - x.points);
  const score = Math.max(8, Math.min(100, 100 - leaks.reduce((s, l) => s + l.points, 0)));
  const grade = score >= 80 ? 'Tight' : score >= 60 ? 'A few leaks' : score >= 40 ? 'Leaking' : 'Leaking badly';
  return { score, leaks, grade, yearlyPerCustomer: (DEAL_MID[a.deal] || 0) * 12 };
}

export function labelOf(qid: string, v: string) {
  return QUESTIONS.find((q) => q.id === qid)?.options.find((o) => o.value === v)?.label || v || '';
}

/* ---------- their funnel, in their numbers (results-page diagram, Yousif 2026-10-25) ----------
   A rough model, not a measurement: every rate below comes from one of their answers, and the page says so.
   "Fixed" keeps the same leads and close rate and only assumes 5-minute follow-up and every call answered. */

export type FunnelStage = { id: string; label: string; sub: string; n: number; leak?: string };
export type Funnel = { perMonth: boolean; stages: FunnelStage[]; monthly: number; fixedMonthly: number; slipping: number; basis: string };

const SPEND_MID: Record<string, number> = { under_500: 300, '500_2k': 1200, '2k_5k': 3500, '5k_15k': 9000, '15k_plus': 20000 };
const REACH: Record<string, number> = { '5min': 0.9, hour: 0.75, sameday: 0.6, nextday: 0.45, unsure: 0.55 };
const PICKUP: Record<string, number> = { answered: 1, vm: 0.85, callback: 0.9, lost: 0.75 };
const CLOSE: Record<string, number> = { '0_2': 0.2, '3_4': 0.35, '5_6': 0.55, '7_plus': 0.75 };
const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

export function funnelModel(a: Answers): Funnel {
  const paidPath = paid(a);
  const cpl = CPL_MID[a.cpl] || 50;
  const leads = paidPath ? Math.max(1, Math.round((SPEND_MID[a.spend] || 1200) / cpl)) : 100;
  const reach = REACH[a.speed] ?? 0.6, pick = PICKUP[a.calls] ?? 0.9, close = CLOSE[a.close] ?? 0.35;
  const deal = DEAL_MID[a.deal] || 1200;
  const reached = Math.round(leads * reach);
  const talked = Math.round(reached * pick);
  const customers = Math.max(0, Math.round(talked * close * 10) / 10);
  const fixedCustomers = leads * Math.max(reach, 0.9) * 1 * close;
  const monthly = customers * deal, fixedMonthly = fixedCustomers * deal;
  const lostSlow = leads - reached, lostCalls = reached - talked, lostClose = Math.round(talked - customers);
  const stages: FunnelStage[] = [
    { id: 'leads', label: paidPath ? 'New leads' : 'People who reach out', n: leads,
      sub: paidPath ? `About ${money(SPEND_MID[a.spend] || 1200)}/mo in ads at ${a.cpl === 'unknown' ? 'an assumed $50' : `about ${money(cpl)}`} a lead` : 'Say 100 people call, text or fill out a form' },
    { id: 'reached', label: 'Heard back while still interested', n: reached,
      sub: `Based on reaching out ${({ '5min': 'within 5 minutes', hour: 'within the hour', sameday: 'the same day', nextday: 'the next day or later', unsure: 'at no set speed' } as Record<string, string>)[a.speed] || 'when you can'}`,
      leak: lostSlow > 0 && a.speed !== '5min' ? `${lostSlow} went cold waiting` : undefined },
    { id: 'talked', label: 'Got a real conversation', n: talked,
      sub: 'After missed calls and voicemail',
      leak: lostCalls > 0 ? `${lostCalls} lost to missed calls` : undefined },
    { id: 'customers', label: 'Became customers', n: customers,
      sub: a.close ? `Your close rate: ${labelOf('close', a.close).toLowerCase()} out of 10` : 'Based on your close rate',
      leak: CLOSE[a.close] !== undefined && CLOSE[a.close] < 0.5 ? `${lostClose} talked but didn’t buy` : undefined },
  ];
  return {
    perMonth: paidPath, stages, monthly, fixedMonthly, slipping: Math.max(0, fixedMonthly - monthly),
    basis: paidPath ? 'each month' : 'for every 100 people who reach out',
  };
}
export const fmtMoney = money;
