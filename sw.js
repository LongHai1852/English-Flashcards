const CACHE_NAME = 'vocab-app-v2';
const ASSETS = [
    './',
    './index.html',
    './app.js',
    './style.css',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// Install event: Cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        // Mở một kho lưu trữ cache tên là 'vocab-app-v1'
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching all: app shell and content');
            // Tải và lưu các file này vào bộ nhớ cache NGAY LẬP TỨC
            return cache.addAll(ASSETS);
        })
    );
});

// Fetch event: Serve from cache if offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});
