const CACHE_NAME = 'asystent-zawiesi-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching App Shell');
        return Promise.all(
          ASSETS_TO_CACHE.map(url => {
            return cache.add(url).catch(error => {
              console.error('[Service Worker] Failed to cache:', url, error);
            });
          })
        );
      })
  );
});

self.addEventListener('fetch', (event) => {
  let request = event.request;
  
  // If the request is for a directory (e.g. Github Pages root), serve index.html
  if (request.mode === 'navigate' || request.url.endsWith('/')) {
    request = new Request('./index.html');
  }

  event.respondWith(
    caches.match(request)
      .then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      }).catch(() => {
        // Fallback for offline if fetch fails and not in cache
        console.error('[Service Worker] Fetch failed for:', event.request.url);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
