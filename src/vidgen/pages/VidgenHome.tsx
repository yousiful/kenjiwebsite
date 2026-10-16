import { Shell, useMe } from '../ui';
import Landing from '../Landing';
import Studio from '../Studio';

function Body() {
  const { me, loading } = useMe();
  if (loading) return <main className="vg-wrap"><p className="vg-loading" role="status">Loading...</p></main>;
  return me?.user ? <Studio /> : <Landing />;
}

export default function VidgenHome() {
  return (
    <Shell
      title="Kenji Studio: AI Video for Ads, VSLs and Lessons | KenjiAI"
      description="Pick what you are making, answer a few plain questions, and Kenji Studio writes the prompt and renders the video. Ads, VSL scenes, lessons, product walkthroughs and film scenes."
      index
    >
      <Body />
    </Shell>
  );
}
