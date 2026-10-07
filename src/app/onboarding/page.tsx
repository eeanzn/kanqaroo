import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { requireViewer } from '@/lib/auth/viewer'

import { OnboardingForm } from './onboarding-form'

export const metadata: Metadata = { title: '보드 만들기' }

export default function OnboardingPage() {
  return (
    <div className="flex flex-col gap-6 pt-8">
      <div className="flex flex-col gap-2">
        <p className="text-primary text-sm font-semibold">1 / 2</p>
        <h1 className="text-2xl font-extrabold">내 취향 보드 만들기</h1>
        <p className="text-text-muted text-[15px]">친구들이 이 보드를 보고 노래를 골라줄 거예요.</p>
      </div>
      <Suspense fallback={<div className="h-80" />}>
        <Gate />
      </Suspense>
    </div>
  )
}

async function Gate() {
  const viewer = await requireViewer('/onboarding')
  if (viewer.profile) redirect('/me')
  return <OnboardingForm />
}
