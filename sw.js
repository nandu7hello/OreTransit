// Offline cache for OreTransit.
// Code files are network-first (so updates arrive as soon as you're online);
// maps, icons and fonts are cache-first (big and rarely change).
const CACHE = "oretransit-v6";
const PRECACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data.js",
  "./schedule.js",
  "./manifest.webmanifest",
  "./vendor/preact-standalone.module.js",
  "./fonts/fonts.css",
  "./fonts/DMSans-400.woff2",
  "./fonts/DMSerifDisplay-400.woff2",
  "./assets/all-routes-map.png",
  "./assets/gold-map.png",
  "./assets/tungsten-map.png",
  "./assets/silver-map.png",
  "./assets/ore-cart-logo.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function putInCache(request, response) {
  if (response && response.ok) {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(request, copy));
  }
  return response;
}

function networkFirst(request) {
  return fetch(request)
    .then((res) => putInCache(request, res))
    .catch(() => caches.match(request));
}

function cacheFirst(request) {
  return caches.match(request).then((hit) => hit || fetch(request).then((res) => putInCache(request, res)));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    const isStatic = /\.(png|jpg|jpeg|webp|svg|ico)$/i.test(url.pathname);
    event.respondWith(isStatic ? cacheFirst(request) : networkFirst(request));
    return;
  }

  if (url.hostname.endsWith("fonts.googleapis.com") || url.hostname.endsWith("fonts.gstatic.com")) {
    event.respondWith(cacheFirst(request));
  }
});
