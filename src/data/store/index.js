import { useFirebase } from '../config.js'
import { localStore } from './local.js'

// Firebase 설정이 있으면 Firebase 저장소를, 없으면 로컬 저장소를 쓴다.
// Firebase SDK는 필요할 때만 불러온다.
let storePromise
export function getStore() {
  if (!storePromise) {
    storePromise = useFirebase
      ? import('./firebase.js').then((m) => m.firebaseStore)
      : Promise.resolve(localStore)
  }
  return storePromise
}
