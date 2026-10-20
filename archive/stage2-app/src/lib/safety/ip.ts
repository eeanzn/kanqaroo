import 'server-only'

import { createHmac } from 'node:crypto'
import { headers } from 'next/headers'

import { env } from '@/lib/env'

export function clientIpFrom(h: Headers): string {
  const forwarded = h.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || h.get('x-real-ip') || '0.0.0.0'
}

/** IP 원문은 저장하지 않고, 서버 비밀값으로 HMAC한 값만 쓴다 (rate limit·차단용) */
export function hashIp(ip: string, secret: string): string {
  return createHmac('sha256', secret).update(`ip:${ip}`).digest('base64url').slice(0, 32)
}

export async function currentIpHash(): Promise<string> {
  return hashIp(clientIpFrom(await headers()), env.sessionSecret)
}
