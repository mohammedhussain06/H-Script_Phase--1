import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  const navigate = useNavigate()

  useEffect(() => {
    // Auto-redirect after 8 seconds
    const t = setTimeout(() => navigate('/'), 8000)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="nf" id="not-found-page">
      {/* Animated glitch background */}
      <div className="nf__grid" />

      <div className="nf__content">
        <div className="nf__code-wrap">
          <span className="nf__glitch" data-text="404">404</span>
        </div>

        <div className="nf__emoji">🤖</div>
        <h1 className="nf__title">Page Not Found</h1>
        <p className="nf__msg">
          Yaar, yeh page toh exist hi nahi karta 😅<br />
          <code>RuntimeError: URL ka koi ghar nahi bc 🏠</code>
        </p>

        <div className="nf__actions">
          <Link to="/"    className="btn-primary"   id="nf-home">🏠 Go Home</Link>
          <Link to="/ide" className="btn-secondary" id="nf-ide">⚡ Open IDE</Link>
        </div>

        <p className="nf__redirect">Redirecting to home in 8 seconds...</p>
      </div>
    </div>
  )
}
