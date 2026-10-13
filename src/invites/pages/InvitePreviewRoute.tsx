import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, type PublicEvent } from '../api';
import { useRequireAuth } from '../ui';
import InvitePage from './InvitePage';

/** /invites/e/:id/preview: the host sees the guest page without needing a guest link. */
export default function InvitePreviewRoute() {
  const ok = useRequireAuth();
  const { id = '' } = useParams();
  const [ev, setEv] = useState<PublicEvent | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!ok) return;
    api.event(id).then((r) => setEv(r.event)).catch((e) => setError(e.message));
  }, [ok, id]);
  if (error) return <div className="kv-wrap"><p role="alert">{error}</p></div>;
  if (!ev) return null;
  return <InvitePage previewEvent={ev} />;
}
