import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from 'react';
import InvitationCard, { THEMES, ACCENTS, PAIRINGS, BACKGROUNDS, pairingsFor, layoutCount } from './InvitationCard';
import { cardOf, type HostEvent } from './api';
import { StickerArt, STICKERS, STICKERS_FOR } from './stickers';
import { loadFonts, loadThemeFonts } from './format';
import { Icon } from './icons';
import {
  TYPES, MAX_STICKERS, TEXT_MIN_SCALE, EDITABLE_TEXT, cleanLayout, eventWording, isTextEl, typeOf,
  type CardLayout, type ElId, type ElStyle, type Sticker,
} from './shared';

// "Customize my card": tap anything on the card to move it (it snaps to a soft grid and the
// center lines), resize it (slider, buttons or pinch), change its words, color and alignment,
// hide it, or add stickers. Everything is saved as positions relative to the card, so the guest
// page, the link preview, the saved picture and the wallpaper all show the same card.

type Sel = { kind: 'el'; id: ElId } | { kind: 'sticker'; id: string } | null;
const LABELS: Record<ElId, string> = {
  art: 'Illustration', photos: 'Photos', intro: 'Small line above the names', names: 'Names', sub: 'Line under the names',
  request: 'Your short line', byline: 'Hosted by', divider: 'Divider', date: 'Date', where: 'Place', message: 'Message', decor: 'Decorations',
};
const GRID = 2.5; // snap grid, in % of the card's width
const SNAP = 3.5; // how close (in %) counts as "on the center line"
const TIP_KEY = 'kv-editor-tip-seen';
const r1 = (n: number) => Math.round(n * 10) / 10;

export default function CardEditor({ ev, onLayout, onPatch, onClose }: {
  ev: HostEvent;
  onLayout: (l: CardLayout | null) => void;
  onPatch: (f: Partial<HostEvent>) => void;
  onClose: () => void;
}) {
  const [layout, setLayoutState] = useState<CardLayout | null>(ev.layout || null);
  // the current layout, always up to date inside event handlers (state can lag a render behind)
  const cur = useRef<CardLayout | null>(ev.layout || null);
  const [sel, setSel] = useState<Sel>(null);
  const [rect, setRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const [guides, setGuides] = useState<{ v: number | null; h: number | null }>({ v: null, h: null });
  const [tip, setTip] = useState(() => { try { return !localStorage.getItem(TIP_KEY); } catch { return true; } });
  const past = useRef<(CardLayout | null)[]>([]);
  const future = useRef<(CardLayout | null)[]>([]);
  const lastKey = useRef({ k: '', t: 0 });
  const [, force] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const type = typeOf(ev);
  const def = TYPES[type];
  const words = eventWording(ev);
  const t = THEMES[ev.theme];

  useEffect(() => { loadThemeFonts([ev.theme], pairingsFor(ev.theme).flatMap((p) => PAIRINGS[p].keys)); }, [ev.theme]);
  useEffect(() => { if (layout?.fonts && PAIRINGS[layout.fonts]) loadFonts(PAIRINGS[layout.fonts].keys); }, [layout?.fonts]);

  /** Every change goes through here: history (grouped while typing), autosave. */
  const change = useCallback((next: CardLayout | null, key = '') => {
    const now = Date.now();
    const grouped = key && lastKey.current.k === key && now - lastKey.current.t < 1200;
    lastKey.current = { k: key, t: now };
    if (!grouped) { past.current.push(cur.current); if (past.current.length > 80) past.current.shift(); }
    future.current = [];
    cur.current = next;
    setLayoutState(next);
    onLayout(cleanLayout(next));
    force((n) => n + 1);
  }, [onLayout]);
  /** Live update while dragging; history is written once when the finger lifts. */
  const live = (next: CardLayout | null) => { cur.current = next; setLayoutState(next); onLayout(cleanLayout(next)); };

  const els = layout?.els || {};
  const stickers = layout?.stickers || [];
  const now = () => cur.current;
  const setEl = (id: ElId, patch: Partial<ElStyle>, key = '') => {
    const L = now();
    const e = { ...(L?.els?.[id] || {}), ...patch };
    (Object.keys(e) as (keyof ElStyle)[]).forEach((k) => { if (e[k] === undefined || (e[k] === '' && k !== 'text')) delete e[k]; });
    change({ ...(L || {}), els: { ...(L?.els || {}), [id]: e } }, key);
  };
  const setSticker = (id: string, patch: Partial<Sticker>, key = '') => { const L = now(); change({ ...(L || {}), stickers: (L?.stickers || []).map((s) => (s.id === id ? { ...s, ...patch } : s)) }, key); };
  const setWhole = (patch: Partial<CardLayout>) => change({ ...(now() || {}), ...patch });

  const restore = (l: CardLayout | null) => { cur.current = l; setLayoutState(l); onLayout(cleanLayout(l)); force((n) => n + 1); };
  const undo = () => { if (!past.current.length) return; future.current.push(cur.current); restore(past.current.pop()!); };
  const redo = () => { if (!future.current.length) return; past.current.push(cur.current); restore(future.current.pop()!); };

  // ---------- measuring ----------
  const nodes = () => {
    const root = stage.current;
    const kc = root?.querySelector<HTMLElement>('.kc');
    const paper = root?.querySelector<HTMLElement>('.kc-paper');
    return { root, kc, paper };
  };
  const target = (s: Sel): HTMLElement | null => {
    const { root } = nodes();
    if (!root || !s) return null;
    return s.kind === 'el' ? root.querySelector<HTMLElement>(`.kc [data-el="${s.id}"]`) : root.querySelector<HTMLElement>(`.kc [data-sticker="${s.id}"]`);
  };
  const measure = useCallback(() => {
    const { root } = nodes();
    const node = target(sel);
    if (!root || !node) { setRect(null); return; }
    const a = root.getBoundingClientRect();
    const b = node.getBoundingClientRect();
    setRect({ left: b.left - a.left, top: b.top - a.top, width: b.width, height: b.height });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel]);
  useLayoutEffect(() => { measure(); }, [measure, layout, ev]);
  useEffect(() => {
    const on = () => measure();
    window.addEventListener('resize', on);
    document.fonts?.ready.then(on);
    return () => window.removeEventListener('resize', on);
  }, [measure]);

  // ---------- drag, snap, pinch ----------
  const drag = useRef<{
    sel: Sel; id: number; sx: number; sy: number; x0: number; y0: number; s0: number; w0: number; moved: boolean;
    r0: DOMRect; P: DOMRect; unit: number; start: CardLayout | null;
    pinch?: { d0: number; other: number };
  } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());

  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const d = drag.current;
    // second finger on the same element: pinch to resize
    if (d && pointers.current.size === 2) {
      const [p1, p2] = Array.from(pointers.current.values());
      d.pinch = { d0: Math.hypot(p1.x - p2.x, p1.y - p2.y) || 1, other: e.pointerId };
      return;
    }
    // the selected element wins where things overlap, so it can always be grabbed again
    const selNode = target(sel);
    const sr = selNode?.getBoundingClientRect();
    const onSel = sr && e.clientX >= sr.left && e.clientX <= sr.right && e.clientY >= sr.top && e.clientY <= sr.bottom;
    const hit = onSel ? selNode! : (e.target as HTMLElement).closest<HTMLElement>('[data-sticker], [data-el]');
    const { kc, paper } = nodes();
    if (!hit || !kc || !paper || !kc.contains(hit)) { setSel(null); return; }
    e.preventDefault();
    const s: Sel = hit.dataset.sticker ? { kind: 'sticker', id: hit.dataset.sticker } : { kind: 'el', id: hit.dataset.el as ElId };
    if (s.kind === 'el' && s.id === 'decor') return;
    setSel(s);
    if (tip) dismissTip();
    const unit = kc.getBoundingClientRect().width / 100;
    const L = now();
    const st = s.kind === 'sticker' ? (L?.stickers || []).find((x) => x.id === s.id) : null;
    const es = s.kind === 'el' ? L?.els?.[s.id] || {} : {};
    drag.current = {
      sel: s, id: e.pointerId, sx: e.clientX, sy: e.clientY, moved: false, unit,
      x0: st ? st.x : es.x || 0, y0: st ? st.y : es.y || 0, s0: es.s || 1, w0: st ? st.w : 0,
      r0: hit.getBoundingClientRect(), P: paper.getBoundingClientRect(), start: L,
    };
    stage.current?.setPointerCapture(e.pointerId);
  };

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const d = drag.current;
    if (!d) return;
    if (d.pinch && pointers.current.size >= 2) {
      const [p1, p2] = Array.from(pointers.current.values());
      const ratio = Math.hypot(p1.x - p2.x, p1.y - p2.y) / d.pinch.d0;
      d.moved = true;
      if (d.sel?.kind === 'sticker') {
        const w = Math.min(80, Math.max(4, r1(d.w0 * ratio)));
        live({ ...(d.start || {}), stickers: (d.start?.stickers || []).map((x) => (x.id === d.sel!.id ? { ...x, w } : x)) });
      } else if (d.sel) {
        const lo = isTextEl(d.sel.id) ? TEXT_MIN_SCALE : 0.4;
        const sNew = Math.min(isTextEl(d.sel.id) ? 2 : 2.5, Math.max(lo, Math.round(d.s0 * ratio * 100) / 100));
        const cur = d.start?.els?.[d.sel.id] || {};
        live({ ...(d.start || {}), els: { ...(d.start?.els || {}), [d.sel.id]: { ...cur, s: sNew } } });
      }
      return;
    }
    if (e.pointerId !== d.id) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    d.moved = true;
    const u = d.unit;
    const P = d.P;
    const m = u * 1.5; // keep everything a little inside the paper edge
    // where the element would land, kept on the card
    let left = d.r0.left + dx;
    let top = d.r0.top + dy;
    left = Math.min(P.right - m - d.r0.width, Math.max(P.left + m, left));
    top = Math.min(P.bottom - m - d.r0.height, Math.max(P.top + m, top));
    // snap its center to the card's center lines, else to a soft grid
    let cx = (left + d.r0.width / 2 - P.left) / u;
    let cy = (top + d.r0.height / 2 - P.top) / u;
    const midY = P.height / u / 2;
    let gv: number | null = null;
    let gh: number | null = null;
    if (Math.abs(cx - 50) < SNAP) { cx = 50; gv = 50; } else cx = Math.round(cx / GRID) * GRID;
    if (Math.abs(cy - midY) < SNAP) { cy = midY; gh = midY; } else cy = Math.round(cy / GRID) * GRID;
    left = P.left + cx * u - d.r0.width / 2;
    top = P.top + cy * u - d.r0.height / 2;
    left = Math.min(P.right - m - d.r0.width, Math.max(P.left + m, left));
    top = Math.min(P.bottom - m - d.r0.height, Math.max(P.top + m, top));
    setGuides({ v: gv, h: gh });
    const mx = (left - d.r0.left) / u;
    const my = (top - d.r0.top) / u;
    if (d.sel?.kind === 'sticker') {
      live({ ...(d.start || {}), stickers: (d.start?.stickers || []).map((x) => (x.id === d.sel!.id ? { ...x, x: r1(d.x0 + mx), y: r1(d.y0 + my) } : x)) });
    } else if (d.sel) {
      const cur = d.start?.els?.[d.sel.id] || {};
      live({ ...(d.start || {}), els: { ...(d.start?.els || {}), [d.sel.id]: { ...cur, x: r1(d.x0 + mx), y: r1(d.y0 + my) } } });
    }
  };

  const onUp = (e: RPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    const d = drag.current;
    if (!d) return;
    if (d.pinch && e.pointerId === d.pinch.other) { delete d.pinch; return; }
    if (e.pointerId !== d.id && !d.pinch) return;
    drag.current = null;
    pointers.current.clear();
    setGuides({ v: null, h: null });
    if (d.moved) { past.current.push(d.start); future.current = []; force((n) => n + 1); }
  };

  // ---------- actions ----------
  const dismissTip = () => { setTip(false); try { localStorage.setItem(TIP_KEY, '1'); } catch { /* private mode */ } };
  const resetAll = () => { if (window.confirm('Go back to the original design? Your changes to this card will be undone.')) { change(null); setSel(null); } };
  /** Tidy: every element back in its place and size; stickers to the corners. Words, colors, fonts stay. */
  const autoArrange = () => {
    const { paper, kc } = nodes();
    const u = (kc?.getBoundingClientRect().width || 100) / 100;
    const H = paper ? paper.getBoundingClientRect().height / u : 140;
    const tidy: Partial<Record<ElId, ElStyle>> = {};
    for (const [id, st] of Object.entries(now()?.els || {}) as [ElId, ElStyle][]) {
      const { x, y, s, z, align, ...keep } = st;
      void x; void y; void s; void z; void align;
      if (Object.keys(keep).length) tidy[id] = keep;
    }
    const spots: [number, number][] = [[12, 10], [88, 10], [12, H - 10], [88, H - 10], [50, 7], [50, H - 7], [8, H / 2], [92, H / 2]];
    const neat = (now()?.stickers || []).map((s, i) => {
      const [x, y] = spots[i % spots.length];
      return { ...s, w: 14, r: 0, x, y, z: 3 };
    });
    setWhole({ els: tidy, stickers: neat });
    setSel(null);
  };
  const addSticker = (k: string) => {
    if (stickers.length >= MAX_STICKERS) return;
    const { paper, kc } = nodes();
    const u = (kc?.getBoundingClientRect().width || 100) / 100;
    const H = paper ? paper.getBoundingClientRect().height / u : 140;
    const spots: [number, number][] = [[80, 14], [20, 14], [80, H - 14], [20, H - 14], [50, 10]];
    const [x, y] = spots[stickers.length % spots.length];
    const s: Sticker = { id: Math.random().toString(36).slice(2, 9), k, x, y, w: 16, z: 3 };
    setWhole({ stickers: [...(now()?.stickers || []), s] });
    setSel({ kind: 'sticker', id: s.id });
  };
  const z = (dir: 1 | -1) => {
    if (!sel) return;
    if (sel.kind === 'sticker') {
      // stickers sit in front of the words (3+) or just behind them (1 and lower)
      const cur = stickers.find((x) => x.id === sel.id)?.z ?? 3;
      const top = Math.max(3, ...stickers.map((x) => x.z ?? 3));
      setSticker(sel.id, { z: dir > 0 ? (cur < 3 ? 3 : Math.min(20, top + 1)) : (cur >= 3 ? 1 : Math.max(-5, cur - 1)) });
      return;
    }
    setEl(sel.id, { z: Math.max(-5, Math.min(20, (els[sel.id]?.z || 2) + dir * 2)) });
  };

  // ---------- panel content ----------
  const palette = useMemo(() => [...new Set([t.swatch[1], ev.accent, t.swatch[0], '#3d3126', '#ffffff', ...ACCENTS.map((a) => a.value)].filter(Boolean) as string[])], [t, ev.accent]);
  const hidden = (Object.entries(els) as [ElId, ElStyle][]).filter(([, s]) => s.hide);
  const selSticker = sel?.kind === 'sticker' ? stickers.find((s) => s.id === sel.id) : null;
  const selEl = sel?.kind === 'el' ? sel.id : null;
  const st = selEl ? els[selEl] || {} : {};
  const textDefault = (id: ElId) => (id === 'intro' ? (type === 'wedding' ? t.intro : words.intro) : id === 'request' ? (type === 'wedding' ? t.request : words.request) : id === 'sub' ? words.sub : id === 'byline' ? words.byline : '');
  const sizeMin = selEl && isTextEl(selEl) ? TEXT_MIN_SCALE : 0.4;
  const sizeMax = selEl && isTextEl(selEl) ? 2 : 2.5;

  const colorRow = (value: string | undefined, set: (c: string | undefined) => void, label: string) => (
    <div className="kv-ed-group">
      <p className="kv-ed-label">{label}</p>
      <div className="kv-ed-swatches">
        <button type="button" className="kv-ed-sw" aria-pressed={!value} onClick={() => set(undefined)} title="The design's own color">
          <i style={{ background: `linear-gradient(135deg, ${t.swatch[0]} 50%, ${t.swatch[1]} 50%)` }} /><span>Design's</span>
        </button>
        {palette.map((c) => <button key={c} type="button" className="kv-ed-sw" aria-pressed={value === c} onClick={() => set(c)} aria-label={`Color ${c}`}><i style={{ background: c }} /></button>)}
        <label className="kv-ed-sw kv-ed-custom" title="Pick any color">
          <input type="color" value={value || t.swatch[1]} onChange={(e) => set(e.target.value)} aria-label="Pick any color" data-testid="color-custom" />
          <span>Any color</span>
        </label>
      </div>
    </div>
  );
  const sizeRow = (value: number, set: (v: number) => void, min: number, max: number, testid: string) => (
    <div className="kv-ed-group">
      <p className="kv-ed-label">Size</p>
      <div className="kv-ed-size">
        <button type="button" className="kv-btn kv-btn--secondary" onClick={() => set(Math.max(min, Math.round((value - 0.1) * 100) / 100))} aria-label="Smaller">Smaller</button>
        <input type="range" min={min} max={max} step={0.05} value={value} onChange={(e) => set(Number(e.target.value))} aria-label="Size" data-testid={testid} />
        <button type="button" className="kv-btn kv-btn--secondary" onClick={() => set(Math.min(max, Math.round((value + 0.1) * 100) / 100))} aria-label="Bigger">Bigger</button>
      </div>
    </div>
  );

  let panel = null;
  if (selSticker) {
    panel = (
      <>
        <h3 className="kv-ed-h">Sticker: {STICKERS[selSticker.k]?.name || 'Sticker'}</h3>
        {sizeRow(selSticker.w / 16, (v) => setSticker(selSticker.id, { w: r1(Math.min(80, Math.max(4, v * 16))) }, 'sw'), 0.3, 4, 'sticker-size')}
        <div className="kv-ed-group">
          <p className="kv-ed-label">Turn</p>
          <input type="range" min={-180} max={180} step={5} value={selSticker.r || 0} onChange={(e) => setSticker(selSticker.id, { r: Number(e.target.value) }, 'sr')} aria-label="Turn the sticker" style={{ width: '100%' }} />
        </div>
        {colorRow(selSticker.c, (c) => setSticker(selSticker.id, { c }), 'Color')}
        <div className="kv-btn-row">
          <button type="button" className="kv-btn kv-btn--secondary" onClick={() => z(1)}>Bring forward</button>
          <button type="button" className="kv-btn kv-btn--secondary" onClick={() => z(-1)}>Send back</button>
          <button type="button" className="kv-btn kv-btn--secondary" onClick={() => { setWhole({ stickers: (now()?.stickers || []).filter((s) => s.id !== selSticker.id) }); setSel(null); }} data-testid="sticker-remove"><Icon name="trash" /> Remove sticker</button>
        </div>
      </>
    );
  } else if (selEl) {
    const named = def.names === 0;
    panel = (
      <>
        <h3 className="kv-ed-h">{LABELS[selEl]}</h3>
        {EDITABLE_TEXT.includes(selEl) && (
          <div className="kv-ed-group">
            <label className="kv-ed-label" htmlFor="kv-ed-text">Wording</label>
            <textarea id="kv-ed-text" className="kv-textarea" style={{ minHeight: 80 }} maxLength={160} value={st.text ?? textDefault(selEl)}
              onChange={(e) => setEl(selEl, { text: e.target.value }, `text-${selEl}`)} data-testid="ed-text" />
            {st.text !== undefined && <button type="button" className="kv-btn kv-btn--quiet" onClick={() => setEl(selEl, { text: undefined })}>Use the original wording</button>}
          </div>
        )}
        {selEl === 'names' && (
          <div className="kv-ed-group">
            {named ? (
              <><label className="kv-ed-label" htmlFor="kv-ed-n0">Name of the event</label>
                <input id="kv-ed-n0" className="kv-input" maxLength={80} value={ev.details?.eventName || ''} onChange={(e) => onPatch({ details: { ...(ev.details || {}), eventName: e.target.value } })} data-testid="ed-names" /></>
            ) : (
              <><label className="kv-ed-label" htmlFor="kv-ed-n0">{def.nameLabels[0]}</label>
                <input id="kv-ed-n0" className="kv-input" maxLength={60} value={ev.coupleNames[0]} onChange={(e) => onPatch({ coupleNames: [e.target.value, ev.coupleNames[1]] })} data-testid="ed-names" />
                {(def.names === 2 || def.secondName) && (<><label className="kv-ed-label" htmlFor="kv-ed-n1" style={{ marginTop: 10 }}>{def.nameLabels[1]}</label>
                  <input id="kv-ed-n1" className="kv-input" maxLength={60} value={ev.coupleNames[1]} onChange={(e) => onPatch({ coupleNames: [ev.coupleNames[0], e.target.value] })} /></>)}</>
            )}
          </div>
        )}
        {selEl === 'message' && (
          <div className="kv-ed-group">
            <label className="kv-ed-label" htmlFor="kv-ed-msg">Wording</label>
            <textarea id="kv-ed-msg" className="kv-textarea" style={{ minHeight: 90 }} maxLength={400} value={ev.personalMessage} onChange={(e) => onPatch({ personalMessage: e.target.value })} />
          </div>
        )}
        {selEl === 'where' && (
          <div className="kv-ed-group">
            <label className="kv-ed-label" htmlFor="kv-ed-venue">Name of the place</label>
            <input id="kv-ed-venue" className="kv-input" maxLength={120} value={ev.venueName} onChange={(e) => onPatch({ venueName: e.target.value })} />
          </div>
        )}
        {selEl === 'date' && <p className="kv-hint">To change the date or time, go back to step 3 (When and where).</p>}
        {selEl === 'photos' && ev.photos && ev.photos.length > 1 && layoutCount(ev.photos.length) > 1 && (
          <button type="button" className="kv-btn kv-btn--secondary" onClick={() => onPatch({ photoLayout: ((ev.photoLayout || 0) + 1) % layoutCount(ev.photos!.length) })}>Shuffle layout</button>
        )}
        {sizeRow(st.s || 1, (v) => setEl(selEl, { s: Math.min(sizeMax, Math.max(sizeMin, v)) === 1 ? undefined : Math.min(sizeMax, Math.max(sizeMin, v)) }, `size-${selEl}`), sizeMin, sizeMax, 'el-size')}
        {isTextEl(selEl) && colorRow(st.color, (c) => setEl(selEl, { color: c }), 'Color')}
        {isTextEl(selEl) && (
          <div className="kv-ed-group">
            <p className="kv-ed-label">Line up</p>
            <div className="kv-btn-row" role="group" aria-label="Line up">
              {(['left', 'center', 'right'] as const).map((a) => (
                <button key={a} type="button" className={`kv-btn ${(st.align || 'center') === a ? 'kv-btn--primary' : 'kv-btn--secondary'}`} aria-pressed={(st.align || 'center') === a}
                  onClick={() => setEl(selEl, { align: a === 'center' ? undefined : a })}>{a === 'left' ? 'Left' : a === 'center' ? 'Center' : 'Right'}</button>
              ))}
            </div>
          </div>
        )}
        <div className="kv-btn-row">
          <button type="button" className="kv-btn kv-btn--secondary" onClick={() => z(1)}>Bring forward</button>
          <button type="button" className="kv-btn kv-btn--secondary" onClick={() => z(-1)}>Send back</button>
          {(st.x || st.y || st.s) && <button type="button" className="kv-btn kv-btn--secondary" onClick={() => setEl(selEl, { x: undefined, y: undefined, s: undefined })}>Put it back</button>}
          <button type="button" className="kv-btn kv-btn--secondary" onClick={() => { setEl(selEl, { hide: true }); setSel(null); }} data-testid="ed-hide">Hide this</button>
        </div>
      </>
    );
  }

  const fontChoices = pairingsFor(ev.theme);
  const photos = cardOf(ev).photos;
  const bgThumb = (css: string): CSSProperties => ({ background: css });

  return (
    <div className="kv-ed" data-testid="editor">
      <div className="kv-ed-bar" role="toolbar" aria-label="Card editing">
        <button type="button" className="kv-btn kv-btn--secondary" onClick={undo} disabled={!past.current.length} data-testid="ed-undo">Undo</button>
        <button type="button" className="kv-btn kv-btn--secondary" onClick={redo} disabled={!future.current.length} data-testid="ed-redo">Redo</button>
        <button type="button" className="kv-btn kv-btn--secondary" onClick={autoArrange} data-testid="ed-arrange">Auto-arrange</button>
        <button type="button" className="kv-btn kv-btn--secondary" onClick={resetAll} disabled={!layout} data-testid="ed-reset">Reset to original design</button>
        <button type="button" className="kv-btn kv-btn--primary" onClick={onClose} data-testid="ed-done">Done</button>
      </div>
      <div className="kv-ed-main">
        <div className="kv-ed-stage" ref={stage} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} data-testid="ed-stage">
          <InvitationCard data={{ ...cardOf(ev), layout }} editable />
          {sel && <style>{sel.kind === 'el' ? `.kv-ed-stage .kc [data-el="${sel.id}"]{z-index:30 !important;position:relative}` : `.kv-ed-stage .kc [data-sticker="${sel.id}"]{z-index:30 !important}`}</style>}
          {rect && <div className="kv-ed-sel" style={{ left: rect.left - 4, top: rect.top - 4, width: rect.width + 8, height: rect.height + 8 }} aria-hidden="true" />}
          {guides.v !== null && <div className="kv-ed-guide kv-ed-guide--v" aria-hidden="true" />}
          {guides.h !== null && (() => { const { paper, root } = nodes(); if (!paper || !root) return null; const top = paper.getBoundingClientRect().top - root.getBoundingClientRect().top + paper.getBoundingClientRect().height / 2; return <div className="kv-ed-guide kv-ed-guide--h" style={{ top }} aria-hidden="true" />; })()}
          {tip && (
            <div className="kv-ed-tip" role="status" data-testid="ed-tip">
              <span>Tap anything on the card to change it. Drag to move it.</span>
              <button type="button" className="kv-btn kv-btn--primary" onClick={(e) => { e.stopPropagation(); dismissTip(); }} onPointerDown={(e) => e.stopPropagation()}>Got it</button>
            </div>
          )}
        </div>
        <div className="kv-ed-panel" aria-live="polite">
          {panel ? (
            <>
              {panel}
              <button type="button" className="kv-btn kv-btn--quiet" style={{ paddingLeft: 0, marginTop: 8 }} onClick={() => setSel(null)}>Back to the whole card</button>
            </>
          ) : (
            <>
              <h3 className="kv-ed-h">The whole card</h3>
              <p className="kv-hint" style={{ marginBottom: 14 }}>Tap anything on the card to move it, resize it or change its words. Or change the whole card here.</p>
              <div className="kv-ed-group">
                <p className="kv-ed-label">Font style</p>
                <div className="kv-ed-fonts">
                  <button type="button" className="kv-ed-font" aria-pressed={!layout?.fonts} onClick={() => setWhole({ fonts: undefined })}>The design's own</button>
                  {fontChoices.map((p) => (
                    <button key={p} type="button" className="kv-ed-font" aria-pressed={layout?.fonts === p} onClick={() => setWhole({ fonts: p })} data-testid={`font-${p}`}>
                      <span style={{ fontFamily: PAIRINGS[p].script, fontSize: 24 }}>Aa</span> {PAIRINGS[p].name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="kv-ed-group">
                <p className="kv-ed-label">Background</p>
                <div className="kv-ed-bgs">
                  <button type="button" className="kv-ed-bg" aria-pressed={!layout?.bg} onClick={() => setWhole({ bg: undefined })}><i style={bgThumb(`linear-gradient(135deg, ${t.swatch[0]} 50%, ${t.swatch[1]} 50%)`)} />The design's</button>
                  {Object.entries(BACKGROUNDS).map(([k, b]) => (
                    <button key={k} type="button" className="kv-ed-bg" aria-pressed={layout?.bg === k} onClick={() => setWhole({ bg: k })} data-testid={`bg-${k}`}><i style={bgThumb(b.css)} />{b.name}</button>
                  ))}
                  {photos.filter((p) => p.id !== 'legacy').map((p, i) => (
                    <button key={p.id} type="button" className="kv-ed-bg" aria-pressed={layout?.bg === `photo:${p.id}`} onClick={() => setWhole({ bg: `photo:${p.id}` })} data-testid={`bg-photo-${i}`}>
                      <i style={{ backgroundImage: `url(${p.src})`, backgroundSize: 'cover', backgroundPosition: `${p.fx * 100}% ${p.fy * 100}%` }} />Photo {i + 1}, faded
                    </button>
                  ))}
                </div>
              </div>
              <div className="kv-ed-group">
                <p className="kv-ed-label">Add a sticker {stickers.length >= MAX_STICKERS && <span className="kv-muted">(up to {MAX_STICKERS})</span>}</p>
                <div className="kv-ed-stickers">
                  {STICKERS_FOR[type].map((k) => (
                    <button key={k} type="button" className="kv-ed-stk" onClick={() => addSticker(k)} disabled={stickers.length >= MAX_STICKERS} aria-label={`Add ${STICKERS[k].name}`} data-testid={`add-sticker-${k}`}>
                      <StickerArt k={k} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="kv-ed-group">
                <label className="kv-check">
                  <input type="checkbox" checked={!els.decor?.hide} onChange={(e) => setEl('decor', { hide: e.target.checked ? undefined : true })} />
                  <span><strong>Show the design's decorations</strong> (flowers, frames, corners)</span>
                </label>
              </div>
              {hidden.filter(([id]) => id !== 'decor').length > 0 && (
                <div className="kv-ed-group">
                  <p className="kv-ed-label">Hidden</p>
                  <ul className="kv-ed-hidden">
                    {hidden.filter(([id]) => id !== 'decor').map(([id]) => (
                      <li key={id}><span>{LABELS[id]}</span><button type="button" className="kv-btn kv-btn--secondary" onClick={() => setEl(id, { hide: undefined })} data-testid={`show-${id}`}>Show it again</button></li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
