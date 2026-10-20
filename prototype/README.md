# Prototype (Artifact)

한 파일짜리 HTML을 claude.ai Artifact로 올려서 확인한다.

| 파일             | 무엇                                                                                                                    | Artifact                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `accordion.html` | **지금 기준(v5).** 아코디언 피드, 상세, 곡 넣기·순서 바꾸기·좋아요·공유·듣기, 관리 페이지, 컴포넌트 시트(`#components`) | https://claude.ai/artifact/T3CuToCF2UEwHveMEjfQ4j |
| `folder.html`    | 지난 기록(서류 폴더 시안). 참고하지 않음                                                                                | https://claude.ai/artifact/6y8L3tJJCAzDVU5fpGCUCp |
| `src.html`       | 지난 기록(v2 데모). 참고하지 않음                                                                                       | https://claude.ai/artifact/UZhD2gemzbihsP5vWZM1uU |

무엇을 만드는지는 `PRODUCT.md`, 토큰·컴포넌트는 `DESIGN.md`, 결정 배경은 Notion Decision Log.

## 빌드

```bash
python3 prototype/build.py prototype/accordion.html src/assets/fonts prototype/dist/kanqaroo-accordion.html
python3 prototype/build_tess.py   # 스크린샷 곡 읽기용 한글·영어 글자 데이터 → prototype/dist/tess/*.js (한 번만)
python3 prototype/build_pages.py  # GitHub Pages용 → prototype/dist/pages/ (완전한 HTML 문서 + tess/)
```

Artifact는 외부 폰트를 못 불러와서, `__FONT_400__` 같은 자리표시자를 `src/assets/fonts/`의 Pretendard 서브셋으로 채운다(결과 약 1.4MB). 아이콘은 Phosphor(MIT) Regular 경로를 파일 안에 직접 넣었다.

## 올리기

빌드 결과를 **같은 Artifact URL**에 다시 publish한다 (새로 만들면 링크가 바뀜). `files`로 `tess/kor.js`, `tess/eng.js`를 같이 올린다. 저장소(capabilities)는 쓰지 않고, 좋아요·이름·소리 설정만 브라우저에 기억한다.

스크린샷 곡 읽기는 [Tesseract.js](https://github.com/naptha/tesseract.js) 5.1.1(Apache-2.0)을 jsDelivr에서 스크립트로 불러 쓴다. Artifact는 다른 사이트로 fetch를 못 해서 글자 데이터는 같이 올린 파일에서 꺼내 워커에 넘긴다. Artifact 보안 정책이 WebAssembly를 막으면 "글자를 읽지 못했어요" 안내 후 직접 적기로 돌아간다.

## GitHub Pages 데모

`claude/focused-hypatia-t276sg`(기본 브랜치)에 `prototype/` 변경이 푸시되면 `.github/workflows/pages.yml`이 `build_pages.py`로 빌드해서 https://eeanzn.github.io/kanqaroo/ 에 올린다. 처음 한 번은 저장소 Settings → Pages → Source를 **GitHub Actions**로 바꿔야 한다. 단독 페이지에서는 공유 링크가 그 페이지 주소가 되고, 휴대폰 공유창(다른 앱으로 공유)도 쓸 수 있다.

## 주소

`#me` 내 플레이리스트(관리) · `#edit-<id>` 플레이리스트 편집 · `#components` 컴포넌트 시트 · `#<플레이리스트id>`(예: `#p3`) 공유 링크, 그 파일을 바로 연다

## Stage 2 앱과의 관계

`src/`의 Next.js 앱은 개편 전(v1) 상태로 보류 중. 프로토타입에서 확정된 흐름을 나중에 앱으로 옮긴다.
