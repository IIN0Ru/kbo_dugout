# DUGOUT

야구 선수와 팬이 1:1 대화처럼 소통하는 버블형 서비스의 웹 프로토타입입니다.
경기대학교 캡스톤 디자인 발표용 목업이며, 실제 구단·선수와 무관합니다.

## 현재 범위

- 소개 페이지: 전광판 라인스코어, 유니폼 줄무늬 히어로, 기획 배경, 주요 기능(팬·선수 화면 미리보기), 팬이 얻는 것, 참여 구단, 푸터
- 데이터는 모두 `src/data.js`의 더미 데이터 (로그인·DB 연결 단계에서 교체 예정)

## 실행

```bash
npm install
npm run dev              # 개발 서버
npm run build            # 일반 배포용 빌드 (dist/)
npm run build:artifact   # Claude 공유 링크용 단일 HTML (artifact/dugout.html)
```

## 구조

```
src/
  data.js                 더미 데이터
  styles.css              디자인 토큰과 전체 스타일
  App.jsx                 페이지 조립
  components/
    Scoreboard.jsx        전광판 (라인스코어 + B·S·O)
    Hero.jsx              히어로 (포토카드 + CTA)
    Sections.jsx          기획 배경 / 주요 기능 / 팬이 얻는 것 / 참여 구단
    Reveal.jsx            스크롤 등장 모션 (절제형)
```

## 디자인 기준

| 항목 | 값 |
| --- | --- |
| 바탕 | 오프화이트 `#FDFBF6` |
| 줄무늬 | 빨강 7px · 간격 48px · 진하기 85% |
| 메인 빨강 | `#B3202A` |
| 전광판 | 검정 `#141414` + LED 노랑 `#F5C400` |
| 글꼴 | IBM Plex Sans KR / IBM Plex Mono |

## 다음 단계

1. 로그인 / 회원가입 (팬·선수 계정 선택)
2. 구독 선수 목록
3. 팬 시점 대화방
4. 선수 시점 화면 (전체 발송 + 답장 목록)
5. 구단 색 전환 (로그인 이후 화면에서)
