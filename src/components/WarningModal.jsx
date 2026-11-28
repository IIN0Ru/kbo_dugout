import { useLocation } from 'react-router-dom'
import { useSession, useSub } from '../session.jsx'
import { playerById } from '../data/teams.js'

// 관리자가 내 답장을 지우면 어느 화면에 있든 경고 창이 뜬다. '확인했어요'를 눌러야 닫힌다.
export default function WarningModal() {
  const { store, uid, profile } = useSession()
  const { pathname } = useLocation()
  const staff = pathname.startsWith('/bench') || pathname.startsWith('/admin')
  const mine = useSub(
    store && uid && !staff ? (cb) => store.subscribeMyWarnings(uid, cb) : null,
    [store, uid, staff],
    [],
  )
  if (staff || !profile) return null
  const pending = mine.filter((w) => !w.seen).sort((a, b) => a.createdAt - b.createdAt)
  const w = pending[0]
  if (!w) return null
  const p = playerById(w.playerId)

  return (
    <div className="warn-dim" role="alertdialog" aria-modal="true" aria-labelledby="warn-title">
      <div className="warn-card">
        <span className="warn-badge">운영 정책 경고 · 누적 {mine.length}회</span>
        <h2 id="warn-title">보낸 답장이 운영자에 의해 삭제됐어요</h2>
        <blockquote>
          {p && <small>{p.label}에게 보낸 답장</small>}
          <s>{w.replyText}</s>
        </blockquote>
        <p className="warn-reason">
          사유: <b>{w.reason}</b>
        </p>
        <p className="warn-desc">
          DUGOUT은 선수와 팬 모두가 편하게 이야기하는 공간이에요. 같은 일이 반복되면 답장 기능이 제한될 수 있어요.
        </p>
        <button className="btn btn-led" type="button" onClick={() => store.markWarningSeen(w.id)}>
          확인했어요
        </button>
      </div>
    </div>
  )
}
