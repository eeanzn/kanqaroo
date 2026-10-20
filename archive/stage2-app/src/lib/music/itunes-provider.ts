import { appleMusicTrackId, lookupItunes, searchItunes } from './itunes'
import { odesliByItunesId, odesliByUrl } from './odesli'
import type { MusicProvider, ResolveResult } from './types'

/** 배포용 공급자: 검색·미리듣기는 iTunes, 앱별 링크는 Odesli */
export function createItunesProvider(options: { odesliApiKey?: string } = {}): MusicProvider {
  const { odesliApiKey } = options

  return {
    search(term) {
      return searchItunes(term)
    },

    async resolveUrl(url): Promise<ResolveResult> {
      if (/melon\.com|genie\.co\.kr|music-flo\.com|vibe\.naver\.com/.test(url)) {
        // 국내 서비스 링크는 Odesli가 읽지 못한다
        return { ok: false, reason: 'unsupported' }
      }
      try {
        // Apple Music 링크는 Odesli를 거치지 않고 iTunes에서 바로 찾는다
        const appleId = appleMusicTrackId(url)
        if (appleId) {
          const track = await lookupItunes(appleId)
          return track ? { ok: true, track } : { ok: false, reason: 'not_found' }
        }

        const resolved = await odesliByUrl(url, odesliApiKey)
        if (!resolved) return { ok: false, reason: 'not_found' }
        if (resolved.itunesTrackId) {
          const track = await lookupItunes(resolved.itunesTrackId)
          if (track) return { ok: true, track: { ...track, links: resolved.links } }
        }
        return resolved.primary
          ? { ok: true, track: resolved.primary }
          : { ok: false, reason: 'not_found' }
      } catch {
        return { ok: false, reason: 'unavailable' }
      }
    },

    async getExactLinks(track) {
      if (track.links && Object.keys(track.links).length > 0) return track.links
      if (track.provider !== 'itunes') return {}
      try {
        const resolved = await odesliByItunesId(track.providerTrackId, odesliApiKey)
        return resolved?.links ?? {}
      } catch {
        return {}
      }
    },
  }
}
