const passport       = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const prisma         = require('../lib/prisma')

// ── GitHub Strategy ───────────────────────────────────────
passport.use(new GitHubStrategy(
  {
    clientID:     process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL:  process.env.GITHUB_CALLBACK_URL,
    scope:        ['user:email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value ?? `${profile.id}@github.oauth`
      const avatar = profile.photos?.[0]?.value ?? null

      let user = await prisma.user.findFirst({
        where: { provider: 'github', providerId: String(profile.id) },
      })

      if (!user) {
        // Check if email already registered (local account) — link it
        user = await prisma.user.findUnique({ where: { email } })
        if (user) {
          user = await prisma.user.update({
            where: { id: user.id },
            data:  { provider: 'github', providerId: String(profile.id), avatar },
          })
        } else {
          user = await prisma.user.create({
            data: {
              name:       profile.displayName || profile.username,
              email,
              provider:   'github',
              providerId: String(profile.id),
              avatar,
            },
          })
        }
      }

      return done(null, user)
    } catch (err) {
      return done(err)
    }
  }
))

// ── Google Strategy ───────────────────────────────────────
passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email  = profile.emails?.[0]?.value ?? `${profile.id}@google.oauth`
      const avatar = profile.photos?.[0]?.value ?? null

      let user = await prisma.user.findFirst({
        where: { provider: 'google', providerId: String(profile.id) },
      })

      if (!user) {
        user = await prisma.user.findUnique({ where: { email } })
        if (user) {
          user = await prisma.user.update({
            where: { id: user.id },
            data:  { provider: 'google', providerId: String(profile.id), avatar },
          })
        } else {
          user = await prisma.user.create({
            data: {
              name:       profile.displayName,
              email,
              provider:   'google',
              providerId: String(profile.id),
              avatar,
            },
          })
        }
      }

      return done(null, user)
    } catch (err) {
      return done(err)
    }
  }
))

// No session serialisation needed — we use JWT
module.exports = passport
