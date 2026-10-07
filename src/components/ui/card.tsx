import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

export function Card({ className, ...props }: ComponentProps<'section'>) {
  return (
    <section
      className={cn(
        'bg-surface rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)]',
        className,
      )}
      {...props}
    />
  )
}

export function Badge({
  tone = 'neutral',
  className,
  ...props
}: ComponentProps<'span'> & { tone?: 'neutral' | 'primary' | 'accent' }) {
  const tones = {
    neutral: 'bg-surface-sunken text-text-muted',
    primary: 'bg-primary text-on-primary',
    accent: 'bg-accent-soft text-eucalyptus-700',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
