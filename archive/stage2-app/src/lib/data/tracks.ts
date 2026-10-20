import 'server-only'

import { eq } from 'drizzle-orm'

import { getDb, schema } from '@/db'
import { getMusicProvider, type ListenLinks, type TrackCandidate } from '@/lib/music'

const { tracks } = schema

export type Track = typeof tracks.$inferSelect

/** 곡 후보를 저장(이미 있으면 그대로)하고 행을 돌려준다 */
export async function upsertTrack(candidate: TrackCandidate): Promise<Track> {
  const db = getDb()
  const links = hasExactLinks(candidate.links) ? candidate.links : null
  const [row] = await db
    .insert(tracks)
    .values({
      provider: candidate.provider,
      providerTrackId: candidate.providerTrackId,
      title: candidate.title,
      artist: candidate.artist,
      album: candidate.album ?? null,
      artworkUrl: candidate.artworkUrl ?? null,
      previewUrl: candidate.previewUrl ?? null,
      durationMs: candidate.durationMs ?? null,
      sourceUrl: candidate.sourceUrl ?? null,
      links,
      linksFetchedAt: links ? new Date() : null,
    })
    .onConflictDoUpdate({
      target: [tracks.provider, tracks.providerTrackId],
      // 메타데이터는 최신 값으로 갱신하되, 이미 받아둔 링크는 덮어쓰지 않는다
      set: {
        title: candidate.title,
        artist: candidate.artist,
        artworkUrl: candidate.artworkUrl ?? null,
        previewUrl: candidate.previewUrl ?? null,
      },
    })
    .returning()
  return row
}

/**
 * 아직 앱별 링크를 안 받아온 곡이면 Odesli로 한 번 조회해서 저장.
 * 응답을 늦추지 않도록 `after()` 안에서 부른다.
 */
export async function fillListenLinks(trackId: string): Promise<void> {
  const db = getDb()
  const [track] = await db.select().from(tracks).where(eq(tracks.id, trackId)).limit(1)
  if (!track || track.linksFetchedAt) return
  const links = await getMusicProvider().getExactLinks({
    provider: track.provider,
    providerTrackId: track.providerTrackId,
    title: track.title,
    artist: track.artist,
  })
  // 실패해도 linksFetchedAt을 찍어서 같은 곡을 계속 다시 조회하지 않게 한다
  await db.update(tracks).set({ links, linksFetchedAt: new Date() }).where(eq(tracks.id, trackId))
}

function hasExactLinks(links: ListenLinks | null | undefined): links is ListenLinks {
  return !!links && Object.values(links).some((l) => l?.exact)
}
