import React, { useEffect, useRef } from 'react'
import { runButtonPulse, errorShake } from '../../animations/animations'
import './Terminal.css'

export default function Terminal({ output, errors, isRunning }) {
  const bottomRef = useRef(null)
  const panelRef  = useRef(null)

  // Auto-scroll to bottom on new output
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [output, errors])

  // Shake on error
  useEffect(() => {
    if (errors.length > 0) {
      errorShake(panelRef.current)
    }
  }, [errors])

  const isEmpty = output.length === 0 && errors.length === 0 && !isRunning

  return (
    <div className="terminal" ref={panelRef} id="terminal-panel">
      {/* Terminal header */}
      <div className="terminal__header">
        <div className="terminal__dots">
          <span className="terminal__dot terminal__dot--red"    />
          <span className="terminal__dot terminal__dot--yellow" />
          <span className="terminal__dot terminal__dot--green"  />
        </div>
        <span className="terminal__title">Output</span>
        <span className={`terminal__status ${isRunning ? 'running' : errors.length > 0 ? 'error' : output.length > 0 ? 'ok' : ''}`}>
          {isRunning ? '● Running...' : errors.length > 0 ? '✖ Error' : output.length > 0 ? '✔ Done' : ''}
        </span>
      </div>

      {/* Output lines */}
      <div className="terminal__body">
        {isEmpty && (
          <div className="terminal__empty">
            <span className="terminal__prompt">$</span>
            <span className="terminal__placeholder"> Run your code to see output here...</span>
          </div>
        )}

        {isRunning && (
          <div className="terminal__line terminal__line--running">
            <span className="terminal__spinner">⟳</span>
            <span> Running...</span>
          </div>
        )}

        {output.map((line, i) => (
          <div key={i} className="terminal__line terminal__line--output">
            <span className="terminal__prompt">›</span>
            <span className="terminal__text">{line}</span>
          </div>
        ))}

        {errors.map((err, i) => (
          <div key={i} className="terminal__line terminal__line--error">
            <span className="terminal__err-icon">✖</span>
            <span className="terminal__text terminal__text--error">{err}</span>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
