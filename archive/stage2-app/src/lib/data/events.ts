import 'server-only'

import { getDb, schema } from '@/db'
import type { EventName } from '@/db/schema'

/**
 * 계측 이벤트 기록. 실패해도 사용자 흐름을 막지 않는다.
 * 보통 `after(() => trackEvent(...))`로 응답 뒤에 남긴다.
 */
export async function trackEvent(
  name: EventName,
  userId: string | null,
  props: Record<string, unknown> = {},
): Promise<void> {
  try {
    await getDb().insert(schema.events).values({ name, userId, props })
  } catch (error) {
    console.error('[events] 기록 실패', name, error)
  }
}
