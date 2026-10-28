import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../components/ui.jsx'
import { useSession } from '../session.jsx'
import { teamById } from '../data/teams.js'

// 구독 플랜 (결제 목업). 실제 결제는 없다.
export default function Plan() {
  const nav = useNavigate()
  const { profile } = useSession()
  const team = teamById(profile?.team)
  const [plan, setPlan] = useState('member')

  return (
    <main className="page">
      <TopBar title="구독 플랜" />
      <div className="plan">
        <h1>{team ? `${team.name} 덕아웃` : '덕아웃'}을 어떻게 이용할까요?</h1>
        <p className="muted">구독은 선수 한 명이 아니라 구단 단위예요.</p>

        <button
          type="button"
          className={`plan-card ${plan === 'free' ? 'on' : ''}`}
          onClick={() => setPlan('free')}
          aria-pressed={plan === 'free'}
        >
          <div className="plan-head">
            <b>무료</b>
            <span>0원</span>
          </div>
          <ul>
            <li>구단 공지</li>
            <li>경기 기록 카드</li>
            <li>공개 픽 피드 보기</li>
          </ul>
        </button>

        <button
          type="button"
          className={`plan-card ${plan === 'member' ? 'on' : ''}`}
          onClick={() => setPlan('member')}
          aria-pressed={plan === 'member'}
          style={{ '--tc': team?.color }}
        >
          <div className="plan-head">
            <b>DUGOUT 멤버십</b>
            <span>
              월 4,900원<small>예시</small>
            </span>
          </div>
          <ul>
            <li>{team ? team.short : '응원 구단'} 소속 선수 채널 전체</li>
            <li>선수 메시지에 답장 (메시지당 3회)</li>
            <li>공개 픽에 선정될 기회</li>
            <li>구단 시즌권 회원은 무료 포함</li>
          </ul>
        </button>

        <div className="plan-note">
          <b>구독료는 어디로 가나요?</b>
          <p>선수 · 구단 · KBO가 나누고, 일부는 유소년 야구 기금으로 쓰여요. 나누는 비율은 앱 안에 공개해요.</p>
        </div>

        <p className="tiny muted">시연용 화면이에요. 실제 결제는 일어나지 않고, 가격은 설문으로 정할 예정이에요.</p>

        <div className="sticky-cta">
          <button
            className="btn btn-led"
            type="button"
            onClick={() => {
              try {
                localStorage.setItem('dugout-plan', plan)
              } catch {
                /* 무시 */
              }
              nav('/home')
            }}
          >
            {plan === 'member' ? '멤버십 체험 시작' : '무료로 둘러보기'}
          </button>
        </div>
      </div>
    </main>
  )
}
