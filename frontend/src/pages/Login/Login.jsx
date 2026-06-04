import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './Login.css'

/* ── Simple field validator ─────────────────────────── */
function validate(tab, fields) {
  const errs = {}
  if (!fields.email.trim())                          errs.email    = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errs.email = 'Enter a valid email'
  if (!fields.password)                              errs.password = 'Password is required'
  else if (fields.password.length < 6)               errs.password = 'At least 6 characters'
  if (tab === 'signup') {
    if (!fields.name.trim())                         errs.name     = 'Name is required'
    if (fields.password !== fields.confirm)          errs.confirm  = 'Passwords do not match'
  }
  return errs
}

export default function Login() {
  const { login, signup } = useAuth()
  const navigate          = useNavigate()
  const [searchParams]    = useSearchParams()
  const initialTab        = searchParams.get('tab') === 'signup' ? 'signup' : 'login'

  const [tab,       setTab]       = useState(initialTab)
  const [fields,    setFields]    = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors,    setErrors]    = useState({})
  const [apiError,  setApiError]  = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [showConf,  setShowConf]  = useState(false)
  const [loading,   setLoading]   = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    // Clear error on type
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(tab, fields)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setApiError('')
    try {
      if (tab === 'login') {
        await login(fields.email, fields.password)
      } else {
        await signup(fields.name, fields.email, fields.password)
      }
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.response?.data?.error || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const switchTab = (t) => {
    setTab(t)
    setErrors({})
    setApiError('')
  }

  return (
    <main className="login-page" id="login-page">
      {/* Background decorations */}
      <div className="login__bg-orb login__bg-orb--1" />
      <div className="login__bg-orb login__bg-orb--2" />
      <div className="login__bg-grid" />

      <div className="login-card">
        {/* Logo */}
        <Link to="/" className="login__logo" id="login-home">
          <span className="login__logo-icon">H</span>
          <span>Script</span>
          <span>🔥</span>
        </Link>

        {/* Tab switcher */}
        <div className="login__tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === 'login'}
            className={`login__tab ${tab === 'login' ? 'active' : ''}`}
            id="tab-login"
            onClick={() => switchTab('login')}
          >
            Login
          </button>
          <button
            role="tab"
            aria-selected={tab === 'signup'}
            className={`login__tab ${tab === 'signup' ? 'active' : ''}`}
            id="tab-signup"
            onClick={() => switchTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <h1 className="login__title">
          {tab === 'login' ? 'Welcome back 👋' : 'Create account 🚀'}
        </h1>
        <p className="login__sub">
          {tab === 'login'
            ? 'Login to save files, access history, and use AI.'
            : "Join the H-Script community. It\u2019s free forever."}
        </p>

        {/* ── Manual form ───────────────────── */}
        <>
          <form className="login__form" onSubmit={handleSubmit} noValidate id="auth-form">

              {/* Name — signup only */}
              {tab === 'signup' && (
                <div className={`login__field ${errors.name ? 'has-error' : ''}`}>
                  <label htmlFor="field-name" className="login__label">Full Name</label>
                  <input
                    id="field-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="login__input"
                    placeholder="Bhai ka naam daal"
                    value={fields.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className="login__error">{errors.name}</span>}
                </div>
              )}

              {/* Email */}
              <div className={`login__field ${errors.email ? 'has-error' : ''}`}>
                <label htmlFor="field-email" className="login__label">Email</label>
                <input
                  id="field-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="login__input"
                  placeholder="bhai@example.com"
                  value={fields.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="login__error">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className={`login__field ${errors.password ? 'has-error' : ''}`}>
                <label htmlFor="field-password" className="login__label">Password</label>
                <div className="login__input-wrap">
                  <input
                    id="field-password"
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                    className="login__input"
                    placeholder={tab === 'login' ? '••••••••' : 'Min. 6 characters'}
                    value={fields.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="login__eye"
                    onClick={() => setShowPass(v => !v)}
                    tabIndex={-1}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <span className="login__error">{errors.password}</span>}
              </div>

              {/* Confirm password — signup only */}
              {tab === 'signup' && (
                <div className={`login__field ${errors.confirm ? 'has-error' : ''}`}>
                  <label htmlFor="field-confirm" className="login__label">Confirm Password</label>
                  <div className="login__input-wrap">
                    <input
                      id="field-confirm"
                      name="confirm"
                      type={showConf ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="login__input"
                      placeholder="Repeat password"
                      value={fields.confirm}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="login__eye"
                      onClick={() => setShowConf(v => !v)}
                      tabIndex={-1}
                      aria-label={showConf ? 'Hide' : 'Show'}
                    >
                      {showConf ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.confirm && <span className="login__error">{errors.confirm}</span>}
                </div>
              )}

              {/* Forgot password — login only */}
              {tab === 'login' && (
                <div className="login__forgot-row">
                  <button type="button" className="login__forgot" id="btn-forgot">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* API error */}
              {apiError && (
                <div className="login__api-error">{apiError}</div>
              )}

              <button
                type="submit"
                className="btn-primary login__submit"
                id="btn-submit"
                disabled={loading}
              >
                {loading ? '⟳ Please wait...' : tab === 'login' ? '→ Login' : '→ Create Account'}
              </button>
            </form>

            {/* OAuth — Login tab only */}
            {tab === 'login' && (
              <>
                {/* Divider */}
                <div className="login__divider">
                  <span>or continue with</span>
                </div>

                {/* OAuth buttons */}
                <div className="login__btns">
                  <a href="/auth/github" className="login__btn login__btn--github" id="login-github">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    Continue with GitHub
                  </a>

                  <a href="/auth/google" className="login__btn login__btn--google" id="login-google">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </a>
                </div>
              </>
            )}

            <p className="login__terms">
              {tab === 'login'
                ? 'New? GitHub / Google login creates your account automatically.'
                : 'Already have an account? Switch to the Login tab.'}
              <br />
              <span className="login__guest">
                Just want to try?{' '}
                <Link to="/ide" id="login-guest-link">Open IDE as guest →</Link>
              </span>
            </p>
          </>
        </div>
    </main>
  )
}
