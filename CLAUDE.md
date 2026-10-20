# Kanqaroo — 작업 규칙

@AGENTS.md

플레이리스트를 자랑하고, 남의 플레이리스트에 몰래 곡을 넣거나 순서를 바꾸는 웹 서비스. 2026-10-20에 0ddb584(아코디언 실험)에서 다시 시작했다. 그 전의 디자인 시스템·결정은 쓰지 않는다. 지금은 **UI 단계**: 프런트만, 예시 데이터로 (`prototype/accordion.html`). 핵심은 아코디언 파일 인터랙션. 백엔드는 MVP 뒤. `src/`의 Stage 2 앱은 개편 전(v1) 상태로 보류 중.

## SSoT: 무엇을 어디서 확인하나

사실 하나에 집은 하나. 같은 내용을 두 곳에 쓰지 않는다.

| 무엇                                         | 원본(SSoT)                                                                                    |
| -------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 비전·원칙·PRD·플로우·로드맵·결정 기록·리서치 | Notion [Kanqaroo](https://app.notion.com/p/damhong/Kanqaroo-3f20e0600bce810296edc52af16b4c3a) |
| 용어 (UI 용어 ↔ 코드 이름)                   | Notion Glossary (아래 표는 복사본이 아니라 코드 쪽 요약)                                      |
| DB 스키마                                    | `src/db/schema.ts` → `drizzle/` 마이그레이션                                                  |
| 무엇을 만들지 (제품 브리프)                  | `PRODUCT.md` (impeccable 스킬도 읽음)                                                         |
| 디자인 시스템 (토큰·컴포넌트·화면 구성)      | `DESIGN.md` (Figma 컴포넌트 이름과 같음)                                                      |
| 화면·인터랙션·UI 문구 (지금)                 | `prototype/accordion.html` (Artifact의 원본, `#components`가 컴포넌트 시트)                   |
| 디자인 토큰 (Stage 2 앱, v1 스냅샷)          | `src/app/globals.css` (`@theme`)                                                              |
| UI 문구 (Stage 2 앱)                         | 각 화면 컴포넌트                                                                              |

결정을 바꾸거나 새로 내리면 Notion **Decision Log**에 한 줄 남긴다.

디자인 점검·다듬기는 `.claude/skills/impeccable` 스킬을 쓴다 (`/impeccable critique`·`audit`·`polish`). 자동 훅은 설치하지 않았다.

## 용어 (코드 이름)

지금(v5): `playlist` 플레이리스트 · `song` 곡 · 곡 넣기(제목·아티스트·넣은 사람 이름, 맨 아래에 바로 들어감. 스크린샷 OCR로 한 번에) · 순서 바꾸기(누구나, 되돌리기 없음) · 좋아요 · 공유 · 듣기(YouTube/Spotify/Apple Music 검색 링크) · 관리 페이지(주인, 헤더 프로필 버튼). 로그인 없음: 주인은 기기·관리 링크로 알아본다. 소매넣기는 서비스 개념일 뿐, 기능 이름이 아님

Stage 2 앱(v1, 폐기 예정): `board` 취향 보드 · `crate` 군집 · `slip` 소매넣기 · `pouch` 주머니 · `reaction` 반응 · `receipt` 영수증 · `keep` 담기 · `track` 곡

## 구조 원칙

- **외부 음악 API는 `src/lib/music/` 어댑터 뒤에만.** 화면 코드는 `TrackCandidate`/`MusicProvider` 타입만 안다
- **DB는 `src/lib/data/`(데이터 접근 계층)에서만 만진다.** 모든 쓰기 함수는 소유자 조건(`ownerId`)을 쿼리에 같이 건다
- **Server Action은 스스로 세션을 다시 확인한다.** 화면에서 숨기는 것만으로는 보호가 아님
- 로그인 상태 = `src/lib/auth/session.ts`의 암호화 쿠키. Supabase Auth는 이메일 신원 확인에만 씀
- Cache Components가 켜져 있다: 쿠키·params·DB를 읽는 컴포넌트는 `<Suspense>` 안에 둔다
- 오디오는 호스팅하지 않는다 (30초 미리듣기 + 각 앱 링크만)

## 명령어

```bash
python3 prototype/build.py prototype/accordion.html src/assets/fonts prototype/dist/kanqaroo-accordion.html  # 프로토타입 빌드 (같은 Artifact URL에 다시 publish)
python3 prototype/build_tess.py   # OCR 글자 데이터 → prototype/dist/tess/ (Artifact files로 같이 올림)
python3 prototype/build_pages.py  # GitHub Pages 데모 → prototype/dist/pages/ (푸시하면 pages.yml이 자동 배포)
npm run dev            # 개발 서버
npm run lint && npm run typecheck
npm test               # 단위 테스트 (+ TEST_DATABASE_URL 있으면 DB 통합 테스트)
npm run test:e2e       # 핵심 루프 E2E (로컬 Postgres + AUTH_MODE=dev + MUSIC_PROVIDER=mock)
npm run db:generate    # 스키마 변경 → 마이그레이션 생성
npm run db:migrate
```
