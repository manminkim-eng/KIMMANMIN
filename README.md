# MANMIN — PWA 포탈 GitHub Pages 배포 가이드

> **김만민 건축사 — 대성건축사사무소**  
> PWA 앱 이름: **MANMIN**

---

## 📁 전체 파일 구조

```
MANMIN/  ← 이 폴더 전체를 GitHub 레포지토리 root에 업로드
│
├── index.html                  ✅ 메인 웹페이지 (완성)
├── manifest.json               ✅ PWA 매니페스트 (앱명: MANMIN)
├── sw.js                       ✅ 서비스 워커 (오프라인 캐싱)
├── offline.html                ✅ 오프라인 fallback 페이지
├── favicon.ico                 ✅ 파비콘
├── .nojekyll                   ✅ GitHub Pages Jekyll 비활성화
│
├── icons/                      ✅ PWA 아이콘 (자동 생성 완료)
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   ├── icon-maskable-512x512.png
│   └── apple-touch-icon.png
│
├── images/                     ⬆️ 개발자 직접 업로드
│   └── (소방사진, 현장사진 등)
│
└── images01/                   ⬆️ 개발자 직접 업로드
    ├── 만민로고.png              ← 필수!
    ├── 협회로고.jpg              ← 필수!
    ├── licenses/
    │   ├── 건축사_자격증.jpg
    │   ├── 일반기계기사.jpg
    │   ├── 건설기계설비기사.jpg
    │   ├── 공조냉동기계기사.jpg
    │   ├── 소방설비기사_기계.jpg
    │   ├── 소방설비기사_전기.jpg
    │   ├── 건축설비기사.jpg
    │   ├── 건축산업기사.jpg
    │   ├── 토목기사.jpg
    │   ├── CVS_자격증.jpg
    │   ├── VMA_자격증.jpg
    │   └── VMP_자격증.jpg
    └── advisory/
        ├── 위촉장_익산시_2025_05.jpg
        ├── 위촉장_전북_2025_01.jpg
        ├── 위촉장_익산시_2024_08.jpg
        ├── 위촉장_전북_2023_01.jpg
        └── 위촉장_익산시_2021_08.jpg
```

---

## 🚀 GitHub 업로드 순서 (정확한 절차)

### STEP 1 — GitHub 레포지토리 생성
1. https://github.com 로그인
2. 우측 상단 **[+] → New repository** 클릭
3. Repository name: `KIMMANMIN` (또는 원하는 이름)
4. **Public** 선택 (GitHub Pages 무료 사용 조건)
5. **Add a README file** 체크 해제
6. **Create repository** 클릭

---

### STEP 2 — 완성된 파일 업로드 (1순위)
> **반드시 이 순서대로 업로드하세요**

1. 레포지토리 페이지에서 **Add file → Upload files** 클릭
2. 아래 파일들을 **한 번에** 드래그앤드롭:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `offline.html`
   - `favicon.ico`
   - `.nojekyll`
3. **Commit changes** 클릭

---

### STEP 3 — icons 폴더 업로드 (2순위)
1. **Add file → Upload files** 클릭
2. `icons/` 폴더 통째로 드래그앤드롭
   (또는 icons 폴더 안 파일 12개 선택)
3. 업로드 경로가 `icons/icon-192x192.png` 형태인지 확인
4. **Commit changes** 클릭

---

### STEP 4 — 이미지 폴더 업로드 (3순위)
#### images01/ 루트 이미지
1. **Add file → Upload files** 클릭
2. `만민로고.png`, `협회로고.jpg` 업로드
3. 경로: `images01/만민로고.png` 확인
4. **Commit changes** 클릭

#### images01/licenses/ 자격증
1. **Add file → Upload files** 클릭
2. 자격증 jpg 파일 12개 업로드
3. 경로: `images01/licenses/건축사_자격증.jpg` 확인
4. **Commit changes** 클릭

#### images01/advisory/ 위촉장
1. **Add file → Upload files** 클릭
2. 위촉장 jpg 파일 5개 업로드
3. 경로: `images01/advisory/위촉장_익산시_2025_05.jpg` 확인
4. **Commit changes** 클릭

#### images/ 소방·현장 사진
1. 필요한 사진 파일 업로드
2. 경로: `images/파일명.jpg` 확인

---

### STEP 5 — GitHub Pages 활성화
1. 레포지토리 → **Settings** 탭 클릭
2. 좌측 메뉴 → **Pages** 클릭
3. **Source**: `Deploy from a branch`
4. **Branch**: `main` / `(root)` 선택
5. **Save** 클릭
6. 2~3분 후 상단에 URL 표시됨:
   ```
   https://[계정명].github.io/KIMMANMIN/
   ```

---

## 📲 PWA 설치 버튼 동작

| 환경 | 동작 |
|------|------|
| Android Chrome | 상단 금색 **[📲 설치]** 버튼 + 하단 배너 자동 표시 |
| PC Chrome / Edge | 주소창 우측 ⊕ 아이콘 또는 상단 버튼 |
| iOS Safari | 공유(□↑) → "홈 화면에 추가" |
| 이미 설치됨 | 설치 버튼 자동 숨김 |
| 오프라인 | 캐시된 앱 그대로 실행 |

> ⚠️ PWA 설치는 반드시 **HTTPS** 에서만 동작합니다.  
> GitHub Pages는 자동 HTTPS 제공 ✅

---

## ⚠️ 파일명 주의사항

- 한글 파일명 사용 가능하나 **공백 없이** 업로드
- 파일명 대소문자 구분: `건축사_자격증.jpg` ≠ `건축사_자격증.JPG`
- index.html 내 경로와 실제 파일명이 **정확히 일치**해야 함

---

© Architect KIM MANMIN — 대성건축사사무소
