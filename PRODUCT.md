# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Owners**: Korean people in their 20s who make playlists and share them with friends over Instagram stories and KakaoTalk. They want friends to put songs in, and they want to see who did it.
- **Friends (visitors)**: open an owner's link, browse, and slip one song into a playlist for that person. No account, a minute or two.
- Anyone can also browse public playlists of strangers for discovery, the way they scroll a feed.

## Product Purpose

Streaming algorithms keep recommending more of the same. Kanqaroo replaces the algorithm with people: a friend who knows you tucks a song into your playlist, at the exact spot they think it belongs. Success means an owner gets songs that are both "exactly my taste" and "something I would never have found", and wants to share the link again.

## Positioning

Not a recommendation engine and not a chat. The act is 소매넣기: quietly slipping something into someone's pocket. A friend picks the position between two songs and signs with a hand-drawn kangaroo face. The playlist becomes a record of who gave what.

## Operating Context

- Delivered as a website, but it must feel like an app: a phone app on mobile (one hand, thumb reach, bottom actions, sheets) and a tablet or desktop app on iPad and laptops (it uses the extra width; not a stretched phone and not a web page).
- People usually arrive from a link inside Instagram or KakaoTalk, often in an in-app browser.
- Browsing many playlists should feel like flicking through a social feed. Working metaphor: an accordion file folder where each playlist is a divider you flip forward and pull out to read. The metaphor is the interaction idea; its visual form is open.
- Songs play on YouTube (opened externally for now; an embedded player later). Audio is never hosted.

## Capabilities and Constraints

Confirmed features:

1. **둘러보기**: flick through playlists. Each shows its title, owner ("○○님의 플레이리스트"), song and slip counts, album covers, the kangaroos of friends who slipped songs in, and whether something is new.
2. **Open a playlist**: songs in order. Friends' songs look clearly different from the owner's, each marked with who added it ("민지님이 넣음") and their kangaroo.
3. **쪽지 넣기**: choose the exact spot (between any two songs, top or bottom), write title, artist, optional YouTube link and own name, draw a kangaroo face on a fixed base face (no eyes or mouth; one pen; undo stroke; clear; six presets 웃음, 윙크, 선글라스, 헤드폰, 졸림, 놀람), then 쏙 넣기. It goes in right away; no approval.
4. **내 파일철**: the owner's playlists, which have new slips, visibility (공개 / 링크 있는 사람만), and creating a new one.
5. **Manage a playlist**: 목록 with 빼기 and immediate 되돌리기; 활동 (who added what, at which position, when); 공유 (copy 추가 링크, Instagram story, X, visibility, the private 관리 링크).
6. **New playlist**: name, owner name, songs typed one per line or imported from a screenshot (on-device text recognition with progress, and "확인해 주세요" on uncertain rows).
7. **Other states**: embedded player (later; the video stays visible, at least 200px tall), empty playlist, playlist not found.

Constraints:

- No accounts or login. The owner keeps a 관리 링크; friends get an 추가 링크.
- No onboarding or tutorial screens. The first screen is 둘러보기.
- No likes, reactions, comments or approvals.
- MVP is front end only, with sample data. No backend yet.
- Product words: 둘러보기, 내 파일철, 쪽지 넣기, 여기에 끼우기, 쏙 넣기, 다시 꽂기, 빼기, 되돌리기, 활동, 공유, 추가 링크, 관리 링크, 내 캥거루. Never: 로그인, 회원가입, 영수증, 주머니, 보드, 반응, 수락, 거절.
- Open decision: whether anyone can add to a public playlist or only people with the link (currently anyone).

## Brand Commitments

- Name: kanqaroo. The kangaroo pouch and the hand-drawn kangaroo faces are the identity.
- Voice: Korean polite casual (해요체), short and warm. People are addressed as "○○님".
- Spacing, sizing and type scale follow the proportions of the Toss Design System (TDS): its proportions only, not its colors, component looks or visual language. The numbers are in `design/STITCH.md`.
- It must not look AI-generated: no purple or blue gradients or gradient blobs, no glass effects on everything, no em dashes, no grids of icon cards, no decorative terminal symbols, no bouncy motion everywhere.

## Evidence on Hand

- Sample content (playlists, owners, friends' slips): `design/STITCH.md`.
- Interaction prototypes: `prototype/accordion.html` (flipping through playlists) and `prototype/folder.html` (feature flow). They show behavior, not a visual direction; do not copy their look.
- There are no real users, testimonials, metrics or rights to album artwork. Use labeled placeholders for covers, and never invent numbers or quotes.

## Product Principles

1. People over algorithms: every song shows who gave it.
2. One gesture, one meaning: flip to browse, pull out to read, slip in to give.
3. Giving a song takes under a minute and needs no account.
4. The owner stays in control without gatekeeping: no approval step, but they can always see and undo.
5. Album covers and friends' kangaroos are the content people care about.

## Accessibility & Inclusion

WCAG 2.1 AA. Touch targets at least 44px. Body text readable at phone size and following the system text size. Never rely on color alone (friends are identified by their kangaroo and name too). Respect reduced motion (flipping needs a non-3D fallback). Works inside Instagram and KakaoTalk in-app browsers.
