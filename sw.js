const CACHE_NAME = 'asystent-zawiesi-v2';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .catch((err) => console.error('[Service Worker] Błąd przy cachowaniu zasobów podczas instalacji:', err))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Ignoruj żądania inne niż GET (np. POST do Google Sheets)
  if (event.request.method !== 'GET') {
    return;
  }

  // Dla nawigacji do podstron lub katalogu obsługujemy przez index.html
  if (event.request.mode === 'navigate' || event.request.url.endsWith('/')) {
    event.respondWith(
      caches.match('./index.html').then((response) => {
        return response || fetch(event.request).catch(() => console.error('Błąd fetch dla nawigacji'));
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          // Zapisuj do cache tylko poprawne odpowiedzi
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }
          let responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return fetchResponse;
        }).catch((err) => {
          console.error('[Service Worker] Fetch failed:', event.request.url, err);
        });
      })
  );
});
