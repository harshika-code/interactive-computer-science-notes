// Offline support: caches the notes page so it opens without internet.
const CACHE = 'study-notes-v1';
const PAGE = 'Blockchain_Interactive_Study.html';

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.add(new URL(PAGE, self.registration.scope))));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(event.request, copy));
      return res;
    })).catch(() => caches.match(new URL(PAGE, self.registration.scope)))
  );
});
