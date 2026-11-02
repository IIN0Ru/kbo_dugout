// Firebase 설정. 비어 있으면 서버 없이 '로컬 모드'로 동작한다.
// (로컬 모드: 같은 브라우저의 탭끼리만 데이터가 공유됨)
// Firebase 콘솔 → 프로젝트 설정 → 내 앱 → firebaseConfig 값을 그대로 붙여 넣는다.
export const firebaseConfig = {
  apiKey: 'AIzaSyDCggcQmTvU8EyW9Feu9Kswr3vMqcCSuf0',
  authDomain: 'dugout-demo.firebaseapp.com',
  projectId: 'dugout-demo',
  storageBucket: 'dugout-demo.firebasestorage.app',
  messagingSenderId: '800001208979',
  appId: '1:800001208979:web:5c15749ee938d5c7bb1366',
}

export const useFirebase = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

// 발표자(선수 역할) 계정. Firebase Authentication에 이메일/비밀번호 사용자로 만들어 둔다.
export const BENCH_EMAIL = 'bench@dugout.app'

// 로컬 모드에서 쓰는 선수 화면 비밀번호
export const LOCAL_BENCH_PASSWORD = 'dugout'
