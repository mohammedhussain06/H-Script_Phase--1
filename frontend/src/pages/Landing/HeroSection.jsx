import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { initHeroScene } from '../../three/HeroScene'
import { heroContentEntrance } from '../../animations/animations'
import './HeroSection.css'

export default function HeroSection() {
  const canvasRef  = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    let cleanup
    if (canvasRef.current) {
      cleanup = initHeroScene(canvasRef.current)
    }
    return () => { if (cleanup) cleanup() }
  }, [])

  useEffect(() => {
    if (contentRef.current) {
      const els = contentRef.current.querySelectorAll('.hero__animate')
      heroContentEntrance(els)
    }
  }, [])

  return (
    <section className="hero" id="hero">
      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="hero__canvas" />

      {/* Gradient overlay */}
      <div className="hero__overlay" />

      {/* Content */}
      <div className="hero__content container" ref={contentRef}>
        <div className="hero__badge hero__animate">
          <span className="hero__badge-dot" />
          Now in Phase 5 — Web IDE
        </div>

        <h1 className="hero__title hero__animate">
          Code in<br />
          <span className="gradient-text">H-Script</span>
        </h1>

        <p className="hero__tagline hero__animate">
          The Hinglish-powered esoteric programming language.<br />
          Write code like you talk — with memes, Bollywood, and 🔥 energy.
        </p>

        <div className="hero__keywords hero__animate">
          {['let_him_cook', 'boliye()', 'no_cap', 'pov fn()', 'squad'].map((k) => (
            <span key={k} className="hero__keyword">{k}</span>
          ))}
        </div>

        <div className="hero__ctas hero__animate">
          <Link to="/ide" className="btn-primary hero__cta-primary" id="hero-try-ide">
            Try IDE Free →
          </Link>
          <Link to="/docs" className="btn-secondary hero__cta-secondary" id="hero-read-docs">
            Read Docs
          </Link>
        </div>

        <p className="hero__sub hero__animate">
          No signup needed · Runs in your browser · Open source
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll">
        <div className="hero__scroll-line" />
        <span>scroll</span>
      </div>
    </section>
  )
}
