// 금칙어 필터 (시연용).
// 목록은 badwords.txt 한 파일에서 관리한다. 팀원은 그 파일에 단어만 추가하면 된다.
// 1차: 보내기 전에 이 필터로 막는다 (서버에 저장되지 않음).
// 2차: 필터를 피해 간 답장은 발표자 화면(#/bench)의 '답장 관리' 탭에서 사람이 삭제하고 경고를 보낸다.
import RAW from './badwords.txt?raw'

// 비교 전에 지우는 것: 공백, 숫자, 특수문자, 이모지 (한글·한글 자모·영문만 남김)
// → 'ㅅ.ㅂ' → 'ㅅㅂ', '시1발' → '시발', 'f*u c k' → 'fuck'
export const normalize = (s) =>
  String(s)
    .normalize('NFC')
    .toLowerCase()
    .replace(/[^a-z가-힣ㄱ-ㅎㅏ-ㅣ]/g, '')

const LINES = RAW.split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))

// 금칙어 목록
export const WORDS = [...new Set(LINES.filter((l) => !l.startsWith('!')).map(normalize).filter(Boolean))]
// 예외 목록 (! 로 시작하는 줄): 비교 전에 문장에서 먼저 지운다 → '새끼손가락'은 통과
const ALLOW = [...new Set(LINES.filter((l) => l.startsWith('!')).map((l) => normalize(l.slice(1))).filter(Boolean))]
  .sort((a, b) => b.length - a.length)

// 같은 글자를 겹쳐 쓴 것도 잡는다: 'ㅅㅅㅅㅂㅂ', '씨씨발' → 겹친 글자를 하나로 줄여서 한 번 더 본다
const squeeze = (s) => s.replace(/(.)\1+/g, '$1')

// 걸린 금칙어를 돌려준다 (없으면 null)
export function findBadWord(text) {
  let n = normalize(text)
  for (const a of ALLOW) n = n.split(a).join(' ')
  if (!n.trim()) return null
  const sq = squeeze(n)
  return WORDS.find((w) => n.includes(w) || sq.includes(squeeze(w))) || null
}

export const isBlocked = (text) => findBadWord(text) !== null

export const REPLY_MAX_LEN = 100
export const REPLIES_PER_MESSAGE = 3

// 관리자가 삭제할 때 고르는 사유
export const REMOVE_REASONS = ['욕설·비속어', '선수·팬 비하', '도배·광고', '기타 부적절한 내용']
