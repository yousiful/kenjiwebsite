import { Link } from 'react-router-dom';
import { Shell } from '../ui';

export default function VidgenTerms() {
  return (
    <Shell title="Kenji Studio terms of use | KenjiAI" description="The rules for making AI video with Kenji Studio: what is allowed, who owns the videos, and how AI-generated content is labeled." index>
      <main className="vg-wrap vg-narrow">
        <section className="vg-hero" style={{ paddingBottom: 0 }}>
          <h1 className="vg-h2">Kenji Studio terms of use</h1>
          <p className="vg-lead">
            These terms add to the KenjiAI <Link to="/terms">terms of service</Link> and <Link to="/privacy">privacy policy</Link> for anyone using Kenji Studio at kenjiai.com/video-generation. Last updated October 16, 2026.
          </p>
        </section>
        <div className="vg-prose">
          <h2>What you can not make</h2>
          <ul>
            <li>Anything illegal where you live or where you publish it.</li>
            <li>Sexual or nude content of any kind, and anything involving minors in a sexual or harmful way.</li>
            <li>Deepfakes: video that shows a real, identifiable person saying or doing something, unless you have that person's clear permission. This includes public figures.</li>
            <li>Content meant to deceive people into thinking it is real footage of a real event, to commit fraud, to harass someone, or to spread hate or violence.</li>
            <li>Video that copies someone else's trademark, logo or copyrighted work without the right to use it.</li>
          </ul>
          <p>Uploads and prompts are screened by our video provider's content filter. Blocked requests are refunded in credits. We may suspend accounts that keep breaking these rules, without a refund of remaining credits.</p>

          <h2>Who owns the videos</h2>
          <p>As between you and us, you own the videos you make and the files you upload. You give us permission to store and process them only to run the service: rendering, saving them to your library and letting you download them. You are responsible for having the rights to anything you upload, including people's faces and voices.</p>

          <h2>AI-generated content</h2>
          <p>Everything made in Kenji Studio is AI-generated. Results can be imperfect or unexpected, so review every video before you publish it. When you post, follow each platform's rules for labeling AI-generated or altered media, and do not present AI video as a real recording of real events.</p>

          <h2>Credits and billing</h2>
          <p>Each video shows its price in credits before you generate it. Credits are held when you press Generate and returned automatically if the video fails, is blocked or is canceled before it starts. Plan credits arrive with each paid month and roll over while your plan is active. When a plan ends, unused credits end with it. Credits have no cash value. You can cancel any time from your Plan page.</p>

          <h2>Who runs the generation</h2>
          <p>Video generation is powered by Higgsfield. Your prompts and uploads are sent to Higgsfield to render the video. Finished videos are copied to our own storage so they stay in your library.</p>

          <h2>Questions</h2>
          <p>Email <a href="mailto:support@mediatraffics.com">support@mediatraffics.com</a>.</p>
        </div>
      </main>
    </Shell>
  );
}
