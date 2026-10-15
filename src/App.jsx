import ChatRoom from './components/ChatRoom.jsx'

// 티켓 '입장'이 첫 화면의 유일한 버튼이다. 누르면 로그인/회원가입 화면으로 간다.
// 그 화면은 다음 단계에서 react-router로 연결한다. 지금은 티켓만 찢어졌다가 다시 붙는다.
const enter = () => {}

export default function App() {
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
    </div>
  )
}
