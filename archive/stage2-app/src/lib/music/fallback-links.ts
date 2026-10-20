import { PLATFORMS, type ListenLinks, type Platform } from './types'

/**
 * 정확한 링크가 없는 플랫폼은 "아티스트 + 제목" 검색 페이지로 보낸다.
 * 멜론·지니·FLO·VIBE는 공개 API가 없어서 항상 이 방식.
 * ⚠ 각 서비스의 검색 URL 형식은 공식 문서가 없고, 아직 실제 브라우저로 확인하지 못했다(확신 중간).
 *   Stage 2 배포 후 한 번씩 눌러보고, 바뀌면 여기만 고치면 됨.
 */
const SEARCH_URL: Record<Platform, (query: string) => string> = {
  youtubeMusic: (q) => `https://music.youtube.com/search?q=${q}`,
  spotify: (q) => `https://open.spotify.com/search/${q}`,
  appleMusic: (q) => `https://music.apple.com/kr/search?term=${q}`,
  melon: (q) => `https://www.melon.com/search/total/index.htm?q=${q}`,
  genie: (q) => `https://www.genie.co.kr/search/searchMain?query=${q}`,
  flo: (q) => `https://www.music-flo.com/search/all?keyword=${q}`,
  vibe: (q) => `https://vibe.naver.com/search?query=${q}`,
}

export function searchQuery(track: { title: string; artist: string }): string {
  return `${track.artist} ${track.title}`.replace(/\s+/g, ' ').trim()
}

export function buildSearchLink(platform: Platform, track: { title: string; artist: string }) {
  return SEARCH_URL[platform](encodeURIComponent(searchQuery(track)))
}

/** 저장된 정확한 링크 위에 검색 링크를 채워서, 모든 플랫폼에 링크가 하나씩 있게 만든다 */
export function withFallbackLinks(
  track: { title: string; artist: string },
  exact: ListenLinks | null | undefined,
): Required<ListenLinks> {
  const merged = {} as Required<ListenLinks>
  for (const platform of PLATFORMS) {
    const known = exact?.[platform]
    merged[platform] =
      known && known.exact ? known : { url: buildSearchLink(platform, track), exact: false }
  }
  return merged
}
