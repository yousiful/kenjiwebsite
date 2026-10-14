import { useEffect, useRef, type ReactNode } from 'react';
import InvitationCard, { type CardData } from './InvitationCard';
import './opening.css';

// Guest-page opening: a 3D envelope (pure CSS transforms) and a card that tilts with
// the finger, mouse or phone. No 3D library. Everything animates transform/opacity only.

let gyroAllowed = false;
/** iOS asks permission for motion data; it must be requested inside a tap. */
export async function askForGyro() {
  const D = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } }).DeviceOrientationEvent;
  try {
    if (D && typeof D.requestPermission === 'function') gyroAllowed = (await D.requestPermission()) === 'granted';
    else gyroAllowed = true;
  } catch {
    gyroAllowed = false;
  }
}

/** The envelope itself (pocket, flap, wax seal and the card inside). Its motion comes from
 *  the kg3--open / kg3--rise class on an ancestor, set by the opening timeline. */
export function Envelope({ data, initials, onSeal }: { data: CardData; initials: string; onSeal: () => void }) {
  return (
    <>
      <div className="kg3-stage">
        <div className="kg3-env">
          <div className="kg3-back" />
          <div className="kg3-card" aria-hidden="true">
            <InvitationCard data={{ ...data, personalMessage: '' }} />
          </div>
          <div className="kg3-front" />
          <div className="kg3-flap"><i className="kg3-flap-face" /></div>
          <button type="button" className="kg3-seal" onClick={(e) => { e.stopPropagation(); askForGyro(); onSeal(); }} aria-label="Break the seal to open your invitation" data-testid="seal">
            <span className="kg3-seal-half kg3-seal-l"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#kg3-wax" /></svg></span>
            <span className="kg3-seal-half kg3-seal-r"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#kg3-wax" /></svg></span>
            <span className="kg3-seal-mono">{initials}</span>
          </button>
        </div>
      </div>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <radialGradient id="kg3-wax-g" cx="0.38" cy="0.32" r="0.75">
            <stop offset="0" style={{ stopColor: 'var(--kg-seal-hi, #c45a5a)' }} />
            <stop offset="0.55" style={{ stopColor: 'var(--kg-seal, #8b2d2d)' }} />
            <stop offset="1" style={{ stopColor: 'var(--kg-seal-lo, #5a1717)' }} />
          </radialGradient>
          <symbol id="kg3-wax" viewBox="0 0 100 100">
            <path d="M50 3 C61 4 66 9 74 11 C83 14 92 21 94 31 C97 41 95 47 97 56 C98 67 92 76 85 83 C78 91 68 94 58 96 C49 98 40 97 31 94 C21 90 12 84 7 74 C2 64 4 55 3 45 C3 35 7 26 14 19 C22 11 31 7 40 5 C44 4 47 3 50 3 Z" fill="url(#kg3-wax-g)" />
            <circle cx="50" cy="50" r="33" fill="none" stroke="rgba(0,0,0,.22)" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1" />
          </symbol>
        </defs>
      </svg>
    </>
  );
}

/**
 * Gentle 3D tilt + moving foil shine for the invitation card. Follows the mouse or a
 * dragging finger; uses the phone's motion sensor when allowed; otherwise sways slowly.
 */
export function TiltCard({ children, enabled, sweep = false }: { children: ReactNode; enabled: boolean; sweep?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const card = el?.firstElementChild as HTMLElement | null;
    const glow = sheen.current;
    if (!el || !card || !glow || !enabled) return;
    const names = Array.from(card.querySelectorAll<HTMLElement>('.kc--foil .kc-name, .kc--foil .kc-day'));
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let lastInput = 0;
    let lastShine = -1;
    const MAX = 7;
    const apply = () => {
      raf = 0;
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      card.style.transform = `rotateX(${(-cy * MAX).toFixed(2)}deg) rotateY(${(cx * MAX).toFixed(2)}deg)`;
      glow.style.transform = `translate3d(${(cx * 30).toFixed(1)}%, ${(cy * 22).toFixed(1)}%, 0)`;
      glow.style.opacity = String(Math.min(1, 0.35 + Math.hypot(cx, cy)));
      // foil highlight slides with the tilt; only repainted when it moves a whole step
      const shine = Math.round((50 + cx * 50) / 4) * 4;
      if (shine !== lastShine) { lastShine = shine; names.forEach((n) => { n.style.backgroundPosition = `${shine}% 50%`; }); }
      el.dataset.ry = (cx * MAX).toFixed(2);
      if (Math.abs(tx - cx) > 0.003 || Math.abs(ty - cy) > 0.003) raf = requestAnimationFrame(apply);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(apply); };
    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      lastInput = Date.now();
      el.classList.remove('kg-tilt--idle');
      kick();
    };
    const onLeave = () => { tx = 0; ty = 0; kick(); };
    let base: [number, number] | null = null;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      if (!base) base = [e.beta, e.gamma];
      tx = Math.max(-1, Math.min(1, (e.gamma - base[1]) / 25));
      ty = Math.max(-1, Math.min(1, (e.beta - base[0]) / 25));
      lastInput = Date.now();
      el.classList.remove('kg-tilt--idle');
      kick();
    };
    el.addEventListener('pointermove', onPointer, { passive: true });
    el.addEventListener('pointerleave', onLeave);
    window.addEventListener('deviceorientation', onOrient);
    // no motion data and no mouse after a moment: a slow, subtle sway instead
    const idle = window.setInterval(() => {
      if (Date.now() - lastInput > 2500 && !gyroAllowed && !el.classList.contains('kg-tilt--idle')) {
        card.style.transform = '';
        el.classList.add('kg-tilt--idle');
      }
    }, 1500);
    return () => {
      el.removeEventListener('pointermove', onPointer);
      el.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('deviceorientation', onOrient);
      clearInterval(idle);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);
  return (
    <div ref={ref} className={`kg-tilt${enabled ? ' kg-tilt--on' : ''}`} data-testid="tilt">
      {children}
      {enabled && <div className="kg-sheen" aria-hidden="true"><div ref={sheen} /></div>}
      {sweep && <div className="kg-sweepwrap" aria-hidden="true"><div className="kg-sweep" /></div>}
    </div>
  );
}
