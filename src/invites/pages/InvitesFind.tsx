import { Link } from 'react-router-dom';
import { Page } from '../ui';

/** /invites/find: plain help for a host who lost their private link. */
export default function InvitesFind() {
  return (
    <Page title="Lost your link? | Kenji Invites">
      <div className="kv-wrap">
        <div className="kv-narrow kv-card" style={{ padding: 'clamp(22px, 5vw, 40px)' }} data-testid="find-help">
          <h1 style={{ marginBottom: 14 }}>Lost your link?</h1>
          <p style={{ marginBottom: 14 }}>
            Check your texts or email for the message you sent yourself titled <strong>Kenji Invites</strong>. It has your private link in it.
            Open that link on this phone or computer and your invitations will be right here.
          </p>
          <p style={{ marginBottom: 14 }}>
            Planning with someone? Ask your co-host to send you a co-host link from their guest list page (the "Add a co-host" button).
          </p>
          <p className="kv-muted" style={{ marginBottom: 24 }}>
            Tip: search your messages for "Kenji Invites".
          </p>
          <div className="kv-btn-row">
            <Link to="/invites/dashboard" className="kv-btn kv-btn--primary">My invitations</Link>
            <Link to="/invites" className="kv-btn kv-btn--secondary">Back to Kenji Invites</Link>
          </div>
        </div>
      </div>
    </Page>
  );
}
