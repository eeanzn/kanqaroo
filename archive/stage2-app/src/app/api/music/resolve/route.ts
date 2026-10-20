import type { NextRequest } from 'next/server'

import { getMusicProvider } from '@/lib/music'

/** GET /api/music/resolve?url=붙여넣은링크 → ResolveResult */
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('url')?.trim() ?? ''
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return Response.json({ ok: false, reason: 'unsupported' }, { status: 400 })
  }
  if (url.protocol !== 'https:' || raw.length > 1000) {
    return Response.json({ ok: false, reason: 'unsupported' }, { status: 400 })
  }
  return Response.json(await getMusicProvider().resolveUrl(url.toString()))
}
