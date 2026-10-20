"""Kanqaroo 로고 파일을 만든다: brand/*.svg (+ PNG는 render_png.mjs).

심볼은 주머니에 뒤집힌 4분음표가 들어가는 모양(프로토타입 헤더 .logo와 같음)이고, 안쪽 선·점은 실제로 뚫린 구멍(mask)이라
어떤 배경에 올려도 된다. 글자는 Pretendard Bold를 윤곽선(path)으로 바꿔서 폰트 없이도 똑같이 보인다.

사용법: pip install fonttools brotli && python3 brand/build_logo.py
"""
import pathlib
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

here = pathlib.Path(__file__).resolve().parent
font = TTFont(here.parent / 'prototype/fonts/Pretendard-Bold.subset.woff2')
upm, cmap, glyphs, hmtx = font['head'].unitsPerEm, font.getBestCmap(), font.getGlyphSet(), font['hmtx']
asc, desc = font['hhea'].ascent, font['hhea'].descent

MARK = '''<mask id="k" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <path d="M6 11c0-2.2 1.8-4 4-4h12c2.2 0 4 1.8 4 4v5c0 6.1-4.9 11-11 11h-.1C9.4 27 6 23.6 6 19.1V11Z" fill="#fff"/>
    <path d="M9 13.5c2.2 1.4 4.5 2 7 2s4.8-.6 7-2" stroke="#000" stroke-width="2" stroke-linecap="round" fill="none"/>
    <ellipse cx="17.6" cy="19.3" rx="2.5" ry="1.95" transform="rotate(-22 17.6 19.3)" fill="#000"/>
    <path d="M15.25 19.7V25.2" stroke="#000" stroke-width="1.7" stroke-linecap="round" fill="none"/>
  </mask>'''


def wordmark(text, size, x0, baseline, tracking=-0.02):
    s, x, out = size / upm, x0, []
    for ch in text:
        name = cmap[ord(ch)]
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(TransformPen(pen, (s, 0, 0, -s, x, baseline)))
        out.append(pen.getCommands())
        x += hmtx[name][0] * s + tracking * size
    return ' '.join(out), x - tracking * size


def svg(w, h, body, color):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:g} {h:g}" width="{w:g}" height="{h:g}" fill="{color}">\n  <title>kanqaroo</title>\n{body}\n</svg>\n'


for name, color in [('black', '#111111'), ('white', '#F5F5F5')]:
    # 심볼만 (32 격자)
    mark = f'  <defs>{MARK}</defs>\n  <rect width="32" height="32" mask="url(#k)"/>'
    (here / f'kanqaroo-mark-{name}.svg').write_text(svg(32, 32, mark, color))
    # 심볼 + 글자: 헤더와 같은 비율 (심볼 28 : 글자 17 : 사이 6) 을 4배로
    k = 4
    m, size, gap = 28 * k, 17 * k, 6 * k
    s = size / upm
    baseline = m / 2 + (asc + desc) / 2 * s  # 헤더처럼 줄 상자를 심볼 가운데에
    d, end = wordmark('kanqaroo', size, m + gap, baseline)
    body = (f'  <defs>{MARK}</defs>\n  <g transform="scale({m / 32:g})"><rect width="32" height="32" mask="url(#k)"/></g>\n'
            f'  <path d="{d}"/>')
    (here / f'kanqaroo-logo-{name}.svg').write_text(svg(round(end + 2), m, body, color))
print('ok')
