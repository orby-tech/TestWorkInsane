const staticCacheName = 'static-cache-v0';
const dynamicCacheName = 'dynamic-cache-v0';

const staticAssets = [
  './',
  './index.html',
  './images/icons/icon-128x128.png',
  './images/icons/icon-192x192.png',
  './offline.html',
  './css/todo.css',
  './js/app.mjs',
  './js/displayList.mjs',
  './js/dragNDropManager.mjs',
  './js/eventListeners.mjs',
  './js/initApp.mjs',
  './js/fileSystem.mjs',
  './js/filterForList.mjs',
  './js/variables.mjs',
  './images/no-image.jpg',
];

async function checkOnline(req) {
  const cache = await caches.open(dynamicCacheName);
  try {
    const res = await fetch(req);
    await cache.put(req, res.clone());
    return res;
  } catch (error) {
    const cachedRes = await cache.match(req);
    if (cachedRes) {
      return cachedRes;
    } if (req.url.indexOf('.html') !== -1) {
      return caches.match('./offline.html');
    }
    return caches.match('./images/no-image.jpg');
  }
}

async function checkCache(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || checkOnline(req);
}

self.addEventListener('install', async (event) => {
  const cache = await caches.open(staticCacheName);
  await cache.addAll(staticAssets);
  console.log('Service worker has been installed');
});

self.addEventListener('activate', async (event) => {
  const cachesKeys = await caches.keys();
  const checkKeys = cachesKeys.map(async (key) => {
    if (![staticCacheName, dynamicCacheName].includes(key)) {
      await caches.delete(key);
    }
  });
  await Promise.all(checkKeys);
});

self.addEventListener('fetch', (event) => {
  event.respondWith(checkCache(event.request));
});
