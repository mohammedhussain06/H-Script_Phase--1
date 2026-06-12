import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import Editor   from '../../components/Editor/Editor.jsx'
import Terminal from '../../components/Terminal/Terminal.jsx'
import Toast    from '../../components/Toast/Toast.jsx'
import AIPanel  from '../../components/AIPanel/AIPanel.jsx'
import { runCode } from '../../runtime/index.js'
import { runButtonPulse } from '../../animations/animations.js'
import { saveFile, incrementRuns } from '../../utils/fileStorage.js'
import { filesApi } from '../../api/files.js'
import { autocomplete, explainError } from '../../api/ai.js'
import { useAuth } from '../../context/AuthContext.jsx'
import './IDE.css'

const DEFAULT_FILENAME = 'main.hs'

const DEFAULT_CODE = `// Welcome to H-Script IDE \uD83D\uDD25
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

// ── URL share encoding ────────────────────────────────────
function encodeCode(code) {
  try { return btoa(unescape(encodeURIComponent(code))) } catch { return '' }
}
function decodeCode(b64) {
  try { return decodeURIComponent(escape(atob(b64))) } catch { return null }
}

// ── Ensure filename is unique against existingNames list ──
function makeUniqueName(name, existingNames) {
  if (!existingNames.includes(name)) return name
  const base = name.replace(/\.hs$/, '')
  let i = 1
  while (existingNames.includes(`${base}(${i}).hs`)) i++
  return `${base}(${i}).hs`
}

export default function IDE() {
  const { isLoggedIn }                    = useAuth()
  const navigate                          = useNavigate()
  const [searchParams]                    = useSearchParams()
  const sharedCode                        = searchParams.get('code')
  const fileId                            = searchParams.get('fileId') || null
  const initialCode                       = sharedCode ? (decodeCode(sharedCode) ?? DEFAULT_CODE) : DEFAULT_CODE

  const [code,           setCode]          = useState(initialCode)
  const [output,         setOutput]        = useState([])
  const [errors,         setErrors]        = useState([])
  const [isRunning,      setIsRunning]     = useState(false)
  const [filename,       setFilename]      = useState(DEFAULT_FILENAME)
  const [editingName,    setEditingName]   = useState(false)
  const [panelSize,      setPanelSize]     = useState(55)
  const [saved,          setSaved]         = useState(false)
  const [toast,          setToast]         = useState(null)
  const [lineCount,      setLineCount]     = useState(0)
  const [dbFileId,       setDbFileId]      = useState(fileId)
  const [showSaveModal,   setShowSaveModal]  = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [existingNames,   setExistingNames]   = useState([])
  // AI state
  const [aiOpen,         setAiOpen]        = useState(false)
  const [aiSuggestion,   setAiSuggestion]  = useState('')    // ghost text
  const [aiErrorInfo,    setAiErrorInfo]   = useState(null)  // { error_type, explanation, hint }
  const runBtnRef   = useRef(null)
  const dividerRef  = useRef(null)
  const acTimerRef  = useRef(null)   // autocomplete debounce timer

  // Load existing filenames once on mount (logged-in users only)
  useEffect(() => {
    if (!isLoggedIn) return
    filesApi.getAll()
      .then(files => setExistingNames(files.map(f => f.filename)))
      .catch(() => {})
  }, [isLoggedIn])

  // Track line count + trigger autocomplete (debounced 2500ms)
  useEffect(() => {
    setLineCount((code || '').split('\n').length)
    setSaved(false)

    // Autocomplete debounce — 2500ms to stay within free tier rate limits
    clearTimeout(acTimerRef.current)
    if (code && code.trim().length > 5) {
      acTimerRef.current = setTimeout(async () => {
        try {
          const completions = await autocomplete(code)
          if (completions && completions.length > 0) {
            setAiSuggestion(completions[0])
          }
        } catch { /* silent fail */ }
      }, 2500)
    } else {
      setAiSuggestion('')
    }
    return () => clearTimeout(acTimerRef.current)
  }, [code])

  // ── Toast helper ─────────────────────────────────────────
  const showToast = (msg, type = 'success') => setToast({ msg, type })

  // ── Run handler ──────────────────────────────────────────
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

      // Auto-trigger error explainer if errors returned
      if (result.errors && result.errors.length > 0) {
        setAiErrorInfo(null)
        explainError(code || '', result.errors.join(' ')).then(info => {
          setAiErrorInfo(info)
        }).catch(() => {})
      } else {
        setAiErrorInfo(null)
      }
    })
  }, [code, isRunning, filename])

  // ── Save — unique name + post-save modal ─────────────────
  const handleSave = useCallback(async () => {
    try {
      if (isLoggedIn) {
        const isNew = !dbFileId
        let usedName = filename

        if (isNew) {
          // New file: enforce unique name
          const uniqueName = makeUniqueName(filename, existingNames)
          if (uniqueName !== filename) {
            setFilename(uniqueName)
            usedName = uniqueName
            showToast(`Renamed to "${uniqueName}" — duplicate name`, 'info')
          }
          const file = await filesApi.create(usedName, code || '')
          setDbFileId(file.id)
          setExistingNames(prev => [...prev, usedName])
          setSaved(true)
          // Show modal on first save of a brand-new file
          setShowSaveModal(true)
        } else {
          // Updating: check if user renamed to a duplicate
          const namesExceptSelf = existingNames.filter(n => n !== filename)
          if (namesExceptSelf.includes(filename)) {
            const uniqueName = makeUniqueName(filename, namesExceptSelf)
            setFilename(uniqueName)
            usedName = uniqueName
            showToast(`Renamed to "${uniqueName}" — duplicate name`, 'info')
          }
          await filesApi.update(dbFileId, { filename: usedName, code: code || '' })
          setSaved(true)
          showToast(`"${usedName}" saved!`, 'success')
        }
      } else {
        // Guest: block save — prompt to sign in
        setShowLoginPrompt(true)
      }
    } catch {
      showToast('Save failed — is the backend running?', 'error')
    }
  }, [filename, code, isLoggedIn, dbFileId, existingNames])

  // ── Download .hs ─────────────────────────────────────────
  const handleDownload = useCallback(() => {
    const blob = new Blob([code || ''], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = filename.endsWith('.hs') ? filename : `${filename}.hs`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Downloaded!', 'info')
  }, [code, filename])

  // ── Share via URL ─────────────────────────────────────────
  const handleShare = useCallback(() => {
    const encoded = encodeCode(code || '')
    const url     = `${window.location.origin}/ide?code=${encoded}`
    navigator.clipboard.writeText(url)
      .then(() => showToast('Share link copied!', 'success'))
      .catch(() => showToast('Could not copy link', 'error'))
  }, [code])

  // ── Keyboard shortcuts ────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun() }
      if ((e.ctrlKey || e.metaKey) && e.key === 's')     { e.preventDefault(); handleSave() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleRun, handleSave])

  // ── Clear output ──────────────────────────────────────────
  const handleClear = () => { setOutput([]); setErrors([]) }

  // ── Draggable divider ─────────────────────────────────────
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

  // ── File rename ───────────────────────────────────────────
  const handleRename = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      setEditingName(false)
      if (!filename.trim()) setFilename(DEFAULT_FILENAME)
    }
  }

  return (
    <div className="ide" id="ide-page">

      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="ide__topbar">
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

          {/* Auth-aware buttons */}
          {isLoggedIn ? (
            <Link to="/dashboard" className="ide__btn ide__btn--docs" id="btn-dashboard" title="Dashboard">
              📊 Dashboard
            </Link>
          ) : (
            <Link to="/login?tab=signup" className="ide__btn ide__btn--docs" id="btn-signup" title="Sign Up" style={{ color: 'var(--accent-secondary)' }}>
              ✦ Sign Up
            </Link>
          )}

          <button className="ide__btn ide__btn--icon" onClick={handleShare} title="Share" id="btn-share">🔗</button>
          <button className="ide__btn ide__btn--icon" onClick={handleDownload} title="Download .hs" id="btn-download">⬇</button>
          <button
            className={`ide__btn ide__btn--ai ${aiOpen ? 'active' : ''}`}
            onClick={() => setAiOpen(o => !o)}
            title="AI Assistant"
            id="btn-ai"
          >
            ✦ AI
          </button>

          <button
            className="ide__btn ide__btn--save"
            onClick={handleSave}
            title={isLoggedIn ? 'Save (Ctrl+S)' : 'Sign in to save your files'}
            id="btn-save"
          >
            {isLoggedIn ? '💾' : '🔒'} Save
          </button>
          <button className="ide__btn ide__btn--clear" onClick={handleClear} title="Clear output" id="btn-clear">
            ✕ Clear
          </button>
          <button
            ref={runBtnRef}
            className={`ide__btn ide__btn--run ${isRunning ? 'running' : ''}`}
            onClick={handleRun}
            disabled={isRunning}
            title="Run (Ctrl+Enter)"
            id="btn-run"
          >
            {isRunning ? '⟳ Running...' : '▶ Run'}
          </button>
        </div>
      </div>

      {/* ── Editor + Terminal ───────────────────────────── */}
      <div className="ide__panels" style={{ marginRight: aiOpen ? '380px' : '0', transition: 'margin-right 0.22s ease' }}>
        <div className="ide__editor-panel" style={{ width: `${panelSize}%` }}>
          <Editor value={code} onChange={(val) => setCode(val ?? '')} ghostText={aiSuggestion} />
        </div>

        <div className="ide__divider" ref={dividerRef} onMouseDown={startDrag} title="Drag to resize">
          <div className="ide__divider-handle" />
        </div>

        <div className="ide__terminal-panel" style={{ width: `${100 - panelSize}%` }}>
          {/* AI Error Explainer banner — auto-shown when run produces errors */}
          {aiErrorInfo && (
            <div className="ide__ai-error-banner" id="ai-error-banner">
              <div className="ide__ai-error-header">
                <span className="ide__ai-error-type">✦ {aiErrorInfo.error_type}</span>
                <button className="ide__ai-error-close" onClick={() => setAiErrorInfo(null)}>✕</button>
              </div>
              <p className="ide__ai-error-msg">{aiErrorInfo.explanation}</p>
              {aiErrorInfo.hint && <p className="ide__ai-error-hint">💡 {aiErrorInfo.hint}</p>}
            </div>
          )}
          <Terminal output={output} errors={errors} isRunning={isRunning} />
        </div>
      </div>

      {/* ── Status bar ──────────────────────────────────── */}
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

      {/* ── Post-save modal ──────────────────────────────── */}
      {showSaveModal && (
        <div className="ide__modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="ide__modal" onClick={e => e.stopPropagation()}>
            <div className="ide__modal-icon">💾</div>
            <h3 className="ide__modal-title">File Saved!</h3>
            <p className="ide__modal-msg">
              <strong>"{filename}"</strong> has been saved to your account.
              <br />What would you like to do next?
            </p>
            <div className="ide__modal-actions">
              <button
                className="ide__modal-btn ide__modal-btn--primary"
                id="modal-dashboard"
                onClick={() => { setShowSaveModal(false); navigate('/dashboard') }}
              >
                📊 Go to Dashboard
              </button>
              <button
                className="ide__modal-btn ide__modal-btn--secondary"
                id="modal-stay"
                onClick={() => setShowSaveModal(false)}
              >
                ⚡ Stay in IDE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sign-in to save prompt ────────────────────────── */}
      {showLoginPrompt && (
        <div className="ide__modal-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div className="ide__modal" onClick={e => e.stopPropagation()}>
            <div className="ide__modal-icon">🔒</div>
            <h3 className="ide__modal-title">Sign in to Save</h3>
            <p className="ide__modal-msg">
              Your code is safe in this session, but to permanently save files
              and access them anywhere you need an account.
            </p>
            <div className="ide__modal-actions">
              <button
                className="ide__modal-btn ide__modal-btn--primary"
                id="modal-login"
                onClick={() => navigate('/login')}
              >
                🔑 Log In
              </button>
              <button
                className="ide__modal-btn ide__modal-btn--secondary"
                id="modal-signup"
                onClick={() => navigate('/login?tab=signup')}
              >
                ✦ Sign Up Free
              </button>
            </div>
            <button
              className="ide__modal-dismiss"
              onClick={() => setShowLoginPrompt(false)}
            >
              Continue as guest
            </button>
          </div>
        </div>
      )}

      {/* ── AI Panel ─────────────────────────────────────── */}
      <AIPanel
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        editorCode={code}
        onInsertCode={(generated) => setCode(prev => prev + '\n\n' + generated)}
        onApplyFix={(fixedCode) => { setCode(fixedCode); showToast('Fix applied! ✓', 'success') }}
      />

      {/* ── Toast ───────────────────────────────────────── */}
      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
