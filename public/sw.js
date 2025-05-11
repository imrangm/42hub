
// Basic service worker

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // Perform install steps, like caching static assets
  // For now, just log and skip waiting to activate immediately
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // Perform activate steps, like cleaning up old caches
  // Claim clients to take control of pages immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // console.log('Service Worker: Fetching', event.request.url);
  // For now, just pass through network requests.
  // More complex caching strategies would go here.
  // Example: Cache First, Network First, Stale While Revalidate
  event.respondWith(fetch(event.request));
});
