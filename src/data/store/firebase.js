// Firebase(Firestore + 익명 로그인) 저장소. 청중 전원이 실시간으로 같은 데이터를 본다.
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { firebaseConfig, BENCH_EMAIL } from '../config.js'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const fs = getFirestore(app)

const ts = (v) => (v && typeof v.toMillis === 'function' ? v.toMillis() : v || Date.now())
const rows = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: ts(d.data().createdAt) }))
const listen = (q, cb) => onSnapshot(q, (s) => cb(rows(s)), (e) => console.warn('[dugout]', e.code))

function currentUser() {
  return new Promise((resolve) => {
    const off = onAuthStateChanged(auth, (u) => {
      off()
      resolve(u)
    })
  })
}

export const firebaseStore = {
  mode: 'firebase',
  async init() {
    let u = await currentUser()
    if (!u) u = (await signInAnonymously(auth)).user
    return { uid: u.uid }
  },
  async saveProfile(userId, profile) {
    await setDoc(doc(fs, 'users', userId), { ...profile, createdAt: serverTimestamp() })
  },
  subscribeFanCount(cb) {
    return onSnapshot(collection(fs, 'users'), (s) => cb(s.size), () => cb(0))
  },
  subscribeMessages(playerId, cb) {
    return listen(query(collection(fs, 'messages'), where('playerId', '==', playerId)), cb)
  },
  subscribeAllMessages(cb) {
    return listen(collection(fs, 'messages'), cb)
  },
  async sendMessage(playerId, text) {
    await addDoc(collection(fs, 'messages'), { playerId, text, createdAt: serverTimestamp() })
  },
  subscribeMyReplies(userId, playerId, cb) {
    return listen(
      query(collection(fs, 'replies'), where('uid', '==', userId), where('playerId', '==', playerId)),
      cb,
    )
  },
  subscribeRepliesForPlayer(playerId, cb) {
    return listen(query(collection(fs, 'replies'), where('playerId', '==', playerId)), cb)
  },
  async sendReply(reply) {
    await addDoc(collection(fs, 'replies'), {
      ...reply,
      heart: false,
      picked: false,
      createdAt: serverTimestamp(),
    })
  },
  async setHeart(replyId, value) {
    await updateDoc(doc(fs, 'replies', replyId), { heart: value })
  },
  async pickReply(reply, message, answer) {
    const batch = writeBatch(fs)
    batch.update(doc(fs, 'replies', reply.id), { picked: true })
    batch.set(doc(collection(fs, 'picks')), {
      playerId: reply.playerId,
      messageId: message.id,
      messageText: message.text,
      replyId: reply.id,
      replyText: reply.text,
      nickname: reply.nickname,
      team: reply.team,
      answer,
      createdAt: serverTimestamp(),
    })
    await batch.commit()
  },
  subscribePicks(cb) {
    return listen(collection(fs, 'picks'), cb)
  },
  async benchLogin(password) {
    try {
      await signInWithEmailAndPassword(auth, BENCH_EMAIL, password)
      return true
    } catch {
      return false
    }
  },
}
