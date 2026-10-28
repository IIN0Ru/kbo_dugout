// 아주 단순한 금칙어 필터 (시연용).
// 공백·기호를 지운 뒤 목록에 있는 말이 들어 있으면 '숨김' 처리한다.
// 실서비스에서는 금칙어 + AI 유해성 판별 + 사람 검토를 함께 쓴다.

const WORDS = [
  '시발', '씨발', '씨빨', 'ㅅㅂ', 'ㅆㅂ', '병신', 'ㅂㅅ', '븅신', '개새', '새끼', 'ㅅㄲ',
  '좆', '존나', 'ㅈㄴ', '닥쳐', '꺼져', '지랄', 'ㅈㄹ', '엿먹', '느금', '니애미', '애미', '애비',
  '뒤져', '죽어라', '죽여', '은퇴해', '방출', '쓰레기', '먹튀',
  'fuck', 'shit', 'bitch',
]

const normalize = (s) => s.toLowerCase().replace(/[\s.,!?~*^_\-+=/\\|'"`:;()[\]{}<>@#$%&0-9]/g, '')

export function isBlocked(text) {
  const n = normalize(text)
  return WORDS.some((w) => n.includes(w))
}

export const REPLY_MAX_LEN = 100
export const REPLIES_PER_MESSAGE = 3
