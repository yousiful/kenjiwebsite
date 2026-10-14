import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import InvitationCard, { type CardData } from '../InvitationCard';
import { loadThemeFonts } from '../format';
import { getToken } from '../api';
import { EVENT_TYPES, TYPES } from '../shared';
import { Page } from '../ui';

const SAMPLE = {
  date: '2027-06-12', time: '16:30', venueName: 'The Rose Garden', address: 'Charleston, South Carolina', personalMessage: '', accent: '',
};
const PREVIEWS: CardData[] = [
  { ...SAMPLE, coupleNames: ['Maya', ''], theme: 'balloons', type: 'birthday', details: { age: '40' } },
  { ...SAMPLE, coupleNames: ['Grace', 'Michael'], theme: 'garden' },
  { ...SAMPLE, coupleNames: ['Jordan Lee', ''], theme: 'gradcap', type: 'graduation', details: { classYear: '2027' } },
];

const FAQ: [string, string][] = [
  ['What can I make invitations for?', 'Weddings, birthdays, graduations, baby and bridal showers, engagement parties, anniversaries, quinceañeras and sweet 16s, bar and bat mitzvahs, retirements, housewarmings, holiday parties, business events, reunions, or anything else you are celebrating.'],
  ['Is it free?', 'Yes. Making the invitation, sending it and keeping track of who is coming are all free.'],
  ['Do guests need an account?', "No. Each guest gets their own link. They open it, see the invitation, and tap Yes or No. That's it."],
  ['How do the invitations get sent?', 'From your own phone or email. Tap Text next to a guest and your phone opens a message with their invitation link already written. Because it comes from you, people know it is real.'],
  ['What does RSVP mean?', 'It is the reply to an invitation: whether someone is coming and how many people they are bringing. Your guests answer on their invitation and you see every answer on your guest list.'],
  ['Can I add more than one photo?', 'Yes, up to 8. We arrange them on the card for you and keep faces in view. Guests can also swipe through them full size.'],
  ['Can I change the design myself?', 'Yes, if you want to. Tap anything on the card to move it, resize it or change its words, colors and fonts, or add stickers. One button puts everything back the way the design had it.'],
  ['Can guests change their answer?', 'Yes, any time before the event, using the same link.'],
  ['Who can see my guest list?', 'Only you. Guests see the invitation and their own answer, never anyone else on the list.'],
];

export default function InvitesLanding() {
  useEffect(() => { loadThemeFonts(['balloons', 'garden', 'gradcap']); }, []);
  const start = '/invites/new';

  return (
    <Page title="Free Invitations with RSVP for Any Celebration | Kenji Invites" noindex={false}>
      <Helmet>
        <meta name="description" content="Make a beautiful invitation for a wedding, birthday, graduation, shower, holiday party or any celebration. Add your photos, send it by text or email, and see who's coming. Free." />
        <meta property="og:title" content="Kenji Invites: free invitations with RSVP for any celebration" />
        <meta property="og:description" content="Make a beautiful invitation for a wedding, birthday, graduation, shower, holiday party or any celebration. Add your photos, send it by text or email, and see who's coming. Free." />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Kenji Invites', url: 'https://kenjiai.com/invites',
          applicationCategory: 'LifestyleApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          description: "Make a beautiful invitation for a wedding, birthday, graduation, shower, holiday party or any celebration. Add your photos, send it by text or email, and see who's coming. Free.",
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
        })}</script>
      </Helmet>
      <div>
        <section className="kv-hero">
          <div className="kv-wrap kv-hero-in">
            <div className="kv-hero-copy">
              <h1>Invitations your whole family can open</h1>
              <p className="kv-lead">Weddings, birthdays, graduations, showers, holiday parties and more. Make a beautiful invitation with your own photos, send it by text or email, and see who's coming. Free.</p>
              <div className="kv-btn-row" style={{ marginTop: 28 }}>
                <Link to={start} className="kv-btn kv-btn--primary kv-btn--big" data-testid="landing-start">Make my invitation</Link>
                {getToken() && <Link to="/invites/dashboard" className="kv-btn kv-btn--secondary kv-btn--big">My invitations</Link>}
              </div>
              <p className="kv-muted" style={{ marginTop: 14 }}>No account, no password. Already started one? <Link to="/invites/dashboard">See my invitations</Link>.</p>
            </div>
            <div className="kv-hero-cards" aria-label="Three of the designs">
              {PREVIEWS.map((d, i) => (
                <div key={d.theme} className={`kv-hero-card kv-hero-card--${i}`}>
                  <InvitationCard data={d} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="kv-wrap" aria-labelledby="kv-kinds" style={{ paddingBottom: 0 }}>
          <h2 id="kv-kinds" style={{ marginBottom: 16 }}>For every celebration</h2>
          <ul className="kv-kinds">
            {EVENT_TYPES.filter((t) => t !== 'custom').map((t) => <li key={t}>{TYPES[t].label}</li>)}
            <li>Anything else</li>
          </ul>
        </section>

        <section className="kv-wrap" aria-labelledby="kv-how">
          <h2 id="kv-how" style={{ marginBottom: 24 }}>How it works</h2>
          <ol className="kv-steps">
            <li><h3>Tell us what you're celebrating</h3><p className="kv-muted">Pick the occasion, then add the names, date and place. Big boxes, one question at a time. Everything saves as you go.</p></li>
            <li><h3>Pick a design and add your photos</h3><p className="kv-muted">Designs made for each kind of event. Add up to 8 photos and we arrange them on the card. Move, resize or reword anything if you like, then add your guests.</p></li>
            <li><h3>Send it, then watch the answers come in</h3><p className="kv-muted">Text or email each guest their own link from your phone. Your guest list shows who opened it and who's coming.</p></li>
          </ol>
        </section>

        <section className="kv-wrap" aria-labelledby="kv-faq" style={{ paddingTop: 0 }}>
          <h2 id="kv-faq" style={{ marginBottom: 18 }}>Questions</h2>
          <div className="kv-faq">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
          <div style={{ marginTop: 36 }}>
            <Link to={start} className="kv-btn kv-btn--primary kv-btn--big">Make my invitation</Link>
          </div>
          <p className="kv-muted" style={{ marginTop: 40, fontSize: 17 }}>Lost your invitations? <Link to="/invites/find">Here's how to find your private link</Link>.</p>
          <p className="kv-muted" style={{ marginTop: 8, fontSize: 17 }}>Kenji Invites is a free tool from <Link to="/">KenjiAI</Link>.</p>
        </section>
      </div>
    </Page>
  );
}
