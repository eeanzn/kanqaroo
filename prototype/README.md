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
```

Artifact는 외부 폰트를 못 불러와서, `__FONT_400__` 같은 자리표시자를 `src/assets/fonts/`의 Pretendard 서브셋으로 채운다(결과 약 1.4MB). 아이콘은 Phosphor(MIT) Regular 경로를 파일 안에 직접 넣었다.

## 올리기

빌드 결과를 **같은 Artifact URL**에 다시 publish한다 (새로 만들면 링크가 바뀜). 저장소(capabilities)는 쓰지 않고, 좋아요·이름·소리 설정만 브라우저에 기억한다.

## 주소

`#me` 내 플레이리스트(관리) · `#edit-<id>` 플레이리스트 편집 · `#components` 컴포넌트 시트

## Stage 2 앱과의 관계

`src/`의 Next.js 앱은 개편 전(v1) 상태로 보류 중. 프로토타입에서 확정된 흐름을 나중에 앱으로 옮긴다.
