'use client'

import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/field'
import { cn } from '@/lib/cn'
import type { ResolveResult, TrackCandidate } from '@/lib/music/types'

import { Artwork } from './artwork'
import { PreviewButton } from './preview-button'

type Mode = 'search' | 'link' | 'manual'

const MODES: Array<{ id: Mode; label: string }> = [
  { id: 'search', label: '검색' },
  { id: 'link', label: '링크 붙여넣기' },
  { id: 'manual', label: '직접 입력' },
]

const RESOLVE_ERRORS: Record<Exclude<ResolveResult, { ok: true }>['reason'], string> = {
  unsupported: '이 링크는 아직 못 읽어요. 멜론·지니 링크라면 제목으로 검색해 주세요.',
  not_found: '이 링크에서 곡을 찾지 못했어요.',
  unavailable: '지금은 링크를 읽을 수 없어요. 잠시 뒤에 다시 해 주세요.',
}

/**
 * 곡 고르기: 검색 / 링크 붙여넣기 / 직접 입력.
 * 고른 곡은 hidden input(`name`)에 JSON으로 담겨서 감싼 <form>과 함께 제출된다.
 */
export function TrackPicker({
  name = 'track',
  autoFocus = false,
}: {
  name?: string
  autoFocus?: boolean
}) {
  const [mode, setMode] = useState<Mode>('search')
  const [selected, setSelected] = useState<TrackCandidate | null>(null)

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={selected ? JSON.stringify(selected) : ''} />

      {selected ? (
        <div className="border-primary bg-primary-soft flex items-center gap-3 rounded-2xl border-2 p-3">
          <Artwork url={selected.artworkUrl} title={selected.title} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{selected.title}</p>
            <p className="text-text-muted truncate text-sm">{selected.artist}</p>
          </div>
          {selected.previewUrl && (
            <PreviewButton src={selected.previewUrl} title={selected.title} />
          )}
          <Button type="button" variant="ghost" size="sm" onClick={() => setSelected(null)}>
            다시 고르기
          </Button>
        </div>
      ) : (
        <>
          <div
            role="tablist"
            aria-label="곡 찾는 방법"
            className="bg-surface-sunken flex gap-1 rounded-full p-1"
          >
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={mode === m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  'h-9 flex-1 rounded-full text-sm font-semibold transition-colors',
                  mode === m.id ? 'bg-surface text-text shadow-sm' : 'text-text-muted',
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          {mode === 'search' && <SearchPane onSelect={setSelected} autoFocus={autoFocus} />}
          {mode === 'link' && <LinkPane onSelect={setSelected} />}
          {mode === 'manual' && <ManualPane onSelect={setSelected} />}
        </>
      )}
    </div>
  )
}

function SearchPane({
  onSelect,
  autoFocus,
}: {
  onSelect: (t: TrackCandidate) => void
  autoFocus: boolean
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TrackCandidate[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const latest = useRef(0)

  useEffect(() => {
    const term = query.trim()
    if (!term) return
    const id = ++latest.current
    const timer = setTimeout(async () => {
      setStatus('loading')
      try {
        const res = await fetch(`/api/music/search?q=${encodeURIComponent(term)}`)
        const data = (await res.json()) as { tracks: TrackCandidate[] }
        if (id !== latest.current) return
        setResults(data.tracks)
        setStatus(res.ok ? 'done' : 'error')
      } catch {
        if (id === latest.current) setStatus('error')
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [query])

  const term = query.trim()

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="곡 제목이나 아티스트"
        aria-label="곡 검색"
        autoFocus={autoFocus}
        enterKeyHint="search"
        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
      />
      {term && status === 'loading' && <p className="text-text-muted px-1 text-sm">찾는 중…</p>}
      {term && status === 'error' && (
        <p className="text-danger px-1 text-sm">
          검색이 잠깐 안 돼요. 링크 붙여넣기나 직접 입력을 써 주세요.
        </p>
      )}
      {term && status === 'done' && results.length === 0 && (
        <p className="text-text-muted px-1 text-sm">
          결과가 없어요. 직접 입력으로 넣을 수도 있어요.
        </p>
      )}
      {term && results.length > 0 && (
        <ul className="border-border bg-surface flex max-h-80 flex-col overflow-y-auto rounded-2xl border">
          {results.map((track) => (
            <li
              key={`${track.provider}:${track.providerTrackId}`}
              className="border-border border-b last:border-b-0"
            >
              <button
                type="button"
                onClick={() => onSelect(track)}
                className="hover:bg-surface-sunken flex w-full items-center gap-3 px-3 py-2.5 text-left"
              >
                <Artwork url={track.artworkUrl} title={track.title} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{track.title}</span>
                  <span className="text-text-muted block truncate text-sm">
                    {track.artist}
                    {track.album ? ` · ${track.album}` : ''}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function LinkPane({ onSelect }: { onSelect: (t: TrackCandidate) => void }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function resolve() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/music/resolve?url=${encodeURIComponent(url.trim())}`)
      const data = (await res.json()) as ResolveResult
      if (data.ok) onSelect(data.track)
      else setError(RESOLVE_ERRORS[data.reason])
    } catch {
      setError(RESOLVE_ERRORS.unavailable)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          type="url"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Spotify · Apple Music · YouTube 곡 링크"
          aria-label="곡 링크"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (url.trim()) resolve()
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={resolve}
          disabled={!url.trim() || loading}
        >
          {loading ? '읽는 중' : '불러오기'}
        </Button>
      </div>
      {error && <p className="text-danger px-1 text-sm">{error}</p>}
    </div>
  )
}

function ManualPane({ onSelect }: { onSelect: (t: TrackCandidate) => void }) {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const ready = title.trim() && artist.trim()

  return (
    <div className="flex flex-col gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="곡 제목"
        aria-label="곡 제목"
        maxLength={200}
      />
      <Input
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        placeholder="아티스트"
        aria-label="아티스트"
        maxLength={200}
      />
      <Button
        type="button"
        variant="secondary"
        disabled={!ready}
        onClick={() =>
          onSelect({
            provider: 'manual',
            providerTrackId: 'manual',
            title: title.trim(),
            artist: artist.trim(),
          })
        }
      >
        이 곡으로 할게요
      </Button>
      <p className="text-text-muted px-1 text-xs">
        미리듣기는 없지만, 듣기 버튼은 각 앱 검색으로 연결돼요.
      </p>
    </div>
  )
}
