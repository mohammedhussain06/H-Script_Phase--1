import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing.jsx'
import IDE from './pages/IDE/IDE.jsx'
import Docs from './pages/Docs/Docs.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Login from './pages/Login/Login.jsx'
import Navbar from './components/Navbar/Navbar.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"              element={<Landing />} />
        <Route path="/ide"           element={<IDE />} />
        <Route path="/ide/:fileId"   element={<IDE />} />
        <Route path="/docs"          element={<Docs />} />
        <Route path="/dashboard"     element={<Dashboard />} />
        <Route path="/login"         element={<Login />} />
      </Routes>
    </>
  )
}
