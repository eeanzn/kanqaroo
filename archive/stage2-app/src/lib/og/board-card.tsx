import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { PublicBoard } from '@/lib/data/board'

/**
 * 보드 공유 이미지 (OG 1200×630 / 스토리 1080×1920).
 * Satori는 woff2를 못 읽어서 woff 서브셋을 쓴다. 서브셋에 없는 드문 한글은 빈칸으로 보일 수 있음.
 */
export async function loadOgFonts() {
  const dir = join(process.cwd(), 'src/assets/fonts')
  const [bold, medium] = await Promise.all([
    readFile(join(dir, 'Pretendard-Bold.subset.woff')),
    readFile(join(dir, 'Pretendard-Medium.subset.woff')),
  ])
  return [
    { name: 'Pretendard', data: bold, weight: 700 as const, style: 'normal' as const },
    { name: 'Pretendard', data: medium, weight: 500 as const, style: 'normal' as const },
  ]
}

const C = {
  sand50: '#fbf7f0',
  sand200: '#eadbc4',
  ochre500: '#c97b2a',
  ink900: '#211b16',
  ink500: '#7a6e64',
}

export function BoardCard({
  board,
  variant,
}: {
  board: PublicBoard | null
  variant: 'og' | 'story'
}) {
  const story = variant === 'story'
  const name = board?.profile.displayName ?? 'Kanqaroo'
  const handle = board?.profile.handle
  const tracks = (board?.crates.flatMap((c) => c.tracks) ?? []).slice(0, story ? 6 : 3)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: story ? 'center' : 'space-between',
        gap: story ? 56 : 0,
        padding: story ? '120px 96px' : '64px 72px',
        background: C.sand50,
        color: C.ink900,
        fontFamily: 'Pretendard',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontSize: story ? 40 : 30,
          fontWeight: 700,
          color: C.ochre500,
        }}
      >
        kanqaroo
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: story ? 24 : 16 }}>
        <div
          style={{
            fontSize: story ? 96 : 68,
            fontWeight: 700,
            lineHeight: 1.2,
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {`${name} 소매에`}
        </div>
        <div
          style={{ fontSize: story ? 96 : 68, fontWeight: 700, lineHeight: 1.2, color: C.ochre500 }}
        >
          노래 넣어줘
        </div>
      </div>
      {tracks.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: story ? 20 : 10,
            padding: story ? '40px 44px' : '22px 28px',
            borderRadius: 28,
            border: `3px dashed ${C.sand200}`,
            background: '#ffffff',
            fontSize: story ? 38 : 26,
            fontWeight: 500,
          }}
        >
          {tracks.map((t) => (
            <div
              key={t.crateTrackId}
              style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}
            >
              <span style={{ fontWeight: 700 }}>{truncate(t.title, story ? 18 : 24)}</span>
              <span style={{ color: C.ink500 }}>{truncate(t.artist, story ? 14 : 18)}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ fontSize: story ? 40 : 28, fontWeight: 500, color: C.ink500 }}>
        {handle ? `kanqaroo/@${handle}` : '사람이 골라주는 노래'}
      </div>
    </div>
  )
}

function truncate(value: string, max: number) {
  const chars = Array.from(value)
  return chars.length > max ? `${chars.slice(0, max - 1).join('')}…` : value
}
