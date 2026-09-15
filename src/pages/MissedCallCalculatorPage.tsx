import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  TrendingUp, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Calculator, 
  PhoneCall, 
  Clock, 
  Share2 
} from 'lucide-react';

interface IndustryPreset {
  id: string;
  name: string;
  calls: number;
  missedRate: number;
  ticketSize: number;
  closeRate: number;
}

const INDUSTRY_PRESETS: IndustryPreset[] = [
  { id: 'hvac', name: 'HVAC & Plumbing', calls: 450, missedRate: 28, ticketSize: 3800, closeRate: 25 },
  { id: 'roofing', name: 'Roofing & Solar', calls: 300, missedRate: 32, ticketSize: 12500, closeRate: 20 },
  { id: 'medspa', name: 'Med Spa & Aesthetics', calls: 400, missedRate: 26, ticketSize: 1850, closeRate: 32 },
  { id: 'legal', name: 'Personal Injury Law', calls: 180, missedRate: 35, ticketSize: 15000, closeRate: 15 },
  { id: 'lending', name: 'Commercial Lending', calls: 220, missedRate: 24, ticketSize: 8500, closeRate: 18 },
  { id: 'custom', name: 'Custom Business', calls: 350, missedRate: 27, ticketSize: 3000, closeRate: 22 }
];

const MissedCallCalculatorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';

  const [selectedPreset, setSelectedPreset] = useState<string>('hvac');
  const [monthlyCalls, setMonthlyCalls] = useState<number>(450);
  const [missedCallRate, setMissedCallRate] = useState<number>(28);
  const [ticketSize, setTicketSize] = useState<number>(3800);
  const [closeRate, setCloseRate] = useState<number>(25);
  const [copiedEmbed, setCopiedEmbed] = useState<boolean>(false);

  const handleSelectPreset = (preset: IndustryPreset) => {
    setSelectedPreset(preset.id);
    setMonthlyCalls(preset.calls);
    setMissedCallRate(preset.missedRate);
    setTicketSize(preset.ticketSize);
    setCloseRate(preset.closeRate);
  };

  const stats = useMemo(() => {
    const missedCallsMonthly = Math.round(monthlyCalls * (missedCallRate / 100));
    const highIntentLeadLoss = Math.round(missedCallsMonthly * 0.70);
    const dealsLostMonthly = Math.round(highIntentLeadLoss * (closeRate / 100));
    const monthlyRevenueLoss = dealsLostMonthly * ticketSize;
    const annualRevenueLoss = monthlyRevenueLoss * 12;

    const recoverableAnnualRevenue = Math.round(annualRevenueLoss * 0.90);
    const estimatedKenjiCostAnnual = 4500 * 12;
    const estimatedROI = monthlyRevenueLoss > 0 
      ? Math.max(1, Math.round((recoverableAnnualRevenue - estimatedKenjiCostAnnual) / estimatedKenjiCostAnnual)) 
      : 0;

    return {
      missedCallsMonthly,
      dealsLostMonthly,
      monthlyRevenueLoss,
      annualRevenueLoss,
      recoverableAnnualRevenue,
      estimatedROI
    };
  }, [monthlyCalls, missedCallRate, ticketSize, closeRate]);

  const embedCode = `<iframe src="https://kenjiai.com/tools/missed-call-calculator?embed=true" width="100%" height="780" frameborder="0" style="border:1px solid #1f2937;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.35);" title="KenjiAI Missed Call Revenue Loss Calculator"></iframe>
<p style="font-size:12px;color:#9ca3af;text-align:center;margin-top:8px;font-family:sans-serif;">
  Calculator powered by <a href="https://kenjiai.com" target="_blank" rel="dofollow" style="color:#3b82f6;text-decoration:underline;font-weight:600;">KenjiAI - Done-For-You AI Call Centers</a>
</p>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  return (
    <div className={`min-h-screen ${isEmbed ? 'bg-gray-900 p-4' : 'pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-white'}`}>
      <Helmet>
        <title>Missed Call Revenue Loss Calculator | KenjiAI</title>
        <meta 
          name="description" 
          content="Calculate how much revenue your business loses to missed calls each month. See instant recovery projections with KenjiAI 24/7 Done-For-You AI Call Centers." 
        />
        <link rel="canonical" href="https://kenjiai.com/tools/missed-call-calculator" />
        <meta property="og:title" content="Missed Call Revenue Loss Calculator | KenjiAI" />
        <meta property="og:description" content="Calculate your annual revenue bleed from unanswered calls and see how much a 24/7 AI call center recovers." />
        <meta property="og:url" content="https://kenjiai.com/tools/missed-call-calculator" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            'name': 'KenjiAI Missed Call Revenue Loss Calculator',
            'applicationCategory': 'BusinessApplication',
            'operatingSystem': 'Web',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD'
            },
            'description': 'Interactive calculator estimating financial revenue loss from unanswered business phone calls.',
            'publisher': {
              '@type': 'Organization',
              'name': 'KenjiAI',
              'url': 'https://kenjiai.com'
            }
          })}
        </script>
      </Helmet>

      <div className="max-w-5xl mx-auto">
        {!isEmbed && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Calculator className="w-3.5 h-3.5" />
              Free Interactive Diagnostic Tool
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Missed Call <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-500 to-amber-400">Revenue Loss</span> Calculator
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              85% of inbound callers who hit voicemail hang up and call your nearest competitor immediately. 
              Find out exactly how much pipeline revenue your business is bleeding each year.
            </p>
          </div>
        )}

        {/* Industry Presets */}
        <div className="mb-8">
          <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
            Select Your Industry Benchmark:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {INDUSTRY_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all text-center ${
                  selectedPreset === preset.id
                    ? 'bg-blue-600/30 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-gray-800/60 border-gray-700/60 text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-gray-800/80 border border-gray-700/70 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-gray-700/60 pb-3">
              <PhoneCall className="w-5 h-5 text-blue-400" />
              Call Volume & Economics
            </h2>

            {/* Inbound Calls */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">Monthly Inbound Calls</span>
                <span className="text-sm font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                  {monthlyCalls.toLocaleString()} calls
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="3000"
                step="10"
                value={monthlyCalls}
                onChange={(e) => {
                  setMonthlyCalls(Number(e.target.value));
                  setSelectedPreset('custom');
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                <span>20 calls</span>
                <span>1,500 calls</span>
                <span>3,000+ calls</span>
              </div>
            </div>

            {/* Missed Call Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">Estimated Missed Call Rate</span>
                <span className="text-sm font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">
                  {missedCallRate}% missed
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={missedCallRate}
                onChange={(e) => {
                  setMissedCallRate(Number(e.target.value));
                  setSelectedPreset('custom');
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                <span>5% (Low)</span>
                <span>27% (US National Average)</span>
                <span>60% (After-hours heavy)</span>
              </div>
            </div>

            {/* Average Deal Value */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">Avg Customer Value / Ticket Size</span>
                <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  ${ticketSize.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="25000"
                step="100"
                value={ticketSize}
                onChange={(e) => {
                  setTicketSize(Number(e.target.value));
                  setSelectedPreset('custom');
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                <span>$200</span>
                <span>$10,000</span>
                <span>$25,000+</span>
              </div>
            </div>

            {/* Close Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">Lead-to-Close Rate (When Answered Live)</span>
                <span className="text-sm font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20">
                  {closeRate}% closed
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={closeRate}
                onChange={(e) => {
                  setCloseRate(Number(e.target.value));
                  setSelectedPreset('custom');
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                <span>5%</span>
                <span>25% (Benchmark)</span>
                <span>60%</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500 shrink-0" />
              <span>Benchmark source: Invoca State of Inbound Calls & Lead Response Analytics.</span>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-gray-800/90 to-gray-900/95 border border-red-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-red-400">Estimated Annual Revenue Loss</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 mt-1">
                ${stats.annualRevenueLoss.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                That is <strong className="text-white">${stats.monthlyRevenueLoss.toLocaleString()} / month</strong> walking out the door directly to your competitors.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-3">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 block font-medium">Calls Missed / Mo</span>
                <span className="text-xl font-bold text-gray-200 mt-1 block">
                  {stats.missedCallsMonthly}
                </span>
              </div>
              <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-3">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 block font-medium">Deals Lost / Mo</span>
                <span className="text-xl font-bold text-red-400 mt-1 block">
                  {stats.dealsLostMonthly} deals
                </span>
              </div>
            </div>

            {/* KenjiAI Recovery Projection */}
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Recoverable with KenjiAI
              </div>
              <div className="text-2xl font-black text-emerald-300">
                +${stats.recoverableAnnualRevenue.toLocaleString()} <span className="text-xs font-normal text-emerald-400/80">/ year</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                By deploying sub-500ms AI voice agents that pick up on Ring 1, 24/7/365, qualify callers, and book calendar appointments instantly.
              </p>
              {stats.estimatedROI > 1 && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Estimated ~{stats.estimatedROI}x Annual ROI
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <a
                href="https://kenjiai.com/pricing2"
                target={isEmbed ? "_blank" : "_self"}
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
              >
                Stop The Bleed — Get KenjiAI Call Center
                <ArrowRight className="w-4 h-4" />
              </a>
              <p className="text-[11px] text-center text-gray-500 mt-2">
                Done-For-You setup in 72 hours • Guaranteed sub-500ms latency
              </p>
            </div>
          </div>
        </div>

        {/* Embed Widget Generator (Backlink Magnet) */}
        {!isEmbed && (
          <div className="mt-16 bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Share2 className="w-4 h-4" />
              Free Publisher Widget
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Embed This Calculator On Your Website or Blog
            </h3>
            <p className="text-sm text-gray-400 mb-4 max-w-2xl">
              Add this interactive missed call revenue calculator to your agency, directory, or industry blog for free. Simply paste the HTML snippet below.
            </p>

            <div className="relative">
              <pre className="bg-gray-950/80 border border-gray-800 text-gray-300 p-4 rounded-xl text-xs overflow-x-auto font-mono">
                {embedCode}
              </pre>
              <button
                type="button"
                onClick={handleCopyEmbed}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-md"
              >
                {copiedEmbed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Educational / FAQ Section for SEO & AEO */}
        {!isEmbed && (
          <div className="mt-16 border-t border-gray-800 pt-12">
            <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-gray-800/40 border border-gray-800 rounded-xl p-5">
                <h4 className="font-semibold text-white mb-2">Why do missed calls cost high-ticket businesses so much?</h4>
                <p className="text-gray-400 leading-relaxed">
                  In high-ticket verticals (roofing, water restoration, medical spas, legal, lending), customers have urgent needs. If their call is unanswered or sent to voicemail, 85% hang up immediately and call the next Google or Meta ad result.
                </p>
              </div>
              <div className="bg-gray-800/40 border border-gray-800 rounded-xl p-5">
                <h4 className="font-semibold text-white mb-2">How fast does KenjiAI answer inbound calls?</h4>
                <p className="text-gray-400 leading-relaxed">
                  KenjiAI voice agents respond in sub-500 milliseconds, identical to a human conversational reflex. Our ultra-low latency infrastructure handles simultaneous spikes with zero busy signals or hold queues.
                </p>
              </div>
              <div className="bg-gray-800/40 border border-gray-800 rounded-xl p-5">
                <h4 className="font-semibold text-white mb-2">Can KenjiAI integrate directly with my CRM?</h4>
                <p className="text-gray-400 leading-relaxed">
                  Yes. KenjiAI natively syncs call recordings, live transcripts, qualification tags, and appointment bookings into GoHighLevel, HubSpot, Salesforce, ServiceTitan, Jobber, and custom webhooks.
                </p>
              </div>
              <div className="bg-gray-800/40 border border-gray-800 rounded-xl p-5">
                <h4 className="font-semibold text-white mb-2">What is the difference between an answering service and KenjiAI?</h4>
                <p className="text-gray-400 leading-relaxed">
                  Traditional answering services cost thousands per month, place callers on hold, read rigid scripts, and take hours to deliver messages. KenjiAI qualifies the lead, quotes standard pricing, and books appointments on your calendar instantly.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissedCallCalculatorPage;
