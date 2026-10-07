import { cn } from '@/lib/cn'

const PLACEHOLDER_TONES = [
  ['var(--color-ochre-300)', 'var(--color-ochre-700)'],
  ['var(--color-eucalyptus-100)', 'var(--color-eucalyptus-700)'],
  ['var(--color-sand-200)', 'var(--color-ink-700)'],
  ['var(--color-ochre-400)', 'var(--color-sand-50)'],
] as const

function toneFor(seed: string) {
  let hash = 0
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  return PLACEHOLDER_TONES[Math.abs(hash) % PLACEHOLDER_TONES.length]
}

/** 앨범 아트. 없으면 제목 첫 글자로 만든 플레이스홀더 */
export function Artwork({
  url,
  title,
  size = 'md',
  className,
}: {
  url?: string | null
  title: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizes = {
    sm: 'size-11 rounded-lg text-base',
    md: 'size-14 rounded-xl text-lg',
    lg: 'size-24 rounded-2xl text-3xl',
  }
  if (url) {
    return (
      // 외부 CDN 아트워크는 이미지 최적화(과금 대상)를 거치지 않고 그대로 쓴다
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        loading="lazy"
        className={cn('bg-surface-sunken shrink-0 object-cover', sizes[size], className)}
      />
    )
  }
  const [bg, fg] = toneFor(title)
  return (
    <span
      aria-hidden="true"
      className={cn('grid shrink-0 place-items-center font-extrabold', sizes[size], className)}
      style={{ background: bg, color: fg }}
    >
      {Array.from(title.trim())[0] ?? '♪'}
    </span>
  )
}
