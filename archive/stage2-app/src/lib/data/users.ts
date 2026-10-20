import 'server-only'

import { eq, sql } from 'drizzle-orm'

import { getDb, schema } from '@/db'

const { users, profiles } = schema

/** 로그인 성공 시 호출. 처음 보는 사용자면 created=true */
export async function upsertUser(input: {
  id: string
  email: string
}): Promise<{ created: boolean }> {
  const db = getDb()
  const inserted = await db
    .insert(users)
    .values({ id: input.id, email: input.email.toLowerCase() })
    .onConflictDoNothing({ target: users.id })
    .returning({ id: users.id })
  return { created: inserted.length > 0 }
}

export type Profile = typeof profiles.$inferSelect

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const [row] = await getDb().select().from(profiles).where(eq(profiles.userId, userId)).limit(1)
  return row ?? null
}

export async function getProfileByHandle(handle: string): Promise<Profile | null> {
  const [row] = await getDb()
    .select()
    .from(profiles)
    .where(sql`lower(${profiles.handle}) = ${handle.toLowerCase()}`)
    .limit(1)
  return row ?? null
}

export async function isHandleTaken(handle: string): Promise<boolean> {
  return (await getProfileByHandle(handle)) !== null
}

export async function createProfile(input: {
  userId: string
  handle: string
  displayName: string
}): Promise<'ok' | 'handle_taken'> {
  try {
    await getDb().insert(profiles).values(input)
    return 'ok'
  } catch (error) {
    // handle 유니크 인덱스 충돌 (동시에 같은 이름을 잡은 경우)
    if (isUniqueViolation(error)) return 'handle_taken'
    throw error
  }
}

export async function updateProfile(
  userId: string,
  patch: Partial<Pick<Profile, 'displayName' | 'bio' | 'acceptingSlips'>>,
) {
  await getDb()
    .update(profiles)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(profiles.userId, userId))
}

export function isUniqueViolation(error: unknown): boolean {
  const code =
    (error as { code?: string })?.code ?? (error as { cause?: { code?: string } })?.cause?.code
  return code === '23505'
}
