# TECH — 파일별 기술 기록

각 파일에 어떤 기술이 어떻게 쓰였는지 기록한다. 설정 파일과 패키지는 [PROJECT.md](PROJECT.md),
프로젝트 규칙과 계획은 [CLAUDE.md](CLAUDE.md) 참고.

---

## 앱 진입점

### `app/root.tsx` — HTML 레이아웃, 폰트 비동기 로드, 폴백, 에러 화면

React Router framework mode의 루트 모듈. `<ScrollRestoration />`이 새 페이지는 맨 위에서 시작하게 하고 뒤로 가기는
위치를 복원한다(별도 `ScrollToTop`을 두지 않는 이유). 폰트 CSS는 `?url`로 빌드된 주소만 받아, 인라인 스크립트가
`media="print"`(최하위 우선순위)로 붙였다가 로드되면 `all`로 바꾼다. 렌더링을 막지 않고, `preload`도 걸지 않는다.

```tsx
import fontsHref from './fonts.css?url'

const loadFonts = `(function(){var l=document.createElement('link');l.rel='stylesheet';l.media='print';l.href=${JSON.stringify(fontsHref)};l.onload=function(){l.media='all'};document.head.appendChild(l)})()`

<head>
  <Meta />
  <Links />
  <script dangerouslySetInnerHTML={{ __html: loadFonts }} />
  <noscript>
    <link rel="stylesheet" href={fontsHref} />
  </noscript>
</head>
```

`HydrateFallback`은 prerender하지 않는 화면(결과)의 SPA 폴백 HTML에 들어가, JS가 오기 전에도 헤더와 안내가 보이게 한다.

```tsx
export function HydrateFallback() {
  return (
    <main className="flex flex-col items-center gap-3 px-4 pt-24 text-center">
      <p className="font-display text-xl text-gold">별을 불러오는 중…</p>
    </main>
  )
}
```

`ErrorBoundary`는 404와 그 밖의 오류를 롱이 말투로 보여주고, 개발 모드에서만 스택을 출력한다.

```tsx
if (isRouteErrorResponse(error)) {
  message = error.status === 404 ? '길을 잃었어' : '앗, 문제가 생겼어'
} else if (import.meta.env.DEV && error instanceof Error) {
  stack = error.stack
}
```

### `app/routes.ts` — 라우트 정의

모든 화면을 `layout` 라우트 하나로 감싸 공통 헤더를 공유한다. 뽑기는 선택적 경로 파라미터(`:spread?`)로
스프레드별 URL을 만들어 각각 prerender한다.

```ts
export default [
  layout('routes/layout.tsx', [
    index('routes/home.tsx'),
    route('cards', 'routes/cards.tsx'),
    route('cards/:id', 'routes/card-detail.tsx'),
    route('draw/:spread?', 'routes/draw.tsx'),
    route('result', 'routes/result.tsx'),
  ]),
] satisfies RouteConfig
```

### `app/app.css` — Tailwind v4 + 디자인 토큰 + 전역 CSS

`@theme`에 시안 토큰을 넣으면 `bg-night`, `text-gold`, `font-display`, `shadow-glow-pink` 같은 유틸리티가 생긴다.
폰트 `@import`는 `fonts.css`로 옮겨 메인 CSS를 30KB(gzip 6.6KB)로 줄였다.

```css
@import 'tailwindcss';

@theme {
  --color-night: #1e1a3a;
  --color-gold: #ffe9a6;
  --font-display: 'Jua', ui-sans-serif, sans-serif;
  --shadow-glow-pink: 0 0 22px rgb(255 199 227 / 0.45);
}

html {
  scrollbar-gutter: stable; /* body에 걸면 효과가 없다 */
}
button:not(:disabled) {
  cursor: pointer;
}
```

### `app/fonts.css` — 웹폰트 모음 (비동기 로드용)

한글 폰트는 글자 범위(unicode-range)별 조각 수백 개로 나뉘어 `@font-face`만으로 CSS가 100KB가 넘는다.
메인 CSS와 분리해 첫 화면을 막지 않게 하고, 브라우저는 화면에 쓰인 글자가 속한 조각만 받는다.

```css
@import '@fontsource/jua';
@import '@fontsource/gowun-dodum';
@import '@fontsource/dm-mono/400.css';
@import '@fontsource/dm-mono/500.css';
```

---

## 라우트 (`app/routes/`)

### `layout.tsx` — 공통 레이아웃

```tsx
export default function SiteLayout() {
  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-300 px-4 pt-6 pb-16">
        <Outlet />
      </main>
    </>
  )
}
```

### `home.tsx` — 홈

오늘의 카드는 `useDailyCard()`가 브라우저에서만 값을 주므로, prerender HTML과 첫 hydration에서는 카드 뒷면이 보이고
곧바로 오늘의 카드로 바뀐다.

```tsx
function TodayCard() {
  const daily = useDailyCard()
  return (
    <div className="w-24 shrink-0">
      {daily ? <TarotCardFace card={daily.card} reversed={daily.reversed} priority /> : <CardBack />}
    </div>
  )
}
```

### `cards.tsx` — 도감

열 개수는 뷰포트가 아니라 그리드 자신의 너비 기준(`auto-fill` + `minmax`). 첫 화면 6장은 지연 로딩하지 않는다(LCP).
필터 안에서 검색 결과가 없으면 어느 필터였는지 알려주고 "전체에서 찾아보기"를 띄운다.

```tsx
const { filter, setFilter, query, setQuery, cards } = useCardFilter()

<ul className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-x-3 gap-y-4">
  {cards.map((card, i) => (
    <li key={card.id}>
      <Link to={`/cards/${card.id}`}>
        <TarotCardFace card={card} priority={i < 6} />
      </Link>
    </li>
  ))}
</ul>
```

### `card-detail.tsx` — 카드 상세

`loader` 없이 `params.id`로 카드를 찾는다. `meta`도 `params`로 카드별 제목·설명(요약과 키워드)을 만들어 prerender HTML에 넣는다.
정/역방향은 `Segmented`로 바꾸고, 카드를 누르면 라이트박스가 열린다. 라이트박스의 이전/다음은 실제로 다음 카드 페이지로 이동한다
(같은 라우트라 컴포넌트가 유지되어 라이트박스가 열린 채로 넘어간다).

```tsx
const [orientation, setOrientation] = useState<Orientation>('upright')
const side = m[orientation]

{
  zoomed && (
    <Lightbox
      card={card}
      reversed={reversed}
      onClose={() => setZoomed(false)}
      onPrev={prev ? () => navigate(`/cards/${prev.id}`) : undefined}
      onNext={next ? () => navigate(`/cards/${next.id}`) : undefined}
    />
  )
}
```

### `draw.tsx` — 뽑기

스프레드는 경로 파라미터로 받는다. 스프레드를 바꾸면 `DrawStage`를 `key`로 다시 마운트해서 덱을 새로 섞고,
질문과 역방향 설정은 바깥 컴포넌트에 둬서 유지한다. 결과는 저장하지 않고 URL로 넘긴다.

```tsx
export default function Draw({ params }: Route.ComponentProps) {
  const spread = getSpread(params.spread) ?? getSpread(DEFAULT_SPREAD)!
  const selectSpread = (next: Spread) => navigate(`/draw/${next.id}`, { replace: true, preventScrollReset: true })
  return <DrawStage key={spread.id} spread={spread} question={question} allowReversed={allowReversed} />
}

const showResult = () => {
  const cards = pickedCards.map((c) => ({ ...c, reversed: allowReversed && c.reversed }))
  navigate(`/result?${encodeReading({ spreadId: spread.id, topic, question, cards })}`)
}
```

### `result.tsx` — 결과

쿼리를 해석해 잘못됐으면 안내 화면, 맞으면 `ReadingView`. 쿼리가 바뀌면 `key`로 다시 마운트해 뒤집기 상태를 초기화한다.
모든 카드를 뒤집어야 롱이의 한마디가 나온다.

```tsx
const key = params.toString()
const reading = useMemo(() => decodeReading(key), [key])
if (!reading) return <InvalidReading />
return <ReadingView key={key} reading={reading} />

// ReadingView
const items = useMemo(() => buildItems(reading), [reading])
const summary = useMemo(() => summarize(items), [items])
const { flipped, flip, flipAll, allFlipped } = useFlips(items.length)
```

---

## 컴포넌트 (`app/components/`)

### `layout/AppNav.tsx` — 웹 상단 메뉴 / 모바일 햄버거

`lg`(1024px) 이상은 가로 메뉴, 미만은 햄버거 + 펼침 메뉴. 열림 상태는 `useMenuToggle`로 분리했다.

```tsx
<nav aria-label="주 메뉴" className="hidden items-center gap-1 lg:flex">{/* 가로 링크 */}</nav>
<button className="… lg:hidden" aria-expanded={open} aria-controls="mobile-menu" onClick={toggle} />
{open && (
  <nav id="mobile-menu" className="… lg:hidden">
    {NAV_ITEMS.map((item) => (
      <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={close}>{item.label}</NavLink>
    ))}
  </nav>
)}
```

### `card/TarotCardFace.tsx` — 카드 앞면 프레임

시안의 `.tcard--face`(숫자 · 일러스트 · 이름). 전체 비율은 뒷면과 같은 3:5로 고정하고 그림은 `object-cover`로 채운다.
여백·글자 크기는 **카드 자신의 너비 기준**(`@container` + `cqw`)이고, 글자는 최소 12px이다.

```tsx
<div className={`@container ${className}`}>
  <div className="flex aspect-3/5 flex-col gap-[3cqw] rounded-[7cqw] bg-cream p-[7cqw] text-ink shadow-glow-pink">
    <span className="text-center font-mono text-[max(12px,5.5cqw)]">{card.numeral}</span>
    <div className="min-h-0 flex-1 overflow-hidden rounded-[5cqw]">
      <img
        src={card.image}
        width={256}
        height={372}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={`block size-full object-cover ${reversed ? 'rotate-180' : ''}`}
      />
    </div>
    <span className="truncate text-center font-display text-[max(12px,8.5cqw)]">{card.nameKo}</span>
  </div>
</div>
```

### `card/CardBack.tsx` — 카드 뒷면

```tsx
<img
  src="/cards/back.svg"
  alt=""
  width={300}
  height={500}
  draggable={false}
  className={`block aspect-3/5 w-full rounded-[7%] shadow-float select-none ${className}`}
/>
```

### `card/FlipCard.tsx` — 뒤집히는 카드

Tailwind v4의 3D 유틸리티(`perspective-*`, `transform-3d`, `backface-hidden`, `rotate-y-180`)로 앞뒤 두 면을 겹쳐 돌린다.
`motion-reduce:transition-none`으로 모션 줄이기 설정을 따른다.

```tsx
<button className="block perspective-[900px]" onClick={onFlip} disabled={flipped}>
  <span className={`relative block transition-transform duration-700 transform-3d ${flipped ? 'rotate-y-180' : ''}`}>
    <span className="block backface-hidden">
      <CardBack />
    </span>
    <span className="absolute inset-0 block rotate-y-180 backface-hidden">
      <TarotCardFace card={card} reversed={reversed} />
    </span>
  </span>
</button>
```

### `card/Lightbox.tsx` — 확대보기

`createPortal`로 `body`에 그린다(조상에 transform이 있으면 `fixed`가 뷰포트 기준이 아니게 되는 문제 회피).
리스너는 한 번만 붙이고 `useEffectEvent`로 항상 최신 핸들러를 부른다. 휠 연타 방지 시각은 `useRef`에 둬서
카드가 바뀌어 다시 렌더링돼도 초기화되지 않는다(한 번에 한 장씩 넘어감).

```tsx
const lastWheelAt = useRef(0)
const handleWheel = useEffectEvent((e: WheelEvent) => {
  e.preventDefault()
  const now = Date.now()
  if (now - lastWheelAt.current < WHEEL_GAP_MS) return
  lastWheelAt.current = now
  if (e.deltaY > 0) onNext?.()
  else if (e.deltaY < 0) onPrev?.()
})
useEffect(() => {
  const onWheel = (e: WheelEvent) => handleWheel(e)
  window.addEventListener('wheel', onWheel, { passive: false }) // passive: false여야 뒤 페이지 스크롤을 막는다
  return () => window.removeEventListener('wheel', onWheel)
}, [])
```

### `ui/Button.tsx` — 버튼 / 링크 버튼

시안의 `.btn--gold/pink/ghost`, `--sm`, `--block`. `button`과 React Router `Link` 두 가지로 같은 스타일을 쓴다.

```tsx
const VARIANT = {
  gold: 'bg-gold text-ink shadow-glow-gold',
  pink: 'bg-pink text-ink',
  ghost: 'bg-surface text-cream',
}
export function ButtonLink({ variant, size, block, className = '', ...rest }: StyleProps & LinkProps) {
  return <Link className={`${buttonClass(variant, size, block)} ${className}`} {...rest} />
}
```

### `ui/Chip.tsx` — 칩

```tsx
<button
  type="button"
  aria-pressed={active}
  className={`shrink-0 rounded-full px-3.5 py-2 font-display text-sm ${active ? 'bg-gold text-ink' : 'bg-white/7 text-cream/80'}`}
/>
```

### `ui/Segmented.tsx` — 정/역방향 같은 양자택일

`radiogroup` + `radio` 역할로 스크린리더에 선택 상태를 알린다. 값 타입은 제네릭.

```tsx
<div role="radiogroup" aria-label={label} className="inline-flex rounded-full bg-surface p-1">
  {options.map((option) => (
    <button
      key={option.value}
      role="radio"
      aria-checked={option.value === value}
      onClick={() => onChange(option.value)}
    >
      {option.label}
    </button>
  ))}
</div>
```

### `ui/Keyword.tsx` — 키워드 태그

앞의 4개는 젤리 색을 돌려 쓰고, 그 뒤로는 테두리만 있는 태그.

```tsx
const TONES = ['bg-gold', 'bg-sky', 'bg-pink', 'bg-lilac'] as const
const tone = TONES[index]
<span className={tone ? `${tone} text-ink` : 'text-cream shadow-[inset_0_0_0_1.5px_rgb(255_255_255/0.2)]'}>
```

### `ui/Panel.tsx` — 패널 / 섹션 제목

```tsx
export function Panel({ soft = false, as: Tag = 'section', className = '', ...rest }: Props) {
  return (
    <Tag
      className={`rounded-[28px] p-5 ${soft ? 'bg-surface/75' : 'bg-surface shadow-float'} ${className}`}
      {...rest}
    />
  )
}
```

### `longi/Longi.tsx` — 마스코트 롱이 (SVG 일러스트)

별빛을 머금은 노란 젤리를 인라인 SVG로 그린다. 이미지 파일이 아니라 컴포넌트라 `mood`로 표정을 바꿀 수 있고 어떤 크기에서도 선명하다.
그라디언트 id는 `useId()`로 만들어, 한 화면에 롱이가 여러 개 있어도 서로의 그라디언트를 덮어쓰지 않는다.

```tsx
export type LongiMood = 'smile' | 'happy' | 'sleepy' | 'wink' | 'surprised'

export function Longi({ size = 'md', mood = 'smile', className = '' }: Props) {
  const id = useId()
  const body = `${id}-body`
  return (
    <svg
      viewBox="0 0 120 112"
      aria-hidden="true"
      className={`block shrink-0 overflow-visible ${SIZE[size]} ${className}`}
    >
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="0" y2="1">
          …
        </linearGradient>
      </defs>
      <path d="M14,102 C8,60 30,18 60,18 C90,18 112,60 106,102 Q60,113 14,102Z" fill={`url(#${body})`} />
      <Face mood={mood} />
    </svg>
  )
}
```

### `longi/LongiGuide.tsx` — 말풍선 / 롱이 안내

```tsx
export function LongiGuide({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <Longi size="sm" />
      <SpeechBubble className="text-sm">{children}</SpeechBubble>
    </div>
  )
}
```

### `reading/SpreadItem.tsx` — 스프레드 목록 항목

```tsx
<Link to={`/draw/${spread.id}`} className="flex items-center gap-3 rounded-[22px] bg-white/7 px-3.5 py-2.5">
  <span className={`flex size-9 items-center justify-center rounded-xl ${JELLY[spread.jelly]}`}>
    {spread.positions.length}
  </span>
  …
</Link>
```

### `reading/CardFan.tsx` — 부채꼴 덱

각 카드를 아래쪽 먼 점(`transform-origin`)을 축으로 돌린다. 각도는 CSS 변수 `--spread`로 화면 크기별로 정하고 카드별 비율 `--t`만
인라인으로 준다. JS로 화면 크기를 읽지 않으니 prerender·hydration에 안전하다. 셔플 중에는 `--t: 0`으로 모였다가 펼쳐진다.

```tsx
<div className="relative h-52 overflow-hidden [--spread:70deg] lg:h-80 lg:[--spread:84deg]">
  {Array.from({ length: count }, (_, i) => {
    const t = shuffling ? 0 : i / (count - 1) - 0.5
    const style = {
      '--t': t,
      transform: `rotate(calc(var(--t) * var(--spread))) translateY(${isPicked ? PICK_LIFT : 0}px)`,
    } as CSSProperties
    return <button key={i} style={style} className="absolute top-10 left-[calc(50%-30px)] w-15 origin-[30px_340px] …" />
  })}
</div>
```

컨테이너 높이 = 위 여백 + 카드 높이 + 양 끝 카드의 낙차(반경 × (1 − cos(spread/2))). 카드 수 12장은 모바일 폭에서
카드 사이 간격 24px(터치 영역 기준)을 지키는 최대치다.

### `reading/SpreadSlots.tsx` — 스프레드 자리

```tsx
<ol className="mx-auto grid w-full max-w-115 gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
  {spread.positions.map((position, i) => (
    <li key={position.key}>
      {i < pickedCount ? <CardBack /> : <div className="aspect-3/5 border-2 border-dashed border-gold/45">✦</div>}
      <span>{position.label}</span>
    </li>
  ))}
</ol>
```

### `reading/ReadingItemCard.tsx` — 결과 항목

뒤집기 전에는 자리 설명만, 뒤집으면 카드 이름·방향 배지·주제 해석·상세 링크. 켈틱 크로스는 카드를 배치도에 그리므로
`showCard={false}`로 번호만 보여준다.

```tsx
{
  flipped ? (
    <>
      <h3>
        {item.card.nameKo} <OrientationBadge reversed={item.reversed} />
      </h3>
      <p>{item.text}</p>
      <Link to={`/cards/${item.card.id}`}>카드 의미 자세히 ›</Link>
    </>
  ) : (
    <p>{item.position.description}</p>
  )
}
```

### `reading/CelticLayout.tsx` — 켈틱 크로스 배치도

카드 중심 좌표를 %로 정의한 절대 배치. 2번(장애물)은 1번 위에 90° 돌려 겹친다. 컨테이너 비율을 고정해서 화면 폭에 비례해 줄어든다.

```tsx
const SLOTS = [
  { left: 31, top: 50 }, // 1 현재
  { left: 31, top: 50, rotate: true }, // 2 장애물
  { left: 31, top: 84 }, // 3 기반
  // … 7~10은 오른쪽 기둥(아래에서 위로)
]
<div className="relative mx-auto aspect-[1/1.15] w-full max-w-130">
  <div className={`absolute w-[16%] -translate-x-1/2 -translate-y-1/2 ${slot.rotate ? 'z-10 rotate-90' : ''}`}
    style={{ left: `${slot.left}%`, top: `${slot.top}%` }} />
</div>
```

### `reading/LongiSummary.tsx` — 롱이의 한마디

```tsx
<Panel className="flex flex-col gap-3">
  <SectionTitle>롱이의 한마디</SectionTitle>
  {summary.lines.map((line) => (
    <p key={line}>{line}</p>
  ))}
  <KeywordList items={summary.tags} />
</Panel>
```

---

## 훅 (`app/hooks/`)

### `useMenuToggle.ts` — 햄버거 메뉴 상태

경로가 바뀌면 렌더 중에 상태를 맞춘다(effect 안에서 setState하지 않는 React 권장 패턴). Esc로도 닫힌다.

```ts
if (pathname !== lastPath) {
  setLastPath(pathname)
  if (open) setOpen(false)
}
```

### `useCardFilter.ts` — 도감 필터·검색

```ts
const [filter, setFilter] = useState<CardFilter>('all')
const [query, setQuery] = useState('')
const cards = useMemo(() => searchCards(filter, query), [filter, query])
```

### `useDailyCard.ts` — 오늘의 카드

`useSyncExternalStore`의 서버 스냅샷을 `null`로 둬서 prerender(빌드 시점)에는 카드를 정하지 않는다. 브라우저에서는
localStorage의 기기 시드(없으면 만들어 저장, 저장이 안 되면 빈 문자열)와 한국 날짜로 계산하고, 같은 날이면 같은 객체를 돌려준다.

```ts
let cached: DailyCard | null = null
function getSnapshot(): DailyCard | null {
  const dateKey = kstDateKey()
  if (cached?.dateKey === dateKey) return cached
  const drawn = pickDailyCard(readDeviceSeed(), dateKey)
  cached = { dateKey, card: getCard(drawn.cardId)!, reversed: drawn.reversed, meaning: getMeaning(drawn.cardId) }
  return cached
}
export const useDailyCard = () => useSyncExternalStore(subscribe, getSnapshot, () => null)
```

### `useDraw.ts` — 뽑기 상태

카드 정체와 방향은 섞을 때 정해지고, 사용자는 뒷면만 보고 고른다. 셔플 연출은 타이머로 끝낸다(effect 안 동기 setState 없음).

```ts
const [fan, setFan] = useState<DrawnCard[]>(() => dealFan(initialSpread.fanSize))
const togglePick = useCallback((index: number, max: number) => {
  setPicked((prev) => {
    if (prev.includes(index)) return prev.filter((i) => i !== index) // 다시 누르면 취소
    if (prev.length >= max) return prev
    return [...prev, index]
  })
}, [])
```

### `useFlips.ts` — 결과 화면 뒤집기 상태

```ts
const [flipped, setFlipped] = useState<boolean[]>(() => Array.from({ length: count }, () => false))
const flip = useCallback((index: number) => setFlipped((prev) => prev.map((v, i) => (i === index ? true : v))), [])
return { flipped, flip, flipAll, allFlipped: flipped.every(Boolean) }
```

---

## 데이터·모델 (`app/data/`, `app/models/`)

### `models/card.ts` — 카드·의미 타입

```ts
export interface TarotCard {
  id: string
  arcana: Arcana
  suit?: Suit
  number: number
  numeral: string
  nameKo: string
  nameEn: string
  image: string
}
export interface CardSide {
  summary: string
  keywords: string[]
  description: string
  love: string
  work: string
  money: string
  advice: string
}
export interface CardMeaning {
  element: string
  astrology?: string
  tip: string
  upright: CardSide
  reversed: CardSide
}
```

### `models/reading.ts` — 스프레드·리딩 타입

```ts
export type Topic = 'general' | 'love' | 'work' | 'money'
export interface Spread { id: string; name: string; desc: string; about: string; fanSize: number; fixedTopic?: Topic; jelly: …; positions: SpreadPosition[] }
export interface Reading { spreadId: string; topic: Topic; question?: string; cards: DrawnCard[] }
export interface ReadingItem { position: SpreadPosition; card: TarotCard; reversed: boolean; side: CardSide; text: string }
```

### `data/cards.ts` — 카드 78장 기본 데이터

메이저 22장 표와 수트 4 × 랭크 14 표를 곱해 78장을 만든다. id 규칙이 `public/cards/*.svg` 파일명과 같다.
`react-router.config.ts`도 이 `CARDS`로 prerender 경로를 만든다.

```ts
...SUITS.flatMap((suit) =>
  RANKS.map(([slug, numeral, rankKo, rankEn], i): TarotCard => {
    const id = `${suit.id}-${pad(i + 1)}-${slug}`
    return { id, arcana: 'minor', suit: suit.id, number: i + 1, numeral,
      nameKo: `${suit.nameKo} ${rankKo}`, nameEn: `${rankEn} of ${suit.nameEn}`, image: `/cards/${id}.svg` }
  }),
)
```

### `data/meanings/define.ts` — 의미 데이터 작성 헬퍼

780개가 넘는 문장을 짧게 적으려고 위치 기반 튜플을 쓴다. 키워드는 가운뎃점(·)으로 구분한다.

```ts
/** [한 줄 요약, '키워드·키워드·…', 기본 설명, 연애, 일, 금전, 조언] */
export type SideTuple = [string, string, string, string, string, string, string]

export function meaning(
  element: string,
  astrology: string | undefined,
  tip: string,
  upright: SideTuple,
  reversed: SideTuple,
) {
  return { element, astrology, tip, upright: side(upright), reversed: side(reversed) }
}
```

### `data/meanings/{major,wands,cups,swords,pentacles}.ts` — 카드 의미 78장

```ts
'major-17-star': meaning('공기', '물병자리', '탑(XVI) 다음이 별이야. 무너진 뒤에 뜨는 별, 이렇게 기억해봐.',
  ['폭풍이 지난 뒤 찾아오는 희망과 치유', '희망·치유·영감·평온', '폭풍(탑)이 지나간 뒤 …', '상처를 회복하고 …', …],
  ['희망이 구름에 가려진 상태', '실망·불신·낙담·의욕 저하', …],
),
```

### `data/meanings/index.ts` — 의미 모음

```ts
export const MEANINGS = {
  ...MAJOR_MEANINGS,
  ...WANDS_MEANINGS,
  ...CUPS_MEANINGS,
  ...SWORDS_MEANINGS,
  ...PENTACLES_MEANINGS,
}
export function getMeaning(cardId: string): CardMeaning {
  const found = MEANINGS[cardId]
  if (!found) throw new Error(`카드 의미가 없어: ${cardId}`)
  return found
}
```

### `data/spreads.ts` — 스프레드 4종과 주제

```ts
{
  id: 'love', name: '연애운', desc: '나 · 상대 · 관계', fanSize: 12, fixedTopic: 'love', jelly: 'rose',
  positions: [
    { key: 'me', label: '나', description: '이 관계에서 내 마음' },
    { key: 'partner', label: '상대', description: '상대의 마음과 입장' },
    { key: 'relation', label: '관계', description: '둘 사이의 흐름과 앞으로' },
  ],
},
```

### `data/combos.ts` — 특별 조합 20개 / 숫자 의미

```ts
export const COMBOS: ComboRule[] = [
  { cards: ['major-16-tower', 'major-17-star'], text: '탑과 별이 함께 나왔어. 무너진 자리에 별이 뜨는 흐름이야. …' },
  // …
]
export const NUMBER_MEANINGS: Record<number, string> = { 1: '시작', 2: '선택과 균형', /* … */ 10: '끝과 새 시작' }
```

### `data/nav.ts` — 메뉴 항목

```ts
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: '홈' },
  { to: '/cards', label: '도감' },
  { to: '/draw', label: '뽑기' },
]
```

---

## 유틸 (`app/utils/`)

### `random.ts` — 공정한 셔플

`crypto.getRandomValues`로 32비트 난수를 받고, `max`의 배수 범위 밖이면 다시 뽑는다(거부 샘플링). 그냥 `% max`를 하면
특정 값이 미세하게 더 자주 나온다. 셔플은 Fisher–Yates이고, 테스트를 위해 난수 함수를 주입할 수 있다.

```ts
export function secureRandomInt(max: number): number {
  const limit = Math.floor(0x1_0000_0000 / max) * max
  const buf = new Uint32Array(1)
  for (;;) {
    crypto.getRandomValues(buf)
    if (buf[0] < limit) return buf[0] % max
  }
}
export function shuffle<T>(items: readonly T[], random = secureRandomInt): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = random(i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
```

### `seededRandom.ts` — 시드 난수

같은 시드면 항상 같은 수열(오늘의 카드용). 문자열은 FNV-1a로 32비트 시드로 바꾸고, 생성기는 mulberry32.

```ts
export function hashString(text: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}
```

### `dailyCard.ts` — 오늘의 카드 계산

```ts
export function kstDateKey(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(date) // 'YYYY-MM-DD'
}
export function pickDailyCard(deviceSeed: string, dateKey: string): DrawnCard {
  const random = seededRandom(hashString(`${deviceSeed}:${dateKey}`))
  const card = CARDS[Math.floor(random() * CARDS.length)]
  return { cardId: card.id, reversed: random() < 0.5 }
}
```

### `readingQuery.ts` — 결과 URL 인코딩

카드 id 뒤 `_r`이 역방향. 디코딩할 때 스프레드·주제·카드 수·카드 id·중복을 모두 검사해 하나라도 틀리면 `null`.

```ts
params.set('c', reading.cards.map((c) => c.cardId + (c.reversed ? '_r' : '')).join(','))

if (cards.length !== spread.positions.length) return null
if (cards.some((c) => !getCard(c.cardId))) return null
if (new Set(cards.map((c) => c.cardId)).size !== cards.length) return null
```

### `interpret.ts` — 해석 조합과 롱이의 한마디

자리마다 카드 방향에 맞는 의미를 고르고 주제 문장을 붙인다. 요약은 규칙을 차례로 검사해 해당하는 문장만 모은다.

```ts
export function sideText(side: CardSide, topic: Topic): string {
  switch (topic) {
    case 'love':
      return side.love
    case 'work':
      return side.work
    case 'money':
      return side.money
    default:
      return side.description
  }
}

if (majors / n >= 0.5) lines.push('메이저 카드가 많이 나왔어. 인생의 큰 흐름이 움직이는 중요한 시기야.')
if (top.count >= 2 && !tied) {
  lines.push(
    `${josa(top.suit.nameKo, '이', '가')} ${top.count}장이야. 지금은 ${josa(top.suit.theme, '이', '가')} 이야기의 중심이야.`,
  )
}
for (const combo of COMBOS) if (combo.cards.every((id) => ids.has(id))) lines.push(combo.text)
lines.push(`마지막 '${last.position.label}' 자리의 조언이야. ${last.side.advice}`)
```

### `josa.ts` — 받침에 맞는 조사

한글은 유니코드 음절 코드로 받침을 계산하고, 숫자는 한국어로 읽었을 때의 받침을 표로 둔다(2 "이" → 받침 없음).

```ts
const DIGIT_BATCHIM = [true, true, false, true, false, false, true, true, true, false]
export function hasBatchim(word: string): boolean {
  const last = word.trim().at(-1)
  if (!last) return false
  if (/[0-9]/.test(last)) return DIGIT_BATCHIM[Number(last)]
  const code = last.charCodeAt(0) - 0xac00
  return code >= 0 && code <= 11171 && code % 28 !== 0
}
```

### `searchCards.ts` — 도감 검색

이름(한/영)과 정·역방향 키워드를 미리 한 문자열로 묶어 둔다.

```ts
const searchText = new Map(
  CARDS.map((card) => {
    const m = MEANINGS[card.id]
    return [card.id, [card.nameKo, card.nameEn, ...m.upright.keywords, ...m.reversed.keywords].join(' ').toLowerCase()]
  }),
)
export function searchCards(filter: CardFilter, query: string): TarotCard[] {
  const q = query.trim().toLowerCase()
  return CARDS.filter((card) => matchesFilter(card, filter) && (!q || searchText.get(card.id)?.includes(q)))
}
```

### `meta.ts` — 페이지 메타 태그

```ts
export function pageMeta(title?: string, description = DEFAULT_DESCRIPTION) {
  const fullTitle = title ? `${title} · ${SITE}` : `${SITE} · 별이 들려주는 타로 이야기`
  return [
    { title: fullTitle },
    { name: 'description', content: description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
  ]
}
```

### `formatNumber.ts` — 3자리 콤마

```ts
export function formatNumber(n: number): string {
  return n.toLocaleString('ko-KR')
}
```

---

## 테스트

### `data/cards.test.ts` — 카드 데이터 무결성

78장·id 중복 없음·수트별 14장에 더해, **모든 카드의 일러스트 파일이 실제로 있는지** 확인한다.

```ts
it('모든 카드의 일러스트 파일이 존재한다', () => {
  for (const card of CARDS) expect(existsSync(join('public', card.image)), card.image).toBe(true)
})
```

### `utils/logic.test.ts` — 로직 전반

의미 데이터에 빈 칸이 없는지, 셔플이 순열인지, 시드가 결정적인지, 한국 날짜 경계, 결과 URL 왕복·검증, 해석 규칙과 조사를 검사한다.

```ts
it('오늘의 카드는 같은 기기·날짜면 같다', () => {
  expect(pickDailyCard('device-a', '2026-11-13')).toEqual(pickDailyCard('device-a', '2026-11-13'))
})
it('한국 시간 날짜 키', () => {
  expect(kstDateKey(new Date('2026-11-13T15:30:00Z'))).toBe('2026-11-14') // UTC 15:30 = KST 다음 날 00:30
})
expect(lines.some((l) => l.startsWith('컵이 2장이야. 지금은 감정과 관계가'))).toBe(true)
```

### `utils/formatNumber.test.ts`

```ts
expect(formatNumber(1234)).toBe('1,234')
expect(formatNumber(1234567)).toBe('1,234,567')
```

---

## 카드 일러스트 생성 (`scripts/cards/`)

### `lib.mjs` — 공통 부품

모든 카드가 같은 부품을 조합하므로 78장의 톤이 맞는다. 문자열로 SVG 조각을 만들고, `g()`로 위치·회전·크기를 준다.
반복되는 모양(팔각 별, 불꽃, 물방울)은 `COMMON_DEFS`에 한 번 정의하고 `<use>`로 재사용한다.

```js
export const g = (x, y, inner, { rot = 0, s = 1, flip = false } = {}) =>
  `<g transform="${t(x, y, rot, s, flip)}">${inner}</g>`

export function svg(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${COMMON_DEFS}${body}</svg>\n`
}
```

젤리 캐릭터는 몸·발·팔·볼터치·표정·장식을 옵션으로 조합한다. 장식(`hat.*`)은 젤리 로컬 좌표(몸 높이 84, 아래 중앙이 원점) 기준이다.

```js
jelly(128, 326, {
  s: 1.25,
  color: 'peach',
  face: 'determined', // smile, happy, calm, sad, cry, blind, skull …
  arms: 'out', // down, up, out, rup …
  under: hat.cape(C.red), // 몸 뒤에 그릴 것
  acc: hat.beard() + hat.crown(), // 몸 위에 그릴 것
})
```

### `major.mjs` / `minor.mjs` — 카드별 장면

카드 id → SVG 문자열을 만드는 함수의 맵. 마이너는 수트 상징 개수가 한눈에 세어지게 배치한다.

```js
'swords-03-three': () =>
  svg(
    bg('storm') +
      cloud(56, 74, 1.1, '#6e60b8') +
      heart(128, 210, 3.1, C.rose) +
      stuckSword(128, 300, 240, 0, 0.9) +
      stuckSword(146, 290, 230, 26, 0.9) +
      stuckSword(110, 290, 230, -26, 0.9),
  ),
```

`stuckSword`는 **칼끝 좌표**를 받아 손잡이 위치를 역산한다. 하트나 땅에 정확히 꽂히게 하려고 이렇게 했다.

```js
const stuckSword = (tx, ty, len, a = 0, s = 0.75) => {
  const r = (a * Math.PI) / 180
  const L = len * s
  return sword(tx + L * Math.sin(r), ty - L * Math.cos(r), len, 180 + a, s)
}
```

### `build.mjs` — 생성 실행

장면 함수 결과와 `handmade/` 원본(바보·탑·별·컵 에이스, 뒷면 A/B)을 `public/cards/`로 쓴다. 뒷면은 A안만 `back.svg`가 된다.

```js
for (const [id, draw] of Object.entries({ ...majors, ...minors })) {
  writeFileSync(join(outDir, `${id}.svg`), draw())
}
for (const file of readdirSync(handmadeDir)) {
  const target = file === 'back-a.svg' ? 'back.svg' : file === 'back-b.svg' ? null : file
  if (target) writeFileSync(join(outDir, target), readFileSync(join(handmadeDir, file)))
}
```

### `handmade/*.svg` — 손으로 그린 원본

뒷면은 절반 장식(`#half`)을 그리고 180° 돌려 한 번 더 쓰는 방식으로 **회전 대칭**을 보장한다.
대칭이 아니면 뒷면만 보고 역방향 카드를 알아챌 수 있다.

```svg
<use href="#half"/>
<use href="#half" transform="rotate(180 150 250)"/>
```

---

## 기타 스크립트

### `scripts/preview.mjs` — Vercel 규칙 로컬 미리보기 서버

`vite preview`는 `/cards` 같은 prerender 경로에 루트 `index.html`(홈)을 내줘서, 홈 HTML 위에 다른 화면이 hydrate되며
화면이 두 겹으로 그려졌다. Vercel과 같은 순서로 파일을 찾는 서버로 대체했다. 로컬 Lighthouse가 배포 환경과
비슷하도록 gzip 압축과 `vercel.json`의 캐시 헤더도 흉내 낸다.

```js
function resolveFile(urlPath) {
  const target = join(root, normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, ''))
  if (!target.startsWith(root)) return null // 상위 폴더 접근 차단
  if (existsSync(target) && statSync(target).isFile()) return target // ① 파일
  const index = join(target, 'index.html')
  if (existsSync(index)) return index // ② prerender된 페이지
  return join(root, '__spa-fallback.html') // ③ SPA 라우트
}

const gzip = COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')
res.writeHead(200, { 'Cache-Control': cacheControl(urlPath), ...(gzip ? { 'Content-Encoding': 'gzip' } : {}) })
```

### `scripts/with-upper-drive.mjs` — `npm run dev` 래퍼 (Windows 드라이브 대소문자)

Windows에서 셸 경로가 소문자 드라이브(`d:\`)면 `react-router dev`가 모든 페이지에 404(`Cannot GET /`)를 낸다.
작업 경로만 대문자로 바꾸면 소용이 없었다. npm이 PATH에 넣은 `node_modules\.bin`도 소문자라
`react-router` 실행 파일 자체가 소문자 경로로 실행되기 때문이다. 그래서 둘 다 바꿔서 실행한다.

```js
const upperDrive = (p) => p.replace(/^[a-z]:/, (drive) => drive.toUpperCase())
const cwd = upperDrive(process.cwd())
const pathKey = Object.keys(process.env).find((key) => key.toUpperCase() === 'PATH') ?? 'PATH'
const env = { ...process.env, [pathKey]: (process.env[pathKey] ?? '').split(delimiter).map(upperDrive).join(delimiter) }

const child = spawn(process.argv.slice(2).join(' '), { cwd, env, stdio: 'inherit', shell: true })
```

### `scripts/generate-icons.mjs` — 아이콘 생성

```js
await sharp(source, { density: 600 }).resize(180, 180).png().toFile(join(publicDir, 'apple-touch-icon.png'))
```
