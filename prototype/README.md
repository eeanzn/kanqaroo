# Prototype

지금 만드는 것. 한 파일짜리 HTML(`accordion.html`)을 빌드해서 claude.ai Artifact와 GitHub Pages로 올린다.

| 파일             | 무엇                                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `accordion.html` | **원본(v5).** 아코디언 피드, 상세, 곡 넣기(스크린샷 OCR 포함)·순서 바꾸기·좋아요·공유·듣기, 관리 페이지, 컴포넌트 시트(`#components`) |
| `fonts/`         | Pretendard 서브셋(OFL). 빌드할 때 base64로 넣는다                                                                                     |
| `build.py`       | 폰트를 채워 한 파일로 → `dist/kanqaroo-accordion.html` (Artifact용)                                                                   |
| `build_tess.py`  | 스크린샷 곡 읽기용 한글·영어 글자 데이터 → `dist/tess/*.js`                                                                           |
| `build_pages.py` | 완전한 HTML 문서로 감싸 GitHub Pages용 → `dist/pages/`                                                                                |

무엇을 만드는지는 `../PRODUCT.md`, 토큰·컴포넌트는 `../DESIGN.md`, 결정 배경은 Notion Decision Log. 지난 시안(v2 데모, 서류 폴더)은 `../archive/prototype-v2/`.

## 빌드

```bash
python3 prototype/build.py        # Artifact용 한 파일 (약 1.5MB)
python3 prototype/build_tess.py   # OCR 글자 데이터 (한 번만, npm 필요)
python3 prototype/build_pages.py  # GitHub Pages용. dist/pages/index.html을 브라우저로 바로 열어도 된다
```

## 저장

서버가 없다. 플레이리스트·곡·순서·표지·제목·좋아요·이름·화면 모드·소리 설정을 그 브라우저의 localStorage(`kq.*`)에 저장한다. 관리 페이지 설정의 "처음 상태로"를 누르면 예시 데이터로 돌아간다. 공유 링크를 받은 사람에게는 처음 예시 데이터가 보인다.

## 올리기

- **Artifact**: 빌드 결과를 **같은 Artifact URL**(https://claude.ai/artifact/T3CuToCF2UEwHveMEjfQ4j)에 다시 publish한다. `files`로 `tess/kor.js`, `tess/eng.js`를 같이 올린다.
- **GitHub Pages**: main에 `prototype/` 변경이 푸시되면 `.github/workflows/pages.yml`이 빌드해서 https://eeanzn.github.io/kanqaroo/ 에 올린다. 처음 한 번은 저장소 Settings → Pages → Source를 **GitHub Actions**로 바꿔야 한다. 단독 페이지에서는 공유 링크가 그 페이지 주소가 되고, 휴대폰 공유창(다른 앱으로 공유)도 쓸 수 있다.

스크린샷 곡 읽기는 [Tesseract.js](https://github.com/naptha/tesseract.js) 5.1.1(Apache-2.0)을 jsDelivr에서 스크립트로 불러 쓴다. 글자 데이터는 같이 올린 파일에서 꺼내 워커에 넘긴다(Artifact는 다른 사이트로 fetch를 못 해서). Artifact 보안 정책이 WebAssembly를 막으면 "글자를 읽지 못했어요" 안내 후 직접 적기로 돌아간다.

## 주소

`#me` 내 플레이리스트(관리) · `#edit-<id>` 플레이리스트 편집 · `#components` 컴포넌트 시트 · `#<플레이리스트id>`(예: `#p3`) 공유 링크, 그 파일을 바로 연다
