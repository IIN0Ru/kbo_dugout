import { useMemo, useState } from 'react'
import { TEAMS, playersOfTeam, playerById, teamById, SEED_MESSAGES } from '../data/teams.js'
import { useSession, useSub } from '../session.jsx'
import { Logo, PlayerTile, TeamDot, timeLabel } from '../components/ui.jsx'

// 발표자용 선수 화면 (숨은 주소 #/bench). 비밀번호로 들어간다.
export default function Bench() {
  const { store } = useSession()
  const [ok, setOk] = useState(() => {
    try {
      return sessionStorage.getItem('dugout-bench') === '1'
    } catch {
      return false
    }
  })
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')

  if (!ok) {
    return (
      <main className="page bench-login">
        <Logo />
        <h1>선수 화면</h1>
        <p className="muted">발표자 전용이에요. 비밀번호를 입력해 주세요.</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (!store) return
            if (await store.benchLogin(pw)) {
              try {
                sessionStorage.setItem('dugout-bench', '1')
              } catch {
                /* 무시 */
              }
              setOk(true)
            } else setErr('비밀번호가 맞지 않아요.')
          }}
        >
          <input
            id="bench-pw"
            type="password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value)
              setErr('')
            }}
            placeholder="비밀번호"
            autoComplete="current-password"
          />
          {err && <p className="err">{err}</p>}
          <button className="btn btn-led" type="submit" disabled={!pw || !store}>
            들어가기
          </button>
        </form>
      </main>
    )
  }
  return <BenchMain />
}

function BenchMain() {
  const { store } = useSession()
  const [playerId, setPlayerId] = useState('lg-7')
  const player = playerById(playerId)
  const team = teamById(player.teamId)

  const live = useSub(store ? (cb) => store.subscribeMessages(playerId, cb) : null, [store, playerId], [])
  const replies = useSub(
    store ? (cb) => store.subscribeRepliesForPlayer(playerId, cb) : null,
    [store, playerId],
    [],
  )
  const messages = useMemo(
    () => [...SEED_MESSAGES.filter((m) => m.playerId === playerId), ...live].sort((a, b) => b.createdAt - a.createdAt),
    [live, playerId],
  )
  const [msgId, setMsgId] = useState(null)
  const current = messages.find((m) => m.id === msgId) || messages[0]

  const [draft, setDraft] = useState('')
  const [showBlocked, setShowBlocked] = useState(false)
  const [picking, setPicking] = useState(null)
  const [answer, setAnswer] = useState('')

  const forMsg = replies.filter((r) => current && r.messageId === current.id).sort((a, b) => b.createdAt - a.createdAt)
  const blocked = forMsg.filter((r) => r.blocked)
  const visible = forMsg.filter((r) => !r.blocked)

  const send = async (e) => {
    e.preventDefault()
    const t = draft.trim()
    if (!t) return
    await store.sendMessage(playerId, t)
    setDraft('')
    setMsgId(null)
  }

  return (
    <main className="page bench" style={{ '--tc': team.color }}>
      <header className="topbar">
        <Logo />
        <span className="bench-tag">선수 화면 · 발표자</span>
      </header>

      <section className="bench-sec">
        <label className="field">
          <span>어떤 선수로 보낼까요?</span>
          <select
            id="bench-player"
            value={playerId}
            onChange={(e) => {
              setPlayerId(e.target.value)
              setMsgId(null)
              setPicking(null)
            }}
          >
            {TEAMS.map((t) => (
              <optgroup key={t.id} label={t.name}>
                {playersOfTeam(t.id).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        <form className="bench-compose" onSubmit={send}>
          <div className="who">
            <PlayerTile player={player} size={30} radius={9} />
            {player.label} · {team.name}
          </div>
          <textarea
            id="bench-draft"
            rows={3}
            maxLength={200}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="구독한 팬 모두에게 보낼 메시지"
          />
          <div className="row-end">
            <small className="muted">특정 팬 한 명에게만 보내는 기능은 없어요</small>
            <button className="btn btn-led btn-sm" type="submit" disabled={!draft.trim()}>
              모두에게 보내기
            </button>
          </div>
        </form>
      </section>

      <section className="bench-sec">
        <h2 className="h-sm">팬 답장</h2>
        {messages.length > 0 ? (
          <label className="field">
            <span>어떤 메시지의 답장을 볼까요?</span>
            <select id="bench-msg" value={current?.id} onChange={(e) => setMsgId(e.target.value)}>
              {messages.map((m) => (
                <option key={m.id} value={m.id}>
                  {timeLabel(m.createdAt)} · {m.text.slice(0, 28)}
                  {m.text.length > 28 ? '…' : ''}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="muted">아직 보낸 메시지가 없어요.</p>
        )}

        {current && (
          <>
            <div className="bench-stats">
              <span>
                답장 <b>{visible.length}</b>
              </span>
              <button type="button" className="link" onClick={() => setShowBlocked((v) => !v)}>
                금칙어로 숨긴 답장 {blocked.length}개 {showBlocked ? '접기' : '보기'}
              </button>
            </div>

            {visible.length === 0 && <p className="muted pad-s">아직 답장이 없어요. 청중에게 답장을 부탁해 보세요!</p>}

            <ul className="reply-list">
              {visible.map((r) => (
                <li key={r.id} className={r.picked ? 'picked' : ''}>
                  <div className="r-head">
                    <TeamDot teamId={r.team} />
                    <b>{r.nickname}</b>
                    <small>{timeLabel(r.createdAt)}</small>
                  </div>
                  <p>{r.text}</p>
                  <div className="r-actions">
                    <button
                      type="button"
                      className={`chip ${r.heart ? 'on' : ''}`}
                      onClick={() => store.setHeart(r.id, !r.heart)}
                    >
                      {r.heart ? '❤️ 반응함' : '🤍 반응'}
                    </button>
                    {r.picked ? (
                      <span className="chip on-led">공개 픽 완료</span>
                    ) : (
                      <button type="button" className="chip" onClick={() => setPicking(r.id)}>
                        공개 픽
                      </button>
                    )}
                  </div>
                  {picking === r.id && (
                    <form
                      className="pick-form"
                      onSubmit={async (e) => {
                        e.preventDefault()
                        if (!answer.trim()) return
                        await store.pickReply(r, current, answer.trim())
                        setPicking(null)
                        setAnswer('')
                      }}
                    >
                      <textarea
                        id={`answer-${r.id}`}
                        rows={2}
                        maxLength={200}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="이 답장에 모두가 볼 대답을 적어 주세요"
                      />
                      <div className="row-end">
                        <button type="button" className="link" onClick={() => setPicking(null)}>
                          취소
                        </button>
                        <button className="btn btn-led btn-sm" type="submit" disabled={!answer.trim()}>
                          모두에게 공개
                        </button>
                      </div>
                    </form>
                  )}
                </li>
              ))}
              {showBlocked &&
                blocked.map((r) => (
                  <li key={r.id} className="blocked">
                    <div className="r-head">
                      <TeamDot teamId={r.team} />
                      <b>{r.nickname}</b>
                      <small>숨김 · 금칙어</small>
                    </div>
                    <p>{r.text}</p>
                  </li>
                ))}
            </ul>
          </>
        )}
      </section>
    </main>
  )
}
