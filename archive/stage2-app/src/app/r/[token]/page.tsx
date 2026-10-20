import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { after } from 'next/server'
import { Suspense } from 'react'

import { CopyButton } from '@/components/copy-button'
import { TrackRow } from '@/components/track/track-row'
import { ButtonLink } from '@/components/ui/button'
import { getViewer } from '@/lib/auth/viewer'
import { trackEvent } from '@/lib/data/events'
import { getReceipt } from '@/lib/data/slips'
import { env } from '@/lib/env'
import { REACTION_META } from '@/lib/reactions'
import { isWellFormedToken } from '@/lib/safety/tokens'

// 영수증은 링크를 가진 사람만 보는 페이지라 검색엔진에 노출하지 않는다
export const metadata: Metadata = { title: '소매 영수증', robots: { index: false, follow: false } }

export default function ReceiptPage(props: PageProps<'/r/[token]'>) {
  return (
    <Suspense fallback={<p className="text-text-muted pt-10 text-center">영수증을 찾는 중…</p>}>
      <ReceiptContent {...props} />
    </Suspense>
  )
}

const dateFormat = new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Seoul',
})

async function ReceiptContent({ params, searchParams }: PageProps<'/r/[token]'>) {
  const { token } = await params
  const { new: isNew } = await searchParams
  if (!isWellFormedToken(token)) notFound()
  const receipt = await getReceipt(token)
  if (!receipt) notFound()

  const viewer = await getViewer()
  after(() =>
    trackEvent('receipt_viewed', viewer?.userId ?? null, { slipId: receipt.id, isNew: !!isNew }),
  )

  const receiptUrl = `${env.siteUrl}/r/${token}`
  const reaction = receipt.reaction ? REACTION_META[receipt.reaction] : null

  return (
    <div className="flex flex-col gap-6 pt-4">
      {isNew ? (
        <div className="flex flex-col gap-2">
          <p className="text-primary text-sm font-semibold">소매넣기 완료</p>
          <h1 className="text-2xl font-extrabold">
            쏙! {receipt.boardDisplayName}님 소매에 넣었어요
          </h1>
          <p className="text-text-muted text-[15px] leading-relaxed">
            이 페이지가 영수증이에요. 주소를 저장해 두면 나중에 {receipt.boardDisplayName}님 반응을
            볼 수 있어요.
          </p>
          <div>
            <CopyButton text={receiptUrl} label="영수증 링크 복사" variant="primary" />
          </div>
        </div>
      ) : (
        <h1 className="text-2xl font-extrabold">소매 영수증</h1>
      )}

      <article className="border-border-strong bg-surface flex flex-col gap-4 rounded-[var(--radius-card)] border border-dashed p-5">
        <div className="text-text-muted flex items-center justify-between text-xs font-semibold tracking-wide">
          <span>TO @{receipt.boardHandle}</span>
          <span>{dateFormat.format(receipt.createdAt)}</span>
        </div>
        <TrackRow track={receipt.track} />
        <p className="bg-surface-sunken rounded-xl px-4 py-3 text-[15px] leading-relaxed">
          {receipt.message}
        </p>
        <p className="text-text-muted text-right text-sm">FROM {receipt.giverNickname}</p>
        <div className="border-border-strong border-t border-dashed pt-4">
          {reaction ? (
            <div className="flex items-center gap-2">
              <span className="text-text-muted text-sm">{receipt.boardDisplayName}님 반응</span>
              <span className={`rounded-full border px-3 py-1 text-sm font-bold ${reaction.chip}`}>
                {reaction.label}
              </span>
            </div>
          ) : (
            <p className="text-text-muted text-sm">
              {receipt.status === 'unread'
                ? '아직 열어보지 않았어요'
                : '열어봤어요. 반응은 아직이에요'}
            </p>
          )}
        </div>
      </article>

      {viewer?.profile ? (
        <ButtonLink href="/pouch" variant="secondary" size="lg">
          내 주머니 보기
        </ButtonLink>
      ) : (
        <section className="bg-ink-900 text-sand-50 flex flex-col gap-3 rounded-[var(--radius-card)] p-6">
          <p className="text-lg font-bold">너도 받아볼래?</p>
          <p className="text-sand-300 text-sm">
            내 취향 보드를 만들면 친구들이 내 소매에도 노래를 넣어줘요.
          </p>
          <ButtonLink href="/login?from=receipt" size="lg">
            내 보드 만들기
          </ButtonLink>
        </section>
      )}
      <Link
        href={`/@${receipt.boardHandle}`}
        className="text-text-muted text-center text-sm underline-offset-4 hover:underline"
      >
        @{receipt.boardHandle} 보드 다시 보기
      </Link>
    </div>
  )
}
