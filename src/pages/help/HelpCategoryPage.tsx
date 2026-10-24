import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import NotFoundPage from '../../components/NotFoundPage';
import { HelpCrumbs, HelpHead, HelpSearch, HelpShell, HelpStillStuck, useHelpIndex } from './HelpShared';

export default function HelpCategoryPage() {
  const { category = '' } = useParams();
  const { index, error } = useHelpIndex();

  if (index) {
    const articles = index.filter((a) => a.categorySlug === category);
    if (!articles.length) return <NotFoundPage />;
    const name = articles[0].category;
    const folders = new Map<string, typeof articles>();
    for (const a of articles) {
      if (!folders.has(a.folder)) folders.set(a.folder, []);
      folders.get(a.folder)!.push(a);
    }
    return (
      <>
        <HelpHead title={`${name} | KenjiAI Help Center`} description={`${articles.length} step-by-step guides for ${name} in KenjiAI.`} />
        <HelpShell>
          <HelpCrumbs items={[{ label: 'Help Center', to: '/help' }, { label: name }]} />
          <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{name}</h1>
              <p className="text-gray-400 mt-2">{articles.length} {articles.length === 1 ? 'article' : 'articles'}</p>
            </div>
            <div className="md:w-96"><HelpSearch index={index} compact /></div>
          </div>
          {folders.size > 1 && (
            <nav aria-label="Sections" className="flex flex-wrap gap-2 mb-10">
              {[...folders.keys()].map((f) => (
                <a key={f} href={`#${slug(f)}`} className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-900/70 border border-gray-800 text-gray-300 hover:border-[#10A37F]/70 hover:text-white transition-colors">
                  {f}
                </a>
              ))}
            </nav>
          )}
          <div className="space-y-10">
            {[...folders.entries()].map(([f, list]) => (
              <section key={f} id={slug(f)} className="scroll-mt-24">
                <h2 className="text-lg font-bold text-white mb-3">{f}</h2>
                <ul className="rounded-2xl border border-gray-800 bg-gray-900/60 divide-y divide-gray-800/80 overflow-hidden">
                  {list.map((a) => (
                    <li key={a.slug}>
                      <Link to={`/help/article/${a.slug}`} className="group flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors">
                        <span className="min-w-0 flex-1">
                          <span className="block text-white font-semibold group-hover:text-emerald-400 transition-colors">{a.title}</span>
                          <span className="block text-sm text-gray-500 mt-0.5 line-clamp-1">{a.excerpt}</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 flex-shrink-0" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <HelpStillStuck />
        </HelpShell>
      </>
    );
  }

  return (
    <>
      <HelpHead title="KenjiAI Help Center" description="Step-by-step guides for your KenjiAI account." />
      <HelpShell>
        {error ? (
          <p className="text-gray-400">The help articles didn't load. Refresh the page, or email support@mediatraffics.com.</p>
        ) : (
          <div className="space-y-3" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-gray-900/60 animate-pulse" />)}
          </div>
        )}
      </HelpShell>
    </>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
