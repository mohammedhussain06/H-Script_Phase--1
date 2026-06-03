// H-Script server-side runner
// Uses the original CJS source from /src/ — Node.js has no Vite restrictions
const lexer       = require('../../../src/lexer')
const parse       = require('../../../src/parser')
const interpreter = require('../../../src/interpreter')

const MAX_CODE_LENGTH = 50_000   // 50KB limit per request
const TIMEOUT_MS      = 5_000    // 5 second execution timeout

// ── POST /api/run ─────────────────────────────────────────
async function runCode(req, res) {
  const { code } = req.body

  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'code must be a string' })
  }
  if (code.length > MAX_CODE_LENGTH) {
    return res.status(400).json({ error: `Code too long (max ${MAX_CODE_LENGTH} chars)` })
  }

  const output = []
  const errors = []

  // Capture console.log output
  const origLog   = console.log
  const origError = console.error
  const origWarn  = console.warn

  console.log   = (...args) => output.push(args.map(a => a === null ? 'null' : String(a)).join(' '))
  console.error = (...args) => errors.push(args.map(String).join(' '))
  console.warn  = (...args) => output.push('[warn] ' + args.map(String).join(' '))

  // Execution with timeout
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Execution timed out (5s)')), TIMEOUT_MS)
  )

  const runPromise = new Promise((resolve) => {
    try {
      const tokens = lexer(code)
      const ast    = parse(tokens)
      interpreter(ast)
      resolve()
    } catch (err) {
      const clean = (s) => String(s).replace(/\x1b\[[0-9;]*m/g, '')  // strip ANSI
      errors.push(clean(err.message || String(err)))
      resolve()
    }
  })

  try {
    await Promise.race([runPromise, timeoutPromise])
  } catch (err) {
    errors.push(err.message)
  } finally {
    console.log   = origLog
    console.error = origError
    console.warn  = origWarn
  }

  return res.json({
    output,
    errors,
    executedAt: new Date().toISOString(),
    userId:     req.user?.id ?? null,
  })
}

module.exports = { runCode }
