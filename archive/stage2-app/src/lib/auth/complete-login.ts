import 'server-only'

import { after } from 'next/server'

import { trackEvent } from '@/lib/data/events'
import { getProfileByUserId, upsertUser } from '@/lib/data/users'

import { safeNext } from './safe-next'
import { writeSession } from './session'

/**
 * 신원 확인이 끝난 뒤 공통 처리: users 행 확보 → 세션 쿠키 → 다음 행선지 결정.
 * dev 로그인과 매직링크 콜백이 같이 쓴다.
 */
export async function completeLogin(input: {
  userId: string
  email: string
  next?: string | null
  from?: string | null
}): Promise<string> {
  const { created } = await upsertUser({ id: input.userId, email: input.email })
  await writeSession({ userId: input.userId, email: input.email.toLowerCase() })

  if (created && input.from === 'receipt') {
    after(() => trackEvent('signup_from_receipt', input.userId))
  }

  const profile = await getProfileByUserId(input.userId)
  if (!profile) return '/onboarding'
  return safeNext(input.next) ?? '/pouch'
}
