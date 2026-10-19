# Kanqaroo — Stitch 디자인 의뢰서 v3 (아코디언 파일철 + 캥거루 낙서)

> **사용법**
>
> - 2026-10-19 기준이에요. 움직임 원본은 `prototype/accordion.html` ([아코디언 Artifact](https://claude.ai/artifact/T3CuToCF2UEwHveMEjfQ4j)), 기능 흐름은 `prototype/folder.html`·`prototype/src.html`, 결정 배경은 Notion Decision Log.
> - **1장 기획안**은 사람이 보는 정리라 한국어로 썼어요. **Part A~C**는 Stitch에 넣는 부분이라 영어로 썼고, 따옴표 안 한국어는 실제 UI 문구예요.
> - Stitch에 DESIGN.md를 넣는 기능이 있으면 **Part A**를 넣고, 없으면 프롬프트마다 Part A를 같이 붙여요.
> - **Part C 프롬프트는 순서대로** 써요. 디자인 시스템 → 캥거루 → 메인 → 꺼내기 → 쪽지 넣기 → 내 파일철 → 새 칸 → 예정 기능 → 점검.
> - Stitch는 움직임을 못 만들어서 모션은 "프레임 3장"으로 요청해요. 실제 손맛은 아코디언 Artifact로 확인해요.
> - 캥거루 스타일 레퍼런스 이미지(굵은 검은 선 동물 얼굴)가 있으면 Prompt 2에 첨부해요. 단, **분위기 참고용**이고 그대로 따라 그리지 않게 해요.

---

# 1. 기획안

## 1-1. 한 줄 정의와 이번 디자인의 목표

**Kanqaroo**는 친구 플레이리스트에 노래를 슬쩍 끼워 넣는(소매넣기) 웹 서비스예요. 알고리즘 대신 사람이 골라주는 노래로 "진짜 내 취향"과 "전혀 몰랐던 음악"을 만나게 하는 게 목적이에요.

이번 디자인의 목표는 세 가지예요.

1. **아코디언 파일철 넘기기**를 메인 탐색 방식으로 굳혀요. SNS 피드처럼 여러 플레이리스트를 빠르게 훑는 경험이에요.
2. 지금까지 만든 기능(자리 골라 넣기, 활동, 빼기, 공유, 공개 범위, 새 플레이리스트, 캡처 가져오기)을 이 안에 하나의 언어로 담아요.
3. 새 기능 **캥거루 낙서**를 넣어요. 노래를 넣는 사람이 아주 간단한 캥거루 얼굴을 그려서 쪽지에 붙여요.

## 1-2. 지금까지 정해진 것

| 구분          | 내용                                                                   | 상태      |
| ------------- | ---------------------------------------------------------------------- | --------- |
| 로그인        | 없음. 주인은 관리 링크, 친구는 추가 링크                               | 확정      |
| 넣기 방식     | 넣는 사람이 자리를 골라서 넣으면 바로 들어감. 승인·반응 없음           | 확정      |
| 주인 권한     | 누가 넣었는지 보고(활동), 마음에 안 들면 빼기(되돌리기 가능)           | 확정      |
| 첫 화면       | 둘러보기(남의 플레이리스트). 온보딩·사용법 화면 없음                   | 확정      |
| 공유          | 링크 복사, 인스타 스토리(링크 스티커 안내), X                          | 확정      |
| 곡 가져오기   | 한 줄씩 적기, 캡처로 가져오기(기기 안에서 글자 인식)                   | 확정      |
| 재생          | 유튜브. 나중에 페이지 안 연속 재생(영상은 늘 보이게, 최소 200×200)     | 확정      |
| 탐색 인터랙션 | 아코디언 파일철 (넘기기·튕기기·꺼내기·다시 꽂기·쏙 넣기)               | 임시      |
| 시각 방향     | 흑백 단색, Pretendard 하나, 각진 모서리, 버튼은 한 규격(색으로만 구분) | 임시      |
| 캥거루 낙서   | 넣는 사람이 캥거루 얼굴을 그려 쪽지에 붙임                             | 이번 기획 |
| 공개 범위     | 공개(둘러보기에 보이고 누구나 넣기) / 링크 있는 사람만                 | 임시      |

## 1-3. 이번에 디자인할 것 / 안 할 것

**한다**

- 디자인 시스템 시트 (흑백 토큰, 칸막이·시트·쪽지·버튼·입력·탭·토스트)
- 캥거루 낙서 스타일 시트 (기본 얼굴, 프리셋 6개, 크기별 스티커, 그리기 패드)
- 둘러보기 아코디언 (멈춤 / 넘기는 중 / 빠르게 튕기는 중)
- 꺼낸 시트 (방문자) → 자리 고르기 → 쪽지 쓰기(+캥거루) → 쏙 넣기
- 내 파일철 (내 칸들 + 맨 뒤 빈 칸) → 내 시트(목록·활동·공유) → 빼기·되돌리기
- 새 칸 만들기 (한 줄씩 / 캡처 읽기 진행 / 확인해 주세요)
- 플레이어 자리, 빈 상태, 오류 상태

**안 한다**

- 로그인·회원가입, 알림, 댓글·반응, 랜딩·온보딩
- 다크 모드, 색 있는 버전 (흑백으로 먼저 굳힘)
- 데스크톱 전용 레이아웃 (모바일 한 열, 넓은 화면은 가운데 정렬)

## 1-4. 화면 흐름

```
둘러보기(아코디언) ─ 넘기기/튕기기/탭 점프 ─┐
   │                                          │
   └─ 앞 칸 누르기 → 꺼낸 시트(방문자)        │
         ├─ 쪽지 넣기 → 자리 고르기 → 쪽지 쓰기 + 캥거루 → 쏙 넣기 → (아코디언으로, 포켓이 출렁)
         └─ 다시 꽂기 → 아코디언

내 파일철(아코디언) ─ 맨 뒤 빈 칸 → 새 칸 만들기 → 꽂기 → 새 칸이 맨 앞에
   └─ 내 칸 누르기 → 내 시트 [목록 | 활동 | 공유]
         ├─ 목록: 쪽지 빼기 → 토스트 "되돌리기"
         ├─ 활동: 누가 몇 번째에 넣었는지 (캥거루 + 이름 + 곡)
         └─ 공유: 추가 링크·인스타·X / 공개 범위 / 관리 링크
```

## 1-5. 인터랙션 명세

| 동작         | 손짓                     | 일어나는 일                                                                                           | 소리   |
| ------------ | ------------------------ | ----------------------------------------------------------------------------------------------------- | ------ |
| 펼침         | 페이지 열림              | 앞 칸부터 아래에서 차례로 올라와 펼쳐짐 (약 1초)                                                      | 없음   |
| 넘기기       | 위로 쓸기 / 휠 / ↓       | 앞 칸이 바닥 경첩을 축으로 앞으로 쓰러지고, 다음 칸이 똑바로 섬                                       | 착     |
| 튕기기       | 빠르게 쓸기              | 손 속도만큼 여러 칸이 연달아 넘어감                                                                   | 다다닥 |
| 점프         | 뒤에 보이는 탭 누르기    | 그 칸까지 연달아 넘어감                                                                               | 다다닥 |
| 꺼내기       | 서 있는 앞 칸 누르기     | 포켓 속 종이가 빠져나와 화면 가운데 시트가 됨                                                         | 슥     |
| 다시 꽂기    | "다시 꽂기" / 바깥 / Esc | 시트가 줄어들며 포켓으로 돌아감                                                                       | 슥     |
| 자리 고르기  | 시트의 "쪽지 넣기"       | 줄 사이가 벌어지며 "여기에 끼우기"가 나타남                                                           | -      |
| 쪽지 쓰기    | 자리 누르기              | 그 자리에 검은 쪽지가 올라옴. 제목·가수·내 이름 + 캥거루 그리기                                       | -      |
| 쏙 넣기      | "쏙 넣기"                | 시트가 꽂히고, 캥거루가 붙은 쪽지가 포물선으로 날아가 포켓에 쏙. 포켓이 출렁, 위로 새 쪽지가 삐져나옴 | 툭     |
| 빼기 (주인)  | 쪽지의 "빼기"            | 쪽지가 오른쪽으로 빠지고 줄이 닫힘. 토스트 "되돌리기"                                                 | -      |
| 새 칸 만들기 | 내 파일철 맨 뒤 빈 칸    | 빈 시트가 꺼내짐 → 작성 → "꽂기" → 새 칸이 맨 앞에 꽂힘                                               | 툭     |

## 1-6. 새 기능: 캥거루 낙서

**왜**: 로그인이 없어서 "누가 넣었는지"가 이름 글자뿐이에요. 넣는 사람이 그린 작은 캥거루가 그 사람의 얼굴 노릇을 해요. 그리는 순간이 재밌고, 받는 사람은 쪽지마다 다른 캥거루를 보는 재미가 생겨요.

**어떻게** (추천안)

- 쪽지 쓰는 화면에 정사각형 **그리기 패드**가 있어요. 패드에는 **캥거루 얼굴 바탕**(머리, 긴 귀 두 개, 주둥이, 코)이 미리 그려져 있고 **눈·입은 비어 있어요**.
- 넣는 사람은 검은 펜 하나로 눈·입·표정·소품(안경, 헤드폰, 모자 등)을 그려요. 색과 굵기는 고르지 않아요 (펜 하나, 레퍼런스처럼 굵고 고른 선).
- 도구: "한 획 지우기", "다 지우기". 그리기 싫으면 **프리셋 6개**(웃음, 윙크, 선글라스, 헤드폰, 졸림, 놀람) 중 하나를 누르거나 그냥 넘어가면 "기본 캥거루"(웃는 얼굴)가 붙어요.
- 바탕이 고정이라 누가 그려도 캥거루로 보이고, 전체 톤이 레퍼런스처럼 하나로 맞아요.

**어디에 보이나**

| 자리                                                    | 크기                 |
| ------------------------------------------------------- | -------------------- |
| 칸막이 위로 삐져나온 쪽지                               | 24px                 |
| 꺼낸 시트의 쪽지 줄                                     | 40px                 |
| 칸막이 앞면 아래 "넣은 캥거루들" 줄 (최대 5마리 + "+3") | 56px                 |
| 내 시트의 활동 목록                                     | 40px                 |
| 날아가는 쪽지                                           | 56px                 |
| 그리기 패드                                             | 화면 폭 60% 정사각형 |

검은 쪽지 위에는 **흰 정사각형 스티커**로 붙여서 검은 선 그림이 잘 보이게 해요.

**나중에 개발할 때 메모**: 그림은 이미지 파일이 아니라 선 좌표(SVG 경로)로 저장해요. 획 수·점 수에 상한을 둬요. 부적절한 그림은 주인이 쪽지째 빼면 되고, 신고는 나중에 다뤄요.

## 1-7. Stitch 작업 순서

| 순서 | 프롬프트                  | 받을 결과                                         | 넘어가기 전에 확인할 것                                     |
| ---- | ------------------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| 1    | P1 디자인 시스템 시트     | 토큰·컴포넌트 한 장                               | 흑백만 썼는지, 모서리가 전부 각졌는지, 버튼 규격이 하나인지 |
| 2    | P2 캥거루 낙서 시트       | 기본 얼굴, 프리셋 6개, 크기별 스티커, 패드        | 24px에서도 캥거루로 보이는지, 선 굵기가 고른지              |
| 3    | P3 둘러보기 (멈춤)        | 메인 화면 1장                                     | 칸막이가 화면을 충분히 채우는지, 뒤 칸 탭이 다 읽히는지     |
| 4    | P4 넘기기 프레임          | 3프레임 + 튕기기 1장                              | 경첩(바닥) 기준으로 넘어가 보이는지                         |
| 5    | P5 꺼낸 시트 (방문자)     | 시트 1장                                          | 쪽지 줄에 캥거루·이름이 같이 보이는지                       |
| 6    | P6~P8 쪽지 넣기 흐름      | 자리 고르기 → 쪽지 쓰기(3상태) → 쏙 넣기(3프레임) | 자리 고르기가 한눈에 보이는지, 패드가 쉬워 보이는지         |
| 7    | P9~P10 내 파일철·내 시트  | 아코디언 1장 + 시트 3변형                         | 방문자 화면과 같은 부품으로만 만들었는지                    |
| 8    | P11 새 칸 만들기          | 작성 화면 + 캡처 읽기 상태                        | 빈 칸 → 꽂기 흐름이 아코디언 언어와 이어지는지              |
| 9    | P12 플레이어·빈 상태·오류 | 3~4장                                             | 영상이 200px 이상, 늘 보이는지                              |
| 10   | P13 일관성 점검           | 전체 수정본                                       | Part A 규칙 체크리스트 통과                                 |

**Stitch 다음 단계**: 마음에 드는 화면을 Figma로 보내서 손보고 → 확정본을 Notion Decision Log에 남기고 → 그다음에 아코디언 시안 위에 기능을 합쳐 개발해요.

## 1-8. 열린 질문

- 캥거루 바탕을 고정할지, 빈 종이에 자유롭게 그리게 할지 (추천: 바탕 고정)
- 앱 로고도 캥거루 낙서 스타일로 갈지
- 둘러보기와 내 파일철을 위 전환 버튼으로 오갈지, 파일철 두 개를 나란히 둘지
- 공개 플레이리스트에 아무나 넣게 할지, 링크 있는 사람만 넣게 할지 (지금: 아무나)
- 칸막이가 수십 개일 때 찾기(검색·정렬)가 필요한지

---

# Part A — Design System (DESIGN.md)

## 1. Visual Theme & Atmosphere

- **Monochrome only**: black, white and a few grays. No accent color.
- The UI is an **accordion file folder** seen slightly from above: playlists are dividers standing on a hinge at the bottom; flipping a divider forward reveals the next one.
- Chunky and printed: **square corners everywhere (radius 0)**, solid black outlines, flat fills. Depth comes from darker grays on dividers further back, never from shadows or gradients.
- Hand-drawn **kangaroo doodles** (thick even black lines) are the only illustration, and they belong to the people who add songs.
- **Never**: rounded corners, colors, gradients, drop shadows, glass, textures, emoji, stock illustrations.
- Mobile-first single column (390px design width). On wide screens the file stays centered, max 540px wide.

## 2. Color Palette & Roles

| Name    | Hex          | Role                                                                                |
| ------- | ------------ | ----------------------------------------------------------------------------------- |
| Ink     | `#111111`    | Outlines, text, primary buttons, slips (songs added by others), sheet header, toast |
| White   | `#FFFFFF`    | Divider fronts, sheets, doodle stickers, text on Ink                                |
| Desk    | `#E8E8E8`    | Page background, unselected tabs                                                    |
| Divider | `#F0F0F0`    | Back panel and tab of each divider                                                  |
| Gray 1  | `#555555`    | Secondary text (owner name, artist)                                                 |
| Gray 2  | `#8C8C8C`    | Tertiary text (track numbers, counts, placeholders)                                 |
| Depth   | Ink at 6–50% | Overlay on dividers further back (each step back ≈ +6%)                             |

## 3. Typography Rules

Font: **Pretendard** only (400 / 600 / 700 / 800). Korean breaks by word. Numbers tabular.

| Style                 | Size / Weight   | Notes                         |
| --------------------- | --------------- | ----------------------------- |
| Divider title (front) | 26–40 / 800     | −0.03em, wraps to 2 lines max |
| Sheet title           | 24 / 800        | white on Ink header           |
| Tab label             | 15 / 700        | one line, ellipsis            |
| Song title            | 16 / 700        | one line, ellipsis            |
| Artist                | 13 / 400 Gray 1 |                               |
| Owner line            | 15 / 600 Gray 1 | "지우님의 플레이리스트"       |
| Meta                  | 14 / 400 Gray 2 | "7곡 · 쪽지 2장"              |
| Track number          | 13 / 700 Gray 2 | "01"                          |
| Slip credit           | 13 / 700        | "민지님이 넣음"               |
| Button                | 15 / 700        |                               |
| Wordmark              | 18 / 800        | lowercase "kanqaroo"          |

## 4. Component Stylings

### Lines and shape

- Radius 0 on everything. Object outline 2px Ink. Row rules inside a sheet 1px Ink. Outline buttons and inputs 1.5px.

### Buttons — one size

- Height 44, padding 0 16, text 15/700, square.
- **Primary**: Ink fill, White text. **Secondary**: no fill, 1.5px Ink border, Ink text.
- On Ink surfaces (sheet header, slip form) invert: primary = White fill + Ink text, secondary = 1.5px White border + White text.
- Same size and weight everywhere; only fill/border color differs. One primary per view. Side-by-side buttons share width equally.

### Divider (one playlist)

- **Back panel**: Divider gray, 2px outline, full height. Its **tab** sticks up 32px from the top edge, 38% wide, at one of four positions (0%, 20%, 40%, 60% from the left, cycling) so tabs behind stay readable. Tab: title 15/700.
- **Paper inside**: White, 1.5px outline, peeks out above the front showing the first three lines "01 Nights — Frank Ocean".
- **Peeking slips**: up to 3 small Ink slips stick up between the paper and the front, slightly tilted (−3° to 2°), each with a 24px doodle sticker and the name in White.
- **Front**: White, 2px outline, bottom 78% of the divider, a 1.5px lip line 10px under its top edge. Content: title (26–40/800), owner line, meta; at the bottom a row "넣은 캥거루들" with up to five 56px doodle stickers and "+3"; on the standing divider a "눌러서 꺼내기 →" hint.
- **States**: standing (upright, readable), behind (leans back, shifts up, darker), flipping (falls toward the viewer around the bottom hinge), flipped (lies flat at the bottom; only its plain back shows).

### Sheet (pulled-out paper)

- White, 2px outline, max width 460, centered. Header: Ink band with sheet title and secondary "다시 꽂기". Body scrolls.
- Rows: number · title/artist · credit, 1px Ink rule between rows.
- **Slip row** (a song someone else added): Ink fill, White text, tilted ±1°, 40px doodle sticker on the left, "민지님이 넣음" on the right.
- Footer: primary "쪽지 넣기".
- Owner's sheet adds square index tabs under the header: "목록 · 활동 2 · 공유" (selected: White joined to the sheet; others: Desk gray).

### Insert gap ("여기에 끼우기")

- Appears between every pair of rows (and before the first, after the last) after "쪽지 넣기". 40px tall: 1.5px dashed Ink line with the label "여기에 끼우기" (13/700) on it.

### Slip form

- An Ink slip that rises in the chosen gap, tilted −0.8°. Heading "3번째 자리에 끼워요". Inputs with a White underline only: "노래 제목", "가수", "유튜브 링크 (선택)", "내 이름".
- **Doodle pad** below the inputs (see 6). Buttons: secondary "그만두기", primary "쏙 넣기" (inverted colors).

### Doodle sticker

- White square, 1.5px Ink outline, doodle centered. Sizes 24 / 40 / 56. On Ink surfaces the sticker stays White.

### Navigation and header

- Header 52px: wordmark left, sound toggle right ("소리 켬"/"소리 끔", secondary button).
- Under the header a two-part square switch "둘러보기 | 내 파일철" (selected: Ink fill White text) and a counter "03 / 10" on the right.

### Toast

- Bottom, full width minus 32px, Ink fill, White 14/600, square. Action "되돌리기" underlined.

### Inputs (on white)

- Height 44, 1.5px Ink border, square, 15px text. Focus: 2px border. Error text 13/700 Ink with a "!" prefix (no red).

## 5. Layout Principles

- Stage = everything below the header and switch. The standing divider fills nearly the full width (gutters 16px) and about 70% of the stage height; its hinge (bottom edge) sits about 9% above the bottom of the stage.
- Dividers behind lean back 1.3° more each and rise 16px each, so their tabs stack up above the standing one; up to 9 are visible.
- Flipped dividers lie flat toward the viewer below the hinge and mostly leave the screen.
- Sheets and forms are centered overlays with a 55% Ink backdrop.

## 6. Kangaroo Doodle Style

- Thick, even black line (about 3px at 56px size), round caps, slightly wobbly hand-drawn feel, flat black fills allowed for inner ears and nose. White background. Friendly and simple, like a children's notebook doodle.
- **Base face** (always present, already drawn): rounded head, two tall upright ears with black-filled inner ears, an oval snout with a small black nose, short cheek lines. No eyes and no mouth.
- **The visitor adds** eyes, mouth and small props with one black pen. No colors, no brush sizes.
- **Presets** (if they don't draw): 웃음 (dot eyes + smile), 윙크, 선글라스, 헤드폰, 졸림 (closed eyes, "z"), 놀람 (round eyes, "o" mouth). Default = 웃음.
- **Pad**: square, White, 1.5px Ink outline, base face drawn in solid Ink; tool row "한 획 지우기 · 다 지우기"; preset row of six 40px stickers; caption "눈이랑 입을 그려 주세요".

## 7. Motion (for frames)

| Motion  | What to show                                                                                                   |
| ------- | -------------------------------------------------------------------------------------------------------------- |
| 펼침    | Dividers rise from below one after another, front first                                                        |
| 넘기기  | Standing divider tilts toward the viewer around its bottom edge until flat                                     |
| 튕기기  | Several dividers mid-fall at different angles                                                                  |
| 꺼내기  | The paper grows out of the pocket into the centered sheet                                                      |
| 쏙 넣기 | Slip with doodle arcs from the sheet area down into the pocket; pocket dips; a new peeking slip pops up; "쏙!" |
| 빼기    | Slip row slides out to the right; the rows close the gap                                                       |

## 8. Copy & Voice

- Polite casual Korean (해요체), short. People are "○○님": "민지님이 넣음", "지우님의 플레이리스트".
- UI words: 둘러보기, 내 파일철, 칸, 쪽지 넣기, 여기에 끼우기, 쏙 넣기, 다시 꽂기, 빼기, 되돌리기, 활동, 공유, 추가 링크, 관리 링크, 내 캥거루.
- Never: 영수증, 주머니, 보드, 반응, 수락, 거절, 로그인.

## 9. Checklist

- [ ] Only Ink / White / Desk / Divider / Gray 1 / Gray 2
- [ ] Radius 0 everywhere
- [ ] Every button 44px, 15/700; primary vs secondary differ only by fill/border
- [ ] One primary per view
- [ ] Pretendard only
- [ ] No shadows or gradients; depth only from gray steps
- [ ] Every slip shows a doodle sticker and "○○님이 넣음"
- [ ] Doodles share the same base face and line weight

---

# Part B — Screens

Design width 390 × 844. Use the sample content below.

| #   | Screen                     | Key content                                                                                                                                                                                                                                                                                                    |
| --- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S1  | 둘러보기 (rest)            | Header, switch (둘러보기 selected), counter "01 / 10", standing divider "새벽 운전" with 2 peeking slips and a kangaroo row, 9 tabs behind                                                                                                                                                                     |
| S2  | Flipping                   | 3 frames: "새벽 운전" upright → falling 45° → flat; "첫 자취방" stands up. Extra frame: fast riffle with 3 dividers mid-fall                                                                                                                                                                                   |
| S3  | Pulled-out sheet (visitor) | "새벽 운전" sheet: 7 rows, rows 02 and 05 are slips with doodles ("민지님이 넣음", "민준님이 넣음"), primary "쪽지 넣기"                                                                                                                                                                                       |
| S4  | Choosing a spot            | Same sheet with "여기에 끼우기" gaps between every row; hint "끼울 자리를 눌러 주세요"                                                                                                                                                                                                                         |
| S5  | Slip form                  | Ink slip in the gap after row 02: inputs + doodle pad. 3 states: base face only / visitor drew sunglasses / preset "윙크" selected. Error state "! 노래 제목을 적어 주세요"                                                                                                                                    |
| S6  | 쏙 넣기                    | 3 frames: sheet shrinking back into the pocket / slip with doodle arcing toward the pocket / pocket dips, new peeking slip with the doodle, "쏙!"                                                                                                                                                              |
| S7  | 내 파일철                  | Switch on "내 파일철"; my dividers "요즘 듣는 거" (with a "새 쪽지 2" mark on its tab) and "작업할 때"; last divider is blank with dashed outline "+ 새 플레이리스트"                                                                                                                                          |
| S8  | My sheet                   | Tabs 목록 / 활동 2 / 공유. 목록: rows with "빼기" on slips. 활동: "민지님이 5번째 자리에 넣었어요 · Everything · 10분 전" with doodles. 공유: 추가 링크 + "링크 복사" + "인스타 스토리" / "X에 올리기", "둘러보기에 보이기" (공개 / 링크 있는 사람만), 관리 링크. Toast "‘Everything’을(를) 뺐어요 · 되돌리기" |
| S9  | New playlist               | Blank sheet pulled from the blank divider: title input "플레이리스트 이름", "내 이름", "곡 가져오기" (한 줄씩 적기 / 캡처로 가져오기), capture progress "캡처에서 곡 이름을 읽고 있어요… 62%", result rows with "확인해 주세요", visibility switch, primary "꽂기"                                             |
| S10 | Player (upcoming)          | On the sheet: full-width 16:9 video area (≥200px tall) "유튜브 플레이어", now playing "01 Nights — Frank Ocean", prev / pause / next / close, "유튜브에서 열기"                                                                                                                                                |
| S11 | Empty & error              | Empty sheet "아직 곡이 없어요 · 첫 쪽지를 넣어 보세요"; not found "플레이리스트를 찾을 수 없어요"                                                                                                                                                                                                              |

## Sample content

| Divider             | Owner | Songs (★ = slip, added by)                                                                                                                                                               |
| ------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 새벽 운전           | 지우  | Nights / Frank Ocean · ★Kyoto / Phoebe Bridgers (민지) · Square (2017) / 백예린 · Antifreeze / 검정치마 · ★Plastic Love / 竹内まりや (민준) · Space Song / Beach House · 밤편지 / 아이유 |
| 첫 자취방           | 준호  | 별일 없이 산다 / 장기하와 얼굴들 · 위잉위잉 / 혁오 · ★난춘 / 새소년 (민지) · NO PAIN / 실리카겔 · 주저하는 연인들을 위해 / 잔나비                                                        |
| 헬스장 금지곡       | 도윤  | Lose Yourself / Eminem · Stronger / Kanye West · Numb / Linkin Park · ★말달리자 / 크라잉넛 (서준) · ★낭만고양이 / 체리필터 (유나)                                                        |
| 비 오는 날 작업용   | 민지  | No Surprises / Radiohead · ★Chamber of Reflection / Mac DeMarco (하늘) · 기억을 걷는 시간 / 넬 · ★산책 / 백예린 (지우)                                                                   |
| Other tabs          |       | 출근길 30분 · 여름 끝물 · 이별 후 3일차 · 노래방 18번 · 고양이랑 낮잠 · 시험 기간                                                                                                        |
| 요즘 듣는 거 (mine) | 하린  | Ivy / Frank Ocean · Hollywood / 검정치마 · ★Motion Sickness / Phoebe Bridgers (지우) · Panda Bear / 혁오 · ★Everything / 검정치마 (민지)                                                 |

---

# Part C — Stitch prompts (in order)

### P1 — Design system sheet

```
Create a design system sheet for "kanqaroo", a Korean mobile web app (Pretendard font only). Follow the attached DESIGN.md strictly.

Visual language: MONOCHROME only (#111111 ink, #FFFFFF white, #E8E8E8 desk background, #F0F0F0 divider gray, #555555 and #8C8C8C text grays). SQUARE CORNERS everywhere (radius 0). Solid 2px black outlines on objects, 1px black rules inside lists. No colors, no shadows, no gradients. Depth only from darker gray overlays.

Show these components with labels in English and UI text in Korean:
- Buttons, all exactly 44px tall, 15px bold, square: primary (black fill, white text), secondary (1.5px black border), and the inverted pair for black surfaces. A row of two equal-width buttons.
- A divider (one playlist): gray back panel with a square tab on top ("새벽 운전"), white paper peeking out with "01 Nights — Frank Ocean / 02 Kyoto — Phoebe Bridgers", two small black slips peeking out with tiny white doodle stickers and names "민지", "민준", and a white front with "새벽 운전" (40px extra bold), "지우님의 플레이리스트", "7곡 · 쪽지 2장", a row of kangaroo doodle stickers at the bottom, and "눌러서 꺼내기 →".
- The same divider in three depth states: standing, behind (darker gray), flipped flat (plain back only).
- Sheet header (black band, white title, "다시 꽂기"), a normal row, a slip row (black, tilted 1°, 40px white doodle sticker, "민지님이 넣음"), an insert gap ("여기에 끼우기" on a dashed line).
- Square index tabs "목록 / 활동 2 / 공유", a two-part switch "둘러보기 | 내 파일철", 44px inputs, a black toast "‘Kyoto’을(를) 뺐어요  되돌리기".
```

### P2 — Kangaroo doodle sheet

```
Create a kangaroo doodle style sheet for kanqaroo. Style: simple hand-drawn line doodles of animal faces — thick, even black lines (about 3px at 56px), round line caps, slightly wobbly, flat black fills only for inner ears and nose, pure white background, friendly and minimal like a notebook doodle. [If a style reference image is attached, match its line quality and simplicity, but draw original kangaroos.]

Show:
1) The BASE kangaroo face: rounded head, two tall upright ears with black-filled inner ears, an oval snout with a small black nose, short cheek lines, NO eyes and NO mouth.
2) Six presets built on that same base: "웃음" (dot eyes, small smile), "윙크", "선글라스", "헤드폰", "졸림" (closed eyes and a small "z"), "놀람" (round eyes, "o" mouth).
3) Three examples drawn by visitors on the same base (messy but cute): glasses and a grin, a party hat, a tongue out.
4) Each doodle as a white square sticker with a 1.5px black outline at 24px, 40px and 56px, and at 40px placed on a black slip row.
5) The doodle pad: a white square with the base face, caption "눈이랑 입을 그려 주세요", tool buttons "한 획 지우기" and "다 지우기", and a row of the six preset stickers.
Keep everything black and white, square corners.
```

### P3 — 둘러보기 (main screen at rest)

```
Design the main screen of kanqaroo (390×844), monochrome, square corners, Pretendard. Header: "kanqaroo" wordmark left, secondary button "소리 켬" right. Below: a square two-part switch "둘러보기 | 내 파일철" (둘러보기 selected) and the counter "01 / 10" on the right.

The rest of the screen is an ACCORDION FILE seen slightly from above: one divider stands upright in front and fills almost the full width and about 70% of the height; nine more dividers lean back behind it, each a little higher and darker gray, so only their square tabs show above it, staggered left/center/right: 첫 자취방, 헬스장 금지곡, 비 오는 날 작업용, 출근길 30분, 여름 끝물, 이별 후 3일차, 노래방 18번, 고양이랑 낮잠, 시험 기간.
The front divider "새벽 운전": white paper peeking out with the first lines, two black slips peeking out with tiny kangaroo doodle stickers ("민지", "민준"), white front with "새벽 운전" in 40px extra bold, "지우님의 플레이리스트", "7곡 · 쪽지 2장", a row of two 56px kangaroo stickers labelled "넣은 캥거루들", and "눌러서 꺼내기 →". Small hint at the bottom: "↑ 위로 쓸어 넘기고, 누르면 꺼내 봐요". No onboarding, no cards, no colors.
```

### P4 — Flipping (frames)

```
Show the flipping interaction of the kanqaroo accordion file as 4 frames side by side, same layout as the main screen:
1) "새벽 운전" standing in front.
2) "새벽 운전" falling toward the viewer around its BOTTOM edge at about 45°, growing larger and darker; "첫 자취방" behind it starting to stand up.
3) "새벽 운전" lying almost flat at the bottom (only its plain gray back visible), "첫 자취방" standing upright and readable; counter "02 / 10".
4) A fast riffle: three dividers mid-fall at different angles, counter "05 / 10".
Monochrome, square corners, depth only through gray.
```

### P5 — Pulled-out sheet (visitor)

```
The visitor tapped "새벽 운전". Show the pulled-out sheet: a centered white sheet (2px black outline, square) over a 55% black backdrop; the accordion is dimmed behind it. Header: black band with "새벽 운전" (24px extra bold, white) and a secondary inverted button "다시 꽂기". Line under it: "지우님의 플레이리스트 · 7곡 · 쪽지 2장". Seven rows with numbers 01–07, title and artist, 1px black rules. Rows 02 (Kyoto / Phoebe Bridgers) and 05 (Plastic Love / 竹内まりや) are black slips tilted 1° with a 40px white kangaroo doodle sticker on the left and "민지님이 넣음" / "민준님이 넣음" on the right. Footer: primary button "쪽지 넣기" (44px, full width).
```

### P6 — Choosing a spot

```
Same sheet after tapping "쪽지 넣기": between every pair of rows (and above the first, below the last) a 40px gap appears with a 1.5px dashed black line and the label "여기에 끼우기". The footer shows "끼울 자리를 눌러 주세요" and a secondary "그만두기". Everything else unchanged.
```

### P7 — Slip form with the kangaroo pad (3 states + error)

```
The visitor tapped the gap after row 02. A black slip rose into that gap (tilted -0.8°) with: heading "3번째 자리에 끼워요"; underline-only white inputs "노래 제목", "가수", "유튜브 링크 (선택)", "내 이름"; then the kangaroo pad — a white square with the base kangaroo face (no eyes, no mouth), caption "눈이랑 입을 그려 주세요", small buttons "한 획 지우기" and "다 지우기", and a row of six 40px preset stickers; then buttons "그만두기" (inverted secondary) and "쏙 넣기" (inverted primary, white fill).
Make 4 variations: (a) empty pad; (b) the visitor drew sunglasses and a grin; (c) preset "윙크" selected (highlighted with a 2px white outline); (d) error "! 노래 제목을 적어 주세요" under the title input.
```

### P8 — 쏙 넣기 (frames)

```
Show the "쏙 넣기" moment as 3 frames:
1) The sheet shrinking back down into the "새벽 운전" pocket.
2) A small black slip carrying the visitor's kangaroo doodle and "Motion Sickness · 하린" flying in an arc toward the top of the pocket.
3) The pocket dipping slightly; a third black slip with the new doodle now peeks out of the pocket next to "민지" and "민준"; the meta reads "8곡 · 쪽지 3장"; a bold "쏙!" floats above.
```

### P9 — 내 파일철

```
Switch set to "내 파일철". Same accordion layout with my dividers: front "요즘 듣는 거" (my playlist, owner line "내 플레이리스트", meta "6곡 · 쪽지 2장", tab shows a small black "새 쪽지 2" label), behind it "작업할 때" (meta includes "링크로만 공개"), and the LAST divider is blank with a dashed black outline and the tab "+ 새 플레이리스트". Counter "01 / 03".
```

### P10 — My sheet: 목록 · 활동 · 공유

```
Pulled-out sheet of my playlist "요즘 듣는 거". Under the black header, square index tabs "목록", "활동 2", "공유". Make 3 variations:
- 목록: rows; the two slips (Motion Sickness by 지우, Everything by 민지) show doodles and a small inverted "빼기" button. Add a black toast at the bottom "‘Everything’을(를) 뺐어요" with an underlined "되돌리기".
- 활동: list of slips with 40px doodles: "민지님이 5번째 자리에 넣었어요 / Everything · 검정치마 / 10분 전" and "지우님이 3번째 자리에 넣었어요 / Motion Sickness · Phoebe Bridgers / 1시간 전".
- 공유: box "추가 링크 · 친구에게 보내기" with a link field and primary "링크 복사", then "인스타 스토리" | "X에 올리기" (equal width secondary); "둘러보기에 보이기" two-part switch "공개 | 링크 있는 사람만"; box "관리 링크 · 나만 보관" with link field and "복사".
```

### P11 — New playlist (blank divider)

```
The blank divider was tapped: a blank white sheet comes out. Header input "플레이리스트 이름" (typed: "퇴근길"). Fields: "내 이름" (하린) with helper "다른 사람에게는 ‘하린님의 플레이리스트’로 보여요"; "곡 가져오기" two-part switch "한 줄씩 적기 | 캡처로 가져오기" (capture selected); a square progress bar "캡처에서 곡 이름을 읽고 있어요… 62%"; below it the result list "담을 곡 6개" where row 02 shows editable inputs "Squre (2O17)" / "백예린" with the label "확인해 주세요"; "둘러보기에 보이기" switch; primary "꽂기". Also show one frame of the new "퇴근길" divider sliding into the front of 내 파일철.
```

### P12 — Player, empty and error

```
Make 3 screens in the same style: (1) the "새벽 운전" sheet with a player at its top — full-width 16:9 black video area at least 200px tall labelled "유튜브 플레이어", then "01 Nights — Frank Ocean", 44px square icon buttons previous / pause / next / close and a secondary "유튜브에서 열기"; row 01 shows a playing indicator instead of its number. (2) An empty sheet "아직 곡이 없어요" with "첫 쪽지를 넣어 보세요" and primary "쪽지 넣기". (3) Not found: "플레이리스트를 찾을 수 없어요" with secondary "둘러보기로".
```

### P13 — Consistency pass

```
Check all kanqaroo screens against DESIGN.md and fix: only #111111/#FFFFFF/#E8E8E8/#F0F0F0/#555555/#8C8C8C; radius 0 everywhere; every button 44px tall, 15px bold, differing only by fill/border; one primary button per view; Pretendard only; no shadows or gradients; every slip shows a white doodle sticker and "○○님이 넣음"; all kangaroos share the same base face and line weight; names always end with "님".
```
