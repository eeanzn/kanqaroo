import { createHash } from 'node:crypto'

import { trackCandidateSchema } from './candidate-schema'
import type { TrackCandidate } from './types'

/**
 * 폼의 hidden input(`track`, JSON)으로 넘어온 곡 후보를 검증한다.
 * 직접 입력한 곡은 제목·아티스트로 id를 만들어서 같은 곡이 중복 저장되지 않게 한다.
 */
export function parseTrackField(raw: FormDataEntryValue | null): TrackCandidate | null {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > 10_000) return null
  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return null
  }
  const parsed = trackCandidateSchema.safeParse(json)
  if (!parsed.success) return null
  const track = parsed.data
  if (track.provider === 'manual') {
    return {
      provider: 'manual',
      providerTrackId: manualTrackId(track.title, track.artist),
      title: track.title,
      artist: track.artist,
    }
  }
  return track
}

export function manualTrackId(title: string, artist: string): string {
  const key = `${artist}|${title}`.toLowerCase().replace(/\s+/g, ' ').trim()
  return createHash('sha256').update(key).digest('hex').slice(0, 32)
}
