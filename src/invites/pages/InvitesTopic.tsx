// One landing page per kind of celebration (/invites/wedding-invitations, ...).
// Content lives in ../seo/topics.ts. Prerendered to static HTML at build time.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageSchema from '../../components/PageSchema';
import InvitationCard, { THEMES, type CardData } from '../InvitationCard';
import { loadThemeFonts } from '../format';
import { TYPES } from '../shared';
import { Page } from '../ui';
import { TOPICS, EXTRA_PAGES, linkTextOf, topicBySlug, type Topic, type Wording } from '../seo/topics';
import '../seo/seo.css';

export const SAMPLE_BASE = { date: '2027-06-12', time: '16:30', venueName: 'The Rose Garden', address: 'Charleston, South Carolina', personalMessage: '', accent: '' };

/** Where "Make my invitation" goes: the wizard, already set to this kind of celebration. */
export const startHref = (type: string, theme?: string) => (type ? `/invites/new?type=${type}${theme ? `&theme=${theme}` : ''}&step=2` : '/invites/new');

/** The same three steps on every page, worded for the occasion. */
export function HowItWorks({ noun }: { noun: string }) {
  return (
    <section className="kv-wrap ks-sec" aria-labelledby="ks-how">
      <h2 id="ks-how">How the RSVP works</h2>
      <ol className="kv-steps" style={{ marginTop: 22 }}>
        <li><h3>You add your guests</h3><p className="kv-muted">Type or paste names with a phone number or email, and choose how many seats each one gets. A couple gets 2, a family of four gets 4.</p></li>
        <li><h3>You send each one their own link</h3><p className="kv-muted">Tap Text or Email next to a guest and your phone opens a message with their link already in it. It comes from you, so people open it.</p></li>
        <li><h3>They tap Yes or No</h3><p className="kv-muted">Guests see the invitation with a countdown to the {noun}, then reply with how many are coming and their names. No app, no account. Every answer shows up on your guest list.</p></li>
      </ol>
    </section>
  );
}

export function FreeList() {
  return (
    <ul className="ks-free">
      <li><strong>Free.</strong> Making it, sending it and tracking replies. No paid tier needed to send.</li>
      <li><strong>No ads</strong> on the invitation your guests open.</li>
      <li><strong>No guest accounts.</strong> Guests tap a link and answer. Nothing to download.</li>
      <li><strong>No sign-in for you either.</strong> You get a private link to your invitations that works on any phone.</li>
      <li><strong>Seats per guest.</strong> Replies can't go over the number you set.</li>
      <li><strong>Up to 8 photos</strong>, a countdown, maps, calendar buttons and a phone wallpaper for guests.</li>
    </ul>
  );
}

function WordingCard({ w }: { w: Wording }) {
  const [copied, setCopied] = useState(false);
  return (
    <figure className="ks-wording">
      <figcaption>{w.label}</figcaption>
      <p>{w.lines.map((l, i) => <span key={i}>{l}<br /></span>)}</p>
      <button type="button" className="kv-btn kv-btn--secondary ks-copy" onClick={() => {
        navigator.clipboard?.writeText(w.lines.join('\n')).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 1800); }).catch(() => {});
      }}>{copied ? 'Copied' : 'Copy this wording'}</button>
    </figure>
  );
}

export function MoreLinks({ current, related }: { current: string; related: string[] }) {
  const rest = [...TOPICS.map((t) => t.slug), ...EXTRA_PAGES.map((p) => p.slug)].filter((s) => s !== current && !related.includes(s));
  return (
    <section className="kv-wrap ks-sec" aria-labelledby="ks-more">
      <h2 id="ks-more">More invitations</h2>
      {related.length > 0 && (
        <ul className="ks-related">
          {related.map((s) => <li key={s}><Link to={`/invites/${s}`}>{linkTextOf(s)}</Link></li>)}
        </ul>
      )}
      <ul className="kv-kinds" style={{ marginTop: 18 }}>
        {rest.map((s) => <li key={s}><Link to={`/invites/${s}`}>{linkTextOf(s)}</Link></li>)}
        <li><Link to="/invites">Kenji Invites home</Link></li>
      </ul>
      <p className="kv-muted" style={{ marginTop: 28, fontSize: 17 }}>Kenji Invites is a free tool from <Link to="/">KenjiAI</Link>. See our other <Link to="/free-tools">free tools</Link>.</p>
    </section>
  );
}

export function Faq({ items }: { items: [string, string][] }) {
  return (
    <div className="kv-faq">
      {items.map(([q, a]) => (
        <details key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}

const SHARED_FAQ: [string, string][] = [
  ['Do my guests need an account or an app?', 'No. Each guest gets a link. It opens in the browser on any phone or computer, and they answer with one tap.'],
  ['Who can see my guest list?', 'Only you, and any co-host you add. Guests see the invitation and their own answer, never anyone else on the list.'],
];

export function TopicView({ topic }: { topic: Topic }) {
  useEffect(() => { loadThemeFonts(topic.designs); }, [topic]);
  const type = topic.type || 'custom';
  const noun = TYPES[type].noun;
  const faq = [...topic.faq, ...SHARED_FAQ];
  const cards: CardData[] = topic.designs.map((theme) => ({ ...SAMPLE_BASE, coupleNames: topic.sample.names, details: topic.sample.details, theme, type }));
  const start = startHref(topic.type);
  const path = `/invites/${topic.slug}`;

  return (
    <Page title={topic.title} noindex={false}>
      <PageSchema
        path={path}
        name={topic.h1}
        description={topic.description}
        crumbs={[{ name: 'Home', path: '/' }, { name: 'Kenji Invites', path: '/invites' }, { name: topic.linkText, path }]}
        extra={[
          { '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
          { '@type': 'WebApplication', name: `Kenji Invites: ${topic.linkText}`, url: `https://kenjiai.com${path}`, applicationCategory: 'LifestyleApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
        ]}
      />
      <Helmet>
        <meta name="description" content={topic.description} />
        <meta property="og:title" content={topic.h1} />
        <meta property="og:description" content={topic.description} />
        <meta property="og:image" content="https://kenjiai.com/invites-og.jpg" />
      </Helmet>

      <section className="kv-hero">
        <div className="kv-wrap kv-hero-in">
          <div className="kv-hero-copy">
            <nav className="ks-crumbs" aria-label="Breadcrumb"><Link to="/invites">Kenji Invites</Link> <span aria-hidden="true">/</span> {topic.linkText}</nav>
            <h1>{topic.h1}</h1>
            <p className="kv-lead">{topic.lead}</p>
            <div className="kv-btn-row" style={{ marginTop: 28 }}>
              <Link to={start} className="kv-btn kv-btn--primary kv-btn--big" data-testid="topic-start">Make my invitation, free</Link>
            </div>
            <p className="kv-muted" style={{ marginTop: 14 }}>No account, no ads, nothing for guests to download.</p>
          </div>
          <div className="kv-hero-cards" aria-label="Sample invitations">
            {cards.slice(0, 3).map((d, i) => (
              <div key={d.theme} className={`kv-hero-card kv-hero-card--${i}`}><InvitationCard data={d} /></div>
            ))}
          </div>
        </div>
      </section>

      <section className="kv-wrap ks-sec" aria-labelledby="ks-wording">
        <h2 id="ks-wording">{topic.linkText}: wording you can use</h2>
        <p className="kv-muted ks-intro">Copy one of these and change the names and details. On Kenji Invites the card fills in your names, date and place for you, and you can rewrite any line.</p>
        <div className="ks-wordings">
          {topic.wording.map((w) => <WordingCard key={w.label} w={w} />)}
        </div>
      </section>

      <section className="kv-wrap ks-sec ks-two" aria-label="When to send and what to include">
        <div>
          <h2 id="ks-when">When to send it</h2>
          <dl className="ks-timing">
            {topic.timing.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
        <div>
          <h2 id="ks-what">What to put on it</h2>
          <ul className="ks-list">
            {topic.include.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>
      </section>

      <section className="kv-wrap ks-sec" aria-labelledby="ks-designs">
        <h2 id="ks-designs">Designs for this {noun}</h2>
        <p className="kv-muted ks-intro">A few of the designs made for this kind of celebration. Every one takes your own photos, and you can change colors, fonts and words. <Link to="/invites/templates">See all 36 designs</Link>.</p>
        <div className="ks-designs">
          {cards.map((d) => (
            <div key={d.theme} className="ks-design">
              <InvitationCard data={d} />
              <p className="ks-design-name">{THEMES[d.theme].name}</p>
              <Link to={startHref(topic.type, d.theme)} className="kv-btn kv-btn--secondary">Use this design</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="kv-wrap ks-sec" aria-labelledby="ks-tips">
        <h2 id="ks-tips">Tips from hosts</h2>
        <div className="ks-tips">
          {topic.tips.map(([h, p]) => <div key={h}><h3>{h}</h3><p className="kv-muted">{p}</p></div>)}
        </div>
      </section>

      <HowItWorks noun={noun} />

      <section className="kv-wrap ks-sec" aria-labelledby="ks-free">
        <h2 id="ks-free">What free means here</h2>
        <FreeList />
      </section>

      <section className="kv-wrap ks-sec" aria-labelledby="ks-faq">
        <h2 id="ks-faq" style={{ marginBottom: 18 }}>Questions</h2>
        <Faq items={faq} />
        <div style={{ marginTop: 36 }}>
          <Link to={start} className="kv-btn kv-btn--primary kv-btn--big">Make my invitation, free</Link>
        </div>
      </section>

      <MoreLinks current={topic.slug} related={topic.related} />
    </Page>
  );
}

/** Route element: <InvitesTopic slug="wedding-invitations" /> */
export default function InvitesTopic({ slug }: { slug: string }) {
  const topic = topicBySlug(slug);
  if (!topic) return null;
  return <TopicView topic={topic} />;
}
