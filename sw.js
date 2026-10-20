const CACHE = 'libresky-2026-10-20-calls';

const SHELL = [
  './',
  './index.html',
  './css/app.css',
  './js/app.js',
  './js/call.js',
  './js/api.js',
  './js/icons.js',
  './js/render.js',
  './js/session.js',
  './js/util.js',
  './js/vendor/auth.js',
  './manifest.webmanifest',
  './assets/icon.png',
  './assets/icon-512.png',
  './assets/icon.svg',
  './assets/banner.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .catch(() => undefined)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.search) return;
  if (url.pathname.endsWith('/sw.js')) return;

  event.respondWith((async () => {
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok && fresh.type === 'basic') {
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone());
      }
      return fresh;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      if (req.mode === 'navigate') {
        const home = await caches.match('./');
        if (home) return home;
      }
      throw err;
    }
  })());
});
