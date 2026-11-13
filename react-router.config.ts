import type { Config } from '@react-router/dev/config'
import { CARDS } from './app/data/cards'

// SPA + prerender: 내용이 고정된 페이지(홈·도감·카드 상세 78장)는 빌드 시 HTML로 미리 만들고,
// 뽑기·결과처럼 랜덤이 들어가는 화면은 SPA로 동작한다.
export default {
  ssr: false,
  prerender: ['/', '/cards', ...CARDS.map((card) => `/cards/${card.id}`)],
} satisfies Config
