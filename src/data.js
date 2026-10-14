// 발표용 더미 데이터. 로그인·DB 연결 단계에서 API 응답으로 교체한다.

// 전광판 라인스코어 (1~9회, R = 총점)
export const lineScore = {
  away: { label: '원정', runs: [0, 1, 0, 0, 2, 0, 0, 0, 0] },
  home: { label: '홈', runs: [0, 0, 2, 0, 0, 0, 0, 1, 1] },
  count: { ball: 2, strike: 1, out: 2 },
  note: '끝내기!',
}

export const featuredPlayer = {
  number: 27,
  position: '투수',
  unread: 3,
}

export const fanThread = [
  { from: 'player', text: '오늘 끝내기 봤어요? 저도 아직 손 떨려요' },
  { from: 'player', text: '다들 조심히 들어가요' },
  { from: 'fan', text: '직관 왔어요! 최고였어요' },
]

export const playerInbox = {
  total: 12480,
  replies: [
    { nick: '야구가좋아', text: '직관 왔어요! 최고였어요', tone: 'pink' },
    { nick: '7회의기적', text: '푹 쉬세요!', tone: 'lilac' },
    { nick: '외야3루석', text: '끝내기 순간 소리 질렀어요', tone: 'pink' },
  ],
}

export const benefits = [
  { title: '경기 직후', body: '가장 생생한 순간에 받는 메시지', tone: 'pink' },
  { title: '닿는 응원', body: '내 답장이 선수 목록에 그대로', tone: 'lilac' },
  { title: '시즌 아카이브', body: '한 시즌의 대화를 모아 다시 보기', tone: 'ink' },
]

export const teams = ['LG', '두산', 'KIA', '삼성', '롯데', '한화', 'SSG', 'NC', 'KT', '키움']
