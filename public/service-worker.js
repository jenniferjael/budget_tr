console.log("hello");

const FILES_TO_CACHE = [
    // main page
    // index.js
    // icons
    // manifest
      "/",
      "/index.html",
      "/index.js",
      "/manifest.json",
      "/styles.css"
    
    // likely models/transaction.js file
    // likely models/transaction.js file
    ]
    
    const CACHE_NAME = "static-cache-v2";
    const DATA_CACHE_NAME = "data-cache-v1";
    
    // install
    self.addEventListener("install", function(event) {
      event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
          console.log("Files cached...!");
          return cache.addAll(FILES_TO_CACHE);
        })
      );
      self.skipWaiting();
    })
    
    // activate
    self.addEventListener("activate", function(event) {
      event.waitUntil(
        caches.keys().then(keylist => {
          return Promise.all(
            keylist.map(key => {
              if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                console.log("Remove old cache data", key);
                return caches.delete(key);
              }
            })
          );
        })
      );
      self.clients.claim();
    });
    
    // fetch
    self.addEventListener("fetch", event => {
      if(event.request.url.includes('/api/')) {
          console.log('[Service Worker] Fetch(data)', event.request.url);
      
    event.respondWith(
                  caches.open(DATA_CACHE_NAME).then(cache => {
                  return fetch(event.request)
                  .then(response => {
                      if (response.status === 200){
                          cache.put(event.request.url, response.clone());
                      }
                      return response;
                  })
                  .catch(err => {
                      return cache.match(event.request);
                  });
              })
              );
              return;
          }
    
    event.respondWith(
      caches.open(CACHE_NAME).then( cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request);
        });
      })
    );
    });