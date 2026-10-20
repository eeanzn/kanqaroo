'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { completeLogin } from '@/lib/auth/complete-login'
import { devUserId } from '@/lib/auth/dev-user-id'
import { safeNext } from '@/lib/auth/safe-next'
import { clearSession } from '@/lib/auth/session'
import { createSupabaseAuthClient } from '@/lib/auth/supabase'
import { env } from '@/lib/env'

export type LoginState = { error?: string; sentTo?: string }

const emailSchema = z.email('이메일 주소를 확인해 주세요').max(254)

export async function requestLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = emailSchema.safeParse(
    String(formData.get('email') ?? '')
      .trim()
      .toLowerCase(),
  )
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }
  const email = parsed.data
  const next = safeNext(String(formData.get('next') ?? ''))
  const from = String(formData.get('from') ?? '') || null

  if (env.authMode === 'dev') {
    // 로컬·테스트 전용: 메일 없이 바로 로그인
    const destination = await completeLogin({ userId: devUserId(email), email, next, from })
    redirect(destination)
  }

  const confirmUrl = new URL('/auth/confirm', env.siteUrl)
  if (next) confirmUrl.searchParams.set('next', next)
  if (from) confirmUrl.searchParams.set('from', from)

  const supabase = await createSupabaseAuthClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: confirmUrl.toString(), shouldCreateUser: true },
  })
  if (error) {
    console.error('[login] signInWithOtp', error.message)
    return { error: '메일을 보내지 못했어요. 잠시 뒤에 다시 해 주세요.' }
  }
  return { sentTo: email }
}

export async function logout() {
  await clearSession()
  redirect('/')
}
