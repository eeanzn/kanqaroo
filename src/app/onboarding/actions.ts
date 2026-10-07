'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { readSession } from '@/lib/auth/session'
import { createCrate } from '@/lib/data/crates'
import { createProfile, getProfileByUserId } from '@/lib/data/users'
import { displayNameSchema, handleSchema } from '@/lib/handle'

export type OnboardingState = {
  error?: string
  fieldErrors?: Partial<Record<'handle' | 'displayName' | 'crateTitle', string>>
  values?: Record<string, string>
}

const schema = z.object({
  displayName: displayNameSchema,
  handle: handleSchema,
  crateTitle: z.string().trim().min(1, '군집 이름을 적어줘요').max(30, '30자까지'),
})

export async function createBoard(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const session = await readSession()
  if (!session) redirect('/login')
  if (await getProfileByUserId(session.userId)) redirect('/me')

  const values = {
    displayName: String(formData.get('displayName') ?? ''),
    handle: String(formData.get('handle') ?? '').replace(/^@/, ''),
    crateTitle: String(formData.get('crateTitle') ?? ''),
  }
  const parsed = schema.safeParse(values)
  if (!parsed.success) {
    const fieldErrors: OnboardingState['fieldErrors'] = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<OnboardingState['fieldErrors']>
      fieldErrors[key] ??= issue.message
    }
    return { fieldErrors, values }
  }

  const result = await createProfile({
    userId: session.userId,
    handle: parsed.data.handle,
    displayName: parsed.data.displayName,
  })
  if (result === 'handle_taken') {
    return { fieldErrors: { handle: '이미 누가 쓰고 있어요' }, values }
  }
  await createCrate(session.userId, parsed.data.crateTitle)
  redirect('/me?welcome=1')
}
