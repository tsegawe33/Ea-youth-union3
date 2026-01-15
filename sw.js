const CACHE_NAME = 'ea-youth-union-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html', // የ HTML ፋይልህ ስም index.html ካልሆነ ቀይረው
  'https://fonts.googleapis.com/css2?family=Noto+Serif+Ethiopic:wght@400;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// መተግበሪያው ሲጫን ፋይሎችን በስልኩ ላይ ያከማቻል
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching essential assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// አሮጌ ፋይሎችን ማጽጃ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// ኢንተርኔት በሌለበት ጊዜ የተከማቹትን ፋይሎች ይጠቀማል
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        // አዳዲስ የሚመጡ ፋይሎችን (ለምሳሌ ምስሎች) ወደ ካሽ ይጨምራል
        return caches.open(CACHE_NAME).then((cache) => {
          if (event.request.url.startsWith('http')) {
             cache.put(event.request, fetchResponse.clone());
          }
          return fetchResponse;
        });
      });
    }).catch(() => {
        // ኢንተርኔትም ካሽም ከሌለ (Offline)
        console.log('Fetch failed; providing offline fallback.');
    })
  );
});
