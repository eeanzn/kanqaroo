import 'server-only'

/**
 * 서버 환경변수를 한곳에서 읽는다.
 * Vercel Marketplace의 Supabase 연동이 넣어주는 이름(POSTGRES_URL, NEXT_PUBLIC_SUPABASE_*)도 같이 인식한다.
 */
function read(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]
    if (value) return value
  }
  return undefined
}

function required(label: string, ...names: string[]): string {
  const value = read(...names)
  if (!value) throw new Error(`환경변수 ${label}가 없습니다 (${names.join(' / ')})`)
  return value
}

export const env = {
  get databaseUrl() {
    return required('DATABASE_URL', 'DATABASE_URL', 'POSTGRES_URL')
  },
  get sessionSecret() {
    const secret = required('SESSION_SECRET', 'SESSION_SECRET')
    if (secret.length < 32) throw new Error('SESSION_SECRET은 32자 이상이어야 합니다')
    return secret
  },
  get siteUrl() {
    const explicit = read('NEXT_PUBLIC_SITE_URL')
    if (explicit) return explicit.replace(/\/$/, '')
    const vercel = read('VERCEL_PROJECT_PRODUCTION_URL', 'VERCEL_URL')
    return vercel ? `https://${vercel}` : 'http://localhost:3000'
  },
  get authMode(): 'supabase' | 'dev' {
    const mode = read('AUTH_MODE') ?? 'supabase'
    if (mode === 'dev') {
      // dev 로그인은 이메일만으로 로그인되므로 Vercel 위에서는 절대 켜지지 않게 막는다
      if (process.env.VERCEL) throw new Error('AUTH_MODE=dev는 Vercel에서 사용할 수 없습니다')
      return 'dev'
    }
    return 'supabase'
  },
  get supabaseUrl() {
    return required('SUPABASE_URL', 'SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL')
  },
  get supabaseKey() {
    return required(
      'SUPABASE_PUBLISHABLE_KEY',
      'SUPABASE_PUBLISHABLE_KEY',
      'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_ANON_KEY',
    )
  },
  get musicProvider(): 'itunes' | 'mock' {
    return read('MUSIC_PROVIDER') === 'mock' ? 'mock' : 'itunes'
  },
  get odesliApiKey() {
    return read('ODESLI_API_KEY')
  },
}
