// KBO 10개 구단(실제 이름·대표색)과 가상 선수.
// 선수는 실명 없이 '포지션 + 등번호'로만 표시한다. (초상권·퍼블리시티권 문제를 피하기 위함)

export const TEAMS = [
  { id: 'lg', name: 'LG 트윈스', short: 'LG', color: '#C30452' },
  { id: 'hanwha', name: '한화 이글스', short: '한화', color: '#FC4E00' },
  { id: 'ssg', name: 'SSG 랜더스', short: 'SSG', color: '#CE0E2D' },
  { id: 'samsung', name: '삼성 라이온즈', short: '삼성', color: '#074CA1' },
  { id: 'nc', name: 'NC 다이노스', short: 'NC', color: '#315288' },
  { id: 'kt', name: 'KT 위즈', short: 'KT', color: '#2B2B2B' },
  { id: 'lotte', name: '롯데 자이언츠', short: '롯데', color: '#041E42' },
  { id: 'kia', name: 'KIA 타이거즈', short: 'KIA', color: '#EA0029' },
  { id: 'doosan', name: '두산 베어스', short: '두산', color: '#131230' },
  { id: 'kiwoom', name: '키움 히어로즈', short: '키움', color: '#570514' },
]

// 구단마다 가상 선수 3명 (포지션, 등번호)
const ROSTER = {
  lg: [['외야수', 7], ['투수', 17], ['포수', 22]],
  hanwha: [['투수', 1], ['내야수', 5], ['외야수', 25]],
  ssg: [['내야수', 14], ['투수', 29], ['외야수', 8]],
  samsung: [['투수', 18], ['외야수', 33], ['포수', 2]],
  nc: [['내야수', 6], ['투수', 47], ['외야수', 31]],
  kt: [['외야수', 10], ['투수', 52], ['내야수', 4]],
  lotte: [['외야수', 24], ['투수', 21], ['내야수', 9]],
  kia: [['내야수', 3], ['투수', 54], ['외야수', 12]],
  doosan: [['포수', 25], ['투수', 15], ['내야수', 16]],
  kiwoom: [['외야수', 51], ['투수', 40], ['내야수', 13]],
}

export const PLAYERS = TEAMS.flatMap((t) =>
  ROSTER[t.id].map(([pos, no]) => ({
    id: `${t.id}-${no}`,
    teamId: t.id,
    pos,
    no,
    label: `${pos} #${no}`,
  })),
)

export const teamById = (id) => TEAMS.find((t) => t.id === id)
export const playerById = (id) => PLAYERS.find((p) => p.id === id)
export const playersOfTeam = (teamId) => PLAYERS.filter((p) => p.teamId === teamId)

// 기본(예시) 메시지. 저장소와 상관없이 항상 보인다.
// createdAt은 고정 시각(ms). 실시간 메시지가 오면 그 뒤로 쌓인다.
const T0 = Date.UTC(2026, 9, 27, 12, 40) // 2026-10-27 21:40 KST
export const SEED_MESSAGES = [
  { id: 'seed-lg-7-1', playerId: 'lg-7', text: '오늘 응원 소리 덕아웃까지 다 들렸어요. 내일도 잠실에서 봬요!', createdAt: T0 },
  { id: 'seed-lg-17-1', playerId: 'lg-17', text: '다음 홈경기 응원 문구, 여러분이 정해 주세요!', createdAt: T0 + 60_000 },
  { id: 'seed-hanwha-1-1', playerId: 'hanwha-1', text: '비 와서 경기 취소됐네요. 다들 조심히 들어가세요.', createdAt: T0 + 120_000 },
  { id: 'seed-kia-3-1', playerId: 'kia-3', text: '오늘 수비 실책 하나, 내일 꼭 갚을게요.', createdAt: T0 + 180_000 },
  { id: 'seed-doosan-25-1', playerId: 'doosan-25', text: '포수 마스크 새로 바꿨어요. 잘 보이시나요?', createdAt: T0 + 240_000 },
  { id: 'seed-lotte-24-1', playerId: 'lotte-24', text: '사직 원정 응원 오신 분들 감사합니다. 목소리 크게 들렸어요!', createdAt: T0 + 300_000 },
]

// 쉬는 중 표시(시즌 모드). 메시지 없이 경기 기록 카드만 보여 준다.
export const RESTING = {
  'samsung-2': { note: '부상 회복 중 · 메시지 쉬는 중', card: '최근 5경기 · 타율 .312 · 2홈런' },
  'nc-47': { note: '선발 등판 준비 · 메시지 쉬는 중', card: '최근 등판 · 6이닝 2실점 7탈삼진' },
}
