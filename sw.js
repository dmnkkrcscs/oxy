const APP_CACHE = 'oxy-app-v5';
const AUDIO_CACHE = 'oxy-audio-v1';

const APP_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.svg',
  './logo.svg',
  './css/main.css',
  './css/variables.css',
  './css/base.css',
  './css/layout.css',
  './css/cards.css',
  './css/player.css',
  './css/animations.css',
  './css/modal.css',
  './css/settings.css',
  './css/utilities.css',
  './js/main.js',
  './js/state.js',
  './js/constants.js',
  './js/router.js',
  './js/data/exercise-loader.js',
  './js/ui/home.js',
  './js/ui/card.js',
  './js/ui/player.js',
  './js/ui/settings.js',
  './js/ui/modal.js',
  './js/ui/favorites.js',
  './js/engine/exercise-engine.js',
  './js/engine/phase-manager.js',
  './js/engine/countdown.js',
  './js/audio/audio-context.js',
  './js/audio/ambient.js',
  './js/audio/chime.js',
  './js/audio/voice.js',
  './js/animations/animation-factory.js',
  './js/animations/circle.js',
  './js/animations/wave.js',
  './js/animations/particle.js',
  './js/animations/box.js',
  './js/animations/nose.js',
  './js/animations/hum.js',
  './js/animations/body.js',
  './js/animations/runner.js',
  './js/animations/lotus.js',
  './js/utils/dom.js',
  './js/utils/format.js',
  './js/utils/storage.js',
  './js/utils/cleanup.js',
  './data/exercises.json',
  './data/meditations.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(APP_CACHE).then(c => c.addAll(APP_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== APP_CACHE && k !== AUDIO_CACHE)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Audio files: cache-first with separate cache
  if (url.pathname.includes('/audio/')) {
    e.respondWith(
      caches.open(AUDIO_CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(resp => {
            if (resp.ok) cache.put(e.request, resp.clone());
            return resp;
          }).catch(() => new Response('', { status: 503 }));
        })
      )
    );
    return;
  }

  // App assets: stale-while-revalidate
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(resp => {
        if (resp.ok) {
          caches.open(APP_CACHE).then(c => c.put(e.request, resp.clone()));
        }
        return resp;
      }).catch(() => cached || new Response('Offline', { status: 503 }));

      return cached || fetchPromise;
    })
  );
});
