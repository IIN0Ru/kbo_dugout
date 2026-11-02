import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PLAYERS, playerById, teamById, SEED_MESSAGES, RESTING } from '../data/teams.js'
import { useSession, useSub } from '../session.jsx'
import { Logo, PlayerTile, TeamDot, timeLabel, fmt } from '../components/ui.jsx'

// 발표자용 선수 화면 (숨은 주소 #/bench). 카카오톡처럼 채팅 목록 → 채팅방.
// 외부에 공개하지 않는 시연용이라 로그인 없이 바로 쓴다.
const SEEN_KEY = 'dugout-bench-seen'
const readSeen = () => {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || '{}')
  } catch {
    return {}
  }
}
const writeSeen = (playerId, at) => {
  try {
    const s = readSeen()
    s[playerId] = Math.max(s[playerId] || 0, at)
    localStorage.setItem(SEEN_KEY, JSON.stringify(s))
  } catch {
    /* 무시 */
  }
}

export default function Bench() {
  const { playerId } = useParams()
  return playerId && playerById(playerId) ? <Room playerId={playerId} /> : <ChatList />
}

/* ---------- 채팅 목록 ---------- */
function ChatList() {
  const { store } = useSession()
  const nav = useNavigate()
  const replies = useSub(store ? (cb) => store.subscribeAllReplies(cb) : null, [store], [])
  const live = useSub(store ? (cb) => store.subscribeAllMessages(cb) : null, [store], [])
  const [showAll, setShowAll] = useState(false)
  const seen = readSeen()

  const rooms = useMemo(() => {
    const by = {}
    for (const r of replies) {
      if (r.blocked) continue
      const g = (by[r.playerId] ||= { last: null, count: 0, unread: 0 })
      g.count += 1
      if (!g.last || g.last.createdAt < r.createdAt) g.last = r
      if (!seen[r.playerId] || r.createdAt > seen[r.playerId]) g.unread += 1
    }
    return Object.entries(by)
      .map(([id, g]) => ({ player: playerById(id), ...g }))
      .filter((x) => x.player)
      .sort((a, b) => b.last.createdAt - a.last.createdAt)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replies])

  const lastMsg = useMemo(() => {
    const m = {}
    for (const x of [...SEED_MESSAGES, ...live]) if (!m[x.playerId] || m[x.playerId].createdAt < x.createdAt) m[x.playerId] = x
    return m
  }, [live])

  const quiet = PLAYERS.filter((p) => !rooms.some((r) => r.player.id === p.id))
  const totalUnread = rooms.reduce((n, r) => n + r.unread, 0)

  return (
    <main className="page lt bk">
      <header className="bk-top">
        <Logo size={18} />
        <span className="bench-tag">선수 화면 · 발표자</span>
      </header>
      <h1 className="bk-title">
        채팅{totalUnread > 0 && <em>{totalUnread}</em>}
      </h1>

      {rooms.length === 0 && (
        <div className="bk-empty">
          <b>아직 팬 답장이 온 채팅방이 없어요</b>
          <p>청중이 선수 메시지에 답장하면 여기에 채팅방이 생겨요.</p>
        </div>
      )}

      <ul className="bk-list">
        {rooms.map(({ player, last, count, unread }) => (
          <li key={player.id}>
            <button type="button" className="bk-row" onClick={() => nav(`/bench/${player.id}`)}>
              <PlayerTile player={player} size={50} radius={19} />
              <span className="bk-row-t">
                <b>
                  {player.label} <small>{teamById(player.teamId).short}</small>
                  <i className="bk-n">{count}</i>
                </b>
                <span>
                  {last.nickname}: {last.text}
                </span>
              </span>
              <span className="bk-row-r">
                <small>{timeLabel(last.createdAt)}</small>
                {unread > 0 && <em>{unread > 99 ? '99+' : unread}</em>}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <button type="button" className="bk-more" onClick={() => setShowAll((v) => !v)}>
        {showAll ? '답장 없는 선수 접기' : `답장 없는 선수 ${quiet.length}명 보기`}
      </button>
      {showAll && (
        <ul className="bk-list bk-quiet">
          {quiet.map((p) => (
            <li key={p.id}>
              <button type="button" className="bk-row" onClick={() => nav(`/bench/${p.id}`)}>
                <PlayerTile player={p} size={44} radius={17} />
                <span className="bk-row-t">
                  <b>
                    {p.label} <small>{teamById(p.teamId).short}</small>
                  </b>
                  <span>{RESTING[p.id] ? RESTING[p.id].note : lastMsg[p.id] ? `나: ${lastMsg[p.id].text}` : '보낸 메시지가 없어요'}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

/* ---------- 채팅방 ---------- */
function Room({ playerId }) {
  const { store } = useSession()
  const nav = useNavigate()
  const player = playerById(playerId)
  const team = teamById(player.teamId)

  const live = useSub(store ? (cb) => store.subscribeMessages(playerId, cb) : null, [store, playerId], [])
  const replies = useSub(store ? (cb) => store.subscribeRepliesForPlayer(playerId, cb) : null, [store, playerId], [])
  const picks = useSub(store ? (cb) => store.subscribePicks(cb) : null, [store], [])
  const fans = useSub(store ? (cb) => store.subscribeFanCount(cb) : null, [store], 0)

  const messages = useMemo(
    () => [...SEED_MESSAGES.filter((m) => m.playerId === playerId), ...live].sort((a, b) => a.createdAt - b.createdAt),
    [live, playerId],
  )
  const msgById = useMemo(() => Object.fromEntries(messages.map((m) => [m.id, m])), [messages])
  const myPicks = picks.filter((k) => k.playerId === playerId)
  const blocked = replies.filter((r) => r.blocked)
  const [showBlocked, setShowBlocked] = useState(false)

  // 시간순으로 섞은 대화: 선수 메시지(오른쪽) · 팬 답장(왼쪽) · 공개 픽 대답(오른쪽)
  const timeline = useMemo(() => {
    const items = [
      ...messages.map((m) => ({ kind: 'msg', at: m.createdAt, m })),
      ...replies.filter((r) => !r.blocked || showBlocked).map((r) => ({ kind: 'reply', at: r.createdAt, r })),
      ...myPicks.map((k) => ({ kind: 'pick', at: k.createdAt, k })),
    ]
    return items.sort((a, b) => a.at - b.at)
  }, [messages, replies, myPicks, showBlocked])

  const [draft, setDraft] = useState('')
  const [target, setTarget] = useState(null) // 공개 픽으로 대답할 답장
  const [busy, setBusy] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [timeline.length])

  useEffect(() => {
    const last = replies.reduce((t, r) => Math.max(t, r.createdAt), 0)
    if (last) writeSeen(playerId, last)
  }, [replies, playerId])

  const submit = async (e) => {
    e.preventDefault()
    const t = draft.trim()
    if (!t || !store || busy) return
    setBusy(true)
    try {
      if (target) {
        await store.pickReply(target, msgById[target.messageId] || { id: target.messageId, text: '' }, t)
        setTarget(null)
      } else {
        await store.sendMessage(playerId, t)
      }
      setDraft('')
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  let lastDay = ''
  return (
    <main className="page lt bk-room" style={{ '--tc': team.color }}>
      <header className="chw-top bk-room-top">
        <button className="lt-back" type="button" aria-label="채팅 목록" onClick={() => nav('/bench')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <span className="chw-num">#{player.no}</span>
        <span className="chw-title">
          <b>
            {player.pos} · {team.name}
          </b>
          <small>
            구독 팬 {fmt(fans)}명{RESTING[playerId] ? ' · 쉬는 중' : ''}
          </small>
        </span>
      </header>

      <div className="bk-thread">
        {blocked.length > 0 && (
          <button type="button" className="bk-sys" onClick={() => setShowBlocked((v) => !v)}>
            금칙어로 숨긴 답장 {blocked.length}개 · {showBlocked ? '숨기기' : '보기'}
          </button>
        )}
        {timeline.length === 0 && <p className="bk-sys">아직 대화가 없어요. 아래에서 첫 메시지를 보내 보세요.</p>}

        {timeline.map((it) => {
          const d = new Date(it.at)
          const day = `${d.getMonth() + 1}월 ${d.getDate()}일`
          const sep = day !== lastDay ? <p className="bk-day">{day}</p> : null
          lastDay = day
          if (it.kind === 'msg')
            return (
              <div key={it.m.id}>
                {sep}
                <div className="bk-me">
                  <small>
                    <span>모두에게</span>
                    {timeLabel(it.m.createdAt)}
                  </small>
                  <div className="bk-bub me">{it.m.text}</div>
                </div>
              </div>
            )
          if (it.kind === 'pick')
            return (
              <div key={it.k.id}>
                {sep}
                <div className="bk-me">
                  <small>
                    <span className="led">공개 픽</span>
                    {timeLabel(it.k.createdAt)}
                  </small>
                  <div className="bk-bub me">
                    <span className="bk-quote">
                      {it.k.nickname}: {it.k.replyText}
                    </span>
                    {it.k.answer}
                  </div>
                </div>
              </div>
            )
          const r = it.r
          return (
            <div key={r.id}>
              {sep}
              <div className={`bk-fan ${r.blocked ? 'blocked' : ''} ${target?.id === r.id ? 'target' : ''}`}>
                <span className="bk-av">{r.team ? <img src={`logos/${r.team}.jpg`} alt="" /> : <TeamDot teamId={r.team} />}</span>
                <div>
                  <b className="bk-nick">{r.nickname}</b>
                  <div className="bk-line">
                    <div className="bk-bub fan">{r.text}</div>
                    <small>{timeLabel(r.createdAt)}</small>
                  </div>
                  {!r.blocked && (
                    <div className="bk-acts">
                      <button type="button" className={r.heart ? 'on' : ''} onClick={() => store?.setHeart(r.id, !r.heart)}>
                        {r.heart ? '❤️' : '🤍'}
                      </button>
                      {r.picked ? (
                        <span className="picked">공개 픽 완료</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setTarget(r)
                            inputRef.current?.focus()
                          }}
                        >
                          공개 픽으로 대답
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      <form className="bk-compose" onSubmit={submit}>
        {target && (
          <div className="bk-target">
            <span>
              <b>{target.nickname}</b> 님 답장에 공개 대답 · 모두에게 공개돼요
              <small>{target.text}</small>
            </span>
            <button type="button" aria-label="공개 픽 취소" onClick={() => setTarget(null)}>
              ×
            </button>
          </div>
        )}
        <div className="bk-in">
          <input
            ref={inputRef}
            id="bench-draft"
            value={draft}
            maxLength={200}
            autoComplete="off"
            enterKeyHint="send"
            onChange={(e) => setDraft(e.target.value)}
            placeholder={target ? '모두가 볼 대답을 적어 주세요' : '구독한 팬 모두에게 보내기'}
          />
          <button className="bk-send" type="submit" disabled={!draft.trim() || busy}>
            {target ? '공개' : '전송'}
          </button>
        </div>
      </form>
    </main>
  )
}
