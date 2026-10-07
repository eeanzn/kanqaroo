import { cn } from '@/lib/cn'

/** 캥거루 주머니 + 음표. 임시 로고 — Figma 단계에서 다듬을 예정 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('size-7', className)}>
      <path
        d="M6 11c0-2.2 1.8-4 4-4h12c2.2 0 4 1.8 4 4v5c0 6.1-4.9 11-11 11h-.1C9.4 27 6 23.6 6 19.1V11Z"
        fill="var(--color-ochre-500)"
      />
      <path
        d="M9 13.5c2.2 1.4 4.5 2 7 2s4.8-.6 7-2"
        stroke="var(--color-sand-50)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="14" cy="21.5" r="2.2" fill="var(--color-sand-50)" />
      <path
        d="M16.2 21.5V15.8l3.6-1"
        stroke="var(--color-sand-50)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-lg font-extrabold tracking-tight',
        className,
      )}
    >
      <LogoMark />
      kanqaroo
    </span>
  )
}
