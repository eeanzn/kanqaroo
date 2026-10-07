import 'server-only'

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { env } from '@/lib/env'

import * as schema from './schema'

type Db = ReturnType<typeof drizzle<typeof schema>>

// 개발 서버의 HMR로 모듈이 다시 로드돼도 커넥션 풀을 하나만 쓰도록 globalThis에 보관
const globalForDb = globalThis as unknown as { kanqarooDb?: Db }

function createDb(): Db {
  const client = postgres(env.databaseUrl, {
    // Supabase transaction pooler(6543)는 prepared statement를 지원하지 않음
    prepare: false,
    max: process.env.VERCEL ? 3 : 10,
  })
  return drizzle(client, { schema })
}

export function getDb(): Db {
  globalForDb.kanqarooDb ??= createDb()
  return globalForDb.kanqarooDb
}

export { schema }
