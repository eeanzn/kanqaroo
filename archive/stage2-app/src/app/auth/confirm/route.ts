import type { EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

import { completeLogin } from '@/lib/auth/complete-login'
import { createSupabaseAuthClient } from '@/lib/auth/supabase'

/**
 * 매직링크 도착 지점.
 * - token_hash + type: 메일 템플릿을 README 안내대로 바꾼 경우 (다른 브라우저에서 열어도 됨, 권장)
 * - code: 기본 템플릿(PKCE). 링크를 요청한 브라우저에서 열어야 성공
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const tokenHash = params.get('token_hash')
  const type = params.get('type') as EmailOtpType | null
  const code = params.get('code')

  const supabase = await createSupabaseAuthClient()
  let user: { id: string; email?: string } | null = null

  if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (!error) user = data.user
  } else if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) user = data.user
  }

  if (!user?.email) {
    return NextResponse.redirect(new URL('/login?error=link', request.url))
  }

  // Supabase 세션은 신원 확인에만 쓰고 버린다. 로그인 상태는 앱 세션 쿠키가 관리
  await supabase.auth.signOut({ scope: 'local' }).catch(() => undefined)

  const destination = await completeLogin({
    userId: user.id,
    email: user.email,
    next: params.get('next'),
    from: params.get('from'),
  })
  return NextResponse.redirect(new URL(destination, request.url))
}
