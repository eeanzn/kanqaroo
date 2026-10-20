# Design

| 파일            | 무엇                                                                                                                                                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DESIGN.md`     | 디자인 v4.1 토큰과 규칙 (클리어 슬리브 + 종이 라벨 · 유리는 상단 바만 · 모노 글꼴 · 주황 강조 하나 · 반경 4/12/알약). Stitch에 그대로 가져가는 파일. 형식은 [google-labs-code/design.md](https://github.com/google-labs-code/design.md) (alpha) |
| `specimen.html` | 디자인 시트. 같은 두 화면을 v4 ↔ v4.1로 바꿔 보고, AI스러운 신호(유리 수, 한쪽 굵은 테두리, 엠대시, 16px 미만 본문, 반경)를 페이지가 직접 세요. DESIGN.md의 뷰일 뿐 원본 아님. [Artifact](https://claude.ai/artifact/KoLb2Wj4irigtBzgvdj8GQ)    |

왜 그렇게 정했는지, Stitch 프롬프트, Stitch–Claude–Figma 병행 계획은 Notion [디자인 v4 · 작업 계획](https://app.notion.com/p/3fe0e0600bce814f958debddb9290a11)에 있어요. v3 의뢰서(흑백 · Pretendard · 각진 모서리)는 폐기했어요. v4.1에서 무엇을 왜 걷어냈는지는 같은 곳의 '5 · AI스러움 점검'.

## 원본

- 지금(M0~M1 탐색): 이 폴더의 `DESIGN.md`가 토큰 원본
- 방향이 모인 뒤(M2~): Figma Variables가 원본, `DESIGN.md`는 거기서 동기화

## 명령어

```bash
npx -y @google/design.md lint design/DESIGN.md                          # 규격 검사
npx -y @google/design.md diff old.md design/DESIGN.md                   # 토큰 바뀐 것 비교
npx -y @google/design.md export --format css-tailwind design/DESIGN.md  # Tailwind @theme 변환
```

`specimen.html`은 빌드 없이 그대로 Artifact에 올려요(같은 URL에 다시 publish). DESIGN.md를 바꾸면 시트도 같이 맞춰요.
