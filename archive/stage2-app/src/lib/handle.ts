import { z } from 'zod'

/** 주소(/@handle)로 쓰면 곤란한 이름들 */
const RESERVED = new Set([
  'admin',
  'api',
  'app',
  'auth',
  'login',
  'logout',
  'signup',
  'onboarding',
  'pouch',
  'me',
  'settings',
  'help',
  'support',
  'about',
  'terms',
  'privacy',
  'r',
  'u',
  'www',
  'static',
  'kanqaroo',
  'kangaroo',
  'official',
  'root',
  'null',
  'undefined',
  'system',
])

export const handleSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_]{3,20}$/, '영문 소문자, 숫자, 밑줄(_)로 3~20자')
  .refine((v) => !RESERVED.has(v), '쓸 수 없는 이름이에요')

export const displayNameSchema = z.string().trim().min(1, '이름을 적어줘요').max(20, '20자까지')

export function normalizeHandle(raw: string): string {
  return raw.trim().replace(/^@/, '').toLowerCase()
}
