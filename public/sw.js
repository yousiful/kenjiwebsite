const CACHE_NAME = 'kenjiai-v5-2026';
const STATIC_CACHE = 'kenjiai-static-v5-2026';
const FONT_CACHE = 'kenjiai-fonts-v5-2026';
const OFFLINE_URL = '/offline.html';

const PRECACHE_URLS = ['/offline.html'];

// Install: pre-cache offline page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: delete old caches
self.addEventListener('activate', (event) => {
  const CURRENT_CACHES = [CACHE_NAME, STATIC_CACHE, FONT_CACHE];
  event.waitUntil(
    caches.keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => !CURRENT_CACHES.includes(name))
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isStaticAsset(pathname) {
  return /\.(js|css|woff2?|png|jpe?g|svg|ico|webp|avif|gif)(\?.*)?$/.test(pathname);
}

function isFont(url) {
  return (
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('fonts.googleapis.com') ||
    /\.(woff2?|ttf|otf)(\?.*)?$/.test(url.pathname)
  );
}

function isApi(pathname) {
  return (
    pathname.includes('/rest/v1/') ||
    pathname.includes('/auth/v1/') ||
    pathname.includes('/functions/v1/')
  );
}

// Stale-while-revalidate: return cache immediately, update in background
function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then((cache) =>
    cache.match(request).then((cached) => {
      const networkFetch = fetch(request).then((response) => {
        if (response && response.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      });
      return cached || networkFetch;
    })
  );
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Always pass through API calls
  if (isApi(url.pathname)) return;

  // Font caching: cache-first, long TTL
  if (isFont(url)) {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        })
      )
    );
    return;
  }

  const isSameOrigin = url.hostname === self.location.hostname;
  const isNavigation = event.request.mode === 'navigate';
  const isAsset = isSameOrigin && isStaticAsset(url.pathname);

  if (isNavigation) {
    // HTML shell: network-first with offline fallback
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

  if (isAsset) {
    // Hashed static assets: cache-first (they never change with same URL)
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, response.clone()));
          }
          return response;
        });
      })
    );
    return;
  }

  // Pexels/external images: stale-while-revalidate
  if (url.hostname.includes('pexels.com') || url.hostname.includes('images.pexels.com')) {
    event.respondWith(staleWhileRevalidate(event.request, STATIC_CACHE));
    return;
  }

  // All other same-origin non-asset requests: network only
});

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
