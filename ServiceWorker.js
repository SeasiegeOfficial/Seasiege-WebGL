const cacheName = "Leviaworks-Seasiege-1.0.8";
const contentToCache = [
    "Build/Web.loader.js",
    "Build/Web.framework.js",
    "Build/Web.data",
    "Build/Web.wasm",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    if (e.request.method !== 'GET') {
        return; 
    }

    const url = new URL(e.request.url);

    const blacklistedUrls = [
        'seasiege.com/version',
        'cdn-cgi/rum'
    ];

    if (blacklistedUrls.some(path => url.href.includes(path))) {
        console.log(`[Service Worker] Bypassing cache for: ${url.href}`);
        return;
    }

    e.respondWith((async function () {
        let response = await caches.match(e.request);
        if (response) { return response; }

        response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        
        if (response.status === 200) {
            cache.put(e.request, response.clone());
        }
        
        return response;
    })());
});
