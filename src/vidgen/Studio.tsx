import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  GOALS, MODELS, VIDEO_MODEL_IDS, ASPECTS, ASPECT_LABEL, AD_PLACEMENTS, TRIAL_CREDITS, goalById, approxCredits,
  type Aspect, type GenInput, type Goal, type GoalId, type ModelId, type Shot,
} from './models';
import { api, uploadFile, ApiError, type GenItem, type Preset } from './api';
import { useMe, signInHref, hasActivePlan } from './ui';
import { saveDraft, readDraft, readDraftImage, clearDraft } from './draft';
import PlanPanel from './PlanPanel';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE = 20 * 1024 * 1024;
const MAX_VIDEO = 200 * 1024 * 1024;
const GJ_MODES: { id: ModelId; label: string; hint: string }[] = [
  { id: 'gj-restyle', label: 'Restyle', hint: 'Same motion and framing, a new look. Pick a style below.' },
  { id: 'gj-motion', label: 'Motion transfer', hint: 'Your movement, performed by the character in your picture.' },
  { id: 'gj-swap', label: 'Object swap', hint: 'Swap one thing in the video for the object in your picture.' },
];

/** url is empty while the picture only lives in this browser (signed out); it is uploaded at sign-in/generate time. */
interface Upload { url: string; preview: string; name: string; file?: File }

function nearest(list: number[], v: number) {
  return list.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a), list[0]);
}

function videoSeconds(file: File): Promise<number> {
  return new Promise((resolve) => {
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.onloadedmetadata = () => { resolve(v.duration || 0); URL.revokeObjectURL(v.src); };
    v.onerror = () => resolve(0);
    v.src = URL.createObjectURL(file);
  });
}

const SIGNIN_MSG: Record<string, string> = {
  unavailable: 'Sign-in is not switched on yet. We are finishing setup, please check back soon.',
  cancelled: 'Sign-in was cancelled. You can try again any time.',
  expired: 'That sign-in link expired. Please try again.',
  failed: 'Google sign-in did not go through. Please try again.',
};

export default function Studio() {
  const { me, setBalance } = useMe();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const user = me?.user || null;
  const signedIn = !!user;
  const balance = user?.balance ?? 0;
  const genConnected = !!me?.setup.generation;
  const exactPricing = signedIn && genConnected;
  const signinIssue = SIGNIN_MSG[params.get('signin') || ''];

  const [goalId, setGoalId] = useState<GoalId | null>(null);
  const goal = goalId ? goalById(goalId)! : null;

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [image, setImage] = useState<Upload | null>(null);
  const [video, setVideo] = useState<Upload | null>(null);
  const [refs, setRefs] = useState<Upload[]>([]);
  const [uploading, setUploading] = useState<{ pct: number; what: string } | null>(null);

  const [model, setModel] = useState<ModelId>('kling-3-pro');
  const [duration, setDuration] = useState(8);
  const [aspect, setAspect] = useState<Aspect>('16:9');
  const [sound, setSound] = useState(true);
  const [advanced, setAdvanced] = useState(false);

  const [prompt, setPrompt] = useState('');
  const [shots, setShots] = useState<Shot[]>([]);
  const [useShots, setUseShots] = useState(false);
  const [writing, setWriting] = useState(false);
  const [writerNote, setWriterNote] = useState('');
  const [idea, setIdea] = useState('');
  const [ideaMode, setIdeaMode] = useState(false);
  const [ideaError, setIdeaError] = useState('');

  const [presets, setPresets] = useState<Preset[] | null>(null);
  const [presetId, setPresetId] = useState('');

  const [cost, setCost] = useState<{ credits?: number; loading: boolean; error?: string; off?: boolean; approx?: boolean }>({ loading: false });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [made, setMade] = useState<GenItem | null>(null);
  const [autoGo, setAutoGo] = useState(false);
  const plansRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLElement>(null);

  const spec = MODELS[model];
  const isGj = goal?.id === 'genjutsu';

  const pickGoal = (g: Goal) => {
    if (g.studioOnly && !user?.genjutsu) {
      if (signedIn) navigate('/video-generation/billing');
      else document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setGoalId(g.id);
    setIdeaMode(false);
    setAnswers({});
    setImage(null); setVideo(null); setRefs([]);
    setModel(g.model); setDuration(g.duration || 5); setAspect(g.aspect); setSound(true);
    setPrompt(''); setShots([]); setUseShots(false); setWriterNote(''); setPresetId('');
    setError(''); setMade(null); setAdvanced(false);
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  // ad placement drives the frame
  useEffect(() => {
    if (goal?.id === 'ad' && answers.placement && AD_PLACEMENTS[answers.placement]) setAspect(AD_PLACEMENTS[answers.placement]);
  }, [goal?.id, answers.placement]);

  // models that fit: needs an image-to-video path when there is a picture, text-to-video otherwise
  const modelChoices = useMemo(() => {
    if (!goal || isGj) return [];
    const wantsImage = !!image || goal.media === 'image';
    return VIDEO_MODEL_IDS.filter((id) => (wantsImage ? !!MODELS[id].i2v : !!MODELS[id].t2v));
  }, [goal, isGj, image]);

  useEffect(() => {
    if (!goal || isGj || !modelChoices.length) return;
    if (!modelChoices.includes(model)) setModel(modelChoices[0]);
  }, [goal, isGj, modelChoices, model]);

  useEffect(() => {
    if (!spec.durations.length) return;
    if (!spec.durations.includes(duration)) setDuration(nearest(spec.durations, duration));
  }, [spec, duration]);

  useEffect(() => {
    if (!isGj || model !== 'gj-restyle' || presets || !genConnected) return;
    api.presets().then((r) => setPresets(r.items)).catch((e) => setError((e as Error).message));
  }, [isGj, model, presets, genConnected]);

  const shotsActive = useShots && spec.multiShot && shots.length >= 2;
  const totalSeconds = shotsActive ? shots.reduce((a, s) => a + (Number(s.duration) || 0), 0) : duration;
  const aspectApplies = !isGj && (image ? spec.aspectOnI2v : spec.aspectOnT2v);

  const input: GenInput | null = useMemo(() => {
    if (!goal) return null;
    if (isGj) {
      return { goal: goal.id, model, prompt: (answers.note || '').trim(), videoUrl: video?.url, refUrls: refs.map((r) => r.url), presetId: presetId || undefined };
    }
    return {
      goal: goal.id, model, prompt: prompt.trim(), duration, aspect, sound,
      imageUrl: image?.url || undefined, shots: shotsActive ? shots : undefined,
    };
  }, [goal, isGj, model, answers.note, video, refs, presetId, prompt, duration, aspect, sound, image, shotsActive, shots]);

  const ready = !!input && (isGj
    ? !!video && (model === 'gj-restyle' ? !!presetId : refs.length > 0)
    : !!prompt.trim() && (goal?.media !== 'image' || !!image));

  // live price, debounced
  const inputKey = JSON.stringify(input);
  useEffect(() => {
    if (!ready || !input) { setCost({ loading: false }); return; }
    if (!exactPricing) {
      // signed out (or generation not connected yet): published per-second price, shown as "about"
      const approx = approxCredits(model, totalSeconds);
      setCost({ loading: false, credits: approx ?? undefined, approx: true, off: signedIn && !genConnected });
      return;
    }
    setCost((c) => ({ ...c, loading: true, error: undefined }));
    const t = setTimeout(() => {
      api.estimate(input)
        .then((r) => setCost({ loading: false, credits: r.credits }))
        .catch((e: ApiError) => setCost({ loading: false, error: e.message, off: e.notConnected }));
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputKey, ready, exactPricing, totalSeconds]);

  const required = goal ? goal.questions.filter((q) => !q.optional && q.kind === 'text') : [];
  const answered = required.every((q) => (answers[q.id] || '').trim().length >= 3);

  const write = async () => {
    if (!goal) return;
    setWriting(true); setWriterNote(''); setError('');
    try {
      const r = await api.writePrompt({ goal: goal.id, answers, model, duration, aspect, hasImage: !!image });
      setPrompt(r.prompt);
      setShots(r.shots || []);
      setUseShots(goal.id === 'story' && (r.shots || []).length >= 2 && !!MODELS[model].multiShot);
    } catch (e) {
      const err = e as ApiError;
      setWriterNote(err.notConnected ? 'The prompt writer is not connected yet. Type what the camera should see in the box below.' : err.message);
      if (!prompt) setPrompt('');
    } finally {
      setWriting(false);
    }
  };

  /** One box: the writer picks the kind of video, frame and length, and writes the prompt. */
  const makeFromIdea = async () => {
    const text = idea.trim();
    if (text.length < 3) return;
    setWriting(true); setIdeaError(''); setWriterNote(''); setError('');
    try {
      const r = await api.writeIdea({ idea: text, hasImage: !!image });
      const g = goalById(r.goal);
      if (!g) throw new ApiError('Something went wrong. Please try again.', 500);
      setGoalId(g.id);
      setIdeaMode(true);
      setAnswers({});
      setModel(g.model); setDuration(g.duration || 5); setAspect(r.aspect || g.aspect); setSound(true);
      setPrompt(r.prompt);
      setShots(r.shots || []);
      setUseShots(g.id === 'story' && (r.shots || []).length >= 2 && !!MODELS[g.model].multiShot);
      setPresetId(''); setMade(null); setAdvanced(false);
      requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (e) {
      const err = e as ApiError;
      setIdeaError(err.notConnected ? 'The prompt writer is not connected yet. Pick a video type below and type your own prompt for now.' : err.message);
    } finally {
      setWriting(false);
    }
  };

  const onImage = async (file: File | undefined, target: 'image' | 'ref') => {
    if (!file) return;
    setError('');
    if (!IMAGE_TYPES.includes(file.type)) { setError('Please use a JPG, PNG or WebP picture.'); return; }
    if (file.size > MAX_IMAGE) { setError('That picture is over 20 MB. Please use a smaller one.'); return; }
    if (target === 'image' && !exactPricing) {
      // signed out: keep the picture in this browser; it is uploaded after sign-in
      setImage({ url: '', preview: URL.createObjectURL(file), name: file.name, file });
      return;
    }
    if (!genConnected) { setError('Uploads open once generation is connected.'); return; }
    setUploading({ pct: 0, what: file.name });
    try {
      const url = await uploadFile(file, 'image', (pct) => setUploading({ pct, what: file.name }));
      const up = { url, preview: URL.createObjectURL(file), name: file.name };
      if (target === 'image') setImage(up);
      else setRefs((r) => [...r, up].slice(0, model === 'gj-restyle' ? 5 : 8));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(null);
    }
  };

  const onVideo = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    if (file.type !== 'video/mp4') { setError('Please upload an MP4 video.'); return; }
    if (file.size > MAX_VIDEO) { setError('That video is over 200 MB. Please trim it or export it smaller.'); return; }
    const secs = await videoSeconds(file);
    if (secs && secs < 4) { setError('The video needs to be at least 4 seconds long.'); return; }
    if (!genConnected) { setError('Uploads open once generation is connected.'); return; }
    setUploading({ pct: 0, what: file.name });
    try {
      const url = await uploadFile(file, 'video', (pct) => setUploading({ pct, what: file.name }));
      setVideo({ url, preview: '', name: file.name + (secs > 30 ? ' (only the first 30 seconds are used)' : '') });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(null);
    }
  };

  const goToPlans = () => plansRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  /** Signed out: keep everything in this browser, then sign in and come back to ?resume=1. */
  const signInToGenerate = async () => {
    if (!goal) return;
    setBusy(true);
    await saveDraft(
      { goal: goal.id, answers, idea: ideaMode ? idea : undefined, prompt, shots, useShots, model, duration, aspect, sound, hasImage: !!image?.file, imageName: image?.name, autoGenerate: true },
      image?.file || null,
    );
    window.location.href = signInHref('/video-generation?resume=1');
  };

  const generate = async () => {
    if (!input || !ready) return;
    setBusy(true); setError('');
    try {
      let send = input;
      if (image && !image.url && image.file) {
        // picked before sign-in: upload it now
        setUploading({ pct: 0, what: image.name });
        const url = await uploadFile(image.file, 'image', (pct) => setUploading({ pct, what: image.name }));
        setImage({ ...image, url });
        setUploading(null);
        send = { ...input, imageUrl: url };
      }
      const r = await api.generate(send, cost.approx ? undefined : cost.credits);
      setBalance(r.balance);
      setMade(r.item);
      requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (e) {
      const err = e as ApiError;
      setUploading(null);
      setError(err.message);
      if (typeof err.data.credits === 'number') setCost({ loading: false, credits: err.data.credits as number });
    } finally {
      setBusy(false);
    }
  };

  // Back from Google sign-in with ?resume=1: restore the draft, then generate once the exact price is in.
  const resumed = useRef(false);
  useEffect(() => {
    if (resumed.current || !signedIn || params.get('resume') !== '1') return;
    resumed.current = true;
    const d = readDraft();
    const next = new URLSearchParams(params);
    next.delete('resume');
    setParams(next, { replace: true });
    if (!d || !goalById(d.goal)) return;
    const g = goalById(d.goal)!;
    if (g.studioOnly && !user?.genjutsu) return;
    setGoalId(d.goal);
    setAnswers(d.answers || {});
    setIdea(d.idea || '');
    setIdeaMode(!!d.idea);
    setPrompt(d.prompt || '');
    setShots(d.shots || []);
    setUseShots(!!d.useShots);
    setModel(d.model);
    setDuration(d.duration);
    setAspect(d.aspect);
    setSound(d.sound !== false);
    setMade(null);
    (async () => {
      if (d.hasImage) {
        const file = await readDraftImage();
        if (file) setImage({ url: '', preview: URL.createObjectURL(file), name: d.imageName || file.name, file });
      }
      await clearDraft();
      if (d.autoGenerate) setAutoGo(true);
    })();
  }, [signedIn, params, setParams, user?.genjutsu]);

  const enough = cost.credits === undefined || balance >= cost.credits;

  // auto-submit a restored draft: only with an exact price that the balance covers, otherwise leave it one tap away
  useEffect(() => {
    if (!autoGo || !ready || cost.loading || busy) return;
    if (cost.credits === undefined && !cost.error && !cost.off) return; // price still on its way
    setAutoGo(false);
    if (!cost.approx && cost.credits !== undefined && enough && !cost.error) generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoGo, ready, cost, busy, enough]);

  // result view: watch the new video until it is done
  useEffect(() => {
    if (!made || made.ready || made.error) return;
    const t = window.setTimeout(async () => {
      try {
        const r = await api.list();
        const cur = r.items.find((x) => x.id === made.id);
        setMade(cur ? cur : { ...made });
        setBalance(r.balance);
      } catch {
        setMade({ ...made }); // try again on the next tick
      }
    }, 6000);
    return () => window.clearTimeout(t);
  }, [made, setBalance]);

  if (made) {
    const done = made.ready && !!made.mediaUrl;
    return (
      <main className="vg-wrap vg-narrow vg-hero vg-reveal" ref={topRef}>
        {done ? (
          <>
            <p className="vg-label">Done</p>
            <h1 className="vg-title">Your video is ready</h1>
            <div className="vg-frame" data-aspect={made.aspect || '16:9'} style={{ marginTop: 20 }}>
              <video src={made.mediaUrl!} controls playsInline preload="metadata" aria-label={made.title} />
            </div>
            <div className="vg-row">
              <Link className="vg-btn vg-btn--quiet" to="/video-generation/library">Download it from your library</Link>
              <button type="button" className="vg-btn vg-btn--text" onClick={() => { setMade(null); setGoalId(null); }}>Make another</button>
            </div>
          </>
        ) : made.error ? (
          <>
            <p className="vg-label">No video this time</p>
            <h1 className="vg-title">{made.error}</h1>
            <div className="vg-row">
              <button type="button" className="vg-btn vg-btn--primary" onClick={() => setMade(null)}>Change it and try again</button>
            </div>
          </>
        ) : (
          <>
            <p className="vg-label">On its way</p>
            <h1 className="vg-title">We are making your video</h1>
            <p className="vg-lead">
              Most videos take a few minutes. You can wait here or leave, it will be in your library either way. {made.credits} credits are on hold, and if it does not render they come straight back.
            </p>
            <div className="vg-progress" aria-hidden="true"><span style={{ width: made.status === 'in_progress' ? '60%' : '20%' }} /></div>
            <p className="vg-meta" role="status" style={{ marginTop: 8 }}>{made.status === 'in_progress' ? 'Rendering...' : 'Waiting for a free slot...'}</p>
            <div className="vg-row">
              <Link className="vg-btn vg-btn--quiet" to="/video-generation/library">Open my library</Link>
              <button type="button" className="vg-btn vg-btn--text" onClick={() => { setMade(null); }}>Make a version with changes</button>
            </div>
          </>
        )}
        {done && !hasActivePlan(me) && (
          <div style={{ marginTop: 48 }}>
            <PlanPanel title="Your video is ready. Pick a plan to keep making them" lead={`You have ${balance} credits left. Plans add fresh credits every month.`} />
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="vg-wrap" ref={topRef}>
      {!goal && (
        <section className="vg-hero vg-reveal">
          <h1 className="vg-display" style={{ maxWidth: '18ch' }}>What video do you want?</h1>
          <p className="vg-lead">
            {signedIn
              ? 'Say it in one sentence. We pick the right size, length and model, and write the prompt.'
              : `Say it in one sentence. We pick the size, length and model and write the prompt. Sign in when you press Generate. Your first video is free (${TRIAL_CREDITS} credits), no card.`}
          </p>
          {signinIssue && <p className="vg-note" role="status">{signinIssue}</p>}
          {signedIn && !genConnected && (
            <p className="vg-note" role="status">Generation is not connected yet. You can look around and try the prompt writer; generating opens soon.</p>
          )}

          <form className="vg-field" onSubmit={(e) => { e.preventDefault(); makeFromIdea(); }}>
            <label htmlFor="vg-idea" className="vg-visually-hidden">Describe your video</label>
            <textarea
              id="vg-idea"
              className="vg-textarea vg-textarea--short"
              value={idea}
              maxLength={600}
              placeholder="A 9:16 ad for my $49 teeth whitening kit, aimed at busy moms"
              onChange={(e) => setIdea(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); makeFromIdea(); } }}
            />
            <div className="vg-row">
              <button type="submit" className="vg-btn vg-btn--primary" disabled={writing || idea.trim().length < 3}>
                {writing ? 'Writing your video...' : 'Make my video'}
              </button>
              <label className="vg-btn vg-btn--quiet" htmlFor="vg-idea-image">
                {image ? 'Change photo' : 'Add a photo (optional)'}
              </label>
              <input id="vg-idea-image" className="vg-visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => { onImage(e.target.files?.[0], 'image'); e.target.value = ''; }} disabled={!!uploading} />
            </div>
            {image && (
              <div className="vg-thumbs">
                <img className="vg-thumb" src={image.preview} alt={`Your photo: ${image.name}`} />
                <span className="vg-meta">This becomes the first frame.</span>
                <button type="button" className="vg-btn vg-btn--text" onClick={() => setImage(null)}>Remove</button>
              </div>
            )}
            {uploading && <p className="vg-meta" role="status">Uploading {uploading.what}... {uploading.pct}%</p>}
            {ideaError && <p className="vg-error" role="alert">{ideaError}</p>}
            {error && <p className="vg-error" role="alert">{error}</p>}
          </form>

          <p className="vg-label" style={{ marginTop: 40 }}>Or pick a type and we will ask a few questions</p>
          <div className="vg-options" role="list">
            {GOALS.map((g, i) => {
              const locked = g.studioOnly && !user?.genjutsu;
              return (
                <button
                  key={g.id}
                  type="button"
                  role="listitem"
                  className="vg-option"
                  aria-disabled={locked || undefined}
                  onClick={() => pickGoal(g)}
                >
                  <span className="vg-option-index" aria-hidden="true">{i + 1}</span>
                  <span>
                    <span className="vg-option-title">
                      {g.title}
                      {g.studioOnly && <span className="vg-option-tag">Studio plan</span>}
                    </span>
                    <span className="vg-option-blurb">
                      {locked ? 'Comes with the Studio plan. Tap to see plans.' : g.blurb}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {goal && (
        <div className="vg-reveal">
          <div className="vg-back">
            <button type="button" className="vg-btn vg-btn--text" onClick={() => { setGoalId(null); setIdeaMode(false); }}>Start over</button>
          </div>
          <div className="vg-split" style={{ marginTop: 16 }}>
            <section aria-labelledby="vg-goal-title">
              <h1 id="vg-goal-title" className="vg-h2">{goal.title}</h1>
              <p className="vg-lead" style={{ marginTop: 10 }}>{goal.blurb}</p>

              {isGj && (
                <div className="vg-field">
                  <span className="vg-q">What should Genjutsu do?</span>
                  <div className="vg-chips">
                    {GJ_MODES.map((m) => (
                      <button key={m.id} type="button" className="vg-chip" aria-pressed={model === m.id} onClick={() => { setModel(m.id); setRefs([]); }}>{m.label}</button>
                    ))}
                  </div>
                  <p className="vg-note">{GJ_MODES.find((m) => m.id === model)?.hint}</p>
                </div>
              )}

              {(goal.media === 'image' || goal.media === 'image-optional') && (
                <div className="vg-field">
                  <label htmlFor="vg-image">{goal.mediaLabel}</label>
                  <div className="vg-drop">
                    <input id="vg-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onImage(e.target.files?.[0], 'image')} disabled={!!uploading} />
                    <span className="vg-meta">JPG, PNG or WebP, up to 20 MB. It becomes the first frame of the video.</span>
                    {image && (
                      <div className="vg-thumbs">
                        <img className="vg-thumb" src={image.preview} alt={`Uploaded: ${image.name}`} />
                        <button type="button" className="vg-btn vg-btn--text" onClick={() => setImage(null)}>Remove</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {goal.media === 'video' && (
                <>
                  <div className="vg-field">
                    <label htmlFor="vg-video">{goal.mediaLabel}</label>
                    <div className="vg-drop">
                      <input id="vg-video" type="file" accept="video/mp4" onChange={(e) => onVideo(e.target.files?.[0])} disabled={!!uploading} />
                      <span className="vg-meta">MP4, 4 to 30 seconds, up to 200 MB. Longer clips use the first 30 seconds.</span>
                      {video && <span className="vg-meta">Uploaded: {video.name}</span>}
                    </div>
                  </div>
                  <div className="vg-field">
                    <label htmlFor="vg-refs">
                      {model === 'gj-restyle' ? 'Character pictures' : model === 'gj-motion' ? 'Picture of the character' : 'Picture of the new object'}
                      {model === 'gj-restyle' && <span className="vg-optional"> (optional, up to 5)</span>}
                    </label>
                    <div className="vg-drop">
                      <input id="vg-refs" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => { onImage(e.target.files?.[0], 'ref'); e.target.value = ''; }} disabled={!!uploading} />
                      {refs.length > 0 && (
                        <div className="vg-thumbs">
                          {refs.map((r, i) => <img key={r.url} className="vg-thumb" src={r.preview} alt={`Reference ${i + 1}`} />)}
                          <button type="button" className="vg-btn vg-btn--text" onClick={() => setRefs([])}>Clear</button>
                        </div>
                      )}
                    </div>
                  </div>
                  {model === 'gj-restyle' && (
                    <div className="vg-field">
                      <span className="vg-q">Pick a style</span>
                      {!presets && genConnected && <p className="vg-meta">Loading styles...</p>}
                      {presets && (
                        <div className="vg-chips">
                          {presets.map((p) => (
                            <button key={p.id} type="button" className="vg-chip" aria-pressed={presetId === p.id} onClick={() => setPresetId(p.id)}>
                              {p.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {uploading && (
                <div className="vg-field" role="status">
                  <span className="vg-meta">Uploading {uploading.what}...</span>
                  <div className="vg-progress"><span style={{ width: `${uploading.pct}%` }} /></div>
                </div>
              )}

              {ideaMode && (
                <div className="vg-field">
                  <label htmlFor="vg-idea-again">Your idea</label>
                  <input id="vg-idea-again" className="vg-input" value={idea} maxLength={600} onChange={(e) => setIdea(e.target.value)} />
                  <div className="vg-row">
                    <button type="button" className="vg-btn vg-btn--quiet" onClick={makeFromIdea} disabled={writing || idea.trim().length < 3}>
                      {writing ? 'Writing...' : 'Write it again'}
                    </button>
                  </div>
                  {ideaError && <p className="vg-error" role="alert">{ideaError}</p>}
                </div>
              )}

              {!ideaMode && goal.questions.map((q) => (
                <div className="vg-field" key={q.id}>
                  {q.kind === 'text' ? (
                    <>
                      <label htmlFor={`vg-q-${q.id}`}>{q.label}{q.optional && <span className="vg-optional"> (optional)</span>}</label>
                      <input
                        id={`vg-q-${q.id}`}
                        className="vg-input"
                        value={answers[q.id] || ''}
                        placeholder={q.placeholder}
                        maxLength={400}
                        onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                      />
                    </>
                  ) : (
                    <>
                      <span className="vg-q" id={`vg-q-${q.id}`}>{q.label}</span>
                      <div className="vg-chips" role="group" aria-labelledby={`vg-q-${q.id}`}>
                        {q.options!.map((o) => (
                          <button key={o} type="button" className="vg-chip" aria-pressed={answers[q.id] === o} onClick={() => setAnswers((a) => ({ ...a, [q.id]: o }))}>{o}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}

              {!isGj && (
                <>
                  {!ideaMode && <div className="vg-row">
                    <button type="button" className={prompt ? 'vg-btn vg-btn--quiet' : 'vg-btn vg-btn--primary'} onClick={write} disabled={writing || !answered}>
                      {writing ? 'Writing your prompt...' : prompt ? 'Write it again' : 'Write my prompt'}
                    </button>
                    {!answered && <span className="vg-meta">Answer the questions above first.</span>}
                  </div>}
                  {writerNote && <p className="vg-note" role="status">{writerNote}</p>}

                  {(prompt || writerNote) && (
                    <div className="vg-field">
                      <label htmlFor="vg-prompt">Your prompt <span className="vg-optional">(change anything you like)</span></label>
                      <textarea id="vg-prompt" className="vg-textarea" value={prompt} maxLength={2500} onChange={(e) => setPrompt(e.target.value)} />
                      {spec.multiShot && shots.length >= 2 && (
                        <div className="vg-field">
                          <label className="vg-switch">
                            <input type="checkbox" checked={useShots} onChange={(e) => setUseShots(e.target.checked)} />
                            Shoot it as {shots.length} separate shots
                          </label>
                          {useShots && (
                            <ol className="vg-shots">
                              {shots.map((s, i) => (
                                <li className="vg-shot" key={i}>
                                  <textarea
                                    aria-label={`Shot ${i + 1}`}
                                    className="vg-input vg-textarea--short"
                                    value={s.prompt}
                                    maxLength={512}
                                    onChange={(e) => setShots((all) => all.map((x, j) => (j === i ? { ...x, prompt: e.target.value } : x)))}
                                  />
                                  <select
                                    aria-label={`Shot ${i + 1} length`}
                                    className="vg-select"
                                    value={s.duration}
                                    onChange={(e) => setShots((all) => all.map((x, j) => (j === i ? { ...x, duration: Number(e.target.value) } : x)))}
                                  >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => <option key={n} value={n}>{n}s</option>)}
                                  </select>
                                </li>
                              ))}
                            </ol>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </section>

            <aside aria-label="Settings and price">
              <div className="vg-summary">
                <dl>
                  <dt>Model</dt><dd>{spec.label}</dd>
                  {!isGj && <><dt>Length</dt><dd>{totalSeconds} seconds</dd></>}
                  {isGj && <><dt>Length</dt><dd>Same as your video</dd></>}
                  {!isGj && <><dt>Frame</dt><dd>{aspectApplies ? ASPECT_LABEL[aspect] : 'Follows your picture'}</dd></>}
                  {spec.audio && <><dt>Sound</dt><dd>{sound ? 'On' : 'Off'}</dd></>}
                </dl>

                {!isGj && (
                  <div style={{ marginTop: 16 }}>
                    <label className="vg-switch">
                      <input type="checkbox" checked={advanced} onChange={(e) => setAdvanced(e.target.checked)} />
                      Advanced
                    </label>
                  </div>
                )}

                {advanced && !isGj && (
                  <div>
                    <div className="vg-field">
                      <label htmlFor="vg-model">Model</label>
                      <select id="vg-model" className="vg-select" value={model} onChange={(e) => setModel(e.target.value as ModelId)}>
                        {modelChoices.map((id) => <option key={id} value={id}>{MODELS[id].label}: {MODELS[id].note}</option>)}
                      </select>
                    </div>
                    {!shotsActive && (
                      <div className="vg-field">
                        <label htmlFor="vg-duration">Length</label>
                        <select id="vg-duration" className="vg-select" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                          {spec.durations.map((d) => <option key={d} value={d}>{d} seconds</option>)}
                        </select>
                      </div>
                    )}
                    {aspectApplies && (
                      <div className="vg-field">
                        <span className="vg-q">Frame</span>
                        <div className="vg-chips">
                          {ASPECTS.map((a) => <button key={a} type="button" className="vg-chip" aria-pressed={aspect === a} onClick={() => setAspect(a)}>{ASPECT_LABEL[a]}</button>)}
                        </div>
                      </div>
                    )}
                    {spec.audio && (
                      <div className="vg-field">
                        <label className="vg-switch">
                          <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} />
                          Generate sound
                        </label>
                      </div>
                    )}
                  </div>
                )}

                <hr className="vg-rule" />
                <p className="vg-label" style={{ margin: 0 }}>Price</p>
                <p className="vg-cost" aria-live="polite">
                  {cost.loading ? '...' : cost.credits !== undefined ? <>{cost.approx ? <small style={{ marginLeft: 0, marginRight: 6 }}>about</small> : null}{cost.credits}<small>credits</small></> : <>-</>}
                </p>
                {signedIn
                  ? <p className="vg-meta">You have {balance.toLocaleString()} credits.</p>
                  : <p className="vg-meta">Your first video is free: new accounts get {TRIAL_CREDITS} credits. No card.</p>}
                {!ready && <p className="vg-meta" style={{ marginTop: 8 }}>{isGj ? 'Add your video and pictures to see the price.' : 'Write the prompt to see the price.'}</p>}
                {cost.off && <p className="vg-note" role="status">Generation is not connected yet. We are finishing setup, please check back soon.</p>}
                {cost.error && !cost.off && <p className="vg-error" role="alert">{cost.error}</p>}
                {signedIn && !enough && (
                  <p className="vg-note">This one needs {cost.credits} credits and you have {balance}.</p>
                )}
                {error && <p className="vg-error" role="alert">{error}</p>}
                <div className="vg-row" style={{ marginTop: 18 }}>
                  {!signedIn ? (
                    <button type="button" className="vg-btn vg-btn--primary vg-btn--block" onClick={signInToGenerate} disabled={!ready || busy}>
                      {busy ? 'Opening Google...' : 'Sign in with Google to get your video'}
                    </button>
                  ) : !enough ? (
                    <button type="button" className="vg-btn vg-btn--primary vg-btn--block" onClick={goToPlans}>
                      {hasActivePlan(me) ? 'Get more credits to generate' : 'Pick a plan to generate'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="vg-btn vg-btn--primary vg-btn--block"
                      onClick={generate}
                      disabled={!ready || busy || cost.loading || cost.credits === undefined || !!uploading || !!cost.off}
                    >
                      {busy ? 'Starting...' : cost.credits !== undefined ? `Generate for ${cost.credits} credits` : 'Generate'}
                    </button>
                  )}
                </div>
                <p className="vg-meta" style={{ marginTop: 12 }}>
                  {signedIn ? 'If a video fails or gets blocked, your credits come back.' : 'Your first one is free. We keep your answers and prompt while you sign in.'}
                </p>
              </div>
            </aside>
          </div>
          {signedIn && !enough && (
            <div ref={plansRef} style={{ marginTop: 56 }}>
              {hasActivePlan(me) ? (
                <p className="vg-note">You are short on credits this month. <Link to="/video-generation/billing">Add credits or switch plans</Link>.</p>
              ) : (
                <PlanPanel title="Pick a plan to keep making videos" lead={`This video needs ${cost.credits} credits and you have ${balance}. Plans add fresh credits every month.`} />
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
