/* ═══════════════════════════════════════════════════════════════
   김만민 건축사 — 대성건축사사무소  ·  Service Worker  v1.0
   ARCHITECT KIM MANMIN  |  amber #d4a843
   Cache-First (로컬) + Network-First (CDN)
   ═══════════════════════════════════════════════════════════════ */

const CACHE     = 'manmin-v1.0';
const CDN_CACHE = 'manmin-cdn-v1.0';
const OFFLINE   = './index.html';

const APP_SHELL = [
  './index.html', './manifest.json', './favicon.ico',
  './icons/icon-72x72.png',   './icons/icon-96x96.png',
  './icons/icon-128x128.png', './icons/icon-144x144.png',
  './icons/icon-152x152.png', './icons/icon-192x192.png',
  './icons/icon-384x384.png', './icons/icon-512x512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32x32.png', './icons/favicon-16x16.png',
];
/* images/ · images01/ 은 첫 방문 후 cacheFirstLocal 로 자동 캐시 */

const CDN = [
  'https://fonts.googleapis.com', 'https://fonts.gstatic.com',
  'https://cdn.jsdelivr.net',     'https://cdnjs.cloudflare.com',
  'https://unpkg.com',
];

/* ── INSTALL ─────────────────────────────────────────────────── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(APP_SHELL))
      .then(() => { console.log('[SW] 프리캐시 완료'); return self.skipWaiting(); })
      .catch(() => self.skipWaiting())
  );
});

/* ── ACTIVATE ────────────────────────────────────────────────── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => ![CACHE, CDN_CACHE].includes(k)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* ── FETCH ───────────────────────────────────────────────────── */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;
  const url = new URL(req.url);
  const isCDN = CDN.some(o => url.origin === new URL(o).origin || req.url.startsWith(o));
  e.respondWith(isCDN ? nf(req) : cf(req));
});

async function cf(req) {
  const c = await caches.match(req);
  if (c) return c;
  try {
    const r = await fetch(req);
    if (r && r.status === 200 && r.type !== 'opaque') (await caches.open(CACHE)).put(req, r.clone());
    return r;
  } catch (_) {
    if (req.headers.get('accept')?.includes('text/html')) {
      const off = await caches.match(OFFLINE); if (off) return off;
    }
    return new Response('오프라인 상태입니다.', { status: 503, headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
  }
}

async function nf(req) {
  try {
    const r = await fetch(req);
    if (r && r.status === 200) (await caches.open(CDN_CACHE)).put(req, r.clone());
    return r;
  } catch (_) {
    return (await caches.match(req, { cacheName: CDN_CACHE })) || new Response('', { status: 503 });
  }
}

/* ── MESSAGE ─────────────────────────────────────────────────── */
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING' || e.data?.action === 'SKIP_WAITING') self.skipWaiting();
  if (e.data?.action === 'CLEAR_CACHE') caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k))));
});

/* ── PUSH ────────────────────────────────────────────────────── */
self.addEventListener('push', e => {
  const d = e.data?.json() ?? { title: '김만민 건축사', body: '새로운 소식이 있습니다.' };
  e.waitUntil(self.registration.showNotification(d.title, {
    body: d.body, icon: './icons/icon-192x192.png', badge: './icons/icon-72x72.png',
  }));
});
