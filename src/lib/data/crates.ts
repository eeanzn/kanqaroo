import 'server-only'

import { and, asc, eq, inArray, sql } from 'drizzle-orm'

import { getDb, schema } from '@/db'

import type { Track } from './tracks'

const { crates, crateTracks, tracks, slips } = schema

/** 군집 하나에 담을 수 있는 곡 수 (Glossary: 3~12곡) */
export const CRATE_MAX_TRACKS = 12
/** 보드가 공개되려면 필요한 최소 곡 수 */
export const BOARD_MIN_TRACKS = 3

export type CrateTrack = Track & {
  crateTrackId: string
  /** '담기'로 들어온 곡이면 넣어준 사람 닉네임 */
  keptFrom: string | null
}
export type CrateWithTracks = typeof crates.$inferSelect & { tracks: CrateTrack[] }

export async function listCratesWithTracks(ownerId: string): Promise<CrateWithTracks[]> {
  const db = getDb()
  const crateRows = await db
    .select()
    .from(crates)
    .where(eq(crates.ownerId, ownerId))
    .orderBy(asc(crates.position), asc(crates.createdAt))
  if (crateRows.length === 0) return []

  const trackRows = await db
    .select({
      crateId: crateTracks.crateId,
      crateTrackId: crateTracks.id,
      keptFrom: slips.giverNickname,
      track: tracks,
    })
    .from(crateTracks)
    .innerJoin(tracks, eq(tracks.id, crateTracks.trackId))
    .leftJoin(slips, eq(slips.id, crateTracks.sourceSlipId))
    .where(
      inArray(
        crateTracks.crateId,
        crateRows.map((c) => c.id),
      ),
    )
    .orderBy(asc(crateTracks.position), asc(crateTracks.addedAt))

  return crateRows.map((crate) => ({
    ...crate,
    tracks: trackRows
      .filter((r) => r.crateId === crate.id)
      .map((r) => ({ ...r.track, crateTrackId: r.crateTrackId, keptFrom: r.keptFrom })),
  }))
}

export function countTracks(crateList: CrateWithTracks[]): number {
  return crateList.reduce((sum, c) => sum + c.tracks.length, 0)
}

export async function countOwnerTracks(ownerId: string): Promise<number> {
  const [row] = await getDb()
    .select({ count: sql<number>`count(*)::int` })
    .from(crateTracks)
    .innerJoin(crates, eq(crates.id, crateTracks.crateId))
    .where(eq(crates.ownerId, ownerId))
  return row?.count ?? 0
}

export async function createCrate(ownerId: string, title: string) {
  const db = getDb()
  const [{ next }] = await db
    .select({ next: sql<number>`coalesce(max(${crates.position}) + 1, 0)::int` })
    .from(crates)
    .where(eq(crates.ownerId, ownerId))
  const [row] = await db.insert(crates).values({ ownerId, title, position: next }).returning()
  return row
}

export async function getOwnedCrate(ownerId: string, crateId: string) {
  const [row] = await getDb()
    .select()
    .from(crates)
    .where(and(eq(crates.id, crateId), eq(crates.ownerId, ownerId)))
    .limit(1)
  return row ?? null
}

export type AddTrackResult = 'ok' | 'duplicate' | 'full'

export async function addTrackToCrate(input: {
  crateId: string
  trackId: string
  sourceSlipId?: string | null
}): Promise<AddTrackResult> {
  const db = getDb()
  // '이미 있는 곡'이 '가득 참'보다 더 정확한 안내라서 먼저 확인한다
  const [existing] = await db
    .select({ id: crateTracks.id })
    .from(crateTracks)
    .where(and(eq(crateTracks.crateId, input.crateId), eq(crateTracks.trackId, input.trackId)))
    .limit(1)
  if (existing) return 'duplicate'

  const [{ count, next }] = await db
    .select({
      count: sql<number>`count(*)::int`,
      next: sql<number>`coalesce(max(${crateTracks.position}) + 1, 0)::int`,
    })
    .from(crateTracks)
    .where(eq(crateTracks.crateId, input.crateId))
  if (count >= CRATE_MAX_TRACKS) return 'full'

  const inserted = await db
    .insert(crateTracks)
    .values({
      crateId: input.crateId,
      trackId: input.trackId,
      position: next,
      sourceSlipId: input.sourceSlipId ?? null,
    })
    .onConflictDoNothing()
    .returning({ id: crateTracks.id })
  return inserted.length > 0 ? 'ok' : 'duplicate'
}

export async function removeTrackFromCrate(ownerId: string, crateTrackId: string) {
  const db = getDb()
  // 소유자 확인을 같은 쿼리에서: 남의 군집 곡은 지워지지 않는다
  await db
    .delete(crateTracks)
    .where(
      and(
        eq(crateTracks.id, crateTrackId),
        inArray(
          crateTracks.crateId,
          db.select({ id: crates.id }).from(crates).where(eq(crates.ownerId, ownerId)),
        ),
      ),
    )
}
