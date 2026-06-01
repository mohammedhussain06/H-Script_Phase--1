import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Editor   from '../../components/Editor/Editor.jsx'
import Terminal from '../../components/Terminal/Terminal.jsx'
import Toast    from '../../components/Toast/Toast.jsx'
import { runCode } from '../../runtime/index.js'
import { runButtonPulse } from '../../animations/animations.js'
import { saveFile, incrementRuns } from '../../utils/fileStorage.js'
import './IDE.css'

const DEFAULT_FILENAME = 'main.hs'

const DEFAULT_CODE = `// Welcome to H-Script IDE 🔥
// Write your code below and hit Run! (Ctrl+Enter)

let_him_cook name = "bhai"
let_him_cook nums = [1, 2, 3, 4, 5]

pov greet(n) {
  wapas_karo \`Aye \${n}, kya haal hai!\`
}

boliye(greet(name))

// Higher-order functions
let_him_cook squares = nums.map_karo(pov(n) { wapas_karo n * n })
boliye(squares.milao(", "))

let_him_cook total = nums.reduce_karo(pov(acc, n) { wapas_karo acc + n }, 0)
boliye(\`Sum: \${total}\`)
`

// ── URL share encoding ──────────────────────────────────
function encodeCode(code) {
  try { return btoa(unescape(encodeURIComponent(code))) } catch { return '' }
}
function decodeCode(b64) {
  try { return decodeURIComponent(escape(atob(b64))) } catch { return null }
}

export default function IDE() {
  const [searchParams]                    = useSearchParams()
  const sharedCode                        = searchParams.get('code')
  const initialCode                       = sharedCode ? (decodeCode(sharedCode) ?? DEFAULT_CODE) : DEFAULT_CODE

  const [code,        setCode]            = useState(initialCode)
  const [output,      setOutput]          = useState([])
  const [errors,      setErrors]          = useState([])
  const [isRunning,   setIsRunning]       = useState(false)
  const [filename,    setFilename]        = useState(DEFAULT_FILENAME)
  const [editingName, setEditingName]     = useState(false)
  const [panelSize,   setPanelSize]       = useState(55)
  const [saved,       setSaved]           = useState(false)       // unsaved dot state
  const [toast,       setToast]           = useState(null)        // { msg, type }
  const [lineCount,   setLineCount]       = useState(0)
  const runBtnRef   = useRef(null)
  const dividerRef  = useRef(null)

  // Track line count from code
  useEffect(() => {
    setLineCount((code || '').split('\n').length)
    setSaved(false)
  }, [code])

  // ── Show toast helper ─────────────────────────────────
  const showToast = (msg, type = 'success') => setToast({ msg, type })

  // ── Run handler ───────────────────────────────────────
  const handleRun = useCallback(() => {
    if (isRunning) return
    try { runButtonPulse(runBtnRef.current) } catch (_) {}
    setIsRunning(true)
    setOutput([])
    setErrors([])

    requestAnimationFrame(() => {
      const result = runCode(code || '')
      setOutput(result.output)
      setErrors(result.errors)
      setIsRunning(false)
      incrementRuns(filename)
    })
  }, [code, isRunning, filename])

  // ── Save to localStorage ──────────────────────────────
  const handleSave = useCallback(() => {
    saveFile(filename, code || '')
    setSaved(true)
    showToast(`"${filename}" saved! 💾`, 'success')
  }, [filename, code])

  // ── Download .hs file ─────────────────────────────────
  const handleDownload = useCallback(() => {
    const blob = new Blob([code || ''], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = filename.endsWith('.hs') ? filename : `${filename}.hs`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Downloaded! 📥', 'info')
  }, [code, filename])

  // ── Share via URL ─────────────────────────────────────
  const handleShare = useCallback(() => {
    const encoded = encodeCode(code || '')
    const url     = `${window.location.origin}/ide?code=${encoded}`
    navigator.clipboard.writeText(url).then(() => {
      showToast('Share link copied! 🔗', 'success')
    }).catch(() => {
      showToast('Could not copy link', 'error')
    })
  }, [code])

  // ── Keyboard shortcuts ────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun() }
      if ((e.ctrlKey || e.metaKey) && e.key === 's')     { e.preventDefault(); handleSave() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleRun, handleSave])

  // ── Clear output ──────────────────────────────────────
  const handleClear = () => { setOutput([]); setErrors([]) }

  // ── Draggable divider ─────────────────────────────────
  const startDrag = (e) => {
    e.preventDefault()
    const startX   = e.clientX
    const startPct = panelSize
    const totalW   = document.querySelector('.ide__panels')?.clientWidth ?? 1

    const onMove = (ev) => {
      const pct = startPct + ((ev.clientX - startX) / totalW) * 100
      setPanelSize(Math.min(80, Math.max(20, pct)))
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
  }

  // ── File rename ───────────────────────────────────────
  const handleRename = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      setEditingName(false)
      if (!filename.trim()) setFilename(DEFAULT_FILENAME)
    }
  }

  return (
    <div className="ide" id="ide-page">

      {/* ── Top bar ──────────────────────────────────── */}
      <div className="ide__topbar">

        {/* Logo / Home */}
        <Link to="/" className="ide__logo" id="ide-home-link" title="Back to Home">
          <span className="ide__logo-icon">H</span>
          <span className="ide__logo-text">Script</span>
        </Link>

        {/* File tab */}
        <div className="ide__tabs">
          <div className="ide__tab ide__tab--active">
            <span className="ide__tab-icon">📄</span>
            {editingName ? (
              <input
                className="ide__tab-input"
                value={filename}
                onChange={e => setFilename(e.target.value)}
                onKeyDown={handleRename}
                onBlur={handleRename}
                autoFocus
              />
            ) : (
              <span
                className="ide__tab-name"
                onDoubleClick={() => setEditingName(true)}
                title="Double-click to rename"
              >
                {filename}
              </span>
            )}
            {!saved && <span className="ide__tab-dot" title="Unsaved changes" />}
          </div>
        </div>

        {/* Actions */}
        <div className="ide__actions">
          <Link to="/docs" className="ide__btn ide__btn--docs" id="btn-docs" title="Docs">
            📖 Docs
          </Link>
          <button className="ide__btn ide__btn--icon" onClick={handleShare} title="Share (copy link)" id="btn-share">
            🔗
          </button>
          <button className="ide__btn ide__btn--icon" onClick={handleDownload} title="Download .hs" id="btn-download">
            ⬇
          </button>
          <button className="ide__btn ide__btn--save" onClick={handleSave} title="Save (Ctrl+S)" id="btn-save">
            💾 Save
          </button>
          <button className="ide__btn ide__btn--clear" onClick={handleClear} title="Clear output" id="btn-clear">
            ✕ Clear
          </button>
          <button
            ref={runBtnRef}
            className={`ide__btn ide__btn--run ${isRunning ? 'running' : ''}`}
            onClick={handleRun}
            disabled={isRunning}
            title="Run  (Ctrl+Enter)"
            id="btn-run"
          >
            {isRunning ? '⟳ Running...' : '▶ Run'}
          </button>
        </div>
      </div>

      {/* ── Editor + Terminal ─────────────────────────── */}
      <div className="ide__panels">
        <div className="ide__editor-panel" style={{ width: `${panelSize}%` }}>
          <Editor
            value={code}
            onChange={(val) => setCode(val ?? '')}
          />
        </div>

        <div className="ide__divider" ref={dividerRef} onMouseDown={startDrag} title="Drag to resize">
          <div className="ide__divider-handle" />
        </div>

        <div className="ide__terminal-panel" style={{ width: `${100 - panelSize}%` }}>
          <Terminal output={output} errors={errors} isRunning={isRunning} />
        </div>
      </div>

      {/* ── Status bar ───────────────────────────────── */}
      <div className="ide__statusbar">
        <span className="ide__status-lang">🔥 H-Script</span>
        <span className="ide__status-hint">Ctrl+Enter · run &nbsp;|&nbsp; Ctrl+S · save</span>
        <span className="ide__status-lines">Ln {lineCount}</span>
        <span className="ide__status-info">
          {errors.length > 0
            ? `✖ ${errors.length} error${errors.length > 1 ? 's' : ''}`
            : output.length > 0
            ? `✔ ${output.length} line${output.length > 1 ? 's' : ''} of output`
            : saved ? '✓ Saved' : 'Ready'}
        </span>
      </div>

      {/* ── Toast ────────────────────────────────────── */}
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
