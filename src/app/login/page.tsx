import type { Metadata } from 'next'
import { Suspense } from 'react'

import { FormError } from '@/components/ui/field'
import { env } from '@/lib/env'

import { LoginForm } from './login-form'

export const metadata: Metadata = { title: '시작하기' }

export default function LoginPage({ searchParams }: PageProps<'/login'>) {
  return (
    <div className="flex flex-col gap-6 pt-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold">내 보드 만들기</h1>
        <p className="text-text-muted text-[15px]">
          이메일만 있으면 돼요. 받은 노래는 주머니에 쌓여요.
        </p>
      </div>
      <Suspense fallback={<div className="h-48" />}>
        <LoginFormWithParams searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function LoginFormWithParams({ searchParams }: Pick<PageProps<'/login'>, 'searchParams'>) {
  const params = await searchParams
  const pick = (key: string) =>
    typeof params[key] === 'string' ? (params[key] as string) : undefined
  return (
    <div className="flex flex-col gap-4">
      {pick('error') === 'link' && (
        <FormError message="링크가 만료됐거나 이미 쓰였어요. 다시 받아 주세요." />
      )}
      <LoginForm next={pick('next')} from={pick('from')} devMode={env.authMode === 'dev'} />
    </div>
  )
}
