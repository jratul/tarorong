# TECH — 파일별 기술 기록

각 파일에 어떤 기술이 어떻게 쓰였는지 기록한다. 설정 파일과 패키지는 [PROJECT.md](PROJECT.md),
프로젝트 규칙과 계획은 [CLAUDE.md](CLAUDE.md) 참고.

---

## 앱 진입점

### `app/root.tsx` — HTML 레이아웃, 메타, 에러 화면

React Router framework mode의 루트 모듈. `Layout`이 `<html>` 전체를 그리고, `links`로 파비콘을 등록한다.
`<ScrollRestoration />`이 새 페이지는 맨 위에서 시작하게 하고, 뒤로 가기는 이전 스크롤 위치를 복원한다
(별도 `ScrollToTop` 컴포넌트를 두지 않는 이유).

```tsx
export const links: Route.LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
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

모든 화면을 `layout` 라우트 하나로 감싸 공통 헤더(`AppNav`)를 공유한다.

```ts
export default [
  layout('routes/layout.tsx', [
    index('routes/home.tsx'),
    route('cards', 'routes/cards.tsx'),
    route('cards/:id', 'routes/card-detail.tsx'),
    route('draw', 'routes/draw.tsx'),
    route('result', 'routes/result.tsx'),
  ]),
] satisfies RouteConfig
```

### `app/app.css` — Tailwind v4 + 디자인 토큰 + 전역 CSS

`@fontsource` 폰트를 CSS에서 import해 Vite가 번들에 포함하게 한다(외부 폰트 `<link>` 없음 → 렌더 블로킹 없음).
`@theme`에 시안 토큰을 넣으면 `bg-night`, `text-gold`, `font-display`, `shadow-glow-pink` 같은 유틸리티가 생긴다.

```css
@import '@fontsource/jua';
@import '@fontsource/gowun-dodum';
@import 'tailwindcss';

@theme {
  --color-night: #1e1a3a;
  --color-gold: #ffe9a6;
  --font-display: 'Jua', ui-sans-serif, sans-serif;
  --shadow-glow-pink: 0 0 22px rgb(255 199 227 / 0.45);
}
```

전역 규칙(스크롤바 자리 예약, 버튼 커서)도 여기 있다. `scrollbar-gutter`는 body로 전파되지 않으므로 반드시 `html`에 건다.

```css
html {
  scrollbar-gutter: stable;
}
button:not(:disabled),
[role='button']:not([aria-disabled='true']) {
  cursor: pointer;
}
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

### `home.tsx` — 홈 (뼈대)

라우트 모듈의 `meta` export로 페이지 제목·설명을 정한다. prerender 시 이 값이 HTML `<head>`에 들어간다.

```tsx
export const meta = () => pageMeta()

<Link to="/draw" className="rounded-full bg-gold px-6 py-3 font-display text-ink shadow-glow-gold">
  카드 뽑기
</Link>
```

### `cards.tsx` — 도감 그리드

열 개수를 뷰포트 브레이크포인트가 아니라 **그리드 자신의 너비** 기준(`auto-fill` + `minmax`)으로 정한다.
개수 표시는 `formatNumber`로 3자리 콤마를 적용한다.

```tsx
<span className="font-mono text-sm text-cream/60">{formatNumber(CARDS.length)}장</span>
<ul className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
  {CARDS.map((card) => (
    <li key={card.id}>
      <Link to={`/cards/${card.id}`}>
        <TarotCardFace card={card} />
      </Link>
    </li>
  ))}
</ul>
```

### `card-detail.tsx` — 카드 상세

`loader` 없이 컴포넌트에서 `params.id`로 카드를 찾는다. prerender된 78장은 빌드 때 그려지고,
없는 id는 SPA 폴백으로 와서 안내 문구를 보여준다. `meta`도 `params`로 카드별 제목을 만든다.

```tsx
export const meta = ({ params }: Route.MetaArgs) => {
  const card = getCard(params.id)
  return card
    ? pageMeta(`${card.nameKo} (${card.nameEn})`, `타로카드 ${card.nameKo} 카드의 …`)
    : pageMeta('카드를 찾을 수 없어')
}

export default function CardDetail({ params }: Route.ComponentProps) {
  const card = getCard(params.id)
  if (!card) return <h1>그런 카드는 없어</h1>
  const { prev, next } = getAdjacentCards(card.id)
  // …
}
```

### `draw.tsx` / `result.tsx` — 뽑기·결과 (자리만)

prerender 대상이 아니라 SPA로 동작한다. 지금은 카드 뒷면만 보여준다.

```tsx
export const meta = () => pageMeta('카드 뽑기')

<img src="/cards/back.svg" alt="" width={300} height={500} className="w-40 drop-shadow-xl" />
```

---

## 컴포넌트 (`app/components/`)

### `layout/AppNav.tsx` — 웹 상단 메뉴 / 모바일 햄버거

`lg`(1024px) 이상은 가로 메뉴, 미만은 햄버거 버튼 + 펼침 메뉴. 열림 상태 로직은 `useMenuToggle` 훅으로 분리했다.

```tsx
const { open, toggle, close } = useMenuToggle()

<nav aria-label="주 메뉴" className="hidden items-center gap-1 lg:flex">{/* 가로 링크 */}</nav>
<button className="… lg:hidden" aria-expanded={open} aria-controls="mobile-menu" onClick={toggle}>
  {/* 햄버거 / X 아이콘 */}
</button>
{open && (
  <nav id="mobile-menu" className="… lg:hidden">
    {NAV_ITEMS.map((item) => (
      <NavLink key={item.to} to={item.to} end={item.to === '/'} className={mobileLink} onClick={close}>
        {item.label}
      </NavLink>
    ))}
  </nav>
)}
```

### `card/TarotCardFace.tsx` — 카드 앞면 프레임

시안의 `.tcard--face`(숫자 · 일러스트 · 이름) 구조. 여백·글자 크기를 **카드 자신의 너비 기준**(`@container` + `cqw`)으로 잡는다.
`%` padding은 부모 너비 기준이라 작은 썸네일에서 여백이 카드보다 커져 그림이 사라지는 문제가 있었다.

```tsx
<div className={`@container ${className}`}>
  <div className="flex flex-col gap-[3cqw] rounded-[7cqw] bg-cream p-[7cqw] text-ink shadow-glow-pink">
    <span className="text-center font-mono text-[max(9px,5.5cqw)]">{card.numeral}</span>
    <img
      src={card.image}
      alt={card.nameKo}
      width={256}
      height={372}
      loading={priority ? 'eager' : 'lazy'}
      className={`block h-auto w-full ${reversed ? 'rotate-180' : ''}`}
    />
    <span className="truncate text-center font-display text-[max(11px,8.5cqw)]">{card.nameKo}</span>
  </div>
</div>
```

`width`/`height`를 지정해 이미지가 로드되기 전에도 자리를 잡아 레이아웃 이동(CLS)이 없다.

---

## 훅·유틸·데이터·모델

### `hooks/useMenuToggle.ts` — 햄버거 메뉴 상태

경로가 바뀌면 렌더 중에 상태를 맞춘다(effect 안에서 setState하지 않는 React 권장 패턴). Esc로도 닫힌다.

```ts
const [lastPath, setLastPath] = useState<string | null>(null)
const { pathname } = useLocation()

if (pathname !== lastPath) {
  setLastPath(pathname)
  if (open) setOpen(false)
}

useEffect(() => {
  if (!open) return
  const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
  window.addEventListener('keydown', onKey)
  return () => window.removeEventListener('keydown', onKey)
}, [open])
```

### `models/card.ts` — 카드 타입

```ts
export type Arcana = 'major' | 'minor'
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles'

export interface TarotCard {
  id: string // 'major-00-fool', 'cups-14-king' — 이미지 파일명과 같다
  arcana: Arcana
  suit?: Suit
  number: number
  numeral: string
  nameKo: string
  nameEn: string
  image: string
}
```

### `data/cards.ts` — 카드 78장 기본 데이터

메이저 22장 표와 수트 4 × 랭크 14 표를 곱해 78장을 만든다. id 규칙이 `public/cards/*.svg` 파일명과 같다.

```ts
...SUITS.flatMap((suit) =>
  RANKS.map(([slug, numeral, rankKo, rankEn], i): TarotCard => {
    const id = `${suit.id}-${pad(i + 1)}-${slug}`
    return { id, arcana: 'minor', suit: suit.id, number: i + 1, numeral,
      nameKo: `${suit.nameKo} ${rankKo}`, nameEn: `${rankEn} of ${suit.nameEn}`, image: `/cards/${id}.svg` }
  }),
)

const byId = new Map(CARDS.map((card) => [card.id, card]))
export function getCard(id: string | undefined) {
  return id ? byId.get(id) : undefined
}
```

`react-router.config.ts`도 이 `CARDS`로 prerender 경로를 만든다.

### `data/nav.ts` — 메뉴 항목

```ts
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: '홈' },
  { to: '/cards', label: '도감' },
  { to: '/draw', label: '뽑기' },
]
```

### `utils/meta.ts` — 페이지 메타 태그

제목·설명·Open Graph 태그를 한 번에 만든다. 카카오톡 등 링크 미리보기가 `og:*`를 읽는다.

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

### `utils/formatNumber.ts` — 3자리 콤마

```ts
export function formatNumber(n: number): string {
  return n.toLocaleString('ko-KR')
}
```

---

## 테스트

### `data/cards.test.ts` — 카드 데이터 무결성

78장·id 중복 없음·수트별 14장에 더해, **모든 카드의 일러스트 파일이 실제로 있는지** 확인한다.
카드 생성 스크립트와 데이터의 id가 어긋나면 여기서 잡힌다.

```ts
it('모든 카드의 일러스트 파일이 존재한다', () => {
  for (const card of CARDS) {
    expect(existsSync(join('public', card.image)), card.image).toBe(true)
  }
})
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
화면이 두 겹으로 그려졌다. Vercel과 같은 순서로 파일을 찾는 서버로 대체했다.

```js
function resolveFile(urlPath) {
  const target = join(root, normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, ''))
  if (!target.startsWith(root)) return null // 상위 폴더 접근 차단
  if (existsSync(target) && statSync(target).isFile()) return target // ① 파일
  const index = join(target, 'index.html')
  if (existsSync(index)) return index // ② prerender된 페이지
  return join(root, '__spa-fallback.html') // ③ SPA 라우트
}
```

### `scripts/generate-icons.mjs` — 아이콘 생성

```js
await sharp(source, { density: 600 }).resize(180, 180).png().toFile(join(publicDir, 'apple-touch-icon.png'))
```
