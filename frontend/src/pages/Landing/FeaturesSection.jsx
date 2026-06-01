import React, { useRef, useEffect } from 'react'
import { cardEntrance, sectionTitleReveal, onScrollInView } from '../../animations/animations'
import './FeaturesSection.css'

const FEATURES = [
  {
    id: 'feature-write',
    icon: '✍️',
    title: 'Write in Hinglish',
    desc: 'Code with keywords like let_him_cook, boliye, agar, and pov. If you understand desi internet culture, you already know H-Script.',
    tag: 'Syntax',
    color: '#7c3aed',
  },
  {
    id: 'feature-run',
    icon: '⚡',
    title: 'Run Instantly',
    desc: 'No setup. No install. The entire H-Script interpreter runs in your browser. Write code and see output in milliseconds.',
    tag: 'Performance',
    color: '#f97316',
  },
  {
    id: 'feature-oop',
    icon: '🏗️',
    title: 'Full OOP Support',
    desc: 'Classes (squad), inheritance (nepo_baby_of), private props, super calls (buzurg), closures — real language features.',
    tag: 'OOP',
    color: '#a855f7',
  },
  {
    id: 'feature-hof',
    icon: '🔗',
    title: 'Functional Power',
    desc: 'map_karo, filter_karo, reduce_karo, forEach_karo — full higher-order functions with chainable array methods.',
    tag: 'Phase 4',
    color: '#06b6d4',
  },
  {
    id: 'feature-ai',
    icon: '🤖',
    title: 'AI Assistant',
    desc: 'Agentic AI that understands H-Script. Ask it to generate code, debug errors, review your file, or explain anything.',
    tag: 'Coming Soon',
    color: '#10b981',
  },
  {
    id: 'feature-errors',
    icon: '💀',
    title: 'Meme Error Messages',
    desc: 'Errors reference Bollywood, Ohio rizzlers, Baahubali, and 3 Idiots. You will actually enjoy reading your error messages.',
    tag: 'Vibes',
    color: '#ec4899',
  },
]

export default function FeaturesSection() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const cardsRef   = useRef(null)

  useEffect(() => {
    onScrollInView(titleRef.current, () => {
      sectionTitleReveal(titleRef.current)
    })
    onScrollInView(cardsRef.current, () => {
      cardEntrance(cardsRef.current.querySelectorAll('.feature-card'))
    })
  }, [])

  return (
    <section className="features" id="features" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <p className="section-label">What makes it different</p>
          <h2 className="section-title" ref={titleRef}>
            Everything you need,<br />in{' '}
            <span className="gradient-text">desi style</span>
          </h2>
        </div>

        <div className="features__grid" ref={cardsRef}>
          {FEATURES.map((f) => (
            <div key={f.id} id={f.id} className="feature-card" style={{ '--card-accent': f.color }}>
              <div className="feature-card__top">
                <span className="feature-card__icon">{f.icon}</span>
                <span className="feature-card__tag">{f.tag}</span>
              </div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
              <div className="feature-card__glow" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
