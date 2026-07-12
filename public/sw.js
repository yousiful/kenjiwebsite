const CACHE_NAME = 'kenjiai-v5-2026';
const OFFLINE_URL = '/offline.html';

const PRECACHE_URLS = [
  '/offline.html',
];

// Install: pre-cache the offline page immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: delete ONLY caches from older versions, not the current one
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: tiered strategy based on request type
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Pass through all cross-origin requests
  if (url.hostname !== self.location.hostname) return;

  // Pass through Supabase / API calls without caching
  if (
    url.pathname.includes('/rest/v1/') ||
    url.pathname.includes('/auth/v1/') ||
    url.pathname.includes('/functions/v1/')
  ) return;

  const isNavigation = event.request.mode === 'navigate';
  const isStaticAsset = /\.(js|css|woff2?|png|jpe?g|svg|ico|webp|gif)(\?.*)?$/.test(url.pathname);

  if (isNavigation) {
    // HTML pages: Network-first → cached page → offline fallback
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request).then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  if (isStaticAsset) {
    // JS/CSS/fonts/images: Cache-first → network → cache result
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
          }
          return response;
        });
      })
    );
  }
  // All other same-origin requests: pass through without SW intervention
});

// Message handler for manual cache control
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_ALL') {
    event.waitUntil(
      caches.keys()
        .then((names) => Promise.all(names.map((n) => caches.delete(n))))
        .then(() => self.registration.unregister())
    );
  }
});
