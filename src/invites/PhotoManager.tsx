import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { api, cardPhotos, picUrl, type HostEvent } from './api';
import { ConfirmButton, ErrorBox } from './ui';
import { Icon } from './icons';
import { layoutCount } from './InvitationCard';
import { preparePhoto } from './photoPrep';
import { MAX_PHOTOS, type PhotoRef } from './shared';

type Props = { ev: HostEvent; patch: (f: Partial<HostEvent>) => void; setEv: (f: (e: HostEvent) => HostEvent) => void };

/** Drag (or tap) the spot that must stay in view; the previews show the crops it makes. */
function FocusEditor({ src, photo, onDone }: { src: string; photo: PhotoRef; onDone: (fx: number, fy: number) => void }) {
  const [f, setF] = useState<[number, number]>([photo.fx, photo.fy]);
  const box = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const dragging = useRef(false);
  const set = (e: PointerEvent) => {
    const r = img.current?.getBoundingClientRect();
    if (!r) return;
    const c = (v: number) => Math.min(1, Math.max(0, Math.round(v * 1000) / 1000));
    setF([c((e.clientX - r.left) / r.width), c((e.clientY - r.top) / r.height)]);
  };
  const key = (e: KeyboardEvent) => {
    const d = 0.03;
    const m: Record<string, [number, number]> = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, -d], ArrowDown: [0, d] };
    if (!m[e.key]) return;
    e.preventDefault();
    setF(([x, y]) => [Math.min(1, Math.max(0, x + m[e.key][0])), Math.min(1, Math.max(0, y + m[e.key][1]))]);
  };
  const pos = `${f[0] * 100}% ${f[1] * 100}%`;
  return (
    <div className="kv-focus" data-testid="focus-editor">
      <p className="kv-label" style={{ marginBottom: 6 }}>What should always show?</p>
      <p className="kv-hint" style={{ marginBottom: 12 }}>Drag the circle onto the faces (or tap there). The small pictures show how the photo is cropped on the card.</p>
      <div className="kv-focus-row">
        <div
          ref={box}
          className="kv-focus-box"
          tabIndex={0}
          role="slider"
          aria-label="Focus point. Use the arrow keys to move it."
          aria-valuetext={`${Math.round(f[0] * 100)}% across, ${Math.round(f[1] * 100)}% down`}
          onKeyDown={key}
          onPointerDown={(e) => { dragging.current = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); set(e); }}
          onPointerMove={(e) => { if (dragging.current) set(e); }}
          onPointerUp={() => { dragging.current = false; }}
          data-testid="focus-box"
        >
          <img ref={img} src={src} alt="" draggable={false} />
          <span className="kv-focus-dot" style={{ left: `${f[0] * 100}%`, top: `${f[1] * 100}%` }} aria-hidden="true" />
        </div>
        <div className="kv-focus-previews" aria-hidden="true">
          {[['1 / 1', 'Square'], ['3 / 4', 'Tall'], ['16 / 10', 'Wide']].map(([ar, l]) => (
            <figure key={l}><img src={src} alt="" style={{ aspectRatio: ar, objectPosition: pos }} /><figcaption>{l}</figcaption></figure>
          ))}
        </div>
      </div>
      <div className="kv-btn-row" style={{ marginTop: 14 }}>
        <button type="button" className="kv-btn kv-btn--primary" onClick={() => onDone(f[0], f[1])} data-testid="focus-done">Done</button>
        <button type="button" className="kv-btn kv-btn--secondary" onClick={() => setF([photo.fx, photo.fy])}>Undo my change</button>
      </div>
    </div>
  );
}

export default function PhotoManager({ ev, patch, setEv }: Props) {
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const [focusing, setFocusing] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const photos = ev.photos || [];
  const legacy = !photos.length && ev.photo;
  const shown = cardPhotos(ev);
  const room = MAX_PHOTOS - shown.length;

  async function onFiles(list: FileList | null) {
    if (!list || !list.length) return;
    setErr('');
    const files = Array.from(list).slice(0, Math.max(0, room));
    if (list.length > files.length) setErr(`You can add up to ${MAX_PHOTOS} photos, so we added the first ${files.length}.`);
    try {
      for (let i = 0; i < files.length; i++) {
        setBusy(files.length > 1 ? `Adding photo ${i + 1} of ${files.length}...` : 'Adding your photo...');
        const p = await preparePhoto(files[i]);
        const r = await api.addPic(ev.id, p);
        setEv((cur) => ({ ...cur, photos: r.event.photos, photo: r.event.photo, layout: r.event.layout }));
      }
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy('');
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  const reorder = (next: PhotoRef[]) => patch({ photos: next });
  const move = (i: number, d: number) => {
    const next = [...photos];
    const [p] = next.splice(i, 1);
    next.splice(i + d, 0, p);
    reorder(next);
  };
  const makeMain = (i: number) => { const next = [...photos]; const [p] = next.splice(i, 1); reorder([p, ...next]); };
  const focusPhoto = photos.find((p) => p.id === focusing);

  return (
    <div className="kv-card" style={{ marginTop: 28 }} data-testid="photos-card">
      <h2 style={{ fontSize: 24, marginBottom: 8 }}>Your photos <span className="kv-muted" style={{ fontWeight: 400, fontSize: 19 }}>(you can skip this)</span></h2>
      <p className="kv-muted" style={{ marginBottom: 16 }}>Add up to {MAX_PHOTOS}. We arrange them on the card for you and keep faces in view. The first photo is the main one.</p>
      <ErrorBox message={err} />
      {busy && <p className="kv-note" role="status" style={{ marginBottom: 14 }} data-testid="photo-busy">{busy}</p>}
      {shown.length > 0 && (
        <ol className="kv-photos" data-testid="photo-list">
          {shown.map((p, i) => (
            <li key={p.id} className="kv-photo-item" data-testid="photo-item">
              <div className="kv-photo-pic">
                <img src={p.src} alt={`Photo ${i + 1}`} style={{ objectPosition: `${p.fx * 100}% ${p.fy * 100}%` }} />
                <span className="kv-photo-num" aria-hidden="true">{i + 1}</span>
                {i === 0 && <span className="kv-photo-main">Main photo</span>}
              </div>
              <div className="kv-photo-actions">
                {!legacy && i > 0 && <button type="button" className="kv-btn kv-btn--secondary" onClick={() => makeMain(i)} data-testid="photo-main">Make main photo</button>}
                {!legacy && shown.length > 1 && (
                  <span className="kv-photo-move">
                    <button type="button" className="kv-btn kv-btn--secondary" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move photo ${i + 1} earlier`}>&uarr; Earlier</button>
                    <button type="button" className="kv-btn kv-btn--secondary" disabled={i === shown.length - 1} onClick={() => move(i, 1)} aria-label={`Move photo ${i + 1} later`}>&darr; Later</button>
                  </span>
                )}
                {!legacy && <button type="button" className="kv-btn kv-btn--secondary" onClick={() => setFocusing(focusing === p.id ? '' : p.id)} aria-expanded={focusing === p.id} data-testid="photo-focus">Choose what shows</button>}
                <ConfirmButton label={<><Icon name="trash" /> Remove</>} question="Remove this photo from the invitation?" confirmLabel="Yes, remove it"
                  onConfirm={async () => {
                    if (legacy) { const r = await api.deletePhoto(ev.id); setEv((cur) => ({ ...cur, photo: r.event.photo })); return; }
                    const r = await api.deletePic(ev.id, p.id);
                    setEv((cur) => ({ ...cur, photos: r.event.photos, layout: r.event.layout }));
                    if (focusing === p.id) setFocusing('');
                  }} />
              </div>
              {focusPhoto && focusing === p.id && (
                <FocusEditor src={picUrl(ev.id, focusPhoto)} photo={focusPhoto}
                  onDone={(fx, fy) => { reorder(photos.map((x) => (x.id === focusPhoto.id ? { ...x, fx, fy } : x))); setFocusing(''); }} />
              )}
            </li>
          ))}
        </ol>
      )}
      <div className="kv-btn-row" style={{ marginTop: 6 }}>
        {room > 0 && (
          <>
            <input ref={fileRef} id="kv-photos-in" type="file" accept="image/*" multiple className="kv-sr" onChange={(e) => onFiles(e.target.files)} data-testid="photo-input" />
            <label htmlFor="kv-photos-in" className="kv-btn kv-btn--secondary" aria-disabled={!!busy}>
              <Icon name="photo" /> {shown.length ? 'Add more photos' : 'Add photos'}
            </label>
          </>
        )}
        {photos.length > 1 && layoutCount(photos.length) > 1 && (
          <button type="button" className="kv-btn kv-btn--secondary" data-testid="shuffle"
            onClick={() => patch({ photoLayout: ((ev.photoLayout || 0) + 1) % layoutCount(photos.length) })}>
            Shuffle layout
          </button>
        )}
      </div>
    </div>
  );
}
