import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { playerById, teamById, SEED_MESSAGES, RESTING } from '../data/teams.js'
import { useSession, useSub } from '../session.jsx'
import { PlayerTile, timeLabel, fmt } from '../components/ui.jsx'
import { findBadWord, REPLY_MAX_LEN, REPLIES_PER_MESSAGE } from '../data/filter.js'

function readPlan() {
  try {
    return localStorage.getItem('dugout-plan') || 'member'
  } catch {
    return 'member'
  }
}

export default function Channel() {
  const { playerId } = useParams()
  const nav = useNavigate()
  const { store, uid, profile } = useSession()
  const player = playerById(playerId)
  const team = teamById(player?.teamId)
  const rest = RESTING[playerId]

  const live = useSub(store ? (cb) => store.subscribeMessages(playerId, cb) : null, [store, playerId], [])
  const mine = useSub(
    store && uid ? (cb) => store.subscribeMyReplies(uid, playerId, cb) : null,
    [store, uid, playerId],
    [],
  )
  const fans = useSub(store ? (cb) => store.subscribeFanCount(cb) : null, [store], 0)
  const allPicks = useSub(store ? (cb) => store.subscribePicks(cb) : null, [store], [])
  const picks = useMemo(() => allPicks.filter((k) => k.playerId === playerId && !k.removed), [allPicks, playerId])

  const messages = useMemo(
    () => [...SEED_MESSAGES.filter((m) => m.playerId === playerId), ...live].sort((a, b) => a.createdAt - b.createdAt),
    [live, playerId],
  )
  const last = messages[messages.length - 1]
  const byMsg = useMemo(() => {
    const g = {}
    for (const r of [...mine].sort((a, b) => a.createdAt - b.createdAt)) (g[r.messageId] ||= []).push(r)
    return g
  }, [mine])

  // 선수 메시지 묶음(turn)과 공개 픽 카드를 시간순으로 섞는다 → 모든 팬의 채팅방에 같은 카드가 끼어든다
  const timeline = useMemo(
    () =>
      [
        ...messages.map((m) => ({ kind: 'turn', at: m.createdAt, m })),
        ...picks.map((k) => ({ kind: 'pick', at: k.createdAt, k })),
      ].sort((a, b) => a.at - b.at),
    [messages, picks],
  )

  // 새 공개 픽 알림: 채팅방에 들어온 뒤 새로 올라온 픽만 상단에 3초 띄운다
  const mountedAt = useRef(Date.now())
  const announced = useRef(new Set())
  const [toast, setToast] = useState(null)
  useEffect(() => {
    const fresh = picks.filter((k) => k.createdAt > mountedAt.current && !announced.current.has(k.id))
    if (!fresh.length) return
    fresh.forEach((k) => announced.current.add(k.id))
    setToast(fresh.sort((a, b) => b.createdAt - a.createdAt)[0])
  }, [picks])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [warn, setWarn] = useState('')
  const [plan, setPlan] = useState(readPlan)
  const [showInfo, setShowInfo] = useState(true)
  const endRef = useRef(null)

  // 읽음 표시 저장
  useEffect(() => {
    if (!last) return
    try {
      const seen = JSON.parse(localStorage.getItem('dugout-seen') || '{}')
      seen[playerId] = last.createdAt
      localStorage.setItem('dugout-seen', JSON.stringify(seen))
    } catch {
      /* 무시 */
    }
  }, [last, playerId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length, mine.length, picks.length])

  if (!player) return <main className="page lt center">선수를 찾을 수 없어요.</main>
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

  const used = last ? (byMsg[last.id] || []).length : 0
  const left = Math.max(0, REPLIES_PER_MESSAGE - used)
  const canReply = plan === 'member' && last && left > 0 && !rest

  const send = async (e) => {
    e.preventDefault()
    const t = text.trim()
    if (!t || !canReply || sending) return
    // 1차 필터: 금칙어가 있으면 서버로 보내지 않고 입력창에 그대로 둔다
    if (findBadWord(t)) {
      setWarn('쓸 수 없는 말이 들어 있어 보내지 않았어요. 내용을 고쳐 주세요.')
      return
    }
    setSending(true)
    try {
      await store.sendReply({
        messageId: last.id,
        playerId,
        uid,
        nickname: profile.nickname,
        team: profile.team,
        text: t,
      })
      setText('')
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="page lt channel chw" style={{ '--tc': team.color }}>
      <header className="chw-top">
        <button className="lt-back" type="button" aria-label="뒤로" onClick={() => nav(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <span className="chw-num">#{player.no}</span>
        <span className="chw-title">
          <b>
            {player.pos} · {team.name}
          </b>
          <small>구독 팬 {fmt(fans)}명</small>
        </span>
        {toast && (
          <button
            type="button"
            className="pick-toast"
            key={toast.id}
            onClick={() => {
              document.getElementById(`pick-${toast.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              setToast(null)
            }}
          >
            <span className="pick-led">PICK</span>
            <span className="pick-toast-t">
              <b>{toast.replyId && mine.some((r) => r.id === toast.replyId) ? '내 답장이 뽑혔어요!' : `${toast.nickname} 님 답장이 뽑혔어요`}</b>
              <small>
                #{player.no} “{toast.answer}”
              </small>
            </span>
            <i aria-hidden="true">›</i>
          </button>
        )}
      </header>

      {showInfo && (
        <div className="info">
          <p>
            선수 메시지는 <b>모두에게 똑같이</b>, 내 답장은 <b>선수에게만</b> 가요. 선수가 고른 답장은{' '}
            <b>공개 픽</b>으로 모두에게 보여요.
          </p>
          <button type="button" aria-label="안내 닫기" onClick={() => setShowInfo(false)}>
            ×
          </button>
        </div>
      )}

      <div className="thread">
        {rest && (
          <div className="rest-card">
            <span className="rest-pill">휴식 중</span>
            <b>{rest.note}</b>
            <div className="gamecard">
              <small>GAME CARD · 자동</small>
              <span>{rest.card}</span>
            </div>
            <p className="tiny muted">선수는 메시지를 보낼 의무가 없어요. 쉬는 동안엔 경기 기록 카드가 채널을 채워요.</p>
          </div>
        )}

        {!rest && messages.length === 0 && (
          <div className="empty">
            <b>아직 메시지가 없어요</b>
            <p>선수가 메시지를 보내면 구독한 팬 모두에게 동시에 도착해요.</p>
          </div>
        )}

        {timeline.map((it) => {
          if (it.kind === 'pick') {
            const k = it.k
            const isMine = mine.some((r) => r.id === k.replyId)
            return (
              <article key={k.id} id={`pick-${k.id}`} className={`pick-card ${isMine ? 'mine-pick' : ''}`}>
                <div className="pick-card-h">
                  <span className="pick-led">PICK</span>
                  <small>{isMine ? '내 답장을 선수가 골랐어요' : '선수가 고른 답장'} · {timeLabel(k.createdAt)}</small>
                </div>
                {k.messageText && <p className="pick-card-q">“{k.messageText}”에 대한 답장</p>}
                <p className="pick-card-r">
                  <b>{k.nickname}</b>
                  {k.replyText}
                </p>
                <div className="pick-card-a">
                  <PlayerTile player={player} size={24} radius={12} />
                  <p>{k.answer}</p>
                </div>
              </article>
            )
          }
          const m = it.m
          return (
          <div key={m.id} className="turn">
            <div className="msg">
              <PlayerTile player={player} size={30} radius={15} />
              <div>
                <div className="bub pl">{m.text}</div>
                <div className="meta">
                  <span className="rcpt">구독 팬 {fmt(Math.max(fans, 1))}명이 함께 받았어요</span>
                  <span>{timeLabel(m.createdAt)}</span>
                </div>
              </div>
            </div>
            {(byMsg[m.id] || []).map((r) => (
              <div key={r.id} className="mine">
                <div className={`bub fan ${r.blocked || r.removed ? 'blocked' : ''}`}>{r.text}</div>
                <div className="state">
                  {r.removed ? (
                    <span className="st-block">운영자가 삭제한 답장이에요 · {r.removedReason || '운영 정책 위반'}</span>
                  ) : r.blocked ? (
                    <span className="st-block">금칙어가 있어 선수에게 전달되지 않았어요</span>
                  ) : r.picked ? (
                    <span className="st-pick">공개 픽 선정 · 모두에게 공개됐어요</span>
                  ) : r.heart ? (
                    <span className="st-heart">❤️ 선수가 반응했어요</span>
                  ) : (
                    <span>선수에게만 전달됨</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          )
        })}
        <div ref={endRef} />
      </div>

      {warn && (
        <p className="reply-warn" role="alert">
          {warn}
        </p>
      )}
      <form className="composer" onSubmit={send}>
        {plan !== 'member' ? (
          <div className="locked">
            <span>답장은 멤버십에서 할 수 있어요</span>
            <button
              type="button"
              className="btn-mini"
              onClick={() => {
                try {
                  localStorage.setItem('dugout-plan', 'member')
                } catch {
                  /* 무시 */
                }
                setPlan('member')
              }}
            >
              멤버십 체험
            </button>
          </div>
        ) : rest ? (
          <div className="locked">
            <span>선수가 쉬는 중이라 답장을 받지 않아요</span>
          </div>
        ) : !last ? (
          <div className="locked">
            <span>선수의 메시지가 오면 답장할 수 있어요</span>
          </div>
        ) : left === 0 ? (
          <div className="locked">
            <span>이 메시지에 보낼 수 있는 답장을 다 썼어요 ({REPLIES_PER_MESSAGE}/{REPLIES_PER_MESSAGE})</span>
          </div>
        ) : (
          <>
            <input
              id="reply"
              value={text}
              maxLength={REPLY_MAX_LEN}
              onChange={(e) => {
                setText(e.target.value)
                if (warn) setWarn('')
              }}
              placeholder={`답장 보내기 (${left}번 남음)`}
              autoComplete="off"
              enterKeyHint="send"
            />
            <button className="send" type="submit" disabled={!text.trim() || sending} aria-label="보내기">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 11.5L21 3l-8.5 18-2-7.5L3 11.5z" />
              </svg>
            </button>
          </>
        )}
      </form>
    </main>
  )
}
