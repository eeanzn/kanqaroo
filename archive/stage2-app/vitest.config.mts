import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // server-only는 React Server 환경 밖에서 import하면 에러를 내므로 테스트에선 비운다
      'server-only': fileURLToPath(new URL('./tests/support/empty.ts', import.meta.url)),
    },
  },
  test: {
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    environment: 'node',
    // 통합 테스트는 같은 DB를 쓰므로 파일 단위 병렬 실행을 끈다
    fileParallelism: false,
  },
})
