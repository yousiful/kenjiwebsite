import { useParams } from 'react-router-dom';
import InvitePage from './InvitePage';

/** /i/:code inside the main app (direct visits are served by invite.html instead). */
export default function InviteRoute() {
  const { code = '' } = useParams();
  return <InvitePage code={code} />;
}
