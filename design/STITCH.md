# Stitch 브리프

Stitch에는 **무엇을 만들지**만 줘요. 어떻게 생겨야 하는지(색, 글꼴, 재질, 레이아웃)는 Stitch가 정해요.

1. 새 프로젝트 첫 메시지에 루트의 `PRODUCT.md` 전체를 붙이고, 이어서 아래 **비율** 블록을 붙여요. 예전 DESIGN.md나 우리 프로토타입 화면은 넣지 않아요.
2. 프롬프트 P1~P6을 순서대로 써요. P1에서 방향 셋 중 하나를 고르면, P2부터는 그 방향으로만 가요.
3. 마지막 P7로 디자인 시스템을 받아서 루트에 `DESIGN.md`로 저장해요. Stitch 내보내기를 쓰거나, Claude에게 정리를 맡겨요.

## 비율 (토스 디자인 시스템에서 숫자만)

```text
Proportions to follow. They come from the Toss Design System; use only these numbers, not its colors or visual style.
- Phone base width 375. Screen side margins 20 to 24.
- Type scale (size / line height, px): 30/40, 26/35, 22/31, 20/29, 17/25.5, 15/22.5, 13/19.5. Body text 15 to 17.
- Button heights: 56 (main bottom action), 48, 38, 32.
- List rows: 24 side padding; thumbnails 40 or 54; icons 20 or 24.
- Bottom action area: 20 side padding, 18 below plus the safe area.
- Common spacing steps: 8, 12, 16, 20, 24, 28.
- iPad and desktop: keep the same type and control sizes; use the extra width for more content, not for bigger elements.
```

## 프롬프트

### P1 · 방향 셋

```text
Propose three genuinely different visual directions for kanqaroo, grounded in the product brief. Show each on the 둘러보기 screen (phone) with the same sample content. Give each a short name and one sentence on its idea. They should differ in concept, not only in color.
```

### P2 · 둘러보기와 넘기기

```text
Design 둘러보기, the first screen, in the chosen direction. Visitors flick through many playlists quickly, read each one at a glance, and decide which to open. Include switching to 내 파일철, where you are in the stack, sound on or off, and a quiet hint about how to flip and open (no onboarding). Then show flipping as 3 still frames: one playlist, a fast flick through several, and jumping to one further back.
```

### P3 · 꺼내 읽고 쪽지 넣기

```text
Design the visitor's core loop as a sequence of phone screens: open "새벽 운전" and read it (owner's songs and friends' songs clearly different, who added each, play a song, put it back); choose the spot for a new song; write the slip with the kangaroo pad (empty, drawn, preset chosen, missing-title error); the 쏙 넣기 moment in 3 frames; and the playlist right after, now holding the new slip, with a short confirmation.
```

### P4 · 주인 화면

```text
Design the owner's side: 내 파일철 (new slips, 공개 vs 링크 있는 사람만, start a new playlist); managing "요즘 듣는 거" in three views, 목록 (빼기 with 되돌리기), 활동 and 공유; and creating "퇴근길" with typed songs or a screenshot import (progress, "확인해 주세요" rows), ending with the new playlist joining the file.
```

### P5 · 나머지 상태

```text
Design the remaining states: the embedded YouTube player inside a playlist (video always visible, at least 200px tall; what's playing, previous, pause, next, close, open in YouTube), an empty playlist that invites the first slip, and a playlist that can't be found.
```

### P6 · 아이패드와 데스크톱

```text
Show the same product as an iPad app (landscape) and a desktop window: 둘러보기 with a playlist open, and the owner's 내 파일철. It should feel like a native tablet or desktop app that uses the width, not a stretched phone or a website.
```

### P7 · 디자인 시스템 정리

```text
Summarize the design system you used across all screens as a DESIGN.md: typography roles and sizes, named colors and what each is for, surfaces, shape and spacing rules, every component with its states, motion notes for flipping, opening and slipping in, and how layouts adapt from phone to iPad and desktop.
```

## 예시 내용

| 플레이리스트         | 주인 | 곡 (★ 친구가 넣은 곡, 넣은 사람)                                                                                                                                                         |
| -------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 새벽 운전            | 지우 | Nights / Frank Ocean · ★Kyoto / Phoebe Bridgers (민지) · Square (2017) / 백예린 · Antifreeze / 검정치마 · ★Plastic Love / 竹内まりや (민준) · Space Song / Beach House · 밤편지 / 아이유 |
| 첫 자취방            | 준호 | 별일 없이 산다 / 장기하와 얼굴들 · 위잉위잉 / 혁오 · ★난춘 / 새소년 (민지) · NO PAIN / 실리카겔 · 주저하는 연인들을 위해 / 잔나비                                                        |
| 헬스장 금지곡        | 도윤 | Lose Yourself / Eminem · Stronger / Kanye West · Numb / Linkin Park · ★말달리자 / 크라잉넛 (서준) · ★낭만고양이 / 체리필터 (유나)                                                        |
| 비 오는 날 작업용    | 민지 | No Surprises / Radiohead · ★Chamber of Reflection / Mac DeMarco (하늘) · 기억을 걷는 시간 / 넬 · ★산책 / 백예린 (지우)                                                                   |
| 그 밖의 플레이리스트 |      | 출근길 30분 · 여름 끝물 · 이별 후 3일차 · 노래방 18번 · 고양이랑 낮잠 · 시험 기간                                                                                                        |
| 요즘 듣는 거 (내 것) | 하린 | Ivy / Frank Ocean · Hollywood / 검정치마 · ★Motion Sickness / Phoebe Bridgers (지우) · Panda Bear / 혁오 · ★Everything / 검정치마 (민지)                                                 |

## 결과 볼 때

- 정지 화면에서도 넘기는 느낌이 읽히나
- 친구가 넣은 곡과 누가 넣었는지가 한눈에 보이나 (색 하나에만 기대지 않고)
- 온보딩 없이 첫 화면에서 할 일이 보이나
- 폰은 폰 앱처럼, 아이패드는 아이패드 앱처럼 느껴지나
- AI 티: 보라 그라디언트, 여기저기 유리, 엠대시, 아이콘 카드 격자가 없나

비율 출처: npm에 공개된 `@toss/tds-react-native` 2.0.5(Apache-2.0)의 버튼·리스트·하단 버튼 값과 `@toss/tds-typography` 0.0.3의 기본 타이포 값(T1~T7). 375 기준 폭은 앱인토스 디자인 가이드를 다룬 검색 요약 기준이라 확인이 더 필요해요.
