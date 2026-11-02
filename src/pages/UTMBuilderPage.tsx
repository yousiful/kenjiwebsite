import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageSchema from '../components/PageSchema';
import { Link2, Copy, Check, Download, ArrowRight, AlertCircle } from 'lucide-react';

type Preset = { id: string; label: string; source: string; medium: string; meta?: boolean };

// Source/medium pairs chosen so GA4's default channel grouping files each one correctly.
const PRESETS: Preset[] = [
  { id: 'facebook', label: 'Facebook Ads', source: 'facebook', medium: 'paid_social', meta: true },
  { id: 'instagram-ads', label: 'Instagram Ads', source: 'instagram', medium: 'paid_social', meta: true },
  { id: 'instagram-bio', label: 'Instagram bio / post', source: 'instagram', medium: 'social' },
  { id: 'google', label: 'Google Ads', source: 'google', medium: 'cpc' },
  { id: 'email', label: 'Email newsletter', source: 'newsletter', medium: 'email' },
  { id: 'sms', label: 'Text message', source: 'sms', medium: 'sms' },
  { id: 'tiktok', label: 'TikTok Ads', source: 'tiktok', medium: 'paid_social' },
];

const META_PARAMS =
  'utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}';

const clean = (v: string, tidy: boolean) => {
  const t = v.trim();
  return tidy ? t.toLowerCase().replace(/\s+/g, '_') : t;
};

const parseUrl = (raw: string): URL | null => {
  const s = raw.trim();
  if (!s) return null;
  try {
    const u = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(s) ? s : `https://${s}`);
    if (!/^https?:$/.test(u.protocol) || !u.hostname.includes('.')) return null;
    return u;
  } catch {
    return null;
  }
};

const CopyButton: React.FC<{ text: string; label?: string }> = ({ text, label = 'Copy' }) => {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 2000);
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shrink-0"
    >
      {done ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {done ? 'Copied' : label}
    </button>
  );
};

// Draws the QR client-side (qrcode-generator loads only once a link exists) and returns a PNG data URL.
const useQrPng = (text: string) => {
  const [png, setPng] = useState('');
  useEffect(() => {
    if (!text) {
      setPng('');
      return;
    }
    let alive = true;
    import('qrcode-generator').then(({ default: qrcode }) => {
      const qr = qrcode(0, 'M');
      qr.addData(text);
      qr.make();
      const count = qr.getModuleCount();
      const quiet = 4;
      const cell = Math.max(4, Math.floor(640 / (count + quiet * 2)));
      const size = (count + quiet * 2) * cell;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#000000';
      for (let r = 0; r < count; r++)
        for (let c = 0; c < count; c++)
          if (qr.isDark(r, c)) ctx.fillRect((c + quiet) * cell, (r + quiet) * cell, cell, cell);
      if (alive) setPng(canvas.toDataURL('image/png'));
    });
    return () => {
      alive = false;
    };
  }, [text]);
  return png;
};

const Text: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  required?: boolean;
}> = ({ label, value, onChange, placeholder, hint, required }) => (
  <label className="block">
    <span className="text-sm font-medium text-gray-300">
      {label} {required ? <span className="text-blue-400">*</span> : <span className="text-gray-500 font-normal">(optional)</span>}
    </span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1.5 w-full rounded-lg border border-gray-700 bg-gray-900/70 px-3 py-2.5 text-white text-base outline-none focus:border-blue-500"
    />
    {hint && <span className="mt-1 block text-[11px] text-gray-500">{hint}</span>}
  </label>
);

const UTMBuilderPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [preset, setPreset] = useState('facebook');
  const [source, setSource] = useState('facebook');
  const [medium, setMedium] = useState('paid_social');
  const [campaign, setCampaign] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');
  const [tidy, setTidy] = useState(true);

  const pickPreset = (p: Preset) => {
    setPreset(p.id);
    setSource(p.source);
    setMedium(p.medium);
  };

  const parsed = useMemo(() => parseUrl(url), [url]);
  const hadUtm = useMemo(() => (parsed ? [...parsed.searchParams.keys()].some((k) => k.toLowerCase().startsWith('utm_')) : false), [parsed]);

  const s = clean(source, tidy);
  const m = clean(medium, tidy);
  const c = clean(campaign, tidy);
  const missing = [!s && 'source', !m && 'medium', !c && 'campaign name'].filter(Boolean) as string[];

  const link = useMemo(() => {
    if (!parsed || missing.length) return '';
    const u = new URL(parsed.toString());
    [...u.searchParams.keys()].filter((k) => k.toLowerCase().startsWith('utm_')).forEach((k) => u.searchParams.delete(k));
    u.searchParams.set('utm_source', s);
    u.searchParams.set('utm_medium', m);
    u.searchParams.set('utm_campaign', c);
    const t = clean(term, tidy);
    const ct = clean(content, tidy);
    if (t) u.searchParams.set('utm_term', t);
    if (ct) u.searchParams.set('utm_content', ct);
    return u.toString();
  }, [parsed, s, m, c, term, content, tidy, missing.length]);

  const qrPng = useQrPng(link);
  const activePreset = PRESETS.find((p) => p.id === preset);

  const faqs = [
    {
      q: 'What is a UTM link?',
      a: 'A normal link with a few tags added to the end (utm_source, utm_medium, utm_campaign and so on). When someone clicks it, Google Analytics reads the tags and records exactly where that visitor came from.',
    },
    {
      q: 'Which UTM parameters are required?',
      a: 'Source, medium and campaign. Source is the site or list the click came from (facebook, newsletter). Medium is the type of traffic (paid_social, email, cpc). Campaign is your name for the promotion. Term and content are optional and help you compare keywords or ad versions.',
    },
    {
      q: 'Why should UTM tags be lowercase?',
      a: 'Google Analytics treats "Facebook" and "facebook" as two different sources, which splits your numbers. Keeping everything lowercase with underscores instead of spaces keeps reports clean. The tidy option above does this for you.',
    },
    {
      q: 'Do I need UTM tags on Google Ads?',
      a: 'If your Google Ads account is linked to Google Analytics with auto-tagging on, Google already tracks those clicks with the gclid parameter. UTM tags still help when you send the traffic to a CRM or a tool that does not read gclid.',
    },
    {
      q: 'Should I use UTM links on my own website?',
      a: 'No. Tagging links between pages of your own site restarts the visit and overwrites where the person really came from. Use UTM links only on links that point to your site from somewhere else: ads, emails, texts, social posts, QR codes.',
    },
    {
      q: 'How do I track a flyer or printed sign?',
      a: 'Build a link with source set to the place (flyer, truck_wrap, yard_sign) and medium set to print, then download the QR code above and put it on the piece. Every scan shows up in Analytics under that source.',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-white">
      <PageSchema
        path="/tools/utm-builder"
        name={'Free UTM Builder: UTM Link Generator with QR Code'}
        description={'Build UTM tracking links for Facebook, Instagram, Google Ads, email and text in seconds. Free UTM generator with presets, one-click copy and a QR code.'}
      />
      <Helmet>
        <title>Free UTM Builder: UTM Link Generator with QR Code | KenjiAI</title>
        <meta
          name="description"
          content="Build UTM tracking links for Facebook, Instagram, Google Ads, email and text in seconds. Free UTM generator with presets, one-click copy and a QR code."
        />
        <link rel="canonical" href="https://kenjiai.com/tools/utm-builder" />
        <meta property="og:title" content="Free UTM Builder & Link Generator | KenjiAI" />
        <meta property="og:description" content="Tag every ad, email and text with UTM links so you know which one brought the customer. Presets, copy and QR code included." />
        <meta property="og:url" content="https://kenjiai.com/tools/utm-builder" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'KenjiAI UTM Builder',
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
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Link2 className="w-3.5 h-3.5" />
            Free Tool
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">UTM Builder</h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            Tag the links in your ads, emails and texts so Google Analytics tells you which one brought the customer. Pick a preset, name the campaign, copy the link.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-gray-800/80 border border-gray-700/70 rounded-2xl p-6 sm:p-8 space-y-5 min-w-0">
            <label className="block">
              <span className="text-sm font-medium text-gray-300">
                Page you are sending people to <span className="text-blue-400">*</span>
              </span>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yourbusiness.com/offer"
                inputMode="url"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className="mt-1.5 w-full rounded-lg border border-gray-700 bg-gray-900/70 px-3 py-2.5 text-white text-base outline-none focus:border-blue-500"
              />
              {url.trim() && !parsed && (
                <span className="mt-1.5 block text-xs text-red-300">That doesn't look like a web address yet. Try something like yourbusiness.com/offer.</span>
              )}
            </label>

            <div>
              <span className="text-sm font-medium text-gray-300">Where will this link go?</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => pickPreset(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      preset === p.id
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-900/70 border-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Text label="Source" required value={source} onChange={(v) => { setSource(v); setPreset(''); }} placeholder="facebook" hint="utm_source: the site or list" />
              <Text label="Medium" required value={medium} onChange={(v) => { setMedium(v); setPreset(''); }} placeholder="paid_social" hint="utm_medium: the type of traffic" />
            </div>
            <Text label="Campaign name" required value={campaign} onChange={setCampaign} placeholder="spring_sale" hint="utm_campaign: your name for this promotion" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Text label="Term" value={term} onChange={setTerm} placeholder="roof_repair" hint="utm_term: keyword or audience" />
              <Text label="Content" value={content} onChange={setContent} placeholder="video_a" hint="utm_content: which ad or button" />
            </div>

            <label className="flex items-start gap-2.5 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={tidy} onChange={(e) => setTidy(e.target.checked)} className="mt-0.5 h-4 w-4 accent-blue-600" />
              <span>Make tags lowercase and swap spaces for underscores (keeps your Analytics reports from splitting)</span>
            </label>
          </div>

          <div className="lg:col-span-5 space-y-4 min-w-0">
            <div className="bg-gray-800/80 border border-emerald-500/40 rounded-2xl p-5">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300">Your tracking link</span>
              {link ? (
                <>
                  <p data-testid="utm-output" className="mt-2 text-sm text-gray-200 bg-gray-950/70 border border-gray-800 rounded-lg px-3 py-2 font-mono break-all">
                    {link}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <CopyButton text={link} label="Copy link" />
                    <a href={link} target="_blank" rel="noreferrer" className="text-xs text-blue-400 underline">
                      Test it
                    </a>
                  </div>
                  {hadUtm && <p className="mt-2 text-[11px] text-amber-300">Your address already had UTM tags. They were replaced with the ones above.</p>}
                </>
              ) : (
                <p className="mt-2 text-sm text-gray-400">
                  {!parsed ? 'Enter the page address to see your link.' : `Add the ${missing.join(' and ')} to finish your link.`}
                </p>
              )}
            </div>

            {link && qrPng && (
              <div>
                <div className="bg-white rounded-2xl p-5 text-center">
                  <img src={qrPng} alt="QR code for your UTM tracking link" className="w-full max-w-[280px] mx-auto h-auto" />
                  <p className="text-gray-900 text-xs mt-2">Scans are tracked under the same tags</p>
                </div>
                <a
                  href={qrPng}
                  download={`utm-qr-${c || 'link'}.png`}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download QR code (PNG)
                </a>
              </div>
            )}

            {activePreset?.meta && (
              <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-5">
                <div className="flex items-start gap-2 text-sm font-semibold text-white">
                  <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  Running many Meta ads? Let Meta fill the tags in
                </div>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Paste this into the URL parameters box in Ads Manager (under Tracking). Meta swaps in each campaign, ad set and ad name for you.
                </p>
                <p className="mt-2 text-xs text-gray-200 bg-gray-950/70 border border-gray-800 rounded-lg px-3 py-2 font-mono break-all">{META_PARAMS}</p>
                <div className="mt-2">
                  <CopyButton text={META_PARAMS} label="Copy parameters" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 text-center">
          <p className="text-gray-300 text-sm">Once the tags are in, you can see which ads bring leads. If you want a second set of eyes on what the numbers say, we can help.</p>
          <a href="/growth-quiz" className="mt-3 inline-flex items-center gap-2 text-blue-400 font-semibold text-sm hover:text-blue-300">
            Take the 60-second growth quiz <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="mt-16 border-t border-gray-800 pt-12">
          <h2 className="text-2xl font-bold text-white mb-6">UTM questions people ask</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            {faqs.map((f) => (
              <div key={f.q} className="bg-gray-800/40 border border-gray-800 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-2">{f.q}</h3>
                <p className="text-gray-400 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UTMBuilderPage;
