import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../session.jsx'
import { teamById } from '../data/teams.js'

// 구독 플랜 (흰 바탕, 확정 시안 B: Apple 참고 — 전환 탭 + 큰 가격 + 비교표)
// 실제 결제는 없다. 가격은 설문으로 정할 예정인 예시.
const ROWS = [
  ['선수 메시지 보기', false, true],
  ['답장 (메시지당 3회)', false, true],
  ['공개 픽에 선정될 기회', false, true],
  ['공개 픽 피드', true, true],
  ['경기 기록 카드', true, true],
]

export default function Plan() {
  const nav = useNavigate()
  const { profile } = useSession()
  const team = teamById(profile?.team)
  const [plan, setPlan] = useState('member')
  const member = plan === 'member'

  const start = () => {
    try {
      localStorage.setItem('dugout-plan', plan)
    } catch {
      /* 무시 */
    }
    nav('/home')
  }

  return (
    <main className="page lt pl">
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
      <div className="lt-steps" aria-label="2단계 중 2단계">
        <i className="on" />
        <i className="on" />
      </div>

      <div className="pl-body">
        <div className="pl-head">
          {team && <img className="pl-logo" src={`logos/${team.id}.jpg`} alt={team.name} />}
          <h1>덕아웃에 더 가까이</h1>
          <p>구독은 선수 한 명이 아니라 구단 단위예요.</p>
        </div>

        <div className="pl-seg" role="tablist" aria-label="플랜 선택">
          {[
            ['free', '무료'],
            ['member', '멤버십'],
          ].map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={plan === id} className={plan === id ? 'on' : ''} onClick={() => setPlan(id)}>
              {label}
            </button>
          ))}
        </div>

        <div className="pl-price" aria-live="polite">
          <b>{member ? '₩4,900' : '₩0'}</b>
          <small>{member ? '월 · 구단 시즌권 회원은 무료' : '언제든 멤버십으로 바꿀 수 있어요'}</small>
        </div>

        <table className="pl-table">
          <thead>
            <tr>
              <th />
              <th className={!member ? 'on' : ''}>무료</th>
              <th className={member ? 'on' : ''}>멤버십</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([label, free, mem]) => (
              <tr key={label}>
                <td>{label === '선수 메시지 보기' && team ? `${team.short} 선수 메시지 보기` : label}</td>
                <td className={!member ? 'on' : ''}>{free ? <span className="y">✓</span> : <span className="n">—</span>}</td>
                <td className={member ? 'on' : ''}>{mem ? <span className="y">✓</span> : <span className="n">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="lt-cta">
          <button className="btn btn-led" type="button" onClick={start}>
            {member ? '멤버십 체험 시작' : '무료로 둘러보기'}
          </button>
          <small className="pl-tiny">시연용 화면이에요. 실제 결제는 없고, 가격은 예시예요.</small>
        </div>
      </div>
    </main>
  )
}
