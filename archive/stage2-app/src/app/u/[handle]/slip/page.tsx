import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'

import { Artwork } from '@/components/track/artwork'
import { Card } from '@/components/ui/card'
import { getViewer } from '@/lib/auth/viewer'
import { getPublicBoard } from '@/lib/data/board'

import { SlipForm } from './slip-form'

export const metadata: Metadata = { title: '소매에 노래 넣기', robots: { index: false } }

export default function SlipPage({ params }: PageProps<'/u/[handle]/slip'>) {
  return (
    <Suspense fallback={<p className="text-text-muted pt-10 text-center">불러오는 중…</p>}>
      <SlipContent params={params} />
    </Suspense>
  )
}

async function SlipContent({ params }: Pick<PageProps<'/u/[handle]/slip'>, 'params'>) {
  const board = await getPublicBoard((await params).handle)
  if (!board) notFound()
  const { profile } = board
  const viewer = await getViewer()
  if (viewer?.userId === profile.userId || !board.isOpen || !profile.acceptingSlips) {
    redirect(`/@${profile.handle}`)
  }

  // 넣는 사람이 취향을 떠올릴 수 있게 군집 요약을 위에 보여준다
  const preview = board.crates.flatMap((c) => c.tracks).slice(0, 6)

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="flex flex-col gap-1">
        <Link
          href={`/@${profile.handle}`}
          className="text-text-muted hover:text-text text-sm font-semibold"
        >
          ← @{profile.handle} 보드
        </Link>
        <h1 className="text-2xl font-extrabold">{profile.displayName} 소매에 노래 넣기</h1>
      </div>

      <Card className="bg-surface-sunken flex flex-col gap-3 shadow-none">
        <p className="text-text-muted text-sm font-semibold">
          {profile.displayName}님 취향: {board.crates.map((c) => c.title).join(' · ')}
        </p>
        <div className="flex -space-x-2">
          {preview.map((t) => (
            <Artwork
              key={t.crateTrackId}
              url={t.artworkUrl}
              title={t.title}
              size="sm"
              className="ring-surface-sunken ring-2"
            />
          ))}
        </div>
        <p className="text-text-muted text-sm">
          {preview
            .slice(0, 3)
            .map((t) => `${t.artist} – ${t.title}`)
            .join(', ')}
          {board.totalTracks > 3 ? ` 외 ${board.totalTracks - 3}곡` : ''}
        </p>
      </Card>

      <SlipForm
        handle={profile.handle}
        ownerName={profile.displayName}
        defaultNickname={viewer?.profile?.displayName}
        loggedIn={!!viewer?.profile}
      />
    </div>
  )
}
