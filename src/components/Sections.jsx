import Reveal from './Reveal.jsx'
import { fanThread, playerInbox, benefits, teams } from '../data.js'

function Label({ children }) {
  return <span className="label">{children}</span>
}

export function Background() {
  return (
    <Reveal as="section" className="card" id="background" aria-labelledby="bg-title">
      <Label>01 기획 배경</Label>
      <h2 id="bg-title" className="card__title">
        선수 목소리는 기사로,
        <br />
        팬 목소리는 댓글창에 묻혀요
      </h2>
      <dl className="problems">
        <div>
          <dt>선수</dt>
          <dd>인터뷰와 SNS는 모두에게 공개된 말이라, 팬 한 사람에게 닿지 않아요</dd>
        </div>
        <div>
          <dt>팬</dt>
          <dd>응원이 수천 개 댓글 속에 묻혀 선수가 읽기 어려워요</dd>
        </div>
      </dl>
      <p className="answer">선수가 한 번 보내면, 팬 모두에게 1:1 대화처럼 도착해요</p>
    </Reveal>
  )
}

export function Features() {
  return (
    <Reveal as="section" className="card" id="features" aria-labelledby="ft-title">
      <Label>02 주요 기능</Label>
      <h2 id="ft-title" className="card__title">이렇게 대화해요</h2>

      <div className="previews">
        <figure className="preview">
          <figcaption className="preview__cap">팬 화면</figcaption>
          <div className="thread">
            <div className="thread__head">
              <span className="avatar avatar--ink">27</span>
              <span>#27 투수</span>
            </div>
            {fanThread.map((m, i) => (
              <p key={i} className={`bubble bubble--${m.from}`}>{m.text}</p>
            ))}
          </div>
          <ol className="tags" start="1">
            <li><span className="tag">A</span>선수 메시지가 내 1:1 대화방으로</li>
            <li><span className="tag">B</span>답장은 선수에게만 보여요</li>
          </ol>
        </figure>

        <figure className="preview">
          <figcaption className="preview__cap">
            선수 화면 · 받은 답장 <span className="num">{playerInbox.total.toLocaleString('ko-KR')}</span>
          </figcaption>
          <ul className="inbox">
            {playerInbox.replies.map((r) => (
              <li key={r.nick}>
                <span className={`avatar avatar--${r.tone}`} aria-hidden="true" />
                <span className="inbox__nick">{r.nick}</span>
                <span className="inbox__text">{r.text}</span>
              </li>
            ))}
          </ul>
          <ol className="tags">
            <li><span className="tag">C</span>선수는 모든 답장을 목록으로 받아요</li>
          </ol>
        </figure>
      </div>
    </Reveal>
  )
}

export function Benefits() {
  return (
    <Reveal as="section" className="card" id="benefits" aria-labelledby="bn-title">
      <Label>03 팬이 얻는 것</Label>
      <h2 id="bn-title" className="card__title">응원이 닿는 경험</h2>
      <ul className="benefits">
        {benefits.map((b) => (
          <li key={b.title} className={`benefit benefit--${b.tone}`}>
            <strong>{b.title}</strong>
            <span>{b.body}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

export function Teams() {
  return (
    <Reveal as="section" className="card" id="teams" aria-labelledby="tm-title">
      <Label>04 참여 구단</Label>
      <h2 id="tm-title" className="card__title">KBO 10개 구단 함께해요</h2>
      <ul className="teams">
        {teams.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </Reveal>
  )
}
