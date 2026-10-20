import 'server-only'

import { sealData, unsealData } from 'iron-session'
import { cookies } from 'next/headers'
import { connection } from 'next/server'

import { env } from '@/lib/env'

/**
 * 앱 세션 = 암호화된 쿠키 하나.
 * Supabase Auth는 "이 이메일의 주인이 맞는지" 확인하는 데만 쓰고, 로그인 상태는 여기서 관리한다.
 * 그래서 로컬 dev 로그인과 배포용 매직링크 로그인이 같은 세션 코드를 공유한다.
 */
export type SessionData = { userId: string; email: string }

const COOKIE_NAME = 'kq_session'
const TTL_SECONDS = 60 * 60 * 24 * 30

export async function readSession(): Promise<SessionData | null> {
  const raw = (await cookies()).get(COOKIE_NAME)?.value
  if (!raw) return null
  // 세션 만료 검사가 현재 시각을 쓰므로, 세션 읽기는 항상 실제 요청 시점에만 하게 한다
  // (없으면 Next가 로그인 화면을 미리 렌더링(prefetch)하다가 Date.now() 경고를 낸다)
  await connection()
  try {
    const data = await unsealData<Partial<SessionData>>(raw, {
      password: env.sessionSecret,
      ttl: TTL_SECONDS,
    })
    return data.userId && data.email ? { userId: data.userId, email: data.email } : null
  } catch {
    return null
  }
}

/** Server Action이나 Route Handler에서만 호출 가능 (쿠키 쓰기) */
export async function writeSession(data: SessionData) {
  const sealed = await sealData(data, { password: env.sessionSecret, ttl: TTL_SECONDS })
  ;(await cookies()).set(COOKIE_NAME, sealed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TTL_SECONDS,
  })
}

export async function clearSession() {
  ;(await cookies()).delete(COOKIE_NAME)
}
