const cacheName = "static"

self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(cacheName).then( cache => {
        return cache.addAll([
          './', 
          './index.js',
          './manifest.webmanifest',
          './styles.css',
          './icons/icon-192x192.png',
          './icons/icon-512x512.png',
        ]);
      })
    );
    console.log('Install');
    self.skipWaiting();
  });

  self.addEventListener('activate', (e) =>{
      console.log("[ServiceWorker] Activated")
      e.waitUntil(
          caches.keys().then((cacheNames)=>{
              return Promise.all(cacheNames.map(function(thisCacheName){
                  if (thisCacheName !== cacheName){

                  }
              }))
          })
      )
  })
// if(event.request.url.includes('/api/')){
    //     event.respondWith(
    //         caches.open(cacheName).then(cache =>{
    //             return fetch(event.request)
    //             .then(response => {
    //                 if(response.status == 200){
    //                     cache.put(event.request.url)
    //                 }
    //             })
    //         })
    //     )
    // }
self.addEventListener('fetch', event => {

    
    event.respondWith(
        
      caches.match(event.request).then( response => {
          if(event.request.url.startsWith('https://')){
              return
           }
          if( response ){
        return response } 
        let requestClone = event.request.clone();
        
        fetch(requestClone)
        .then((response)=>{
            if (!response){
                console.log("[serviceWorker] No response from fetch")
                return response;
            }
            var responseClone = response.clone()

            caches.open(cacheName).then( cache => {
                cache.put(event.request, responseClone)
            })  
            return response
        
      })
      .catch((err) =>{
          console.log("[ServiceWorker] error logging fetch data")
      })
      })
    )
})
// self.addEventListener('fetch', (event) => {
//     if (event.request.url.startsWith(self.location.origin)) {
//       event.respondWith(
//         caches.match(event.request).then((cachedResponse) => {
//           if (cachedResponse) {
//             return cachedResponse;
//           }
  
//           return caches.open(RUNTIME).then((cache) => {
//             return fetch(event.request).then((response) => {
//               return cache.put(event.request, response.clone()).then(() => {
//                 return response;
//               });
//             });
//           });
//         })
//       );
//     }
//   });