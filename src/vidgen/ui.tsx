import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api, SIGN_IN, type Me } from './api';
import './vidgen.css';

const FONT = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&display=swap';

interface MeState { me: Me | null; loading: boolean; error: string; refresh: () => Promise<void>; setBalance: (n: number) => void }
const MeContext = createContext<MeState>({ me: null, loading: true, error: '', refresh: async () => undefined, setBalance: () => undefined });
export const useMe = () => useContext(MeContext);

function MeProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    try {
      setMe(await api.me());
      setError('');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  const setBalance = useCallback((n: number) => setMe((m) => (m && m.user ? { ...m, user: { ...m.user, balance: n } } : m)), []);
  return <MeContext.Provider value={{ me, loading, error, refresh, setBalance }}>{children}</MeContext.Provider>;
}

export function signInHref(ret = '/video-generation') {
  return `${SIGN_IN}?return=${encodeURIComponent(ret)}`;
}

function Header() {
  const { me } = useMe();
  const { pathname } = useLocation();
  const user = me?.user;
  const cur = (p: string) => (pathname === p ? 'page' : undefined);
  const signOut = async () => {
    try { await api.logout(); } catch { /* the cookie clears on the next sign-in anyway */ }
    window.location.href = '/video-generation';
  };
  return (
    <header className="vg-top">
      <div className="vg-wrap vg-top-in">
        <Link to="/video-generation" className="vg-brand">
          <span className="vg-brand-mark" aria-hidden="true">K</span>
          Kenji Studio
        </Link>
        {user ? (
          <>
            <nav className="vg-nav" aria-label="Kenji Studio">
              <Link to="/video-generation" aria-current={cur('/video-generation')}>Make a video</Link>
              <Link to="/video-generation/library" aria-current={cur('/video-generation/library')}>Library</Link>
              <Link to="/video-generation/billing" aria-current={cur('/video-generation/billing')}>Plan</Link>
            </nav>
            <span className="vg-credits"><b>{user.balance.toLocaleString()}</b> credits</span>
            <button type="button" className="vg-btn vg-btn--text" onClick={signOut}>Sign out</button>
          </>
        ) : (
          <a className="vg-btn vg-btn--quiet" href={signInHref(pathname)}>Sign in</a>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="vg-foot">
      <div className="vg-wrap vg-foot-in">
        <p>Video generation powered by Higgsfield.</p>
        <p>Videos made here are AI-generated content. Label them as AI-generated where the platform you post on asks you to.</p>
        <nav aria-label="Legal">
          <Link to="/video-generation/terms">Studio terms of use</Link>
          <Link to="/terms">Terms of service</Link>
          <Link to="/privacy">Privacy policy</Link>
        </nav>
        <p>Kenji Studio is made by KenjiAI.</p>
      </div>
    </footer>
  );
}

export function Shell({ title, description, children, index = false }: { title: string; description?: string; children: ReactNode; index?: boolean }) {
  return (
    <MeProvider>
      <div className="vg">
        <Helmet>
          <title>{title}</title>
          {description && <meta name="description" content={description} />}
          {!index && <meta name="robots" content="noindex, nofollow" />}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link href={FONT} rel="stylesheet" />
        </Helmet>
        <Header />
        {children}
        <Footer />
      </div>
    </MeProvider>
  );
}

/** Shown in place of a page body while the signed-in check runs, or when signed out on a members page. */
export function NeedsSignIn({ children }: { children: ReactNode }) {
  const { me, loading, error } = useMe();
  const { pathname } = useLocation();
  if (loading) return <main className="vg-wrap"><p className="vg-loading" role="status">Loading your studio...</p></main>;
  if (error) return <main className="vg-wrap"><p className="vg-error" role="alert">{error}</p></main>;
  if (!me?.user) {
    return (
      <main className="vg-wrap vg-narrow vg-hero">
        <h1 className="vg-title">Sign in to see this page</h1>
        <p className="vg-lead">Your videos and plan are tied to your Google account.</p>
        <div className="vg-row"><a className="vg-btn vg-btn--primary" href={signInHref(pathname)}>Sign in with Google</a></div>
      </main>
    );
  }
  return <>{children}</>;
}
