# PROJECT — 설정 파일과 패키지

기반 설정 파일이 각각 무슨 역할을 하는지, `package.json`의 패키지가 어디에 왜 쓰이는지 정리한다.
파일별 구현은 [TECH.md](TECH.md), 프로젝트 규칙은 [CLAUDE.md](CLAUDE.md) 참고.

---

## 설정 파일

### `react-router.config.ts` — 렌더링 방식

`ssr: false`로 서버 없이 정적 배포하고, 내용이 고정된 페이지만 빌드 시 HTML로 미리 만든다(prerender).
카드·스프레드 목록을 `app/data/`에서 가져오므로 데이터가 바뀌면 prerender 경로도 자동으로 따라간다.
뽑기 화면은 카드 뒷면만 보여서 덱이 무작위여도 HTML이 같아 스프레드별로 prerender한다.

```ts
export default {
  ssr: false,
  prerender: [
    '/',
    '/cards',
    ...CARDS.map((card) => `/cards/${card.id}`),
    '/draw',
    '/guide',
    ...SPREADS.map((spread) => `/draw/${spread.id}`),
  ],
} satisfies Config
```

빌드 결과: `build/client`에 HTML 86개 + prerender하지 않은 경로(결과 화면)용 `__spa-fallback.html`.

### `vite.config.ts` — 빌드

Tailwind v4 Vite 플러그인과 React Router 플러그인. `resolve.tsconfigPaths`로 tsconfig의 `~/*` alias를 Vite가 읽는다.
`assetsInlineLimit`로 **폰트 파일은 base64 인라인을 막는다**. 기본값(4KB 이하 인라인)이면 한글 폰트의 작은 조각 수백 개가
CSS에 박혀 CSS가 200KB 가까이 되고, `unicode-range`로 필요한 조각만 받는 이점도 사라진다.

```ts
export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: { tsconfigPaths: true },
  build: {
    assetsInlineLimit: (file) => (/\.(woff2?|ttf|otf)$/.test(file) ? false : undefined),
  },
})
```

### `vitest.config.ts` — 테스트

React Router 플러그인 없이 순수 로직만 테스트한다. `pool: 'vmThreads'`는 Windows 전용 문제를 피하기 위한 것이다.
셸 경로가 소문자 드라이브(`d:\`)면 기본 풀이 vitest 모듈을 `D:/`와 `d:/`로 두 번 로드해,
모든 테스트가 `Cannot read properties of undefined (reading 'config')`로 실패한다.

```ts
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    include: ['app/**/*.test.ts'],
    pool: 'vmThreads',
  },
})
```

### `tsconfig.json` — TypeScript

번들러 기준 모듈 해석(`bundler`), `baseUrl` 없이 `paths`만 쓴다(TS 7에서 제거될 `node` 해석·`baseUrl` 조합을 피함).
`rootDirs`로 React Router가 생성하는 라우트 타입(`.react-router/types`)을 `./+types/*`로 import할 수 있다.

```json
{
  "compilerOptions": {
    "types": ["node", "vite/client"],
    "moduleResolution": "bundler",
    "rootDirs": [".", "./.react-router/types"],
    "paths": { "~/*": ["./app/*"] },
    "verbatimModuleSyntax": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### `eslint.config.js` — ESLint (flat config)

TS/TSX에는 `@eslint/js` + `typescript-eslint` + React Hooks(`recommended-latest`) + React Refresh,
`scripts/`와 설정 파일은 Node 전역으로 따로 린트한다. `eslint-config-prettier`는 포맷 규칙 충돌을 막으려고 맨 마지막에 둔다.

```js
export default defineConfig([
  globalIgnores(['build', '.react-router', 'public/cards', '.ref', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true, allowExportNames: routeExports }],
    },
  },
  {
    files: ['scripts/**/*.{js,mjs}', '*.config.{js,ts}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  prettier,
])
```

`routeExports`(`meta`, `links`, `loader`, `ErrorBoundary`, `Layout` …)는 라우트 모듈이 컴포넌트와 함께 내보내는 이름이라
React Refresh 경고에서 제외한다.

### `.prettierrc.json` / `.prettierignore` — Prettier

세미콜론 없음 + 작은따옴표 + 120자(기존 코드 스타일). Tailwind 클래스 정렬 플러그인이 `app/app.css`의 토큰을 읽는다.

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 120,
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./app/app.css"
}
```

`.prettierignore`: `build`, `.react-router`, `public/cards`·`scripts/cards/handmade`(SVG 생성물·원본), `.ref`, `package-lock.json`.

### `vercel.json` — 배포

Vercel은 실제 파일을 먼저 찾고, 없을 때만 rewrite를 적용한다. 그래서 prerender된 HTML은 그대로 나가고
나머지 경로(`/result` 등)만 SPA 폴백으로 간다. 해시가 붙은 `/assets/*`는 1년 immutable, 카드 SVG는 하루 캐시.

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build/client",
  "rewrites": [{ "source": "/(.*)", "destination": "/__spa-fallback.html" }],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/cards/(.*)\\.svg",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=86400, stale-while-revalidate=604800" }]
    }
  ]
}
```

### `.editorconfig` / `.gitattributes` / `.vscode/`

`.gitattributes`의 `eol=lf`는 Windows `autocrlf`로 CRLF 체크아웃돼 전 파일이 포맷 불일치로 잡히는 것을 막는다.
`.vscode/settings.json`은 저장 시 Prettier 포맷 + ESLint 자동 수정.

```gitattributes
* text=auto eol=lf
*.png binary
*.woff2 binary
```

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" }
}
```

### `.gitignore`

`.ref/`(디자인 시안, 로컬 전용), `node_modules/`, `/.react-router/`(라우트 타입 생성물), `/build/`.

```gitignore
.ref/
node_modules/
/.react-router/
/build/
```

---

## 패키지

### dependencies

| 패키지                    | 버전   | 사용처                                                                                                             |
| ------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| `react`                   | 19.3.1 | 모든 화면 컴포넌트                                                                                                 |
| `react-dom`               | 19.3.1 | 브라우저 렌더링·hydration (React Router가 내부에서 사용)                                                           |
| `react-router`            | 8.5.1  | 라우팅(`Link`, `NavLink`, `Outlet`, `useLocation`), 루트 레이아웃(`Meta`, `Links`, `Scripts`, `ScrollRestoration`) |
| `isbot`                   | 5.2.3  | React Router 기본 서버 엔트리가 import. prerender 빌드에 필요해 첫 빌드 때 React Router가 자동 추가했다            |
| `@fontsource/jua`         | 5.3.0  | 제목 폰트 `font-display` (`app/app.css`에서 import, 한글은 글자 범위별 조각으로 필요한 것만 로드)                  |
| `@fontsource/gowun-dodum` | 5.3.0  | 본문 폰트 `font-sans`                                                                                              |
| `@fontsource/dm-mono`     | 5.3.0  | 숫자·로마 숫자 `font-mono` (400, 500 굵기만 import)                                                                |

### devDependencies

| 패키지                        | 버전    | 사용처                                                                                  |
| ----------------------------- | ------- | --------------------------------------------------------------------------------------- |
| `@react-router/dev`           | 8.5.1   | `react-router dev/build/typegen` CLI, Vite 플러그인, `routes.ts`의 `index/layout/route` |
| `vite`                        | 8.3.8   | 개발 서버·번들러 (`vite.config.ts`)                                                     |
| `tailwindcss`                 | 4.3.5   | 스타일 유틸리티, `@theme` 디자인 토큰 (`app/app.css`)                                   |
| `@tailwindcss/vite`           | 4.3.5   | Tailwind v4 Vite 플러그인                                                               |
| `typescript`                  | 6.0.3   | 타입 체크(`npm run typecheck`). 7.0은 typescript-eslint 미지원(`<6.1`)이라 6.0          |
| `@types/react`                | 19.3.0  | React 타입                                                                              |
| `@types/react-dom`            | 19.3.0  | React DOM 타입                                                                          |
| `@types/node`                 | 22.20.5 | `node:fs` 등 Node 타입 (설정 파일, 테스트)                                              |
| `eslint`                      | 10.14.0 | 린트 (`eslint.config.js`)                                                               |
| `@eslint/js`                  | 10.0.1  | ESLint 기본 추천 규칙                                                                   |
| `typescript-eslint`           | 8.72.2  | TS 파서·추천 규칙                                                                       |
| `eslint-plugin-react-hooks`   | 7.1.1   | Hooks 규칙 (`recommended-latest`)                                                       |
| `eslint-plugin-react-refresh` | 0.5.7   | HMR이 깨지는 export 패턴 경고                                                           |
| `eslint-config-prettier`      | 10.1.8  | Prettier와 충돌하는 ESLint 규칙 끄기                                                    |
| `globals`                     | 17.14.0 | 브라우저/Node 전역 변수 목록                                                            |
| `prettier`                    | 3.10.1  | 코드 포맷                                                                               |
| `prettier-plugin-tailwindcss` | 0.8.1   | Tailwind 클래스 순서 정렬                                                               |
| `vitest`                      | 5.1.0   | 단위 테스트 (`app/**/*.test.ts`)                                                        |
| `sharp`                       | 0.35.5  | `scripts/generate-icons.mjs`에서 파비콘 SVG → `apple-touch-icon.png` 변환               |
