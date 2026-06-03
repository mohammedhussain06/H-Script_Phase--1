const express    = require('express')
const passport   = require('../config/passport')
const { validateSignup, validateLogin } = require('../middleware/validate')
const { requireAuth } = require('../middleware/auth')
const { signup, login, logout, me, oauthCallback } = require('../controllers/authController')

const router = express.Router()

// ── Manual auth ───────────────────────────────────────────
router.post('/signup', validateSignup, signup)
router.post('/login',  validateLogin,  login)
router.post('/logout', requireAuth,    logout)
router.get('/me',      requireAuth,    me)

// ── GitHub OAuth ──────────────────────────────────────────
router.get('/github',
  passport.authenticate('github', { session: false, scope: ['user:email'] })
)
router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login?error=github' }),
  oauthCallback
)

// ── Google OAuth ──────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { session: false, scope: ['profile', 'email'] })
)
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google' }),
  oauthCallback
)

module.exports = router
