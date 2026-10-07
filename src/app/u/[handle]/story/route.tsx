import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

import { getPublicBoard } from '@/lib/data/board'
import { BoardCard, loadOgFonts } from '@/lib/og/board-card'

/** 인스타 스토리용 9:16 이미지 다운로드 (Receiptify처럼 공유 자체가 확산 장치) */
export async function GET(_request: NextRequest, { params }: RouteContext<'/u/[handle]/story'>) {
  const board = await getPublicBoard((await params).handle)
  if (!board) return new Response('Not found', { status: 404 })
  return new ImageResponse(<BoardCard board={board} variant="story" />, {
    width: 1080,
    height: 1920,
    fonts: await loadOgFonts(),
    headers: {
      'Content-Disposition': `attachment; filename="kanqaroo-${board.profile.handle}.png"`,
      'Cache-Control': 'public, max-age=300',
    },
  })
}
