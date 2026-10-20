'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Field, FormError, Input } from '@/components/ui/field'

import { requestLogin, type LoginState } from './actions'

export function LoginForm({
  next,
  from,
  devMode,
}: {
  next?: string
  from?: string
  devMode: boolean
}) {
  const [state, action, pending] = useActionState<LoginState, FormData>(requestLogin, {})

  if (state.sentTo) {
    return (
      <div className="bg-surface flex flex-col gap-3 rounded-[var(--radius-card)] p-6 text-center shadow-[var(--shadow-card)]">
        <p className="text-lg font-bold">메일함을 확인해 주세요</p>
        <p className="text-text-muted text-[15px] leading-relaxed">
          <strong className="text-text">{state.sentTo}</strong>로 로그인 링크를 보냈어요.
          <br />
          메일이 안 보이면 스팸함도 한 번 봐 주세요.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next ?? ''} />
      <input type="hidden" name="from" value={from ?? ''} />
      <Field
        label="이메일"
        htmlFor="email"
        hint={
          devMode
            ? '로컬 개발 모드: 메일 없이 바로 로그인돼요'
            : '비밀번호 없이, 메일로 온 링크로 로그인해요'
        }
      >
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="you@example.com"
        />
      </Field>
      <FormError message={state.error} />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? '보내는 중…' : devMode ? '바로 로그인' : '로그인 링크 받기'}
      </Button>
    </form>
  )
}
