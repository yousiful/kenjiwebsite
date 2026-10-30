import { Shell, useMe } from '../ui';
import LandingInfo, { FAQ } from '../Landing';
import Studio from '../Studio';
import PageSchema from '../../components/PageSchema';
import { faqPage, absoluteUrl, orgRef } from '../../lib/schema';
import { PLANS, PLAN_IDS } from '../models';

const PATH = '/video-generation';
const DESCRIPTION = 'Try it free, no card. Describe the video in one sentence and Kenji Studio picks the size, writes the prompt and renders it. Your first video is free.';

const studioApp = {
  '@type': 'WebApplication',
  '@id': `${absoluteUrl(PATH)}#app`,
  name: 'Kenji Studio',
  url: absoluteUrl(PATH),
  description: 'AI video generator for ads, VSL b-roll, course visuals and product walkthroughs. Describe the video in one sentence and it writes the prompt and renders it.',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  publisher: orgRef,
  offers: [
    { '@type': 'Offer', name: 'Free trial video', price: '0', priceCurrency: 'USD' },
    ...PLAN_IDS.map((id) => ({
      '@type': 'Offer',
      name: `${PLANS[id].name} plan, ${PLANS[id].credits} credits a month`,
      price: String(PLANS[id].usd),
      priceCurrency: 'USD',
    })),
  ],
};

/** Everyone lands straight in the studio. Signed-out visitors also get how it works, plans and questions below it. */
function Body() {
  const { me, loading } = useMe();
  if (loading) return <main className="vg-wrap"><p className="vg-loading" role="status">Loading...</p></main>;
  return (
    <>
      <Studio />
      {!me?.user && <LandingInfo />}
    </>
  );
}

export default function VidgenHome() {
  return (
    <Shell
      title="Kenji Studio: AI Video for Ads, VSLs and Lessons | KenjiAI"
      description={DESCRIPTION}
      index
    >
      <PageSchema
        path={PATH}
        name="Kenji Studio: AI Video for Ads, VSLs and Lessons"
        description={DESCRIPTION}
        extra={[studioApp, faqPage(PATH, FAQ.map(([q, a]) => ({ q, a })))]}
      />
      <Body />
    </Shell>
  );
}
