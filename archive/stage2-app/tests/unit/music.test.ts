import { describe, expect, it } from 'vitest'

import { withFallbackLinks } from '@/lib/music/fallback-links'
import { appleMusicTrackId, parseItunesResponse, upscaleArtwork } from '@/lib/music/itunes'
import { mockProvider } from '@/lib/music/mock'
import { parseOdesliResponse } from '@/lib/music/odesli'
import { PLATFORMS } from '@/lib/music/types'

describe('iTunes 어댑터', () => {
  it('곡(song)만 남기고 필드를 우리 타입으로 바꾼다', () => {
    const tracks = parseItunesResponse({
      resultCount: 3,
      results: [
        {
          wrapperType: 'track',
          kind: 'song',
          trackId: 1645632547,
          trackName: 'Hype Boy',
          artistName: 'NewJeans',
          collectionName: 'NewJeans 1st EP',
          artworkUrl100: 'https://is1-ssl.mzstatic.com/image/thumb/Music/abc/100x100bb.jpg',
          previewUrl: 'https://audio-ssl.itunes.apple.com/preview.m4a',
          trackTimeMillis: 179000,
          trackViewUrl: 'https://music.apple.com/kr/album/hype-boy/1?i=1645632547',
        },
        { wrapperType: 'track', kind: 'music-video', trackId: 2, trackName: 'MV', artistName: 'X' },
        { wrapperType: 'collection', collectionName: 'Album' },
      ],
    })
    expect(tracks).toHaveLength(1)
    expect(tracks[0]).toMatchObject({
      provider: 'itunes',
      providerTrackId: '1645632547',
      title: 'Hype Boy',
      artist: 'NewJeans',
      artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music/abc/600x600bb.jpg',
      durationMs: 179000,
    })
  })

  it('이상한 응답에도 빈 배열을 돌려준다', () => {
    expect(parseItunesResponse(null)).toEqual([])
    expect(parseItunesResponse({ results: 'nope' as unknown as [] })).toEqual([])
  })

  it('아트워크가 없으면 null', () => {
    expect(upscaleArtwork(undefined)).toBeNull()
  })

  it('Apple Music 링크에서 trackId를 뽑는다', () => {
    expect(
      appleMusicTrackId('https://music.apple.com/kr/album/ditto/1660046616?i=1660046619'),
    ).toBe('1660046619')
    expect(appleMusicTrackId('https://music.apple.com/kr/song/ditto/1660046619')).toBe('1660046619')
    expect(appleMusicTrackId('https://music.apple.com/kr/album/omg/1660046616')).toBeNull()
    expect(appleMusicTrackId('https://open.spotify.com/track/abc')).toBeNull()
    expect(appleMusicTrackId('not a url')).toBeNull()
  })
})

describe('Odesli 어댑터', () => {
  const response = {
    entityUniqueId: 'SPOTIFY_SONG::3r8RuvgbX9s7ammBn07D3W',
    entitiesByUniqueId: {
      'SPOTIFY_SONG::3r8RuvgbX9s7ammBn07D3W': {
        type: 'song',
        title: 'Ditto',
        artistName: 'NewJeans',
        thumbnailUrl: 'https://i.scdn.co/image/abc',
      },
    },
    linksByPlatform: {
      spotify: { url: 'https://open.spotify.com/track/3r8R', entityUniqueId: 'SPOTIFY_SONG::3r8R' },
      appleMusic: {
        url: 'https://music.apple.com/kr/album/x?i=1660046619',
        entityUniqueId: 'ITUNES_SONG::1660046619',
      },
      youtubeMusic: {
        url: 'https://music.youtube.com/watch?v=abc',
        entityUniqueId: 'YOUTUBE_VIDEO::abc',
      },
      deezer: { url: 'https://www.deezer.com/track/1' },
    },
  }

  it('지원하는 플랫폼 링크만 exact로 매핑한다', () => {
    const parsed = parseOdesliResponse(response)
    expect(Object.keys(parsed.links).sort()).toEqual(['appleMusic', 'spotify', 'youtubeMusic'])
    expect(parsed.links.spotify).toEqual({
      url: 'https://open.spotify.com/track/3r8R',
      exact: true,
    })
  })

  it('같은 곡의 iTunes trackId를 찾아낸다', () => {
    expect(parseOdesliResponse(response).itunesTrackId).toBe('1660046619')
  })

  it('대표 엔티티를 odesli 후보로 만든다', () => {
    expect(parseOdesliResponse(response).primary).toMatchObject({
      provider: 'odesli',
      title: 'Ditto',
      artist: 'NewJeans',
    })
  })

  it('빈 응답도 안전하게 처리한다', () => {
    expect(parseOdesliResponse(undefined)).toEqual({
      links: {},
      itunesTrackId: null,
      primary: null,
    })
  })
})

describe('대체 링크', () => {
  it('정확한 링크는 그대로 두고, 나머지는 검색 링크로 채운다', () => {
    const links = withFallbackLinks(
      { title: '밤양갱', artist: '비비 (BIBI)' },
      { spotify: { url: 'https://open.spotify.com/track/x', exact: true } },
    )
    expect(Object.keys(links)).toEqual([...PLATFORMS])
    expect(links.spotify).toEqual({ url: 'https://open.spotify.com/track/x', exact: true })
    expect(links.melon.exact).toBe(false)
    expect(links.melon.url).toBe(
      `https://www.melon.com/search/total/index.htm?q=${encodeURIComponent('비비 (BIBI) 밤양갱')}`,
    )
  })
})

describe('mock 공급자', () => {
  it('제목·아티스트로 대소문자·공백 무시하고 찾는다', async () => {
    expect((await mockProvider.search('newjeans')).map((t) => t.title)).toEqual([
      'Hype Boy',
      'Ditto',
    ])
    expect(await mockProvider.search('   ')).toEqual([])
  })

  it('링크에 mock-번호가 있으면 그 곡으로 해석한다', async () => {
    const result = await mockProvider.resolveUrl('https://example.com/mock-3')
    expect(result.ok && result.track.title).toBe('사건의 지평선')
  })
})
