"""스크린샷 곡 읽기(Tesseract.js)에 쓰는 한글·영어 글자 데이터를 Artifact에 같이 올릴 파일로 만든다.

Artifact는 다른 사이트로 fetch를 못 해서, npm의 @tesseract.js-data(Apache-2.0)에서
4.0.0_best_int 데이터를 꺼내 base64 스크립트(prototype/dist/tess/<lang>.js)로 바꿔 둔다.
페이지는 이 파일을 <script>로 불러 워커에 바로 넘긴다.

사용법: python3 prototype/build_tess.py
"""
import base64, pathlib, subprocess, tarfile, tempfile

out = pathlib.Path(__file__).resolve().parent / 'dist/tess'
out.mkdir(parents=True, exist_ok=True)
with tempfile.TemporaryDirectory() as tmp:
    for lang in ['kor', 'eng']:
        name = subprocess.run(['npm', 'pack', f'@tesseract.js-data/{lang}@1.0.0', '--pack-destination', tmp, '--silent'],
                              check=True, capture_output=True, text=True).stdout.strip().splitlines()[-1]
        with tarfile.open(pathlib.Path(tmp) / name) as tar:
            data = tar.extractfile(f'package/4.0.0_best_int/{lang}.traineddata.gz').read()
        js = f'(window.KQ_LANG = window.KQ_LANG || {{}}).{lang} = "{base64.b64encode(data).decode()}"\n'
        (out / f'{lang}.js').write_text(js)
        print(out / f'{lang}.js', round(len(js) / 1024 / 1024, 2), 'MB')
