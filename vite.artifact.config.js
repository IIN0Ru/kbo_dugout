// 공유용 페이지(Claude 아티팩트) 빌드 전용 설정.
// React는 CDN UMD 전역으로 불러오고, 앱 코드만 하나의 IIFE로 묶는다.
// 일반 개발·배포는 vite.config.js(npm run dev / npm run build)를 쓴다.
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-artifact',
    cssCodeSplit: false,
    rollupOptions: {
      input: 'src/main.jsx',
      external: ['react', 'react-dom/client', 'react/jsx-runtime'],
      output: {
        format: 'iife',
        entryFileNames: 'app.js',
        assetFileNames: 'app.[ext]',
        globals: {
          react: 'React',
          'react-dom/client': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
        },
      },
    },
  },
})
