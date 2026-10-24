import { useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Mail } from 'lucide-react';
import { HELP_SUPPORT_EMAIL, loadHelpIndex, searchHelp, type HelpIndexEntry } from './helpData';

export const HELP_BG = '#0B0E14';

// Help pages are copies of the platform docs, so they stay out of search results for now.
export function HelpHead({ title, description }: { title: string; description: string }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="noindex, follow" />
    </Helmet>
  );
}

export function HelpShell({ children }: { children: ReactNode }) {
  return (
    <div className="pt-24 pb-20 min-h-screen text-gray-300" style={{ backgroundColor: HELP_BG }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}

export function useHelpIndex() {
  const [index, setIndex] = useState<HelpIndexEntry[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    loadHelpIndex().then(setIndex).catch(() => setError(true));
  }, []);
  return { index, error };
}

export function HelpSearch({ index, autoFocus = false, compact = false }: { index: HelpIndexEntry[] | null; autoFocus?: boolean; compact?: boolean }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const results = index && q.trim().length > 1 ? searchHelp(index, q, 12) : [];
  return (
    <div className="relative w-full">
      <label htmlFor="help-search" className="sr-only">Search help articles</label>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" aria-hidden="true" />
        <input
          id="help-search"
          type="search"
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results[0]) navigate(`/help/article/${results[0].slug}`);
          }}
          placeholder={index ? `Search ${index.length.toLocaleString()} articles, e.g. "connect a domain"` : 'Loading articles...'}
          className={`w-full rounded-xl bg-gray-900/70 border border-gray-800 focus:border-[#10A37F] focus:ring-2 focus:ring-[#10A37F]/30 outline-none text-white placeholder-gray-500 pl-12 pr-4 ${compact ? 'py-3 text-base' : 'py-4 text-lg'}`}
        />
      </div>
      {q.trim().length > 1 && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-800 bg-[#11151d] shadow-2xl overflow-hidden">
          {results.length ? (
            <ul className="max-h-[60vh] overflow-y-auto divide-y divide-gray-800/70">
              {results.map((r) => (
                <li key={r.slug}>
                  <Link to={`/help/article/${r.slug}`} className="block px-4 py-3 hover:bg-white/[0.04] focus:bg-white/[0.04] outline-none">
                    <span className="block text-white font-semibold">{r.title}</span>
                    <span className="block text-xs text-emerald-400/80 mt-0.5">{r.category} · {r.folder}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-4 text-sm text-gray-400">No articles match that. Try fewer words, or email <a className="text-emerald-400 underline" href={`mailto:${HELP_SUPPORT_EMAIL}`}>{HELP_SUPPORT_EMAIL}</a>.</p>
          )}
        </div>
      )}
    </div>
  );
}

export function HelpStillStuck() {
  return (
    <div className="mt-16 rounded-2xl border border-gray-800 bg-gray-900/60 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
      <div>
        <h2 className="text-xl font-bold text-white">Still stuck?</h2>
        <p className="text-gray-400 mt-1">Email us and a real person on the KenjiAI team will help you get it working.</p>
        <p className="text-gray-500 text-sm mt-2">
          Quick-start guides and setup walkthroughs live at{' '}
          <a href="https://support.kenjiai.com/" className="text-emerald-400 hover:underline">support.kenjiai.com</a>.
        </p>
      </div>
      <a
        href={`mailto:${HELP_SUPPORT_EMAIL}`}
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-[#10A37F] text-white hover:bg-[#0E906F] transition-colors whitespace-nowrap"
      >
        <Mail className="w-5 h-5" aria-hidden="true" />
        Email {HELP_SUPPORT_EMAIL}
      </a>
    </div>
  );
}

export function HelpCrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2 min-w-0">
            {i > 0 && <span aria-hidden="true">/</span>}
            {c.to ? (
              <Link to={c.to} className="hover:text-emerald-400 transition-colors truncate">{c.label}</Link>
            ) : (
              <span className="text-gray-400 truncate">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
