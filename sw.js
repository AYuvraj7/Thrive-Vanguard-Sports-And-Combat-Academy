// Thrive Vanguard Academy - Service Worker v3
const CACHE = 'tv-cache-v3';

// Only cache essential files that definitely exist
const CORE_ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  console.log('[SW] Installing...');
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      // Add core assets, ignore failures
      return Promise.allSettled(
        CORE_ASSETS.map(url => cache.add(url).catch(err => console.log('[SW] Skip:', url)))
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  console.log('[SW] Activating...');
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => {
          console.log('[SW] Deleting old cache:', k);
          return caches.delete(k);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Skip non-GET, chrome-extension, Firebase, Cloudinary requests
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  if (url.includes('firebaseapp.com') || 
      url.includes('googleapis.com') || 
      url.includes('cloudinary.com') ||
      url.includes('chrome-extension') ||
      url.includes('gstatic.com')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      // Return cached version if available
      if (cached) return cached;
      
      // Otherwise fetch from network
      return fetch(e.request).then(response => {
        // Only cache successful HTML/CSS/JS/image responses
        if (!response || response.status !== 200) return response;
        
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/html') || 
            contentType.includes('text/css') || 
            contentType.includes('javascript') ||
            contentType.includes('image/')) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback - return cached index.html
        if (e.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
