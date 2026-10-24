/* Vaquero launch page: keep the page and icons on the phone so the Home Screen icon opens instantly,
   even on a weak signal. Serves the saved copy first and refreshes it in the background. (24/10/2026) */
const CACHE = 'vq-launch-v1';
const CORE = ['./', './index.html', './manifest.json', './apple-touch-icon.png', './theme.css'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  const key = r.mode === 'navigate' ? './' : r;
  e.respondWith(caches.open(CACHE).then(c => c.match(key, { ignoreSearch: true }).then(hit => {
    const net = fetch(r).then(res => { if (res && res.ok) c.put(key, res.clone()); return res; }).catch(() => hit);
    if (hit) { e.waitUntil(net); return hit; }
    return net;
  })));
});
