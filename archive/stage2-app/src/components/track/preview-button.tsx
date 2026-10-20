'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

import { cn } from '@/lib/cn'

/**
 * 30초 미리듣기. 페이지 전체에서 오디오 하나만 재생되도록 모듈 단위로 공유한다.
 */
let audio: HTMLAudioElement | null = null
let currentSrc: string | null = null
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function getAudio() {
  if (!audio) {
    audio = new Audio()
    audio.addEventListener('ended', () => {
      currentSrc = null
      emit()
    })
    audio.addEventListener('pause', emit)
    audio.addEventListener('play', emit)
  }
  return audio
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function PreviewButton({ src, title }: { src: string; title: string }) {
  const playingSrc = useSyncExternalStore(
    subscribe,
    () => (audio && !audio.paused ? currentSrc : null),
    () => null,
  )
  const [failed, setFailed] = useState(false)
  const playing = playingSrc === src

  useEffect(
    () => () => {
      // 이 버튼이 사라질 때 자기 곡이 재생 중이면 멈춘다
      if (audio && currentSrc === src) audio.pause()
    },
    [src],
  )

  async function toggle() {
    const el = getAudio()
    if (playing) {
      el.pause()
      return
    }
    try {
      if (currentSrc !== src) {
        el.src = src
        currentSrc = src
      }
      await el.play()
      setFailed(false)
    } catch {
      setFailed(true)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? `${title} 미리듣기 멈춤` : `${title} 30초 미리듣기`}
      title={failed ? '재생할 수 없어요' : '30초 미리듣기'}
      className={cn(
        'grid size-10 shrink-0 place-items-center rounded-full border transition-colors',
        playing
          ? 'border-primary bg-primary text-on-primary'
          : 'border-border-strong bg-surface text-text hover:bg-surface-sunken',
        failed && 'opacity-50',
      )}
    >
      {playing ? (
        <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
          <rect x="3.5" y="3" width="3" height="10" rx="1" fill="currentColor" />
          <rect x="9.5" y="3" width="3" height="10" rx="1" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" className="ml-0.5 size-4" aria-hidden="true">
          <path
            d="M4.5 2.8v10.4c0 .6.7 1 1.2.6l8-5.2c.5-.3.5-1 0-1.3l-8-5.2c-.5-.3-1.2 0-1.2.7Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  )
}
