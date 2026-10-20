import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/cn'

const control =
  'w-full rounded-[var(--radius-control)] border border-border-strong bg-surface px-4 text-[15px] text-text placeholder:text-text-subtle focus:border-primary focus:outline-none aria-[invalid=true]:border-danger'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(control, 'h-12', className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(control, 'min-h-24 resize-none py-3 leading-relaxed', className)}
      {...props}
    />
  )
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string
  htmlFor: string
  hint?: ReactNode
  error?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-text text-sm font-semibold">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-danger text-sm" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-text-muted text-sm">{hint}</p>
      ) : null}
    </div>
  )
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p
      className="bg-danger/10 text-danger rounded-[var(--radius-control)] px-4 py-3 text-sm"
      role="alert"
    >
      {message}
    </p>
  )
}
