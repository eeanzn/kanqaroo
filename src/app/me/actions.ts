'use server'

import { refresh } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { z } from 'zod'

import { readSession } from '@/lib/auth/session'
import {
  addTrackToCrate,
  BOARD_MIN_TRACKS,
  countOwnerTracks,
  createCrate,
  getOwnedCrate,
  removeTrackFromCrate,
} from '@/lib/data/crates'
import { trackEvent } from '@/lib/data/events'
import { fillListenLinks, upsertTrack } from '@/lib/data/tracks'
import { getProfileByUserId, updateProfile } from '@/lib/data/users'
import { parseTrackField } from '@/lib/music/track-field'

/** 모든 액션은 스스로 세션을 다시 확인한다 (화면에서 숨긴 것만으로는 보호가 안 됨) */
async function requireOwner() {
  const session = await readSession()
  if (!session) redirect('/login')
  const profile = await getProfileByUserId(session.userId)
  if (!profile) redirect('/onboarding')
  return { userId: session.userId, profile }
}

export type AddTrackState = { error?: string; added?: number }

export async function addTrack(prev: AddTrackState, formData: FormData): Promise<AddTrackState> {
  const { userId } = await requireOwner()
  const crate = await getOwnedCrate(userId, String(formData.get('crateId') ?? ''))
  if (!crate) return { error: '군집을 찾을 수 없어요' }
  const candidate = parseTrackField(formData.get('track'))
  if (!candidate) return { error: '곡을 먼저 골라 주세요' }

  const before = await countOwnerTracks(userId)
  const track = await upsertTrack(candidate)
  const result = await addTrackToCrate({ crateId: crate.id, trackId: track.id })
  if (result === 'duplicate') return { error: '이미 이 군집에 있는 곡이에요' }
  if (result === 'full') return { error: '군집 하나에는 12곡까지 담을 수 있어요' }

  after(async () => {
    await fillListenLinks(track.id)
    if (before < BOARD_MIN_TRACKS && before + 1 >= BOARD_MIN_TRACKS) {
      await trackEvent('board_published', userId)
    }
  })
  refresh()
  return { added: (prev.added ?? 0) + 1 }
}

export async function removeTrack(formData: FormData) {
  const { userId } = await requireOwner()
  await removeTrackFromCrate(userId, String(formData.get('crateTrackId') ?? ''))
  refresh()
}

export type CreateCrateState = { error?: string; created?: number }

export async function createCrateAction(
  prev: CreateCrateState,
  formData: FormData,
): Promise<CreateCrateState> {
  const { userId } = await requireOwner()
  const title = z.string().trim().min(1).max(30).safeParse(formData.get('title'))
  if (!title.success) return { error: '군집 이름은 1~30자로 적어 주세요' }
  await createCrate(userId, title.data)
  refresh()
  return { created: (prev.created ?? 0) + 1 }
}

export async function setAcceptingSlips(formData: FormData) {
  const { userId } = await requireOwner()
  await updateProfile(userId, { acceptingSlips: formData.get('accepting') === 'on' })
  refresh()
}

export type ProfileState = { error?: string; saved?: number }

export async function saveProfile(prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const { userId } = await requireOwner()
  const parsed = z
    .object({
      displayName: z.string().trim().min(1).max(20),
      bio: z.string().trim().max(80),
    })
    .safeParse({ displayName: formData.get('displayName'), bio: formData.get('bio') ?? '' })
  if (!parsed.success) return { error: '이름은 1~20자, 소개는 80자까지예요' }
  await updateProfile(userId, {
    displayName: parsed.data.displayName,
    bio: parsed.data.bio || null,
  })
  refresh()
  return { saved: (prev.saved ?? 0) + 1 }
}
