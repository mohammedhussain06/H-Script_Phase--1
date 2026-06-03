const jwt    = require('jsonwebtoken')
const prisma = require('../lib/prisma')

const JWT_SECRET  = process.env.JWT_SECRET || 'hscript-dev-secret'
const COOKIE_NAME = 'hscript_token'

// ── Sign a JWT for a user ──────────────────────────────────
function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// ── Set JWT as HTTP-only cookie ────────────────────────────
function setTokenCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   7 * 24 * 60 * 60 * 1000,   // 7 days in ms
  })
}

// ── Clear token cookie ─────────────────────────────────────
function clearTokenCookie(res) {
  res.clearCookie(COOKIE_NAME)
}

// ── Middleware: require authenticated user ─────────────────
async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME]
    if (!token) return res.status(401).json({ error: 'Not authenticated' })

    const payload = jwt.verify(token, JWT_SECRET)
    const user    = await prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) return res.status(401).json({ error: 'User not found' })

    req.user = user
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// ── Middleware: optional auth (doesn't block if not logged in) ──
async function optionalAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME]
    if (token) {
      const payload = jwt.verify(token, JWT_SECRET)
      const user    = await prisma.user.findUnique({ where: { id: payload.sub } })
      req.user = user || null
    } else {
      req.user = null
    }
  } catch {
    req.user = null
  }
  next()
}

module.exports = { signToken, setTokenCookie, clearTokenCookie, requireAuth, optionalAuth }
