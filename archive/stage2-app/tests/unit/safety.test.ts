import { describe, expect, it } from 'vitest'

import { clientIpFrom, hashIp } from '@/lib/safety/ip'
import { SLIP_LIMITS, slipRateLimitExceeded } from '@/lib/safety/rate-limit'
import { createReceiptToken, hashToken, isWellFormedToken } from '@/lib/safety/tokens'

describe('rate limit', () => {
  it('같은 보드 한도에 닿으면 막는다', () => {
    expect(
      slipRateLimitExceeded({ toBoardLastHour: SLIP_LIMITS.perBoardPerHour - 1, totalLastHour: 0 }),
    ).toBe(false)
    expect(
      slipRateLimitExceeded({ toBoardLastHour: SLIP_LIMITS.perBoardPerHour, totalLastHour: 0 }),
    ).toBe(true)
  })

  it('전체 한도에 닿으면 막는다', () => {
    expect(
      slipRateLimitExceeded({ toBoardLastHour: 0, totalLastHour: SLIP_LIMITS.perIpPerHour }),
    ).toBe(true)
  })
})

describe('영수증 토큰', () => {
  it('매번 다른 토큰을 만들고, 해시는 결정적이다', () => {
    const a = createReceiptToken()
    const b = createReceiptToken()
    expect(a.token).not.toBe(b.token)
    expect(a.hash).toBe(hashToken(a.token))
    expect(isWellFormedToken(a.token)).toBe(true)
  })

  it('이상한 토큰 모양은 거절한다', () => {
    expect(isWellFormedToken('short')).toBe(false)
    expect(isWellFormedToken('../../etc/passwd-aaaaaaaaaaaaaaaa')).toBe(false)
  })
})

describe('IP 처리', () => {
  it('x-forwarded-for의 첫 번째 IP를 쓴다', () => {
    expect(clientIpFrom(new Headers({ 'x-forwarded-for': '1.2.3.4, 10.0.0.1' }))).toBe('1.2.3.4')
    expect(clientIpFrom(new Headers({ 'x-real-ip': '5.6.7.8' }))).toBe('5.6.7.8')
    expect(clientIpFrom(new Headers())).toBe('0.0.0.0')
  })

  it('IP 원문 대신 비밀값으로 해시한 값을 쓴다', () => {
    const h = hashIp('1.2.3.4', 'secret-a')
    expect(h).toBe(hashIp('1.2.3.4', 'secret-a'))
    expect(h).not.toBe(hashIp('1.2.3.4', 'secret-b'))
    expect(h).not.toContain('1.2.3.4')
  })
})
