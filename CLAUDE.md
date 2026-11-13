# 타로롱 (tarorong)

타로카드 78장의 정보를 찾아보고, 실제로 스프레드를 골라 카드를 뽑아볼 수 있는 웹 앱.

> 이 문서는 프로젝트 계획서 겸 작업 가이드다. 구현이 진행되면 실제 코드 상태에 맞게 갱신한다.

---

## 1. 기술 스택

| 영역 | 선택 | 비고 |
| --- | --- | --- |
| 프레임워크 | React 19 + TypeScript | |
| 빌드 | Vite | |
| 스타일 | Tailwind CSS v4 | `@tailwindcss/vite` 플러그인, CSS 엔트리 `src/styles/index.css` |
| 라우팅 | React Router | SPA → `vercel.json` rewrites 필수 |
| UI | mokona-ui (검토) | 쓰면 CDN 폰트 `@import` 제거 플러그인 + Dialog 중앙정렬 우회 적용 |
| 애니메이션 | CSS 3D transform (카드 뒤집기) | 필요하면 framer-motion |
| 상태 저장 | localStorage | 뽑기 기록, 설정 |
| 품질 | ESLint(flat config) + Prettier | 전역 룰 1번 기준 그대로 |
| 배포 | Vercel | 정적 빌드 |
| PWA | 2차 목표 | 넣으면 `sw.js` 캐시 헤더 필수 |

---

## 2. 카드 이미지 출처

**1909년판 라이더-웨이트-스미스(RWS) 덱 원본 스캔**을 사용한다.

- 일러스트레이터 Pamela Colman Smith(1951년 사망) 작품으로, 1909년 출간본은 **퍼블릭 도메인**이다
  (미국은 1909년 출판물이라 PD, 사후 70년 기준 국가에서도 2022년부터 PD).
- 출처: **Wikimedia Commons** — `Category:Rider-Waite tarot deck (Roses & Lilies)` 등에 78장 전체 스캔이
  있다. 파일명 예: `RWS Tarot 01 Magician.jpg`, `Wands01.jpg`, `Cups10.jpg`.
- 주의사항
  - 1971년 이후 U.S. Games Systems의 **재채색판**은 저작권이 따로 있으니 쓰지 않는다. 반드시 1909년
    원본 스캔만 쓴다.
  - "Rider-Waite"는 U.S. Games의 **상표**라서 앱 이름·브랜딩에는 쓰지 않는다. 출처 표기는
    "Pamela Colman Smith, 1909 (Public Domain)"처럼 한다.
  - 이미지는 핫링크하지 않고 **다운로드해서 직접 호스팅**한다(`public/cards/`).
    - `scripts/download-cards.mjs`로 받고, `sharp`로 WebP 변환 + 리사이즈(썸네일 / 상세용 2가지).
    - 파일명 규칙: `major-00-fool.webp`, `wands-01-ace.webp`, `cups-14-king.webp` …
- 카드 뒷면: 직접 SVG로 그린다(저작권 이슈 없음, 앱 브랜드 컬러 반영).

카드 **의미 텍스트**는 A.E. Waite의 『The Pictorial Key to the Tarot』(1911, 퍼블릭 도메인)를 기반으로
한국어로 직접 정리해 `src/data/`에 넣는다. 외부 API에 의존하지 않는다.

---

## 3. 기능 범위

### 1차 (MVP)
1. **카드 도감** (`/cards`)
   - 78장 그리드: 메이저 아르카나 22장 + 마이너 56장(완드·컵·소드·펜타클 각 14장)
   - 필터(전체/메이저/수트별), 이름·키워드 검색
   - 그리드는 `auto-fill + minmax()` 컨테이너 기준 반응형, 썸네일은 padding-percentage 트릭(카드 비율 약 1:1.71)
2. **카드 상세** (`/cards/:id`)
   - 큰 이미지 + 확대보기 라이트박스(방향키/휠로 이전·다음, `createPortal`)
   - 정방향/역방향 의미, 키워드, 원소·점성술 대응, 숫자/궁정 카드 설명
   - 이전/다음 카드 이동
3. **타로 뽑기** (`/reading`)
   - 스프레드 선택: 원 카드 / 쓰리 카드(과거·현재·미래) / 켈틱 크로스(10장)
   - 질문 입력(선택) → 셔플 애니메이션 → 펼쳐진 덱에서 직접 카드 선택 → 하나씩 뒤집기
   - 역방향 포함 여부 옵션(기본 50% 확률)
   - 결과 화면: 자리별 의미 + 카드 의미 요약, 각 카드 상세로 이동
   - 셔플은 `crypto.getRandomValues` 기반 Fisher–Yates
4. **오늘의 카드** (홈 `/`)
   - 날짜 기반 시드로 하루 동안 같은 카드가 나오도록

### 2차
- 뽑기 기록(`/history`): localStorage에 저장, 날짜/질문/결과 다시 보기
- 결과 이미지로 저장·공유
- 다크 모드
- PWA(홈 화면 설치)
- 추가 스프레드(관계 스프레드, 예/아니오 등)

---

## 4. 데이터 모델 (초안)

```ts
// src/models/card.ts
export type Arcana = 'major' | 'minor'
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles'

export interface TarotCard {
  id: string            // 'major-00-fool', 'cups-14-king'
  arcana: Arcana
  suit?: Suit           // 마이너만
  number: number        // 메이저 0~21, 마이너 1~14 (11~14 = 페이지/나이트/퀸/킹)
  nameKo: string        // '바보'
  nameEn: string        // 'The Fool'
  image: string         // '/cards/major-00-fool.webp'
  keywords: { upright: string[]; reversed: string[] }
  meaning: { upright: string; reversed: string }
  description: string   // 그림 묘사·상징
  element?: string
  astrology?: string
}

// src/models/spread.ts
export interface SpreadPosition { key: string; label: string; description: string }
export interface Spread { id: string; name: string; positions: SpreadPosition[] }

// src/models/reading.ts
export interface DrawnCard { cardId: string; position: string; reversed: boolean }
export interface Reading { id: string; spreadId: string; question?: string; cards: DrawnCard[]; createdAt: string }
```

---

## 5. 디렉토리 구조 (예정)

```
src/
  components/
    layout/      RootLayout, Nav(모바일 햄버거), ScrollToTop
    card/        CardImage, CardThumbnail, CardBack, FlipCard, Lightbox
    reading/     SpreadPicker, ShuffleDeck, SpreadBoard, ReadingResult
  pages/         HomePage, CardsPage, CardDetailPage, ReadingPage, HistoryPage
  hooks/         useCardFilter, useReading, useDailyCard, useHistory
  utils/         shuffle, seededRandom, formatNumber
  data/          majorArcana.ts, minorArcana.ts, spreads.ts
  models/        card.ts, spread.ts, reading.ts
  styles/        index.css
public/
  cards/         카드 이미지(WebP)
  favicon.svg
scripts/
  download-cards.mjs, generate-icons.mjs
```

컴포넌트는 렌더링만 담당하고, 뽑기 로직·필터링·저장은 hooks/utils로 분리한다.

---

## 6. 작업 순서

1. **스캐폴딩**: Vite + React + TS, Tailwind v4, React Router, ESLint/Prettier 일체, `.editorconfig`/
   `.gitattributes`/`.vscode`, `vercel.json`, 파비콘(카드/별 모양 SVG), git 초기화 + 원격 연결
2. **이미지 파이프라인**: Wikimedia Commons에서 78장 다운로드 → WebP 변환 스크립트, 카드 뒷면 SVG
3. **데이터**: 78장 한국어 데이터 작성(메이저 먼저 → 마이너), 스프레드 정의
4. **도감**: 목록·필터·검색 → 상세 → 라이트박스
5. **뽑기**: 스프레드 선택 → 셔플/선택/뒤집기 애니메이션 → 결과
6. **홈**: 오늘의 카드 + 진입 버튼
7. **마무리**: 반응형 점검, Lighthouse 100 목표, 배포
8. 2차 기능

---

## 7. 프로젝트 규칙 메모

- 전역 규칙(`~/.claude/CLAUDE.md`)을 그대로 따른다. 특히:
  - lint Error 0 / Warning 0, `format:check`, `tsc` 통과
  - 수치는 3자리 콤마(`formatNumber`)
  - `html { scrollbar-gutter: stable }`, 버튼 `cursor: pointer` 전역 CSS
  - 라우트 이동 시 `ScrollToTop`, 모바일 햄버거 네비
  - 모달/라이트박스는 `createPortal`
- 카드 이미지는 `loading="lazy"` + 명시적 width/height(또는 비율 박스)로 CLS 방지
- 페이지 전환 애니메이션을 넣을 경우 fixed 오버레이 위치 문제 주의(전역 룰 13번)
