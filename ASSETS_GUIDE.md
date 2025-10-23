# Gemini Sports Club - 에셋(이미지) 관리 가이드

이 문서는 `Gemini Sports Club` 애플리케이션에 사용되는 이미지 에셋(팀 로고, 이벤트 배너 등)을 관리하고 추가하는 방법에 대한 지침을 제공합니다. 현재는 외부 API(`logo.clearbit.com`)와 임시 이미지 경로를 사용하고 있지만, 실제 프로덕션 환경에서는 로컬 에셋을 사용하는 것이 안정적입니다.

## 1. 프로젝트 구조

모든 정적 이미지 에셋은 `public` 폴더 내에 체계적으로 저장하는 것을 권장합니다. `public` 폴더는 빌드 시 서버의 루트 디렉토리로 복사되므로, 코드 내에서 절대 경로(`/`)로 쉽게 참조할 수 있습니다.

```
/
├── public/
│   ├── images/
│   │   ├── logos/                <-- 팀 로고 저장 위치
│   │   │   ├── lg-twins.svg
│   │   │   └── manchester-city.png
│   │   └── banners/              <-- 이벤트 배너 저장 위치
│   │       ├── event_bonus.jpg
│   │       └── event_epl.webp
│   └── vite.svg (favicon)
├── src/
│   ├── components/
│   └── ...
└── index.html
```

## 2. 팀 로고 (Team Logos)

### 2.1. 파일 형식 및 사이즈

-   **권장 형식:** **SVG** (Scalable Vector Graphics)
    -   **이유:** SVG는 벡터 기반이므로 어떤 크기에서도 선명하게 보이며 파일 크기가 작습니다. 로고에 가장 이상적인 형식입니다.
    -   **대안:** **PNG** (배경이 투명한 PNG)
-   **권장 사이즈:** 최소 **128x128 픽셀** 이상
    -   앱 내에서는 작게 표시되지만, 고해상도 디스플레이를 위해 원본은 충분히 큰 것이 좋습니다.
-   **파일 이름 규칙:** `[팀이름-kebab-case].[확장자]` (예: `lg-twins.svg`, `manchester-city.png`)
    -   일관된 규칙은 코드 내에서 로고를 동적으로 매핑할 때 유용합니다.

### 2.2. 저장 경로

-   `public/images/logos/`

### 2.3. 코드 내 사용법

`services/realtimeDataService.ts` 파일에서 팀 로고 URL을 생성하는 부분을 수정하여 로컬 경로를 사용하도록 변경할 수 있습니다.

**기존 (외부 API):**
```typescript
homeTeamLogo: `https://logo.clearbit.com/${apiMatch.home_team.toLowerCase().replace(/ /g, '')}.com`,
```

**변경 후 (로컬 에셋):**
```typescript
// 팀 이름과 파일명을 매핑하는 객체를 만듭니다.
const teamLogoMap: { [key: string]: string } = {
  'LG 트윈스': '/images/logos/lg-twins.svg',
  'Manchester City': '/images/logos/manchester-city.png',
  // ... 모든 팀 추가
};

// ... transformApiDataToMatch 함수 내에서 ...
homeTeamLogo: teamLogoMap[apiMatch.home_team] || '/images/logos/default-logo.svg', // 기본 로고
```

## 3. 이벤트 배너 (Event Banners)

### 3.1. 파일 형식 및 사이즈

-   **권장 형식:** **JPEG** 또는 **WebP**
    -   **이유:** JPEG는 사진과 같은 복잡한 이미지에 효율적이며, WebP는 더 나은 압축률을 제공하여 파일 크기를 줄일 수 있습니다.
-   **권장 사이즈 (모바일 최적화):**
    -   **가로:** 최소 800px 이상
    -   **세로:** `16:9` 또는 `2:1` 비율을 권장합니다. (예: `800x450` 픽셀 또는 `800x400` 픽셀)
-   **파일 이름 규칙:** `[이벤트명_간략히].[확장자]` (예: `event_bonus.jpg`, `event_epl.webp`)

### 3.2. 저장 경로

-   `public/images/banners/`

### 3.3. 코드 내 사용법

`App.tsx` 내의 `EventsPage` 컴포넌트에서 이벤트 데이터의 이미지 URL을 수정합니다.

**기존 (임시 경로):**
```typescript
const DUMMY_EVENTS: Event[] = [
    {
        // ...
        imageUrl: '/images/banners/event_bonus.jpg' // 이 경로는 public 폴더를 기준으로 합니다.
    },
    // ...
];
```

**사용법:**
`public/images/banners/` 경로에 `event_bonus.jpg` 파일을 저장하기만 하면, 위 코드는 추가 수정 없이 정상적으로 이미지를 표시합니다. **경로가 `/`로 시작하는지 반드시 확인하세요.**
