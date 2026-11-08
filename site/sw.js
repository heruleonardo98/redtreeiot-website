// RedTree IoT · service worker: fast repeat visits and an offline fallback.
// Pages, CSS and JS are network-first (always fresh when online, cached copy offline),
// so a new deploy never mixes new HTML with old scripts; photos, icons and fonts are cache-first.
// Bump VERSION when the precache list changes.
const VERSION = 'rt-v3';
const CORE = `${VERSION}-core`;
const RUNTIME = `${VERSION}-runtime`;
const PRECACHE = [
  '/', '/offline.html', '/styles.css', '/pages.css', '/script.js', '/estate.js', '/pages.js',
  '/i18n-en.js', '/wa-float.js', '/favicon.svg', '/icons/icon-192.png',
];
const MAX_RUNTIME = 60;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CORE);
    await cache.addAll(PRECACHE);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

/** Keep the runtime cache from growing without limit (oldest entries go first). */
const trim = async () => {
  const cache = await caches.open(RUNTIME);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(keys.length - MAX_RUNTIME, 0)).map((k) => cache.delete(k)));
};

/** @param {Request} request */
const networkFirst = async (request) => {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME);
      await cache.put(request, response.clone());
      trim();
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return request.mode === 'navigate' ? caches.match('/offline.html') : Response.error();
  }
};

/** @param {Request} request */
const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok || response.type === 'opaque') {
    await (await caches.open(RUNTIME)).put(request, response.clone());
    trim();
  }
  return response;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const fonts = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin !== self.location.origin && !fonts) return; // WhatsApp, maps, social: straight to network

  if (fonts || /\.(?:jpg|jpeg|png|webp|svg|ico)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
  } else if (request.mode === 'navigate' || /\.(?:css|js|webmanifest)$/.test(url.pathname)) {
    event.respondWith(networkFirst(request));
  }
});
