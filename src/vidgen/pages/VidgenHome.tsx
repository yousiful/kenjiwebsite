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
      description="Try it free, no card. Describe the video in one sentence and Kenji Studio picks the size, writes the prompt and renders it. Your first video is free."
      index
    >
      <Body />
    </Shell>
  );
}
