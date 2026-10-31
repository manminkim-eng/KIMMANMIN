/* ══════════════════════════════════════════════════════
   Service Worker — MANMIN PWA
   김만민 건축사 — 대성건축사사무소
   ══════════════════════════════════════════════════════ */

const CACHE_VERSION = 'manmin-v2.55';   /* 2026-10-31 소방시설 5.2.6 카드 Ver(§25-6-28) (종전 v2.54) */   /* 2026-10-31 A4 여백 통일 9종 카드 Ver(§25-6-27) (종전 v2.53) */   /* 2026-10-31 인쇄 보강 R1~R5 · 소방 A4 외곽선 삭제 33종 카드 Ver(§25-6-26) (종전 v2.52) */   /* 2026-10-31 A4 단색 인쇄 23종 카드 Ver(§25-6-25) (종전 v2.51) */   /* 2026-10-31 A4 출력 오류 수정 14종 카드 Ver(공공대가 5.0.11 · 상주 5.0.12 · 해체 5.0.12 · 옹벽 5.1.3 · 소방 펌프 7종 5.1.5 · 성능지표 5.4.11 · 부하계산 5.3.6 · 법규검토 1.3.3) (종전 v2.50) */   /* 2026-10-31 포털 3종 카드 Ver(기계 1.0.11 · 건축 1.0.9 · 구조토목 1.0.10 — index.html 긴급 복구 · 생성기 동기화) (종전 v2.49) */
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
