// Funding Finder: /funding and the /funding/<slug> landing pages.
// Listings load from /funding-data.json (refreshed weekly by tools-crew/funding/refresh.mjs).
// Raw HTML for crawlers is written by scripts/funding_static.mjs from the same data.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Search, SlidersHorizontal, CalendarClock, ShieldCheck, Landmark, Building2, Loader2, Check, X } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { freeWebApp, faqPage } from '../lib/schema';
import {
  AMOUNT_BANDS, AUDIENCE_LABEL, EMPTY_FILTERS, INDUSTRIES, SOURCE_LABEL, STAGE_LABEL, STATES, STATE_NAME, TYPE_LABEL, TYPE_NOTE, TYPE_ORDER,
  amountLine, countBy, localToday, notExpired, deadlineLine, matches, money, niceDate, sortItems, statesLine,
  type Filters, type Fund, type FundType, type FundingData, type Opportunity, type SortKey,
} from './logic';
import { FUNDING_FAQ, FUNDING_TOPICS, topicLinkText, type FundingTopic } from './topics';
import AlertsForm from './AlertsForm';
import Matcher from './Matcher';

let dataPromise: Promise<FundingData> | null = null;
function loadData() {
  if (!dataPromise) {
    dataPromise = fetch('/funding-data.json').then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    });
    dataPromise.catch(() => { dataPromise = null; });
  }
  return dataPromise;
}

const BADGE: Record<FundType, string> = {
  grant: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  competition: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  loan: 'bg-sky-500/15 text-sky-300 border-sky-400/30',
  rbf: 'bg-violet-500/15 text-violet-300 border-violet-400/30',
  equity: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
};

const PAGE = 24;

function Card({ o, today }: { o: Opportunity; today: string }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="flex flex-col bg-gray-800/60 border border-gray-700 rounded-2xl p-5">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`text-xs font-semibold border rounded-full px-2.5 py-1 ${BADGE[o.type]}`}>{TYPE_LABEL[o.type]}</span>
        <span className="text-xs text-gray-400">{TYPE_NOTE[o.type]}</span>
        {o.status === 'forecasted' && <span className="text-xs text-gray-300 bg-gray-700/70 rounded-full px-2.5 py-1">Forecast</span>}
        {o.audience.map((a) => <span key={a} className="text-xs text-gray-300 bg-gray-700/70 rounded-full px-2.5 py-1">{AUDIENCE_LABEL[a] || a}</span>)}
      </div>
      <h3 className="text-lg font-bold text-white leading-snug">{o.title}</h3>
      <p className="text-sm text-gray-400 mt-1">{o.provider}{o.number ? ` · ${o.number}` : ''}</p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
        <div><dt className="text-gray-500 text-xs">Amount</dt><dd className="text-white font-semibold">{amountLine(o)}</dd></div>
        <div><dt className="text-gray-500 text-xs">Deadline</dt><dd className="text-white font-semibold">{deadlineLine(o, today)}</dd></div>
        <div className="sm:col-span-2"><dt className="text-gray-500 text-xs">Who qualifies</dt><dd className="text-gray-300">{o.who}</dd></div>
        <div><dt className="text-gray-500 text-xs">Where</dt><dd className="text-gray-300">{statesLine(o)}</dd></div>
        {o.instrument && <div><dt className="text-gray-500 text-xs">Award type</dt><dd className="text-gray-300">{o.instrument}</dd></div>}
      </dl>
      {o.summary && (
        <div className="mt-3 text-sm text-gray-400">
          {open ? <p>{o.summary}</p> : null}
          <button type="button" onClick={() => setOpen(!open)} className="text-blue-300 hover:text-blue-200 text-xs mt-1">{open ? 'Hide summary' : 'Show summary'}</button>
        </div>
      )}
      <div className="mt-auto pt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <a href={o.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold text-sm px-4 py-3 rounded-xl">
          Apply on official site <ExternalLink className="w-4 h-4" />
        </a>
        <p className="text-xs text-gray-500">Source: {SOURCE_LABEL[o.src]} · Last verified {niceDate(o.verified)}</p>
      </div>
    </article>
  );
}

function FundsTable({ funds, state, quarter }: { funds: Fund[]; state?: string; quarter?: string }) {
  const [n, setN] = useState(20);
  const list = state ? funds.filter((f) => f.state === state) : funds;
  if (!list.length) return null;
  return (
    <section className="mt-14" aria-labelledby="ff-funds">
      <h2 id="ff-funds" className="text-2xl sm:text-3xl font-bold text-white mb-2">
        {state ? `Venture funds raising money in ${STATE_NAME[state]}` : 'Venture funds raising money this quarter'}
      </h2>
      <p className="text-gray-400 max-w-3xl mb-5 text-sm leading-relaxed">
        {list.length} US venture funds filed a new Form D with the SEC{state ? ` from ${STATE_NAME[state]}` : ''} in the {quarter || 'latest'} data set, sized $10M to $150M.
        A filing means the fund is raising money from its own investors, not that it takes cold pitches, and some are vehicles for a single deal.
        Look up each fund's own site before reaching out. Phone numbers appear only when they are in the public filing.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.slice(0, n).map((f) => (
          <div key={f.url} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-sm">
            <p className="text-white font-semibold">{f.name}</p>
            <p className="text-gray-400">{[f.city, STATE_NAME[f.state] || f.state].filter(Boolean).join(', ')} · Fund size {money(f.size)}{f.filed ? ` · Filed ${niceDate(f.filed)}` : ''}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {f.phone && <a href={`tel:${f.phone.replace(/[^\d+]/g, '')}`} className="text-gray-300 hover:text-white">{f.phone}</a>}
              <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 inline-flex items-center gap-1">View SEC filing <ExternalLink className="w-3.5 h-3.5" /></a>
            </div>
          </div>
        ))}
      </div>
      {n < list.length && (
        <button type="button" onClick={() => setN(n + 40)} className="mt-4 text-sm bg-gray-800 border border-gray-700 hover:border-blue-400/60 text-gray-200 px-4 py-2.5 rounded-xl">
          Show more funds ({list.length - n} left)
        </button>
      )}
    </section>
  );
}

function Select({ id, label, value, onChange, children }: { id: string; label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-400 mb-1.5">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-400">
        {children}
      </select>
    </div>
  );
}

export function FinderView({ topic }: { topic?: FundingTopic }) {
  const [data, setData] = useState<FundingData | null>(null);
  const [err, setErr] = useState(false);
  const preset: Filters = useMemo(() => ({ ...EMPTY_FILTERS, ...(topic?.filters || {}) }), [topic]);
  const [f, setF] = useState<Filters>(preset);
  const [sort, setSort] = useState<SortKey>('best');
  const [shown, setShown] = useState(PAGE);
  const [showFilters, setShowFilters] = useState(false);
  const [matchNote, setMatchNote] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setF(preset); setShown(PAGE); setMatchNote(''); }, [preset]);
  useEffect(() => { loadData().then(setData).catch(() => setErr(true)); }, []);

  // The data is refreshed weekly; use the visitor's real date so anything that closed since then drops off.
  const today = useMemo(() => localToday(), []);
  const items = useMemo(() => (data?.items || []).filter((o) => notExpired(o, today)), [data, today]);
  const filtered = useMemo(
    // A landing page's own test (e.g. "limited to Texas") applies until the visitor changes a filter.
    () => sortItems(items.filter((o) => matches(o, f, today) && (!topic?.only || f !== preset || topic.only(o))), sort, f.state),
    [items, f, sort, today, topic, preset],
  );
  const moreList = useMemo(() => {
    if (!topic?.more || f !== preset) return [];
    const mf = { ...EMPTY_FILTERS, ...topic.more.filters };
    const ids = new Set(filtered.map((o) => o.id));
    return sortItems(items.filter((o) => !ids.has(o.id) && matches(o, mf, today) && (!topic.more!.only || topic.more!.only(o))), 'best');
  }, [items, topic, f, preset, filtered, today]);
  const counts = useMemo(() => countBy(items), [items]);
  // Only offer groups that have at least one listing right now.
  const audiences = useMemo(() => [...new Set(items.flatMap((o) => o.audience))].sort(), [items]);

  const set = (patch: Partial<Filters>) => { setF((old) => ({ ...old, ...patch })); setShown(PAGE); setMatchNote(''); };
  const toggleType = (t: FundType) => set({ types: f.types.includes(t) ? f.types.filter((x) => x !== t) : [...f.types, t] });
  const changed = JSON.stringify(f) !== JSON.stringify(EMPTY_FILTERS);

  const path = topic ? `/funding/${topic.slug}` : '/funding';
  const title = topic?.title || 'Funding Finder: Grants, Loans and Investors Open Now | KenjiAI';
  const description = topic?.description || 'Free directory of every funding opportunity a US small business or founder can apply for right now: grants, SBA loans, revenue-based financing, accelerators, angels and competitions. Each with its deadline, official link and last-verified date.';
  const faq = [...(topic?.faq || []), ...FUNDING_FAQ];
  const top = filtered.slice(0, 20);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      freeWebApp({ path, name: topic ? `KenjiAI Funding Finder: ${topic.linkText}` : 'KenjiAI Funding Finder', description }),
      faqPage(path, faq.map(([q, a]) => ({ q, a }))),
      ...(top.length ? [{
        '@type': 'ItemList',
        name: topic?.h1 || 'Open funding opportunities',
        numberOfItems: filtered.length,
        itemListElement: top.map((o, i) => ({ '@type': 'ListItem', position: i + 1, name: o.title, url: o.url })),
      }] : []),
    ],
  };

  const onMatch = (patch: Partial<Filters>, note: string) => {
    setF({ ...EMPTY_FILTERS, ...patch });
    setShown(PAGE);
    setMatchNote(note);
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        keywords="small business grants, grants for small business, startup funding, SBA loans, revenue based financing, grants for women, minority business grants, funding finder"
        canonical={`https://kenjiai.com${path}`}
        structuredData={structuredData}
        breadcrumbs={topic ? [{ name: 'Home', path: '/' }, { name: 'Funding Finder', path: '/funding' }, { name: topic.linkText, path }] : [{ name: 'Home', path: '/' }, { name: 'Free Tools', path: '/free-tools' }, { name: 'Funding Finder', path: '/funding' }]}
      />
      <div className="pt-24 pb-20 bg-gray-900 min-h-screen text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8 max-w-3xl">
            {topic ? (
              <nav className="text-sm text-gray-400 mb-4" aria-label="Breadcrumb"><Link to="/funding" className="text-blue-300 hover:text-blue-200">Funding Finder</Link> <span aria-hidden="true">/</span> {topic.linkText}</nav>
            ) : (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-blue-400/30 rounded-full px-4 py-2 mb-5">
                <Landmark className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 font-semibold text-sm">Free Funding Finder</span>
              </div>
            )}
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-4">{topic?.h1 || 'Find funding for your business that is open right now'}</h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              {topic?.lead || 'Grants, SBA loans, revenue-based financing, accelerators, angel networks and competitions for US small businesses and founders. Every listing links to its official page and shows its deadline and the date we last checked it. Anything past its deadline drops off on its own.'}
            </p>
            {data && (
              <p className="text-sm text-gray-500 mt-4 flex flex-wrap gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> {items.length} open opportunities, updated {niceDate(data.asOf)}</span>
                <span>{TYPE_ORDER.filter((t) => counts[t]).map((t) => `${counts[t]} ${TYPE_LABEL[t].toLowerCase()}${counts[t] === 1 || t === 'rbf' ? '' : 's'}`).join(' · ')}</span>
              </p>
            )}
          </header>

          {!topic && <Matcher onMatch={onMatch} />}

          <div ref={resultsRef} className="scroll-mt-24" />
          {/* Search + filters */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4 sm:p-5 mb-6" data-no-snapshot>
            <div className="flex gap-2">
              <label htmlFor="ff-q" className="sr-only">Search funding</label>
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input id="ff-q" type="search" value={f.q} onChange={(e) => set({ q: e.target.value })} placeholder="Search by name, agency or keyword" className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-3 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400" />
              </div>
              <button type="button" onClick={() => setShowFilters(!showFilters)} className="md:hidden inline-flex items-center gap-1.5 bg-gray-900 border border-gray-700 rounded-xl px-3 text-sm text-gray-200" aria-expanded={showFilters}>
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3" role="group" aria-label="Funding type">
              {TYPE_ORDER.map((t) => (
                <button key={t} type="button" onClick={() => toggleType(t)} aria-pressed={f.types.includes(t)} className={`text-sm border rounded-full px-3 py-1.5 transition-colors ${f.types.includes(t) ? BADGE[t] : 'border-gray-700 text-gray-300 hover:border-gray-500'}`}>
                  {f.types.includes(t) && <Check className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />}{TYPE_LABEL[t]}
                </button>
              ))}
            </div>
            <div className={`${showFilters ? 'grid' : 'hidden'} md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4`}>
              <Select id="ff-amount" label="Amount" value={f.amount} onChange={(v) => set({ amount: v })}>
                <option value="">Any amount</option>
                {AMOUNT_BANDS.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
              </Select>
              <Select id="ff-industry" label="Industry" value={f.industry} onChange={(v) => set({ industry: v })}>
                <option value="">Any industry</option>
                {INDUSTRIES.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
              <Select id="ff-state" label="Your state" value={f.state} onChange={(v) => set({ state: v })}>
                <option value="">Any state</option>
                {STATES.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
              <Select id="ff-stage" label="Stage" value={f.stage} onChange={(v) => set({ stage: v })}>
                <option value="">Any stage</option>
                {Object.entries(STAGE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
              <Select id="ff-aud" label="Built for" value={f.audience} onChange={(v) => set({ audience: v })}>
                <option value="">Anyone</option>
                {audiences.map((k) => <option key={k} value={k}>{AUDIENCE_LABEL[k] || k}</option>)}
              </Select>
              <Select id="ff-sort" label="Sort by" value={sort} onChange={(v) => setSort(v as SortKey)}>
                <option value="best">Best for small businesses</option>
                <option value="deadline">Deadline, soonest first</option>
                <option value="amount">Largest amount</option>
                <option value="new">Newest listings</option>
              </Select>
            </div>
            <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm`}>
              <label className="inline-flex items-center gap-2 text-gray-300"><input type="checkbox" checked={f.soon} onChange={(e) => set({ soon: e.target.checked })} className="w-4 h-4 accent-blue-500" /> Deadline in the next 30 days</label>
              <label className="inline-flex items-center gap-2 text-gray-300"><input type="checkbox" checked={f.noRepay} onChange={(e) => set({ noRepay: e.target.checked })} className="w-4 h-4 accent-blue-500" /> No repayment and no equity only</label>
            </div>
          </div>

          {matchNote && <p className="mb-4 text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-400/30 rounded-xl px-4 py-3">{matchNote}</p>}

          {!data && !err && (
            <div className="flex items-center gap-2 text-gray-400 py-16 justify-center" role="status" aria-label="Loading"><Loader2 className="w-5 h-5 animate-spin" /> Loading open opportunities</div>
          )}
          {err && <p className="text-red-300 py-10 text-center">The listings did not load. Check your connection and refresh the page.</p>}

          {data && (
            <>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4">
                <p className="text-sm text-gray-400" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'match' : 'matches'}</p>
                {changed && (
                  <button type="button" onClick={() => { setF(EMPTY_FILTERS); setShown(PAGE); setMatchNote(''); }} className="inline-flex items-center gap-1 text-sm text-blue-300 hover:text-blue-200"><X className="w-4 h-4" /> Clear all filters</button>
                )}
              </div>
              {filtered.length === 0 && topic?.more && f === preset && (
                <div className="text-gray-300 bg-gray-800/40 border border-gray-700 rounded-2xl p-6 mb-6">
                  This week we could not confirm any open program built only for this group on its official page, so none is listed here. The open programs below accept everyone who meets their rules.
                </div>
              )}
              {filtered.length === 0 && !(topic?.more && f === preset) && (
                <div className="text-gray-300 bg-gray-800/40 border border-gray-700 rounded-2xl p-6 mb-6">
                  Nothing matches all of those filters right now. Try removing one, or sign up below and we will email you when something that fits opens.
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.slice(0, shown).map((o) => <Card key={o.id} o={o} today={today} />)}
              </div>
              {shown < filtered.length && (
                <div className="text-center mt-6">
                  <button type="button" onClick={() => setShown(shown + PAGE * 2)} className="bg-gray-800 border border-gray-700 hover:border-blue-400/60 text-gray-100 font-semibold px-5 py-3 rounded-xl">
                    Show more ({filtered.length - shown} left)
                  </button>
                </div>
              )}

              {moreList.length > 0 && topic?.more && (
                <section className="mt-14">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{topic.more.h}</h2>
                  <p className="text-gray-400 mb-5 text-sm">{topic.more.p}</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {moreList.slice(0, 12).map((o) => <Card key={o.id} o={o} today={today} />)}
                  </div>
                  {moreList.length > 12 && <p className="mt-4 text-sm text-gray-400"><Link to="/funding" className="text-blue-300 hover:text-blue-200">See all {items.length} open opportunities in the Funding Finder</Link></p>}
                </section>
              )}

              {(!topic || topic.funds) && <FundsTable funds={data.funds} state={topic?.funds?.state} quarter={data.sources.formD?.quarter} />}
            </>
          )}

          {topic && (
            <div className="mt-16 max-w-3xl">
              {topic.sections.map((s) => (
                <section key={s.h} className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-3">{s.h}</h2>
                  {s.p.map((p) => <p key={p.slice(0, 40)} className="text-gray-300 leading-relaxed mb-3">{p}</p>)}
                </section>
              ))}
            </div>
          )}

          {!topic && (
            <section className="mt-16 max-w-3xl">
              <h2 className="text-2xl font-bold text-white mb-3">How to read each listing</h2>
              <ul className="space-y-2 text-gray-300 leading-relaxed">
                <li><strong className="text-white">Grant</strong> and <strong className="text-white">Competition</strong>: money you do not pay back.</li>
                <li><strong className="text-white">Loan</strong>: repaid with interest. SBA programs are loans, never grants.</li>
                <li><strong className="text-white">Revenue-based financing</strong>: repaid from a share of your revenue until a set total is paid.</li>
                <li><strong className="text-white">Equity investment</strong>: an accelerator, angel group or fund buys part of your company.</li>
                <li><strong className="text-white">Forecast</strong>: a federal notice the agency plans to post. Dates are the agency's estimate.</li>
              </ul>
            </section>
          )}

          <AlertsForm />

          <section className="mt-16 max-w-3xl" aria-labelledby="ff-faq">
            <h2 id="ff-faq" className="text-2xl font-bold text-white mb-4">Questions</h2>
            <div className="space-y-3">
              {faq.map(([q, a]) => (
                <details key={q} className="bg-gray-800/40 border border-gray-700 rounded-xl px-4 py-3">
                  <summary className="cursor-pointer font-semibold text-white">{q}</summary>
                  <p className="text-gray-300 mt-2 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-16" aria-labelledby="ff-more">
            <h2 id="ff-more" className="text-xl font-bold text-white mb-4">Funding guides</h2>
            <ul className="flex flex-wrap gap-2">
              {FUNDING_TOPICS.filter((t) => t.slug !== topic?.slug).map((t) => (
                <li key={t.slug}><Link to={`/funding/${t.slug}`} className="inline-block text-sm bg-gray-800 border border-gray-700 hover:border-blue-400/60 text-gray-200 px-3 py-2 rounded-lg">{topicLinkText(t.slug)}</Link></li>
              ))}
              {topic && <li><Link to="/funding" className="inline-block text-sm bg-gray-800 border border-gray-700 hover:border-blue-400/60 text-gray-200 px-3 py-2 rounded-lg">All funding</Link></li>}
            </ul>
            <p className="text-sm text-gray-500 mt-8 flex items-start gap-2">
              <Building2 className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                Sources: Grants.gov, SBIR.gov, the SEC Form D data set and each program's official page. KenjiAI takes no fee from any program listed here. Always confirm the rules on the official site before you apply.
                {' '}More <Link to="/free-tools" className="text-blue-300 hover:text-blue-200">free tools</Link> from KenjiAI.
              </span>
            </p>
            {data && <p className="text-xs text-gray-600 mt-2 inline-flex items-center gap-1"><CalendarClock className="w-3.5 h-3.5" /> Data refreshed {niceDate(data.asOf)}. Next refresh Monday morning.</p>}
          </section>
        </div>
      </div>
    </>
  );
}

export default function FundingFinderPage() {
  return <FinderView />;
}
