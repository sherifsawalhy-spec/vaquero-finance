/* Vaquero launch page: keep the page and icons on the phone so the Home Screen icon still opens
   on a weak signal. (24/10/2026; 25/10/2026: the page itself now loads fresh from the internet first,
   so changes show straight away; the saved copy is only used when there is no connection.) */
const CACHE = 'vq-launch-v2';
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
  const isPage = r.mode === 'navigate' || /\.(html|css|js)$/.test(new URL(r.url).pathname) || new URL(r.url).pathname.endsWith('/');
  const key = r.mode === 'navigate' ? './' : r.url.split('?')[0];
  if (isPage) {
    // Fresh first (no stale browser cache), saved copy when offline.
    e.respondWith(fetch(r.url, { cache: 'no-store' }).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(key, copy)); }
      return res;
    }).catch(() => caches.open(CACHE).then(c => c.match(key, { ignoreSearch: true }))));
    return;
  }
  e.respondWith(caches.open(CACHE).then(c => c.match(key, { ignoreSearch: true }).then(hit => hit || fetch(r).then(res => { if (res && res.ok) c.put(key, res.clone()); return res; }))));
});
