import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    // 폰트는 base64로 CSS에 넣지 않는다. 한글 폰트는 글자 범위별 작은 조각(woff2)이 수백 개라
    // 인라인되면 CSS가 수백 KB가 되고, unicode-range로 필요한 조각만 받는 이점도 사라진다.
    assetsInlineLimit: (file) => (/\.(woff2?|ttf|otf)$/.test(file) ? false : undefined),
  },
})
