import { expect, test, type Page } from '@playwright/test'

/**
 * Stage 2 완료 기준 = 이 테스트가 도는 것:
 * 보드 공개 → 익명 소매넣기 → 영수증 → 주머니에서 열어보기·반응 → 영수증에 반응 반영
 */
const runId = Date.now().toString(36).slice(-6)
const handle = `jiwoo_${runId}`

async function addTrackBySearch(page: Page, query: string, title: string) {
  await page.getByRole('searchbox', { name: '곡 검색' }).fill(query)
  await page
    .getByRole('button', { name: new RegExp(title) })
    .first()
    .click()
  await page.getByRole('button', { name: '이 군집에 담기' }).click()
  await expect(page.getByRole('button', { name: `${title} 빼기` })).toBeVisible()
}

test('핵심 루프: 보드 → 익명 소매 → 반응 → 영수증', async ({ browser }) => {
  // ── 받는 사람: 가입 + 보드 만들기 ──
  const receiverContext = await browser.newContext()
  const receiver = await receiverContext.newPage()
  await receiver.goto('/login')
  await receiver.getByLabel('이메일').fill(`${handle}@example.com`)
  await receiver.getByRole('button', { name: '바로 로그인' }).click()

  await expect(receiver).toHaveURL(/\/onboarding/)
  await receiver.getByLabel('보드에 보일 이름').fill('지우')
  await receiver.getByLabel('보드 주소').fill(handle)
  await receiver.getByRole('button', { name: '다음: 곡 담기' }).click()

  await expect(receiver).toHaveURL(/\/me\?welcome=1/)
  await expect(receiver.getByText('보드 공개까지 3곡 남았어요')).toBeVisible()
  await addTrackBySearch(receiver, 'newjeans', 'Hype Boy')
  await addTrackBySearch(receiver, '윤하', '사건의 지평선')

  // 검색에 없는 곡은 직접 입력
  await receiver.getByRole('tab', { name: '직접 입력' }).click()
  await receiver.getByLabel('곡 제목').fill('새벽 세 시')
  await receiver.getByLabel('아티스트').fill('동네 밴드')
  await receiver.getByRole('button', { name: '이 곡으로 할게요' }).click()
  await receiver.getByRole('button', { name: '이 군집에 담기' }).click()
  await expect(receiver.getByText('보드가 열렸어요')).toBeVisible()

  // ── 주는 사람: 계정 없이 닉네임만으로 소매넣기 ──
  const giverContext = await browser.newContext()
  const giver = await giverContext.newPage()
  await giver.goto(`/@${handle}`)
  await expect(giver.getByRole('heading', { name: '지우의 취향 보드' })).toBeVisible()
  await expect(giver.getByText('새벽 세 시')).toBeVisible()
  await giver.getByRole('link', { name: '지우 소매에 노래 넣기' }).click()

  await expect(giver).toHaveURL(new RegExp(`/@${handle}/slip`))
  await giver.getByRole('searchbox', { name: '곡 검색' }).fill('검정치마')
  await giver.getByRole('button', { name: /Everything/ }).click()
  await giver.getByLabel('왜 이 곡이에요?').fill('네 보드 새벽 노래들이랑 결이 비슷해')
  await giver.getByLabel('닉네임').fill('민지')
  await giver.getByRole('button', { name: '소매에 쏙 넣기' }).click()

  await expect(giver).toHaveURL(/\/r\/[A-Za-z0-9_-]+\?new=1/)
  await expect(giver.getByRole('heading', { name: '쏙! 지우님 소매에 넣었어요' })).toBeVisible()
  await expect(giver.getByText('아직 열어보지 않았어요')).toBeVisible()
  const receiptUrl = giver.url().replace('?new=1', '')

  // ── 받는 사람: 주머니에서 열어보고 반응 ──
  await receiver.goto('/pouch')
  await expect(receiver.getByText('민지님이 소매에 노래를 넣었어요')).toBeVisible()
  await receiver.getByRole('button', { name: '열어보기' }).click()
  await expect(receiver.getByText('네 보드 새벽 노래들이랑 결이 비슷해')).toBeVisible()
  await receiver.getByRole('button', { name: '새로웠어' }).click()
  await expect(receiver.getByRole('button', { name: '새로웠어' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )

  // 받은 곡을 내 보드에 담기
  await receiver.getByRole('button', { name: '내 보드에 담기' }).click()
  await expect(receiver.getByText('내 보드에 담았어요')).toBeVisible()

  // ── 주는 사람: 영수증에서 반응 확인 ──
  await giver.goto(receiptUrl)
  await expect(giver.getByText('지우님 반응')).toBeVisible()
  await expect(giver.getByText('새로웠어')).toBeVisible()

  // 담은 곡은 공개 보드에 출처와 함께 보인다
  await giver.goto(`/@${handle}`)
  await expect(giver.getByText('민지가 넣어준 곡')).toBeVisible()

  await receiverContext.close()
  await giverContext.close()
})

test('공유 이미지: OG와 스토리 PNG가 만들어진다', async ({ request }) => {
  const og = await request.get(`/u/${handle}/opengraph-image`)
  expect(og.status()).toBe(200)
  expect(og.headers()['content-type']).toContain('image/png')

  const story = await request.get(`/u/${handle}/story`)
  expect(story.status()).toBe(200)
  expect(story.headers()['content-disposition']).toContain('attachment')
})

test('없는 보드는 not-found 화면 + noindex', async ({ page }) => {
  // 보드 내용은 Suspense 안에서 스트리밍되므로 HTTP 상태는 200으로 이미 나간 뒤다.
  // 대신 not-found UI와 robots noindex 메타가 들어가는지 확인한다.
  await page.goto('/@no_such_board_zz')
  await expect(page.getByText('여기엔 아무것도 없어요')).toBeVisible()
  await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached()
})
