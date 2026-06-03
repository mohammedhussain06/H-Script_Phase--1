require('dotenv').config()
const express      = require('express')
const cors         = require('cors')
const cookieParser = require('cookie-parser')
const passport     = require('./src/config/passport')

// Routes
const authRoutes = require('./src/routes/auth')
const fileRoutes = require('./src/routes/files')
const runRoutes  = require('./src/routes/run')
const userRoutes = require('./src/routes/user')

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ────────────────────────────────────────────
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,   // required for cookies
}))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(passport.initialize())   // no passport.session() — using JWT

// ── Routes ────────────────────────────────────────────────
app.use('/auth',       authRoutes)
app.use('/api/files',  fileRoutes)
app.use('/api/run',    runRoutes)
app.use('/api/user',   userRoutes)

// ── Health check ──────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status:    'OK',
    version:   '2.0.0',
    database:  'SQLite (Prisma)',
    timestamp: new Date().toISOString(),
  })
})

// ── 404 handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` })
})

// ── Global error handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// ── Start server ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║  H-Script Backend  v2.0.0            ║
  ║  http://localhost:${PORT}               ║
  ║  Database: SQLite (Prisma)            ║
  ╚══════════════════════════════════════╝
  `)
})
