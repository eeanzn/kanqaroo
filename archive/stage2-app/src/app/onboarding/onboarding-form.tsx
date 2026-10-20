'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Field, FormError, Input } from '@/components/ui/field'

import { createBoard, type OnboardingState } from './actions'

export function OnboardingForm() {
  const [state, action, pending] = useActionState<OnboardingState, FormData>(createBoard, {})
  const v = state.values ?? {}
  const e = state.fieldErrors ?? {}

  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label="보드에 보일 이름" htmlFor="displayName" error={e.displayName}>
        <Input
          id="displayName"
          name="displayName"
          defaultValue={v.displayName}
          maxLength={20}
          required
          placeholder="예: 지우"
          aria-invalid={!!e.displayName}
        />
      </Field>
      <Field
        label="보드 주소"
        htmlFor="handle"
        error={e.handle}
        hint="영문 소문자, 숫자, 밑줄(_)로 3~20자"
      >
        <div className="flex items-center gap-2">
          <span className="text-text-muted text-[15px] font-semibold">kanqaroo/@</span>
          <Input
            id="handle"
            name="handle"
            defaultValue={v.handle}
            required
            minLength={3}
            maxLength={20}
            pattern="[a-zA-Z0-9_]{3,20}"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="jiwoo_music"
            aria-invalid={!!e.handle}
          />
        </div>
      </Field>
      <Field
        label="첫 군집 이름"
        htmlFor="crateTitle"
        error={e.crateTitle}
        hint="곡 묶음 이름이에요. 나중에 더 만들 수 있어요"
      >
        <Input
          id="crateTitle"
          name="crateTitle"
          defaultValue={v.crateTitle ?? '요즘 자주 듣는 노래'}
          maxLength={30}
          required
          aria-invalid={!!e.crateTitle}
        />
      </Field>
      <FormError message={state.error} />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? '만드는 중…' : '다음: 곡 담기'}
      </Button>
    </form>
  )
}
