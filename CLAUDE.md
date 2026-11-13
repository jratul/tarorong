# 타로롱 (tarorong)

타로카드 78장의 정보를 찾아보고, 실제로 스프레드를 골라 카드를 뽑아볼 수 있는 웹 앱.
마스코트 **롱이**가 친근한 말투로 안내하고 해석해 준다.

> 이 문서는 프로젝트 계획서 겸 작업 가이드다. 구현이 진행되면 실제 코드 상태에 맞게 갱신한다.
> 현재 단계: 스캐폴딩 + 카드 일러스트 78장 완료 → 다음은 카드 콘텐츠(의미 텍스트) 작성. [9. 작업 순서](#9-작업-순서) 참고.

---

## 1. 기술 스택

| 영역       | 선택                                               | 비고                                                                                    |
| ---------- | -------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 프레임워크 | React 19 + TypeScript 6.0                          | Next.js는 쓰지 않는다. TS 7은 typescript-eslint가 아직 지원하지 않아(`<6.1`) 6.0을 쓴다 |
| 빌드       | Vite 8                                             |                                                                                         |
| 라우팅     | React Router 8 (framework mode, `ssr: false`)      | 홈·도감·카드 상세 78장을 빌드 시 **prerender** (5절)                                    |
| 스타일     | Tailwind CSS v4                                    | `@tailwindcss/vite`, 시안 토큰을 `app/app.css`의 `@theme`으로 이식                      |
| 폰트       | Jua(제목) / Gowun Dodum(본문) / DM Mono(숫자·날짜) | `@fontsource/*`로 **자체 호스팅**. 한글은 글자 범위별 조각이라 쓰인 글자 조각만 받는다  |
| 애니메이션 | CSS transform/transition                           | 부채꼴·뒤집기·셔플. 부족하면 framer-motion                                              |
| 상태 저장  | **오늘의 카드 시드 1개만** (localStorage)          | 리딩 기록·설정은 저장하지 않는다. 접속할 때마다 새로 뽑는다                             |
| 품질       | ESLint 10(flat config) + Prettier 3                | 전역 룰 1번 기준 그대로                                                                 |
| 테스트     | Vitest 5                                           | 셔플, 해석 조합 로직 단위 테스트. `pool: 'vmThreads'` (11절 참고)                       |
| 배포       | Vercel                                             | `build/client` 정적 배포                                                                |

### 명령어

| 명령                              | 설명                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------- |
| `npm run dev`                     | 개발 서버                                                                       |
| `npm run build`                   | 프로덕션 빌드 + prerender (`build/client`)                                      |
| `npm run preview`                 | 빌드 결과를 **Vercel과 같은 규칙**으로 띄우는 로컬 서버 (`scripts/preview.mjs`) |
| `npm run typecheck`               | 라우트 타입 생성 + `tsc`                                                        |
| `npm run lint` / `lint:fix`       | ESLint                                                                          |
| `npm run format` / `format:check` | Prettier                                                                        |
| `npm test`                        | Vitest                                                                          |
| `npm run cards`                   | 카드 일러스트 SVG 78장 + 뒷면 재생성 (`scripts/cards/`)                         |
| `npm run icons`                   | `public/favicon.svg` → `apple-touch-icon.png`                                   |

---

## 2. 디자인 — "밤하늘 젤리"

시안은 `.ref/`(로컬 전용, git 제외)에 있다. HTML/CSS 정적 마크업이며 **모바일 우선**,
`min-width: 1024px`(Tailwind `lg`)부터 웹 레이아웃으로 바뀐다.

- **토큰** (`.ref/css/tokens.css` → `app/app.css`의 `@theme`)
  - 색: `night` #1e1a3a / `night-deep` #0f0c22 / `surface` #2c2652 / `cream`(텍스트) #f6f1ff / `ink` #1e1a3a
  - 젤리 포인트: `gold` #ffe9a6 · `pink` #ffc7e3 · `rose` #ffb1d6 · `sky` #b9e6ff · `lilac` #e6dcff
  - 밝은 젤리 위 텍스트는 항상 `text-ink`
  - 그림자: `shadow-glow-gold`, `shadow-glow-pink`, `shadow-float`. 배경은 별 점 패턴
  - 폰트: `font-display`(Jua), `font-sans`(Gowun Dodum, 기본), `font-mono`(DM Mono)
- **네비게이션**: 웹은 상단 메뉴. 모바일(`lg` 미만)은 시안의 하단 탭바 대신 **햄버거 메뉴**(메뉴 확장 대비, 전역 룰 7번).
  링크를 누르거나, 페이지가 바뀌거나, Esc를 누르면 닫힌다 (`hooks/useMenuToggle.ts`)
- **마스코트 롱이**: 지금은 CSS 도형으로 만든 임시 버전 → 나중에 일러스트로 교체. `<Longi size mood />`
- **컴포넌트 매핑**: `.ref/README.md`의 "클래스 → React 컴포넌트 제안" 표를 따른다
  (`Button`, `Chip`, `Segmented`, `Longi`, `SpeechBubble`, `TarotCard`, `SpreadItem`, `Keyword`, `CardFan` …)
- **말투**: 반말, 친근하게. "별빛 친구", "~해봐", "~일 거야". 모든 해석 텍스트도 같은 톤.

---

## 3. 카드 일러스트 — 타로롱 전용 SVG 78장 + 뒷면 (완료)

- `scripts/cards/`의 생성 스크립트가 `public/cards/{id}.svg`를 만든다 (`npm run cards`). 장당 약 6.5KB, 전체 약 500KB
  - `lib.mjs`: 공통 부품 — 배경, 젤리 캐릭터(색·표정·팔·모자), 컵·완드·소드·펜타클, 말·개·사자, 구름 손 등
  - `major.mjs` / `minor.mjs`: 카드별 장면 정의
  - `handmade/`: 손으로 그린 원본(바보·탑·별·컵 에이스, 뒷면 A/B안). 빌드 시 그대로 복사
  - 그림 영역 viewBox `0 0 256 372`. 숫자·이름 띠는 SVG가 아니라 `TarotCardFace` 컴포넌트가 붙인다
- RWS(라이더-웨이트-스미스) 상징을 바탕으로 표현은 젤리 톤으로 바꿨다(RWS 1909년판은 퍼블릭 도메인).
  "Rider-Waite"는 상표라 앱 이름·브랜딩에 쓰지 않는다
- **직관성 최우선**: 카드를 딱 봤을 때 "아, 별이다", "아, 바보다"를 알 수 있어야 한다
  - 메이저: **주인공 상징 1개를 크게**(화면의 절반 가까이), 보조 상징은 **1~2개만**. 작은 장식은 넣지 않는다
  - 마이너: **수트 상징의 개수가 한눈에 세어질 것** + 원작의 대표 장면 하나(예: 소드 3 = 칼 세 자루가 꽂힌 하트)
  - 도감 썸네일 크기에서도 알아볼 수 있는지 렌더링해서 확인한다
- **뒷면**: `public/cards/back.svg` = A안(핑크 젤리 + 밤하늘 메달 + 위아래 졸린 초승달).
  B안(밤하늘 + 위아래로 마주 보는 롱이)은 `handmade/back-b.svg`에 보관
  - 뒷면은 반드시 **180° 회전 대칭**이어야 한다. 아니면 뒷면만 보고 역방향 카드를 알아챌 수 있다

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

- `react-router.config.ts`: `ssr: false` + `prerender: ['/', '/cards', ...카드 78장]`
  → 빌드하면 `build/client`에 HTML 80개 + SPA용 `__spa-fallback.html`이 생긴다
- prerender 대상: `/`, `/cards`, `/cards/:id` 78장. `/draw`, `/result`는 SPA
- 런타임 비용은 없다. 각 페이지가 내용이 채워진 HTML로 먼저 오니까 첫 화면(FCP/LCP)과
  SEO·링크 미리보기(네이버·카톡 등 JS를 실행하지 않는 크롤러)가 좋아진다
- **서빙 규칙** (Vercel과 `npm run preview`가 같다): ① 파일 그대로 → ② 폴더면 `index.html` → ③ 없으면 `__spa-fallback.html`
  - `vite preview`는 쓰지 않는다. `/cards` 같은 prerender 경로에 루트 `index.html`(홈)을 내줘서
    홈 HTML 위에 다른 화면이 hydrate되며 **화면이 두 겹으로 그려진다**(실제로 겪음)
- 주의
  - 랜덤 뽑기, 오늘 날짜 같은 값은 빌드 시점에 굳으면 안 되므로 **클라이언트에서만**(`useEffect` 이후) 계산한다
  - 카드 상세는 `loader` 없이 컴포넌트에서 `getCard(params.id)`로 찾는다. 없는 id는 SPA 폴백으로 와서 "그런 카드는 없어"를 보여준다

---

## 6. 화면과 기능

| 경로         | 화면      | 내용                                                                                                                          | 상태        |
| ------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `/`          | 홈        | 롱이 인사, 오늘의 카드, 스프레드 목록, 뽑기/도감 바로가기                                                                     | 뼈대만      |
| `/cards`     | 도감      | 78장 그리드, 필터(전체/메이저/수트 4종, 개수 표시), 이름·키워드 검색                                                          | 그리드만    |
| `/cards/:id` | 카드 상세 | 큰 카드 + 정/역방향 토글, 원소·별자리·숫자, 키워드, 기본 설명, 주제별 의미, 롱이의 외우는 팁, 이전/다음 카드, 확대 라이트박스 | 카드·이동만 |
| `/draw`      | 뽑기      | 스프레드 칩, 주제, 질문(선택), 역방향 포함 토글, 부채꼴 덱에서 카드 고르기, 다시 섞기                                         | 자리만      |
| `/result`    | 결과      | 카드 뒤집기 연출 → 자리별 해석 → 롱이의 한마디 + 태그 → 다시 뽑기                                                             | 자리만      |

- **오늘의 카드**: 첫 방문 때 랜덤 숫자 하나(`deviceSeed`)를 만들어 localStorage에 저장하고,
  `deviceSeed + 날짜(한국 시간)`를 시드로 카드와 방향을 정한다
  - 같은 기기·브라우저에서는 하루 동안 같은 카드, 자정에 바뀜. 사람(기기)마다 다른 카드
  - 사용자에게 아무것도 입력받지 않는다. 저장하는 건 이 숫자 하나뿐이다(리딩 기록 등은 저장하지 않음)
  - localStorage를 못 쓰는 환경(시크릿 모드 등)에서는 날짜만으로 시드를 정한다
  - 빌드 시점에 굳지 않도록 브라우저에서 계산한다
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

## 7. 데이터 모델

구현됨: `app/models/card.ts`의 `TarotCard`(id·arcana·suit·number·numeral·nameKo·nameEn·image), `SuitInfo`.
`app/data/cards.ts`에 78장 기본 데이터 + `getCard`, `getAdjacentCards`. 아래는 콘텐츠 단계에서 추가할 부분.

```ts
// 카드 의미 (콘텐츠 단계에서 추가)
export interface CardSide {
  summary: string // 한 줄 요약
  keywords: string[]
  description: string // 기본 설명
  topics: Record<'love' | 'work' | 'money' | 'advice', string>
}
export interface CardMeaning {
  cardId: string
  element?: string
  astrology?: string
  upright: CardSide
  reversed: CardSide
  tip?: string // 롱이의 외우는 팁
}

// app/models/spread.ts
export interface SpreadPosition {
  key: string
  label: string
  description: string
}
export interface Spread {
  id: string
  name: string
  desc: string
  jelly: string
  fanSize: number
  positions: SpreadPosition[]
}

// app/models/reading.ts
export interface DrawnCard {
  cardId: string
  positionKey: string
  reversed: boolean
}
export interface Reading {
  spreadId: string
  topic: Topic
  question?: string
  cards: DrawnCard[]
}

// app/data/combos.ts — 특별 조합
export interface ComboRule {
  cards: string[]
  ordered?: boolean
  text: string
}
```

---

## 8. 디렉토리 구조

```
app/
  root.tsx              <html> 레이아웃, 메타, ScrollRestoration, ErrorBoundary
  routes.ts             라우트 정의 (layout 아래 home, cards, cards/:id, draw, result)
  app.css               Tailwind + 디자인 토큰(@theme) + 전역 CSS
  routes/               layout, home, cards, card-detail, draw, result
  components/
    layout/             AppNav (웹 상단 / 모바일 햄버거)
    card/               TarotCardFace  (+ 예정: CardBack, Lightbox, FlipCard)
    ui/                 (예정) Button, Chip, Segmented, Keyword, SpeechBubble, Panel
    longi/              (예정) Longi, LongiGuide
    reading/            (예정) SpreadItem, CardFan, SpreadSlots, CelticLayout, ReadingItem, LongiSummary
  hooks/                useMenuToggle  (+ 예정: useCardFilter, useDraw, useReadingParams, useDailyCard)
  utils/                formatNumber, meta  (+ 예정: shuffle, seededRandom, interpret, readingQuery)
  data/                 cards, nav  (+ 예정: meanings/, spreads, combos)
  models/               card  (+ 예정: spread, reading)
public/
  cards/                카드 일러스트 SVG 78장 + back.svg (생성물, 직접 수정 금지 → scripts/cards 수정 후 npm run cards)
  favicon.svg, apple-touch-icon.png
scripts/
  cards/                카드 일러스트 생성 스크립트
  preview.mjs           Vercel 규칙 로컬 미리보기 서버
  generate-icons.mjs
```

컴포넌트는 렌더링만 담당하고, 뽑기·해석 조합·필터링은 hooks/utils로 분리한다.

---

## 9. 작업 순서

1. ~~**스캐폴딩**~~ 완료
2. ~~**카드 일러스트**~~ 78장 + 뒷면 완료
3. **데이터**: 메이저 22장 콘텐츠 → 사용자 검수 → 마이너 56장, 스프레드, 특별 조합
4. **디자인 시스템**: 공통 UI 컴포넌트(Button, Chip, Segmented, SpeechBubble …), 롱이(임시 CSS)
5. **도감**: 필터·검색 → 상세(정/역 토글, 의미) → 라이트박스
6. **뽑기**: 스프레드/주제 → 셔플·부채꼴 선택 → 결과(뒤집기, 해석 조합, 켈틱 배치)
7. **홈**: 오늘의 카드 + 스프레드 진입
8. **마무리**: 반응형 점검, Lighthouse 100 목표, 배포

---

## 10. 미결정 사항

- [ ] 카드 뒷면 최종안: 지금은 A안(핑크) 적용. B안(밤하늘 롱이)으로 바꿀지
- 디자인 샘플: `.ref/card-samples/` (초기 샘플, 미리보기 `index.html`, 디테일 많은 첫 버전은 `v1/`)

---

## 11. 프로젝트 규칙 메모

- 전역 규칙(`~/.claude/CLAUDE.md`)을 그대로 따른다. 특히:
  - lint Error 0 / Warning 0, `format:check`, `typecheck`, `test` 통과
  - 수치는 3자리 콤마(`formatNumber`)
  - `html { scrollbar-gutter: stable }`, 버튼 `cursor: pointer` 전역 CSS (`app/app.css`)
  - 모달/라이트박스는 `createPortal`, 방향키·휠 이동
- 스크롤 리셋은 별도 `ScrollToTop` 대신 React Router의 `<ScrollRestoration />`(root.tsx)을 쓴다.
  새 페이지는 맨 위에서 시작하고, 뒤로 가기는 이전 위치를 복원해서 더 낫다
- 커밋 author는 jratul만. `Co-Authored-By` 넣지 않는다.
- `.ref/`는 디자인 시안(로컬 전용) — git에 올리지 않는다.
- 카드 이미지는 `loading="lazy"` + `width`/`height` 지정으로 CLS 방지. 첫 화면의 큰 카드는 `priority`
- 카드 프레임 안쪽 여백·글자 크기는 `%` padding을 쓰지 않는다. `%` padding은 **부모 너비** 기준이라 작은 카드에서
  여백이 카드보다 커져 그림이 사라진다(샘플 미리보기에서 실제로 겪음). `TarotCardFace`처럼 `@container` + `cqw`로 계산한다
- **Vitest는 `pool: 'vmThreads'`**: Windows에서 셸 경로가 소문자 드라이브(`d:\`)면 기본 풀이 vitest 모듈을
  `D:/`와 `d:/`로 이중 로드해 모든 테스트가 `Cannot read properties of undefined (reading 'config')`로 깨진다
- **Edge 헤드리스로 화면 캡처할 때 창 폭은 최소 504px**로 그려진다. 390px로 지정해도 504px로 렌더링하고 잘라서 찍으니
  모바일 확인은 504px로 찍는다

---

## 12. 참고 문서

- [README.md](README.md) — 프로젝트 소개, 시작하기, 기술적 하이라이트
- [TECH.md](TECH.md) — 파일별로 어떤 기술을 어떻게 썼는지 (코드 예시 포함). 파일을 추가·변경하면 함께 갱신한다
- [PROJECT.md](PROJECT.md) — 설정 파일 역할과 패키지별 사용처. 패키지를 추가·제거하면 함께 갱신한다
