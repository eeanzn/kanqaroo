/** 로그인 후 돌아갈 경로. 오픈 리다이렉트 방지를 위해 우리 사이트 안의 경로만 허용 */
export function safeNext(next: string | null | undefined): string | null {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return null
  return next
}
