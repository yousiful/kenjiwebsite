import { PLANS, PLAN_IDS, TOPUP, TRIAL_CREDITS } from './models';
import { signInHref } from './ui';

export const FAQ: [string, string][] = [
  ['Is it really free to try?', `Yes. Pick what you are making, answer the questions and read the prompt we write, all without signing in. When you press Generate, sign in with Google and your first video is on us: new accounts get ${TRIAL_CREDITS} free credits, enough for the first video of any type except Genjutsu. No card needed.`],
  ['Do I need to know how to write prompts?', 'No. You answer a few plain questions, like what you sell and where the ad will run. Our writer turns that into a shot-by-shot prompt. You can read it and change any word before you generate.'],
  ['What does a video cost?', 'Every video shows its exact price in credits before you press Generate. Longer clips and heavier models cost more. If a video fails or the content filter blocks it, the credits go straight back to your balance.'],
  ['Who owns the videos?', 'You do. Use them in ads, sales videos, courses or anywhere else, as long as you follow the studio terms of use.'],
  ['Can I run these as Facebook, Instagram or TikTok ads?', 'Yes. Tall, square and wide formats are built in. Some platforms ask you to label AI-generated video, so check their rules when you post.'],
  ['What is Genjutsu?', 'Genjutsu edits a video you already have: give it a new look, move a new character with your own motion, or swap one object for another. It comes with the Studio plan and works on clips 4 to 30 seconds long.'],
  ['Where do my videos go?', 'Every finished video is saved to your library, where you can watch it again and download it.'],
  ['Can I cancel?', 'Yes, any time from your Plan page. Unused credits roll over month to month while your plan is active and end when the plan ends.'],
];

/** How it works, plans and questions, shown under the studio for signed-out visitors. */
export default function LandingInfo() {
  return (
    <>
      <section className="vg-section">
        <div className="vg-wrap">
          <h2 className="vg-h2">How it works</h2>
          <div className="vg-how">
            <div>
              <span className="vg-how-n">1</span>
              <h3>Pick what you are making</h3>
              <p>An ad, a VSL scene, a lesson visual, a product walkthrough or a film scene. Studio plans can also edit their own footage.</p>
            </div>
            <div>
              <span className="vg-how-n">2</span>
              <h3>Answer a few questions</h3>
              <p>What you sell, who it is for, where it will run. Our writer turns your answers into a prompt you can read and change.</p>
            </div>
            <div>
              <span className="vg-how-n">3</span>
              <h3>Sign in and generate</h3>
              <p>Press Generate, sign in with Google, and your first video is free. It lands in your library, ready to download.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="vg-section" id="pricing">
        <div className="vg-wrap">
          <h2 className="vg-h2">Plans</h2>
          <p className="vg-lead">Try it free, no card. Your first video is on us ({TRIAL_CREDITS} free credits). After that, plans give you fresh credits every month and unused credits roll over while your plan is active.</p>
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
            <a className="vg-btn vg-btn--quiet" href={signInHref('/video-generation/billing')}>Sign in to pick a plan</a>
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
    </>
  );
}
