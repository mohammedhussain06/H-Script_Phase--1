// ── Input validation helpers ───────────────────────────────

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6
}

function sanitizeString(str) {
  return typeof str === 'string' ? str.trim() : ''
}

// ── Middleware: validate signup body ───────────────────────
function validateSignup(req, res, next) {
  const { name, email, password } = req.body
  const errors = []

  if (!sanitizeString(name))          errors.push('Name is required')
  if (!isValidEmail(email))           errors.push('Valid email is required')
  if (!isValidPassword(password))     errors.push('Password must be at least 6 characters')

  if (errors.length) return res.status(400).json({ error: errors[0], errors })
  next()
}

// ── Middleware: validate login body ───────────────────────
function validateLogin(req, res, next) {
  const { email, password } = req.body
  const errors = []

  if (!isValidEmail(email))       errors.push('Valid email is required')
  if (!sanitizeString(password))  errors.push('Password is required')

  if (errors.length) return res.status(400).json({ error: errors[0], errors })
  next()
}

// ── Middleware: validate file save body ───────────────────
function validateFile(req, res, next) {
  const { filename, code } = req.body
  if (!sanitizeString(filename)) return res.status(400).json({ error: 'Filename is required' })
  if (typeof code !== 'string')  return res.status(400).json({ error: 'Code must be a string' })
  next()
}

module.exports = { validateSignup, validateLogin, validateFile, isValidEmail, sanitizeString }
