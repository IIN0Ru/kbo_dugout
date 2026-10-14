import Scoreboard from './components/Scoreboard.jsx'
import Hero from './components/Hero.jsx'
import { Background, Features, Benefits, Teams } from './components/Sections.jsx'

export default function App() {
  return (
    <div className="page" id="top">
      <Scoreboard />
      <div className="collar" aria-hidden="true" />

      {/* 유니폼 원단: 히어로부터 푸터 직전까지 줄무늬가 이어진다 */}
      <div className="jersey">
        <Hero />
        <main className="wrap sections">
          <Background />
          <Features />
          <Benefits />
          <Teams />
        </main>
      </div>

      <div className="collar" aria-hidden="true" />
      <footer className="footer">
        <div className="wrap">
          <p className="footer__logo">DUGOUT</p>
          <p>경기대학교 캡스톤 디자인 프로젝트</p>
          <p className="footer__note">본 서비스는 발표용 목업이며 실제 구단·선수와 무관합니다</p>
        </div>
      </footer>
    </div>
  )
}
