"""GitHub Pages용 데모를 만든다: prototype/dist/pages/ (index.html + tess/ + lab/ + .nojekyll).

Artifact는 문서 뼈대(doctype·head·charset·viewport)를 대신 씌워 주지만 GitHub Pages는 그렇지 않아서,
빌드한 프로토타입을 완전한 HTML 문서로 감싼다. OCR 글자 데이터(tess/)도 같이 둔다.

사용법: python3 prototype/build_pages.py   (CI: .github/workflows/pages.yml)
"""
import pathlib, shutil, subprocess, sys

here = pathlib.Path(__file__).resolve().parent
dist = here / 'dist'
pages = dist / 'pages'
built = dist / 'kanqaroo-accordion.html'

subprocess.run([sys.executable, str(here / 'build.py'), str(here / 'accordion.html'), str(here / 'fonts'), str(built)], check=True)
if not all((dist / 'tess' / f).exists() for f in ['kor.js', 'eng.js']):
    subprocess.run([sys.executable, str(here / 'build_tess.py')], check=True)

src = built.read_text()
cut = src.index('</style>') + len('</style>')
head = src[:cut].replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
desc = '플레이리스트를 자랑하고, 남의 플레이리스트에 몰래 곡을 넣거나 순서를 바꾸는 곳. 아코디언 파일로 넘겨 봐요.'
doc = f"""<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="{desc}">
<meta property="og:title" content="Kanqaroo">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
{head}
</head>
<body>{src[cut:]}
</body>
</html>
"""

if pages.exists():
    shutil.rmtree(pages)
(pages / 'tess').mkdir(parents=True)
(pages / 'index.html').write_text(doc)
for f in ['kor.js', 'eng.js']:
    shutil.copy(dist / 'tess' / f, pages / 'tess' / f)
shutil.copytree(here / 'lab', pages / 'lab')  # 기기에서만 확인할 수 있는 실험 페이지 (예: lab/bars.html)
(pages / '.nojekyll').write_text('')
print(pages, round(sum(f.stat().st_size for f in pages.rglob('*') if f.is_file()) / 1024 / 1024, 2), 'MB')
