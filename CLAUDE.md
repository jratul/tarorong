# 타로롱 (tarorong)

타로카드 78장의 정보를 찾아보고, 실제로 스프레드를 골라 카드를 뽑아볼 수 있는 웹 앱.
마스코트 **롱이**가 친근한 말투로 안내하고 해석해 준다.

> 이 문서는 프로젝트 계획서 겸 작업 가이드다. 구현이 진행되면 실제 코드 상태에 맞게 갱신한다.
> 아직 개발 전 — 계획 확정 단계. 미결정 항목은 [10. 미결정 사항](#10-미결정-사항) 참고.

---

## 1. 기술 스택

| 영역 | 선택 | 비고 |
| --- | --- | --- |
| 프레임워크 | React 19 + TypeScript | Next.js는 쓰지 않는다 |
| 빌드 | Vite | |
| 라우팅 | React Router v7 (framework mode, `ssr: false`) | 카드 상세 78장 등을 빌드 시 **prerender** (확정 대기, 5절) |
| 스타일 | Tailwind CSS v4 | `@tailwindcss/vite`, 시안 토큰을 `@theme`으로 이식 |
| 폰트 | Jua(제목) / Gowun Dodum(본문) / DM Mono(숫자·날짜) | Google Fonts `<link>` 대신 `@fontsource/*`로 **자체 호스팅**(렌더 블로킹 금지) |
| 애니메이션 | CSS transform/transition | 부채꼴·뒤집기·셔플. 부족하면 framer-motion |
| 상태 저장 | **오늘의 카드 시드 1개만** (localStorage) | 리딩 기록·설정은 저장하지 않는다. 접속할 때마다 새로 뽑는다 |
| 품질 | ESLint(flat config) + Prettier | 전역 룰 1번 기준 그대로 |
| 테스트 | Vitest | 셔플, 해석 조합 로직 단위 테스트 |
| 배포 | Vercel | 정적 빌드 |

---

## 2. 디자인 — "밤하늘 젤리"

시안은 `.ref/`(로컬 전용, git 제외)에 있다. HTML/CSS 정적 마크업이며 **모바일 우선**,
`min-width: 1024px`(Tailwind `lg`)부터 웹 레이아웃으로 바뀐다.

- **토큰** (`.ref/css/tokens.css` → `src/styles/index.css`의 `@theme`)
  - 배경 `#1e1a3a` / 깊은 배경 `#0f0c22` / 표면 `#2c2652` / 텍스트 `#f6f1ff`
  - 젤리 포인트: gold `#ffe9a6` · pink `#ffc7e3` · rose `#ffb1d6` · sky `#b9e6ff` · lilac `#e6dcff`
  - 밝은 젤리 위 텍스트는 항상 ink `#1e1a3a`
  - 반경 12~32px + pill, 글로우 그림자(gold/pink), 배경에 별 점 패턴
  - 카드 비율 3:5
- **네비게이션**: 웹은 상단 `topnav`. 모바일은 시안의 하단 탭바 대신 **햄버거 메뉴**를 쓴다(메뉴 확장 대비, 전역 룰 7번).
  상단 헤더 = 뒤로가기(하위 화면) + 페이지 제목 + 햄버거 버튼. 링크를 누르면 메뉴가 닫힌다
- **마스코트 롱이**: 지금은 CSS 도형으로 만든 임시 버전 → 나중에 일러스트로 교체. `<Longi size mood />`
- **컴포넌트 매핑**: `.ref/README.md`의 "클래스 → React 컴포넌트 제안" 표를 따른다
  (`Button`, `Chip`, `Segmented`, `Longi`, `SpeechBubble`, `TarotCard`, `SpreadItem`, `Keyword`, `CardFan` …)
- **말투**: 반말, 친근하게. "별빛 친구", "~해봐", "~일 거야". 모든 해석 텍스트도 같은 톤.

---

## 3. 카드 이미지

### 방향: 타로롱 전용 카드를 SVG로 새로 그린다 (샘플 검토 후 확정)

- RWS의 상징을 바탕으로, 표현은 젤리 톤으로 바꾼다. 둥근 실루엣, 시안 팔레트, 롱이 계열의 귀여운 캐릭터를 쓴다.
- **직관성 최우선**: 카드를 딱 봤을 때 "아, 별이다", "아, 바보다"를 알 수 있어야 한다. 디테일은 덜어낸다.
  - 카드마다 **주인공 상징 1개를 크게**(화면의 절반 가까이), 보조 상징은 **1~2개만**
  - 배경은 그라디언트 + 최소 요소. 작은 장식(요드, 작은 별, 새 등)은 넣지 않는다
  - 예: 바보 = 절벽 끝에서 허공으로 내딛는 발(+봇짐, 흰 장미, 강아지) / 탑 = 번개 맞는 탑(+날아가는 왕관) /
    별 = 커다란 팔각 별(+물 붓는 아이) / 컵 에이스 = 넘쳐흐르는 큰 컵(+구름에서 나온 손)
  - 카드마다 "주인공 / 보조 상징"을 먼저 표로 정리하고 그린다
  - 도감 썸네일 크기(약 84px 폭)에서도 알아볼 수 있는지 확인한다
- 공통 프레임 컴포넌트(테두리, 로마 숫자, 이름 띠) + 카드별 일러스트 SVG로 구성한다. 비율은 시안대로 3:5
- 수트별 대표 색: 완드 gold · 컵 sky · 소드 lilac · 펜타클 pink (시안 `data.js` 기준)
- 진행: 샘플 몇 장 → 사용자 확인 → 메이저 22장 → 마이너 56장
- 한계: 플랫/벡터 스타일이라 회화 같은 디테일은 없다. 78장 모두 완성될 때까지 아래 RWS 스캔을 대체 이미지로 쓸 수 있다

### 대체 이미지: 1909년판 라이더-웨이트-스미스(RWS) 원본 스캔

- 일러스트레이터 Pamela Colman Smith(1951년 사망) 작품으로, 1909년 출간본은 **퍼블릭 도메인**이다.
- 출처: **Wikimedia Commons**의 78장 전체 스캔(예: `RWS Tarot 01 Magician.jpg`, `Cups10.jpg`).
- 주의사항
  - 1971년 이후 U.S. Games Systems의 **재채색판**은 저작권이 따로 있으니 쓰지 않는다.
  - "Rider-Waite"는 상표이므로 앱 이름·브랜딩에 쓰지 않는다. 출처 표기는
    "Pamela Colman Smith, 1909 (Public Domain)".
  - 핫링크하지 않고 `scripts/download-cards.mjs`로 받아 `sharp`로 WebP 변환(썸네일/상세 2가지)해
    `public/cards/`에 둔다. 파일명: `major-00-fool.webp`, `cups-14-king.webp` …
- 카드 뒷면은 시안 톤(☾ + 젤리 컬러)으로 직접 SVG를 그린다.

---

## 4. 해석 방식 — 조각 조합 + 규칙 기반 요약

카드 조합마다 해석을 미리 다 써두는 건 불가능하다. 3장 스프레드만 해도 순서·방향을 포함해
**약 365만 가지**(78×77×76×2³)이고, 켈틱 크로스(10장)는 사실상 무한대다.
그래서 해석을 **조각 단위로 작성하고 조합**한다.

1. **카드 조각** (78장 × 정/역): 한 줄 요약, 키워드, 기본 설명,
   **주제별 의미(연애 / 일 / 금전 / 조언)**, 외우는 팁(도감용)
2. **자리 조각** (스프레드 자리별): "과거", "장애물" 같은 자리 설명과 그 자리에서 카드를 읽는 관점
3. **롱이의 한마디** (전체 요약): 뽑힌 카드들을 보고 규칙으로 생성한다
   - 메이저 비율이 높으면 → "인생의 큰 흐름이 움직이는 시기"
   - 많이 나온 수트 → 완드 = 열정·행동, 컵 = 감정·관계, 소드 = 생각·갈등, 펜타클 = 현실·돈
   - 역방향 비율이 높으면 → 막힘, 내면 점검
   - 궁정 카드가 많으면 → 주변 사람의 영향
   - 같은 숫자 반복 → 그 숫자의 의미 강조
   - **특별 조합 테이블**: 유명한 조합(탑→별, 연인+컵2 등)은 문장을 따로 써둔다(수십 개)
   - 마지막 자리(미래/결과) 카드의 "조언" 문장으로 마무리
   - 요약 태그 = 뽑힌 카드들의 상위 키워드
4. 질문 내용 자체를 이해하지는 못한다는 게 한계다. AI 해석은 지금은 하지 않는다.

**주제**: 뽑기 전에 종합 / 연애 / 일 / 금전 중 하나를 고른다. 연애운 스프레드는 자동으로 연애.

**콘텐츠 분량**: 78장 × 2방향 × (기본 + 4주제) ≈ **780단락** + 키워드·팁.
Waite 원전(1911, 퍼블릭 도메인)의 의미를 바탕으로 Claude가 친근한 말투로 초안을 쓰고 사용자가 검수한다.
메이저 22장을 먼저 끝내고 마이너로 넘어간다.

---

## 5. 렌더링 — React Router prerender (Next.js 없이)

- React Router v7 framework mode는 Vite 플러그인 기반이라 Next.js 없이 쓸 수 있다.
  `react-router.config.ts`에서 `ssr: false` + `prerender: [...]`로 지정한 경로만 빌드 시 HTML로 미리 만든다.
- 대상: `/`, `/cards`, `/cards/:id` 78장. `/draw`, `/result`는 SPA 그대로.
- 성능 영향: **런타임 비용은 없다.** 각 페이지가 내용이 채워진 HTML로 먼저 오니까 첫 화면(FCP/LCP)과
  SEO는 오히려 좋아진다. 비용은 빌드 시간이 조금 늘고 HTML 파일이 80개쯤 생기는 정도.
- 주의
  - 랜덤 뽑기, 오늘 날짜 같은 값은 빌드 시점에 굳으면 안 되므로 **클라이언트에서만**(`useEffect` 이후) 계산한다.
  - `vercel.json` rewrite는 prerender된 파일을 우선 쓰고 나머지만 SPA fallback(`__spa-fallback.html`)으로 보낸다.

---

## 6. 화면과 기능

| 경로 | 화면 | 내용 |
| --- | --- | --- |
| `/` | 홈 | 롱이 인사, 오늘의 카드, 스프레드 목록, 뽑기/도감 바로가기 |
| `/cards` | 도감 | 78장 그리드, 필터(전체/메이저/수트 4종, 개수 표시), 이름·키워드 검색 |
| `/cards/:id` | 카드 상세 | 큰 카드 + 정/역방향 토글, 원소·별자리·숫자, 키워드, 기본 설명, 주제별 의미, 롱이의 외우는 팁, 이전/다음 카드, 확대 라이트박스 |

- **오늘의 카드**: 첫 방문 때 랜덤 숫자 하나(`deviceSeed`)를 만들어 localStorage에 저장하고,
  `deviceSeed + 날짜(한국 시간)`를 시드로 카드와 방향을 정한다
  - 같은 기기·브라우저에서는 하루 동안 같은 카드, 자정에 바뀜. 사람(기기)마다 다른 카드
  - 사용자에게 아무것도 입력받지 않는다. 저장하는 건 이 숫자 하나뿐이다(리딩 기록 등은 저장하지 않음)
  - localStorage를 못 쓰는 환경(시크릿 모드 등)에서는 날짜만으로 시드를 정한다
  - 빌드 시점에 굳지 않도록 브라우저에서 계산한다
| `/draw` | 뽑기 | 스프레드 칩, 주제, 질문(선택), 역방향 포함 토글, 부채꼴 덱에서 카드 고르기, 다시 섞기 |
| `/result` | 결과 | 카드 뒤집기 연출 → 자리별 해석 → 롱이의 한마디 + 태그 → 다시 뽑기 |

- 스프레드: 원카드(1) / 쓰리카드(과거·현재·미래) / 연애운(나·상대·관계) / 켈틱 크로스(10)
- 셔플: `crypto.getRandomValues` 기반 Fisher–Yates (시안의 `sort(() => Math.random() - .5)`는 치우치므로 쓰지 않는다)
- 역방향: 카드 180° 회전 + "역방향" 배지
- `prefers-reduced-motion`이면 셔플·뒤집기 애니메이션을 줄인다
- **저장 기능 없음** → 시안의 기록 탭, `/history`, "기록에 저장", 메모, 최근 리딩,
  도감 "공부 완료" 진행률·반짝 점, 즐겨찾기 ♡는 모두 빼고 구현

### 뽑기 UX (초안)
1. 스프레드·주제 선택 → 짧은 셔플 연출(카드가 모였다가 펼쳐짐)
2. 섞은 덱 중 일부를 부채꼴로 펼친다(원/쓰리카드는 15장, 켈틱 크로스는 22장 정도). 고른 카드는 위로 떠오르고 슬롯에 뒷면으로 들어간다
3. 다 고르면 "결과 보기" → 결과 화면에서 **한 장씩 탭해서 뒤집기**(또는 "모두 뒤집기")
4. 켈틱 크로스 결과
   - 웹: 실제 십자 + 기둥 배치도 + 옆에 해석 목록
   - 모바일: 작은 배치도(현재 자리 하이라이트) + 세로 해석 목록
5. 결과는 URL 쿼리에 담는다(예: `/result?s=three&t=love&c=major-16,major-17r,cups-03`).
   저장이 아니라서 새로고침해도 결과가 유지되고, 링크를 공유할 수도 있다

---

## 7. 데이터 모델 (초안)

```ts
// src/models/card.ts
export type Arcana = 'major' | 'minor'
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles'
export type Topic = 'general' | 'love' | 'work' | 'money'

export interface CardSide {
  summary: string                     // 한 줄 요약
  keywords: string[]
  description: string                 // 기본 설명
  topics: Record<'love' | 'work' | 'money' | 'advice', string>
}

export interface TarotCard {
  id: string            // 'major-00-fool', 'cups-14-king'
  arcana: Arcana
  suit?: Suit
  number: number        // 메이저 0~21, 마이너 1~14 (11~14 = 시종/기사/여왕/왕)
  numeral: string       // 'XVII', 'A', 'Kn' …
  nameKo: string
  nameEn: string
  image: string
  element?: string
  astrology?: string
  upright: CardSide
  reversed: CardSide
  tip?: string          // 롱이의 외우는 팁
}

// src/models/spread.ts
export interface SpreadPosition { key: string; label: string; description: string }
export interface Spread { id: string; name: string; desc: string; jelly: string; fanSize: number; positions: SpreadPosition[] }

// src/models/reading.ts
export interface DrawnCard { cardId: string; positionKey: string; reversed: boolean }
export interface Reading { spreadId: string; topic: Topic; question?: string; cards: DrawnCard[] }

// src/data/combos.ts — 특별 조합
export interface ComboRule { cards: string[]; ordered?: boolean; text: string }
```

---

## 8. 디렉토리 구조 (예정)

```
app/                    React Router framework mode
  root.tsx, routes.ts
  routes/               home, cards, card-detail, draw, result
  components/
    layout/             AppNav(웹 상단 / 모바일 햄버거), MobileHeader, ScrollToTop
    ui/                 Button, Chip, Segmented, Keyword, SpeechBubble, Panel
    longi/              Longi, LongiGuide
    card/               TarotCard, CardBack, CardImage, Lightbox
    reading/            SpreadItem, CardFan, SpreadSlots, CelticLayout, ReadingItem, LongiSummary
  hooks/                useCardFilter, useDraw, useReadingParams, useDailyCard
  utils/                shuffle, seededRandom, interpret, readingQuery, formatNumber
  data/                 major/*.ts, minor/*.ts, spreads.ts, combos.ts
  models/               card.ts, spread.ts, reading.ts
  styles/               index.css (토큰 @theme)
public/cards/           카드 이미지(WebP)
scripts/                download-cards.mjs, generate-icons.mjs
```

컴포넌트는 렌더링만 담당하고, 뽑기·해석 조합·필터링은 hooks/utils로 분리한다.

---

## 9. 작업 순서

1. **스캐폴딩**: React Router framework mode(Vite) + TS, Tailwind v4, 폰트 자체 호스팅, ESLint/Prettier 일체,
   `.editorconfig`/`.gitattributes`/`.vscode`, `vercel.json`, 파비콘(☾ 젤리)
2. **디자인 시스템**: 토큰 이식, 공통 UI 컴포넌트, 롱이(임시 CSS), 레이아웃(상단 nav/하단 탭바)
3. **이미지 파이프라인**: 78장 다운로드 → WebP, 카드 뒷면 SVG
4. **데이터**: 메이저 22장 콘텐츠 → 사용자 검수 → 마이너 56장, 스프레드, 특별 조합
5. **도감**: 목록·필터·검색 → 상세 → 라이트박스 (prerender 확인)
6. **뽑기**: 스프레드/주제 → 셔플·부채꼴 선택 → 결과(뒤집기, 해석 조합, 켈틱 배치)
7. **홈**: 오늘의 카드 + 스프레드 진입
8. **마무리**: 반응형 점검, Lighthouse 100 목표, 배포

---

## 10. 미결정 사항

- [ ] 자체 카드 일러스트: 샘플 몇 장을 보고 스타일 확정
- [ ] prerender 도입 최종 확정
- 샘플: `.ref/card-samples/` (바보·탑·별·컵 에이스, 미리보기 `index.html`, 이전 디테일 버전은 `v1/`)

---

## 11. 프로젝트 규칙 메모

- 전역 규칙(`~/.claude/CLAUDE.md`)을 그대로 따른다. 특히:
  - lint Error 0 / Warning 0, `format:check`, `tsc` 통과
  - 수치는 3자리 콤마(`formatNumber`)
  - `html { scrollbar-gutter: stable }`, 버튼 `cursor: pointer` 전역 CSS
  - 라우트 이동 시 `ScrollToTop`
  - 모달/라이트박스는 `createPortal`, 방향키·휠 이동
- 커밋 author는 jratul만. `Co-Authored-By` 넣지 않는다.
- `.ref/`는 디자인 시안(로컬 전용) — git에 올리지 않는다.
- 카드 이미지는 `loading="lazy"` + 비율 박스로 CLS 방지
