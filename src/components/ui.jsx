import { useNavigate } from 'react-router-dom'
import { teamById } from '../data/teams.js'

export function Logo({ size = 20, word = true }) {
  return (
    <span className="logo" style={{ '--logo-h': `${size}px` }}>
      <span className="logo-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {word && <span className="logo-word">DUGOUT</span>}
    </span>
  )
}

export function TopBar({ title, sub, back = true, right }) {
  const nav = useNavigate()
  return (
    <header className="topbar">
      {back ? (
        <button className="icon-btn" type="button" aria-label="뒤로" onClick={() => nav(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      ) : (
        <Logo />
      )}
      {title && (
        <div className="topbar-title">
          <b>{title}</b>
          {sub && <small>{sub}</small>}
        </div>
      )}
      <div className="topbar-right">{right}</div>
    </header>
  )
}

export function PlayerTile({ player, size = 44, radius = 12 }) {
  const team = teamById(player.teamId)
  return (
    <span
      className="ptile"
      style={{ background: team.color, width: size, height: size, borderRadius: radius, fontSize: size * 0.42 }}
      aria-hidden="true"
    >
      {player.no}
    </span>
  )
}

export function TeamDot({ teamId }) {
  const t = teamById(teamId)
  return <i className="team-dot" style={{ background: t?.color || '#555' }} title={t?.name} />
}

export function timeLabel(ms) {
  const d = new Date(ms)
  const now = Date.now()
  const diff = (now - ms) / 1000
  if (diff < 60) return '방금'
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  const sameDay = new Date(now).toDateString() === d.toDateString()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return sameDay ? `${hh}:${mm}` : `${d.getMonth() + 1}.${d.getDate()} ${hh}:${mm}`
}

export const fmt = (n) => n.toLocaleString('ko-KR')
