import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { env } from '@/lib/env'

/**
 * 매직링크 발송·검증에만 쓰는 Supabase 클라이언트.
 * PKCE code verifier를 쿠키에 저장해야 해서 @supabase/ssr를 쓴다.
 * Server Action / Route Handler 안에서만 호출할 것.
 */
export async function createSupabaseAuthClient() {
  const cookieStore = await cookies()
  return createServerClient(env.supabaseUrl, env.supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options)
        }
      },
    },
  })
}
