import { useEffect, useState } from 'react'
import Ticket from './Ticket.jsx'
import { roomName, introMessage, lockedReply, timeline } from '../landing.js'

const SEEN_KEY = 'dugout:intro-seen'

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}
function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* 저장이 막힌 환경에서는 매번 연출을 보여준다 */
  }
}

// 단계: 0 빈 방 → 1 입력 중 → 2 설명 메시지 → 3 입력 중 → 4 티켓 도착(정지)
function useIntroStep() {
  const [step, setStep] = useState(() => {
    if (typeof window === 'undefined') return 4
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return reduce || readSeen() ? 4 : 0
  })

  useEffect(() => {
    if (step === 4) return
    const ids = [
      setTimeout(() => setStep(1), timeline.typing1),
      setTimeout(() => setStep(2), timeline.message),
      setTimeout(() => setStep(3), timeline.typing2),
      setTimeout(() => {
        setStep(4)
        markSeen()
      }, timeline.ticket),
    ]
    return () => ids.forEach(clearTimeout)
    // 처음 한 번만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return step
}

function Typing() {
  return (
    <span className="bubble bubble--typing" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  )
}

export default function ChatRoom({ onEnter }) {
  const step = useIntroStep()
  const showMessage = step >= 2
  const showTicket = step >= 4
  const typing = step === 1 || step === 3

  return (
    <section className="room" aria-label="DUGOUT 대화방 미리보기">
      <header className="room__head">
        <span className="room__avatar" aria-hidden="true">D</span>
        <span className="room__name">{roomName}</span>
      </header>

      <div className="room__feed">
        {showMessage && (
          <p className="bubble bubble--in">
            {introMessage[0]}
            <br />
            {introMessage[1]}
          </p>
        )}
        {showTicket && (
          <div className="room__ticket bubble--in">
            <div className="room__ticket-shell">
              <Ticket onEnter={onEnter} />
            </div>
          </div>
        )}
        {typing && <Typing />}
      </div>

      <p className="room__locked">
        <svg className="room__lock" viewBox="0 0 16 16" aria-hidden="true">
          <rect x="3" y="7" width="10" height="7" rx="1" />
          <path d="M5 7V5a3 3 0 0 1 6 0v2" />
        </svg>
        {lockedReply}
      </p>
    </section>
  )
}
