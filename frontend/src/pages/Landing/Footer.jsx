import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container footer__inner">

        {/* Brand */}
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="footer__logo-icon">H</span>
            <span>Script</span>
            <span>🔥</span>
          </div>
          <p className="footer__tagline">
            The desi programming language.<br />
            Built for fun, vibes, and the culture.
          </p>
          <p className="footer__credit">
            Made with ❤️ by <strong>Mohammed Hussain</strong>
          </p>
        </div>

        {/* Links */}
        <div className="footer__links">
          <div className="footer__col">
            <h4 className="footer__col-title">Language</h4>
            <Link to="/docs" className="footer__link">Documentation</Link>
            <Link to="/docs" className="footer__link">Phase 1 — Core</Link>
            <Link to="/docs" className="footer__link">Phase 2 — OOP</Link>
            <Link to="/docs" className="footer__link">Phase 3 — Advanced</Link>
            <Link to="/docs" className="footer__link">Phase 4 — HOF + Import</Link>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">IDE</h4>
            <Link to="/ide"       className="footer__link">Try IDE (Guest)</Link>
            <Link to="/login"     className="footer__link">Login / Sign Up</Link>
            <Link to="/dashboard" className="footer__link">Dashboard</Link>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Project</h4>
            <a
              href="https://github.com/mohammedhussain06/H-Script_Phase--1"
              target="_blank" rel="noopener noreferrer"
              className="footer__link"
            >
              GitHub ↗
            </a>
            <a href="/#features"     className="footer__link">Features</a>
            <a href="/#how-it-works" className="footer__link">How It Works</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom container">
        <p className="footer__copy">© 2025 H-Script. No cap fr fr. 🔥</p>
        <div className="footer__langs">
          <span>Built with</span>
          <span className="footer__chip">React</span>
          <span className="footer__chip">Three.js</span>
          <span className="footer__chip">Anime.js</span>
          <span className="footer__chip">Node.js</span>
        </div>
      </div>
    </footer>
  )
}
