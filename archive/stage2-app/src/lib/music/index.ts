import 'server-only'

import { env } from '@/lib/env'

import { createItunesProvider } from './itunes-provider'
import { mockProvider } from './mock'
import type { MusicProvider } from './types'

export function getMusicProvider(): MusicProvider {
  return env.musicProvider === 'mock'
    ? mockProvider
    : createItunesProvider({ odesliApiKey: env.odesliApiKey })
}

export * from './types'
export { withFallbackLinks } from './fallback-links'
