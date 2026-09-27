import React, { useState, useCallback } from 'react';
import {
  Target,
  Loader2,
  Copy,
  Check,
  AlertTriangle,
  Users,
  Ban,
  Sliders,
  ArrowRight,
  Wallet,
  Zap,
  MessageSquareWarning,
  Layers,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

interface ICPSegment {
  name?: string;
  who_they_are?: string;
  age_range?: string;
  gender_skew?: string;
  spending_signal?: string;
  meta_interests?: string[];
  meta_behaviors?: string[];
  exclusions?: string[];
  buying_trigger?: string;
  objection?: string;
  objection_counter?: string;
  lookalike_seed?: string;
  ad_angle?: string;
}

interface ICPResult {
  offer_read?: string;
  price_band?: string;
  affordability_warning?: string;
  segments?: ICPSegment[];
  campaign_setup_notes?: string[];
  do_not_target?: string[];
}

interface Example {
  label: string;
  offer: string;
  currentCustomer: string;
  pricePoint: string;
  audienceType: string;
  billing: string;
  geo: string;
}

// Real offers, including our own, so the tool can be judged on output instead
// of on a placeholder.
const EXAMPLES: Example[] = [
  {
    label: 'AI call center + DFY ads',
    offer:
      'AI call center plus done-for-you ad management for local service businesses. Every inbound call answered in under 500ms, qualified, and booked on their calendar, then we build and run their Meta and Google campaigns.',
    currentCustomer: 'Local service business owners',
    pricePoint: '$199 to $399/mo call center, plus a $6,700 ads and call center bundle',
    audienceType: 'B2B',
    billing: 'Recurring plus a high-ticket one-time',
    geo: 'United States',
  },
  {
    label: '$7 low-ticket workshop',
    offer:
      'A $7 digital workshop that teaches solo agency owners how to land their first three paid retainer clients using cold DMs and a one-page offer doc.',
    currentCustomer: '',
    pricePoint: '$7 one time',
    audienceType: 'B2B',
    billing: 'One-time',
    geo: 'United States, Canada, UK',
  },
  {
    label: 'Local high-ticket install',
    offer:
      'We install and service backyard cold plunge tubs and infrared saunas at customers homes, including the electrical and water hookup, with a yearly maintenance plan.',
    currentCustomer: 'People into wellness',
    pricePoint: '$8,900 install, $340/yr maintenance',
    audienceType: 'B2C',
    billing: 'One-time plus recurring',
    geo: 'Phoenix and Scottsdale, Arizona',
  },
];

const AUDIENCE_TYPES = ['B2B', 'B2C', 'Both B2B and B2C'];
const BILLING_TYPES = [
  'One-time',
  'Recurring subscription',
  'Recurring plus a high-ticket one-time',
  'Retainer',
];

const PRICE_BAND_STYLES: Record<string, string> = {
  'low-ticket': 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  'mid-ticket': 'bg-blue-500/15 text-blue-300 border-blue-400/30',
  'high-ticket': 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  enterprise: 'bg-purple-500/15 text-purple-300 border-purple-400/30',
};

function resultToText(r: ICPResult): string {
  const lines: string[] = [];
  if (r.offer_read) lines.push(`OFFER READ: ${r.offer_read}`);
  if (r.price_band) lines.push(`PRICE BAND: ${r.price_band}`);
  if (r.affordability_warning) lines.push(`\nAUDIENCE QUALITY WARNING\n${r.affordability_warning}`);

  (r.segments || []).forEach((s, i) => {
    lines.push(`\n=== SEGMENT ${i + 1}: ${s.name || ''} ===`);
    if (s.who_they_are) lines.push(s.who_they_are);
    lines.push(`Age: ${s.age_range || 'n/a'}${s.gender_skew ? `  |  Gender skew: ${s.gender_skew}` : ''}`);
    if (s.spending_signal) lines.push(`Spending capacity: ${s.spending_signal}`);
    if (s.meta_interests?.length) lines.push(`Meta interests: ${s.meta_interests.join(', ')}`);
    if (s.meta_behaviors?.length) lines.push(`Meta behaviors: ${s.meta_behaviors.join(', ')}`);
    if (s.exclusions?.length) lines.push(`Exclude: ${s.exclusions.join(', ')}`);
    if (s.buying_trigger) lines.push(`Buying trigger: ${s.buying_trigger}`);
    if (s.objection) lines.push(`Objection: ${s.objection}`);
    if (s.objection_counter) lines.push(`Counter in ad copy: ${s.objection_counter}`);
    if (s.lookalike_seed) lines.push(`Lookalike seed: ${s.lookalike_seed}`);
    if (s.ad_angle) lines.push(`Ad angle: ${s.ad_angle}`);
  });

  if (r.campaign_setup_notes?.length) {
    lines.push('\nCAMPAIGN SETUP');
    r.campaign_setup_notes.forEach((n) => lines.push(`- ${n}`));
  }
  if (r.do_not_target?.length) {
    lines.push('\nDO NOT TARGET');
    r.do_not_target.forEach((n) => lines.push(`- ${n}`));
  }
  lines.push('\nBuilt with the free KenjiAI ICP Generator: https://kenjiai.com/tools/icp-generator');
  return lines.join('\n');
}

const ICPGeneratorPage: React.FC = () => {
  const [offer, setOffer] = useState('');
  const [currentCustomer, setCurrentCustomer] = useState('');
  const [pricePoint, setPricePoint] = useState('');
  const [audienceType, setAudienceType] = useState(AUDIENCE_TYPES[0]);
  const [billing, setBilling] = useState(BILLING_TYPES[0]);
  const [geo, setGeo] = useState('United States');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ICPResult | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSeg, setCopiedSeg] = useState<number | null>(null);

  const loadExample = (ex: Example) => {
    setOffer(ex.offer);
    setCurrentCustomer(ex.currentCustomer);
    setPricePoint(ex.pricePoint);
    setAudienceType(ex.audienceType === 'B2B' ? AUDIENCE_TYPES[0] : AUDIENCE_TYPES[1]);
    setBilling(
      BILLING_TYPES.find((b) => b.toLowerCase() === ex.billing.toLowerCase()) || BILLING_TYPES[0]
    );
    setGeo(ex.geo);
    setResult(null);
    setError('');
  };

  const handleSubmit = useCallback(async () => {
    if (offer.trim().length < 25) {
      setError('Give us one real sentence about what you sell. A few words is not enough to build an audience from.');
      return;
    }
    if (!pricePoint.trim()) {
      setError('Price point is required. It changes the whole audience.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/.netlify/functions/generate-icp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer, currentCustomer, pricePoint, audienceType, billing, geo }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Something went wrong building your ICP. Try again.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Could not reach the generator. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [offer, currentCustomer, pricePoint, audienceType, billing, geo]);

  const handleCopyAll = () => {
    if (!result) return;
    navigator.clipboard.writeText(resultToText(result)).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  };

  const handleCopySegment = (seg: ICPSegment, idx: number) => {
    const targeting = [...(seg.meta_interests || []), ...(seg.meta_behaviors || [])].join(', ');
    navigator.clipboard.writeText(targeting).then(() => {
      setCopiedSeg(idx);
      setTimeout(() => setCopiedSeg(null), 2000);
    });
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'KenjiAI ICP Generator',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Free tool that turns what you sell and what you charge into 2 or 3 named buyer segments with real Meta Ads detailed-targeting interests, exclusions, buying triggers, objection counters, and lookalike seeds.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: 'KenjiAI', url: 'https://kenjiai.com' },
  };

  const bandKey = (result?.price_band || '').toLowerCase().trim();

  return (
    <>
      <SEOHead
        title="Free ICP Generator: Build Your Ideal Customer Profile For Ad Targeting | KenjiAI"
        description="Describe what you sell and what you charge. Get 2 or 3 named buyer segments with real Meta Ads interests, exclusions, buying triggers, objection counters, and lookalike seeds you can configure a campaign from today. Free, no signup."
        keywords="ICP generator, ideal customer profile generator, ad targeting tool, Meta Ads audience builder, Facebook ads interest targeting, lookalike audience seed, free ICP tool, customer avatar generator, ad audience research"
        canonical="https://kenjiai.com/tools/icp-generator"
        ogType="website"
        structuredData={structuredData}
      />

      <div className="pt-24 pb-20 bg-gray-900 min-h-screen text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-blue-400/30 rounded-full px-5 py-2.5 mb-6">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 font-semibold text-sm">Free ICP Generator</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
              Your ads are guessing.
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Build the ICP first.
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Most accounts run on whatever the algorithm decides, no interest layering, no exclusions,
              no lookalike seed. Tell us what you sell and what you charge, and get named buyer segments
              with the targeting a media buyer would actually type into Ads Manager.
            </p>
          </div>

          {/* Form */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6 sm:p-8 mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mr-1">
                Try an example
              </span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={() => loadExample(ex)}
                  className="text-xs bg-gray-900 border border-gray-700 hover:border-blue-400/60 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  {ex.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <label htmlFor="icp-offer" className="block text-sm font-semibold text-gray-300 mb-2">
                  What do you sell, and what does it actually do for the buyer?
                </label>
                <textarea
                  id="icp-offer"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  rows={4}
                  placeholder="e.g. We install and service backyard cold plunge tubs at customers homes, including the electrical and water hookup, with a yearly maintenance plan."
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="icp-price" className="block text-sm font-semibold text-gray-300 mb-2">
                    Price point
                  </label>
                  <input
                    id="icp-price"
                    value={pricePoint}
                    onChange={(e) => setPricePoint(e.target.value)}
                    placeholder="e.g. $297/mo, or $4,500 one time"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label htmlFor="icp-geo" className="block text-sm font-semibold text-gray-300 mb-2">
                    Where you sell
                  </label>
                  <input
                    id="icp-geo"
                    value={geo}
                    onChange={(e) => setGeo(e.target.value)}
                    placeholder="e.g. Dallas metro, or United States"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label htmlFor="icp-audience" className="block text-sm font-semibold text-gray-300 mb-2">
                    Who buys
                  </label>
                  <select
                    id="icp-audience"
                    value={audienceType}
                    onChange={(e) => setAudienceType(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                  >
                    {AUDIENCE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="icp-billing" className="block text-sm font-semibold text-gray-300 mb-2">
                    How they pay
                  </label>
                  <select
                    id="icp-billing"
                    value={billing}
                    onChange={(e) => setBilling(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                  >
                    {BILLING_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="icp-current" className="block text-sm font-semibold text-gray-300 mb-2">
                  Who do you think your customer is right now?{' '}
                  <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  id="icp-current"
                  value={currentCustomer}
                  onChange={(e) => setCurrentCustomer(e.target.value)}
                  placeholder="e.g. Homeowners into wellness. If this is too broad, the tool will say so."
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-400"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3 text-sm text-red-300">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Building your ICP, about 15 seconds
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5" />
                    Build My ICP
                  </>
                )}
              </button>
              <p className="text-center text-xs text-gray-500">
                Free, no signup, no email. Nothing is stored.
              </p>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="flex flex-col gap-6">
              {/* Read-back + price band */}
              <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                    <Layers className="w-4 h-4" />
                    What we built this from
                  </div>
                  <div className="flex items-center gap-2">
                    {result.price_band && (
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                          PRICE_BAND_STYLES[bandKey] || 'bg-gray-700/40 text-gray-300 border-gray-600'
                        }`}
                      >
                        {result.price_band}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={handleCopyAll}
                      className="flex items-center gap-1.5 text-xs bg-gray-900 border border-gray-700 hover:border-blue-400/60 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedAll ? 'Copied' : 'Copy full ICP'}
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">{result.offer_read}</p>
              </div>

              {/* Affordability warning */}
              {result.affordability_warning && (
                <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                    <Wallet className="w-4 h-4" />
                    Audience quality check
                  </div>
                  <p className="text-amber-100/90 leading-relaxed">{result.affordability_warning}</p>
                  <p className="text-amber-200/50 text-xs mt-3 leading-relaxed">
                    Why this matters: broad reach on a cheap offer buys clicks from people whose cards
                    decline at checkout. We found that in our own account before we built this.
                  </p>
                </div>
              )}

              {/* Segments */}
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-400" />
                  Your buyer segments
                  <span className="text-sm font-normal text-gray-500">
                    one ad set each
                  </span>
                </h2>

                <div className="flex flex-col gap-5">
                  {(result.segments || []).map((seg, idx) => (
                    <div
                      key={`${seg.name}-${idx}`}
                      className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-blue-600/15 to-emerald-500/10 border-b border-gray-700 px-6 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">
                              Segment {idx + 1}
                            </div>
                            <h3 className="text-xl font-bold text-white">{seg.name}</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopySegment(seg, idx)}
                            title="Copy this segment's targeting terms for Ads Manager"
                            className="flex items-center gap-1.5 text-xs bg-gray-900/70 border border-gray-700 hover:border-blue-400/60 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                          >
                            {copiedSeg === idx ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            {copiedSeg === idx ? 'Copied' : 'Copy targeting'}
                          </button>
                        </div>
                        {seg.who_they_are && (
                          <p className="text-gray-300 text-sm mt-3 leading-relaxed">{seg.who_they_are}</p>
                        )}
                      </div>

                      <div className="px-6 py-5 flex flex-col gap-5">
                        {/* Demographics row */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl px-4 py-3">
                            <div className="text-xs text-gray-500 mb-1">Age</div>
                            <div className="text-white font-semibold text-sm">
                              {seg.age_range || 'No strong skew'}
                            </div>
                          </div>
                          {seg.gender_skew ? (
                            <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl px-4 py-3">
                              <div className="text-xs text-gray-500 mb-1">Gender skew</div>
                              <div className="text-white font-semibold text-sm">{seg.gender_skew}</div>
                            </div>
                          ) : null}
                          {seg.spending_signal && (
                            <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl px-4 py-3 col-span-2 sm:col-span-1">
                              <div className="text-xs text-gray-500 mb-1">Spending capacity</div>
                              <div className="text-white font-semibold text-sm leading-snug">
                                {seg.spending_signal}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Meta targeting */}
                        {(seg.meta_interests?.length || seg.meta_behaviors?.length) && (
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2.5">
                              Meta detailed targeting
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(seg.meta_interests || []).map((i) => (
                                <span
                                  key={i}
                                  className="text-sm bg-emerald-500/10 border border-emerald-400/25 text-emerald-200 px-3 py-1.5 rounded-lg"
                                >
                                  {i}
                                </span>
                              ))}
                              {(seg.meta_behaviors || []).map((b) => (
                                <span
                                  key={b}
                                  className="text-sm bg-blue-500/10 border border-blue-400/25 text-blue-200 px-3 py-1.5 rounded-lg"
                                >
                                  {b}
                                </span>
                              ))}
                            </div>
                            <div className="text-xs text-gray-600 mt-2">
                              Green are interests, blue are behaviors, demographics, and job titles.
                              Verify each one still exists in your Ads Manager, Meta retires categories.
                            </div>
                          </div>
                        )}

                        {/* Exclusions */}
                        {seg.exclusions?.length ? (
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2.5">
                              Exclude from this ad set
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {seg.exclusions.map((e) => (
                                <span
                                  key={e}
                                  className="text-sm bg-red-500/10 border border-red-400/25 text-red-200 px-3 py-1.5 rounded-lg"
                                >
                                  {e}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {/* Trigger + lookalike */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {seg.buying_trigger && (
                            <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-4">
                              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2">
                                <Zap className="w-3.5 h-3.5" />
                                Why they buy now
                              </div>
                              <p className="text-gray-300 text-sm leading-relaxed">{seg.buying_trigger}</p>
                            </div>
                          )}
                          {seg.lookalike_seed && (
                            <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-4">
                              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
                                <Users className="w-3.5 h-3.5" />
                                Lookalike seed
                              </div>
                              <p className="text-gray-300 text-sm leading-relaxed">{seg.lookalike_seed}</p>
                            </div>
                          )}
                        </div>

                        {/* Objection */}
                        {seg.objection && (
                          <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-4">
                            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
                              <MessageSquareWarning className="w-3.5 h-3.5" />
                              Their objection
                            </div>
                            <p className="text-gray-400 text-sm italic mb-3">"{seg.objection}"</p>
                            {seg.objection_counter && (
                              <>
                                <div className="text-xs text-gray-500 mb-1">Answer it in the ad copy:</div>
                                <p className="text-white text-sm leading-relaxed">{seg.objection_counter}</p>
                              </>
                            )}
                          </div>
                        )}

                        {/* Ad angle */}
                        {seg.ad_angle && (
                          <div className="bg-gradient-to-r from-blue-600/10 to-emerald-500/10 border border-blue-400/25 rounded-xl p-4">
                            <div className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-2">
                              Hook to test first
                            </div>
                            <p className="text-white font-medium leading-relaxed">{seg.ad_angle}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Setup notes */}
              {result.campaign_setup_notes?.length ? (
                <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-4">
                    <Sliders className="w-4 h-4" />
                    How to set the campaign up
                  </div>
                  <ul className="flex flex-col gap-3">
                    {result.campaign_setup_notes.map((n) => (
                      <li key={n} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Do not target */}
              {result.do_not_target?.length ? (
                <div className="bg-gray-800/40 border border-red-400/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-4">
                    <Ban className="w-4 h-4" />
                    Do not target
                  </div>
                  <ul className="flex flex-col gap-3">
                    {result.do_not_target.map((n) => (
                      <li key={n} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* CTA into the real service */}
              <div className="bg-gradient-to-r from-blue-900/30 to-emerald-900/25 border border-blue-400/30 rounded-3xl p-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                  Want us to build and run this targeting for you?
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-6 leading-relaxed">
                  An ICP on a screen does not spend budget. We build the ad sets, write the creative for
                  each segment, run the tests, and answer the calls the ads generate with our AI call
                  center so no lead sits in voicemail.
                </p>
                <a
                  href="https://go.mediatraffics.com/leads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  Book a strategy call
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          )}

          {/* How it works / SEO copy */}
          {!result && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
              <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
                <div className="text-blue-400 font-bold mb-2">Segments, not one avatar</div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Most businesses have two or three real buyer types who need different ad sets and
                  different copy. You get them separately, with the budget split.
                </p>
              </div>
              <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
                <div className="text-emerald-400 font-bold mb-2">Targeting you can paste in</div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Named Meta detailed-targeting interests, behaviors, and exclusions per segment, plus
                  what to seed a lookalike from. Copy the list, open Ads Manager, build the ad set.
                </p>
              </div>
              <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
                <div className="text-amber-400 font-bold mb-2">An affordability check</div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your price decides who can actually pay. Every ICP comes with the minimum spending
                  signal to require, even on a cheap front-end offer.
                </p>
              </div>
            </div>
          )}

          {/* FAQ for AEO */}
          <div className="border-t border-gray-800 pt-12">
            <h2 className="text-2xl font-bold mb-6">Questions people ask</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
              <div className="bg-gray-800/40 border border-gray-800 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-2">What is an ICP, and how is it different from a persona?</h3>
                <p className="text-gray-400 leading-relaxed">
                  A persona is a description. An ICP is a configuration: age range, spending capacity,
                  the interests and behaviors you select, who you exclude, and which list you seed a
                  lookalike from. This tool gives you the second one.
                </p>
              </div>
              <div className="bg-gray-800/40 border border-gray-800 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-2">Are the Meta interests guaranteed to exist?</h3>
                <p className="text-gray-400 leading-relaxed">
                  Treat them as a search list, not a guarantee. Meta adds and retires detailed-targeting
                  categories constantly. Search each term in Ads Manager and take the closest real match,
                  or use it as the seed for a broader interest.
                </p>
              </div>
              <div className="bg-gray-800/40 border border-gray-800 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-2">Should I still use Advantage+ audience expansion?</h3>
                <p className="text-gray-400 leading-relaxed">
                  Yes, once the pixel has real conversion data to learn from. Before that, expansion
                  spends your budget discovering what you already know about your buyer. Start layered,
                  then loosen.
                </p>
              </div>
              <div className="bg-gray-800/40 border border-gray-800 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-2">Why does a cheap offer need an affordability signal?</h3>
                <p className="text-gray-400 leading-relaxed">
                  We ran a $7 front-end offer on broad targeting and a real share of the declines were
                  banks refusing debit and prepaid cards. The click was cheap, the customer could not
                  pay. Cheap still needs some spending signal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ICPGeneratorPage;
