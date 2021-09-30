const cacheName = "college iv2";

self.addEventListener("install", function(event) {
    event.waitUntill(
        caches.open(cacheName).then(function (cache) {
            cache.addAll([
                "./",
                
                // manifest n' service worker (index.js)
                // js n' ajax
                // css
                // web pages
                // includes
                
            ])
        })
    )
    return self.skipWaiting();
})

self.addEventListener("activate", () => {
    self.client.claim();
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
    .then(function (response) {
      // Cache hit - return response
      if (response) { return response; }
      return fetch(event.request);
    })
  );
}); 

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);

    return cached || fetch(req);
}

async function networkAndCache(req) {
    const cache = await caches.open(cacheName)
    try {
        const refresh = await fetch(req);
        await cache.put(req, refresh.clone());
        return refresh;
    }
    catch(e) {
        const cached = await cache.match(req);
        return cached;
    }
}