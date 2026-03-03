const CACHE_NAME = "mailmind-cache-v2";
const APP_SHELL = ["/", "/index.html", "/manifest.webmanifest", "/favicon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // Never cache cross-origin requests (e.g., API).
  if (!isSameOrigin) {
    event.respondWith(fetch(event.request));
    return;
  }

  const isNavigate = event.request.mode === "navigate";
  const isAppShell = APP_SHELL.includes(url.pathname);
  const isStaticAsset = ["script", "style", "image", "font"].includes(event.request.destination);

  if (isNavigate) {
    // Network-first for pages so new deployments are picked up.
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/index.html", responseClone));
          return response;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  if (isAppShell || isStaticAsset) {
    // Stale-while-revalidate for app shell and static assets.
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((response) => {
            if (response && response.ok) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
            }
            return response;
          })
          .catch(() => null);
        return cached || fetchPromise || caches.match("/index.html");
      })
    );
    return;
  }

  // Default: pass through to network for same-origin requests.
  event.respondWith(fetch(event.request));
});
