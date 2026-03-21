/* ══════════════════════════════════════════════════════
   Service Worker — MANMIN PWA
   김만민 건축사 — 대성건축사사무소
   ══════════════════════════════════════════════════════ */

const CACHE_VERSION = 'manmin-v1.0';
const OFFLINE_PAGE  = './offline.html';

/* ── 사전 캐시 목록 (앱 셸) ── */
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './offline.html',
  './favicon.ico',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/apple-touch-icon.png',
];

/* ─────────────────────────────
   INSTALL — 앱 셸 사전 캐시
───────────────────────────── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

/* ─────────────────────────────
   ACTIVATE — 구버전 캐시 삭제
───────────────────────────── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ─────────────────────────────
   FETCH — 전략별 응답
───────────────────────────── */
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* 외부 CDN (폰트 등) → Network First + 캐시 fallback */
  const isCDN = ['fonts.googleapis.com','fonts.gstatic.com','cdn.jsdelivr.net'].some(d => url.hostname.includes(d));
  if (isCDN) {
    event.respondWith(networkFirst(req));
    return;
  }

  /* 이미지(images, images01) → Cache First */
  if (url.pathname.includes('/images') ) {
    event.respondWith(cacheFirst(req));
    return;
  }

  /* HTML 내비게이션 → Network First + offline fallback */
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match(OFFLINE_PAGE))
    );
    return;
  }

  /* 나머지 → Stale While Revalidate */
  event.respondWith(staleWhileRevalidate(req));
});

/* ─────────────────────────────
   SKIP_WAITING 메시지 처리
───────────────────────────── */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/* ── 전략 함수들 ── */
async function networkFirst(req) {
  try {
    const res = await fetch(req);
    if (res && res.status === 200) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    return caches.match(req);
  }
}

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.status === 200) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    return new Response('', { status: 404 });
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(req);
  const fetchPromise = fetch(req).then(res => {
    if (res && res.status === 200 && res.type !== 'opaque') {
      cache.put(req, res.clone());
    }
    return res;
  }).catch(() => cached);
  return cached || fetchPromise;
}
