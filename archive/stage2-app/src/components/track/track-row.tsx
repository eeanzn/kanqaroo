import type { ReactNode } from 'react'

import type { ListenLinks } from '@/lib/music/types'

import { Artwork } from './artwork'
import { ListenLinksMenu } from './listen-links'
import { PreviewButton } from './preview-button'

export type TrackLike = {
  title: string
  artist: string
  artworkUrl?: string | null
  previewUrl?: string | null
  links?: ListenLinks | null
}

/** 곡 한 줄: 아트워크 · 제목/아티스트 · 미리듣기 · 듣기 링크 */
export function TrackRow({
  track,
  note,
  actions,
  showListen = true,
}: {
  track: TrackLike
  note?: ReactNode
  actions?: ReactNode
  showListen?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <Artwork url={track.artworkUrl} title={track.title} />
      <div className="min-w-0 flex-1">
        <p className="truncate leading-snug font-semibold">{track.title}</p>
        <p className="text-text-muted truncate text-sm">{track.artist}</p>
        {note && <p className="text-text-subtle mt-0.5 truncate text-xs">{note}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {track.previewUrl && <PreviewButton src={track.previewUrl} title={track.title} />}
        {showListen && <ListenLinksMenu track={track} />}
        {actions}
      </div>
    </div>
  )
}
