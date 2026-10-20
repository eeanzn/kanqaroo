# Kanqaroo 🦘

> 알고리즘이 아닌 내 친구가, 혹은 모르는 누군가가 골라주는 노래.

플레이리스트를 자랑하고, 남의 플레이리스트에 몰래 곡을 넣거나 순서를 바꾸는 웹 서비스예요. 손님은 아코디언 파일처럼 넘기는 피드에서 남의 플레이리스트를 디깅하고, 주인은 손님이 바꿔 놓은 플레이리스트에서 새 곡을 다시 찾아요.

지금은 **UI 단계**라 프런트만 있어요. 바꾼 내용은 각자의 기기에만 저장돼요.

- 데모: https://eeanzn.github.io/kanqaroo/
- 기획·결정 기록: [Notion · Kanqaroo](https://app.notion.com/p/damhong/Kanqaroo-3f20e0600bce810296edc52af16b4c3a)

## 폴더

| 경로                          | 무엇                                                     |
| ----------------------------- | -------------------------------------------------------- |
| `prototype/`                  | 지금 만드는 것. 아코디언 피드 프로토타입과 빌드 스크립트 |
| `PRODUCT.md`                  | 무엇을 만드는지 (사용자·기능·제약)                       |
| `DESIGN.md`                   | 디자인 시스템 (토큰·컴포넌트·화면 구성)                  |
| `archive/`                    | 지금은 안 쓰는 것: Stage 2 Next.js 앱(v1), 지난 시안     |
| `.github/workflows/pages.yml` | 데모 자동 배포 (main에 `prototype/`이 바뀌면)            |
| `.claude/`                    | 디자인 점검 스킬(impeccable)                             |

## 데모 빌드

```bash
python3 prototype/build_pages.py   # → prototype/dist/pages/index.html (브라우저로 바로 열어도 돼요)
```
