/**
 * 데이터 계층 통합 테스트. 실제 Postgres가 필요하다.
 *   TEST_DATABASE_URL=postgres://.../kanqaroo_test npx vitest run tests/integration
 * (마이그레이션은 미리: DATABASE_URL=$TEST_DATABASE_URL npm run db:migrate)
 */
import { randomUUID } from 'node:crypto'

import { sql } from 'drizzle-orm'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

const TEST_DB = process.env.TEST_DATABASE_URL

describe.skipIf(!TEST_DB)('데이터 계층 (Postgres)', async () => {
  process.env.DATABASE_URL = TEST_DB
  process.env.SESSION_SECRET ??= 'test-secret-test-secret-test-secret-1234'

  const { getDb } = await import('@/db')
  const users = await import('@/lib/data/users')
  const crates = await import('@/lib/data/crates')
  const tracks = await import('@/lib/data/tracks')
  const slips = await import('@/lib/data/slips')
  const board = await import('@/lib/data/board')
  const { MOCK_TRACKS } = await import('@/lib/music/mock')
  const { createReceiptToken } = await import('@/lib/safety/tokens')

  const owner = { id: randomUUID(), email: 'owner@example.com' }
  const other = { id: randomUUID(), email: 'other@example.com' }

  async function reset() {
    await getDb().execute(
      sql`truncate events, blocks, slips, crate_tracks, crates, tracks, profiles, users restart identity cascade`,
    )
  }

  async function seedBoard(trackCount: number) {
    await users.upsertUser(owner)
    await users.createProfile({ userId: owner.id, handle: 'owner_board', displayName: '주인' })
    const crate = await crates.createCrate(owner.id, '새벽 운전')
    for (const candidate of MOCK_TRACKS.slice(0, trackCount)) {
      const track = await tracks.upsertTrack(candidate)
      await crates.addTrackToCrate({ crateId: crate.id, trackId: track.id })
    }
    return crate
  }

  async function sendSlip(ipHash = 'ip-a') {
    const track = await tracks.upsertTrack(MOCK_TRACKS[10])
    const { token, hash } = createReceiptToken()
    const slip = await slips.insertSlip({
      boardOwnerId: owner.id,
      trackId: track.id,
      message: '이거 들어봐',
      giverNickname: '민지',
      giverUserId: null,
      receiptTokenHash: hash,
      ipHash,
    })
    return { slip, token, track }
  }

  beforeAll(reset)
  beforeEach(reset)
  afterAll(reset)

  it('handle은 대소문자 구분 없이 유일하다', async () => {
    await users.upsertUser(owner)
    await users.upsertUser(other)
    expect(await users.createProfile({ userId: owner.id, handle: 'jiwoo', displayName: 'A' })).toBe(
      'ok',
    )
    expect(await users.createProfile({ userId: other.id, handle: 'JIWOO', displayName: 'B' })).toBe(
      'handle_taken',
    )
  })

  it('곡이 3개 이상이어야 보드가 열린다', async () => {
    await seedBoard(2)
    expect((await board.getPublicBoard('owner_board'))?.isOpen).toBe(false)
    const crate = (await crates.listCratesWithTracks(owner.id))[0]
    const third = await tracks.upsertTrack(MOCK_TRACKS[5])
    await crates.addTrackToCrate({ crateId: crate.id, trackId: third.id })
    expect((await board.getPublicBoard('%40Owner_Board'))?.isOpen).toBe(true)
  })

  it('같은 곡은 한 번만 저장되고, 군집 중복·12곡 제한을 지킨다', async () => {
    const crate = await seedBoard(12)
    const again = await tracks.upsertTrack(MOCK_TRACKS[0])
    expect(await crates.addTrackToCrate({ crateId: crate.id, trackId: again.id })).toBe('duplicate')
    const extra = await tracks.upsertTrack(MOCK_TRACKS[13])
    expect(await crates.addTrackToCrate({ crateId: crate.id, trackId: extra.id })).toBe('full')
  })

  it('최근 1시간 소매 수를 IP·보드별로 센다', async () => {
    await seedBoard(3)
    await sendSlip('ip-a')
    await sendSlip('ip-a')
    await sendSlip('ip-b')
    expect(await slips.countRecentSlips('ip-a', owner.id)).toEqual({
      totalLastHour: 2,
      toBoardLastHour: 2,
    })
    expect(await slips.countRecentSlips('ip-a', other.id)).toEqual({
      totalLastHour: 2,
      toBoardLastHour: 0,
    })
  })

  it('열어보기는 처음 한 번만 true, 남의 소매는 못 건드린다', async () => {
    await seedBoard(3)
    await users.upsertUser(other)
    const { slip } = await sendSlip()
    expect(await slips.markOpened(other.id, slip.id)).toBe(false)
    expect(await slips.setReaction(other.id, slip.id, 'fit')).toBe(false)
    expect(await slips.markOpened(owner.id, slip.id)).toBe(true)
    expect(await slips.markOpened(owner.id, slip.id)).toBe(false)
  })

  it('반응은 영수증에 보이고, 차단하면 영수증에선 반응이 사라진다', async () => {
    await seedBoard(3)
    const { slip, token } = await sendSlip('ip-bad')
    expect((await slips.getReceipt(token))?.status).toBe('unread')

    await slips.setReaction(owner.id, slip.id, 'new')
    expect(await slips.getReceipt(token)).toMatchObject({
      status: 'opened',
      reaction: 'new',
      boardHandle: 'owner_board',
    })

    await slips.blockSlipGiver(owner.id, slip.id)
    expect(await slips.isBlocked({ ownerId: owner.id, ipHash: 'ip-bad', giverUserId: null })).toBe(
      true,
    )
    expect(await slips.listPouch(owner.id)).toHaveLength(0)
    expect((await slips.getReceipt(token))?.reaction).toBeNull()
  })

  it('담기: 받은 곡을 내 군집에 넣으면 출처 닉네임이 남는다', async () => {
    const crate = await seedBoard(3)
    const { slip, track } = await sendSlip()
    expect(
      await crates.addTrackToCrate({ crateId: crate.id, trackId: track.id, sourceSlipId: slip.id }),
    ).toBe('ok')
    const [withKept] = await crates.listCratesWithTracks(owner.id)
    expect(withKept.tracks.find((t) => t.id === track.id)?.keptFrom).toBe('민지')
  })

  it('남의 군집 곡은 뺄 수 없다', async () => {
    await seedBoard(3)
    await users.upsertUser(other)
    const [crate] = await crates.listCratesWithTracks(owner.id)
    await crates.removeTrackFromCrate(other.id, crate.tracks[0].crateTrackId)
    expect(await crates.countOwnerTracks(owner.id)).toBe(3)
    await crates.removeTrackFromCrate(owner.id, crate.tracks[0].crateTrackId)
    expect(await crates.countOwnerTracks(owner.id)).toBe(2)
  })
})
