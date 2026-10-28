import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages(하위 경로)와 로컬 어디서나 열리도록 상대 경로로 빌드한다.
export default defineConfig({
  plugins: [react()],
  base: './',
})
