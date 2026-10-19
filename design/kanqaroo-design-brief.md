# Kanqaroo — Design Brief for Google Stitch / Figma AI

> **사용법 (사람용 메모)**
>
> - 2026-10-19 기준 스냅샷이에요. 원본: 화면·인터랙션은 `prototype/folder.html` ([폴더 시안 Artifact](https://claude.ai/artifact/6y8L3tJJCAzDVU5fpGCUCp)), 색·버튼 토큰은 `prototype/src.html`, 결정 배경은 Notion Decision Log.
> - **Part A**(Design System)는 Stitch의 DESIGN.md 형식을 따라서 따로 잘라 써도 돼요. 핵심은 **A-2 인터랙션 언어**예요.
> - **Part C**의 프롬프트를 순서대로 써요. 디자인 시스템 시트 → 서랍 → 꺼낸 폴더 → 새 폴더 → 예정 기능 → 일관성 점검.
> - Stitch는 움직임을 못 만들어서, 모션은 "프레임 여러 장"으로 요청하게 써 뒀어요. 실제 움직임은 시안 Artifact로 확인해요.
> - 모델이 읽기 쉽게 본문은 영어로 썼어요. 따옴표 안의 한국어는 실제 UI 문구라 그대로 써야 해요.

---

## Product in one paragraph

**kanqaroo** is a mobile-first Korean web service where people slip songs into each other's playlists. People, not algorithms, find songs that truly fit your taste and songs you would never meet on your own. The first screen is **둘러보기** (browse): a feed of other people's public playlists. Open one, pick a gap between two songs, and your song goes in immediately, with no approval and no reactions. There are no accounts: the owner keeps a **manage link**, and an **add link** lets friends who don't browse the feed add songs too. Music plays on YouTube; kanqaroo only shows the list. The UI is Korean.

**People**

- **Owner (주인)**: makes a playlist, decides whether it shows in 둘러보기, shares the add link on Instagram stories or X, checks who added what, removes songs they don't want.
- **Visitor (다른 사람)**: browses folders in 둘러보기 or opens an add link, taps a gap, types a song and their name once, and the owner sees "민지님이 넣음".

---

# Part A — Design System (DESIGN.md)

## 1. Visual Theme & Atmosphere

- White canvas, **one** vivid orange, everything else neutral gray.
- The whole UI is made of **paper**: playlists are file folders standing in a drawer, the song list is a sheet inside the folder, and songs added by other people are slips tucked between the lines.
- Typographic and flat. No shadows: paper layers are separated by 1px borders and overlap, not by blur.
- **Never**: gradients, multiple accent colors, large tinted backgrounds (no "color filter" look), glassmorphism, drop shadows, album-art grids, illustrations, skeuomorphic paper textures, emoji in UI, dark mode (not now).
- Mobile-first, single column, max width 480px, 16px side gutters.

## 2. Interaction Language (the core idea)

One physical model, used everywhere. If a new screen needs a pattern, build it from these parts.

### Materials (three paper layers)

| Layer      | Looks like                                                                                              | Used for                                                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Folder** | Surface gray `#F6F6F6`, 1px `#DCDCDC` border, a tab on top                                              | A playlist. Also the blank folder used to create one                                                                                                   |
| **Sheet**  | White paper, 1px `#DCDCDC` border, radius 6, a faint orange-light margin line after the number column   | The song list, activity list and share panel inside a folder                                                                                           |
| **Slip**   | Orange Light `#FDEDE6` strip with a 3px Orange left edge, sticking 10px out past the sheet's right edge | Anything someone else put in: a song added by another person, the insert form, an activity item. Slips peeking above a closed folder = recent activity |

### Verbs (motions)

| Verb                        | What happens                                                                                                                                                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **꽂혀 있음** (filed, rest) | Folders stand in a drawer, overlapping. Only the tab and the top of each folder show. Tabs alternate left / center / right so every title is visible                                                                       |
| **꺼내기** (pull out)       | Tap a folder: it lifts out of the drawer and grows to fill the screen, tab staying where it was. Then the sheet rises out of the folder                                                                                    |
| **넣기** (slip in)          | Tap "노래 넣기": the lines of the sheet part and a dashed orange "여기에 넣기" gap appears between every pair of rows. Tap a gap: a slip slides in from the right with the form on it. Submit: the slip settles into a row |
| **빼기** (pull a slip out)  | A row slides out to the right and the gap closes. A toast offers "되돌리기"                                                                                                                                                |
| **다시 꽂기** (file back)   | Close: the sheet sinks into the folder, the folder shrinks back into its slot in the drawer. A newly created folder drops into the drawer with a small bounce                                                              |

### Tabs are always paper index tabs

Navigation tabs (둘러보기 / 내 플레이리스트) and the dividers inside a folder (목록 / 활동 / 공유) use the same component: a rounded-top tab standing on a hairline. The selected tab is the color of the paper below it and joins it; unselected tabs are Line gray `#ECECEC` with Ink 3 text. There are no underline tabs.

## 3. Color Palette & Roles

Only these colors exist. Orange is an accent, not a background.

| Name         | Hex       | Role                                                                                                                                                                        |
| ------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Orange       | `#ED692C` | Primary CTA fill, slip left edge and peeking-slip outline, numbers of songs added by others, unseen dot, badge, focus ring, insert-mode dashed gap, playing bars, logo mark |
| Orange Dim   | `#B8460F` | Small orange **text** on white or gray: eyebrow labels, "민지님이 넣음" tags, names in folder meta, "여기에 넣기" label, error text, play icon. 5.4:1 on white              |
| Orange Light | `#FDEDE6` | Slip paper, tint box (share), sheet margin line                                                                                                                             |
| Ink          | `#141414` | Primary text, text **on orange** (6:1). Never white text on orange (3.15:1, fails AA). Also the video placeholder and toast background                                      |
| Ink 2        | `#5C5C5C` | Secondary text: artist names, descriptions, folder meta                                                                                                                     |
| Ink 3        | `#9B9B9B` | Tertiary: track numbers, timestamps, placeholders, unselected tab text                                                                                                      |
| Line         | `#ECECEC` | Row dividers, unselected tab fill, segmented-control track on gray paper                                                                                                    |
| Line 2       | `#DCDCDC` | Borders of folders, tabs, sheets, inputs and secondary buttons                                                                                                              |
| Surface      | `#F6F6F6` | Folder paper, gray boxes, hover                                                                                                                                             |
| White        | `#FFFFFF` | Page background, sheet paper, secondary button fill                                                                                                                         |

## 4. Typography Rules

Font: **Pretendard** (fallback: Apple SD Gothic Neo, Noto Sans KR, system-ui). Weights 400 / 600 / 700 / 800. Korean line breaks by word (`word-break: keep-all`). Numbers in lists are tabular.

| Style                        | Size / Weight / Line height                   | Extra                                      |
| ---------------------------- | --------------------------------------------- | ------------------------------------------ |
| Folder tab title (open)      | 22 / 800 / 1.2                                | letter-spacing −0.02em, one line, ellipsis |
| Folder tab title (in drawer) | 15 / 800                                      | one line, ellipsis                         |
| H2 (section title)           | 16 / 700 / 1.5                                |                                            |
| Body                         | 16 / 400 / 1.5                                | Ink                                        |
| Track title                  | 16 / 600 / 1.35                               | one line, ellipsis                         |
| Track artist                 | 14 / 400                                      | Ink 2, one line, ellipsis                  |
| Track number                 | 14 / 700                                      | two digits "01", Ink 3 (Orange on slips)   |
| Folder meta                  | 14 / 400                                      | Ink 2, owner name 700 Ink                  |
| Folder last-activity line    | 13 / 400                                      | Ink 2, name in Orange Dim 700, one line    |
| Eyebrow                      | 13 / 700                                      | Orange Dim, letter-spacing +0.02em         |
| Label (form)                 | 13 / 700                                      | Ink                                        |
| Small                        | 13 / 400                                      | Ink 2                                      |
| Tiny                         | 12 / 400                                      | Ink 3                                      |
| Tag                          | 12 / 700                                      | Orange Dim                                 |
| Tab label                    | 15 / 700 (drawer), 14 / 700 (folder dividers) |                                            |
| Button                       | 15 / 700                                      |                                            |
| Logo wordmark                | 17 / 800                                      | lowercase "kanqaroo"                       |

## 5. Component Stylings

### Controls share one height: 44px

Buttons, icon buttons, text inputs, link fields and the segmented control are all 44px tall.

### Button: one spec for every button

- Height 44, horizontal padding 18, text 15/700, border 1px, fully rounded (pill).
- **Primary (CTA)**: Orange fill, Orange border, Ink text. **Secondary**: White fill, Line 2 border, Ink text.
- They differ **only by color**. At most one primary per view (an open insert slip counts as its own context).
- Disabled: 40% opacity. Hover: primary gets a 7% black overlay; secondary turns Surface.
- Alone → full width. Side by side → equal widths, 8px gap.

### Icon button

- 44×44 circle, no border, no fill, 16px icon in Ink 2 (play icon Orange Dim). Hover → Surface fill.
- Every icon button has a Korean label ("재생", "빼기", "폴더 닫기").

### Text input / textarea

- Height 44, radius 12, 1px Line 2 border, White fill, 14px padding, 15px text. Focus: Orange border, no glow.
- Label above (13/700). Helper below in Tiny. Error below in 13/600 Orange Dim.

### Segmented control

- Pill track (Line on gray paper, Surface on white), 4px padding, total height 44. Selected segment: White pill with a tiny shadow `0 1px 3px rgba(0,0,0,.08)` (the only shadow in the system).

### Paper index tab

- Rounded top corners 10, 1px Line 2 border on top/left/right, no bottom border, 15/700 text, 16px padding.
- Unselected: 40px tall, Line fill, Ink 3 text. Selected: 44px tall, filled with the paper it belongs to (White page or White sheet), Ink text, covering the hairline under it.
- Count badge after the label: Orange pill, 20px, Ink number 12/700.

### Folder — in the drawer

- Tab: 34px tall, up to 64% wide, Surface fill, title 15/800, optional 8px orange unseen dot. Position by index: 1st left, 2nd center, 3rd right, repeat.
- Body: Surface fill, 1px Line 2 border, radius 14 (0 at the corner under a side tab), padding 14/16/24. Two lines: meta "**지우님** · 7곡 · 2명이 넣음" and last activity "최근에 넣은 곡 · Plastic Love — **민준님** · 20분 전" (or "새로 넣은 곡 2개" in Orange Dim for my own playlists).
- Peeking slips: up to 3 small slips (52×20, Orange Light, 1px Orange outline, no bottom border) stick 10–14px up from the body's top edge on the side opposite the tab, one per song added in the last 3 days.
- Stacking: each folder overlaps the one above by 10px; later folders sit on top.
- Ghost folder (top of 내 플레이리스트): same shape with dashed Line 2 borders and no fill, tab "+ 새 플레이리스트", body "빈 폴더에 이름을 붙이고 곡을 담아요".

### Folder — pulled out (open)

- Fills the screen under the header. Tab 52px tall, up to 86% wide, same left/center/right position as in the drawer, title 22/800.
- Body: Surface, padding 12/16/20, 14px gap. Order: eyebrow row ("지우님의 플레이리스트 · 7곡 · 2명이 넣음" + close X icon button) → primary "노래 넣기" → sheet → secondary "처음부터 이어 듣기".
- My own folder adds divider tabs on the sheet: "목록" / "활동 (badge)" / "공유".
- New folder: the tab itself is a text input with placeholder "플레이리스트 이름".

### Track row (on the sheet)

- `[number 28px] [title / artist / tag] [actions]`, 12px gap, min height 60, 1px Line divider.
- Variants: **default** (owner's own song, plain on the sheet) · **slip** (added by someone else: slip paper, Orange number, tag "민지님이 넣음") · **mine** (I added it to someone else's list: slip + tag "내가 넣음" + remove icon) · **playing** (three animated orange bars replace the number) · **settling** (a just-added slip slides in 28px from the right with a brighter orange flash).
- Actions: play icon button; remove icon button only for the owner, or for the person who added it.

### Insert gap and insert slip

- Gap (insert mode only): 38px tall — 28px Orange bar in the number column, label "여기에 넣기" 13/700 Orange Dim, then a dashed Orange rule to the edge. Hidden (0px) outside insert mode.
- Insert slip: slip paper, 14/24/16 padding, 10px gap. Heading 14/800 "3번째 자리에 들어가요" + "(맨 앞)/(맨 뒤)" at the ends. Fields: "노래 제목" | "가수 (선택)" side by side → "유튜브 링크 (선택)" → "내 이름 (예: 민지)" (visitors only). Buttons: "취소" | "넣기" equal widths.

### Activity item (owner, 활동 tab)

- A slip: "**민지님**이 2번째 자리에 넣었어요" (15) / "Kyoto · Phoebe Bridgers" (14 Ink 2) / "2시간 전" (Tiny) + play icon + "빼기" secondary button.
- Unseen = slip paper with Orange edge. Seen = White with a Line 2 edge.

### Share panel (owner, 공유 tab)

- Tint box: "추가 링크 · 친구에게 보내기" / link field / primary "링크 복사" / "인스타 스토리" | "X에 올리기".
- "둘러보기에 보이기": segmented "공개" | "링크 있는 사람만" + one tiny explanation line.
- Secondary "다른 사람에게 보이는 화면 보기" (shows a gray bar "다른 사람에게 보이는 화면이에요" + "돌아가기").
- Gray box: "관리 링크 · 나만 보관" + link field + "복사".

### Player _(placeholder until deployed)_

- Sticks to the top of the open folder while playing. Full-bleed 16:9 video area (never shorter than 200px — YouTube requires a visible embedded player of at least 200×200px), Ink background.
- Below: Orange number + title/artist, then prev / pause / next / close icon buttons and a "유튜브에서 열기" secondary button pushed right.

### Toast, header, footer

- Toast: bottom center, Ink pill, White 14/600 text, optional Orange "되돌리기".
- Header: sticky 56px, White 94% + blur, hairline below. Logo left, "새 플레이리스트" secondary button right.
- Footer: Tiny Ink 3, "음악은 유튜브에서 들어요. Kanqaroo는 곡 목록과 링크만 보여줘요."

## 6. Layout Principles

- One column, max 480px, centered, 16px gutters.
- Drawer screen: header → paper index tabs on a hairline → folder stack (16px under the tabs).
- Open folder: covers everything below the header and scrolls on its own; the drawer keeps its scroll position underneath so the folder can return to its slot.
- Slips break out of the sheet by 10px on the right; the folder body's 16px padding keeps them inside the folder.
- Spacing scale: 4, 6, 8, 10, 12, 14, 16, 24. Radius scale: 6 (sheet), 10 (tabs), 12 (inputs, link fields), 14 (folders), 18 (boxes), full (buttons, badges, segmented, toast).
- No fixed bottom bars.

## 7. Motion

All motion uses `cubic-bezier(.2,.7,.2,1)` unless noted. With reduced motion, everything snaps.

| Motion          | Spec                                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Pull out (open) | Folder grows from its drawer rectangle to full screen while moving up: 420ms. Sheet rises 28px + fades in: 300ms, 160ms delay |
| File back       | Sheet sinks 24px + fades: 160ms ease-in. Folder shrinks back to its slot: 360ms `(.4,0,.2,1)`, 90ms delay                     |
| Gaps open       | Each gap grows 0 → 38px: 220ms                                                                                                |
| Slip in         | Slot grows to the slip's height: 240ms. Slip slides from 40px right + fades in: 280ms                                         |
| Slip settles    | New row slides from 28px right with a brighter orange that fades to slip paper: 700ms                                         |
| Slip out        | Row slides 56px right + fades: 180ms ease-in, then collapses: 160ms                                                           |
| Filed (new)     | New folder drops 16px with a small overshoot: 550ms; its outline is orange for ~1s                                            |
| Toast           | Rises 8px: 180ms ease-out                                                                                                     |

## 8. Copy & Voice

- Polite, casual Korean (해요체). Short sentences.
- People are always "○○님" — "민지님이 넣었어요", "지우님의 플레이리스트". Never "민지가".
- "소매넣기" is the brand idea, not a UI label. The folder metaphor stays visual: UI text still says 플레이리스트 / 노래 넣기 / 빼기, not "파일" or "폴더".
- **Banned words**: 영수증, 주머니, 군집, 보드, 반응, 수락, 거절, 승인, 로그인/회원가입 (as a feature).

## 9. Do / Don't

| Do                                           | Don't                                                        |
| -------------------------------------------- | ------------------------------------------------------------ |
| Build every view from folder → sheet → slip  | Cards with shadows, modals, bottom sheets with a grab handle |
| Paper index tabs for every tab set           | Underline tabs or pill tabs for navigation                   |
| Keep the folder's tab position when it opens | Move the title to a generic page header                      |
| One orange button per view, Ink text on it   | Bigger or bolder CTAs; white text on orange                  |
| Slips only for things other people put in    | Orange Light as a general highlight (e.g. for errors)        |
| Real Korean sample content (below)           | Lorem ipsum or English placeholder copy                      |

---

# Part B — Product, Screens, Flows

## Vocabulary (UI term → meaning)

| UI term                 | Meaning                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------- |
| 둘러보기                | Feed of other people's public playlists                                            |
| 내 플레이리스트         | Playlists made in this browser (manage links remembered here)                      |
| 노래 넣기               | Adding a song at a chosen gap. It appears immediately                              |
| 빼기                    | Removing a song (owner, or the person who added it, in the same browser)           |
| 활동                    | Who added which song at which position, newest first                               |
| 공개 / 링크 있는 사람만 | Whether a playlist shows in 둘러보기 (and anyone can add) or only via the add link |
| 추가 링크               | Link the owner shares; anyone with it can add songs                                |
| 관리 링크               | The owner's private link for removing songs from another device                    |

## Feature status

| Status                      | Features                                                                                                                                                                                                                                                                                                                   |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **In the folder wireframe** | 둘러보기 feed · 내 플레이리스트 · open/close folders · insert at any gap · remove + undo · activity with unseen badge · share panel (copy link, Instagram guide, X) · 공개 범위 · visitor preview · new folder with "가수 - 제목" lines or a screenshot (simulated reading with "확인해 주세요" rows) · player placeholder |
| **Next (needs backend)**    | Real saving (Workers + D1), real screenshot reading on the device (Tesseract), real YouTube embed playback                                                                                                                                                                                                                 |
| **Later**                   | Suggest a YouTube video for a typed title ("이 영상 맞아요?") · playlist editing (rename, reorder, delete playlist)                                                                                                                                                                                                        |
| **Removed** (do not design) | Landing/onboarding pages, accounts/login, accept/reject, reactions, receipts, "pouch" inbox                                                                                                                                                                                                                                |

## Screens

### S1. 둘러보기 (first screen)

Header → index tabs "둘러보기" (selected) | "내 플레이리스트 (badge)" → folder stack of other people's public playlists, most recently active first. No intro text.

### S2. 내 플레이리스트

Same drawer with the ghost folder first, then my folders. Meta "**내 플레이리스트** · 6곡 · 2명이 넣음", last line "새로 넣은 곡 2개 · Everything — 민지님" when unseen, " · 링크로만 공개" for private ones.

### S3. Open folder — someone else's

Tab "새벽 운전" → eyebrow "지우님의 플레이리스트 · 7곡 · 2명이 넣음" + X → primary "노래 넣기" → sheet → "처음부터 이어 듣기".

- Insert mode: button turns secondary "자리 고르기 끝내기", hint "줄 사이 원하는 자리를 눌러 주세요", gaps appear.
- After "넣기": toast "3번째 자리에 들어갔어요", new slip settles with "내가 넣음".

### S4. Open folder — mine

Same, plus divider tabs on the sheet:

- **목록**: tracklist with remove icons.
- **활동**: activity slips. Empty: "아직 넣은 사람이 없어요. 공유 탭에서 링크를 보내 보세요."
- **공유**: share panel.

### S5. New playlist (blank folder)

Pulled out from the ghost folder (or the header button).

1. Tab = input "플레이리스트 이름". Eyebrow "새 플레이리스트" + X.
2. "내 이름" (helper "다른 사람에게는 ‘하린님의 플레이리스트’로 보여요").
3. "곡 가져오기 (나중에 넣어도 돼요)" + segmented "한 줄씩 적기" | "캡처로 가져오기".
   - Lines: textarea "가수 - 제목 (한 줄에 한 곡)" + "목록에 추가".
   - Capture: dashed drop box "플레이리스트 화면 캡처 올리기" / "멜론·스포티파이·유튜브 뮤직 등 어떤 앱이든 돼요." / "사진은 서버로 보내지 않고 이 기기에서 읽어요." + "예시 캡처로 해보기" → progress "캡처에서 곡 이름을 읽고 있어요… 62%" → "6곡을 읽었어요. 틀린 곡은 고치거나 빼 주세요."
4. "담을 곡 N개": a sheet. Uncertain rows show inline title/artist inputs and the tag "확인해 주세요" (no slip paper — nobody else put them in).
5. "둘러보기에 보이기": "공개" | "링크 있는 사람만".
6. Primary "만들기" → the folder files back into 내 플레이리스트 with the drop bounce, toast "‘퇴근길’을(를) 만들었어요. 열면 공유 칸이 있어요".

### S6. States

| State       | Copy                                                                                                                                                                                   |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Empty sheet | "아직 곡이 없어요"                                                                                                                                                                     |
| Form errors | "노래 제목을 적어 주세요" · "유튜브 영상 링크가 아닌 것 같아요 (비워 둬도 돼요)" · "내 이름을 적어 주세요. 주인에게 ‘○○님이 넣음’으로 보여요" · "탭에 플레이리스트 이름을 적어 주세요" |
| Removed     | Toast "‘Kyoto’을(를) 뺐어요" + "되돌리기"                                                                                                                                              |

## Key flows

1. **Visitor**: 둘러보기 → tap a folder (pull out) → "노래 넣기" → tap a gap → slip → "넣기" → close (file back).
2. **Owner**: 내 플레이리스트 → ghost folder → name the tab → add lines or a screenshot → "만들기" → folder drops into the drawer → open → 공유 → copy add link.
3. **Owner checks**: folder with peeking slips / orange dot → open → 활동 → listen → "빼기" → "되돌리기" if it was a mistake.

## Sample content (use this, not lorem ipsum)

| Folder              | Owner | Songs (added by)                                                                                                                                                                       |
| ------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 새벽 운전           | 지우  | Nights / Frank Ocean · Kyoto / Phoebe Bridgers (민지) · Square (2017) / 백예린 · Antifreeze / 검정치마 · Plastic Love / 竹内まりや (민준) · Space Song / Beach House · 밤편지 / 아이유 |
| 첫 자취방           | 준호  | 별일 없이 산다 / 장기하와 얼굴들 · 위잉위잉 / 혁오 · 난춘 / 새소년 (민지) · NO PAIN / 실리카겔 · 주저하는 연인들을 위해 / 잔나비                                                       |
| 헬스장 금지곡       | 도윤  | Lose Yourself / Eminem · Stronger / Kanye West · Numb / Linkin Park · 말달리자 / 크라잉넛 (서준) · 낭만고양이 / 체리필터 (유나)                                                        |
| 비 오는 날 작업용   | 민지  | No Surprises / Radiohead · Chamber of Reflection / Mac DeMarco (하늘) · 기억을 걷는 시간 / 넬 · 산책 / 백예린 (지우)                                                                   |
| 요즘 듣는 거 (mine) | 하린  | Ivy / Frank Ocean · Hollywood / 검정치마 · Motion Sickness / Phoebe Bridgers (지우) · Panda Bear / 혁오 · Everything / 검정치마 (민지) · 0310 / 백예린                                 |

## Open design questions

- 공개 playlists: can anyone in 둘러보기 add songs, or only people with the add link? (wireframe: anyone)
- Should my own public playlists also appear in 둘러보기?
- Is the drawer readable with 30+ folders (search, sorting, or just scrolling)?
- Where the player lives on long lists, within the "video stays visible" rule.
- Logo: the current mark is a placeholder.

---

# Part C — Stitch prompts

Use them in order. Attach Part A (or the whole file) to each one if Stitch doesn't keep it.

### Prompt 1 — Design system sheet

```
Create a design system sheet for a mobile web app called "kanqaroo" (Korean UI, Pretendard font). Follow the attached DESIGN.md strictly.

The whole UI is made of paper, flat, no shadows: playlists are FILE FOLDERS (light gray #F6F6F6, 1px #DCDCDC border, a rounded tab on top), the song list is a white SHEET inside the folder, and songs added by other people are SLIPS (orange-light #FDEDE6 strips with a 3px orange #ED692C left edge, sticking 10px out past the sheet's right edge). One accent color: orange #ED692C; small orange text uses #B8460F. Grays: #141414, #5C5C5C, #9B9B9B, #ECECEC, #DCDCDC.

Show:
- Paper index tabs (selected: white, joined to the paper below; unselected: #ECECEC with gray text) — used for ALL tabs.
- A closed folder: tab with title "새벽 운전", body with "지우님 · 7곡 · 2명이 넣음" and "최근에 넣은 곡 · Plastic Love — 민준님 · 20분 전", two small slips peeking above the body's top edge. Show three folders stacked with tabs on the left, center and right.
- A dashed ghost folder "+ 새 플레이리스트".
- Track rows on a sheet: owner's song (plain), slip row "민지님이 넣음", slip row "내가 넣음" with remove X, playing row (orange bars instead of the number). Two-digit numbers, hairline dividers.
- Insert gap: orange bar + "여기에 넣기" + dashed orange line. Insert slip with "3번째 자리에 들어가요", inputs 노래 제목 / 가수 (선택) / 유튜브 링크 (선택) / 내 이름, buttons 취소 | 넣기.
- Buttons: primary (orange fill, near-black text) and secondary (white, gray border). ALL buttons 44px tall, 15px bold, pill shape; they differ ONLY in color. A row of two equal-width buttons. 44px icon buttons.
- Inputs 44px, segmented control "공개 | 링크 있는 사람만", orange count badge, dark toast "3번째 자리에 들어갔어요".
Label components in English; keep UI text in Korean.
```

### Prompt 2 — The drawer (둘러보기, 내 플레이리스트)

```
Using the kanqaroo system, design 2 mobile screens (390px wide). Header: logo "kanqaroo" left, secondary button "새 플레이리스트" right. Under it, paper index tabs "둘러보기" and "내 플레이리스트 2" standing on a hairline.

1) 둘러보기 selected: a vertical stack of overlapping file folders (each overlaps the one above by 10px; tabs alternate left, center, right). Folders: 새벽 운전 (지우님 · 7곡 · 2명이 넣음, 2 peeking slips), 첫 자취방 (준호님 · 5곡 · 1명이 넣음, 1 slip), 헬스장 금지곡 (도윤님 · 6곡), 비 오는 날 작업용 (민지님 · 6곡), 출근길 30분 (서연님 · 5곡). Each shows a last-activity line like "최근에 넣은 곡 · Plastic Love — 민준님 · 20분 전". No intro text, no hero.
2) 내 플레이리스트 selected: a dashed ghost folder "+ 새 플레이리스트" first, then "요즘 듣는 거" (orange dot on the tab, "새로 넣은 곡 2개 · Everything — 민지님") and "작업할 때" ("링크로만 공개").
```

### Prompt 3 — Pulling a folder out (3 frames)

```
Show the "꺼내기" interaction as 3 frames side by side:
1) The 둘러보기 drawer with the "새벽 운전" folder slightly lifted.
2) Mid-way: the folder grown to about 70% of the screen, the white sheet starting to rise out of it.
3) Open: the folder fills the screen under the header. Its tab (title "새벽 운전", 22px bold) stays top-left. Inside: eyebrow "지우님의 플레이리스트 · 7곡 · 2명이 넣음" with an X close button, a primary "노래 넣기" button, the white sheet with 7 numbered rows (row 02 "Kyoto" and row 05 "Plastic Love" are orange-light slips tagged "민지님이 넣음" / "민준님이 넣음"), and a secondary "처음부터 이어 듣기".
```

### Prompt 4 — Slipping a song in (3 frames)

```
On the open "새벽 운전" folder, show the "넣기" interaction as 3 frames:
1) Insert mode: the button became secondary "자리 고르기 끝내기", hint "줄 사이 원하는 자리를 눌러 주세요", and between every row a gap with an orange bar, "여기에 넣기" and a dashed orange line.
2) The gap after row 02 opened: an orange-light slip slid in from the right holding the form — "3번째 자리에 들어가요", 노래 제목 / 가수 (선택) side by side, 유튜브 링크 (선택), 내 이름, buttons 취소 | 넣기.
3) After 넣기: row 03 is now a slip "Motion Sickness / Phoebe Bridgers — 내가 넣음" with a remove X, and a dark toast "3번째 자리에 들어갔어요".
```

### Prompt 5 — My folder: 목록 · 활동 · 공유

```
Open folder "요즘 듣는 거" owned by me. Eyebrow "내 플레이리스트 · 6곡 · 2명이 넣음". Paper divider tabs sit on top of the white sheet: "목록", "활동 2", "공유". Make 3 variations:
- 목록: tracklist with play and remove icons; rows by 지우 and 민지 are slips.
- 활동: two slips "민지님이 5번째 자리에 넣었어요 / Everything · 검정치마 / 10분 전" and "지우님이 3번째 자리에 넣었어요 / Motion Sickness · Phoebe Bridgers / 1시간 전", each with a play icon and a "빼기" secondary button.
- 공유: orange-light box "추가 링크 · 친구에게 보내기" with a monospace link field, primary "링크 복사", "인스타 스토리" | "X에 올리기"; then "둘러보기에 보이기" segmented "공개 | 링크 있는 사람만"; secondary "다른 사람에게 보이는 화면 보기"; gray box "관리 링크 · 나만 보관" with link field and "복사".
```

### Prompt 6 — New playlist (blank folder)

```
A blank folder pulled out of the drawer. Its tab is a text input showing "퇴근길" (placeholder "플레이리스트 이름"). Inside: eyebrow "새 플레이리스트" + X, field "내 이름" (하린) with helper "다른 사람에게는 ‘하린님의 플레이리스트’로 보여요", "곡 가져오기 (나중에 넣어도 돼요)" with segmented "한 줄씩 적기 | 캡처로 가져오기" (capture selected), a dashed white box "6곡을 읽었어요. 틀린 곡은 고치거나 빼 주세요." with "다른 캡처 올리기", then a sheet "담을 곡 6개" where row 02 shows editable inputs "Squre (2O17)" / "백예린" with the tag "확인해 주세요", then "둘러보기에 보이기" segmented, and a primary "만들기" at the bottom.
```

### Prompt 7 — Player placeholder

```
On the open "새벽 운전" folder, add a player stuck to the top: a full-width 16:9 dark video area (at least 200px tall) labelled "유튜브 플레이어", then "01 Nights — Frank Ocean", then 44px icon buttons previous / pause / next / close and a secondary "유튜브에서 열기" on the right. Row 01 in the sheet shows three orange bars instead of its number. The video always stays visible.
```

### Prompt 8 — Consistency pass

```
Check every screen against the kanqaroo system and fix: everything is built from folder (gray paper) → sheet (white paper) → slip (orange-light strip with orange left edge); all tabs are paper index tabs; open folders keep their tab position; all buttons and inputs exactly 44px, 15px bold, pill shape; primary vs secondary differ only by color; one orange button per view; no white text on orange; small orange text #B8460F; no shadows except the segmented control's selected pill; no colors outside the palette; names always followed by "님".
```
