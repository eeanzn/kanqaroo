# Design

| 파일        | 무엇                                                                                                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DESIGN.md` | 디자인 v4 토큰과 규칙 (모노 글꼴 · 식별용 색 · 서리/유리/종이 재질 · 재질별 반경). Stitch에 그대로 가져가는 파일. 형식은 [google-labs-code/design.md](https://github.com/google-labs-code/design.md) (alpha) |

왜 그렇게 정했는지, Stitch 프롬프트, Stitch–Claude–Figma 병행 계획은 Notion [디자인 v4 · 작업 계획](https://app.notion.com/p/3fe0e0600bce814f958debddb9290a11)에 있어요. v3 의뢰서(흑백 · Pretendard · 각진 모서리)는 폐기했어요.

## 원본

- 지금(M0~M1 탐색): 이 폴더의 `DESIGN.md`가 토큰 원본
- 방향이 모인 뒤(M2~): Figma Variables가 원본, `DESIGN.md`는 거기서 동기화

## 명령어

```bash
npx -y @google/design.md lint design/DESIGN.md                          # 규격 검사
npx -y @google/design.md diff old.md design/DESIGN.md                   # 토큰 바뀐 것 비교
npx -y @google/design.md export --format css-tailwind design/DESIGN.md  # Tailwind @theme 변환
```
