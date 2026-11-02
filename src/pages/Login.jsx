import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TEAMS } from '../data/teams.js'
import { useSession } from '../session.jsx'
import { isBlocked } from '../data/filter.js'

// 입장 화면 (흰 바탕)
// A(Nike)의 큰 제목·알약 입력 + D(Uber)의 상단 진행 막대 + B(Airbnb)의 구단 카드(로고)
export default function Login() {
  const nav = useNavigate()
  const { saveProfile, profile, store } = useSession()
  const [nickname, setNickname] = useState(profile?.nickname || '')
  const [team, setTeam] = useState(profile?.team || null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const name = nickname.trim()
  const ready = name.length >= 2 && name.length <= 10 && team && store

  const submit = async (e) => {
    e.preventDefault()
    if (isBlocked(name)) return setErr('닉네임에 쓸 수 없는 말이 들어 있어요.')
    if (!ready) return
    setBusy(true)
    try {
      await saveProfile({ nickname: name, team })
      nav('/plan')
    } catch (e2) {
      console.error(e2)
      setErr('저장하지 못했어요. 잠시 후 다시 시도해 주세요.')
      setBusy(false)
    }
  }

  return (
    <main className="page lt join">
      <header className="lt-nav">
        <button className="lt-back" type="button" aria-label="뒤로" onClick={() => nav(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <span className="lt-bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="lt-back" aria-hidden="true" />
      </header>
      <div className="lt-steps" aria-label="2단계 중 1단계">
        <i className="on" />
        <i />
      </div>

      <form className="join-form" onSubmit={submit}>
        <h1 className="join-title">
          Join the
          <br />
          Dugout
        </h1>
        <p className="join-sub">닉네임과 응원 구단만 있으면 돼요.</p>

        <label className="join-label" htmlFor="nickname">
          닉네임
        </label>
        <div className="join-pill">
          <input
            id="nickname"
            value={nickname}
            maxLength={10}
            placeholder="2~10자 (예: 잠실직관러)"
            autoComplete="off"
            onChange={(e) => {
              setNickname(e.target.value)
              setErr('')
            }}
          />
          <small>{name.length}/10</small>
        </div>

        <p className="join-label" id="team-label">
          응원 구단
        </p>
        <div className="join-teams" role="radiogroup" aria-labelledby="team-label">
          {TEAMS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={team === t.id}
              className={`join-team ${team === t.id ? 'on' : ''}`}
              onClick={() => setTeam(t.id)}
            >
              <img src={`logos/${t.id}.jpg`} alt="" />
              <span>{t.name}</span>
            </button>
          ))}
        </div>

        {err && <p className="err">{err}</p>}
        <div className="lt-cta">
          <button className="btn btn-led" type="submit" disabled={!ready || busy}>
            {busy ? '입장 중…' : '덕아웃 입장'}
          </button>
        </div>
      </form>
    </main>
  )
}
