import { useNavigate } from 'react-router-dom'
import { TEAMS } from '../data/teams.js'
import { useSession } from '../session.jsx'

// 앱 첫 화면 (확정 시안 I1): 등번호 모자이크 + 선수 말풍선 + 제목 + 로그인하기
const TILES = [
  ['lg', 7, 3],
  ['doosan', 17, 1],
  ['hanwha', 1, 0],
  ['nc', 52, 0],
  ['kt', 10, 2],
  ['samsung', 24, 0],
  ['kiwoom', 33, 0],
  ['kia', 5, 1],
  ['lotte', 9, 0],
]

export default function Splash() {
  const nav = useNavigate()
  const { profile } = useSession()
  const color = (id) => TEAMS.find((t) => t.id === id).color

  return (
    <main className="splash">
      <div className="mosaic" aria-hidden="true">
        {TILES.map(([team, no, badge]) => (
          <div key={team} style={{ background: color(team) }}>
            #{no}
            {badge > 0 && <span className="badge">{badge}</span>}
          </div>
        ))}
      </div>

      <div className="splash-pop">
        <div className="who">
          <span className="av" style={{ background: color('lg') }}>7</span>외야수 #7 · 새 메시지
        </div>
        <div className="bub">오늘 응원 소리 덕아웃까지 다 들렸어요. 내일도 잠실에서 봬요!</div>
        <span className="rcpt">구독한 팬 모두가 함께 받았어요</span>
      </div>

      <div className="splash-body">
        <span className="mark" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <h1>
          수백 명의 선수,
          <br />
          하나의 덕아웃.
        </h1>
        <button
          className="btn btn-led"
          type="button"
          onClick={() => nav(profile ? '/home' : '/login')}
        >
          {profile ? `${profile.nickname}님, 들어가기` : '로그인하기'}
        </button>
      </div>
    </main>
  )
}
