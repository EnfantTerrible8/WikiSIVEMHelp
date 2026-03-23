
const CACHE = 'wikisiv-emhelp-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      if (resp) return resp;
      return fetch(event.request).then(networkResp => {
        const copy = networkResp.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return networkResp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
