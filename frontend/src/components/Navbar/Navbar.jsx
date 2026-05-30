// Navbar — Phase 5A
// TODO: Logo, nav links, auth buttons
import React from 'react'
import { Link } from 'react-router-dom'
export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">H-Script 🔥</Link>
      <div className="navbar-links">
        <Link to="/docs">Docs</Link>
        <Link to="/ide">IDE</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  )
}
