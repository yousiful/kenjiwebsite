// Funding Finder (/funding): data types, labels and the filter/sort logic.
// Pure TypeScript with no React, so scripts/funding_static.mjs can bundle it and
// prerender exactly what the page shows. The data itself is public/funding-data.json,
// written once a week by C:\Users\y_you\tools-crew\funding\refresh.mjs.

export type FundType = 'grant' | 'loan' | 'rbf' | 'equity' | 'competition';
export type Stage = 'idea' | 'early' | 'growth' | 'established';

export interface Opportunity {
  id: string;
  src: 'grants.gov' | 'sbir' | 'curated';
  type: FundType;
  title: string;
  provider: string;
  number?: string | null;
  instrument?: string | null;
  category?: string | null;
  amountMin: number | null;
  amountMax: number | null;
  amountText: string | null;
  deadline: string | null;
  estimated?: boolean;
  rolling: boolean;
  status: 'open' | 'forecasted' | 'recurring';
  window: string | null;
  who: string;
  summary?: string;
  states: string[];
  /** home state(s) of a nationwide lender or a regional investor; used to feature it on state pages */
  hq?: string[];
  industries: string[];
  stages: Stage[];
  audience: string[];
  repay: boolean;
  equity: boolean;
  url: string;
  verified: string;
  firstSeen?: string;
}

export interface Fund {
  name: string;
  city: string | null;
  state: string;
  size: number;
  sold: number | null;
  filed: string | null;
  phone: string | null;
  cik: string;
  url: string;
  firstSeen?: string;
}

export interface FundingData {
  generated: string;
  asOf: string;
  sources: Record<string, { label: string; url?: string; count: number; quarter?: string; topics?: number }>;
  items: Opportunity[];
  funds: Fund[];
}

export const TYPE_LABEL: Record<FundType, string> = {
  grant: 'Grant',
  loan: 'Loan',
  rbf: 'Revenue-based financing',
  equity: 'Equity investment',
  competition: 'Competition',
};

/** One plain line under each type badge so nobody mistakes a loan for free money. */
export const TYPE_NOTE: Record<FundType, string> = {
  grant: 'Free money, no repayment',
  loan: 'You repay it with interest',
  rbf: 'You repay from a share of revenue',
  equity: 'Investors take ownership',
  competition: 'Prize money, no repayment',
};

export const TYPE_ORDER: FundType[] = ['grant', 'competition', 'loan', 'rbf', 'equity'];

export const SOURCE_LABEL: Record<Opportunity['src'], string> = {
  'grants.gov': 'Grants.gov',
  sbir: 'SBIR.gov',
  curated: 'Official program page',
};

export const STAGE_LABEL: Record<Stage, string> = {
  idea: 'Idea or pre-launch',
  early: 'Early (under 2 years)',
  growth: 'Growing (revenue, hiring)',
  established: 'Established',
};

export const INDUSTRIES: [string, string][] = [
  ['tech', 'Technology and software'],
  ['ai', 'AI'],
  ['health', 'Health and life sciences'],
  ['ag', 'Agriculture'],
  ['food', 'Food and beverage'],
  ['energy', 'Energy and environment'],
  ['manufacturing', 'Manufacturing'],
  ['retail', 'Retail'],
  ['ecommerce', 'Ecommerce'],
  ['services', 'Services'],
  ['creative', 'Creative'],
];

export const AUDIENCE_LABEL: Record<string, string> = {
  women: 'Women-owned',
  minority: 'Minority-owned',
  black: 'Black-owned',
  hispanic: 'Hispanic-owned',
  veteran: 'Veteran-owned',
  rural: 'Rural',
  lgbtq: 'LGBTQ+',
  immigrant: 'Immigrant founders',
  disabled: 'Founders with disabilities',
  student: 'Students',
};

export const STATES: [string, string][] = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'], ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'], ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'], ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'], ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['PR', 'Puerto Rico'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'], ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
];
export const STATE_NAME: Record<string, string> = Object.fromEntries(STATES);

export const AMOUNT_BANDS: { id: string; label: string; min: number; max: number }[] = [
  { id: 'u25', label: 'Under $25K', min: 0, max: 25_000 },
  { id: '25-250', label: '$25K to $250K', min: 25_000, max: 250_000 },
  { id: '250-1m', label: '$250K to $1M', min: 250_000, max: 1_000_000 },
  { id: '1m', label: '$1M and up', min: 1_000_000, max: Infinity },
];

export interface Filters {
  q: string;
  types: FundType[];
  amount: string;
  industry: string;
  state: string;
  stage: string;
  soon: boolean;
  noRepay: boolean;
  audience: string;
  /** limit to these sources (landing pages) */
  srcs?: Opportunity['src'][];
}

export const EMPTY_FILTERS: Filters = { q: '', types: [], amount: '', industry: '', state: '', stage: '', soon: false, noRepay: false, audience: '' };

const DAY = 864e5;
export const daysLeft = (deadline: string, today: string) => Math.round((Date.parse(deadline) - Date.parse(today)) / DAY);

export function matches(o: Opportunity, f: Filters, today: string): boolean {
  if (f.types.length && !f.types.includes(o.type)) return false;
  if (f.srcs && f.srcs.length && !f.srcs.includes(o.src)) return false;
  if (f.noRepay && (o.repay || o.equity)) return false;
  if (f.industry && o.industries.length && !o.industries.includes(f.industry)) return false;
  if (f.industry && !o.industries.length && f.industry === '__none') return false;
  if (f.state && !(o.states.includes('US') || o.states.includes(f.state))) return false;
  if (f.stage && o.stages.length && !o.stages.includes(f.stage as Stage)) return false;
  if (f.audience && !o.audience.includes(f.audience) && !(f.audience === 'minority' && o.audience.some((a) => ['black', 'hispanic', 'minority'].includes(a)))) return false;
  if (f.soon && !(o.deadline && daysLeft(o.deadline, today) <= 30)) return false;
  if (f.amount) {
    const band = AMOUNT_BANDS.find((b) => b.id === f.amount);
    if (band) {
      const hi = o.amountMax ?? o.amountMin;
      const lo = o.amountMin ?? o.amountMax;
      if (hi == null || lo == null) return false;
      if (hi < band.min || lo >= band.max) return false;
    }
  }
  if (f.q.trim()) {
    const hay = `${o.title} ${o.provider} ${o.who} ${o.summary || ''} ${o.category || ''} ${o.number || ''} ${TYPE_LABEL[o.type]}`.toLowerCase();
    if (!f.q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w))) return false;
  }
  return true;
}

export type SortKey = 'best' | 'deadline' | 'amount' | 'new';

/** "Best" puts hand-checked programs first (they are built for small businesses),
 *  then SBIR topics, then everything else by deadline. */
export function sortItems(list: Opportunity[], key: SortKey, state = ''): Opportunity[] {
  const srcRank = { curated: 0, sbir: 1, 'grants.gov': 2 } as const;
  const dl = (o: Opportunity) => (o.deadline ? Date.parse(o.deadline) : o.rolling ? 9e15 - 1 : 9e15);
  const amt = (o: Opportunity) => o.amountMax ?? o.amountMin ?? -1;
  const local = (o: Opportunity) => (state && (o.states.includes(state) || (o.hq || []).includes(state)) ? 0 : 1);
  return [...list].sort((a, b) => {
    if (key === 'deadline') return dl(a) - dl(b);
    if (key === 'amount') return amt(b) - amt(a) || dl(a) - dl(b);
    if (key === 'new') return (b.firstSeen || '').localeCompare(a.firstSeen || '') || dl(a) - dl(b);
    return local(a) - local(b) || srcRank[a.src] - srcRank[b.src] || (a.status === 'forecasted' ? 1 : 0) - (b.status === 'forecasted' ? 1 : 0) || dl(a) - dl(b);
  });
}

export const money = (n: number) => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1)}M`;
  if (n >= 1e3) return `$${Math.round(n / 1e3).toLocaleString('en-US')}K`;
  return `$${n.toLocaleString('en-US')}`;
};

export function amountLine(o: Opportunity): string {
  if (o.amountText) return o.amountText;
  if (o.amountMin && o.amountMax) return `${money(o.amountMin)} to ${money(o.amountMax)}`;
  if (o.amountMax) return `Up to ${money(o.amountMax)}`;
  if (o.amountMin) return `From ${money(o.amountMin)}`;
  return 'Amount not listed';
}

export const niceDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export function deadlineLine(o: Opportunity, today: string): string {
  if (o.deadline) {
    const d = daysLeft(o.deadline, today);
    const when = d <= 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`;
    return o.estimated ? `Estimated due ${niceDate(o.deadline)} (forecast)` : `Due ${niceDate(o.deadline)}, ${when}`;
  }
  if (o.status === 'recurring') return o.window ? `Recurring: ${o.window}` : 'Recurring program';
  if (o.rolling) return 'Rolling, apply any time';
  if (o.status === 'forecasted') return 'Forecast, no due date posted yet';
  return 'No close date listed, check the notice';
}

export function statesLine(o: Opportunity): string {
  if (o.states.includes('US')) return 'Nationwide';
  return o.states.map((s) => STATE_NAME[s] || s).join(', ');
}

export const countBy = (items: Opportunity[]) =>
  items.reduce<Record<FundType, number>>((m, i) => ((m[i.type] = (m[i.type] || 0) + 1), m), { grant: 0, loan: 0, rbf: 0, equity: 0, competition: 0 });
