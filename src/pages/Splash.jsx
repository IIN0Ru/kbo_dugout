import { useNavigate } from 'react-router-dom'
import { TEAMS } from '../data/teams.js'
import { useSession } from '../session.jsx'

// 앱 첫 화면 (확정 시안 I1, 흰 바탕 버전)
// 모자이크 칸 = 선수 등 사진 자리. photo에 파일 경로를 넣으면 사진으로 바뀐다.
// 예) public/backs/lg-7.jpg 를 넣고 photo: 'backs/lg-7.jpg'
const TILES = [
  { team: 'lg', no: 35, badge: 3, photo: 'backs/lg-35.jpg', pos: '45% 70%' },
  { team: 'hanwha', no: 99, badge: 0, photo: 'backs/hanwha-99.jpg', pos: '45% 60%' },
  { team: 'kia', no: 54, badge: 1, photo: 'backs/kia-54.jpg' },
  { team: 'samsung', no: 5, badge: 0, photo: 'backs/samsung-5.jpg', pos: '50% 60%' },
  { team: 'kt', no: 60, badge: 2, photo: 'backs/kt-60.jpg', pos: '42% 55%' },
  { team: 'ssg', no: 14, badge: 1, photo: 'backs/ssg-14.jpg', pos: '50% 60%' },
  { team: 'doosan', no: 25, badge: 0, photo: 'backs/doosan-25.jpg', pos: '35% 60%' },
  { team: 'nc', no: 59, badge: 0, photo: 'backs/nc-59.jpg', pos: '50% 50%' },
  { team: 'lotte', no: 51, badge: 0, photo: 'backs/lotte-51.jpg', pos: '30% 55%' },
]

const color = (id) => TEAMS.find((t) => t.id === id).color

function JerseyBack({ team, no }) {
  return (
    <svg className="jersey" viewBox="0 0 200 230" aria-hidden="true">
      <path d="M58 8 Q100 26 142 8 L196 40 L178 92 L156 82 L156 230 L44 230 L44 82 L22 92 L4 40 Z" fill={color(team)} />
      <path d="M58 8 Q100 26 142 8" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="5" />
      <text x="100" y="160" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="86" fill="#fff">
        {no}
      </text>
    </svg>
  )
}

export default function Splash() {
  const nav = useNavigate()
  const { profile } = useSession()

  return (
    <main className="splash">
      <div className="mosaic" aria-hidden="true">
        {TILES.map((t) => (
          <div key={t.team} className="tile">
            {t.photo ? <img src={t.photo} alt="" style={t.pos ? { objectPosition: t.pos } : undefined} /> : <JerseyBack team={t.team} no={t.no} />}
            {t.badge > 0 && <span className="badge">{t.badge}</span>}
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
        <button className="btn btn-led" type="button" onClick={() => nav(profile ? '/home' : '/login')}>
          {profile ? `${profile.nickname}님, 들어가기` : '로그인하기'}
        </button>
      </div>
    </main>
  )
}
