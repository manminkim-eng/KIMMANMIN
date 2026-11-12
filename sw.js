/* ══════════════════════════════════════════════════════
   Service Worker — MANMIN PWA
   김만민 건축사 — 대성건축사사무소
   ══════════════════════════════════════════════════════ */

const CACHE_VERSION = 'manmin-v3.02';   /* 2026-11-12 카드 판 14종 — 화면 확대 허용 · 키보드 조작 6종 · 입력값 경고 표시 8종(정밀검토 B17 · B10 · §25-6-78 · 79) (종전 v3.01) */   /* 2026-11-12 카드 판 15종 — 건물개요 공통 원본 v1.2 맞춤 8종 · 새로 넣은 7종(정밀검토 B5 · B6 · §25-6-76 · 77) (종전 v3.00) */   /* 2026-11-12 메타 문구(도구 36종 · 포털 4종) · 경력 자동 계산(11,545일 · 2026-08-15 기준) · 구조화 데이터 주소 전북특별자치도 · sitemap.xml · 카드 판 편의시설 6.1.1 · 성능지표 · 소방시설 · 해체감리 · 안전대가 · 열관류율 6.1.0(정밀검토 B14 · B15 · §25-6-75) (종전 v2.99) */   /* 2026-11-12 카드 Ver 6.1.0 — 냉온수 · 공조덕트 · 부하계산(RTS) · 주차장(기준 표기 정리, 정밀검토 B13 · §25-6-74) (종전 v2.98) */   /* 2026-11-12 지내력 카드 Ver 1.1.2(2026-11-10 배포분 기록, 정밀검토 B1 · §25-6-73) (종전 v2.97) */   /* 2026-11-12 허가조서 카드 Ver 6.1.2(한국건축규정 고시 제2026-360호 병기, §25-6-71) (종전 v2.96) */   /* 2026-11-12 신규 카드: 건축허가조사 및 검사조서 Ver 6.1(허브 A-14 · 쇼츠 · 롱폼 · 매뉴얼) · 건축 통합 포털 13종 Ver 1.0.18 · 환기설비 · 설계하중 6.1.0 · 기계 포털 1.0.13 · 구조·토목 포털 1.0.16 · 링크 미리보기 37종(§25-6-70) (종전 v2.95) */   /* 2026-11-11 카드 Ver — 건축 통합포털 1.0.17 · 구조·토목 통합포털 1.0.15(도구 카드 판 6.1 · 근거표 시행일, §25-6-69) (종전 v2.94) */   /* 2026-11-11 카드 Ver — 일조사선 · 용도변경 · 내진성능 · 편의시설 6.1.0(개정 메모 · 판 6.1, §25-6-68) · 건축 통합포털 1.0.16 정정 (종전 v2.93) */   /* 2026-11-11 포트폴리오 PDF — 소개(건축과 설비를 아우르는 …) 섹션 새 쪽 시작 · 한 쪽 통째(MM-PRINT 홈피판 v1.2, 42 → 43쪽)(§25-6-67) (종전 v2.92) */     /* 2026-11-11 포트폴리오 PDF A4 고밀도 배치 MM-PRINT 홈피판 v1.1(인쇄 글자 80% · 데스크톱 열 수 · 개발웹 카드 좌우 배치 쪽당 2장 · 유튜브 3열 설명 전문 · 75 → 42쪽)(§25-6-66) (종전 v2.91) */     /* 2026-11-10 포트폴리오 PDF A4 인쇄 보정 MM-PRINT 홈피판 v1.0(빈 쪽 · 외톨이 쪽 · 화면 단추 제외 · 남색 전면 · 쪽 번호 n / N · 저장 이름)(§25-6-65) (종전 v2.90) */     /* 2026-11-10 GitHub 아이콘 SVG 경로 잘림 2곳 정정(환기설비 · 건축선 카드 — 콘솔 오류 해소) · 구조·토목 통합 포털 Ver 1.0.14(사용자 매뉴얼 Ver-1.1)(§25-6-64) (종전 v2.89) */   /* 2026-11-10 지내력 카드 Ver 1.1.0(지반조사 보고서 PDF 불러오기 · 공별 지하수위 · 사용자 매뉴얼 Ver-1.1) · 구조·토목 통합 포털 Ver 1.0.13(§25-6-63) (종전 v2.88) */   /* 2026-11-09 신규 카드: N값 지내력 환산 v1.0.1 · 허브 C-03 · YouTube 쇼츠 · 롱폼 · 매뉴얼 단추 · 구조·토목 통합 포털 Ver 1.0.12(5종) · 링크 미리보기 웹 계산 도구 36종(§25-6-62) (종전 v2.87) */   /* 2026-11-09 편의시설 카드 화면 배지 Ver 1.2.2(A4 인쇄 서명란 최하단 보완)(§25-6-61) (종전 v2.86) */   /* 2026-11-09 건축 통합 포털 카드 Ver 1.0.15(사용자 매뉴얼 Ver-1.1 · 계산서 12종)(§25-6-60) (종전 v2.85) */   /* 2026-11-09 건축 시리즈 요약 배너 Released · Manual 12→14(계산서 12 · 법규검토 · 통합 포털) (종전 v2.84) */   /* 2026-11-09 편의시설 Ver 1.2(증축 적용 범위 · 사용자 매뉴얼) 카드 · YouTube 쇼츠 · 롱폼 · 매뉴얼 단추 · 건축 통합 포털 Ver 1.0.14(§25-6-59) (종전 v2.83) */   /* 2026-11-09 편의시설 Ver 1.1(세부기준 그림 18) · 건축 통합 포털 Ver 1.0.13 카드 숫자(인허가 5종 · 12종) · 링크 미리보기 웹 계산 도구 35종(§25-6-57) (종전 v2.82) */   /* 2026-11-09 신규 카드: 장애인 편의시설 설치기준 검토 v1.0.0 · 허브 A-13 · 건축 통합 포털 12종(§25-6-56) (종전 v2.81) */   /* 2026-11-09 안전점검등 대가 카드 YouTube 쇼츠 · 롱폼 단추 · 건축 통합 포털 카드 11종(§25-6-55) (종전 v2.80) */ /* 2026-11-09 안전점검등 대가 카드 Ver 1.0.4 · 사용자 매뉴얼 버튼(§25-6-54) (종전 v2.79) */   /* 2026-11-09 안전점검등 대가 카드 Ver 1.0.3 · 설치안내 공유판 안전대가 추가(§25-6-53) (종전 v2.78) */ /* 2026-11-09 신규 카드: 안전점검등 대가 산출기(건축물) v1.0.2 · 해체감리 시리즈 뒤(§25-6-53) (종전 v2.77) */
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
