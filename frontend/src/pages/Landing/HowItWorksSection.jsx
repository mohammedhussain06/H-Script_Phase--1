import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { onScrollInView, cardEntrance, sectionTitleReveal } from '../../animations/animations'
import './HowItWorksSection.css'

const STEPS = [
  {
    id: 'step-write',
    num: '01',
    icon: '✍️',
    title: 'Write H-Script',
    desc: 'Use our Monaco-powered IDE with full H-Script syntax highlighting, autocomplete, and meme error messages.',
  },
  {
    id: 'step-run',
    num: '02',
    icon: '⚡',
    title: 'Run Instantly',
    desc: 'Hit Run. The interpreter executes in your browser — zero latency, zero setup. Output appears in the terminal panel.',
  },
  {
    id: 'step-ai',
    num: '03',
    icon: '🤖',
    title: 'Ask the AI',
    desc: 'Stuck? Ask the agentic AI to debug, generate, refactor, or explain your code. It speaks H-Script natively.',
  },
]

export default function HowItWorksSection() {
  const titleRef   = useRef(null)
  const stepsRef   = useRef(null)

  useEffect(() => {
    onScrollInView(titleRef.current, () => sectionTitleReveal(titleRef.current))
    onScrollInView(stepsRef.current, () => cardEntrance(stepsRef.current.querySelectorAll('.hiw-step')))
  }, [])

  return (
    <section className="hiw" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Simple by design</p>
          <h2 className="section-title" ref={titleRef}>
            How it <span className="gradient-text">works</span>
          </h2>
        </div>

        <div className="hiw__steps" ref={stepsRef}>
          {STEPS.map((step, i) => (
            <React.Fragment key={step.id}>
              <div className="hiw-step" id={step.id}>
                <div className="hiw-step__num">{step.num}</div>
                <div className="hiw-step__icon">{step.icon}</div>
                <h3 className="hiw-step__title">{step.title}</h3>
                <p className="hiw-step__desc">{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hiw__connector">
                  <div className="hiw__connector-line" />
                  <span className="hiw__connector-arrow">→</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* CTA banner */}
        <div className="hiw__cta-banner">
          <p className="hiw__cta-text">Ready to write your first H-Script program?</p>
          <Link to="/ide" className="btn-primary" id="hiw-try-ide">
            Open IDE 🔥
          </Link>
        </div>
      </div>
    </section>
  )
}
