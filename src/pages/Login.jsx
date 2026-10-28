import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TEAMS } from '../data/teams.js'
import { useSession } from '../session.jsx'
import { TopBar } from '../components/ui.jsx'
import { isBlocked } from '../data/filter.js'

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
    <main className="page">
      <TopBar />
      <form className="login" onSubmit={submit}>
        <h1>덕아웃 입장권을 만들어요</h1>
        <p className="muted">닉네임과 응원 구단만 있으면 돼요. 다른 개인정보는 받지 않아요.</p>

        <label className="field">
          <span>닉네임</span>
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
        </label>

        <fieldset className="field">
          <legend>응원 구단</legend>
          <div className="team-grid">
            {TEAMS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`team-chip ${team === t.id ? 'on' : ''}`}
                style={{ '--tc': t.color }}
                aria-pressed={team === t.id}
                onClick={() => setTeam(t.id)}
              >
                <i />
                {t.name}
              </button>
            ))}
          </div>
        </fieldset>

        {err && <p className="err">{err}</p>}
        <div className="sticky-cta">
          <button className="btn btn-led" type="submit" disabled={!ready || busy}>
            {busy ? '입장 중…' : '덕아웃 입장'}
          </button>
        </div>
      </form>
    </main>
  )
}
