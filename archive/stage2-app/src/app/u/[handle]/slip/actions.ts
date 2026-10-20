'use server'

import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { z } from 'zod'

import { getViewer } from '@/lib/auth/viewer'
import { getPublicBoard } from '@/lib/data/board'
import { trackEvent } from '@/lib/data/events'
import { countRecentSlips, insertSlip, isBlocked } from '@/lib/data/slips'
import { fillListenLinks, upsertTrack } from '@/lib/data/tracks'
import { parseTrackField } from '@/lib/music/track-field'
import { currentIpHash } from '@/lib/safety/ip'
import { slipRateLimitExceeded } from '@/lib/safety/rate-limit'
import { createReceiptToken } from '@/lib/safety/tokens'

export type SlipState = {
  error?: string
  fieldErrors?: Partial<Record<'track' | 'message' | 'nickname', string>>
  values?: { message?: string; nickname?: string }
}

const textSchema = z.object({
  message: z.string().trim().min(1, '한마디를 적어 주세요').max(140, '140자까지예요'),
  nickname: z.string().trim().min(1, '닉네임을 적어 주세요').max(20, '20자까지예요'),
})

export async function sendSlip(_prev: SlipState, formData: FormData): Promise<SlipState> {
  const values = {
    message: String(formData.get('message') ?? ''),
    nickname: String(formData.get('nickname') ?? ''),
  }

  // honeypot: 사람 눈엔 안 보이는 칸. 채워져 있으면 봇으로 보고 조용히 거절
  if (String(formData.get('website') ?? '') !== '') {
    return { error: '잠시 뒤에 다시 시도해 주세요.', values }
  }

  const board = await getPublicBoard(String(formData.get('handle') ?? ''))
  if (!board || !board.isOpen) return { error: '이 보드에는 지금 노래를 넣을 수 없어요.', values }
  if (!board.profile.acceptingSlips) return { error: '지금은 소매를 받지 않고 있어요.', values }

  const fieldErrors: SlipState['fieldErrors'] = {}
  const candidate = parseTrackField(formData.get('track'))
  if (!candidate) fieldErrors.track = '넣을 곡을 골라 주세요'
  const text = textSchema.safeParse(values)
  if (!text.success) {
    for (const issue of text.error.issues) {
      const key = issue.path[0] as 'message' | 'nickname'
      fieldErrors[key] ??= issue.message
    }
  }
  if (!candidate || !text.success) return { fieldErrors, values }

  const viewer = await getViewer()
  if (viewer?.userId === board.profile.userId) {
    return { error: '내 보드에는 소매를 넣을 수 없어요.', values }
  }

  const ipHash = await currentIpHash()
  const giverUserId = viewer?.profile ? viewer.userId : null
  const ownerId = board.profile.userId

  if (slipRateLimitExceeded(await countRecentSlips(ipHash, ownerId))) {
    return { error: '너무 자주 넣었어요. 한 시간 뒤에 다시 넣어 주세요.', values }
  }
  // 차단된 사람에게는 차단 사실을 알리지 않고 일반 오류처럼 보이게 한다
  if (await isBlocked({ ownerId, ipHash, giverUserId })) {
    return { error: '지금은 이 보드에 노래를 넣을 수 없어요.', values }
  }

  const track = await upsertTrack(candidate)
  const { token, hash } = createReceiptToken()
  const slip = await insertSlip({
    boardOwnerId: ownerId,
    trackId: track.id,
    message: text.data.message,
    giverNickname: text.data.nickname,
    giverUserId,
    receiptTokenHash: hash,
    ipHash,
  })

  after(async () => {
    await trackEvent('slip_created', giverUserId, {
      slipId: slip.id,
      boardOwnerId: ownerId,
      provider: track.provider,
      loggedIn: !!giverUserId,
    })
    await fillListenLinks(track.id)
  })

  redirect(`/r/${token}?new=1`)
}
