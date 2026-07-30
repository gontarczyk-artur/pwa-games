const CACHE_NAME = "shape-master-20260730100524";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/bootstrap.min.css",
  "./css/theme.min.css",
  "./fonts/fonts.css",
  "./fonts/inter-latin.woff2",
  "./fonts/inter-latin-ext.woff2",
  "./fonts/space-grotesk-latin.woff2",
  "./fonts/space-grotesk-latin-ext.woff2",
  "./js/bootstrap.bundle.min.js",
  "./js/game-picker.min.js",
  "./js/games/shape-master/index.html",
  "./js/games/shape-master/game.min.js",
  "./js/games/tic-tac-toe/index.html",
  "./js/games/tic-tac-toe/game.min.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cacheRes =>
      cacheRes || fetch(event.request).catch(() => caches.match("./index.html"))
    )
  );
});
