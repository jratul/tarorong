import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier/flat'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// React Router 라우트 모듈이 컴포넌트와 함께 내보내는 이름들
const routeExports = [
  'meta',
  'links',
  'headers',
  'loader',
  'clientLoader',
  'action',
  'clientAction',
  'handle',
  'shouldRevalidate',
  'ErrorBoundary',
  'HydrateFallback',
  'Layout',
]

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
    languageOptions: { globals: globals.browser },
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
