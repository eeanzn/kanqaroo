import { ImageResponse } from 'next/og'

import { getPublicBoard } from '@/lib/data/board'
import { BoardCard, loadOgFonts } from '@/lib/og/board-card'

export const alt = 'Kanqaroo 취향 보드'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ handle: string }> }) {
  const board = await getPublicBoard((await params).handle)
  return new ImageResponse(<BoardCard board={board} variant="og" />, {
    ...size,
    fonts: await loadOgFonts(),
  })
}
