import { describe, expect, it } from 'vitest'

import { devUserId } from '@/lib/auth/dev-user-id'
import { safeNext } from '@/lib/auth/safe-next'
import { handleSchema, normalizeHandle } from '@/lib/handle'
import { manualTrackId, parseTrackField } from '@/lib/music/track-field'

describe('handle', () => {
  it.each(['jiwoo', 'jiwoo_music', 'abc', 'a1b2c3', 'JIWOO'])('%s 는 허용', (value) => {
    expect(handleSchema.safeParse(value).success).toBe(true)
  })

  it.each(['ab', 'a'.repeat(21), '지우', 'ji-woo', 'ji woo', 'admin', 'pouch', 'me'])(
    '%s 는 거절',
    (value) => {
      expect(handleSchema.safeParse(value).success).toBe(false)
    },
  )

  it('대문자는 소문자로 바꾼다', () => {
    expect(handleSchema.parse('JiWoo')).toBe('jiwoo')
    expect(normalizeHandle(' @JiWoo ')).toBe('jiwoo')
  })
})

describe('곡 후보 검증 (폼 hidden input)', () => {
  const valid = {
    provider: 'itunes',
    providerTrackId: '123',
    title: 'Ditto',
    artist: 'NewJeans',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/preview.m4a',
  }

  it('정상 후보를 통과시킨다', () => {
    expect(parseTrackField(JSON.stringify(valid))).toMatchObject({ title: 'Ditto' })
  })

  it('허용하지 않은 호스트의 아트워크·미리듣기는 거절한다', () => {
    expect(
      parseTrackField(JSON.stringify({ ...valid, artworkUrl: 'https://evil.example/x.jpg' })),
    ).toBeNull()
    expect(
      parseTrackField(
        JSON.stringify({ ...valid, previewUrl: 'http://audio-ssl.itunes.apple.com/x.m4a' }),
      ),
    ).toBeNull()
  })

  it('깨진 JSON이나 빈 값은 null', () => {
    expect(parseTrackField('{oops')).toBeNull()
    expect(parseTrackField('')).toBeNull()
    expect(parseTrackField(null)).toBeNull()
  })

  it('직접 입력한 곡은 제목·아티스트로 같은 id를 만든다', () => {
    const a = parseTrackField(
      JSON.stringify({ provider: 'manual', providerTrackId: 'x', title: '밤양갱', artist: '비비' }),
    )
    const b = parseTrackField(
      JSON.stringify({
        provider: 'manual',
        providerTrackId: 'y',
        title: ' 밤양갱',
        artist: '비비 ',
      }),
    )
    expect(a?.providerTrackId).toBe(manualTrackId('밤양갱', '비비'))
    expect(a?.providerTrackId).toBe(b?.providerTrackId)
  })
})

describe('로그인 보조', () => {
  it('safeNext는 사이트 안 경로만 허용한다', () => {
    expect(safeNext('/pouch')).toBe('/pouch')
    expect(safeNext('//evil.example')).toBeNull()
    expect(safeNext('/\\evil.example')).toBeNull()
    expect(safeNext('https://evil.example')).toBeNull()
    expect(safeNext(null)).toBeNull()
  })

  it('devUserId는 같은 이메일에 같은 uuid를 준다', () => {
    const id = devUserId('A@example.com')
    expect(id).toBe(devUserId('a@example.com'))
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })
})
