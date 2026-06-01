import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { onScrollInView, sectionTitleReveal, cardEntrance } from '../../animations/animations'
import './CodePreviewSection.css'

const CODE_SAMPLE = `// Student grade system in H-Script 🔥

squad Student {
  pov init(name, score) {
    this.name  = name
    this.score = score
  }
  pov grade() {
    wapas_karo this.score >= 90 ? "A 🏅"
           : this.score >= 75  ? "B 🥇"
           : this.score >= 50  ? "Pass 📝"
           : "Fail 💀"
  }
}

let_him_cook students = [
  new Student("Rahul", 88),
  new Student("Priya", 97),
  new Student("Raju",  42),
]

let_him_cook toppers = students
  .filter_karo(pov(s) { wapas_karo s.score >= 75 })
  .map_karo(pov(s)    { wapas_karo s.name })

boliye(toppers.milao(", "))
// → Rahul, Priya`

// Simple syntax highlight (no external dep needed)
function highlight(code) {
  return code
    .replace(/\/\/.*/g,           m => `<span class="ch-comment">${m}</span>`)
    .replace(/\b(squad|pov|let_him_cook|wapas_karo|new|boliye|filter_karo|map_karo)\b/g,
             m => `<span class="ch-keyword">${m}</span>`)
    .replace(/\b(this|null|no_cap|fraud)\b/g,
             m => `<span class="ch-special">${m}</span>`)
    .replace(/"([^"]*)"/g,        (m, g) => `<span class="ch-string">"${g}"</span>`)
    .replace(/(\d+)/g,            m => `<span class="ch-number">${m}</span>`)
    .replace(/(→.*)/g,            m => `<span class="ch-output">${m}</span>`)
}

export default function CodePreviewSection() {
  const titleRef   = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    onScrollInView(titleRef.current, () => sectionTitleReveal(titleRef.current))
    onScrollInView(sectionRef.current, () => cardEntrance(sectionRef.current.querySelectorAll('.code-preview__panel')))
  }, [])

  const lines = CODE_SAMPLE.split('\n')

  return (
    <section className="code-preview" id="code-preview" ref={sectionRef}>
      <div className="container code-preview__inner">

        {/* Left — description */}
        <div className="code-preview__panel code-preview__desc">
          <p className="section-label">Real code, real output</p>
          <h2 className="section-title" ref={titleRef} style={{ opacity: 1 }}>
            Feels familiar.<br />
            <span className="gradient-text">Looks legendary.</span>
          </h2>
          <ul className="code-preview__list">
            <li>✅ Classes, inheritance, private props</li>
            <li>✅ Higher-order functions with chaining</li>
            <li>✅ Template literals & ternary operators</li>
            <li>✅ Try/catch, JugaadMap, spread, closures</li>
            <li>✅ 27 stdlib functions built in</li>
          </ul>
          <div className="code-preview__ctas">
            <Link to="/docs" className="btn-secondary" id="code-read-docs">Read Full Docs</Link>
            <Link to="/ide"  className="btn-primary"   id="code-try-ide">Try It Now →</Link>
          </div>
        </div>

        {/* Right — code panel */}
        <div className="code-preview__panel code-preview__editor">
          {/* Window bar */}
          <div className="code-editor__bar">
            <span className="code-editor__dot red"   />
            <span className="code-editor__dot yellow"/>
            <span className="code-editor__dot green" />
            <span className="code-editor__filename">main.hs</span>
          </div>

          {/* Code */}
          <pre className="code-editor__code">
            {lines.map((line, i) => (
              <div key={i} className="code-editor__line">
                <span className="code-editor__ln">{i + 1}</span>
                <span
                  className="code-editor__text"
                  dangerouslySetInnerHTML={{ __html: highlight(line) || '&nbsp;' }}
                />
              </div>
            ))}
          </pre>
        </div>
      </div>
    </section>
  )
}
