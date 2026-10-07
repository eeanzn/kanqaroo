import 'server-only'

import { redirect } from 'next/navigation'
import { cache } from 'react'

import { getProfileByUserId, type Profile } from '@/lib/data/users'

import { readSession } from './session'

/**
 * 데이터 접근 계층(DAL)의 입구: "지금 보고 있는 사람"을 읽는다.
 * 쿠키를 읽으므로 이걸 부르는 컴포넌트는 <Suspense> 안에 있어야 한다.
 */
export type Viewer = { userId: string; email: string; profile: Profile | null }
export type ViewerWithProfile = Viewer & { profile: Profile }

export const getViewer = cache(async (): Promise<Viewer | null> => {
  const session = await readSession()
  if (!session) return null
  const profile = await getProfileByUserId(session.userId)
  return { ...session, profile }
})

export async function requireViewer(next?: string): Promise<Viewer> {
  const viewer = await getViewer()
  if (!viewer) redirect(next ? `/login?next=${encodeURIComponent(next)}` : '/login')
  return viewer
}

export async function requireProfile(next?: string): Promise<ViewerWithProfile> {
  const viewer = await requireViewer(next)
  if (!viewer.profile) redirect('/onboarding')
  return viewer as ViewerWithProfile
}
