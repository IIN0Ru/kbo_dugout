# DUGOUT 앱 프로토타입

KBO 선수의 메시지를 **구독한 팬 모두가 똑같이 받는(1:N)** 공식 채널 앱의 시연용 프로토타입입니다.
경기대학교 캡스톤 디자인 발표에서 청중이 링크로 들어와 직접 둘러보고 답장을 보내 볼 수 있게 만들었습니다.
구단 이름과 색은 실제 KBO 구단을 쓰고, 선수는 실명 없이 '포지션 + 등번호'로만 표시한 가상 인물입니다.

- 사이트: https://iin0ru.github.io/kbo_dugout/
- 발표자 화면: https://iin0ru.github.io/kbo_dugout/#/bench
- 이전 버전(웹 소개 페이지, 채팅방·입장권 컨셉)은 팀 회의 결과 폐기하고 [`web-v1-failed`](https://github.com/IIN0Ru/kbo_dugout/tree/web-v1-failed) 브랜치에 '실패한 개발' 기록으로 남겨 두었습니다.

## 화면

| 주소 | 누구 | 내용 |
| --- | --- | --- |
| `#/` | 청중 | 첫 화면 (등번호 모자이크 + 선수 말풍선 + 로그인하기) |
| `#/login` | 청중 | 닉네임 + 응원 구단 (개인정보 없음) |
| `#/plan` | 청중 | 구독 플랜 (무료 / 멤버십, 결제 없는 목업) |
| `#/home` | 청중 | 선수 목록, `?tab=picks`는 공개 픽 피드 |
| `#/channel/:playerId` | 청중 | 선수 채널 — 메시지 보기, 답장(메시지당 3회, 100자), 금칙어 필터 |
| `#/me` | 청중 | 마이페이지 — 닉네임·응원 구단·구독 관리·로그아웃 |
| `#/bench` | 발표자 | 선수 화면 — 전체 발송, 답장 목록, ❤️, 공개 픽 (로그인 없음, 주소를 공개하지 않음) |

## 동작 모드

- **로컬 모드** (`src/data/config.js`의 `firebaseConfig`가 비어 있을 때): 같은 브라우저의 탭끼리만 데이터가 공유됩니다.
- **Firebase 모드** (설정값을 넣었을 때): 청중 전원이 실시간으로 같은 데이터를 봅니다.

## Firebase 설정

1. Firestore Database 생성 (서울 `asia-northeast3`, 프로덕션 모드)
2. Authentication → 로그인 방법에서 **익명** 사용 설정
3. Firestore → 규칙 탭에 `firestore.rules` 내용을 붙여 넣고 게시
4. 프로젝트 설정의 `firebaseConfig` 값을 `src/data/config.js`에 붙여 넣기

## 실행 · 배포

```bash
npm install
npm run dev      # 개발 서버
npm run build    # dist/ 빌드
```

`main` 브랜치에 올리면 GitHub Actions가 GitHub Pages로 자동 배포합니다.
(저장소 Settings → Pages → Source를 **GitHub Actions**로 한 번 설정)
