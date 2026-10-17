import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shell, NeedsSignIn, useMe, hasActivePlan } from '../ui';
import PlanPanel from '../PlanPanel';
import { api, downloadVideo, type GenItem } from '../api';

const STATUS_TEXT: Record<string, string> = {
  queued: 'Waiting for a free slot',
  submitting: 'Starting',
  submitted: 'In line to render',
  in_progress: 'Rendering',
};

function Item({ g, onCancel }: { g: GenItem; onCancel: (id: string) => void }) {
  const [dl, setDl] = useState<number | null>(null);
  const [err, setErr] = useState('');
  const save = async () => {
    setErr('');
    setDl(0);
    try {
      await downloadVideo(g, setDl);
    } catch {
      // not copied to our storage yet: open it directly instead
      window.open(`${g.mediaUrl}&download=1`, '_blank', 'noopener');
    } finally {
      setDl(null);
    }
  };
  const when = new Date(g.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  return (
    <li className="vg-lib-item">
      <div className="vg-frame" data-aspect={g.aspect || '16:9'}>
        {g.ready && g.mediaUrl ? (
          <video src={g.mediaUrl} controls playsInline preload="metadata" aria-label={g.title} />
        ) : (
          <span className="vg-frame-state">{g.error ? 'No video' : STATUS_TEXT[g.status] || 'Working on it'}{!g.error && '...'}</span>
        )}
      </div>
      <p className="vg-lib-title">{g.title}</p>
      <p className="vg-lib-meta">{[g.modelLabel, g.seconds ? `${g.seconds}s` : '', `${g.credits} credits`, when].filter(Boolean).join(' · ')}</p>
      {g.error && <p className="vg-lib-err">{g.error}</p>}
      <div className="vg-lib-actions">
        {g.ready && (
          <button type="button" className="vg-btn vg-btn--quiet" onClick={save} disabled={dl !== null}>
            {dl !== null ? `Downloading ${dl}%` : 'Download'}
          </button>
        )}
        {g.status === 'queued' && <button type="button" className="vg-btn vg-btn--text" onClick={() => onCancel(g.id)}>Cancel</button>}
      </div>
      {err && <p className="vg-lib-err">{err}</p>}
    </li>
  );
}

function Library() {
  const { me, setBalance } = useMe();
  const [items, setItems] = useState<GenItem[] | null>(null);
  const [error, setError] = useState('');
  const timer = useRef<number>();

  const load = useCallback(async () => {
    try {
      const r = await api.list();
      setItems(r.items);
      setBalance(r.balance);
      setError('');
      const active = r.items.some((i) => !i.ready && !i.error);
      window.clearTimeout(timer.current);
      if (active) timer.current = window.setTimeout(load, 6000);
    } catch (e) {
      setError((e as Error).message);
      timer.current = window.setTimeout(load, 15000);
    }
  }, [setBalance]);

  useEffect(() => {
    load();
    return () => window.clearTimeout(timer.current);
  }, [load]);

  const cancel = async (id: string) => {
    try {
      const r = await api.cancel(id);
      setBalance(r.balance);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <main className="vg-wrap">
      <section className="vg-hero" style={{ paddingBottom: 0 }}>
        <h1 className="vg-h2">Your library</h1>
        <p className="vg-lead">Every video you make lands here. Downloads are yours to keep.</p>
      </section>
      {error && <p className="vg-error" role="alert">{error}</p>}
      {!items && !error && <p className="vg-loading" role="status">Loading your videos...</p>}
      {items && items.length === 0 && (
        <p className="vg-empty">Nothing here yet. <Link to="/video-generation">Make your first video</Link>.</p>
      )}
      {items && items.length > 0 && (
        <ul className="vg-lib" style={{ listStyle: 'none', padding: 0 }}>
          {items.map((g) => <Item key={g.id} g={g} onCancel={cancel} />)}
        </ul>
      )}
      {items && items.some((i) => i.ready) && !hasActivePlan(me) && (
        <div style={{ marginTop: 64 }}>
          <PlanPanel title="Pick a plan to keep making them" lead={`You have ${me?.user?.balance ?? 0} credits left. Plans add fresh credits every month.`} />
        </div>
      )}
    </main>
  );
}

export default function VidgenLibrary() {
  return (
    <Shell title="Your library | Kenji Studio">
      <NeedsSignIn><Library /></NeedsSignIn>
    </Shell>
  );
}
