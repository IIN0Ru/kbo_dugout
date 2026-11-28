import { useMemo, useState } from 'react'
import { playerById, teamById } from '../data/teams.js'
import { useSession, useSub } from '../session.jsx'
import { TeamDot, timeLabel } from '../components/ui.jsx'
import { REMOVE_REASONS } from '../data/filter.js'

// 발표자 화면(#/bench)의 '답장 관리' 탭. 금칙어 필터를 피해 간 답장을 사람이 보고 지운다.
// 삭제하면: 선수 채팅방에서 사라지고, 공개 픽이었다면 내려가고, 작성자에게 경고 창이 뜬다.
export default function AdminPanel() {
  const { store } = useSession()
  const replies = useSub(store ? (cb) => store.subscribeAllReplies(cb) : null, [store], [])
  const picks = useSub(store ? (cb) => store.subscribePicks(cb) : null, [store], [])
  const warnings = useSub(store ? (cb) => store.subscribeAllWarnings(cb) : null, [store], [])

  const [tab, setTab] = useState('live') // live | removed
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null) // 삭제 사유를 고르는 중인 답장 id
  const [reason, setReason] = useState(REMOVE_REASONS[0])
  const [busy, setBusy] = useState(false)

  const warnCount = useMemo(() => {
    const c = {}
    for (const w of warnings) c[w.uid] = (c[w.uid] || 0) + 1
    return c
  }, [warnings])
  const warnByReply = useMemo(() => Object.fromEntries(warnings.map((w) => [w.replyId, w])), [warnings])

  // 예전 방식으로 저장된 금칙어 답장(blocked)은 이미 숨겨져 있으니 목록에서 뺀다
  const live = replies.filter((r) => !r.removed && !r.blocked)
  const removed = replies.filter((r) => r.removed)
  const list = useMemo(() => {
    const k = q.trim().toLowerCase()
    return (tab === 'live' ? live : removed)
      .filter((r) => !k || r.text.toLowerCase().includes(k) || (r.nickname || '').toLowerCase().includes(k))
      .sort((a, b) => (tab === 'live' ? b.createdAt - a.createdAt : (b.removedAt || 0) - (a.removedAt || 0)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replies, tab, q])

  const remove = async (r) => {
    if (!store || busy) return
    setBusy(true)
    try {
      const pickIds = picks.filter((k) => k.replyId === r.id && !k.removed).map((k) => k.id)
      await store.removeReply(r, reason, pickIds)
      setOpen(null)
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="adm">
      <p className="adm-lead">
        금칙어 필터를 피해 간 답장을 직접 지울 수 있어요. 지우면 선수 화면에서 사라지고 작성자에게 경고가 가요.
      </p>

      <div className="adm-bar">
        <div className="adm-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'live'} className={tab === 'live' ? 'on' : ''} onClick={() => setTab('live')}>
            전체 답장 <em>{live.length}</em>
          </button>
          <button type="button" role="tab" aria-selected={tab === 'removed'} className={tab === 'removed' ? 'on' : ''} onClick={() => setTab('removed')}>
            삭제됨 <em>{removed.length}</em>
          </button>
        </div>
        <input className="adm-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="내용·닉네임 검색" autoComplete="off" />
      </div>

      {list.length === 0 && (
        <div className="bk-empty">
          <b>{q ? '검색 결과가 없어요' : tab === 'live' ? '아직 답장이 없어요' : '삭제한 답장이 없어요'}</b>
        </div>
      )}

      <ul className="adm-list">
        {list.map((r) => {
          const p = playerById(r.playerId)
          const t = teamById(p?.teamId)
          const n = warnCount[r.uid] || 0
          const w = warnByReply[r.id]
          return (
            <li key={r.id} className={r.removed ? 'removed' : ''}>
              <div className="adm-head">
                <span className="bk-av">{r.team ? <img src={`logos/${r.team}.jpg`} alt="" /> : <TeamDot teamId={r.team} />}</span>
                <span className="adm-who">
                  <b>
                    {r.nickname}
                    {n > 0 && <i className="adm-warn-n">경고 {n}회</i>}
                  </b>
                  <small>
                    → {p ? `${p.label} · ${t?.short ?? ''}` : r.playerId} · {timeLabel(r.createdAt)}
                  </small>
                </span>
              </div>
              <p className="adm-text">{r.text}</p>

              {r.removed ? (
                <p className="adm-meta">
                  삭제 사유: {r.removedReason || '-'} · 경고 {w?.seen ? '확인함' : '아직 안 봄'}
                </p>
              ) : open === r.id ? (
                <div className="adm-confirm">
                  <span>삭제 사유</span>
                  <div className="adm-reasons">
                    {REMOVE_REASONS.map((x) => (
                      <button key={x} type="button" className={reason === x ? 'on' : ''} onClick={() => setReason(x)}>
                        {x}
                      </button>
                    ))}
                  </div>
                  {r.picked && <small className="adm-note">공개 픽으로 뽑힌 답장이라 공개 픽에서도 내려가요.</small>}
                  <div className="adm-acts">
                    <button type="button" className="ghost" onClick={() => setOpen(null)}>
                      취소
                    </button>
                    <button type="button" className="danger" disabled={busy} onClick={() => remove(r)}>
                      삭제하고 경고 보내기
                    </button>
                  </div>
                </div>
              ) : (
                <div className="adm-acts">
                  {r.picked && <span className="adm-pill">공개 픽</span>}
                  <button
                    type="button"
                    className="danger-outline"
                    onClick={() => {
                      setOpen(r.id)
                      setReason(REMOVE_REASONS[0])
                    }}
                  >
                    삭제·경고
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
