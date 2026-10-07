import 'server-only'

import { and, desc, eq, gt, ne, or, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

import { getDb, schema } from '@/db'
import type { Reaction } from '@/db/schema'
import { hashToken } from '@/lib/safety/tokens'

import type { Track } from './tracks'

const { slips, tracks, profiles, blocks } = schema

const HOUR_MS = 60 * 60 * 1000

export async function countRecentSlips(ipHash: string, boardOwnerId: string) {
  const since = new Date(Date.now() - HOUR_MS)
  const [row] = await getDb()
    .select({
      totalLastHour: sql<number>`count(*)::int`,
      toBoardLastHour: sql<number>`count(*) filter (where ${slips.boardOwnerId} = ${boardOwnerId})::int`,
    })
    .from(slips)
    .where(and(eq(slips.ipHash, ipHash), gt(slips.createdAt, since)))
  return { totalLastHour: row?.totalLastHour ?? 0, toBoardLastHour: row?.toBoardLastHour ?? 0 }
}

export async function isBlocked(input: {
  ownerId: string
  ipHash: string
  giverUserId: string | null
}): Promise<boolean> {
  const conditions = [eq(blocks.ipHash, input.ipHash)]
  if (input.giverUserId) conditions.push(eq(blocks.giverUserId, input.giverUserId))
  const [row] = await getDb()
    .select({ id: blocks.id })
    .from(blocks)
    .where(and(eq(blocks.ownerId, input.ownerId), or(...conditions)))
    .limit(1)
  return !!row
}

export async function insertSlip(input: {
  boardOwnerId: string
  trackId: string
  message: string
  giverNickname: string
  giverUserId: string | null
  receiptTokenHash: string
  ipHash: string
}) {
  const [row] = await getDb().insert(slips).values(input).returning({ id: slips.id })
  return row
}

export type PouchSlip = {
  id: string
  message: string
  giverNickname: string
  /** 준 사람이 보드를 가진 회원이면 그 handle (답례 소매용) */
  giverHandle: string | null
  status: 'unread' | 'opened' | 'hidden'
  reaction: Reaction | null
  createdAt: Date
  track: Track
}

const giverProfile = alias(profiles, 'giver_profile')

export async function listPouch(ownerId: string): Promise<PouchSlip[]> {
  const rows = await getDb()
    .select({
      slip: slips,
      track: tracks,
      giverHandle: giverProfile.handle,
    })
    .from(slips)
    .innerJoin(tracks, eq(tracks.id, slips.trackId))
    .leftJoin(giverProfile, eq(giverProfile.userId, slips.giverUserId))
    .where(and(eq(slips.boardOwnerId, ownerId), ne(slips.status, 'hidden')))
    // 안 열어본 소매가 먼저, 그다음 최신순
    .orderBy(sql`(${slips.status} = 'unread') desc`, desc(slips.createdAt))
    .limit(100)

  return rows.map(({ slip, track, giverHandle }) => ({
    id: slip.id,
    message: slip.message,
    giverNickname: slip.giverNickname,
    giverHandle,
    status: slip.status,
    reaction: slip.reaction,
    createdAt: slip.createdAt,
    track,
  }))
}

export async function countUnread(ownerId: string): Promise<number> {
  const [row] = await getDb()
    .select({ count: sql<number>`count(*)::int` })
    .from(slips)
    .where(and(eq(slips.boardOwnerId, ownerId), eq(slips.status, 'unread')))
  return row?.count ?? 0
}

/** 보드 주인 본인 소매만 바뀌도록 항상 ownerId 조건을 같이 건다 */
function ownSlip(ownerId: string, slipId: string) {
  return and(eq(slips.id, slipId), eq(slips.boardOwnerId, ownerId))
}

export async function getOwnSlip(ownerId: string, slipId: string) {
  const [row] = await getDb().select().from(slips).where(ownSlip(ownerId, slipId)).limit(1)
  return row ?? null
}

/** 처음 열어볼 때만 true를 돌려준다 (slip_opened 이벤트 중복 방지) */
export async function markOpened(ownerId: string, slipId: string): Promise<boolean> {
  const updated = await getDb()
    .update(slips)
    .set({ status: 'opened', openedAt: new Date() })
    .where(and(ownSlip(ownerId, slipId), eq(slips.status, 'unread')))
    .returning({ id: slips.id })
  return updated.length > 0
}

export async function setReaction(ownerId: string, slipId: string, reaction: Reaction) {
  const updated = await getDb()
    .update(slips)
    .set({
      reaction,
      reactedAt: new Date(),
      status: 'opened',
      openedAt: sql`coalesce(${slips.openedAt}, now())`,
    })
    .where(ownSlip(ownerId, slipId))
    .returning({ id: slips.id })
  return updated.length > 0
}

export async function hideSlip(ownerId: string, slipId: string) {
  await getDb().update(slips).set({ status: 'hidden' }).where(ownSlip(ownerId, slipId))
}

/** 이 소매를 보낸 사람(IP 해시 + 계정)을 차단하고 소매는 숨긴다 */
export async function blockSlipGiver(ownerId: string, slipId: string) {
  const db = getDb()
  const slip = await getOwnSlip(ownerId, slipId)
  if (!slip) return
  await db.insert(blocks).values({ ownerId, ipHash: slip.ipHash, giverUserId: slip.giverUserId })
  const sameGiver = [eq(slips.ipHash, slip.ipHash)]
  if (slip.giverUserId) sameGiver.push(eq(slips.giverUserId, slip.giverUserId))
  await db
    .update(slips)
    .set({ status: 'hidden' })
    .where(and(eq(slips.boardOwnerId, ownerId), or(...sameGiver)))
}

export type Receipt = {
  id: string
  message: string
  giverNickname: string
  status: 'unread' | 'opened' | 'hidden'
  reaction: Reaction | null
  createdAt: Date
  boardHandle: string
  boardDisplayName: string
  track: Track
}

export async function getReceipt(token: string): Promise<Receipt | null> {
  const [row] = await getDb()
    .select({ slip: slips, track: tracks, profile: profiles })
    .from(slips)
    .innerJoin(tracks, eq(tracks.id, slips.trackId))
    .innerJoin(profiles, eq(profiles.userId, slips.boardOwnerId))
    .where(eq(slips.receiptTokenHash, hashToken(token)))
    .limit(1)
  if (!row) return null
  return {
    id: row.slip.id,
    message: row.slip.message,
    giverNickname: row.slip.giverNickname,
    // 숨김(차단) 여부는 보낸 사람에게 알리지 않는다
    status: row.slip.status === 'hidden' ? 'opened' : row.slip.status,
    reaction: row.slip.status === 'hidden' ? null : row.slip.reaction,
    createdAt: row.slip.createdAt,
    boardHandle: row.profile.handle,
    boardDisplayName: row.profile.displayName,
    track: row.track,
  }
}
