# Prototype (Artifact)

지금 단계의 작업 기준. 한 파일짜리 HTML을 claude.ai Artifact로 올려서 테스트한다.

- 데모: https://claude.ai/artifact/UZhD2gemzbihsP5vWZM1uU
- 원본: `src.html` (화면·문구·디자인 토큰·버튼 규격이 전부 여기 있음)
- 결정 배경: Notion Decision Log, 03 Design

## 빌드

```bash
python3 prototype/build.py   # → prototype/dist/kanqaroo-demo.html (폰트 포함 약 1.4MB)
```

Artifact는 외부 폰트를 못 불러와서, `src.html`의 `__FONT_400__` 같은 자리표시자를 `src/assets/fonts/`의 Pretendard 서브셋으로 채운다.

## 올리기

빌드 결과를 **같은 Artifact URL**에 다시 publish한다 (새로 만들면 링크가 바뀜). capabilities는 `db`(플레이리스트·노래 저장)와 `sample`(스크린샷 읽기).

## Stage 2 앱과의 관계

`src/`의 Next.js 앱은 개편 전(v1: 보드·군집·주머니·반응·영수증) 상태로 보류 중. 프로토타입에서 확정된 흐름을 나중에 앱으로 옮긴다.
