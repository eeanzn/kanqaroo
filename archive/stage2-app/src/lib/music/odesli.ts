import type { ListenLinks, TrackCandidate } from './types'

/**
 * Odesli(song.link) 어댑터. 링크 하나로 각 스트리밍 서비스의 같은 곡 링크를 돌려준다.
 * 키 없이 IP당 분당 약 10회. ODESLI_API_KEY가 있으면 붙인다.
 * https://odesli.co
 */
const BASE = 'https://api.song.link/v1-alpha.1/links'
const TIMEOUT_MS = 8000

type OdesliEntity = {
  id?: string
  type?: string
  title?: string
  artistName?: string
  thumbnailUrl?: string
  apiProvider?: string
}

type OdesliResponse = {
  entityUniqueId?: string
  entitiesByUniqueId?: Record<string, OdesliEntity>
  linksByPlatform?: Record<string, { url?: string; entityUniqueId?: string }>
}

/** Odesli 플랫폼 이름 → 우리 플랫폼 이름 */
const PLATFORM_MAP = {
  youtubeMusic: 'youtubeMusic',
  spotify: 'spotify',
  appleMusic: 'appleMusic',
} as const

export type OdesliParsed = {
  links: ListenLinks
  /** 같은 곡의 iTunes trackId (있으면 iTunes에서 미리듣기·아트워크를 다시 가져올 수 있음) */
  itunesTrackId: string | null
  /** iTunes가 없을 때 쓸 대표 엔티티 */
  primary: TrackCandidate | null
}

export function parseOdesliResponse(json: unknown): OdesliParsed {
  const data = (json ?? {}) as OdesliResponse
  const links: ListenLinks = {}
  for (const [odesliName, ours] of Object.entries(PLATFORM_MAP)) {
    const url = data.linksByPlatform?.[odesliName]?.url
    if (url) links[ours] = { url, exact: true }
  }

  const itunesEntityId =
    data.linksByPlatform?.appleMusic?.entityUniqueId ?? data.linksByPlatform?.itunes?.entityUniqueId
  const itunesMatch = itunesEntityId?.match(/^ITUNES_SONG::(\d+)$/)

  const primaryId = data.entityUniqueId
  const entity = primaryId ? data.entitiesByUniqueId?.[primaryId] : undefined
  const primary: TrackCandidate | null =
    primaryId && entity?.title && entity.artistName && entity.type === 'song'
      ? {
          provider: 'odesli',
          providerTrackId: primaryId,
          title: entity.title,
          artist: entity.artistName,
          artworkUrl: entity.thumbnailUrl ?? null,
          links,
        }
      : null

  return { links, itunesTrackId: itunesMatch?.[1] ?? null, primary }
}

async function request(
  params: Record<string, string>,
  apiKey?: string,
): Promise<OdesliParsed | null> {
  const search = new URLSearchParams({ ...params, userCountry: 'KR' })
  // ⚠ 키 파라미터 이름(`key`)은 Odesli 공식 문서 기준으로 알고 있지만 실제 키로는 아직 확인 못 함
  if (apiKey) search.set('key', apiKey)
  const res = await fetch(`${BASE}?${search}`, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (res.status === 404 || res.status === 400) return null
  if (!res.ok) throw new Error(`Odesli ${res.status}`)
  return parseOdesliResponse(await res.json())
}

export function odesliByUrl(url: string, apiKey?: string) {
  return request({ url }, apiKey)
}

export function odesliByItunesId(trackId: string, apiKey?: string) {
  return request({ platform: 'itunes', type: 'song', id: trackId }, apiKey)
}
