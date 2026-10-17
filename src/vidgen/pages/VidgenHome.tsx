import { Shell, useMe } from '../ui';
import LandingInfo from '../Landing';
import Studio from '../Studio';

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
      description="Try it free, no card. Pick what you are making, answer a few plain questions, and Kenji Studio writes the prompt and renders the video. Your first video is free."
      index
    >
      <Body />
    </Shell>
  );
}
