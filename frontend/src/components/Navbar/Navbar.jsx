import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navbarEntrance } from '../../animations/animations'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const navRef                    = useRef(null)
  const location                  = useLocation()

  // Scroll-aware frosted glass
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Entrance animation
  useEffect(() => {
    navbarEntrance(navRef.current)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <nav ref={navRef} className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-navbar">
      <div className="navbar__inner container">

        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">H</span>
          <span className="navbar__logo-text">Script</span>
          <span className="navbar__logo-fire">🔥</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar__links">
          <Link to="/docs"      className={`navbar__link ${location.pathname === '/docs'      ? 'active' : ''}`}>Docs</Link>
          <Link to="/ide"       className={`navbar__link ${location.pathname === '/ide'       ? 'active' : ''}`}>IDE</Link>
          <a
            href="https://github.com/mohammedhussain06/H-Script_Phase--1"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__link"
          >
            GitHub
          </a>
        </div>

        {/* Auth */}
        <div className="navbar__auth">
          <Link to="/ide"   className="btn-secondary navbar__btn-try">Try IDE</Link>
          <Link to="/login" className="btn-primary  navbar__btn-login">Login</Link>
        </div>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="hamburger-btn"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        <Link to="/docs"  className="navbar__mobile-link">Docs</Link>
        <Link to="/ide"   className="navbar__mobile-link">IDE</Link>
        <Link to="/login" className="navbar__mobile-link">Login</Link>
        <Link to="/ide"   className="btn-primary navbar__mobile-cta">Try IDE Free</Link>
      </div>
    </nav>
  )
}
