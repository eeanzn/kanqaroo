import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { CopyButton } from '@/components/copy-button'
import { TrackRow } from '@/components/track/track-row'
import { Badge, Card } from '@/components/ui/card'
import { logout } from '@/app/login/actions'
import { requireProfile } from '@/lib/auth/viewer'
import {
  BOARD_MIN_TRACKS,
  CRATE_MAX_TRACKS,
  countTracks,
  listCratesWithTracks,
} from '@/lib/data/crates'
import { env } from '@/lib/env'

import { removeTrack, setAcceptingSlips } from './actions'
import { AddTrackForm, NewCrateForm, ProfileForm } from './forms'

export const metadata: Metadata = { title: '내 보드' }

export default function MyBoardPage({ searchParams }: PageProps<'/me'>) {
  return (
    <Suspense fallback={<p className="text-text-muted pt-10 text-center">보드를 불러오는 중…</p>}>
      <MyBoard searchParams={searchParams} />
    </Suspense>
  )
}

async function MyBoard({ searchParams }: Pick<PageProps<'/me'>, 'searchParams'>) {
  const viewer = await requireProfile('/me')
  const { welcome } = await searchParams
  const { profile } = viewer
  const crates = await listCratesWithTracks(viewer.userId)
  const total = countTracks(crates)
  const remaining = Math.max(0, BOARD_MIN_TRACKS - total)
  const boardUrl = `${env.siteUrl}/@${profile.handle}`

  return (
    <div className="flex flex-col gap-5 pt-4">
      <div className="flex flex-col gap-1">
        {welcome && <p className="text-primary text-sm font-semibold">2 / 2 · 곡을 담아 주세요</p>}
        <h1 className="text-2xl font-extrabold">내 보드</h1>
        <Link
          href={`/@${profile.handle}`}
          className="text-text-muted text-[15px] underline-offset-4 hover:underline"
        >
          kanqaroo/@{profile.handle}
        </Link>
      </div>

      {remaining > 0 ? (
        <Card className="bg-primary-soft shadow-none">
          <p className="font-bold">보드 공개까지 {remaining}곡 남았어요</p>
          <p className="text-text-muted mt-1 text-sm">
            곡이 {BOARD_MIN_TRACKS}개 이상 있어야 친구들이 취향을 보고 노래를 넣을 수 있어요.
          </p>
        </Card>
      ) : (
        <Card className="flex flex-col gap-3">
          <div>
            <p className="font-bold">보드가 열렸어요</p>
            <p className="text-text-muted mt-1 text-sm">
              링크를 인스타 프로필이나 스토리에 걸어 보세요.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={boardUrl} variant="primary" />
            <a
              href={`/u/${profile.handle}/story`}
              download={`kanqaroo-${profile.handle}.png`}
              className="border-border-strong bg-surface hover:bg-surface-sunken inline-flex h-11 items-center rounded-full border px-5 text-[15px] font-semibold"
            >
              스토리 이미지 저장
            </a>
          </div>
        </Card>
      )}

      {crates.map((crate, index) => (
        <Card key={crate.id} className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold">{crate.title}</h2>
            <span className="text-text-muted text-sm">
              {crate.tracks.length}/{CRATE_MAX_TRACKS}
            </span>
          </div>
          {crate.tracks.length > 0 && (
            <ul className="flex flex-col gap-3">
              {crate.tracks.map((track) => (
                <li key={track.crateTrackId}>
                  <TrackRow
                    track={track}
                    showListen={false}
                    note={track.keptFrom ? `${track.keptFrom}가 넣어준 곡` : undefined}
                    actions={
                      <form action={removeTrack}>
                        <input type="hidden" name="crateTrackId" value={track.crateTrackId} />
                        <button
                          type="submit"
                          className="text-text-muted hover:bg-surface-sunken hover:text-danger h-10 rounded-full px-3 text-sm"
                          aria-label={`${track.title} 빼기`}
                        >
                          빼기
                        </button>
                      </form>
                    }
                  />
                </li>
              ))}
            </ul>
          )}
          {crate.tracks.length < CRATE_MAX_TRACKS && (
            <details
              open={crate.tracks.length === 0 || (index === 0 && remaining > 0)}
              className="group border-border-strong rounded-2xl border border-dashed p-3 open:border-solid"
            >
              <summary className="text-primary cursor-pointer list-none text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                + 곡 추가
              </summary>
              <div className="mt-3">
                <AddTrackForm crateId={crate.id} autoFocus={index === 0 && remaining > 0} />
              </div>
            </details>
          )}
        </Card>
      ))}

      <Card className="flex flex-col gap-3">
        <h2 className="font-bold">새 군집</h2>
        <NewCrateForm />
      </Card>

      <Card className="flex flex-col gap-4">
        <h2 className="font-bold">보드 설정</h2>
        <ProfileForm displayName={profile.displayName} bio={profile.bio} />
        <form
          action={setAcceptingSlips}
          className="border-border flex items-center justify-between gap-3 border-t pt-4"
        >
          <div>
            <p className="text-[15px] font-semibold">소매 받기</p>
            <p className="text-text-muted text-sm">끄면 보드는 보이지만 노래를 넣을 수 없어요</p>
          </div>
          <input type="hidden" name="accepting" value={profile.acceptingSlips ? 'off' : 'on'} />
          <button type="submit" aria-pressed={profile.acceptingSlips} className="shrink-0">
            <Badge
              tone={profile.acceptingSlips ? 'primary' : 'neutral'}
              className="px-3 py-1.5 text-sm"
            >
              {profile.acceptingSlips ? '켜짐' : '꺼짐'}
            </Badge>
          </button>
        </form>
      </Card>

      <form action={logout} className="flex justify-center">
        <button
          type="submit"
          className="text-text-muted text-sm underline-offset-4 hover:underline"
        >
          로그아웃 ({viewer.email})
        </button>
      </form>
    </div>
  )
}
