# Kanqaroo — Design Brief for Google Stitch / Figma AI

> **사용법 (사람용 메모)**
>
> - 2026-10-10 기준 스냅샷이에요. 원본: 화면·토큰은 `prototype/src.html`, 결정 배경은 Notion Decision Log·03 Design.
> - **Part A**(Design System)는 Stitch의 DESIGN.md 형식을 따라서 따로 잘라 써도 돼요. Stitch에 DESIGN.md를 넣는 기능이 있으면 Part A를 넣고, 없으면 프롬프트에 같이 붙여 넣어요.
> - **Part C**의 프롬프트를 순서대로 써요. 디자인 시스템(컴포넌트 시트) → 화면 4개 → 예정 기능 순서.
> - 모델이 읽기 쉽게 본문은 영어로 썼어요. 따옴표 안의 한국어는 실제 UI 문구라 그대로 써야 해요.

---

## Product in one paragraph

**kanqaroo** is a mobile-first Korean web service where friends slip songs into each other's playlists. The idea behind it: people, not algorithms, find songs that truly fit your taste and songs you would never meet on your own. There are no accounts. Two links do everything: the owner keeps a **manage link**, and friends get an **add link** that can only add songs. A friend picks the exact position in the list, and the song goes in immediately, with no approval step and no reactions. Music plays on YouTube; kanqaroo only shows the list and links. The UI is Korean.

**People**

- **Owner (주인)**: makes a playlist, shares the add link on Instagram stories or X, checks who added what, removes songs they don't want.
- **Friend (친구)**: opens the add link, taps a gap between two songs, types a song, and it's in. Types their name once so the owner sees "민지님이 넣음".

---

# Part A — Design System (DESIGN.md)

## 1. Visual Theme & Atmosphere

- White canvas, **one** vivid orange, everything else neutral gray.
- Feels like clean digital liner notes: big bold Korean headings, numbered tracklist rows (01, 02, 03…) separated by hairlines, generous white space.
- Typographic and flat. The list itself is the hero.
- **Never**: gradients, multiple accent colors, large tinted backgrounds (no "color filter" look), glassmorphism, drop-shadow cards per row, album-art grids, illustrations, emoji in UI, dark mode (not now).
- Mobile-first, single column, max width 480px, 16px side gutters.

## 2. Color Palette & Roles

Only these colors exist. Orange is an accent, not a background.

| Name         | Hex       | Role                                                                                                                                         |
| ------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Orange       | `#ED692C` | Primary CTA fill, active tab underline, track numbers of songs added by friends, unseen dot, badge, focus ring, logo mark, progress bar fill |
| Orange Dim   | `#B8460F` | Small orange **text** on white: eyebrow labels, "민지님이 넣음" tags, "관리 →" links, error text, play icon. Contrast 5.4:1 on white         |
| Orange Light | `#FDEDE6` | Tinted surfaces: share box, inline insert form, newly added row highlight                                                                    |
| Ink          | `#141414` | Primary text. Also the text color **on orange** (6:1). Never use white text on orange (3.15:1, fails AA)                                     |
| Ink 2        | `#5C5C5C` | Secondary text: artist names, descriptions                                                                                                   |
| Ink 3        | `#9B9B9B` | Tertiary: track numbers, timestamps, placeholders, inactive tabs, "여기에 넣기" label                                                        |
| Line         | `#ECECEC` | Row dividers, header bottom hairline                                                                                                         |
| Line 2       | `#DCDCDC` | Borders of inputs, link fields and secondary buttons                                                                                         |
| Surface      | `#F6F6F6` | Gray info boxes, hover, segmented-control track, progress track                                                                              |
| White        | `#FFFFFF` | Page background, secondary button fill                                                                                                       |

## 3. Typography Rules

Font: **Pretendard** (fallback: Apple SD Gothic Neo, Noto Sans KR, system-ui). Weights 400 / 600 / 700 / 800. Korean line breaks by word (`word-break: keep-all`). Numbers in lists are tabular.

| Style                        | Size / Weight / Line height | Extra                                                |
| ---------------------------- | --------------------------- | ---------------------------------------------------- |
| Display (landing hero)       | 32 / 800 / 1.22             | letter-spacing −0.03em, one word in Orange           |
| H1 (screen title, list name) | 26 / 800 / 1.25             | letter-spacing −0.02em                               |
| H2 (section title)           | 16 / 700 / 1.5              |                                                      |
| Body                         | 16 / 400 / 1.5              | Ink                                                  |
| Body S (descriptions)        | 15 / 400 / 1.6              | Ink 2                                                |
| Track title                  | 16 / 600 / 1.35             | single line, ellipsis                                |
| Track artist                 | 14 / 400                    | Ink 2, single line, ellipsis                         |
| Track number                 | 14 / 700                    | two digits "01", Ink 3 (Orange if added by a friend) |
| Label (form)                 | 13 / 700                    | Ink                                                  |
| Small                        | 13 / 400                    | Ink 2                                                |
| Tiny                         | 12 / 400                    | Ink 3                                                |
| Eyebrow                      | 13 / 700                    | Orange Dim, letter-spacing +0.02em                   |
| Tag                          | 12 / 700                    | Orange Dim                                           |
| Button                       | 15 / 700                    |                                                      |
| Logo wordmark                | 17 / 800                    | lowercase "kanqaroo"                                 |

## 4. Component Stylings

### Controls share one height: 44px

Buttons, icon buttons, text inputs, link fields and the segmented control are all 44px tall.

### Button: one spec for every button

- Height 44, horizontal padding 18, text 15/700, border 1px, fully rounded (pill).
- **Primary (CTA)**: Orange fill, Orange border, Ink text.
- **Secondary**: White fill, Line 2 border, Ink text.
- Primary and secondary differ **only by color**. Never by size, height, weight, radius or padding.
- At most **one primary button per screen** (an open insert form counts as its own context).
- Disabled: 40% opacity. Hover: primary gets a 7% black overlay; secondary turns Surface.
- Layout: full width when alone in a column. Buttons side by side always split the width equally (equal columns, 8px gap).
- Optional 14px icon before the label, 6px gap.

### Icon button

- 44×44 circle, no border, no fill. Icon 16px in Ink 2; hover → Surface fill, Ink icon.
- Play icon (solid triangle) uses Orange Dim. Remove icon is an "X" with a 1.8px stroke.
- Used inside dense rows (tracklist). Every icon button has a Korean accessible label ("빼기", "유튜브에서 듣기").

### Text input / textarea

- Height 44, radius 12, 1px Line 2 border, 14px horizontal padding, text 15px, placeholder Ink 3.
- Focus: border turns Orange. No glow, no shadow.
- Label above (13/700), 6px gap. Helper text below in Tiny. Error text below in 13/600 Orange Dim.
- Textarea: min height 132, 12px vertical padding, line height 1.6.

### Segmented control

- Surface track, pill radius, 4px inner padding, total height 44 (segments 36).
- Segment text 14/700 Ink 2. Selected segment: White pill, Ink text, shadow `0 1px 3px rgba(0,0,0,.08)`.

### Tabs

- Text tabs, 20px gap, text 15/700. Inactive Ink 3, active Ink with a 2px Orange underline on the shared bottom hairline.
- Count badge after the label: Orange pill, 20px tall, min width 20, Ink number 12px.

### Track row (the core component)

- Layout: `[number 28px column] [title / artist / tag] [actions]`, 12px gap, 12px vertical padding, 1px Line divider below. The list has a hairline on top too.
- Variants:
  - **Default**: Ink 3 number.
  - **Added by a friend**: Orange number + tag "민지님이 넣음" (Orange Dim, 12/700).
  - **Mine** (friend screen): tag "내가 넣음" + remove icon button.
  - **Newly added**: Orange Light background bleeding to both screen edges; a short flash from 35% orange fading to Orange Light.
  - **Playing** _(upcoming)_: the number is replaced by an Orange "now playing" indicator (three small bars).
  - **No YouTube link**: play icon still shown; it opens a YouTube search instead.
- Actions: play icon button (Orange Dim); remove icon button only where removal is allowed.

### Insert slot ("여기에 넣기")

- A 34px-tall gap between rows (and before the first and after the last row).
- Contents: a short 28px × 2px Line 2 bar aligned with the number column, then "여기에 넣기" in 13/700 Ink 3.
- Hover/press: bar turns Orange, label turns Orange Dim.

### Insert form (opens inline in place of the slot)

- Full-bleed Orange Light panel with a 2px Orange top border, 16px padding, 10px gaps.
- Heading 14/800: "3번째 자리에 들어가요" + "(맨 앞)" or "(맨 뒤)" at the ends.
- Fields: "노래 제목" and "가수 (선택)" side by side (equal columns) → "유튜브 링크 (선택, 있으면 바로 재생)" → "내 이름 (예: 민지)" (friend screen only).
- Button row: "취소" (secondary) | "넣기" (primary), equal widths.

### Link field

- Read-only, 44 tall, radius 12, 1px Line 2 border, White fill. Monospace 12px Ink 2, single line with ellipsis.
- Paired with a "복사" secondary button on the right (manage link), or a full-width "링크 복사" primary button below (add link).

### Box

- Radius 18, padding 18, 12px internal gap. Three variants:
  - **Tint** (Orange Light): the most important info on the screen (share box, welcome message).
  - **Gray** (Surface): secondary info (manage link, "나도 받아 볼래요").
  - **Line** (1px Line border on White): guides inside a tint box (Instagram steps).

### Activity item

- `[8px dot] [text block] [actions]`, 14px vertical padding, Line divider.
- Dot: Orange = unseen, Line 2 = seen.
- Text: "**민지님**이 2번째 자리에 넣었어요" (15, name bold) / "Kyoto · Phoebe Bridgers" (14, Ink 2) / "10월 10일 오후 9:12" (Tiny).
- Actions: play icon button + "빼기" secondary button.

### Toast

- Bottom center, Ink background, White text 14/600, pill, 12×18 padding, max width = screen − 32.
- Optional action in Orange 700: "되돌리기". Shows 2.6s (5s with an action). Rises 8px in 180ms.

### Header and footer

- Sticky header 56px: White at 94% + 8px blur + Line bottom hairline. Left: logo (orange rounded pouch shape with a white smile curve and a small music note) + "kanqaroo". Right: "플레이리스트 만들기" secondary button (hidden on Home and Create).
- Footer: Tiny Ink 3, "음악은 유튜브에서 들어요. Kanqaroo는 곡 목록과 링크만 보여줘요."

### Steps list (landing)

- Numbered "01 02 03" in Orange 800 (number column 28px), title 16/700 + description Small, Line dividers.

### Empty / error state

- Centered, 48px top padding: H2 + one line of Body S + optional secondary button.

### Progress bar _(upcoming, screenshot reading)_

- 6px tall, pill, Surface track, Orange fill, percentage in Small next to the message.

## 5. Layout Principles

- One column, max 480px, centered, 16px gutters. Page padding: 20px top, 72px bottom.
- Vertical rhythm: 24px between sections, 12px inside a group, 6px between an eyebrow/title/description trio.
- Spacing scale: 4, 6, 8, 12, 16, 18, 24, 40.
- Radius scale: 12 (inputs, link fields), 18 (boxes), full (buttons, badges, segmented control, toast).
- Tracklists are rows with hairlines, never cards. Full-bleed only for the newly added row, the insert form and the video player.
- Screen order is priority order: identity (eyebrow + H1) → the one primary action → the list → secondary info at the bottom.
- No fixed bottom CTA bar.

## 6. Depth & Motion

- Flat. Only the sticky header and the toast float.
- Motion is short and functional: toast rise 180ms ease-out, new-row flash 1.2s. Respect reduced motion (no animation).

## 7. Copy & Voice

- Polite, casual Korean (해요체). Short sentences.
- People are always "○○님" — "민지님이 넣었어요", "지우님의 플레이리스트". Never "민지가".
- "소매넣기" is the brand idea, not a UI label. No button or screen is called 소매넣기.
- **Banned words**: 영수증, 주머니, 군집, 보드, 반응, 수락, 거절, 승인, 로그인/회원가입 (as a feature).

## 8. Do / Don't

| Do                                            | Don't                                                    |
| --------------------------------------------- | -------------------------------------------------------- |
| One orange button per screen                  | Make the CTA bigger, bolder or taller than other buttons |
| Ink text on orange                            | White text on orange                                     |
| Orange Dim for small orange text              | Orange `#ED692C` for small text on white                 |
| Hairline rows with numbers                    | Shadowed cards per song, album-art grids                 |
| Equal-width buttons side by side              | Mixed button widths or heights in one row                |
| Real Korean sample content (below)            | Lorem ipsum or English placeholder copy                  |
| Keep the YouTube video visible while it plays | Audio-only mini players that hide the video              |

---

# Part B — Product, Screens, Flows

## Vocabulary (UI term → meaning)

| UI term              | Meaning                                                                              |
| -------------------- | ------------------------------------------------------------------------------------ |
| 플레이리스트         | A list of songs owned by one person                                                  |
| 노래 넣기            | Adding a song at a chosen position. It appears immediately                           |
| 추가 링크            | The link the owner shares. Friends with it can only add songs                        |
| 관리 링크            | The owner's private link. Lets them remove songs. Lost link = lost access (no login) |
| 활동                 | Who added which song at which position, newest first                                 |
| 빼기                 | Removing a song (owner, or a friend removing their own song in the same browser)     |
| 유튜브에서 이어 듣기 | Plays all songs that have a YouTube link, in order                                   |

## Feature status

| Status                      | Features                                                                                                                                                                                                                                                               |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Built** (prototype)       | Create playlist (type "가수 - 제목" lines, or read a screenshot) · manage link + add link · insert at any position · remove + undo · activity tab with unseen badge · share: copy link, Instagram story guide, X post · per-song YouTube play · "유튜브에서 이어 듣기" |
| **Confirmed next**          | Screenshot reading on the device (Tesseract, Korean + English) with progress and low-confidence rows to review · in-page continuous playback with an embedded YouTube player · real deployment so friends can add from their own phones                                |
| **Later**                   | Suggest a YouTube video for a typed title ("이 영상 맞아요?") · playlist editing (rename, reorder, delete playlist)                                                                                                                                                    |
| **Removed** (do not design) | Accounts/login, accept/reject, reactions, receipts, gift-back flows, "pouch" inbox                                                                                                                                                                                     |

## Screens

Routes: Home `/` · Create `/new` · Manage (owner, via manage link) · Add (friend, via add link).

### S1. Home

1. Hero (Display): "친구 플레이리스트에 / 노래를 **슬쩍** / 끼워 넣어요" — "슬쩍" in Orange.
2. Body S: "링크만 있으면 로그인 없이, 원하는 자리에 바로 들어가요. 누가 뭘 넣었는지는 주인만 확인하고 뺄 수 있어요."
3. Buttons, stacked full width: **"플레이리스트 만들기"** (primary), "예시로 바로 해보기" (secondary).
4. Example preview: eyebrow "새벽 운전 · 지우님의 플레이리스트" + 3 track rows (the 2nd is added by 민지).
5. "내 플레이리스트" (only when this browser remembers manage links): rows with title + "관리 →" (Orange Dim). Tiny: "이 브라우저에 기억해 둔 관리 링크예요. 다른 기기에서는 관리 링크로 열어 주세요."
6. "이렇게 써요" steps:
   - 01 "플레이리스트 만들기" — "캡처 한 장을 올리거나, 곡을 한 줄씩 적어요."
   - 02 "추가 링크 공유하기" — "친구는 이 링크로 노래를 넣기만 할 수 있어요. 인스타 스토리나 X에 바로 걸 수 있어요."
   - 03 "활동 확인하기" — "누가 몇 번째에 뭘 넣었는지 보고, 마음에 안 들면 빼요."

### S2. Create playlist

1. Eyebrow "새 플레이리스트", H1 "플레이리스트 만들기", Body S "곡은 나중에 넣어도 되고, 비워 두고 친구들한테 채워 달라고 해도 돼요."
2. Field "플레이리스트 이름" (placeholder "예: 새벽 운전").
3. Field "내 이름" (placeholder "예: 지우"), helper "친구에게는 ‘지우님의 플레이리스트’로 보여요".
4. "곡 가져오기" + segmented control: "한 줄씩 적기" | "캡처로 가져오기".
   - 한 줄씩 적기: textarea (placeholder "가수 - 제목 (한 줄에 한 곡)" + two example lines) + "목록에 추가" (secondary, full width).
   - 캡처로 가져오기: Gray dropzone box — "플레이리스트 화면 캡처 올리기" / "멜론·스포티파이·유튜브 뮤직 등 어떤 앱이든 돼요." / "사진은 서버로 보내지 않고 이 기기에서 읽어요." States in S6.
5. "담을 곡 N개": track rows with a remove icon; tag "유튜브 링크 있음" when a link was pasted.
6. **"만들기"** (primary, full width) → "만드는 중…" while saving.

### S3. Manage (owner)

1. Eyebrow "내 플레이리스트 · 관리", H1 playlist title, Small "5곡 · 친구들이 넣은 곡 2개".
2. Welcome box (Tint, only right after creating): "만들었어요! 아래 두 링크만 기억하면 돼요" / "친구에게는 추가 링크를, 나는 관리 링크를 보관해요. 로그인은 없어요."
3. Share box (Tint):
   - H2 "추가 링크 · 친구에게 보내기" / Small "이 링크로는 노래를 넣기만 할 수 있어요. 빼거나 고치지는 못해요."
   - Link field → **"링크 복사"** (primary, full width) → "인스타 스토리" | "X에 올리기" (secondary, equal widths) → "친구 화면으로 미리 보기" (secondary, full width).
   - After "인스타 스토리": Line box "추가 링크를 복사했어요" / 1. "인스타그램에서 스토리를 열어요" 2. "스티커에서 링크를 골라 붙여 넣어요" / Tiny "웹에서는 스토리에 링크를 바로 넣을 수 없어서(인스타그램 정책) 링크 스티커로 붙여요." / "인스타그램 열기" (secondary).
4. Tabs: "플레이리스트" | "활동" + unseen count badge.
5. Tab 플레이리스트: "나도 노래 넣기" (secondary, toggles slots on; label becomes "자리 고르기 끝내기") → tracklist with remove icons → "유튜브에서 이어 듣기" (secondary) + Tiny "유튜브 링크가 있는 4곡을 순서대로 재생해요 (실험 기능)".
6. Tab 활동: activity items, newest first. Empty: "아직 넣은 사람이 없어요. 추가 링크를 공유해 보세요."
7. Manage link box (Gray): H2 "관리 링크 · 나만 보관" / Small "이 링크가 있으면 곡을 뺄 수 있어요. 잃어버리면 다시 찾을 수 없으니 메모나 북마크에 저장해 두세요." / link field + "복사".

### S4. Add (friend)

1. Eyebrow "지우님의 플레이리스트", H1 title, Body S "곡 사이 원하는 자리를 눌러 노래를 넣어 주세요. 넣으면 바로 들어가요."
2. Tracklist with "여기에 넣기" slots always visible between rows.
3. Tapping a slot opens the insert form in place (with "내 이름").
4. After "넣기": the new row is highlighted, toast "3번째 자리에 들어갔어요". The friend's own songs show "내가 넣음" + remove icon; removing shows toast "‘Kyoto’을(를) 뺐어요 · 되돌리기".
5. "유튜브에서 이어 듣기" (secondary).
6. Gray box "나도 받아 볼래요" / "내 플레이리스트를 만들고 링크를 걸면, 친구들이 노래를 넣어줘요." / "내 플레이리스트 만들기" (secondary).
7. If the owner opens their own add link: Gray row box "내 플레이리스트를 친구 화면으로 보는 중이에요" + "관리로" (secondary).

### S5. States

| State             | Copy                                                                                                                                          | Action                    |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| Loading           | "불러오는 중…"                                                                                                                                | —                         |
| Not found         | "플레이리스트를 찾을 수 없어요" / "링크가 잘못됐거나, 지워진 플레이리스트예요."                                                               | "처음으로"                |
| Wrong manage link | "관리 링크가 맞지 않아요" / "링크 끝부분이 잘렸을 수 있어요. 받은 관리 링크를 그대로 열어 주세요."                                            | "노래 넣는 화면으로 보기" |
| Load error        | "플레이리스트를 불러오지 못했어요" / "잠시 뒤에 다시 열어 주세요."                                                                            | —                         |
| Form errors       | "노래 제목을 적어 주세요" · "유튜브 영상 링크가 아닌 것 같아요 (비워 둬도 돼요)" · "내 이름을 적어 주세요. 주인에게 ‘○○님이 넣음’으로 보여요" | —                         |

### S6. Screenshot reading _(confirmed next)_

Runs on the device, so it can take a few seconds.

1. Idle: dropzone (S2).
2. Reading: progress bar + "캡처에서 곡 이름을 읽고 있어요… 62%". Tiny "처음 한 번은 조금 오래 걸려요."
3. Result: Small "7곡을 읽었어요. 틀린 곡은 고치거나 빼 주세요." Rows the reader is unsure about get the tag "확인해 주세요" and an Orange Light background. Tapping a row edits its title and artist inline.
4. Nothing found: error "캡처에서 곡을 찾지 못했어요. 곡 목록이 보이는 화면으로 다시 올려 주세요."

### S7. In-page player _(confirmed next)_

- Sits above the tracklist (S3 tab 플레이리스트, S4) once someone presses play.
- **Full-bleed 16:9 YouTube video, never shorter than 200px** (YouTube requires an embedded player of at least 200×200px).
- Below the video: "03 · Square (2017) — 백예린" (track title 16/600, artist Ink 2) + controls row: previous / play-pause / next as 44px icon buttons + "유튜브에서 열기" secondary button.
- The playing row in the list uses the Playing variant. Row play buttons now play in this player; songs without a link are skipped and keep "유튜브에서 찾아 듣기".
- The video stays visible while playing. No hidden or audio-only mode.

### S8. Video suggestion _(later — component only)_

- For a song without a link: a row with a 64×36 thumbnail, video title (14/600, one line), channel (Tiny), and "맞아요" (primary) | "아니에요" (secondary) at equal widths. Heading "이 영상 맞아요?"

## Key flows

1. **Owner**: Home → Create → Manage (welcome box) → copy add link → post to Instagram story / X.
2. **Friend**: open add link → tap a gap → type title (artist, YouTube link optional) + name → "넣기" → row appears highlighted + toast.
3. **Owner checks**: Manage → 활동 (badge) → listen → "빼기" → toast "되돌리기" if it was a mistake.
4. **Listening**: tap ▶ on a row, or "유튜브에서 이어 듣기"; later, the in-page player.
5. **Friend becomes owner**: "나도 받아 볼래요" → Create.

## Sample content (use this, not lorem ipsum)

Playlist "새벽 운전" by 지우 (owner).

| #   | Title              | Artist          | Added by |
| --- | ------------------ | --------------- | -------- |
| 01  | Nights             | Frank Ocean     | —        |
| 02  | Kyoto              | Phoebe Bridgers | 민지     |
| 03  | Square (2017)      | 백예린          | —        |
| 04  | 우리의 밤을 외워요 | 검정치마        | —        |
| 05  | Plastic Love       | 竹内まりや      | 민준     |

## Open design questions (for the human designer)

- The friend screen has no orange button until a slot is opened. Is the "여기에 넣기" slot discoverable enough, or does it need a stronger entry?
- Where the in-page player lives when the list is long (sticky vs. at the top only), within the "video stays visible" rule.
- Logo: the current mark is a placeholder.

---

# Part C — Stitch prompts

Use them in order. Attach Part A (or the whole file) to each one if Stitch doesn't keep it.

### Prompt 1 — Design system sheet (do this first)

```
Create a design system sheet for a mobile web app called "kanqaroo" (Korean UI, Pretendard font). Follow the attached DESIGN.md strictly.

Style: white background, ONE accent color — vivid orange #ED692C — and neutral grays (#141414, #5C5C5C, #9B9B9B, #ECECEC, #DCDCDC, #F6F6F6). Orange Dim #B8460F for small orange text, Orange Light #FDEDE6 for tinted boxes. Flat, typographic, like clean digital liner notes. No gradients, no shadows on cards, no illustrations, no album art.

Show these components with their states:
- Buttons: primary (orange fill, near-black #141414 text — never white text on orange), secondary (white fill, #DCDCDC border), disabled, with icon. ALL buttons are exactly 44px tall, 15px bold text, 1px border, pill shape. Primary and secondary differ ONLY in color. Show a row of two buttons sharing equal width.
- 44px circular icon buttons (play, remove X).
- Text input 44px (default, focus with orange border, error), textarea.
- Segmented control (two options: "한 줄씩 적기", "캡처로 가져오기").
- Tabs "플레이리스트" / "활동" with an orange count badge.
- Track row variants: default, added by a friend (orange number + tag "민지님이 넣음"), mine ("내가 넣음"), newly added (orange-light background), playing (orange bars instead of the number). Rows have two-digit numbers (01, 02) and hairline dividers, not cards.
- Insert slot "여기에 넣기" and the inline insert form (orange-light panel, heading "3번째 자리에 들어가요", fields 노래 제목 / 가수 (선택) / 유튜브 링크 (선택) / 내 이름, buttons 취소 | 넣기).
- Link field (monospace, read-only) with a "복사" button.
- Boxes: tint (orange light), gray, line.
- Activity item ("민지님이 2번째 자리에 넣었어요", song, time, play icon, 빼기 button).
- Toast (dark pill) with "되돌리기" action.
- Progress bar (orange on light gray).
Label each component in English, keep all UI text in Korean.
```

### Prompt 2 — The four core screens

```
Using the kanqaroo design system above, design 4 mobile screens (390px wide, single column, 16px side margins). All text in polite casual Korean (해요체). Use this sample playlist: "새벽 운전" by 지우 — 01 Nights / Frank Ocean, 02 Kyoto / Phoebe Bridgers (added by 민지), 03 Square (2017) / 백예린, 04 우리의 밤을 외워요 / 검정치마, 05 Plastic Love / 竹内まりや (added by 민준).

At most ONE orange (primary) button per screen. Every button is 44px tall, same weight and shape; only color differs.

1. Home: big bold headline "친구 플레이리스트에 노래를 슬쩍 끼워 넣어요" ("슬쩍" in orange), short description, primary "플레이리스트 만들기", secondary "예시로 바로 해보기", a preview of 3 tracklist rows, then a numbered 3-step "이렇게 써요" section (01/02/03 in orange).
2. Create playlist: title "플레이리스트 만들기", fields "플레이리스트 이름" and "내 이름" (helper "친구에게는 ‘지우님의 플레이리스트’로 보여요"), segmented control "한 줄씩 적기 | 캡처로 가져오기", textarea, secondary "목록에 추가", list "담을 곡 3개", primary "만들기" at the bottom.
3. Manage (owner): eyebrow "내 플레이리스트 · 관리", title "새벽 운전", "5곡 · 친구들이 넣은 곡 2개". An orange-light share box: "추가 링크 · 친구에게 보내기", link field, primary "링크 복사", then "인스타 스토리" | "X에 올리기" side by side, then "친구 화면으로 미리 보기". Tabs "플레이리스트" / "활동 2". Tracklist with play and remove icons, secondary "유튜브에서 이어 듣기". A gray box at the bottom "관리 링크 · 나만 보관" with link field and "복사".
4. Add (friend): eyebrow "지우님의 플레이리스트", title "새벽 운전", "곡 사이 원하는 자리를 눌러 노래를 넣어 주세요. 넣으면 바로 들어가요." Tracklist with "여기에 넣기" gaps between every row; the gap after row 02 is open as the inline insert form. A toast "3번째 자리에 들어갔어요" at the bottom. A gray box "나도 받아 볼래요" with secondary "내 플레이리스트 만들기".
```

### Prompt 3 — States of the manage screen

```
Make two variations of the Manage screen: (a) the "활동" tab selected, showing 2 activity items (orange unseen dots) — "민준님이 5번째 자리에 넣었어요 / Plastic Love · 竹内まりや / 10월 10일 오후 9:12" and "민지님이 2번째 자리에 넣었어요 / Kyoto · Phoebe Bridgers" — each with a play icon and a "빼기" secondary button; (b) right after creation: an orange-light welcome box "만들었어요! 아래 두 링크만 기억하면 돼요" above the share box, and the tracklist empty with "아직 곡이 없어요". Keep everything else identical.
```

### Prompt 4 — Upcoming: screenshot reading

```
On the Create playlist screen with "캡처로 가져오기" selected, show 3 states side by side:
1) Gray dropzone box: "플레이리스트 화면 캡처 올리기", "멜론·스포티파이·유튜브 뮤직 등 어떤 앱이든 돼요.", "사진은 서버로 보내지 않고 이 기기에서 읽어요."
2) Reading: thin orange progress bar on light gray, "캡처에서 곡 이름을 읽고 있어요… 62%", tiny "처음 한 번은 조금 오래 걸려요."
3) Result: "7곡을 읽었어요. 틀린 곡은 고치거나 빼 주세요." and a list of 7 rows; 2 rows have an orange-light background and the tag "확인해 주세요"; one row is open for inline editing (title and artist inputs).
```

### Prompt 5 — Upcoming: in-page player

```
On the friend Add screen, add an in-page YouTube player above the tracklist: a full-width 16:9 video placeholder (edge to edge, at least 200px tall), then "03 · Square (2017) — 백예린", then a row of 44px circular icon buttons (previous, pause, next) and a secondary "유튜브에서 열기" button. In the tracklist, row 03 shows three small orange bars instead of its number. The video always stays visible; do not make an audio-only mini player.
```

### Prompt 6 — Consistency pass (run on all screens)

```
Check every screen against the kanqaroo design system and fix: all buttons and inputs exactly 44px tall with 15px bold text and pill shape; primary vs secondary differ only by color; no more than one orange button per screen; side-by-side buttons equal width; no white text on orange; small orange text uses #B8460F; no cards or shadows on track rows; no colors outside the palette; people's names always followed by "님".
```
