import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Toast from '../../components/Toast/Toast.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { filesApi } from '../../api/files.js'
import { formatRelative } from '../../utils/fileStorage.js'
import './Dashboard.css'

const QUICK_ACTIONS = [
  { icon: '⚡', label: 'Open IDE',  to: '/ide' },
  { icon: '📖', label: 'Read Docs', to: '/docs' },
  { icon: '🏠', label: 'Home',      to: '/' },
]

export default function Dashboard() {
  const { user, isLoggedIn, logout, loading: authLoading } = useAuth()
  const [files,   setFiles]   = useState([])
  const [loading, setLoading] = useState(true)
  const [toast,   setToast]   = useState(null)
  const navigate              = useNavigate()

  const showToast = (msg, type = 'info') => setToast({ msg, type })

  // ── Load files from backend (or show empty if not logged in) ──
  useEffect(() => {
    if (authLoading) return
    if (!isLoggedIn) { setLoading(false); return }

    filesApi.getAll()
      .then(setFiles)
      .catch(() => showToast('Could not load files', 'error'))
      .finally(() => setLoading(false))
  }, [isLoggedIn, authLoading])

  // ── Delete file ───────────────────────────────────────────
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await filesApi.remove(id)
      setFiles(prev => prev.filter(f => f.id !== id))
      showToast(`"${name}" deleted`, 'error')
    } catch {
      showToast('Could not delete file', 'error')
    }
  }

  // ── Open file in IDE ──────────────────────────────────────
  const handleOpen = (file) => {
    const encoded = btoa(unescape(encodeURIComponent(file.code)))
    navigate(`/ide?code=${encoded}&fileId=${file.id}`)
  }

  // ── Logout ────────────────────────────────────────────────
  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // ── Stats ─────────────────────────────────────────────────
  const totalLines = files.reduce((s, f) => s + (f.lines || 0), 0)
  const totalRuns  = files.reduce((s, f) => s + (f.runs  || 0), 0)

  const STATS = [
    { label: 'Files Saved',   value: files.length, icon: '📄' },
    { label: 'Lines Written', value: totalLines,    icon: '📝' },
    { label: 'Total Runs',    value: totalRuns,     icon: '▶' },
    { label: 'Phase',         value: '5B',          icon: '🚀' },
  ]

  return (
    <div className="dashboard" id="dashboard-page">
      <div className="dashboard__bg" />

      <div className="dashboard__inner container">

        {/* Header */}
        <div className="dashboard__header">
          <div>
            <h1 className="dashboard__title">Dashboard</h1>
            <p className="dashboard__sub">
              {isLoggedIn
                ? `Welcome back, ${user?.name?.split(' ')[0] || 'coder'} 🔥`
                : 'Welcome, guest! Login to save files across devices.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {isLoggedIn ? (
              <button
                className="btn-secondary"
                onClick={handleLogout}
                id="dash-logout"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn-primary" id="dash-login">Login</Link>
            )}
            <Link to="/ide" className="btn-primary dashboard__new-btn" id="dash-new-file">
              + New File
            </Link>
          </div>
        </div>

        {/* User info badge */}
        {isLoggedIn && user && (
          <div className="dash-user-badge">
            {user.avatar && <img src={user.avatar} alt={user.name} className="dash-user-avatar" />}
            <div>
              <div className="dash-user-name">{user.name}</div>
              <div className="dash-user-email">{user.email}</div>
            </div>
            <span className={`dash-user-provider dash-user-provider--${user.provider}`}>
              {user.provider}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="dashboard__stats">
          {STATS.map((s, i) => (
            <div key={i} className="dash-stat" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="dash-stat__icon">{s.icon}</span>
              <div>
                <div className="dash-stat__value">{loading ? '...' : s.value}</div>
                <div className="dash-stat__label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Files */}
        <div className="dashboard__section">
          <h2 className="dashboard__section-title">Your Files</h2>

          {!isLoggedIn ? (
            <div className="dash-empty">
              <span className="dash-empty__icon">🔐</span>
              <p>Login to save and sync your H-Script files.</p>
              <Link to="/login" className="btn-primary" id="dash-empty-login">Login / Sign Up</Link>
            </div>
          ) : loading ? (
            <div className="dash-empty">
              <span className="dash-empty__icon">⟳</span>
              <p>Loading your files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="dash-empty">
              <span className="dash-empty__icon">📂</span>
              <p>No saved files yet.</p>
              <p>Open the IDE, write some code, and hit <strong>💾 Save</strong>!</p>
              <Link to="/ide" className="btn-primary" id="dash-empty-ide">Open IDE</Link>
            </div>
          ) : (
            <div className="dashboard__files">
              {files.map((f) => (
                <div key={f.id} id={f.id} className="dash-file-card">
                  <div className="dash-file-card__top">
                    <span className="dash-file-card__icon">📄</span>
                    <div className="dash-file-card__meta">
                      <span className="dash-file-card__name">{f.filename}</span>
                      <span className="dash-file-card__time">{formatRelative(f.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="dash-file-card__stats">
                    <span>{f.lines} lines</span>
                    <span>·</span>
                    <span>{f.runs || 0} runs</span>
                  </div>
                  <div className="dash-file-card__actions">
                    <button
                      className="btn-secondary dash-file-card__btn"
                      id={`open-${f.id}`}
                      onClick={() => handleOpen(f)}
                    >
                      Open
                    </button>
                    <button
                      className="dash-file-card__delete"
                      title="Delete"
                      id={`del-${f.id}`}
                      onClick={() => handleDelete(f.id, f.filename)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
              <Link to="/ide" className="dash-file-card dash-file-card--new" id="dash-new-card">
                <span className="dash-file-card__new-icon">+</span>
                <span className="dash-file-card__new-text">New File</span>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="dashboard__section">
          <h2 className="dashboard__section-title">Quick Actions</h2>
          <div className="dashboard__quick">
            {QUICK_ACTIONS.map((q, i) => (
              <Link to={q.to} className="dash-quick" key={i} id={`quick-${i}`}>
                <span>{q.icon}</span> {q.label}
              </Link>
            ))}
            <a
              href="https://github.com/mohammedhussain06/H-Script_Phase--1"
              target="_blank"
              rel="noopener noreferrer"
              className="dash-quick"
              id="quick-gh"
            >
              <span>💻</span> GitHub
            </a>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
