// /invites/templates: every Kenji Invites design on one page, each with a button that
// opens the maker with that design already picked.
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageSchema from '../../components/PageSchema';
import InvitationCard, { DESIGNS_FOR, THEMES, type CardData } from '../InvitationCard';
import { loadThemeFonts } from '../format';
import { EVENT_TYPES, THEME_IDS, TYPES, type EventType, type ThemeId } from '../shared';
import { Page } from '../ui';
import { TOPICS, topicForType } from '../seo/topics';
import { Faq, FreeList, MoreLinks, SAMPLE_BASE, startHref } from './InvitesTopic';
import '../seo/seo.css';

const TITLE = 'Free Online Invitation Templates with RSVP: 36 Designs | Kenji Invites';
const DESC = 'Browse 36 free invitation templates for weddings, birthdays, baby showers, graduations, holiday parties and more. Pick one, add your photos and send it with RSVP tracking. No ads, no sign-up.';

const WEDDING_DESIGNS = DESIGNS_FOR.wedding;
const PARTY_DESIGNS = THEME_IDS.filter((t) => !WEDDING_DESIGNS.includes(t));

const typesFor = (t: ThemeId): EventType[] => EVENT_TYPES.filter((e) => e !== 'custom' && DESIGNS_FOR[e].includes(t));
/** the celebration a party design opens as: the type it is the default for, else the first that offers it */
const partyType = (t: ThemeId): EventType => EVENT_TYPES.find((e) => e !== 'wedding' && DESIGNS_FOR[e][0] === t) || typesFor(t).find((e) => e !== 'wedding') || 'custom';

const sampleFor = (type: EventType, theme: ThemeId): CardData => {
  const topic = TOPICS.find((x) => x.type === type);
  const s = topic?.sample || { names: ['', ''] as [string, string], details: { eventName: 'Summer BBQ' } };
  return { ...SAMPLE_BASE, coupleNames: s.names, details: s.details, type, theme };
};

const FAQ: [string, string][] = [
  ['Are these invitation templates really free?', 'Yes. Every design is free to use, with your own photos and wording, and sending it with RSVP tracking is free too. There is no watermark and no ads on what your guests see.'],
  ['Can I use a wedding design for another event?', 'The wedding designs are written for weddings. For other events you get the designs made for that kind of celebration, and you can change colors, fonts and words on any of them.'],
  ['Can I print them?', 'They are made to be sent by text or email with a link, so guests can reply. You can also save the card as a picture and print it for anyone who wants a paper copy.'],
  ['Can I change the colors and fonts?', 'Yes. Tap anything on the card to move it, resize it or change its words, colors and fonts, or add stickers. One button puts the design back the way it was.'],
];

function Grid({ themes, wedding = false }: { themes: ThemeId[]; wedding?: boolean }) {
  return (
    <div className="ks-designs">
      {themes.map((t) => {
        const type = wedding ? 'wedding' : partyType(t);
        const used = wedding ? typesFor(t) : typesFor(t).filter((e) => e !== 'wedding');
        return (
          <div key={t} className="ks-design">
            <InvitationCard data={sampleFor(type, t)} />
            <p className="ks-design-name">{THEMES[t].name}</p>
            <p className="ks-design-for">For: {used.map((u) => TYPES[u].label).join(', ')}</p>
            <Link to={startHref(type, t)} className="kv-btn kv-btn--secondary">Use this design</Link>
          </div>
        );
      })}
    </div>
  );
}

export default function InvitesTemplates() {
  useEffect(() => { loadThemeFonts([...THEME_IDS]); }, []);
  const byType = EVENT_TYPES.filter((e) => e !== 'custom' && e !== 'wedding');
  return (
    <Page title={TITLE} noindex={false}>
      <PageSchema
        path="/invites/templates"
        name="Free invitation templates with RSVP"
        description={DESC}
        type="CollectionPage"
        crumbs={[{ name: 'Home', path: '/' }, { name: 'Kenji Invites', path: '/invites' }, { name: 'Invitation templates', path: '/invites/templates' }]}
        extra={[
          { '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
          { '@type': 'ItemList', name: 'Kenji Invites designs', numberOfItems: THEME_IDS.length, itemListElement: THEME_IDS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: THEMES[t].name })) },
        ]}
      />
      <Helmet>
        <meta name="description" content={DESC} />
        <meta property="og:title" content="36 free invitation templates with RSVP" />
        <meta property="og:description" content={DESC} />
        <meta property="og:image" content="https://kenjiai.com/invites-og.jpg" />
      </Helmet>

      <section className="kv-wrap ks-sec" aria-labelledby="ks-h1">
        <nav className="ks-crumbs" aria-label="Breadcrumb"><Link to="/invites">Kenji Invites</Link> <span aria-hidden="true">/</span> Templates</nav>
        <h1 id="ks-h1">Free invitation templates, ready to send with RSVP</h1>
        <p className="kv-lead" style={{ maxWidth: '46ch' }}>36 designs for weddings, birthdays, showers, graduations, holiday parties and more. Tap Use this design, type your names and date, add photos, and send it from your phone. Guests reply on the invitation.</p>
        <ul className="kv-kinds" style={{ marginTop: 22 }} aria-label="Jump to">
          <li><a href="#ks-wed">Wedding</a></li>
          <li><a href="#ks-party">Every other celebration</a></li>
          {byType.map((e) => topicForType(e) && <li key={e}><Link to={`/invites/${topicForType(e)}`}>{TYPES[e].label}</Link></li>)}
        </ul>
      </section>

      <section className="kv-wrap ks-sec ks-group" aria-labelledby="ks-wed">
        <h2 id="ks-wed">Wedding invitation templates</h2>
        <p className="kv-muted ks-intro">Classic stationery with gold foil and wax seals, plus illustrated designs for a church, garden, beach, barn, destination or city hall wedding. <Link to="/invites/wedding-invitations">Wedding wording and tips</Link>.</p>
        <Grid themes={WEDDING_DESIGNS} wedding />
      </section>

      <section className="kv-wrap ks-sec ks-group" aria-labelledby="ks-party">
        <h2 id="ks-party">Birthday, shower, graduation and party templates</h2>
        <p className="kv-muted ks-intro">Designs made for every other kind of celebration. Each one lists the occasions it is offered for.</p>
        <Grid themes={PARTY_DESIGNS} />
      </section>

      <section className="kv-wrap ks-sec" aria-labelledby="ks-free">
        <h2 id="ks-free">What you get with every template</h2>
        <FreeList />
      </section>

      <section className="kv-wrap ks-sec" aria-labelledby="ks-faq">
        <h2 id="ks-faq" style={{ marginBottom: 18 }}>Questions</h2>
        <Faq items={FAQ} />
        <div style={{ marginTop: 36 }}>
          <Link to="/invites/new" className="kv-btn kv-btn--primary kv-btn--big">Make my invitation, free</Link>
        </div>
      </section>

      <MoreLinks current="templates" related={[]} />
    </Page>
  );
}
