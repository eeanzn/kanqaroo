import { createHash } from 'node:crypto'

/** dev 로그인용: 같은 이메일이면 항상 같은 uuid가 나오게 만든다 */
export function devUserId(email: string): string {
  const hex = createHash('sha256').update(`kanqaroo-dev:${email.toLowerCase()}`).digest('hex')
  // uuid v4 모양으로 맞춤 (버전 4, variant 10xx)
  const variant = ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-${variant}${hex.slice(17, 20)}-${hex.slice(20, 32)}`
}
