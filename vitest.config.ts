import { defineConfig } from 'vitest/config'

// React Router 플러그인 없이 순수 로직(utils, data)만 테스트한다.
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ['app/**/*.test.ts'],
    // Windows에서 셸 경로가 소문자 드라이브(d:\)로 잡히면 기본 풀(forks/threads)은 vitest 모듈을
    // D:/ 와 d:/ 두 경로로 이중 로드해 `describe`가 "reading 'config'" 오류로 깨진다.
    // vmThreads는 이 경우에도 정상 동작한다(순수 로직 테스트라 vm 격리의 제약과 무관).
    pool: 'vmThreads',
  },
})
