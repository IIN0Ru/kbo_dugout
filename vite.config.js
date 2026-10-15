import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// 배포 주소: https://iin0ru.github.io/kbo_dugout/
// 빌드할 때만 저장소 이름을 경로 앞에 붙이고, 개발 서버(npm run dev)는 localhost:5173/ 그대로 쓴다.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/kbo_dugout/' : '/',
}))
