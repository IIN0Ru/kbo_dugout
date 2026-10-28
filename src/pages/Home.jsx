import { useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { TEAMS, PLAYERS, SEED_MESSAGES, RESTING, playersOfTeam, teamById } from '../data/teams.js'
import { useSession, useSub } from '../session.jsx'
import { Logo, PlayerTile, timeLabel } from '../components/ui.jsx'
import Picks from './Picks.jsx'

export function readSeen() {
  try {
    return JSON.parse(localStorage.getItem('dugout-seen') || '{}')
  } catch {
    return {}
  }
}

export default function Home() {
  const { store, profile } = useSession()
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'picks' ? 'picks' : 'players'

  const live = useSub(store ? (cb) => store.subscribeAllMessages(cb) : null, [store], [])
  const latest = useMemo(() => {
    const map = {}
    for (const m of [...SEED_MESSAGES, ...live]) {
      if (!map[m.playerId] || map[m.playerId].createdAt < m.createdAt) map[m.playerId] = m
    }
    return map
  }, [live])
  const seen = readSeen()

  if (!profile) {
    return (
      <main className="page center">
        <p>먼저 입장권을 만들어 주세요.</p>
        <button className="btn btn-led" type="button" onClick={() => nav('/login')}>
          로그인하기
        </button>
      </main>
    )
  }

  const myTeam = teamById(profile.team)
  const others = TEAMS.filter((t) => t.id !== profile.team)

  const Row = ({ p }) => {
    const m = latest[p.id]
    const rest = RESTING[p.id]
    const unread = m && (!seen[p.id] || seen[p.id] < m.createdAt)
    return (
      <Link to={`/channel/${p.id}`} className="prow">
        <PlayerTile player={p} />
        <span className="prow-text">
          <b>
            {p.label}
            {unread && <i className="unread" aria-label="새 메시지" />}
          </b>
          <small>{rest ? rest.note : m ? m.text : '아직 메시지가 없어요'}</small>
        </span>
        <span className="prow-time">{m ? timeLabel(m.createdAt) : ''}</span>
      </Link>
    )
  }

  return (
    <main className="page home">
      <header className="topbar">
        <Logo />
        <span className="me-chip" style={{ '--tc': myTeam.color }}>
          <i />
          {profile.nickname}
        </span>
      </header>

      <nav className="tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'players'}
          className={tab === 'players' ? 'on' : ''}
          onClick={() => setParams({})}
        >
          선수
        </button>
        <button
          role="tab"
          aria-selected={tab === 'picks'}
          className={tab === 'picks' ? 'on' : ''}
          onClick={() => setParams({ tab: 'picks' })}
        >
          공개 픽
        </button>
      </nav>

      {tab === 'players' ? (
        <div className="players">
          <section>
            <h2 className="sec" style={{ '--tc': myTeam.color }}>
              <i />내 구단 · {myTeam.name}
            </h2>
            {playersOfTeam(myTeam.id).map((p) => (
              <Row key={p.id} p={p} />
            ))}
          </section>
          {others.map((t) => (
            <section key={t.id}>
              <h2 className="sec" style={{ '--tc': t.color }}>
                <i />
                {t.name}
              </h2>
              {playersOfTeam(t.id).map((p) => (
                <Row key={p.id} p={p} />
              ))}
            </section>
          ))}
          <p className="tiny muted pad">
            선수는 실명 없이 포지션과 등번호로만 표시해요. 총 {PLAYERS.length}명의 가상 선수예요.
          </p>
        </div>
      ) : (
        <Picks />
      )}
    </main>
  )
}
