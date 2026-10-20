/**
 * 소매넣기 횟수 제한. 숫자는 Stage 2 기본값이고, 알파에서 실제 사용량 보고 조정.
 * (Notion PRD 5번 수용 기준과 같은 값)
 */
export const SLIP_LIMITS = {
  /** 같은 IP → 같은 보드, 1시간 */
  perBoardPerHour: 3,
  /** 같은 IP → 전체, 1시간 */
  perIpPerHour: 20,
} as const

export type SlipCounts = { toBoardLastHour: number; totalLastHour: number }

export function slipRateLimitExceeded(counts: SlipCounts): boolean {
  return (
    counts.toBoardLastHour >= SLIP_LIMITS.perBoardPerHour ||
    counts.totalLastHour >= SLIP_LIMITS.perIpPerHour
  )
}
