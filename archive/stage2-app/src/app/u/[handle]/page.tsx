import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { TrackRow } from '@/components/track/track-row'
import { ButtonLink } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getViewer } from '@/lib/auth/viewer'
import { getPublicBoard } from '@/lib/data/board'

export async function generateMetadata({ params }: PageProps<'/u/[handle]'>): Promise<Metadata> {
  const board = await getPublicBoard((await params).handle)
  if (!board) return { title: '보드를 찾을 수 없어요' }
  const { displayName, handle } = board.profile
  return {
    title: `${displayName}의 취향 보드`,
    description: `${displayName}(@${handle}) 소매에 노래 한 곡 넣어 주세요.`,
    openGraph: { url: `/@${handle}` },
  }
}

export default function BoardPage({ params }: PageProps<'/u/[handle]'>) {
  return (
    <Suspense fallback={<BoardSkeleton />}>
      <Board params={params} />
    </Suspense>
  )
}

async function Board({ params }: Pick<PageProps<'/u/[handle]'>, 'params'>) {
  const board = await getPublicBoard((await params).handle)
  if (!board) notFound()
  const viewer = await getViewer()
  const { profile } = board
  const isOwner = viewer?.userId === profile.userId

  return (
    <div className="flex flex-col gap-5 pt-4">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold">{profile.displayName}의 취향 보드</h1>
        <p className="text-text-muted text-[15px]">@{profile.handle}</p>
        {profile.bio && <p className="text-[15px] leading-relaxed">{profile.bio}</p>}
      </section>

      {isOwner ? (
        <ButtonLink href="/me" variant="secondary" size="lg">
          내 보드 편집
        </ButtonLink>
      ) : !board.isOpen ? (
        <Card className="bg-surface-sunken text-center shadow-none">
          <p className="font-semibold">아직 보드를 채우는 중이에요</p>
          <p className="text-text-muted mt-1 text-sm">조금 뒤에 다시 와 주세요.</p>
        </Card>
      ) : profile.acceptingSlips ? (
        <ButtonLink href={`/@${profile.handle}/slip`} size="lg">
          {profile.displayName} 소매에 노래 넣기
        </ButtonLink>
      ) : (
        <Card className="bg-surface-sunken text-center shadow-none">
          <p className="font-semibold">지금은 소매를 받지 않고 있어요</p>
        </Card>
      )}

      {board.crates.map((crate) => (
        <Card key={crate.id} className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">{crate.title}</h2>
          <ul className="flex flex-col gap-3">
            {crate.tracks.map((track) => (
              <li key={track.crateTrackId}>
                <TrackRow
                  track={track}
                  note={track.keptFrom ? `${track.keptFrom}가 넣어준 곡` : undefined}
                />
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  )
}

function BoardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-5 pt-4" aria-label="불러오는 중">
      <div className="bg-surface-sunken h-8 w-2/3 rounded-lg" />
      <div className="bg-surface-sunken h-14 rounded-full" />
      <div className="bg-surface-sunken h-64 rounded-[var(--radius-card)]" />
    </div>
  )
}
