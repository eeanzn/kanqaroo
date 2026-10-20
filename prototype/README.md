# Prototype (Artifact)

한 파일짜리 HTML을 claude.ai Artifact로 올려서 확인한다.

| 파일             | 무엇                                                                                                         | Artifact                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| `folder.html`    | 기능 흐름 기준 시안. 둘러보기·자리 골라 넣기·활동·공유. 프런트만, 예시 데이터                                | https://claude.ai/artifact/6y8L3tJJCAzDVU5fpGCUCp |
| `accordion.html` | **지금 기준 탐색 인터랙션.** 아코디언 파일철 (소리 있음). 시각은 v3(흑백 · Pretendard)이라 v4 재질 적용 예정 | https://claude.ai/artifact/T3CuToCF2UEwHveMEjfQ4j |
| `src.html`       | v2 데모. Artifact 공유 저장소로 실제 저장됨 (공개 링크에선 주인만 쓰기). 색·버튼 토큰 원본                   | https://claude.ai/artifact/UZhD2gemzbihsP5vWZM1uU |

결정 배경은 Notion Decision Log, 디자인 시스템은 `design/DESIGN.md`, Stitch 프롬프트와 작업 계획은 Notion 디자인 v4.

## 빌드

```bash
python3 prototype/build.py   # v2 데모 → prototype/dist/kanqaroo-demo.html (폰트 포함 약 1.4MB)
python3 prototype/build.py prototype/folder.html src/assets/fonts prototype/dist/kanqaroo-folder.html  # 폴더 시안
python3 prototype/build.py prototype/accordion.html src/assets/fonts prototype/dist/kanqaroo-accordion.html  # 아코디언 실험
```

Artifact는 외부 폰트를 못 불러와서, `src.html`의 `__FONT_400__` 같은 자리표시자를 `src/assets/fonts/`의 Pretendard 서브셋으로 채운다.

## 올리기

빌드 결과를 **같은 Artifact URL**에 다시 publish한다 (새로 만들면 링크가 바뀜). v2 데모만 capabilities `db`(플레이리스트·노래 저장)와 `sample`(스크린샷 읽기)를 쓰고, 폴더 시안은 아무것도 안 써요.

## Stage 2 앱과의 관계

`src/`의 Next.js 앱은 개편 전(v1: 보드·군집·주머니·반응·영수증) 상태로 보류 중. 프로토타입에서 확정된 흐름을 나중에 앱으로 옮긴다.
