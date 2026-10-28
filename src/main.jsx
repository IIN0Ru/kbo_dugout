import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 짧은 주소 '#bench'도 발표자 화면으로 보낸다 (공유 링크는 '#/bench' 형태를 그대로 넘기지 못할 때가 있음)
if (window.location.hash === '#bench') window.location.replace('#/bench')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
