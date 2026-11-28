/* ══════════════════════════════════════════════════════
   Service Worker — MANMIN PWA
   김만민 건축사 — 대성건축사사무소
   ══════════════════════════════════════════════════════ */

const CACHE_VERSION = 'manmin-v3.45';   /* 2026-11-28 웹 코드 보호 3단계 — 카드 판 42종(도구 38 · 포털 4) 표기(§25-6-124) (종전 v3.44) */   /* 2026-11-27 포털 4종 휴대폰 표 카드형 — 카드 판 소방 5.2.18 · 기계 1.0.25 · 건축 1.0.43 · 구조토목 1.0.25(§25-6-123) (종전 v3.43) */   /* 2026-11-27 44 허가조서 매뉴얼 v6.1.28(PR #11) 반영 — A4 57쪽 → 64쪽 (종전 v3.42) */
/* §17-1 — 같은 origin(manminkim-eng.github.io)에 40여 개 도구 캐시가 있다. 홈페이지 캐시명은 manmin-v<숫자> 계열만이다
   (manmin-hub- · manmin-mech-portal- · manmin-arch-portal- 등 다른 도구 접두어는 제외) */
const mmOwn = (k) => /^manmin-v\d/.test(k);
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
  /* 로컬 폴백 폰트 — CDN 차단·오프라인 시 한글 깨짐 방지 */
  './assets/fonts/manmin-fonts.css',
  './assets/fonts/NotoSansKR-var.woff2',
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
   ACTIVATE — 구버전 캐시 삭제 (자기 캐시만 · §17-1)
───────────────────────────── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VERSION && mmOwn(k)).map(k => caches.delete(k))
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
