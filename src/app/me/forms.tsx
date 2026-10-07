'use client'

import { useActionState } from 'react'

import { TrackPicker } from '@/components/track/track-picker'
import { Button } from '@/components/ui/button'
import { FormError, Input, Textarea } from '@/components/ui/field'

import {
  addTrack,
  createCrateAction,
  saveProfile,
  type AddTrackState,
  type CreateCrateState,
  type ProfileState,
} from './actions'

export function AddTrackForm({ crateId, autoFocus }: { crateId: string; autoFocus?: boolean }) {
  const [state, action, pending] = useActionState<AddTrackState, FormData>(addTrack, {})
  return (
    // 담기에 성공할 때마다 key가 바뀌어 곡 고르기가 초기화된다
    <form key={state.added ?? 0} action={action} className="flex flex-col gap-3">
      <input type="hidden" name="crateId" value={crateId} />
      <TrackPicker autoFocus={autoFocus} />
      <FormError message={state.error} />
      <Button type="submit" disabled={pending}>
        {pending ? '담는 중…' : '이 군집에 담기'}
      </Button>
    </form>
  )
}

export function NewCrateForm() {
  const [state, action, pending] = useActionState<CreateCrateState, FormData>(createCrateAction, {})
  return (
    <form key={state.created ?? 0} action={action} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          name="title"
          placeholder="예: 비 오는 날"
          maxLength={30}
          required
          aria-label="새 군집 이름"
        />
        <Button type="submit" variant="secondary" disabled={pending}>
          만들기
        </Button>
      </div>
      <FormError message={state.error} />
    </form>
  )
}

export function ProfileForm({ displayName, bio }: { displayName: string; bio: string | null }) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(saveProfile, {})
  return (
    <form action={action} className="flex flex-col gap-2">
      <Input
        name="displayName"
        defaultValue={displayName}
        maxLength={20}
        required
        aria-label="보드에 보일 이름"
      />
      <Textarea
        name="bio"
        defaultValue={bio ?? ''}
        maxLength={80}
        placeholder="한 줄 소개 (예: 새벽 감성, 밴드 사운드 좋아해요)"
        aria-label="한 줄 소개"
        className="min-h-16"
      />
      <FormError message={state.error} />
      <div className="flex items-center justify-end gap-3">
        {state.saved ? <span className="text-text-muted text-sm">저장했어요</span> : null}
        <Button type="submit" variant="secondary" size="sm" disabled={pending}>
          저장
        </Button>
      </div>
    </form>
  )
}
