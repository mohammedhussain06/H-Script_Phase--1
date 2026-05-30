require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const session    = require('express-session');
const passport   = require('passport');
const mongoose   = require('mongoose');

// Route imports (stubs — implement in Phase 5B)
const authRoutes = require('./src/routes/auth');
const fileRoutes = require('./src/routes/files');
const runRoutes  = require('./src/routes/run');
const userRoutes = require('./src/routes/user');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'hscript-secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// ── Routes ────────────────────────────────────────────
app.use('/auth',     authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/run',   runRoutes);
app.use('/api/user',  userRoutes);

app.get('/health', (req, res) => res.json({ status: 'OK', version: '1.0.0' }));

// ── Database ──────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hscript-ide')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  })
  .catch(err => { console.error('DB error:', err); process.exit(1); });
