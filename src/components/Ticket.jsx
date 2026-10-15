import { useEffect, useRef, useState } from 'react'
import { ticket, tearNavigateAt } from '../landing.js'

// 채팅방 밖으로 튀어나온 입장권. 오른쪽 '입장' 꼬리가 로그인 버튼이다.
// 마우스·키보드 포커스: 반쯤 찢어짐 / 클릭: 완전히 찢어진 뒤 onEnter 실행
export default function Ticket({ onEnter }) {
  const [torn, setTorn] = useState(false)
  const timer = useRef(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  // 다른 화면에서 뒤로 돌아왔을 때 티켓이 다시 붙어 있게
  useEffect(() => {
    const reset = () => setTorn(false)
    window.addEventListener('pageshow', reset)
    return () => window.removeEventListener('pageshow', reset)
  }, [])

  const enter = () => {
    if (torn) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      onEnter()
      return
    }
    setTorn(true)
    timer.current = setTimeout(() => {
      onEnter()
      // 아직 다음 화면이 없으므로 잠시 뒤 다시 붙여 둔다
      timer.current = setTimeout(() => setTorn(false), 1400)
    }, tearNavigateAt)
  }

  return (
    <div className="ticket">
      <div className="ticket__body">
        <span className="ticket__label">{ticket.label}</span>
        <span className="ticket__seat">{ticket.seat}</span>
        <span className="ticket__title">{ticket.title}</span>
      </div>
      <button
        type="button"
        className={`ticket__stub ${torn ? 'is-torn' : ''}`}
        onClick={enter}
        aria-label="티켓을 뜯고 입장하기 (로그인·회원가입)"
      >
        {ticket.stub}
      </button>
    </div>
  )
}
