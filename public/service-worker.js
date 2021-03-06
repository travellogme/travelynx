const CACHE_NAME = 'static-cache-v34';
const FILES_TO_CACHE = [
  '/favicon.ico',
  '/offline.html',
  '/static/v34/css/light.min.css',
  '/static/v34/css/dark.min.css',
  '/static/v34/css/material-icons.css',
  '/static/v34/css/local.css',
  '/static/v34/fonts/MaterialIcons-Regular.woff2',
  '/static/v34/fonts/MaterialIcons-Regular.woff',
  '/static/v34/fonts/MaterialIcons-Regular.ttf',
  '/static/v34/js/jquery-3.4.1.min.js',
  '/static/v34/js/materialize.min.js',
  '/static/v34/js/travelynx-actions.min.js',
  '/static/v34/js/autocomplete.min.js',
  '/static/v34/js/geolocation.min.js',
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  if (evt.request.mode !== 'navigate') {
    return;
  }
  evt.respondWith(
    fetch(evt.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
              .then((cache) => {
                return cache.match('offline.html');
              });
        })
  );
});
