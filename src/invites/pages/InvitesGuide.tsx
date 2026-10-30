// Guide-style landing pages for Kenji Invites: /invites/rsvp-website and
// /invites/evite-alternative. Prerendered to static HTML like the topic pages.
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageSchema from '../../components/PageSchema';
import InvitationCard, { type CardData } from '../InvitationCard';
import { loadThemeFonts } from '../format';
import { Page } from '../ui';
import { Faq, FreeList, HowItWorks, MoreLinks, SAMPLE_BASE } from './InvitesTopic';
import { GUIDES, type Guide } from '../seo/guides';
import '../seo/seo.css';

const HERO: CardData[] = [
  { ...SAMPLE_BASE, coupleNames: ['Maya', ''], theme: 'balloons', type: 'birthday', details: { age: '40' } },
  { ...SAMPLE_BASE, coupleNames: ['Grace', 'Michael'], theme: 'garden' },
  { ...SAMPLE_BASE, coupleNames: ['', ''], theme: 'winter', type: 'holiday', details: { eventName: 'Holiday Party', hostedBy: 'the Millers' } },
];

function Body({ g }: { g: Guide }) {
  return <>{g.sections.map((s) => (
    <section key={s.h} className="kv-wrap ks-sec" aria-label={s.h}>
      <div className="ks-prose">
        <h2>{s.h}</h2>
        {s.p.map((p, i) => <p key={i}>{p}</p>)}
        {s.list && <ul className="ks-list">{s.list.map((x) => <li key={x}>{x}</li>)}</ul>}
      </div>
      {s.table && (
        <div className="ks-table-wrap">
          <table className="ks-table">
            <thead><tr>{s.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
            <tbody>{s.table.rows.map((r) => <tr key={r[0]}>{r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}</tr>)}</tbody>
          </table>
          {s.table.note && <p className="kv-muted" style={{ fontSize: 15, marginTop: 8 }}>{s.table.note}</p>}
        </div>
      )}
    </section>
  ))}</>;
}

export default function InvitesGuide({ slug }: { slug: string }) {
  useEffect(() => { loadThemeFonts(['balloons', 'garden', 'winter']); }, []);
  const g = GUIDES.find((x) => x.slug === slug);
  if (!g) return null;
  const path = `/invites/${g.slug}`;
  return (
    <Page title={g.title} noindex={false}>
      <PageSchema
        path={path}
        name={g.h1}
        description={g.description}
        crumbs={[{ name: 'Home', path: '/' }, { name: 'Kenji Invites', path: '/invites' }, { name: g.crumb, path }]}
        extra={[
          { '@type': 'FAQPage', mainEntity: g.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
          { '@type': 'WebApplication', name: 'Kenji Invites', url: `https://kenjiai.com${path}`, applicationCategory: 'LifestyleApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
        ]}
      />
      <Helmet>
        <meta name="description" content={g.description} />
        <meta property="og:title" content={g.h1} />
        <meta property="og:description" content={g.description} />
        <meta property="og:image" content="https://kenjiai.com/invites-og.jpg" />
      </Helmet>

      <section className="kv-hero">
        <div className="kv-wrap kv-hero-in">
          <div className="kv-hero-copy">
            <nav className="ks-crumbs" aria-label="Breadcrumb"><Link to="/invites">Kenji Invites</Link> <span aria-hidden="true">/</span> {g.crumb}</nav>
            <h1>{g.h1}</h1>
            <p className="kv-lead">{g.lead}</p>
            <div className="kv-btn-row" style={{ marginTop: 28 }}>
              <Link to="/invites/new" className="kv-btn kv-btn--primary kv-btn--big" data-testid="guide-start">Make my invitation, free</Link>
            </div>
            <p className="kv-muted" style={{ marginTop: 14 }}>No account, no ads, nothing for guests to download.</p>
          </div>
          <div className="kv-hero-cards" aria-label="Sample invitations">
            {HERO.map((d, i) => <div key={d.theme} className={`kv-hero-card kv-hero-card--${i}`}><InvitationCard data={d} /></div>)}
          </div>
        </div>
      </section>

      <Body g={g} />
      <HowItWorks noun="party" />

      <section className="kv-wrap ks-sec" aria-labelledby="ks-free">
        <h2 id="ks-free">What free means here</h2>
        <FreeList />
      </section>

      <section className="kv-wrap ks-sec" aria-labelledby="ks-faq">
        <h2 id="ks-faq" style={{ marginBottom: 18 }}>Questions</h2>
        <Faq items={g.faq} />
        <div style={{ marginTop: 36 }}>
          <Link to="/invites/new" className="kv-btn kv-btn--primary kv-btn--big">Make my invitation, free</Link>
        </div>
      </section>

      <MoreLinks current={g.slug} related={g.related} />
    </Page>
  );
}
