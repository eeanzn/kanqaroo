import type { MusicProvider, TrackCandidate } from './types'

/**
 * 오프라인 개발·E2E 테스트용 공급자 (MUSIC_PROVIDER=mock).
 * 외부 네트워크 없이 항상 같은 결과를 돌려준다. 아트워크·미리듣기는 없음.
 */
const FIXTURES: Array<[string, string, string]> = [
  ['밤양갱', '비비 (BIBI)', '밤양갱'],
  ['Hype Boy', 'NewJeans', 'NewJeans 1st EP'],
  ['사건의 지평선', '윤하', 'END THEORY : Final Edition'],
  ['Square (2017)', '백예린', 'Every letter I sent you.'],
  ['나의 옛날이야기', '아이유', '꽃갈피'],
  ['Love Wins All', '아이유', 'The Winning'],
  ['한 페이지가 될 수 있게', 'DAY6', 'The Book of Us : Gravity'],
  ['Ditto', 'NewJeans', 'OMG'],
  ['우리의 밤을 외워요', '검정치마', 'TEAM BABY'],
  ['Everything', '검정치마', 'TEAM BABY'],
  ['Supernova', 'aespa', 'Armageddon'],
  ['Pink + White', 'Frank Ocean', 'Blonde'],
  ['Nights', 'Frank Ocean', 'Blonde'],
  ['Teenage Dirtbag', 'Wheatus', 'Wheatus'],
  ['Strawberry Moon', '아이유', 'strawberry moon'],
  ['Kiss Me', 'Sixpence None the Richer', 'Sixpence None the Richer'],
]

export const MOCK_TRACKS: TrackCandidate[] = FIXTURES.map(([title, artist, album], i) => ({
  provider: 'mock',
  providerTrackId: `mock-${i + 1}`,
  title,
  artist,
  album,
  artworkUrl: null,
  previewUrl: null,
  durationMs: 180_000 + i * 7_000,
  sourceUrl: null,
}))

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, '')
}

export const mockProvider: MusicProvider = {
  async search(term) {
    const needle = normalize(term)
    if (!needle) return []
    return MOCK_TRACKS.filter(
      (t) => normalize(t.title).includes(needle) || normalize(t.artist).includes(needle),
    )
  },
  async resolveUrl(url) {
    // 테스트에서 쓰기 쉽게: URL에 mock-<번호>가 있으면 그 곡, 아니면 첫 곡
    const match = url.match(/mock-(\d+)/)
    const track = match ? MOCK_TRACKS[Number(match[1]) - 1] : MOCK_TRACKS[0]
    return track ? { ok: true, track } : { ok: false, reason: 'not_found' }
  },
  async getExactLinks() {
    return {}
  },
}
