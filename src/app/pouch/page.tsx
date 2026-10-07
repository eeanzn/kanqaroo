import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { CopyButton } from '@/components/copy-button'
import { TrackRow } from '@/components/track/track-row'
import { Button, ButtonLink } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { REACTIONS } from '@/db/schema'
import { requireProfile } from '@/lib/auth/viewer'
import {
  BOARD_MIN_TRACKS,
  CRATE_MAX_TRACKS,
  countTracks,
  listCratesWithTracks,
  type CrateWithTracks,
} from '@/lib/data/crates'
import { listPouch, type PouchSlip } from '@/lib/data/slips'
import { env } from '@/lib/env'
import { cn } from '@/lib/cn'
import { REACTION_META } from '@/lib/reactions'

import { blockGiverAction, hideSlipAction, keepSlipTrack, openSlip, reactToSlip } from './actions'

export const metadata: Metadata = { title: '주머니', robots: { index: false } }

export default function PouchPage() {
  return (
    <div className="flex flex-col gap-5 pt-4">
      <h1 className="text-2xl font-extrabold">내 주머니</h1>
      <Suspense fallback={<p className="text-text-muted pt-6 text-center">주머니를 여는 중…</p>}>
        <Pouch />
      </Suspense>
    </div>
  )
}

const dateFormat = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Seoul',
})

async function Pouch() {
  const viewer = await requireProfile('/pouch')
  const [slips, crates] = await Promise.all([
    listPouch(viewer.userId),
    listCratesWithTracks(viewer.userId),
  ])

  if (slips.length === 0) {
    const open = countTracks(crates) >= BOARD_MIN_TRACKS
    return (
      <Card className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-lg font-bold">아직 주머니가 비어 있어요</p>
        <p className="text-text-muted text-sm">
          {open
            ? '보드 링크를 공유하면 친구들이 노래를 넣어줄 거예요.'
            : `보드에 곡을 ${BOARD_MIN_TRACKS}개 이상 담으면 공개돼요.`}
        </p>
        {open ? (
          <CopyButton
            text={`${env.siteUrl}/@${viewer.profile.handle}`}
            label="보드 링크 복사"
            variant="primary"
          />
        ) : (
          <ButtonLink href="/me">곡 담으러 가기</ButtonLink>
        )}
      </Card>
    )
  }

  return (
    <ul className="flex flex-col gap-4">
      {slips.map((slip) => (
        <li key={slip.id}>
          {slip.status === 'unread' ? (
            <SealedSlip slip={slip} when={dateFormat.format(slip.createdAt)} />
          ) : (
            <OpenedSlip slip={slip} crates={crates} when={dateFormat.format(slip.createdAt)} />
          )}
        </li>
      ))}
    </ul>
  )
}

function SealedSlip({ slip, when }: { slip: PouchSlip; when: string }) {
  return (
    <Card className="border-primary/40 flex items-center justify-between gap-3 border-2">
      <div className="min-w-0">
        <p className="font-bold">
          <span className="text-primary">{slip.giverNickname}</span>님이 소매에 노래를 넣었어요
        </p>
        <p className="text-text-muted text-sm">{when}</p>
      </div>
      <form action={openSlip}>
        <input type="hidden" name="slipId" value={slip.id} />
        <Button type="submit" size="sm">
          열어보기
        </Button>
      </form>
    </Card>
  )
}

function OpenedSlip({
  slip,
  crates,
  when,
}: {
  slip: PouchSlip
  crates: CrateWithTracks[]
  when: string
}) {
  const keepable = crates.filter(
    (c) => c.tracks.length < CRATE_MAX_TRACKS && !c.tracks.some((t) => t.id === slip.track.id),
  )
  const alreadyKept = crates.some((c) => c.tracks.some((t) => t.id === slip.track.id))

  return (
    <Card className="flex flex-col gap-4">
      <div className="text-text-muted flex items-center justify-between text-sm">
        <span>
          <strong className="text-text">{slip.giverNickname}</strong>
          {slip.giverHandle && (
            <Link
              href={`/@${slip.giverHandle}`}
              className="ml-1 underline-offset-4 hover:underline"
            >
              @{slip.giverHandle}
            </Link>
          )}
        </span>
        <span>{when}</span>
      </div>
      <TrackRow track={slip.track} />
      <p className="bg-surface-sunken rounded-xl px-4 py-3 text-[15px] leading-relaxed">
        {slip.message}
      </p>

      <form action={reactToSlip} className="flex flex-col gap-2">
        <input type="hidden" name="slipId" value={slip.id} />
        <p className="text-sm font-semibold">어땠어요?</p>
        <div className="grid grid-cols-3 gap-2">
          {REACTIONS.map((r) => (
            <button
              key={r}
              type="submit"
              name="reaction"
              value={r}
              aria-pressed={slip.reaction === r}
              className={cn(
                'h-11 rounded-full border text-sm font-semibold transition-colors',
                slip.reaction === r
                  ? REACTION_META[r].chip
                  : 'border-border-strong text-text-muted hover:bg-surface-sunken',
              )}
            >
              {REACTION_META[r].label}
            </button>
          ))}
        </div>
      </form>

      <div className="border-border flex flex-wrap items-center gap-2 border-t pt-4">
        {alreadyKept ? (
          <span className="text-text-muted text-sm">내 보드에 담았어요</span>
        ) : keepable.length > 0 ? (
          <form action={keepSlipTrack} className="flex flex-1 gap-2">
            <input type="hidden" name="slipId" value={slip.id} />
            <select
              name="crateId"
              aria-label="담을 군집"
              className="border-border-strong bg-surface h-10 min-w-0 flex-1 rounded-full border px-3 text-sm"
            >
              {keepable.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <Button type="submit" variant="secondary" size="sm">
              내 보드에 담기
            </Button>
          </form>
        ) : null}
        {slip.giverHandle && (
          <ButtonLink href={`/@${slip.giverHandle}/slip`} variant="secondary" size="sm">
            답례 소매
          </ButtonLink>
        )}
      </div>

      <details className="text-sm">
        <summary className="text-text-subtle hover:text-text-muted cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          더보기
        </summary>
        <div className="mt-2 flex gap-2">
          <form action={hideSlipAction}>
            <input type="hidden" name="slipId" value={slip.id} />
            <Button type="submit" variant="ghost" size="sm">
              숨기기
            </Button>
          </form>
          <form action={blockGiverAction}>
            <input type="hidden" name="slipId" value={slip.id} />
            <Button type="submit" variant="danger" size="sm">
              이 사람 차단
            </Button>
          </form>
        </div>
      </details>
    </Card>
  )
}
