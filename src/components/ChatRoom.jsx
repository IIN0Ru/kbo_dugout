import { useEffect, useState } from 'react'
import Ticket from './Ticket.jsx'
import { roomName, sender, introMessage, lockedReply, timeline } from '../landing.js'

// 단계: 0 빈 방 → 1 입력 중 → 2 설명 메시지 → 3 입력 중 → 4 티켓 도착 → 5 입력 중(계속)
// 열 때마다(새로고침 포함) 처음부터 재생. 움직임 줄이기 설정이면 바로 마지막 상태.
const LAST = 5

function useIntroStep() {
  const [step, setStep] = useState(() => {
    if (typeof window === 'undefined') return LAST
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return reduce ? LAST : 0
  })

  useEffect(() => {
    if (step === LAST) return
    const ids = [
      setTimeout(() => setStep(1), timeline.typing1),
      setTimeout(() => setStep(2), timeline.message),
      setTimeout(() => setStep(3), timeline.typing2),
      setTimeout(() => setStep(4), timeline.ticket),
      setTimeout(() => setStep(5), timeline.typing3),
    ]
    return () => ids.forEach(clearTimeout)
    // 처음 한 번만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return step
}

function Typing() {
  return (
    <span className="bubble bubble--typing bubble--in" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  )
}

export default function ChatRoom({ onEnter }) {
  const step = useIntroStep()
  const showSender = step >= 1
  const showMessage = step >= 2
  const showTicket = step >= 4
  const typing = step === 1 || step === 3 || step === 5

  return (
    <section className="room" aria-label="DUGOUT 대화방 미리보기">
      <header className="room__head">
        <span className="room__avatar" aria-hidden="true">D</span>
        <span className="room__name">{roomName}</span>
      </header>

      <div className="room__feed">
        {showSender && (
          <div className="sender bubble--in">
            <span className="sender__avatar" aria-hidden="true">{sender.initial}</span>
            <span className="sender__name">{sender.name}</span>
          </div>
        )}
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
