/**
 * Meta (Facebook) Tracking Configuration
 *
 * Server-side CAPI calls live in netlify/functions/meta-capi.ts and read the
 * access token from process.env.META_CAPI_TOKEN. The token MUST NOT appear
 * in any client-bundled config — anything imported here is shipped to browsers.
 *
 * To send a CAPI event from the client, POST to /.netlify/functions/meta-capi.
 */

export const META_CONFIG = {
  pixelId: import.meta.env.VITE_META_PIXEL_ID || '2406747486323295',
  capiEndpoint: '/.netlify/functions/meta-capi',
};

export const isTrackingEnabled = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('kenji_tracking_consent') === 'granted';
};
