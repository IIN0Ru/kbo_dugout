import { useEffect, useRef, useState } from 'react'
import ChatRoom from './components/ChatRoom.jsx'

// 로그인(티켓 확인)·회원가입(티켓 발권) 페이지는 다음 단계에서 react-router로 연결한다.
// 지금은 어디로 갈지만 짧게 알려준다.
const NEXT = {
  login: '티켓 확인(로그인) 화면은 다음 단계에서 만들어요',
  signup: '티켓 발권(회원가입) 화면은 다음 단계에서 만들어요',
}

export default function App() {
  const [notice, setNotice] = useState('')
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  const go = (where) => {
    setNotice(NEXT[where])
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setNotice(''), 2600)
  }

  return (
    <div className="stage">
      <main className="landing">
        <h1 className="logo">DUGOUT</h1>
        <div className="landing__row">
          <div className="landing__room">
            <ChatRoom onEnter={() => go('login')} />
          </div>
          <button type="button" className="btn-issue" onClick={() => go('signup')}>
            <span>티켓 발권</span>
          </button>
        </div>
      </main>
      <p className="notice" role="status" aria-live="polite">
        {notice && <span>{notice}</span>}
      </p>
    </div>
  )
}
