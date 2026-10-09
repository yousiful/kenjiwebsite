import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, Copy, Check, ExternalLink, Download, ArrowRight } from 'lucide-react';

const PLACE_ID_FINDER = 'https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder';

// Accepts a bare Place ID or any URL that carries one (placeid= / place_id=).
const extractPlaceId = (input: string): string => {
  const s = input.trim();
  const m = s.match(/place_?id[=:]([A-Za-z0-9_-]{20,})/i);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]{20,}$/.test(s) ? s : '';
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

const ReviewLinkGeneratorPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [business, setBusiness] = useState('');

  const placeId = useMemo(() => extractPlaceId(input), [input]);
  const link = placeId ? `https://search.google.com/local/writereview?placeid=${placeId}` : '';
  const qr = link ? `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=12&data=${encodeURIComponent(link)}` : '';
  const name = business.trim() || 'us';

  const templates = link
    ? [
        {
          title: 'Text message',
          body: `Hi! Thanks for choosing ${name}. If we did a good job, would you mind leaving a quick review? It takes 30 seconds and really helps us: ${link}`,
        },
        {
          title: 'Email',
          body: `Subject: How did we do?\n\nHi there,\n\nThanks again for trusting ${name}. Reviews are how most new customers find us, so if you have a minute, we would love to hear how it went:\n\n${link}\n\nThank you!`,
        },
        {
          title: 'Follow-up (3 days later)',
          body: `Quick reminder in case it got buried: if you have 30 seconds, a review for ${name} would mean a lot. ${link}`,
        },
      ]
    : [];

  const faqs = [
    {
      q: 'What is a Google review link?',
      a: 'A direct link that opens the "write a review" box for your business on Google. Customers skip searching for you, so far more of them actually leave the review.',
    },
    {
      q: 'How do I find my Google Place ID?',
      a: 'Open the Google Place ID Finder, type your business name, and copy the ID it shows (it starts with "ChIJ" for most businesses). Paste it into the box above.',
    },
    {
      q: 'Is this free?',
      a: 'Yes. No signup, no email. The link and QR code are yours to use anywhere: receipts, invoices, texts, email signatures, or a sign at the front desk.',
    },
    {
      q: 'When is the best time to ask for a review?',
      a: 'Right after the job is done and the customer is happy, ideally the same day. A text gets opened far more often than an email, so lead with a text and follow up once a few days later.',
    },
    {
      q: 'Can I offer a discount for reviews?',
      a: "No. Google's policy bans paying or rewarding customers for reviews, and it can get reviews removed. Asking every customer, not only the happy ones, keeps you within the rules.",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-white">
      <Helmet>
        <title>Free Google Review Link Generator + QR Code | KenjiAI</title>
        <meta
          name="description"
          content="Make a direct Google review link and QR code for your business in seconds. Free, no signup. Includes ready-to-send text and email templates to ask customers for reviews."
        />
        <link rel="canonical" href="https://kenjiai.com/tools/google-review-link-generator" />
        <meta property="og:title" content="Free Google Review Link Generator | KenjiAI" />
        <meta property="og:description" content="Get a direct review link, a printable QR code, and message templates to collect more Google reviews." />
        <meta property="og:url" content="https://kenjiai.com/tools/google-review-link-generator" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: 'KenjiAI Google Review Link Generator',
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

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Star className="w-3.5 h-3.5" />
            Free Tool
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">Google Review Link Generator</h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            Get a link that takes customers straight to your review box, a QR code you can print, and messages that make asking easy.
          </p>
        </div>

        <div className="bg-gray-800/80 border border-gray-700/70 rounded-2xl p-6 sm:p-8 space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-gray-300">Business name (optional, used in the message templates)</span>
            <input
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder="Smith Plumbing"
              className="mt-1.5 w-full rounded-lg border border-gray-700 bg-gray-900/70 px-3 py-2.5 text-white outline-none focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-300">Your Google Place ID</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
              className="mt-1.5 w-full rounded-lg border border-gray-700 bg-gray-900/70 px-3 py-2.5 text-white font-mono text-sm outline-none focus:border-blue-500"
            />
            <span className="mt-1.5 block text-xs text-gray-400">
              Don't know it?{' '}
              <a href={PLACE_ID_FINDER} target="_blank" rel="noreferrer" className="text-blue-400 underline inline-flex items-center gap-1">
                Find it with Google's Place ID Finder <ExternalLink className="w-3 h-3" />
              </a>
              , search your business, and copy the ID.
            </span>
            {input.trim() && !placeId && (
              <span className="mt-1.5 block text-xs text-red-300">That doesn't look like a Place ID yet. It's a long code, usually starting with "ChIJ".</span>
            )}
          </label>
        </div>

        {link && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-3 space-y-4">
              <div className="bg-gray-800/80 border border-emerald-500/40 rounded-2xl p-5">
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300">Your review link</span>
                <div className="mt-2 flex items-center gap-2">
                  <code className="flex-1 truncate text-sm text-gray-200 bg-gray-950/70 border border-gray-800 rounded-lg px-3 py-2">{link}</code>
                  <CopyButton text={link} />
                </div>
                <a href={link} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-blue-400 underline">
                  Test it <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {templates.map((t) => (
                <div key={t.title} className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-sm font-semibold text-white">{t.title}</span>
                    <CopyButton text={t.body} />
                  </div>
                  <p className="text-sm text-gray-300 whitespace-pre-line break-words">{t.body}</p>
                </div>
              ))}
            </div>

            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl p-5 text-center">
                <img src={qr} alt="QR code linking to your Google review page" className="w-full h-auto" />
                <p className="text-gray-900 font-semibold mt-3">Scan to leave us a review</p>
              </div>
              <a
                href={qr}
                target="_blank"
                rel="noreferrer"
                download="google-review-qr.png"
                className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Open QR code to save or print
              </a>
            </div>
          </div>
        )}

        <div className="mt-10 bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 text-center">
          <p className="text-gray-300 text-sm">
            Reviews bring people to your page. Answering every call is what turns them into customers.
          </p>
          <a
            href="/tools/missed-call-calculator"
            className="mt-3 inline-flex items-center gap-2 text-blue-400 font-semibold text-sm hover:text-blue-300"
          >
            See what missed calls cost you <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="mt-16 border-t border-gray-800 pt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Google review link questions</h2>
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

export default ReviewLinkGeneratorPage;
