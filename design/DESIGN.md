---
version: alpha
name: Kanqaroo v4.1
description: Playlists as an accordion file of clear sleeves. Album covers show through tinted plastic, paper index labels carry the type, paper slips carry each friend's song and hand-drawn kangaroo. Monospace type, one orange accent, liquid glass only on the floating navigation.
colors:
  primary: '{colors.signal}'
  ink: '#17181C'
  ink-2: '#5A5E68'
  ink-3: '#8F939C'
  paper: '#F1F2EE'
  surface: '#FFFFFF'
  hairline: 'rgba(23, 24, 28, 0.14)'
  signal: '#ED692C'
  signal-ink: '#B8460F'
  sleeve-fill: 'rgba(255, 255, 255, 0.34)'
  glass-fill: 'rgba(255, 255, 255, 0.55)'
  glass-edge: 'rgba(255, 255, 255, 0.85)'
  scrim: 'rgba(16, 17, 20, 0.45)'
  person-1: '#2F6FED'
  person-2: '#0E9F8E'
  person-3: '#7A4FE0'
  person-4: '#D23A8C'
  person-5: '#B88A00'
  person-6: '#3E8E2F'
  person-7: '#8A5A3C'
  person-8: '#4A5F7A'
typography:
  display:
    fontFamily: IBM Plex Mono
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  title:
    fontFamily: IBM Plex Mono
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: IBM Plex Mono
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.02em
  meta:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  xs: 4px
  md: 12px
  pill: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  xxxl: 48px
components:
  button-primary:
    backgroundColor: '{colors.signal}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    height: 44px
    padding: 16px
  button-secondary:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    height: 44px
    padding: 16px
  top-bar:
    backgroundColor: '{colors.glass-fill}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    height: 52px
    padding: 8px
  sleeve:
    backgroundColor: '{colors.sleeve-fill}'
    rounded: '{rounded.md}'
    padding: 16px
  sleeve-tab:
    backgroundColor: '{colors.sleeve-fill}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    height: 36px
    padding: 12px
  index-label:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.display}'
    rounded: '{rounded.xs}'
    padding: 16px
  sheet:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.xs}'
    padding: 24px
  slip:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.xs}'
    padding: 12px
  doodle-sticker:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.xs}'
    size: 40px
  input:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.xs}'
    height: 44px
    padding: 12px
  insert-gap:
    textColor: '{colors.signal-ink}'
    typography: '{typography.label}'
    height: 40px
  toast:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.surface}'
    typography: '{typography.body}'
    rounded: '{rounded.pill}'
    padding: 12px
---

# Kanqaroo v4.1

> Source of truth for design tokens and rules while we explore (Stitch). Once the visual direction converges in Figma, **Figma Variables become the source** and this file is synced from them. Why each rule exists lives in Notion (디자인 v4 · 1 비주얼 방향, 5 AI스러움 점검). Format: [google-labs-code/design.md](https://github.com/google-labs-code/design.md) (alpha).
>
> v4.1 (2026-10-20) is an anti-slop pass over v4, audited against the [oh-my-agent](https://github.com/first-fluke/oh-my-agent) `oma-design` anti-pattern catalog (MIT) and the pixelslop pattern catalog (Apache-2.0). It keeps the accordion interaction, the monospace voice and the orange accent, and removes the generic AI tells (glass everywhere, one-sided accent borders, terminal props, em dashes, small body text, bouncy entrances).

## Overview

Kanqaroo is a Korean mobile web service where people slip songs into each other's playlists. The app is an **accordion file of clear sleeves**: each playlist is a clear plastic sleeve (like a Korean 클리어 파일 pocket) standing on a hinge at the bottom. Its album covers sit inside and show through the plastic; a paper index label on the front names it; paper slips with friends' songs and hand-drawn kangaroos peek out of the top. You flick sleeves forward like an SNS feed, pull the sheet out to read it, and tuck in your own slip.

Tone: **typed labels in an office file**. Monospace is the voice because everything you read is typed onto paper (index labels, track lists, slips), not because the app is "technical". No terminal props.

Material, not effects: plastic you can see through, matte paper, and one layer of liquid glass for the floating navigation. Depth comes from real layering (covers inside a sleeve, a label on the sleeve, slips on a sheet), not from blur and drop shadows.

**Tell things apart by material, position and color together, never by color alone and never by text size.** Four text sizes, that's all.

| What must be told apart    | How (at least two cues each)                                                                        |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| Which playlist             | Its covers visible through the sleeve + the title on the index label + identity tint + tab position |
| Who added a song           | Their kangaroo doodle + `민지님이 넣음` + person-color ring on the sticker                          |
| Owner's song vs added song | Printed row on the sheet vs a paper slip laid on top (material and offset)                          |
| What you can do            | Kanqaroo Orange fill or dashed orange line + a verb label                                           |
| New / unseen               | Orange dot + `새 쪽지 2`                                                                            |
| Playing                    | Animated orange bars replace the track number + `재생 중`                                           |
| Navigation vs content      | Liquid glass (floating top bar only) vs plastic and paper (content)                                 |

## Colors

Name and role for every color. One accent only.

- **Ink Black** `#17181C` (ink): all reading text, icons.
- **Graphite** `#5A5E68` (ink-2): secondary text such as artists and owner lines. About 5.8:1 on paper.
- **Ash** `#8F939C` (ink-3): input borders and disabled states only (about 3.1:1 on white, enough for a component boundary, not for reading text).
- **Paper Gray** `#F1F2EE` (paper): page canvas, with a 3% grain.
- **Sheet White** `#FFFFFF` (surface): index labels, sheets, slips, stickers, inputs. All reading text sits on Sheet White or Paper Gray, so contrast never depends on what is behind a sleeve.
- **Hairline** `rgba(23,24,28,0.14)`: decorative edges of paper (slips, labels). Never the only boundary of a control.
- **Kanqaroo Orange** `#ED692C` (signal): the single accent. Primary button fill, insert-gap line, new dot, playing bars. Text on orange is Ink Black (about 5.6:1), never white (about 3.2:1).
- **Burnt Orange** `#B8460F` (signal-ink): orange text on white (about 5.4:1) and the focus ring (Kanqaroo Orange is only 2.8:1 on Paper Gray, too weak for focus).
- **Identity tint** (computed per playlist): the most vibrant swatch of its covers (node-vibrant), applied at 20 to 30% to the sleeve plastic and its tab. Not an accent: it never marks an action.
- **Person 1 to 8**: assigned by hashing the giver's name. Only a 2px ring on the doodle sticker and an 8px dot in the activity list. Never text, never borders of containers.
- **Sleeve fill / glass fill / glass edge / scrim**: material fills, see Elevation & Depth.
- No gradients except functional fades (the scrim, the fade at the bottom of the sleeve stack). Dark variant after the light direction is chosen.

## Typography

| Role    | Font                        | Size | Weight | Line height | Tracking | Use                                    |
| ------- | --------------------------- | ---- | ------ | ----------- | -------- | -------------------------------------- |
| Display | IBM Plex Mono + Korean mono | 28px | 600    | 1.2         | -0.01em  | Playlist title on the index label only |
| Title   | same                        | 20px | 600    | 1.35        | 0        | Sheet title                            |
| Body    | same                        | 16px | 400    | 1.6         | 0        | Track rows, slips, inputs, toasts      |
| Label   | same                        | 13px | 600    | 1.4         | 0.02em   | Buttons, tabs, switch                  |
| Meta    | same                        | 13px | 400    | 1.5         | 0        | Owner line, counts, times              |

- Korean in builds: **Monoplex KR** (first choice, license to be confirmed) or **D2Coding** (OFL). In Stitch: IBM Plex Mono + Nanum Gothic Coding. Two families at most. Subset to the characters used; `font-display: swap`.
- Body never below 16px on mobile. Paragraph-length Korean (helper text) uses line-height 1.7.
- Hierarchy beyond size: weight (400/600), Ink Black vs Graphite, the inverse block (Ink Black fill, Sheet White text) for the selected segment of a switch, and position on the label.
- Numbers only where they count something: track numbers `01`, the counter `03 / 10`, times. Tabular figures.
- **No terminal props**: no `>` or `▸` prompts, no `[bracket labels]`, no `No.07`, no blinking cursor, no ASCII art, no uppercase letter-spaced eyebrows.
- **No em dash or en dash** in any visible string. Title and artist: `Nights · Frank Ocean`, or the artist on its own line in Graphite.

## Layout

- Mobile single column, 390 design width, works from 375. 16px side gutters, max 540px centered on wide screens.
- Spacing on the 4/8 grid only: 4, 8, 12, 16, 24, 32, 48. Rhythm: 8 inside a row, 16 between rows of controls, 24 sheet padding, 32 between groups.
- Stage below the top bar: the standing sleeve fills almost the full width and about 70% of the stage height, hinge about 9% above the bottom. Up to 9 sleeves lean back behind it and rise 16px each so their tabs stack above it; tabs sit at 0/20/40/60% from the left, cycling.
- Index label: top-left of the sleeve front, about 70% of its width; the covers stay visible around it.
- Pulled-out sheet: centered, max 460px, over the scrim. Touch targets at least 44px.

## Elevation & Depth

Four materials, back to front. Depth is real layering; no drop-shadow cards.

1. **Content**: album covers and doodles. Opaque, full color.
2. **Clear sleeve** (playlist fronts and tabs): translucent plastic tinted with the identity color. The covers inside are drawn slightly hazy (`filter: blur(4px)` on the cover images themselves, opacity 0.85), so they stay recognizable as covers instead of turning into color blobs. A 1px specular highlight along the top edge moves with the sleeve's tilt while flipping. 3% grain. **No `backdrop-filter`** on sleeves; the haze is applied to the covers inside.
3. **Paper** (index labels, sheets, slips, stickers, inputs): opaque Sheet White, matte. All reading text lives here.
4. **Liquid glass** (navigation only): the floating top bar (wordmark, view switch, sound) and, at most, one floating primary action. `backdrop-filter: blur(16px) saturate(140%)`, glass fill, a bright 1px rim, and a tight contact shadow `0 1px 2px rgba(0,0,0,0.10)`. Refraction where supported.

Rules:

- **At most two glass surfaces per screen.** Toasts are solid Ink Black. Player controls, switches inside sheets and secondary buttons are paper, not glass.
- No glass on glass, no glass inside content (Apple's Liquid Glass guidance: glass is the navigation layer).
- Never combine gradient + glass + blur. Texture (grain) instead of gradients.
- Performance: the sleeves need no live blur, so only the top bar uses `backdrop-filter`. Refraction via SVG displacement on `backdrop-filter` works in Chromium only, so plain blur is the baseline.

## Shapes

One documented radius rule: **radius follows material.**

- Paper: **4px** (xs). Index labels, sheets, slips, stickers, inputs.
- Plastic: **12px** (md). Sleeves, and the top corners of their tabs.
- Glass and buttons: **pill**. Top bar, buttons, toast.

No other radii. No shadows on paper or plastic.

## Components

- **Sleeve** (one playlist): tinted plastic with the covers inside, a tab on top with the title (label typography), an **index label** (paper, 4px) with the title in display, `지우님의 플레이리스트` and `7곡 · 쪽지 2` in meta, up to five 40px doodle stickers stuck on the plastic below the label (then `+3`), the sheet peeking out of the top with the first two rows, and up to three slips peeking out with 24px doodles.
- **Track row**: `01` in Graphite, title in Ink Black, artist in Graphite (`Nights · Frank Ocean` or two lines). Hairline separators.
- **Slip** (an added song): a paper strip laid on the sheet, offset 2px up and rotated 0.6° at most, Hairline edge, 40px doodle sticker with the giver's 2px person-color ring, `민지님이 넣음` in meta. **No colored side border.**
- **Sheet** (pulled out): paper, title, owner line, rows. Footer: one primary button `쪽지 넣기`. The owner's sheet has a paper segmented switch `목록 | 활동 2 | 공유` (selected segment as the inverse block).
- **Insert gap**: appears between rows after `쪽지 넣기`: 1.5px dashed Kanqaroo Orange line, a plus icon and `여기에 끼우기` in Burnt Orange.
- **Slip form**: a paper slip rising in the chosen gap: `3번째 자리에 끼워요`, inputs 노래 제목 / 가수 / 유튜브 링크(선택) / 내 이름, the doodle pad, buttons `그만두기` (secondary) and `쏙 넣기` (primary).
- **Buttons**: primary (orange fill, ink text) and secondary (Sheet White, 1px Ash border). One primary per view. Pill, 44px, 16px side padding.
- **Doodle sticker**: Sheet White square, 4px radius, 2px person-color ring, doodle in Ink Black. Sizes 24 / 40 / 56.
- **Top bar** (the only glass): wordmark `kanqaroo`, view switch `둘러보기 | 내 파일철`, sound toggle. The counter `03 / 10` sits as plain meta text on the canvas below the stack (it did not fit in the bar at 360px).
- **Toast**: solid Ink Black pill, Sheet White text: `‘Kyoto’를 뺐어요 · 되돌리기`.
- **Focus**: 2px Burnt Orange ring with 2px offset on every interactive element.
- **Icons**: one family, **Phosphor** (Regular, 1.5px stroke, 20px). Never hand-drawn icon paths, never Lucide by default.
- **Player** (later): full-width 16:9 video at least 200px tall on the sheet, paper control row below.

### Motion

- Direct manipulation (dragging and flipping sleeves) uses spring physics, stiffness about 230, damping about 27: it follows the hand and settles with no visible overshoot (under 1%).
- Everything else uses ease-out: UI transitions 200 to 300ms, pulling the sheet out 400ms.
- Open: the front three sleeves rise in sequence, 600ms in total, no overshoot easing; the rest fade in.
- Slip in: the slip with its doodle arcs into the pocket (400ms), the sleeve dips 4px, a new slip peeks out, toast `쏙! 3번째 자리에 넣었어요`.
- Remove: the slip slides out to the right (250ms); rows close; toast offers undo.
- `prefers-reduced-motion`: no 3D flip (crossfade between sleeves), no flying slip.
- Sounds (paper flick, swish, thud): off until the first touch, toggle in the top bar.

### Kangaroo doodle

- Every slip carries a kangaroo drawn by the person who added the song. It stands in for an avatar (there are no accounts).
- The pad shows a **fixed base face** (rounded head, two tall ears with filled inner ears, oval snout, small nose; no eyes or mouth). People add eyes, mouth and props with one ink pen (about 3px at 56px, round caps, perfect-freehand). Tools: `한 획 지우기`, `다 지우기`. Six presets: 웃음, 윙크, 선글라스, 헤드폰, 졸림, 놀람. Default: 웃음.
- The base face and the presets are **drawn by the designer** (Figma), not generated as SVG by an AI.
- Stored as normalized SVG paths with stroke and point limits. Owners can remove a slip (and its doodle).

### Placeholder assets

- Album covers in mockups: supplied sample covers or labeled photo placeholders. Never abstract gradient art, never div-built fake covers.

## Do's and Don'ts

| Do                                                                 | Don't                                                              |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Let covers show through clear plastic, recognizably                | Blur covers into color blobs (that is a mesh gradient in disguise) |
| Put all reading text on paper (labels, sheets, slips)              | Put text directly on tinted or translucent surfaces                |
| Use liquid glass for the floating top bar (and one action at most) | Use glass on toasts, cards, sleeves or inside sheets               |
| Mark a giver with their doodle, name and a ring                    | Add a thick colored border on one side of a slip                   |
| Use Kanqaroo Orange only for actions, new and playing              | Add a second accent or decorate with orange                        |
| Keep body at 16px and hierarchy in weight, color and position      | Make titles bigger to create hierarchy, or shrink body below 16px  |
| Use mono as typed text on paper                                    | Add terminal props: `▸`, `>`, `[ ]`, `No.07`, cursors, eyebrows    |
| Separate title and artist with `·` or a line break                 | Use em dashes or en dashes anywhere                                |
| Follow the hand with springs; ease-out everything else             | Overshoot or bounce entrances; transitions over 500ms              |
| Use Phosphor icons only                                            | Hand-draw icon paths or mix icon families                          |

**Mechanical checks before handoff** (count, don't judge):

- `backdrop-filter` elements on any screen: 2 or fewer.
- Elements with one border 3px or thicker and the others thinner: 0.
- `—` or `–` in visible strings: 0.
- Body text below 16px: 0.
- Accent colors used for actions: 1 (Kanqaroo Orange).
- Radii in use: 4px, 12px, pill only.
- Off-grid spacing values (not 4, 8, 12, 16, 24, 32, 48): 0.
