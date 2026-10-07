'use server'

import { refresh } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'

import { REACTIONS, type Reaction } from '@/db/schema'
import { readSession } from '@/lib/auth/session'
import { addTrackToCrate, getOwnedCrate } from '@/lib/data/crates'
import { trackEvent } from '@/lib/data/events'
import { blockSlipGiver, getOwnSlip, hideSlip, markOpened, setReaction } from '@/lib/data/slips'

async function requireUserId() {
  const session = await readSession()
  if (!session) redirect('/login?next=/pouch')
  return session.userId
}

const slipIdOf = (formData: FormData) => String(formData.get('slipId') ?? '')

export async function openSlip(formData: FormData) {
  const userId = await requireUserId()
  const slipId = slipIdOf(formData)
  if (await markOpened(userId, slipId)) {
    after(() => trackEvent('slip_opened', userId, { slipId }))
  }
  refresh()
}

export async function reactToSlip(formData: FormData) {
  const userId = await requireUserId()
  const slipId = slipIdOf(formData)
  const reaction = String(formData.get('reaction')) as Reaction
  if (!REACTIONS.includes(reaction)) return
  if (await setReaction(userId, slipId, reaction)) {
    after(() => trackEvent('reaction', userId, { slipId, reaction }))
  }
  refresh()
}

export async function keepSlipTrack(formData: FormData) {
  const userId = await requireUserId()
  const slip = await getOwnSlip(userId, slipIdOf(formData))
  const crate = await getOwnedCrate(userId, String(formData.get('crateId') ?? ''))
  if (!slip || !crate) return
  const result = await addTrackToCrate({
    crateId: crate.id,
    trackId: slip.trackId,
    sourceSlipId: slip.id,
  })
  if (result === 'ok')
    after(() => trackEvent('keep', userId, { slipId: slip.id, crateId: crate.id }))
  refresh()
}

export async function hideSlipAction(formData: FormData) {
  const userId = await requireUserId()
  await hideSlip(userId, slipIdOf(formData))
  refresh()
}

export async function blockGiverAction(formData: FormData) {
  const userId = await requireUserId()
  await blockSlipGiver(userId, slipIdOf(formData))
  refresh()
}
