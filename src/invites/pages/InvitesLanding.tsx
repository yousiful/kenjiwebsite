import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import InvitationCard, { type CardData } from '../InvitationCard';
import { loadThemeFonts } from '../format';
import { getToken } from '../api';
import { Page } from '../ui';

const SAMPLE = {
  date: '2027-06-12', time: '16:30', venueName: 'The Rose Garden', address: 'Charleston, South Carolina', personalMessage: '', accent: '',
};
const PREVIEWS: CardData[] = [
  { ...SAMPLE, coupleNames: ['Amelia', 'Daniel'], theme: 'ivory' },
  { ...SAMPLE, coupleNames: ['Grace', 'Michael'], theme: 'garden' },
  { ...SAMPLE, coupleNames: ['Sofia', 'James'], theme: 'midnight' },
];

const FAQ: [string, string][] = [
  ['Is it free?', 'Yes. Making the invitation, sending it and keeping track of who is coming are all free.'],
  ['Do guests need an account?', "No. Each guest gets their own link. They open it, see the invitation, and tap Yes or No. That's it."],
  ['How do the invitations get sent?', 'From your own phone or email. Tap Text next to a guest and your phone opens a message with their invitation link already written. Because it comes from you, people know it is real.'],
  ['What does RSVP mean?', 'It is the reply to an invitation: whether someone is coming and how many people they are bringing. Your guests answer on their invitation and you see every answer on your guest list.'],
  ['Can guests change their answer?', 'Yes, any time before the wedding, using the same link.'],
  ['Who can see my guest list?', 'Only you. Guests see the invitation and their own answer, never anyone else on the list.'],
];

export default function InvitesLanding() {
  useEffect(() => { loadThemeFonts(['ivory', 'garden', 'midnight']); }, []);
  const start = '/invites/new';

  return (
    <Page title="Free Wedding Invitations with RSVP | Kenji Invites" noindex={false}>
      <Helmet>
        <meta name="description" content="Make a beautiful wedding invitation, send it by text or email, and see who's coming. Free, with no account needed for guests." />
        <meta property="og:title" content="Kenji Invites: free wedding invitations with RSVP" />
        <meta property="og:description" content="Make a beautiful wedding invitation, send it by text or email, and see who's coming. Free." />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Kenji Invites', url: 'https://kenjiai.com/invites',
          applicationCategory: 'LifestyleApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          description: "Make a beautiful wedding invitation, send it by text or email, and see who's coming.",
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
              <h1>Wedding invitations your whole family can open</h1>
              <p className="kv-lead">Make a beautiful wedding invitation, send it by text or email, and see who's coming. Free.</p>
              <div className="kv-btn-row" style={{ marginTop: 28 }}>
                <Link to={start} className="kv-btn kv-btn--primary kv-btn--big" data-testid="landing-start">Make my invitation</Link>
                {getToken() && <Link to="/invites/dashboard" className="kv-btn kv-btn--secondary kv-btn--big">My invitations</Link>}
              </div>
              <p className="kv-muted" style={{ marginTop: 14 }}>No account, no password. Already started one? <Link to="/invites/dashboard">See my invitations</Link>.</p>
            </div>
            <div className="kv-hero-cards" aria-label="Three of the eight designs">
              {PREVIEWS.map((d, i) => (
                <div key={d.theme} className={`kv-hero-card kv-hero-card--${i}`}>
                  <InvitationCard data={d} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="kv-wrap" aria-labelledby="kv-how">
          <h2 id="kv-how" style={{ marginBottom: 24 }}>How it works</h2>
          <ol className="kv-steps">
            <li><h3>Add your names, date and place</h3><p className="kv-muted">Big boxes, one question at a time. Everything saves as you go.</p></li>
            <li><h3>Pick a design and add your guests</h3><p className="kv-muted">Eight designs, a spot for your photo, and a list of who's invited and how many people each can bring.</p></li>
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
          <p className="kv-muted" style={{ marginTop: 40, fontSize: 17 }}>Lost your invitations? <Link to="/invites/find">Get your private link by text</Link>.</p>
          <p className="kv-muted" style={{ marginTop: 8, fontSize: 17 }}>Kenji Invites is a free tool from <Link to="/">KenjiAI</Link>.</p>
        </section>
      </div>
    </Page>
  );
}
