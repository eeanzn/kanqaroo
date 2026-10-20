import { createHash, randomBytes } from 'node:crypto'

/** 영수증 링크 토큰. DB에는 해시만 저장해서, DB가 새도 링크를 역산할 수 없게 한다 */
export function createReceiptToken(): { token: string; hash: string } {
  const token = randomBytes(18).toString('base64url')
  return { token, hash: hashToken(token) }
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function isWellFormedToken(token: string): boolean {
  return /^[A-Za-z0-9_-]{20,64}$/.test(token)
}
