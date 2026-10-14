import { useCallback, useEffect, useRef, useState } from 'react';
import type { CardData } from './InvitationCard';
import { Envelope } from './Opening';
import { SketchArt } from './Sketch';
import type { EventType, Figures, ThemeId } from './shared';

// The whole opening as one continuous timeline, so nothing cuts or flashes between stages:
//   paper (fonts and photo load behind it) -> sketch draws -> watercolor wash
//   -> cross-fade to the envelope -> seal breaks, flap opens, card slides out
//   -> card rises while the overlay fades onto the real card -> party.
// About 5.9s with the sketch, 3.2s envelope only. Tap to hurry it along; Skip ends it.
// Only opacity and transform animate here (the sketch strokes are the one exception).

export type IntroPhase = 'prep' | 'sketch' | 'cross' | 'envelope' | 'open' | 'rise' | 'out';

// milliseconds from the start of each mode's timeline
const SKETCH: [IntroPhase, number][] = [['sketch', 0], ['cross', 3400], ['envelope', 3750], ['open', 3950], ['rise', 5200]];
const ENVELOPE: [IntroPhase, number][] = [['envelope', 0], ['open', 1200], ['rise', 2450]];
const PARTY_AFTER_RISE = 250;
const FADE_OUT = 650;

export function Intro({
  mode, data, initials, theme, type, figures, showCross, ready, lite, onReveal, onParty, onDone,
}: {
  mode: 'sketch' | 'envelope';
  data: CardData;
  initials: string;
  theme: ThemeId;
  type: EventType;
  figures: Figures;
  showCross: boolean;
  /** resolves when fonts and the main photo are ready (or a time limit passed) */
  ready: Promise<void>;
  lite: boolean;
  /** the real card underneath can start its own entrance */
  onReveal: () => void;
  onParty: () => void;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<IntroPhase>('prep');
  const timers = useRef<number[]>([]);
  const phaseRef = useRef<IntroPhase>('prep');
  const cbs = useRef({ onReveal, onParty, onDone });
  cbs.current = { onReveal, onParty, onDone };

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const at = (ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms)); };
  const go = useCallback((p: IntroPhase) => {
    phaseRef.current = p;
    setPhase(p);
    document.documentElement.dataset.introStage = p;
  }, []);

  /** Runs the timeline from step `from` onwards, starting now. */
  const run = useCallback((steps: [IntroPhase, number][], from: number) => {
    clear();
    const t0 = steps[from][1];
    for (let i = from; i < steps.length; i++) {
      const [p, ms] = steps[i];
      at(ms - t0, () => {
        go(p);
        if (p === 'rise') {
          cbs.current.onReveal();
          at(PARTY_AFTER_RISE, () => cbs.current.onParty());
          at(FADE_OUT, () => { delete document.documentElement.dataset.introStage; cbs.current.onDone(); });
        }
      });
    }
  }, [go]);

  const steps = mode === 'sketch' ? SKETCH : ENVELOPE;

  useEffect(() => {
    let alive = true;
    document.documentElement.dataset.introStage = 'prep';
    ready.then(() => { if (alive) run(steps, 0); });
    return () => { alive = false; clear(); delete document.documentElement.dataset.introStage; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = useCallback(() => {
    clear();
    go('out');
    cbs.current.onReveal();
    cbs.current.onParty();
    at(350, () => { delete document.documentElement.dataset.introStage; cbs.current.onDone(); });
  }, [go]);

  /** A tap moves on to the next part instead of waiting. */
  const hurry = useCallback(() => {
    const p = phaseRef.current;
    if (p === 'sketch') run(steps, steps.findIndex(([s]) => s === 'cross'));
    else if (p === 'envelope') run(steps, steps.findIndex(([s]) => s === 'open'));
  }, [run, steps]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') skip(); else if (e.key === 'Enter' || e.key === ' ') hurry(); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [skip, hurry]);

  const showSketch = mode === 'sketch' && (phase === 'sketch' || phase === 'cross');
  // the envelope is built while the page waits for fonts, hidden, so showing it later costs nothing
  const envClass = phase === 'open' ? 'kg3--open' : phase === 'rise' || phase === 'out' ? 'kg3--rise' : 'kg3--closed';
  return (
    <div className={`ki ki--${phase}`} role="dialog" aria-label="Opening your invitation" data-testid="intro" data-phase={phase} onClick={hurry}>
      {showSketch && (
        <div className="ki-sketch" data-testid="sketch">
          <SketchArt theme={theme} type={type} figures={figures} showCross={showCross} lite={lite} />
          <p className="sk-hint">Tap anywhere to continue</p>
        </div>
      )}
      <div className={`ki-env ${envClass}`} data-testid="envelope" aria-hidden={phase === 'prep' || phase === 'sketch'}>
        <Envelope data={data} initials={initials} onSeal={() => { if (phaseRef.current === 'envelope' || phaseRef.current === 'cross') run(steps, steps.findIndex(([s]) => s === 'open')); }} />
        <p className="kg3-hint">{mode === 'envelope' && phase === 'envelope' ? 'Tap the seal to open your invitation' : ' '}</p>
      </div>
      {phase !== 'prep' && <button type="button" className="kg3-skip" onClick={(e) => { e.stopPropagation(); skip(); }}>Skip</button>}
    </div>
  );
}
