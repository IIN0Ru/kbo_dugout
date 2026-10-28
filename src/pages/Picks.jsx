import { useSession, useSub } from '../session.jsx'
import { playerById, teamById } from '../data/teams.js'
import { PlayerTile, TeamDot, timeLabel } from '../components/ui.jsx'
import { Link } from 'react-router-dom'

// 공개 픽 피드: 선수가 고른 답장과 선수의 대답을 모두가 함께 본다.
export default function Picks() {
  const { store } = useSession()
  const picks = useSub(store ? (cb) => store.subscribePicks(cb) : null, [store], [])
  const list = [...picks].sort((a, b) => b.createdAt - a.createdAt)

  if (!list.length) {
    return (
      <div className="empty">
        <b>아직 공개된 답장이 없어요</b>
        <p>선수가 팬 답장 중 하나를 고르면 여기에 모두에게 공개돼요.</p>
      </div>
    )
  }

  return (
    <div className="feed">
      {list.map((k) => {
        const p = playerById(k.playerId)
        const t = teamById(p?.teamId)
        return (
          <article key={k.id} className="pick">
            <Link to={`/channel/${k.playerId}`} className="pick-head">
              {p && <PlayerTile player={p} size={32} radius={9} />}
              <span>
                <b>{p?.label}</b>
                <small>
                  {t?.name} · {timeLabel(k.createdAt)}
                </small>
              </span>
            </Link>
            <p className="pick-msg">“{k.messageText}”</p>
            <div className="pick-reply">
              <span className="pick-tag">선수가 고른 답장</span>
              <p>{k.replyText}</p>
              <small>
                <TeamDot teamId={k.team} />
                {k.nickname}
              </small>
            </div>
            <div className="pick-answer">
              <span className="av" style={{ background: t?.color }}>
                {p?.no}
              </span>
              <p>{k.answer}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
