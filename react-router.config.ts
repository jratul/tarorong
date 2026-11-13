import type { Config } from '@react-router/dev/config'
import { CARDS } from './app/data/cards'
import { SPREADS } from './app/data/spreads'

// SPA + prerender: 내용이 고정된 페이지는 빌드 시 HTML로 미리 만든다.
// - 홈·도감·카드 상세 78장
// - 뽑기 화면(스프레드별): 카드 뒷면만 보여서 덱이 무작위여도 HTML이 항상 같다
// 결과 화면(/result?…)은 URL 쿼리마다 내용이 달라 SPA로 동작한다.
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
