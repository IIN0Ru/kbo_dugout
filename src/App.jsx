import { useEffect, useRef, useState } from 'react'
import ChatRoom from './components/ChatRoom.jsx'

// 티켓 '입장'이 첫 화면의 유일한 버튼이다. 누르면 로그인/회원가입 화면으로 간다.
// 그 화면은 다음 단계에서 react-router로 연결하고, 지금은 안내만 짧게 띄운다.
const NEXT_NOTICE = '로그인·회원가입 화면은 다음 단계에서 만들어요'

export default function App() {
  const [notice, setNotice] = useState('')
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  const enter = () => {
    setNotice(NEXT_NOTICE)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setNotice(''), 2600)
  }

  return (
    <div className="stage">
      <main className="landing">
        <h1 className="logo">DUGOUT</h1>
        <div className="landing__row">
          <div className="landing__room">
            <ChatRoom onEnter={enter} />
          </div>
        </div>
      </main>
      <p className="notice" role="status" aria-live="polite">
        {notice && <span>{notice}</span>}
      </p>
    </div>
  )
}
