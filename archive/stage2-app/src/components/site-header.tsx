import Link from 'next/link'
import { Suspense } from 'react'

import { Wordmark } from '@/components/brand/logo'
import { ButtonLink } from '@/components/ui/button'
import { getViewer } from '@/lib/auth/viewer'
import { countUnread } from '@/lib/data/slips'

export function SiteHeader() {
  return (
    <header className="border-border/60 bg-bg/90 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-lg items-center justify-between px-4">
        <Link href="/" aria-label="Kanqaroo 홈">
          <Wordmark />
        </Link>
        {/* 로그인 상태는 쿠키를 읽어야 해서 Suspense 안에서 따로 스트리밍 */}
        <Suspense fallback={<div className="h-9 w-20" />}>
          <HeaderNav />
        </Suspense>
      </div>
    </header>
  )
}

async function HeaderNav() {
  const viewer = await getViewer()
  if (!viewer) {
    return (
      <ButtonLink href="/login" size="sm">
        시작하기
      </ButtonLink>
    )
  }
  if (!viewer.profile) {
    return (
      <ButtonLink href="/onboarding" size="sm">
        보드 만들기
      </ButtonLink>
    )
  }
  const unread = await countUnread(viewer.userId)
  return (
    <nav className="flex items-center gap-1 text-sm font-semibold">
      <Link href="/pouch" className="hover:bg-surface-sunken relative rounded-full px-3 py-2">
        주머니
        {unread > 0 && (
          <span className="bg-primary text-on-primary absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full px-1 text-[11px]">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </Link>
      <Link href="/me" className="hover:bg-surface-sunken rounded-full px-3 py-2">
        내 보드
      </Link>
    </nav>
  )
}
