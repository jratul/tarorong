# 타로롱 (tarorong)

타로카드 78장의 정보를 찾아보고, 실제로 스프레드를 골라 카드를 뽑아볼 수 있는 웹 앱.
마스코트 **롱이**가 친근한 말투로 안내하고 해석해 준다.

> 이 문서는 프로젝트 계획서 겸 작업 가이드다. 구현이 진행되면 실제 코드 상태에 맞게 갱신한다.
> 현재 단계: 1차(MVP) 기능 구현 완료 — 홈·도감·카드 상세·뽑기·결과. 남은 일은 [10. 남은 일](#10-남은-일) 참고.

---

## 1. 기술 스택

| 영역       | 선택                                               | 비고                                                                                    |
| ---------- | -------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 프레임워크 | React 19 + TypeScript 6.0                          | Next.js는 쓰지 않는다. TS 7은 typescript-eslint가 아직 지원하지 않아(`<6.1`) 6.0을 쓴다 |
| 빌드       | Vite 8                                             |                                                                                         |
| 라우팅     | React Router 8 (framework mode, `ssr: false`)      | 홈·도감·카드 상세 78장·뽑기 화면을 빌드 시 **prerender** (5절)                          |
| 스타일     | Tailwind CSS v4                                    | `@tailwindcss/vite`, 시안 토큰을 `app/app.css`의 `@theme`으로 이식                      |
| 폰트       | Jua(제목) / Gowun Dodum(본문) / DM Mono(숫자·날짜) | `@fontsource/*` 자체 호스팅. 폰트 CSS는 `app/fonts.css`로 분리해 **비동기 로드** (11절) |
| 애니메이션 | CSS transform/transition                           | 부채꼴·뒤집기·셔플. `motion-reduce:`로 모션 줄이기 대응                                 |
| 상태 저장  | **오늘의 카드 시드 1개만** (localStorage)          | 리딩 기록·설정은 저장하지 않는다. 접속할 때마다 새로 뽑는다                             |
| 품질       | ESLint 10(flat config) + Prettier 3                | 전역 룰 1번 기준 그대로                                                                 |
| 테스트     | Vitest 5                                           | 데이터 무결성, 셔플, 시드, 결과 URL, 해석 조합, 조사. `pool: 'vmThreads'` (11절)        |
| 배포       | Vercel                                             | `build/client` 정적 배포. 캐시 헤더는 `vercel.json`                                     |

### 명령어

| 명령                              | 설명                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------- |
| `npm run dev`                     | 개발 서버 (http://localhost:5173, `scripts/with-upper-drive.mjs`로 감싸 실행)   |
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
- **마스코트 롱이**: 시안의 CSS 도형 버전(`components/longi/Longi.tsx`). 나중에 일러스트로 교체 예정
- **컴포넌트**: 시안 `.ref/README.md`의 "클래스 → React 컴포넌트 제안" 표를 따랐다
  (`Button`, `Chip`, `Segmented`, `Keyword`, `Panel`, `Longi`, `SpeechBubble`, `TarotCardFace`, `SpreadItem`, `CardFan` …)
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
- 앞면 프레임(`TarotCardFace`)과 뒷면(`CardBack`)은 모두 **3:5 비율**이다. 같아야 결과 화면에서 뒤집을 때 크기가 튀지 않는다

---

## 4. 해석 방식 — 조각 조합 + 규칙 기반 요약

카드 조합마다 해석을 미리 다 써두는 건 불가능하다. 3장 스프레드만 해도 순서·방향을 포함해
**약 365만 가지**(78×77×76×2³)이고, 켈틱 크로스(10장)는 사실상 무한대다.
그래서 해석을 **조각 단위로 작성하고 조합**한다 (`utils/interpret.ts`).

1. **카드 조각** (`data/meanings/`, 78장 × 정/역): 한 줄 요약, 키워드, 기본 설명,
   **주제별 의미(연애 / 일 / 금전 / 조언)**, 외우는 팁(도감용)
2. **자리 조각** (`data/spreads.ts`): "과거", "장애물" 같은 자리 이름과 설명
3. **롱이의 한마디** (전체 요약): 뽑힌 카드들을 보고 규칙으로 생성한다
   - 메이저 비율 ≥ 50% → "인생의 큰 흐름이 움직이는 시기" / 메이저 0장 → "일상의 선택이 흐름을 만든다"
   - 한 수트가 2장 이상이고 단독 최다 → 완드 = 열정과 행동, 컵 = 감정과 관계, 소드 = 생각과 갈등, 펜타클 = 현실과 돈
   - 역방향 > 50% → 막힘, 내면 점검 / 3장 이상 전부 정방향 → 막힘 없는 흐름
   - 궁정 카드 2장 이상 → 주변 사람의 영향
   - 같은 숫자(1~10) 반복 → 그 숫자의 의미 강조 (`data/combos.ts`의 `NUMBER_MEANINGS`)
   - **특별 조합 20개** (`data/combos.ts`): 탑+별, 연인+컵 2 등 두 장이 함께 나오면 문장을 따로
   - 마지막 자리 카드의 "조언"으로 마무리. 원카드는 요약 + 조언만
   - 요약 태그 = 뽑힌 카드들의 첫 키워드(최대 4개)
   - 문장의 조사는 받침에 맞게 고른다 (`utils/josa.ts`: "컵이", "완드가", "숫자 2가")
4. 질문 내용 자체를 이해하지는 못한다는 게 한계다. AI 해석은 지금은 하지 않는다.

**주제**: 뽑기 전에 종합 / 연애 / 일 / 금전 중 하나를 고른다. 종합이면 기본 설명, 아니면 그 주제 문장을 쓴다.
연애운 스프레드는 자동으로 연애.

**콘텐츠**: 78장 × 2방향 × (요약·설명·연애·일·금전·조언) + 키워드·팁을 Waite 원전(1911, 퍼블릭 도메인)의 의미를
바탕으로 Claude가 친근한 말투로 작성했다. **사용자 검수 대기 중** (10절).

---

## 5. 렌더링 — React Router prerender (Next.js 없이)

- `react-router.config.ts`: `ssr: false` + prerender 목록
  - `/`, `/cards`, `/cards/:id` 78장
  - `/draw`, `/draw/:spread` 4개 — 뽑기 화면은 카드 **뒷면만** 보여서 덱이 무작위여도 HTML이 항상 같다
  - `/result?…`만 SPA (쿼리마다 내용이 다름)
  - 빌드하면 `build/client`에 HTML 85개 + SPA용 `__spa-fallback.html`이 생긴다
- 스프레드는 **경로**(`/draw/celtic`)로 받는다. 쿼리(`?spread=`)로 받으면 prerender된 HTML이 하나뿐이라
  직접 접속 시 hydration 불일치가 생긴다
- 런타임 비용은 없다. 각 페이지가 내용이 채워진 HTML로 먼저 오니까 첫 화면(FCP/LCP)과
  SEO·링크 미리보기(네이버·카톡 등 JS를 실행하지 않는 크롤러)가 좋아진다
- **서빙 규칙** (Vercel과 `npm run preview`가 같다): ① 파일 그대로 → ② 폴더면 `index.html` → ③ 없으면 `__spa-fallback.html`
  - `vite preview`는 쓰지 않는다. `/cards` 같은 prerender 경로에 루트 `index.html`(홈)을 내줘서
    홈 HTML 위에 다른 화면이 hydrate되며 **화면이 두 겹으로 그려진다**(실제로 겪음)
- 빌드 시점에 굳으면 안 되는 값
  - 오늘의 카드: `useSyncExternalStore`의 서버 스냅샷을 `null`로 둬서 브라우저에서만 계산 (`hooks/useDailyCard.ts`)
  - 뽑기 덱: `useState` 초기화 함수에서 섞는다. 화면엔 뒷면만 나오므로 서버·클라이언트 HTML이 같다
- 카드 상세는 `loader` 없이 컴포넌트에서 `getCard(params.id)`로 찾는다. 없는 id는 SPA 폴백으로 와서 "그런 카드는 없어"를 보여준다
- 루트의 `HydrateFallback`: SPA 폴백 HTML(결과 화면)에 헤더와 "별을 불러오는 중…"을 넣어 JS가 오기 전에도 빈 화면이 아니다

---

## 6. 화면과 기능

| 경로                     | 화면      | 내용                                                                                                           |
| ------------------------ | --------- | -------------------------------------------------------------------------------------------------------------- |
| `/`                      | 홈        | 롱이 인사, 오늘의 카드(기기·날짜 시드), 스프레드 목록, 면책 문구                                               |
| `/cards`                 | 도감      | 78장 그리드, 필터(전체/메이저/수트 4종, 개수), 이름·키워드 검색. 필터 안에서 못 찾으면 "전체에서 찾아보기"     |
| `/cards/:id`             | 카드 상세 | 정/역방향 토글, 원소·별자리·숫자, 키워드, 설명, 상황별 의미, 외우는 팁, 이전/다음, 확대 라이트박스(←/→·휠·Esc) |
| `/draw`, `/draw/:spread` | 뽑기      | 스프레드 칩, 주제, 질문(선택, 100자), 역방향 포함 토글, 부채꼴 덱에서 고르기(다시 누르면 취소), 다시 섞기      |
| `/result?s=&t=&c=&q=`    | 결과      | 카드 탭해서 뒤집기 / 모두 뒤집기 → 자리별 해석, 다 뒤집으면 롱이의 한마디 + 태그, 다시 뽑기, 링크 복사         |

- **오늘의 카드**: 첫 방문 때 `crypto.randomUUID()`로 기기 시드를 만들어 localStorage(`tarorong:device-seed`)에 저장하고,
  `시드 + 날짜(한국 시간)`로 카드와 방향을 정한다
  - 같은 기기·브라우저에서는 하루 동안 같은 카드, 자정에 바뀜. 사람(기기)마다 다른 카드
  - 사용자에게 아무것도 입력받지 않는다. 저장하는 건 이 값 하나뿐이다
  - localStorage를 못 쓰는 환경(시크릿 모드 등)에서는 날짜만으로 정한다
- 스프레드: 원카드(1) / 쓰리카드(과거·현재·미래) / 연애운(나·상대·관계) / 켈틱 크로스(10)
- 셔플: `crypto.getRandomValues` + 거부 샘플링 Fisher–Yates (`utils/random.ts`). 카드와 방향은 섞을 때 정해진다
- 역방향: 카드 이미지 180° 회전 + "역방향" 배지. 역방향 포함을 끄면 모두 정방향
- **저장 기능 없음** → 시안의 기록 탭, `/history`, "기록에 저장", 메모, 최근 리딩,
  도감 "공부 완료" 진행률·반짝 점, 즐겨찾기 ♡는 모두 빼고 구현

### 뽑기·결과 UX

1. 스프레드를 고르면 덱을 새로 섞는다(카드가 가운데로 모였다가 0.45초 뒤 펼쳐짐)
2. 섞은 덱에서 **12장**을 부채꼴로 펼친다(모든 스프레드 동일, 이유는 11절). 고른 카드는 위로 떠오르고 슬롯에 뒷면으로 들어간다
3. 다 고르면 "결과 보기" → 결과는 URL 쿼리에 담긴다(예: `/result?s=three&t=love&c=major-16-tower,major-17-star_r,cups-03-three`).
   `_r`은 역방향. 저장이 아니라서 새로고침해도 유지되고 링크로 공유할 수 있다. 잘못된 쿼리면 "결과를 찾을 수 없어"
4. 결과 화면에서 카드를 한 장씩 탭해서 뒤집거나 "모두 뒤집기". 다 뒤집으면 롱이의 한마디가 나온다
5. 켈틱 크로스: 십자(1~6) + 기둥(7~10, 아래에서 위로) 배치도에서 뒤집고, 아래 번호 목록에 해석이 나온다

---

## 7. 데이터 모델

```ts
// app/models/card.ts
export interface TarotCard {
  id
  arcana
  suit?
  number
  numeral
  nameKo
  nameEn
  image
}
export interface SuitInfo {
  id
  nameKo
  nameEn
  element
  theme
} // theme: 요약 문장용 '감정과 관계' 등
export interface CardSide {
  summary
  keywords: string[]
  description
  love
  work
  money
  advice
}
export interface CardMeaning {
  element
  astrology?
  tip
  upright: CardSide
  reversed: CardSide
}

// app/models/reading.ts
export type Topic = 'general' | 'love' | 'work' | 'money'
export interface Spread {
  id
  name
  desc
  about
  fanSize
  fixedTopic?
  jelly
  positions: SpreadPosition[]
}
export interface DrawnCard {
  cardId
  reversed
}
export interface Reading {
  spreadId
  topic
  question?
  cards: DrawnCard[]
}
export interface ReadingItem {
  position
  card
  reversed
  side
  text
} // 해석 조합 결과
export interface ReadingSummary {
  lines: string[]
  tags: string[]
}
export interface ComboRule {
  cards: [string, string]
  text
}
```

카드 의미 데이터는 `data/meanings/define.ts`의 `meaning(원소, 별자리, 팁, [정방향 7칸], [역방향 7칸])`로 짧게 적는다.
키워드는 `'시작·자유·순수'`처럼 가운뎃점으로 구분한다.

---

## 8. 디렉토리 구조

```
app/
  root.tsx              <html> 레이아웃, 메타, 폰트 비동기 로드, ScrollRestoration, HydrateFallback, ErrorBoundary
  routes.ts             라우트 정의 (layout 아래 home, cards, cards/:id, draw/:spread?, result)
  app.css               Tailwind + 디자인 토큰(@theme) + 전역 CSS
  fonts.css             웹폰트 @font-face (비동기 로드용으로 분리)
  routes/               layout, home, cards, card-detail, draw, result
  components/
    layout/             AppNav (웹 상단 / 모바일 햄버거)
    card/               TarotCardFace, CardBack, FlipCard, Lightbox
    ui/                 Button(ButtonLink), Chip, Segmented, Keyword(KeywordList), Panel(SectionTitle)
    longi/              Longi, LongiGuide(SpeechBubble)
    reading/            SpreadItem, CardFan, SpreadSlots, ReadingItemCard(OrientationBadge), CelticLayout, LongiSummary
  hooks/                useMenuToggle, useCardFilter, useDailyCard, useDraw, useFlips
  utils/                formatNumber, meta, random, seededRandom, dailyCard, readingQuery, interpret, searchCards, josa
  data/                 cards, nav, spreads, combos, meanings/(define, major, wands, cups, swords, pentacles, index)
  models/               card, reading
public/
  cards/                카드 일러스트 SVG 78장 + back.svg (생성물, 직접 수정 금지 → scripts/cards 수정 후 npm run cards)
  favicon.svg, apple-touch-icon.png, robots.txt
scripts/
  cards/                카드 일러스트 생성 스크립트
  preview.mjs           Vercel 규칙 로컬 미리보기 서버 (gzip·캐시 헤더 포함)
  with-upper-drive.mjs  dev 서버 래퍼 (Windows 드라이브 대소문자)
  generate-icons.mjs
```

컴포넌트는 렌더링만 담당하고, 뽑기·해석 조합·필터링·시드는 hooks/utils로 분리한다.

---

## 9. 작업 순서

1. ~~스캐폴딩~~ 완료
2. ~~카드 일러스트 78장 + 뒷면~~ 완료
3. ~~카드 의미 78장, 스프레드, 특별 조합, 해석 로직~~ 완료 (검수 대기)
4. ~~공통 UI 컴포넌트, 롱이(CSS)~~ 완료
5. ~~도감(필터·검색), 상세(정/역 토글·의미·라이트박스)~~ 완료
6. ~~뽑기(셔플·부채꼴), 결과(뒤집기·해석·켈틱 배치·링크 복사)~~ 완료
7. ~~홈(오늘의 카드·스프레드)~~ 완료
8. ~~반응형 점검, Lighthouse 점검~~ 완료 (11절의 점수)
9. Vercel 배포

---

## 10. 남은 일

- [ ] **카드 의미 텍스트 검수** (사용자): `app/data/meanings/*.ts`
- [ ] **Vercel 배포**: 저장소 연결 필요. 배포 후 도메인이 정해지면 `sitemap.xml`과 `og:image`(링크 미리보기 이미지) 추가
- [ ] 카드 뒷면 최종안: 지금은 A안(핑크). B안(밤하늘 롱이)으로 바꿀지
- [ ] 롱이 일러스트 교체 (지금은 CSS 도형)
- [ ] 2차 후보: 결과 이미지로 저장, PWA, 추가 스프레드(예/아니오 등)
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
- 카드 이미지는 `loading="lazy"` + `width`/`height` 지정으로 CLS 방지. 첫 화면 카드는 `priority`(eager + `fetchPriority="high"`)
- 카드 프레임 안쪽 여백·글자 크기는 `%` padding을 쓰지 않는다. `%` padding은 **부모 너비** 기준이라 작은 카드에서
  여백이 카드보다 커져 그림이 사라진다(샘플 미리보기에서 실제로 겪음). `TarotCardFace`처럼 `@container` + `cqw`로 계산한다.
  카드 안 글자는 최소 12px(`max(12px, …cqw)`) — 작으면 Lighthouse "읽기 어려운 글자"에 걸린다
- **폰트 성능**
  - 한글 폰트는 글자 범위별 조각이 수백 개라 `@font-face`만으로 CSS가 100KB가 넘는다. 메인 CSS에 넣으면 렌더링을 막으므로
    `app/fonts.css`로 분리해 root.tsx의 인라인 스크립트가 `media="print"` → 로드 후 `all`로 붙인다. `rel=preload`는 걸지 않는다
    (최우선 리소스가 되어 첫 화면이 늦어진다 — 실제로 측정함)
  - `vite.config.ts`의 `assetsInlineLimit`로 폰트 파일은 base64 인라인을 막는다. 막지 않으면 4KB 이하 조각이 전부 CSS에 박혀
    CSS가 200KB 가까이 되고, 쓰지 않는 글자 조각까지 다 받는다
- **부채꼴 덱은 12장**: 모바일 폭(약 358px)에서 카드 사이 간격 24px 이상(터치 영역 기준)을 지킬 수 있는 최대치다.
  13장부터 Lighthouse target-size에 걸린다. 켈틱 크로스도 12장 중 10장을 고른다
- **Lighthouse** (로컬 `npm run preview`, 모바일 기준, 3회 중앙값): 홈·도감·카드 상세·뽑기 성능 95~97 / 접근성·Best Practices·SEO 100.
  결과 화면만 성능 약 80 — 쿼리마다 내용이 달라 prerender할 수 없는 SPA라 JS 실행 후 본문이 그려진다
- **`npm run dev`는 `scripts/with-upper-drive.mjs`로 감싸 실행한다**: Windows에서 셸 경로가 소문자 드라이브(`d:\`)면
  `react-router dev`가 모든 페이지에 404(`Cannot GET /`)를 낸다. 작업 경로와 PATH(`node_modules\.bin`)의 드라이브 문자를
  대문자로 바꿔 실행한다. 작업 경로만 바꾸면 소용없고 PATH까지 바꿔야 한다(실제로 확인함)
- **Vitest는 `pool: 'vmThreads'`**: Windows에서 셸 경로가 소문자 드라이브(`d:\`)면 기본 풀이 vitest 모듈을
  `D:/`와 `d:/`로 이중 로드해 모든 테스트가 `Cannot read properties of undefined (reading 'config')`로 깨진다
- **화면 확인 방법**: Edge 헤드리스 `--screenshot`은 창 폭이 최소 504px로 그려진다(390px 지정해도 504px).
  클릭이 필요한 흐름·모바일 폭은 Edge를 `--remote-debugging-port`로 띄우고 puppeteer-core로 `connect`해서 확인한다
  (`puppeteer.launch`는 이 환경에서 Edge가 바로 종료됨). 부채꼴 카드는 겹쳐 있어 좌표 클릭 대신 `el.click()`으로 누른다
- **React Hooks 린트(React Compiler 규칙)**: 이벤트 리스너에 최신 props가 필요하면 `useCallback` 의존성 대신
  `useEffectEvent`를 쓴다(`Lightbox.tsx`). effect 안에서 동기 `setState`도 금지라, 브라우저 전용 값은 `useSyncExternalStore`로 읽는다

---

## 12. 참고 문서

- [README.md](README.md) — 프로젝트 소개, 시작하기, 기술적 하이라이트
- [TECH.md](TECH.md) — 파일별로 어떤 기술을 어떻게 썼는지 (코드 예시 포함). 파일을 추가·변경하면 함께 갱신한다
- [PROJECT.md](PROJECT.md) — 설정 파일 역할과 패키지별 사용처. 패키지를 추가·제거하면 함께 갱신한다
