// 서버 없는 로컬 저장소. localStorage에 저장하고 BroadcastChannel로 같은 브라우저의 다른 탭에 알린다.
import { LOCAL_BENCH_PASSWORD } from '../config.js'

const KEY = 'dugout-local-db-v1'
const empty = () => ({ users: {}, messages: [], replies: [], picks: [] })

function load() {
  try {
    return { ...empty(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return empty()
  }
}
let db = load()
const listeners = new Set()
let channel = null
try {
  channel = new BroadcastChannel('dugout-local')
  channel.onmessage = () => {
    db = load()
    listeners.forEach((fn) => fn())
  }
} catch {
  /* BroadcastChannel 미지원: 같은 탭 안에서만 갱신 */
}

function commit() {
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
  } catch {
    /* 저장 실패해도 메모리 상태로 계속 */
  }
  listeners.forEach((fn) => fn())
  channel?.postMessage('changed')
}

function watch(select, cb) {
  const run = () => cb(select(db))
  listeners.add(run)
  run()
  return () => listeners.delete(run)
}

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

export const localStore = {
  mode: 'local',
  async init() {
    let id
    try {
      id = localStorage.getItem('dugout-uid')
      if (!id) {
        id = uid()
        localStorage.setItem('dugout-uid', id)
      }
    } catch {
      id = uid()
    }
    return { uid: id }
  },
  async logout() {
    const id = uid()
    try {
      localStorage.setItem('dugout-uid', id)
    } catch {
      /* 무시 */
    }
    return { uid: id }
  },
  async saveProfile(userId, profile) {
    db.users[userId] = { ...profile, createdAt: Date.now() }
    commit()
  },
  subscribeFanCount(cb) {
    return watch((d) => Object.keys(d.users).length, cb)
  },
  subscribeMessages(playerId, cb) {
    return watch((d) => d.messages.filter((m) => m.playerId === playerId), cb)
  },
  subscribeAllMessages(cb) {
    return watch((d) => d.messages, cb)
  },
  async sendMessage(playerId, text) {
    db.messages.push({ id: uid(), playerId, text, createdAt: Date.now() })
    commit()
  },
  subscribeMyReplies(userId, playerId, cb) {
    return watch((d) => d.replies.filter((r) => r.uid === userId && r.playerId === playerId), cb)
  },
  subscribeAllReplies(cb) {
    return watch((d) => d.replies, cb)
  },
  subscribeRepliesForPlayer(playerId, cb) {
    return watch((d) => d.replies.filter((r) => r.playerId === playerId), cb)
  },
  async sendReply(reply) {
    db.replies.push({ ...reply, id: uid(), heart: false, picked: false, createdAt: Date.now() })
    commit()
  },
  async setHeart(replyId, value) {
    const r = db.replies.find((x) => x.id === replyId)
    if (r) r.heart = value
    commit()
  },
  async pickReply(reply, message, answer) {
    const r = db.replies.find((x) => x.id === reply.id)
    if (r) r.picked = true
    db.picks.push({
      id: uid(),
      playerId: reply.playerId,
      messageId: message.id,
      messageText: message.text,
      replyId: reply.id,
      replyText: reply.text,
      nickname: reply.nickname,
      team: reply.team,
      answer,
      createdAt: Date.now(),
    })
    commit()
  },
  subscribePicks(cb) {
    return watch((d) => d.picks, cb)
  },
  async benchLogin(password) {
    return password === LOCAL_BENCH_PASSWORD
  },
}
