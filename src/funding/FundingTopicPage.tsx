// Route element for /funding/<slug>: <FundingTopicPage slug="sba-loans" />
import { FinderView } from './FundingFinder';
import { topicBySlug } from './topics';

export default function FundingTopicPage({ slug }: { slug: string }) {
  const topic = topicBySlug(slug);
  if (!topic) return null;
  return <FinderView topic={topic} />;
}
