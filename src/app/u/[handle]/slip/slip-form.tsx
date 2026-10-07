'use client'

import { useActionState, useState } from 'react'

import { TrackPicker } from '@/components/track/track-picker'
import { Button } from '@/components/ui/button'
import { Field, FormError, Input, Textarea } from '@/components/ui/field'

import { sendSlip, type SlipState } from './actions'

export function SlipForm({
  handle,
  ownerName,
  defaultNickname,
  loggedIn,
}: {
  handle: string
  ownerName: string
  defaultNickname?: string
  loggedIn: boolean
}) {
  const [state, action, pending] = useActionState<SlipState, FormData>(sendSlip, {})
  const [messageLength, setMessageLength] = useState(state.values?.message?.length ?? 0)
  const e = state.fieldErrors ?? {}

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="handle" value={handle} />
      {/* honeypot: 화면에는 안 보이고, 봇만 채우는 칸 */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          웹사이트
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="font-bold">1. 어떤 곡을 넣을까요?</h2>
        <p className="text-text-muted text-sm">
          한 번에 한 곡만 넣을 수 있어요. {ownerName}님이 좋아할 것 같은 내 최애곡으로.
        </p>
        <TrackPicker />
        {e.track && (
          <p className="text-danger text-sm" role="alert">
            {e.track}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-bold">2. 한마디</h2>
        <Field
          label="왜 이 곡이에요?"
          htmlFor="message"
          error={e.message}
          hint={`${messageLength}/140`}
        >
          <Textarea
            id="message"
            name="message"
            defaultValue={state.values?.message}
            onChange={(ev) => setMessageLength(ev.target.value.length)}
            maxLength={140}
            required
            placeholder="예: 네 보드에 있는 새벽 노래들이랑 결이 비슷해. 운전할 때 들어봐"
            aria-invalid={!!e.message}
          />
        </Field>
        <Field
          label="닉네임"
          htmlFor="nickname"
          error={e.nickname}
          hint={
            loggedIn
              ? '로그인돼 있어서 내 보드도 같이 전달돼요. 답례 소매를 받을 수 있어요'
              : '계정 없이 닉네임만으로 넣을 수 있어요'
          }
        >
          <Input
            id="nickname"
            name="nickname"
            defaultValue={state.values?.nickname ?? defaultNickname}
            maxLength={20}
            required
            placeholder="예: 같은 반 민지"
            aria-invalid={!!e.nickname}
          />
        </Field>
      </section>

      <FormError message={state.error} />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? '넣는 중…' : '소매에 쏙 넣기'}
      </Button>
    </form>
  )
}
