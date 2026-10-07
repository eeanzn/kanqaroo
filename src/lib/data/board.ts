import 'server-only'

import { normalizeHandle } from '@/lib/handle'

import { BOARD_MIN_TRACKS, countTracks, listCratesWithTracks, type CrateWithTracks } from './crates'
import { getProfileByHandle, type Profile } from './users'

export type PublicBoard = {
  profile: Profile
  crates: CrateWithTracks[]
  totalTracks: number
  /** 곡이 최소 개수 이상이라 공개 상태인지 */
  isOpen: boolean
}

/** URL의 handle(퍼센트 인코딩·@ 포함 가능)로 공개 보드를 읽는다 */
export async function getPublicBoard(rawHandle: string): Promise<PublicBoard | null> {
  let handle: string
  try {
    handle = normalizeHandle(decodeURIComponent(rawHandle))
  } catch {
    return null
  }
  if (!/^[a-z0-9_]{3,20}$/.test(handle)) return null
  const profile = await getProfileByHandle(handle)
  if (!profile) return null
  const crates = await listCratesWithTracks(profile.userId)
  const totalTracks = countTracks(crates)
  return {
    profile,
    crates: crates.filter((c) => c.tracks.length > 0),
    totalTracks,
    isOpen: totalTracks >= BOARD_MIN_TRACKS,
  }
}
