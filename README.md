# MANMIN — PWA 포탈 `[MANMIN-Ver2.0]`

> **김만민 건축사 — 대성건축사사무소**
> PWA 앱 이름: **MANMIN** · 배포: <https://manminkim-eng.github.io/KIMMANMIN/>
> 최종 갱신 2026-07-15 · 관리대장: `만민 홈페이지 및 웹개발 통합관리/outputs/reports/만민_WAP_통합관리대장.html` (WAP no.00)

---

## ⚠️ 파일 취급 규칙 — 수정 전 반드시 확인

아래 3종은 **의도적으로 원본 포맷을 유지**합니다. WebP로 바꾸면 기능이 깨집니다.

| 파일 | 포맷 | 유지 사유 |
|------|------|-----------|
| `images/og-thumbnail.jpg` | **JPEG** | 카카오톡·네이버 링크 미리보기 스크래퍼가 WebP를 처리하지 못할 수 있음 |
| `images01/만민로고.png` | **PNG** | `index.html`의 JSON-LD 구조화 데이터 `image` 필드가 이 경로를 참조 |
| `icons/*.png` | **PNG** | PWA `manifest.json` 아이콘 규격 |

그 외 `images/`·`images01/` 이미지는 모두 **WebP**입니다.

- 한글 파일명을 씁니다. **URL로 접근·테스트할 때는 반드시 퍼센트 인코딩**하십시오.
  인코딩 없이 `curl` 하면 정상 파일도 404로 보입니다 (2026-07-15 실제 오진 사례).
- 파일명 대소문자를 구분합니다: `건축사_자격증.webp` ≠ `건축사_자격증.WEBP`
- 이미지 교체 시 `index.html` 내 경로와 실제 파일명이 **정확히 일치**해야 합니다.
- `index.html` 이미지 참조는 `images/`와 `images01/` 두 경로를 모두 씁니다. 혼동 주의.

---

## 📁 파일 구조

```
KIMMANMIN/                      ← 저장소 root = 배포 root
│
├── index.html                  메인 (6,815줄 단일 파일 · WebP 참조 · lazy loading)
├── manifest.json               PWA 매니페스트 (version 2.0)
├── sw.js                       서비스 워커 (CACHE_VERSION: manmin-v2.0)
├── offline.html                오프라인 fallback
├── favicon.ico                 파비콘
├── .nojekyll                   Jekyll 비활성화
│
├── icons/                      PWA 아이콘 12종 (PNG 고정)
│
├── images/                     프로젝트 사진 · 계산도구 스크린샷 (WebP)
│   └── og-thumbnail.jpg        JPEG 고정
│
└── images01/
    ├── 만민로고.png              PNG 고정
    ├── 협회로고.webp
    ├── licenses/               자격증 15종 (WebP)
    └── advisory/               위촉장 6종 (WebP)
```

---

## 🔧 Ver2.0 변경 내역 (2026-07-15 · 커밋 `2f12999`)

| 항목 | Ver1.0 | Ver2.0 |
|------|--------|--------|
| 저장소 용량 | 66MB | **7.5MB** (−89%) |
| 파일 수 | 118개 | **87개** |
| 초기 로딩 | 약 9MB | **약 95KB** |
| 이미지 | JPG/PNG 62개 34.3MB | **WebP 62개 6.3MB** (−81.6%) |
| lazy loading | 0/87 | **84/87** (첫화면 3개는 eager) |
| 유튜브 썸네일 | `maxresdefault` ×36 (약 5MB) | **`mqdefault` ×36** (약 0.4MB) |
| width/height | 없음 | **48개 명시** (CLS 방지) |
| preconnect | 폰트만 | **+ img.youtube.com · kakaocdn** |
| `sw.js` CACHE | `manmin-v1.0` | **`manmin-v2.0`** |
| `.nojekyll` | 누락 | **추가** |

대표 절감: `공공대가.png` 6,030KB → 142KB · `컨밴션.jpg` 4,638KB → 239KB · `만민로고.png` 2,411KB → 12KB(2048px를 44~180px로만 쓰던 것을 512px로 축소)

### 미사용 파일 31개(29.8MB) 정리
MD5 대조로 중복·미참조를 확인한 뒤 삭제했습니다. 원본은 NAS `참고자료/저장소_미사용파일_백업_2026-07-15/`(33개 30MB)에 보관돼 있고 Git 이력에도 존속합니다.

- `images/` 중복본 10개 — `images01/`과 MD5 동일, HTML은 `images01/`만 참조
- `images02 …` 20개 — 구 명명규칙 잔재
- `images01/convention.jpg` — `컨밴션.jpg`와 MD5 동일 · `images01/stadium.jpg` 16.5MB — 미참조
- `kimmanmin/index.html` — 2바이트 빈 파일

---

## 🚩 미해결 항목 (Ver2.1 검토 대상)

- **WebP 62개 육안 검수 미완** — quality 82 / 긴 변 1600px 상한으로 변환. 페이지 높이가 68,280px여서 자동 캡처가 불가능해 코드·수치 검증만 수행했습니다. 화질 문제 발견 시 quality를 올려 재변환하십시오.
- **헤더 로고 겹침** — `nav .logo`에서 `만민로고.png`(투명도 없는 골드 사각형 + `filter:brightness(0) invert(1)` → 흰 사각형)가 `협회로고.webp`에 완전히 가려집니다. 제어하는 CSS·JS 없음. 의도 확인 필요. (만민로고는 히어로·모달·JSON-LD에서 정상 사용 중)
- **페이지 높이 68,280px** — 단일 파일 6,815줄. 섹션 분할·지연 렌더링 검토 여지 (현재 기능 이상 없음).

---

## 🚀 배포 절차

정적 사이트이므로 `main` 브랜치 root가 곧 배포본입니다.

```bash
git clone https://github.com/manminkim-eng/KIMMANMIN.git
# 수정 후
git add -A && git commit -m "..." && git push origin main
```

> **관리 원칙(관리대장 제1장)** — 검토 → 보고 → **승인** → 배포 → 검증. 임의 수정 금지.
> 정밀검토는 **저장소 원본 대조**로 합니다. 외부 수집(웹 크롤·curl)은 오탐을 냅니다.

배포 후 1~2분 뒤 <https://manminkim-eng.github.io/KIMMANMIN/> 에서 **눈으로 확인**하십시오.
`sw.js` 캐시 때문에 옛 화면이 보이면 **Ctrl+Shift+R**(강력 새로고침).
파일명·구조를 바꿨다면 `sw.js`의 `CACHE_VERSION`을 반드시 올려야 기존 방문자의 캐시가 폐기됩니다.

---

## 📲 PWA 설치 동작

| 환경 | 동작 |
|------|------|
| Android Chrome | 상단 금색 **[📲 설치]** 버튼 + 하단 배너 |
| PC Chrome / Edge | 주소창 우측 ⊕ 아이콘 |
| iOS Safari | 공유(□↑) → "홈 화면에 추가" |
| 이미 설치됨 | 설치 버튼 자동 숨김 |
| 오프라인 | 캐시된 앱 실행 (`offline.html` fallback) |

> PWA 설치는 **HTTPS** 에서만 동작합니다. GitHub Pages는 자동 HTTPS 제공 ✅

---

## 🔗 연동

- **방문자 분석** — GoatCounter (`manmin.goatcounter.com`). `index.html`·`offline.html` head의 스크립트를 **삭제하지 마십시오.**
- **문의** — 카카오톡 채널 (`open.kakao.com`) · **블로그** — 네이버
- **계산도구** — `manminkim-eng.github.io/*` 72개 링크. 각 도구는 별도 저장소이며 관리대장 no.01~51로 추적합니다.
- 백엔드 호출 없음(정적). DB·서버 불필요.

---

© Architect KIM MANMIN — 대성건축사사무소
