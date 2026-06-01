import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Landing   from './pages/Landing/Landing.jsx'
import IDE       from './pages/IDE/IDE.jsx'
import Docs      from './pages/Docs/Docs.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Login     from './pages/Login/Login.jsx'
import NotFound  from './pages/NotFound/NotFound.jsx'
import Navbar    from './components/Navbar/Navbar.jsx'

// Pages that use their own full-screen layout (no top navbar)
const FULL_SCREEN_ROUTES = ['/ide', '/docs']

export default function App() {
  const { pathname } = useLocation()
  const isFullScreen  = FULL_SCREEN_ROUTES.some(r => pathname.startsWith(r))

  return (
    <>
      {!isFullScreen && <Navbar />}
      <Routes>
        <Route path="/"            element={<Landing />}   />
        <Route path="/ide"         element={<IDE />}       />
        <Route path="/ide/:fileId" element={<IDE />}       />
        <Route path="/docs"        element={<Docs />}      />
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/login"       element={<Login />}     />
        {/* 404 — catch all */}
        <Route path="*"            element={<NotFound />}  />
      </Routes>
    </>
  )
}
