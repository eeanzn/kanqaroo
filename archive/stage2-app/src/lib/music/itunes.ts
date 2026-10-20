import type { TrackCandidate } from './types'

/**
 * iTunes Search API 어댑터. 키 없이 쓸 수 있고 IP당 분당 약 20회 제한이 있다.
 * https://performance-partners.apple.com/search-api
 */
const BASE = 'https://itunes.apple.com'
const COUNTRY = 'KR'
const TIMEOUT_MS = 6000

type ItunesTrack = {
  wrapperType?: string
  kind?: string
  trackId?: number
  trackName?: string
  artistName?: string
  collectionName?: string
  artworkUrl100?: string
  previewUrl?: string
  trackTimeMillis?: number
  trackViewUrl?: string
}

type ItunesResponse = { resultCount?: number; results?: ItunesTrack[] }

/** 100x100 썸네일 주소를 600x600으로 바꾼다 (같은 CDN 경로 규칙) */
export function upscaleArtwork(url: string | undefined): string | null {
  if (!url) return null
  return url.replace(/\/\d+x\d+(bb)?\.(jpg|png|webp)$/, '/600x600bb.$2')
}

export function parseItunesResponse(json: unknown): TrackCandidate[] {
  const results = (json as ItunesResponse | null)?.results ?? []
  const tracks: TrackCandidate[] = []
  for (const item of results) {
    if (item.wrapperType !== 'track' || item.kind !== 'song') continue
    if (!item.trackId || !item.trackName || !item.artistName) continue
    tracks.push({
      provider: 'itunes',
      providerTrackId: String(item.trackId),
      title: item.trackName,
      artist: item.artistName,
      album: item.collectionName ?? null,
      artworkUrl: upscaleArtwork(item.artworkUrl100),
      previewUrl: item.previewUrl ?? null,
      durationMs: item.trackTimeMillis ?? null,
      sourceUrl: item.trackViewUrl ?? null,
    })
  }
  return tracks
}

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!res.ok) throw new Error(`iTunes ${res.status}`)
  return res.json()
}

export async function searchItunes(term: string, limit = 15): Promise<TrackCandidate[]> {
  const params = new URLSearchParams({
    term,
    country: COUNTRY,
    media: 'music',
    entity: 'song',
    limit: String(limit),
    lang: 'ko_kr',
  })
  return parseItunesResponse(await getJson(`${BASE}/search?${params}`))
}

export async function lookupItunes(trackId: string): Promise<TrackCandidate | null> {
  const params = new URLSearchParams({ id: trackId, country: COUNTRY, entity: 'song' })
  const [track] = parseItunesResponse(await getJson(`${BASE}/lookup?${params}`))
  return track ?? null
}

/**
 * Apple Music 곡 링크에서 iTunes trackId를 뽑는다.
 *   https://music.apple.com/kr/album/<name>/<albumId>?i=<trackId>
 *   https://music.apple.com/kr/song/<name>/<trackId>
 */
export function appleMusicTrackId(rawUrl: string): string | null {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    return null
  }
  if (!/(^|\.)music\.apple\.com$|(^|\.)itunes\.apple\.com$/.test(url.hostname)) return null
  const fromQuery = url.searchParams.get('i')
  if (fromQuery && /^\d+$/.test(fromQuery)) return fromQuery
  const songMatch = url.pathname.match(/\/song\/(?:[^/]+\/)?(\d+)\/?$/)
  return songMatch?.[1] ?? null
}
