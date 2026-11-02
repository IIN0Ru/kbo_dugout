import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TEAMS, teamById } from '../data/teams.js'
import { useSession } from '../session.jsx'
import { isBlocked } from '../data/filter.js'

function readPlan() {
  try {
    return localStorage.getItem('dugout-plan') || 'member'
  } catch {
    return 'member'
  }
}

// 마이페이지 (흰 바탕): 닉네임 변경 · 응원 구단 변경 · 구독 관리 · 로그아웃
export default function Me() {
  const nav = useNavigate()
  const { profile, saveProfile, logout, store } = useSession()
  const [nickname, setNickname] = useState(profile?.nickname || '')
  const [team, setTeam] = useState(profile?.team || null)
  const [plan, setPlan] = useState(readPlan)
  const [teamOpen, setTeamOpen] = useState(false)
  const [err, setErr] = useState('')
  const [saved, setSaved] = useState('')
  const [busy, setBusy] = useState(false)

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

  const name = nickname.trim()
  const t = teamById(team)
  const origPlan = readPlan()
  const dirty = name !== profile.nickname || team !== profile.team || plan !== origPlan
  const valid = name.length >= 2 && name.length <= 10

  const save = async () => {
    if (isBlocked(name)) return setErr('닉네임에 쓸 수 없는 말이 들어 있어요.')
    if (!valid || !store) return
    setBusy(true)
    try {
      await saveProfile({ nickname: name, team })
      try {
        localStorage.setItem('dugout-plan', plan)
      } catch {
        /* 무시 */
      }
      setSaved('저장했어요')
      setTimeout(() => setSaved(''), 1800)
    } catch (e) {
      console.error(e)
      setErr('저장하지 못했어요. 잠시 후 다시 시도해 주세요.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page lt mypage">
      <header className="lt-nav">
        <button className="lt-back" type="button" aria-label="뒤로" onClick={() => nav(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <b className="me-navtitle">마이페이지</b>
        <span className="lt-back" aria-hidden="true" />
      </header>

      <section className="me-hero" style={{ '--tc': t.color }}>
        <img src={`logos/${t.id}.jpg`} alt="" />
        <div>
          <b>{name || profile.nickname}</b>
          <small>
            {t.name} 팬 · {plan === 'member' ? 'DUGOUT 멤버십' : '무료 이용 중'}
          </small>
        </div>
      </section>

      <section className="me-sec">
        <h2>닉네임</h2>
        <div className="join-pill">
          <input
            id="me-nickname"
            value={nickname}
            maxLength={10}
            autoComplete="off"
            onChange={(e) => {
              setNickname(e.target.value)
              setErr('')
            }}
          />
          <small>{name.length}/10</small>
        </div>
        {!valid && <p className="err">닉네임은 2~10자로 정해 주세요.</p>}
      </section>

      <section className="me-sec">
        <h2>응원 구단</h2>
        <button type="button" className="me-row" aria-expanded={teamOpen} onClick={() => setTeamOpen((v) => !v)}>
          <img src={`logos/${t.id}.jpg`} alt="" />
          <span>{t.name}</span>
          <small>{teamOpen ? '접기' : '바꾸기'}</small>
        </button>
        {teamOpen && (
          <div className="join-teams" role="radiogroup" aria-label="응원 구단">
            {TEAMS.map((x) => (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={team === x.id}
                className={`join-team ${team === x.id ? 'on' : ''}`}
                onClick={() => setTeam(x.id)}
              >
                <img src={`logos/${x.id}.jpg`} alt="" />
                <span>{x.name}</span>
              </button>
            ))}
          </div>
        )}
        <p className="me-note">응원 구단을 바꾸면 홈에 그 구단 선수와 공식 채널이 보여요.</p>
      </section>

      <section className="me-sec">
        <h2>구독 관리</h2>
        <div className="pl-seg" role="tablist" aria-label="플랜">
          {[
            ['free', '무료'],
            ['member', '멤버십'],
          ].map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={plan === id} className={plan === id ? 'on' : ''} onClick={() => setPlan(id)}>
              {label}
            </button>
          ))}
        </div>
        <div className="me-plan">
          {plan === 'member' ? (
            <>
              <b>DUGOUT 멤버십 · 월 4,900원</b>
              <span>선수 메시지 보기 · 답장(메시지당 3회) · 공개 픽 기회</span>
            </>
          ) : (
            <>
              <b>무료 · 0원</b>
              <span>공개 픽 피드 · 경기 기록 카드. 답장은 멤버십에서 할 수 있어요.</span>
            </>
          )}
        </div>
        <p className="me-note">시연용 화면이에요. 실제 결제나 해지는 일어나지 않아요.</p>
      </section>

      <section className="me-sec">
        <h2>계정</h2>
        <button
          type="button"
          className="me-row me-out"
          onClick={async () => {
            await logout()
            nav('/', { replace: true })
          }}
        >
          <span>로그아웃</span>
        </button>
        <p className="me-note">로그아웃하면 이 기기에서 보낸 답장 기록도 사라져요.</p>
      </section>

      {err && <p className="err me-err">{err}</p>}
      <div className="lt-cta me-cta">
        <button className="btn btn-led" type="button" disabled={!dirty || !valid || busy} onClick={save}>
          {busy ? '저장 중…' : saved || (dirty ? '변경 내용 저장' : '변경한 내용이 없어요')}
        </button>
      </div>
    </main>
  )
}
