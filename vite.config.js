import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// 배포 주소: https://iin0ru.github.io/kbo_dugout/
// 빌드·미리보기(npm run build / preview)에서만 저장소 이름을 경로 앞에 붙이고,
// 개발 서버(npm run dev)는 localhost:5173/ 그대로 쓴다.
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  base: command === 'build' || isPreview ? '/kbo_dugout/' : '/',
}))
