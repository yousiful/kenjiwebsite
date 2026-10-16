import { useSearchParams } from 'react-router-dom';
import { GOALS, PLANS, PLAN_IDS, TOPUP, TRIAL_CREDITS } from './models';
import { signInHref, useMe } from './ui';

const SIGNIN_MSG: Record<string, string> = {
  unavailable: 'Sign-in is not switched on yet. We are finishing setup, please check back soon.',
  cancelled: 'Sign-in was cancelled. You can try again any time.',
  expired: 'That sign-in link expired. Please try again.',
  failed: 'Google sign-in did not go through. Please try again.',
};

const FAQ: [string, string][] = [
  ['Do I need to know how to write prompts?', 'No. You answer a few plain questions, like what you sell and where the ad will run. Our writer turns that into a shot-by-shot prompt. You can read it and change any word before you generate.'],
  ['What does a video cost?', 'Every video shows its exact price in credits before you press Generate. Longer clips and heavier models cost more. If a video fails or the content filter blocks it, the credits go straight back to your balance.'],
  ['Who owns the videos?', 'You do. Use them in ads, sales videos, courses or anywhere else, as long as you follow the studio terms of use.'],
  ['Can I run these as Facebook, Instagram or TikTok ads?', 'Yes. Tall, square and wide formats are built in. Some platforms ask you to label AI-generated video, so check their rules when you post.'],
  ['What is Genjutsu?', 'Genjutsu edits a video you already have: give it a new look, move a new character with your own motion, or swap one object for another. It comes with the Studio plan and works on clips 4 to 30 seconds long.'],
  ['Where do my videos go?', 'Every finished video is saved to your library, where you can watch it again and download it.'],
  ['Can I cancel?', 'Yes, any time from your Plan page. Unused credits roll over month to month while your plan is active and end when the plan ends.'],
];

export default function Landing() {
  const { me } = useMe();
  const [params] = useSearchParams();
  const signinIssue = SIGNIN_MSG[params.get('signin') || ''];
  const signinOff = me ? !me.setup.signin : false;

  return (
    <main>
      <section className="vg-wrap vg-hero">
        <p className="vg-label">Kenji Studio</p>
        <h1 className="vg-display">AI video for your ads, VSLs and lessons</h1>
        <p className="vg-lead">
          Pick what you are making and answer a few plain questions. Kenji Studio writes the shot-by-shot prompt and renders the video. You see the price in credits before anything runs.
        </p>
        <div className="vg-row">
          <a className="vg-btn vg-btn--primary" href={signInHref()} aria-disabled={signinOff || undefined}>
            Start with {TRIAL_CREDITS} free credits
          </a>
          <a className="vg-btn vg-btn--text" href="#pricing">See plans</a>
        </div>
        <p className="vg-meta" style={{ marginTop: 14 }}>Sign in with your Google account. No card needed for the free credits.</p>
        {(signinIssue || signinOff) && <p className="vg-note" role="status">{signinIssue || SIGNIN_MSG.unavailable}</p>}
      </section>

      <section className="vg-section">
        <div className="vg-wrap">
          <h2 className="vg-h2">How it works</h2>
          <div className="vg-how">
            <div>
              <span className="vg-how-n">1</span>
              <h3>Pick what you are making</h3>
              <p>An ad, a VSL scene, a lesson visual, a product walkthrough, a film scene, or an edit of your own footage.</p>
            </div>
            <div>
              <span className="vg-how-n">2</span>
              <h3>Answer a few questions</h3>
              <p>What you sell, who it is for, where it will run. Our writer turns your answers into a prompt you can read and change.</p>
            </div>
            <div>
              <span className="vg-how-n">3</span>
              <h3>Generate and download</h3>
              <p>Check the price in credits, press Generate, and pick up the finished video from your library.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="vg-section">
        <div className="vg-wrap">
          <h2 className="vg-h2">What you can make</h2>
          <ul className="vg-options" style={{ listStyle: 'none', padding: 0 }}>
            {GOALS.map((g, i) => (
              <li key={g.id} className="vg-option" style={{ cursor: 'default' }}>
                <span className="vg-option-index" aria-hidden="true">{i + 1}</span>
                <span>
                  <span className="vg-option-title">
                    {g.title}
                    {g.studioOnly && <span className="vg-option-tag">Studio plan</span>}
                  </span>
                  <span className="vg-option-blurb">{g.blurb}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="vg-section" id="pricing">
        <div className="vg-wrap">
          <h2 className="vg-h2">Plans</h2>
          <p className="vg-lead">Monthly credits. Unused credits roll over while your plan is active. New accounts get {TRIAL_CREDITS} free credits to try it.</p>
          <div className="vg-ledger">
            {PLAN_IDS.map((id) => {
              const p = PLANS[id];
              return (
                <div className="vg-ledger-row" key={id}>
                  <span className="vg-ledger-name">{p.name}</span>
                  <span className="vg-ledger-detail">
                    <b>{p.credits.toLocaleString()} credits a month.</b> {p.line}.
                  </span>
                  <span className="vg-ledger-price">${p.usd}<small> a month</small></span>
                </div>
              );
            })}
          </div>
          <p className="vg-note">Need more in a busy month? Subscribers can add {TOPUP.credits} credits for ${TOPUP.usd}.</p>
          <div className="vg-row">
            <a className="vg-btn vg-btn--primary" href={signInHref('/video-generation/billing')}>Sign in to pick a plan</a>
          </div>
        </div>
      </section>

      <section className="vg-section">
        <div className="vg-wrap vg-narrow">
          <h2 className="vg-h2">Questions</h2>
          <div className="vg-faq">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
