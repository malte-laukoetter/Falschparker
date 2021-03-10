

workbox.core.setCacheNameDetails({ prefix: "@lergin/hh-report-frontend" });

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute("/");

workbox.routing.registerRoute(/^https:\/\/storage\.googleapis\.com\/.*thumb/, workbox.strategies.staleWhileRevalidate({ "cacheName": "falschparker-image-thumb-cache", "fetchOptions": { "mode": "no-cors" }, "matchOptions": { "ignoreSearch": true }, plugins: [new workbox.expiration.Plugin({ "maxEntries": 1000, "purgeOnQuotaError": true })] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/storage\.googleapis\.com\/'/, workbox.strategies.staleWhileRevalidate({ "cacheName": "falschparker-image-cache", "fetchOptions": { "mode": "no-cors" }, "matchOptions": { "ignoreSearch": true }, plugins: [new workbox.expiration.Plugin({ "maxEntries": 50, "purgeOnQuotaError": true })] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/stamen-tiles-[abcd]\.a\.ssl\.fastly\.net|^https:\/\/[abcd]\.basemaps\.cartocdn\.com|^http:\/\/[abc]\.tile\.osm\.org/, workbox.strategies.staleWhileRevalidate({ "cacheName": "falschparker-maptiles-cache", "fetchOptions": { "mode": "no-cors" }, "matchOptions": { "ignoreSearch": true }, plugins: [new workbox.expiration.Plugin({ "maxEntries": 500, "maxAgeSeconds": 604800, "purgeOnQuotaError": true })] }), 'GET');

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'POST') return;
  if (event.request.url.includes('share/image/') === false) return;

  /* This is to fix the issue Jake found */
  event.respondWith(Response.redirect('/'));

  event.waitUntil(async function () {
    const data = await event.request.formData();
    const client = await self.clients.get(event.resultingClientId || event.clientId);
    // Get the data from the named element 'file'
    const files = data.getAll('file');

    for (let file of files) {
      console.log("file", file);
      client.postMessage({ file, action: "load-image" });
    }
  }());
});