'use client'

import { useState } from 'react'

import { buttonClass } from '@/components/ui/button'

export function CopyButton({
  text,
  label = '링크 복사',
  variant = 'secondary',
}: {
  text: string
  label?: string
  variant?: 'primary' | 'secondary'
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // 클립보드 권한이 없으면 선택 가능한 프롬프트로 대신한다
      window.prompt('복사해서 쓰세요', text)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button type="button" onClick={copy} className={buttonClass(variant, 'md')}>
      {copied ? '복사했어요' : label}
    </button>
  )
}
