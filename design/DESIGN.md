---
version: alpha
name: Kanqaroo v4
description: Playlists as an accordion file. Monospace system type, frosted pockets that let album covers show through, liquid-glass controls, paper slips carrying hand-drawn kangaroos.
colors:
  primary: '{colors.signal}'
  ink: '#17181C'
  ink-2: '#5A5E68'
  ink-3: '#8F939C'
  paper: '#F1F2EE'
  surface: '#FFFFFF'
  signal: '#ED692C'
  signal-ink: '#B8460F'
  frost-fill: 'rgba(255, 255, 255, 0.58)'
  glass-fill: 'rgba(255, 255, 255, 0.40)'
  glass-edge: 'rgba(255, 255, 255, 0.80)'
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
    lineHeight: 1.15
    letterSpacing: -0.01em
  title:
    fontFamily: IBM Plex Mono
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.04em
  meta:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 14px
  lg: 22px
  pill: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
components:
  button-primary:
    backgroundColor: '{colors.signal}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    height: 44px
    padding: 18px
  button-glass:
    backgroundColor: '{colors.glass-fill}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    height: 44px
    padding: 18px
  divider-front:
    backgroundColor: '{colors.frost-fill}'
    textColor: '{colors.ink}'
    typography: '{typography.display}'
    rounded: '{rounded.md}'
    padding: 20px
  divider-tab:
    backgroundColor: '{colors.frost-fill}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.sm}'
    height: 34px
    padding: 12px
  sheet:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.lg}'
    padding: 20px
  slip:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.xs}'
    padding: 12px
  doodle-sticker:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.sm}'
    size: 40px
  input:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.sm}'
    height: 44px
    padding: 14px
  insert-gap:
    textColor: '{colors.signal-ink}'
    typography: '{typography.label}'
    height: 40px
  toast:
    backgroundColor: '{colors.glass-fill}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.pill}'
    padding: 14px
---

# Kanqaroo v4

> Source of truth for design tokens and rules while we explore (Stitch). Once the visual direction converges in Figma, **Figma Variables become the source** and this file is synced from them. Why each rule exists lives in Notion (디자인 v4 · 1 비주얼 방향). Format: [google-labs-code/design.md](https://github.com/google-labs-code/design.md) (alpha).

## Overview

Kanqaroo is a Korean mobile web service where people slip songs into each other's playlists. The app is an **accordion file**: each playlist is a divider standing on a hinge at the bottom; you flick dividers forward like an SNS feed, pull a divider's sheet out to read it, and tuck a paper slip with your song and a hand-drawn kangaroo into its pocket.

Tone: **typewriter meets digital system**. Monospace type, numbered and bracketed labels, crisp system UI, with real material underneath: frosted pockets you can half see through, liquid-glass controls, and matte paper.

**Identify things by color, material and markers, not by text size.** There are only four text sizes; everything else is told apart like this:

| What must be told apart    | How                                                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Which playlist             | Identity color taken from its album covers (tints tab and frost) + the covers showing through the frost + tab position |
| Who added a song           | Person color (one of 8) on the slip edge and sticker ring + their kangaroo doodle                                      |
| Owner's song vs added song | Printed line on the sheet vs an opaque paper slip                                                                      |
| What you can do            | Signal orange: primary button, insert gaps, focus                                                                      |
| New / unseen               | Signal dot + bracket label `[새 쪽지 2]`                                                                               |
| Playing                    | Animated bars in signal color + `▸ 재생 중`                                                                            |
| Navigation vs content      | Liquid glass (controls) vs frost/paper (content)                                                                       |

## Colors

- **ink / ink-2 / ink-3**: text levels. Body text on frost or paper must reach WCAG AA 4.5:1; use ink, never ink-3, on frost. ink-2 is about 5.8:1 on paper; ink-3 is only about 2.7:1, so it is for disabled states and decoration, never for text people must read.
- **paper**: page background (a cool neutral, not cream). **surface**: sheets, slips, stickers, inputs.
- **signal** `#ED692C` (Kanqaroo orange): the only action color. Text on signal is ink (about 5.6:1); never white on signal (about 3.2:1). **signal-ink** `#B8460F` for small orange text on white (about 5.4:1).
- **Identity color** (per playlist, computed): the most vibrant swatch of the playlist's album covers (e.g. node-vibrant). Used at 25–40% to tint the divider's frost and tab. Falls back to a person color when covers are missing.
- **person-1…8**: assigned by hashing the giver's name. Used on slip left edges (3px), sticker rings and activity dots. Never for text.
- **frost-fill / glass-fill / glass-edge / scrim**: material fills (see Elevation & Depth).
- Dark variant: to be designed after the light direction is chosen.

## Typography

- **IBM Plex Mono** for Latin and numbers. Korean in builds: **Monoplex KR** (Plex-based Korean monospace) or **D2Coding**, both OFL. In Stitch, use IBM Plex Mono + Nanum Gothic Coding.
- Four sizes only: display 28 (divider title), title 18 (sheet title), body 14, label/meta 12.
- Hierarchy beyond size: weight (400/600), color level, inverse blocks (ink background with surface text, like a terminal selection), bracketed labels `[공개]`, numbering `07/10`, prefixes `▸ → +`.
- Numbers are tabular. Counters always two digits: `03 / 10`, `No.07`.

## Layout

- Mobile single column, 390 design width, 16px gutters, max 540px centered on wide screens.
- Stage below the top glass bar: the standing divider fills almost the full width and ~70% of the stage height, hinge ~9% above the bottom. Up to 9 dividers behind it lean back and rise 16px each so their tabs stack above it; tabs sit at 0/20/40/60% from the left, cycling.
- Pulled-out sheet: centered, max 460px, over a scrim. Touch targets ≥ 44px.

## Elevation & Depth

Four materials, back to front. No drop-shadow cards; depth comes from blur, translucency and light.

1. **Content**: album covers and doodles. Opaque, full color.
2. **Pocket frost** (divider fronts and tabs): `backdrop-filter: blur(28px) saturate(140%)`, frost-fill tinted with the identity color, 1px glass-edge highlight on the top edge, 3% film grain. The covers stored in the pocket show through as soft color shapes. Dividers further back get darker and blurrier.
3. **Paper** (sheets and slips): opaque surface, matte, no blur. Slips sit on top of frost and sheets.
4. **Control glass** (top bar, view switch, counter, primary floating actions, player controls, toast): Liquid-Glass-like: `blur(16px)` + glass-fill + glass-edge specular rim + soft ambient shadow `0 8px 24px rgba(0,0,0,0.12)`; refraction where the browser supports it.

Rules:

- Glass is for the navigation layer (Apple's guidance). We deliberately use _frost_ (a separate, heavier material) on dividers so covers can show through; we never put control glass inside content.
- No glass on glass: anything placed on glass uses solid or vibrancy fills.
- The light highlight on a divider moves with its tilt while flipping.
- Performance: live blur only on the standing divider and the two behind it; deeper dividers use a pre-blurred cover image. Refraction via SVG displacement on `backdrop-filter` is not interoperable (works in Chromium only), so the frosted blur is the baseline everywhere.

## Shapes

- Dividers and pockets: rounded.md (14). Tabs: rounded.sm on the top corners only.
- Sheets: rounded.lg (22). Slips: rounded.xs (4, paper). Stickers and inputs: rounded.sm (8).
- Control glass: pills (rounded.pill). Mixed radii are intentional: glass is soft, paper is crisp.

## Components

- **Divider**: back panel + tab (title, label typography, identity tint) · covers inside showing through frost · paper peeking out with the first three tracks (`01 Nights — Frank Ocean`) · up to 3 slips peeking out (person-color edge, 24px doodle) · frost front with title (display), owner line `지우님의 플레이리스트`, meta `7곡 · 쪽지 2`, a row "넣은 캥거루들" of 56px stickers, and `▸ 눌러서 꺼내기` on the standing one.
- **Sheet** (pulled out): title, owner line, numbered rows. Added songs are **slips**: paper with a 3px person-color left edge, 40px doodle sticker, `민지님이 넣음`. Footer: primary `쪽지 넣기`. The owner's sheet has tabs `목록 / 활동 [2] / 공유`.
- **Insert gap**: appears between every row after `쪽지 넣기`: dashed signal line + `+ 여기에 끼우기`.
- **Slip form**: a paper slip rising in the chosen gap: `3번째 자리에 끼워요`, inputs 노래 제목 / 가수 / 유튜브 링크(선택) / 내 이름, the doodle pad, buttons `그만두기` (glass) and `쏙 넣기` (primary).
- **Doodle sticker**: surface square, 2px person-color ring, doodle in ink. Sizes 24 / 40 / 56.
- **Control glass**: top bar (wordmark `kanqaroo`, sound toggle), view switch `둘러보기 | 내 파일철`, counter `03 / 10`, toast `‘Kyoto’를 뺐어요 · 되돌리기`.
- **Player** (later): full-width 16:9 video at least 200px tall on the sheet, glass control row below.

### Motion

Spring physics everywhere (stiffness ≈ 230, damping ≈ 27).

- Open: dividers rise from below one by one, front first (~1s).
- Flip: the standing divider falls toward the viewer around its bottom edge; fast swipes riffle several; tapping a tab jumps there.
- Pull out: the paper grows out of the pocket into the centered sheet (≈520ms); put back reverses.
- Slip in: gaps open; the slip rises; on `쏙 넣기` the sheet goes back, the slip with its doodle arcs into the pocket, the pocket dips, a new slip peeks out, `쏙!`.
- Remove: the slip slides out to the right; rows close; toast offers undo.
- Paper flick / swish / thud sounds, off by default until the first touch, toggle in the top bar.

### Kangaroo doodle

- Every slip carries a kangaroo drawn by the person who added the song. It stands in for an avatar (there are no accounts).
- The pad shows a **fixed base face** (rounded head, two tall ears with filled inner ears, oval snout, small nose; no eyes or mouth). People add eyes, mouth and props with **one ink pen** (≈3px at 56px, round caps). Tools: `한 획 지우기`, `다 지우기`. Six presets if they don't want to draw: 웃음, 윙크, 선글라스, 헤드폰, 졸림, 놀람. Default: 웃음.
- Stored as normalized SVG paths with stroke/point limits. Owners can remove a slip (and its doodle).

## Do's and Don'ts

| Do                                                       | Don't                                                    |
| -------------------------------------------------------- | -------------------------------------------------------- |
| Tell things apart with color, material and markers       | Make titles bigger to create hierarchy                   |
| Let covers show through frost on dividers                | Put control glass inside content or stack glass on glass |
| Keep text on frost at AA contrast (ink, tinted frost)    | Use ink-3 or white text on frost                         |
| Use signal orange only for actions, new things and focus | Decorate with orange                                     |
| Use person colors only for edges, rings and dots         | Use person colors for text                               |
| Keep every slip's doodle and `○○님이 넣음` visible       | Hide who added a song                                    |
| Monospace everywhere, tabular numbers                    | Mix in a proportional display face                       |
