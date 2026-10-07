import { cacheLife } from 'next/cache'
import type { NextRequest } from 'next/server'

import { getMusicProvider, type TrackCandidate } from '@/lib/music'

/** GET /api/music/search?q=검색어 → { tracks: TrackCandidate[] } */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 1 || q.length > 100) return Response.json({ tracks: [] })
  try {
    return Response.json({ tracks: await searchTracks(q.toLowerCase()) })
  } catch (error) {
    console.error('[music/search]', error)
    return Response.json({ tracks: [], error: 'unavailable' }, { status: 502 })
  }
}

// 같은 검색어는 하루 동안 재사용해서 iTunes 호출 횟수(IP당 분당 ~20회)를 아낀다
async function searchTracks(term: string): Promise<TrackCandidate[]> {
  'use cache'
  cacheLife('days')
  return getMusicProvider().search(term)
}
