const bcrypt = require('bcryptjs')
const prisma  = require('../lib/prisma')
const { signToken, setTokenCookie, clearTokenCookie } = require('../middleware/auth')

// ── Safe user object (strip password hash) ────────────────
function safeUser(user) {
  const { passwordHash, ...rest } = user
  return rest
}

// ── POST /auth/signup ─────────────────────────────────────
async function signup(req, res) {
  try {
    const { name, email, password } = req.body

    const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } })
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name:     name.trim(),
        email:    email.trim().toLowerCase(),
        passwordHash,
        provider: 'local',
      },
    })

    const token = signToken(user)
    setTokenCookie(res, token)
    res.status(201).json({ user: safeUser(user), token })
  } catch (err) {
    console.error('signup error:', err)
    res.status(500).json({ error: 'Server error during signup' })
  }
}

// ── POST /auth/login ──────────────────────────────────────
async function login(req, res) {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } })
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' })

    const token = signToken(user)
    setTokenCookie(res, token)
    res.json({ user: safeUser(user), token })
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ error: 'Server error during login' })
  }
}

// ── POST /auth/logout ─────────────────────────────────────
function logout(req, res) {
  clearTokenCookie(res)
  res.json({ message: 'Logged out successfully' })
}

// ── GET /auth/me ──────────────────────────────────────────
function me(req, res) {
  res.json({ user: safeUser(req.user) })
}

// ── OAuth callback handler (GitHub + Google) ──────────────
// Called after Passport verifies the OAuth user
function oauthCallback(req, res) {
  const token       = signToken(req.user)
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
  setTokenCookie(res, token)
  res.redirect(`${frontendUrl}/dashboard`)
}

module.exports = { signup, login, logout, me, oauthCallback }
