/* ══════════════════════════════════════════════════════
   Service Worker — MANMIN PWA
   김만민 건축사 — 대성건축사사무소
   ══════════════════════════════════════════════════════ */

const CACHE_VERSION = 'manmin-v2.87';   /* 2026-11-09 편의시설 카드 화면 배지 Ver 1.2.2(A4 인쇄 서명란 최하단 보완)(§25-6-61) (종전 v2.86) */   /* 2026-11-09 건축 통합 포털 카드 Ver 1.0.15(사용자 매뉴얼 Ver-1.1 · 계산서 12종)(§25-6-60) (종전 v2.85) */   /* 2026-11-09 건축 시리즈 요약 배너 Released · Manual 12→14(계산서 12 · 법규검토 · 통합 포털) (종전 v2.84) */   /* 2026-11-09 편의시설 Ver 1.2(증축 적용 범위 · 사용자 매뉴얼) 카드 · YouTube 쇼츠 · 롱폼 · 매뉴얼 단추 · 건축 통합 포털 Ver 1.0.14(§25-6-59) (종전 v2.83) */   /* 2026-11-09 편의시설 Ver 1.1(세부기준 그림 18) · 건축 통합 포털 Ver 1.0.13 카드 숫자(인허가 5종 · 12종) · 링크 미리보기 웹 계산 도구 35종(§25-6-57) (종전 v2.82) */   /* 2026-11-09 신규 카드: 장애인 편의시설 설치기준 검토 v1.0.0 · 허브 A-13 · 건축 통합 포털 12종(§25-6-56) (종전 v2.81) */   /* 2026-11-09 안전점검등 대가 카드 YouTube 쇼츠 · 롱폼 단추 · 건축 통합 포털 카드 11종(§25-6-55) (종전 v2.80) */ /* 2026-11-09 안전점검등 대가 카드 Ver 1.0.4 · 사용자 매뉴얼 버튼(§25-6-54) (종전 v2.79) */   /* 2026-11-09 안전점검등 대가 카드 Ver 1.0.3 · 설치안내 공유판 안전대가 추가(§25-6-53) (종전 v2.78) */ /* 2026-11-09 신규 카드: 안전점검등 대가 산출기(건축물) v1.0.2 · 해체감리 시리즈 뒤(§25-6-53) (종전 v2.77) */
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
