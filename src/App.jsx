import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SessionProvider, useSession } from './session.jsx'
import Splash from './pages/Splash.jsx'
import Login from './pages/Login.jsx'
import Plan from './pages/Plan.jsx'
import Home from './pages/Home.jsx'
import Channel from './pages/Channel.jsx'
import Bench from './pages/Bench.jsx'
import Me from './pages/Me.jsx'

function ErrorBar() {
  const { error, store } = useSession()
  if (error) return <div className="topnote err-note">{error}</div>
  if (store?.mode === 'local')
    return <div className="topnote">로컬 모드 · 이 브라우저 안에서만 데이터가 공유돼요</div>
  return null
}

export default function App() {
  return (
    <SessionProvider>
      <HashRouter>
        <div className="app">
          <ErrorBar />
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/home" element={<Home />} />
            <Route path="/channel/:playerId" element={<Channel />} />
            <Route path="/bench" element={<Bench />} />
            <Route path="/me" element={<Me />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </HashRouter>
    </SessionProvider>
  )
}
