/**
 * 음악 레이어 공용 타입.
 * 외부 API(iTunes, Odesli 등)는 전부 MusicProvider 뒤에 숨긴다. 화면 코드는 이 타입만 안다.
 */

/** "내 앱에서 듣기"에 보여줄 플랫폼. 배열 순서 = 화면 표시 순서 */
export const PLATFORMS = [
  'youtubeMusic',
  'spotify',
  'appleMusic',
  'melon',
  'genie',
  'flo',
  'vibe',
] as const
export type Platform = (typeof PLATFORMS)[number]

export const PLATFORM_LABELS: Record<Platform, string> = {
  youtubeMusic: 'YouTube Music',
  spotify: 'Spotify',
  appleMusic: 'Apple Music',
  melon: '멜론',
  genie: '지니',
  flo: 'FLO',
  vibe: 'VIBE',
}

export type ListenLink = {
  url: string
  /** true면 그 곡의 정확한 링크, false면 "아티스트 + 제목" 검색 결과 링크 */
  exact: boolean
}

export type ListenLinks = Partial<Record<Platform, ListenLink>>

export type TrackProvider = 'itunes' | 'odesli' | 'manual' | 'mock'

/** 검색·링크 해석 결과로 나온 곡 후보. 아직 DB에 저장되기 전 상태 */
export type TrackCandidate = {
  provider: TrackProvider
  providerTrackId: string
  title: string
  artist: string
  album?: string | null
  artworkUrl?: string | null
  previewUrl?: string | null
  durationMs?: number | null
  sourceUrl?: string | null
  /** 해석 과정에서 이미 얻은 정확한 링크가 있으면 같이 넘긴다 */
  links?: ListenLinks | null
}

export type ResolveResult =
  | { ok: true; track: TrackCandidate }
  | { ok: false; reason: 'unsupported' | 'not_found' | 'unavailable' }

export interface MusicProvider {
  /** 제목·아티스트 검색 */
  search(term: string): Promise<TrackCandidate[]>
  /** 붙여넣은 링크(Spotify, Apple Music, YouTube 등)를 곡으로 해석 */
  resolveUrl(url: string): Promise<ResolveResult>
  /** 곡의 정확한 스트리밍 앱 링크들. 실패하면 빈 객체 */
  getExactLinks(track: TrackCandidate): Promise<ListenLinks>
}
