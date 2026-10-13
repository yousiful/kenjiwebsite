import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import InvitePage from './pages/InvitePage';

// Standalone entry for guest invitations (/i/:code -> invite.html via _redirects).
// Keeps the guest page small: no router, no site chrome, no tracking scripts.
const code = (window.location.pathname.match(/^\/i\/([A-Za-z0-9_-]{12,32})/) || [])[1] || '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InvitePage code={code} />
  </StrictMode>
);
