# Kanqaroo Stage 2 앱 (보관)

> 2026-10-20 재시작 전의 Next.js 앱이에요. 지금 만드는 건 저장소 루트의 `prototype/`. 아래 명령은 모두 이 폴더(`archive/stage2-app/`) 안에서 실행해요. CI는 꺼져 있어요(`ci.yml`).

> 알고리즘 말고, 나를 아는 사람이 골라준 노래.

내 취향 보드(`/@handle`)를 열어두면, 그걸 본 친구가 "너 이거 좋아할 듯" 하고 곡 한 개와 한마디를 내 **주머니**에 넣어줘요. 받은 사람은 듣고 나서 _딱 내 취향 / 새로웠어 / 내 스타일 아냐_ 중 하나로 반응하고, 넣어준 사람은 **영수증** 링크로 그 반응을 확인해요.

- 기획·결정·로드맵(SSoT): [Notion · Kanqaroo](https://app.notion.com/p/damhong/Kanqaroo-3f20e0600bce810296edc52af16b4c3a)
- 현재 단계: **Stage 2 · Walking skeleton** (핵심 루프가 처음부터 끝까지 동작)

| 랜딩                                 | 보드                               | 영수증                               | 주머니                                    |
| ------------------------------------ | ---------------------------------- | ------------------------------------ | ----------------------------------------- |
| ![](docs/screenshots/01-landing.png) | ![](docs/screenshots/06-board.png) | ![](docs/screenshots/08-receipt.png) | ![](docs/screenshots/10-pouch-opened.png) |

## 스택

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · Postgres + Drizzle ORM · Supabase Auth(매직링크) · iTunes Search + Odesli · Vitest · Playwright

## 로컬에서 실행

외부 서비스 없이 돌아가요. 로그인은 이메일만 넣으면 되고(`AUTH_MODE=dev`), 곡 검색은 고정 샘플 데이터(`MUSIC_PROVIDER=mock`)를 써요.

```bash
npm install
cp .env.example .env.local      # 기본값 그대로 로컬 개발 가능
docker compose up -d            # Postgres (localhost:54329)
npm run db:migrate
npm run dev                     # http://localhost:3000
```

실제 iTunes 검색을 쓰려면 `.env.local`에서 `MUSIC_PROVIDER=itunes`로 바꾸면 돼요.

## 테스트

```bash
npm run lint && npm run typecheck
npm test                                                        # 단위 테스트
TEST_DATABASE_URL=postgres://kanqaroo:kanqaroo@127.0.0.1:54329/kanqaroo_test npm test   # + DB 통합 테스트
E2E_DATABASE_URL=postgres://kanqaroo:kanqaroo@127.0.0.1:54329/kanqaroo_e2e npm run test:e2e
```

테스트용 DB는 미리 만들어 두세요: `createdb -h 127.0.0.1 -p 54329 -U kanqaroo kanqaroo_test` (통합 테스트는 실행 전에 `DATABASE_URL=… npm run db:migrate`로 마이그레이션 필요)

E2E(`tests/e2e/core-loop.spec.ts`)가 Stage 2 완료 기준이에요: 가입 → 보드에 곡 3개 → 다른 브라우저에서 익명 소매넣기 → 영수증 → 주머니에서 열어보기·반응·담기 → 영수증에 반응 반영.

## 배포 (Vercel + Supabase)

1. **Supabase 프로젝트 만들기** → Project Settings에서 값 확인
   - `DATABASE_URL`: Database → Connection string → **Transaction pooler** (포트 6543)
   - `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`: API 설정
   - Vercel Marketplace의 Supabase 연동을 쓰면 `POSTGRES_URL`, `NEXT_PUBLIC_SUPABASE_*`가 자동으로 들어가고, 코드가 그 이름도 인식해요
2. **마이그레이션**: 로컬에서 `DATABASE_URL=<직접 연결 5432 URL> npm run db:migrate`
3. **Supabase Auth 설정**
   - Authentication → URL Configuration: Site URL = 배포 주소, Redirect URLs에 `https://<배포 주소>/auth/confirm` 추가
   - Authentication → Email Templates → Magic Link의 링크를 아래로 바꾸면, 메일을 다른 브라우저(네이버 메일 앱 등)에서 열어도 로그인돼요
     ```
     {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
     ```
   - ⚠ Supabase 기본 메일 발송은 제한이 커서 알파 테스트 전에 커스텀 SMTP(Resend 등)나 소셜 로그인이 필요해요 (Notion Backlog Stage 3)
4. **Vercel 환경변수**: `DATABASE_URL`, `SESSION_SECRET`(`openssl rand -base64 32`), `AUTH_MODE=supabase`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `MUSIC_PROVIDER=itunes`, `NEXT_PUBLIC_SITE_URL`
   - `AUTH_MODE=dev`는 Vercel 위에서는 코드에서 막혀요

## 폴더 구조

```
src/app/                 라우트 (/@handle → /u/[handle] rewrite)
src/lib/music/           MusicProvider 어댑터: itunes, odesli, fallback-links, mock
src/lib/data/            데이터 접근 계층 (모든 DB 쿼리)
src/lib/auth/            세션 쿠키, 매직링크, dev 로그인
src/lib/safety/          rate limit, IP 해시, 영수증 토큰
src/db/schema.ts         DB 스키마 원본 → drizzle/ 마이그레이션
src/app/globals.css      디자인 토큰 원본
tests/unit · integration · e2e
```

## 라이선스 메모

Pretendard 폰트(`src/assets/fonts`)는 SIL Open Font License 1.1 — `Pretendard-LICENSE.txt` 참고.
