import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NotFoundPage from '../../components/NotFoundPage';
import { loadHelpArticle, type HelpArticle } from './helpData';
import { HelpCrumbs, HelpHead, HelpShell, HelpStillStuck } from './HelpShared';
import './help.css';

export default function HelpArticlePage() {
  const { slug = '' } = useParams();
  const [article, setArticle] = useState<HelpArticle | null | undefined>(undefined);

  useEffect(() => {
    let live = true;
    setArticle(undefined);
    loadHelpArticle(slug).then((a) => live && setArticle(a)).catch(() => live && setArticle(null));
    window.scrollTo(0, 0);
    return () => { live = false; };
  }, [slug]);

  if (article === null) return <NotFoundPage />;

  return (
    <>
      <HelpHead
        title={article ? `${article.title} | KenjiAI Help Center` : 'KenjiAI Help Center'}
        description={article ? `How to: ${article.title}. Step-by-step guide from the KenjiAI Help Center.` : 'Step-by-step guides for your KenjiAI account.'}
      />
      <HelpShell>
        <div className="max-w-3xl mx-auto">
          {article ? (
            <>
              <HelpCrumbs
                items={[
                  { label: 'Help Center', to: '/help' },
                  { label: article.category, to: `/help/${article.categorySlug}` },
                  { label: article.folder },
                ]}
              />
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">{article.title}</h1>
              {article.updated && <p className="text-sm text-gray-500 mt-3">Updated {article.updated.replace(/ at .*$/, '')}</p>}
              <article className="help-article mt-8" dangerouslySetInnerHTML={{ __html: article.html }} />
              <p className="mt-10 text-sm text-gray-500">
                <Link to={`/help/${article.categorySlug}`} className="text-emerald-400 hover:underline">More {article.category} guides</Link>
              </p>
            </>
          ) : (
            <div className="space-y-4" aria-hidden="true">
              <div className="h-4 w-48 rounded bg-gray-900 animate-pulse" />
              <div className="h-10 w-3/4 rounded bg-gray-900 animate-pulse" />
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-4 rounded bg-gray-900/70 animate-pulse" />)}
            </div>
          )}
          <HelpStillStuck />
        </div>
      </HelpShell>
    </>
  );
}
