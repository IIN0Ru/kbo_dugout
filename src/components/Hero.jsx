import { featuredPlayer } from '../data.js'

export default function Hero() {
  return (
    <header className="hero wrap">
      <nav className="nav">
        <a className="nav__logo on-stripe" href="#top">DUGOUT</a>
        <a className="nav__login on-stripe" href="#login">로그인</a>
      </nav>

      <div className="hero__grid">
        <div className="hero__cards" aria-hidden="true">
          <div className="photocard photocard--back" />
          <div className="photocard photocard--front">
            <span className="photocard__num">#{featuredPlayer.number}</span>
            <span className="photocard__meta">
              {featuredPlayer.position} · 새 메시지 {featuredPlayer.unread}
            </span>
          </div>
        </div>

        <div className="hero__copy">
          <h1 className="hero__title">
            <span className="on-stripe">경기는 끝났지만</span>
            <br />
            <span className="hl">대화는 지금부터</span>
          </h1>
          <p className="hero__sub on-stripe">최애 선수의 메시지가 내 폰으로</p>
          <div className="hero__cta">
            <a className="btn btn--primary" href="#login" id="cta-fan">팬으로 시작</a>
            <a className="btn btn--ghost" href="#login" id="cta-player">선수로 체험</a>
          </div>
        </div>
      </div>
    </header>
  )
}
