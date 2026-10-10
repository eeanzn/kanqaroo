"""prototype/src.html의 폰트 자리표시자(__FONT_400__ 등)를 Pretendard woff2(base64)로 채워
한 파일짜리 HTML을 만든다. Artifact는 외부 폰트를 못 불러와서 이렇게 넣는다.

사용법: python3 prototype/build.py [src] [fonts_dir] [out]
"""
import base64, sys, pathlib

here = pathlib.Path(__file__).resolve().parent
src_path = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else here / 'src.html'
fonts = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else here.parent / 'src/assets/fonts'
out = pathlib.Path(sys.argv[3]) if len(sys.argv) > 3 else here / 'dist/kanqaroo-demo.html'

src = src_path.read_text()
for weight, name in [('400', 'Regular'), ('600', 'SemiBold'), ('700', 'Bold'), ('800', 'ExtraBold')]:
    data = base64.b64encode((fonts / f'Pretendard-{name}.subset.woff2').read_bytes()).decode()
    src = src.replace(f'__FONT_{weight}__', data)
assert '__FONT_' not in src
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(src)
print(out, round(len(src.encode()) / 1024 / 1024, 2), 'MB')
