const CACHE_PREFIX = "pwa-games-";
const CACHE_NAME = CACHE_PREFIX + "397d6e434e62";

/* Prefiksy cache, które ten SW ma prawo usuwać: aktualny + historyczne nazwy.
   Filtrowanie po prefiksie (zamiast "wszystko !== CACHE_NAME") pozwala trzymać
   obok inne cache, np. runtime, bez kasowania ich przy każdej aktywacji. */
const OWNED_CACHE_PREFIXES = ["pwa-games-","shape-master-"];

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
  "./js/games/tic-tac-toe/game.min.js",
  "./js/games/shikaku/index.html",
  "./js/games/shikaku/game.min.js",
  "./js/games/battleships/index.html",
  "./js/games/battleships/game.min.js"
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
        const isOurs = OWNED_CACHE_PREFIXES.some(prefix => key.startsWith(prefix));
        if (isOurs && key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Awaryjny index.html podstawiamy tylko dla nawigacji — dla obrazka czy skryptu
// zwrócenie strony HTML byłoby błędem trudnym do zdiagnozowania.
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cacheRes =>
      cacheRes || fetch(event.request).catch(() =>
        event.request.mode === "navigate" ? caches.match("./index.html") : Response.error())
    )
  );
});
