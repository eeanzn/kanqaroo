import { defineConfig, devices } from '@playwright/test'

/**
 * E2E: 외부 서비스 없이 핵심 루프 전체를 돈다.
 * 로컬 Postgres + AUTH_MODE=dev(메일 없이 로그인) + MUSIC_PROVIDER=mock(고정 곡 데이터)
 *   E2E_DATABASE_URL=postgres://.../kanqaroo_e2e npm run test:e2e
 */
const PORT = Number(process.env.E2E_PORT ?? 3100)
const DATABASE_URL =
  process.env.E2E_DATABASE_URL ?? 'postgres://kanqaroo:kanqaroo@127.0.0.1:54329/kanqaroo_e2e'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'ko-KR',
    trace: 'retain-on-failure',
    ...devices['Pixel 7'],
  },
  webServer: {
    command: `npm run db:migrate && npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 300_000,
    reuseExistingServer: !process.env.CI,
    env: {
      DATABASE_URL,
      AUTH_MODE: 'dev',
      MUSIC_PROVIDER: 'mock',
      SESSION_SECRET: 'e2e-secret-e2e-secret-e2e-secret-123456',
      NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}`,
    },
  },
})
