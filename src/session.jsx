import { createContext, useContext, useEffect, useState } from 'react'
import { getStore } from './data/store/index.js'

// 앱 전체가 함께 쓰는 상태: 저장소, 내 uid, 내 프로필(닉네임·응원 구단)
const Ctx = createContext(null)
const PROFILE_KEY = 'dugout-profile-v1'

function readProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null')
  } catch {
    return null
  }
}

export function SessionProvider({ children }) {
  const [store, setStore] = useState(null)
  const [uid, setUid] = useState(null)
  const [profile, setProfileState] = useState(readProfile)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    getStore()
      .then(async (s) => {
        const { uid } = await s.init()
        if (!alive) return
        setStore(s)
        setUid(uid)
      })
      .catch((e) => {
        console.error(e)
        if (alive) setError('서버에 연결하지 못했어요. 잠시 후 새로고침해 주세요.')
      })
    return () => {
      alive = false
    }
  }, [])

  const saveProfile = async (p) => {
    setProfileState(p)
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(p))
    } catch {
      /* 무시 */
    }
    if (store && uid) await store.saveProfile(uid, p)
  }

  // 청중 로그아웃: 프로필·플랜·읽음 표시를 지우고 새 계정으로 바꾼다
  const logout = async () => {
    try {
      for (const k of [PROFILE_KEY, 'dugout-plan', 'dugout-seen', 'dugout-bench']) {
        localStorage.removeItem(k)
        sessionStorage.removeItem(k)
      }
    } catch {
      /* 무시 */
    }
    setProfileState(null)
    if (store) {
      const { uid: next } = await store.logout()
      setUid(next)
    }
  }

  return (
    <Ctx.Provider value={{ store, uid, profile, saveProfile, logout, error }}>{children}</Ctx.Provider>
  )
}

export const useSession = () => useContext(Ctx)

// 저장소 구독을 React 상태로 바꿔 주는 도우미
export function useSub(subscribe, deps, initial) {
  const [value, setValue] = useState(initial)
  useEffect(() => {
    const off = subscribe ? subscribe(setValue) : null
    return () => {
      if (typeof off === 'function') off()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return value
}
