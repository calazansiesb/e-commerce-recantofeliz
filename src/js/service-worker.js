// js/service-worker.js
const CACHE_NAME = 'recanto-feliz-v1';
const urlsToCache = [
    '/',
    '/css/estilos.css', // Assuming this is your main stylesheet
    '/js/scripts.js',
    // Add other critical assets here
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});