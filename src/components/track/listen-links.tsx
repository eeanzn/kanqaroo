import { withFallbackLinks } from '@/lib/music/fallback-links'
import { PLATFORMS, PLATFORM_LABELS, type ListenLinks } from '@/lib/music/types'

/**
 * "내 앱에서 듣기". JS 없이 동작하도록 <details>로 만든다.
 * 정확한 링크가 없는 앱은 검색 결과로 연결되고, 그 사실을 작게 표시한다.
 */
export function ListenLinksMenu({
  track,
}: {
  track: { title: string; artist: string; links?: ListenLinks | null }
}) {
  const links = withFallbackLinks(track, track.links)
  return (
    <details className="group relative">
      <summary className="text-text-muted hover:bg-surface-sunken hover:text-text flex h-10 cursor-pointer list-none items-center rounded-full px-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        듣기
        <svg
          viewBox="0 0 12 12"
          className="ml-1 size-3 transition-transform group-open:rotate-180"
          aria-hidden="true"
        >
          <path
            d="M2.5 4.5 6 8l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </summary>
      <ul className="border-border bg-surface absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-2xl border py-1 shadow-[var(--shadow-pop)]">
        {PLATFORMS.map((platform) => (
          <li key={platform}>
            <a
              href={links[platform].url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-surface-sunken flex items-center justify-between px-4 py-2.5 text-sm"
            >
              <span className="font-medium">{PLATFORM_LABELS[platform]}</span>
              {!links[platform].exact && <span className="text-text-subtle text-xs">검색</span>}
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}
