import { z } from 'zod'

import { PLATFORMS } from './types'

/**
 * 브라우저에서 넘어온 곡 후보를 서버에서 다시 검증한다.
 * 아트워크·미리듣기 URL은 아무 주소나 받지 않도록 알려진 CDN만 허용.
 */
const ARTWORK_HOSTS = [/\.mzstatic\.com$/, /^i\.scdn\.co$/, /^i\.ytimg\.com$/, /\.dzcdn\.net$/]
const PREVIEW_HOSTS = [/\.itunes\.apple\.com$/, /\.mzstatic\.com$/, /\.apple\.com$/]

function hostIn(patterns: RegExp[]) {
  return (value: string) => {
    try {
      const url = new URL(value)
      return url.protocol === 'https:' && patterns.some((p) => p.test(url.hostname))
    } catch {
      return false
    }
  }
}

const httpsUrl = z
  .string()
  .max(2000)
  .refine((v) => v.startsWith('https://'), 'https 링크만 허용')

const linkSchema = z.object({ url: httpsUrl, exact: z.boolean() })

export const trackCandidateSchema = z.object({
  provider: z.enum(['itunes', 'odesli', 'manual', 'mock']),
  providerTrackId: z.string().min(1).max(200),
  title: z.string().trim().min(1).max(200),
  artist: z.string().trim().min(1).max(200),
  album: z.string().max(200).nullish(),
  artworkUrl: z.string().max(2000).refine(hostIn(ARTWORK_HOSTS)).nullish(),
  previewUrl: z.string().max(2000).refine(hostIn(PREVIEW_HOSTS)).nullish(),
  durationMs: z
    .number()
    .int()
    .positive()
    .max(60 * 60 * 1000)
    .nullish(),
  sourceUrl: httpsUrl.nullish(),
  links: z.partialRecord(z.enum(PLATFORMS), linkSchema).nullish(),
})

export type TrackCandidateInput = z.infer<typeof trackCandidateSchema>

/** 검색에 안 나오는 곡을 직접 입력할 때 */
export const manualTrackSchema = z.object({
  title: z.string().trim().min(1, '제목을 적어줘').max(200),
  artist: z.string().trim().min(1, '아티스트를 적어줘').max(200),
})
