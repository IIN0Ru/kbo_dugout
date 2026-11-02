import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SEED_MESSAGES, RESTING, TEAM_LINKS, playersOfTeam, teamById } from '../data/teams.js'
import { useSession, useSub } from '../session.jsx'
import { PlayerTile, timeLabel } from '../components/ui.jsx'
import Picks from './Picks.jsx'

export function readSeen() {
  try {
    return JSON.parse(localStorage.getItem('dugout-seen') || '{}')
  } catch {
    return {}
  }
}

const CHANNELS = [
  ['home', '홈페이지', <path key="h" d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />],
  ['instagram', '인스타그램', <g key="i"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></g>],
  ['x', 'X', <path key="x" d="M4 4l16 16M20 4L4 20" />],
  ['youtube', '유튜브', <g key="y"><rect x="2.5" y="5" width="19" height="14" rx="4" /><path d="M10 9l5 3-5 3z" fill="currentColor" /></g>],
]

function TopRow({ team, nickname }) {
  const { logout } = useSession()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  return (
    <header className="lt-nav hm-top">
      <span className="lt-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <button type="button" className="hm-me" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <img src={`logos/${team.id}.jpg`} alt="" />
        {nickname}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <>
          <button type="button" className="hm-scrim" aria-label="닫기" onClick={() => setOpen(false)} />
          <div className="hm-menu" role="menu">
            <div className="hm-menu-h">
              <b>{nickname}</b>
              <small>{team.name} 팬</small>
            </div>
            <button
              type="button"
              role="menuitem"
              className="hm-logout"
              disabled={busy}
              onClick={async () => {
                setBusy(true)
                await logout()
                nav('/', { replace: true })
              }}
            >
              {busy ? '로그아웃 중…' : '로그아웃'}
            </button>
            <small className="hm-menu-note">로그아웃하면 이 기기에서 보낸 답장 기록도 사라져요.</small>
          </div>
        </>
      )}
    </header>
  )
}

// 홈 (흰 바탕, 확정 시안 E 변형)
// 인사말 → 검정 카드(내 구단 공식 채널·소식) → 내 구단 선수 메시지. 다른 구단은 보여 주지 않는다.
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
      <main className="page lt center">
        <p>먼저 닉네임과 응원 구단을 정해 주세요.</p>
        <button className="btn btn-led" type="button" onClick={() => nav('/login')}>
          로그인하기
        </button>
      </main>
    )
  }

  const team = teamById(profile.team)
  const links = TEAM_LINKS[team.id] || {}

  if (tab === 'picks') {
    return (
      <main className="page lt hm">
        <TopRow team={team} nickname={profile.nickname} />
        <div className="hm-subhead">
          <button type="button" className="hm-back" onClick={() => setParams({})}>
            ← 선수 메시지
          </button>
          <h1>공개 픽</h1>
          <p>선수가 고른 팬 답장과 선수의 대답을 모두가 함께 봐요.</p>
        </div>
        <Picks />
      </main>
    )
  }

  const players = playersOfTeam(team.id)
  const isUnread = (p) => {
    const m = latest[p.id]
    return m && !RESTING[p.id] && (!seen[p.id] || seen[p.id] < m.createdAt)
  }
  const unread = players.filter(isUnread).length
  const activePlayer = players.find((p) => !RESTING[p.id])

  return (
    <main className="page lt hm">
      <TopRow team={team} nickname={profile.nickname} />

      <h1 className="hm-hello">
        {profile.nickname}님,
        <br />
        {unread ? '덕아웃에 새 소식이 있어요' : '오늘도 덕아웃에 오셨네요'}
      </h1>

      <section className="hm-card" aria-label={`${team.name} 공식 채널`}>
        <div className="hm-card-h">
          <img src={`logos/${team.id}.jpg`} alt="" />
          <b>{team.name}</b>
          <small>공식 채널</small>
        </div>
        <div className="hm-ch">
          {CHANNELS.filter(([k]) => links[k]).map(([k, label, icon]) => (
            <a key={k} href={links[k]} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {icon}
              </svg>
              {label}
            </a>
          ))}
        </div>
        {links.home && (
          <a className="hm-news" href={links.home} target="_blank" rel="noreferrer">
            <span>
              <b>최신 소식</b>
              <small>구단 홈페이지에서 공지·뉴스 보기</small>
            </span>
            <i aria-hidden="true">↗</i>
          </a>
        )}
      </section>

      <div className="hm-sec">
        <h2>
          선수 메시지{unread > 0 && <em>{unread}</em>}
        </h2>
        <button type="button" onClick={() => setParams({ tab: 'picks' })}>
          공개 픽 →
        </button>
      </div>

      {activePlayer && (
        <p className="hm-hint">
          지금은 <b>{activePlayer.label}</b> 선수에게만 답장을 보낼 수 있어요. 눌러서 메시지를 확인해 보세요!
        </p>
      )}

      <div className="hm-list">
        {players.map((p) => {
          const m = latest[p.id]
          const rest = RESTING[p.id]
          return (
            <Link key={p.id} to={`/channel/${p.id}`} className={`hm-row ${rest ? 'rest' : ''}`}>
              <PlayerTile player={p} size={46} radius={23} />
              <span className="hm-row-t">
                <b>
                  {p.label}
                  {isUnread(p) && <i className="hm-dot" aria-label="새 메시지" />}
                </b>
                <small>{rest ? rest.note : m ? m.text : '아직 메시지가 없어요'}</small>
              </span>
              {rest ? <span className="hm-rest">쉬는 중</span> : <span className="hm-row-time">{m ? timeLabel(m.createdAt) : ''}</span>}
            </Link>
          )
        })}
      </div>
      <p className="hm-foot">선수는 실명 없이 포지션과 등번호로만 표시한 가상 인물이에요.</p>
    </main>
  )
}
