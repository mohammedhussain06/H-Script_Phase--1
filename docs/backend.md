# H-Script Backend — Developer Documentation

> **Stack:** Node.js · Express · Prisma ORM · SQLite (dev) · PostgreSQL (prod)  
> **Auth:** JWT in HTTP-only cookie · Passport.js for OAuth  
> **Base URL (dev):** `http://localhost:5000`

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Setup & Running](#setup--running)
4. [Environment Variables](#environment-variables)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Authentication Flow](#authentication-flow)
8. [Middleware](#middleware)
9. [Error Handling](#error-handling)
10. [Production Checklist](#production-checklist)

---

## Architecture Overview

```
Frontend (React/Vite :3000)
        │
        │  HTTP requests (Axios, withCredentials: true)
        │  Cookie: hscript_token (JWT, HTTP-only)
        ▼
Backend (Express :5000)
        │
        ├── /auth/*        → Authentication (local + OAuth)
        ├── /api/files/*   → File CRUD (requires JWT)
        ├── /api/run       → H-Script execution (optional auth)
        ├── /api/user      → User profile
        └── /health        → Health check
        │
        ▼
Prisma ORM → SQLite (dev) / PostgreSQL (prod)
```

**Key design decisions:**
- **Stateless JWT** — no sessions, no Redis. Token lives in an HTTP-only cookie (XSS-safe).
- **Prisma** — type-safe DB access, easy migration from SQLite → PostgreSQL with one config change.
- **Passport.js** — handles GitHub/Google OAuth; sessions disabled (`session: false`).
- **Vite proxy** — frontend proxies `/api` and `/auth` to `:5000`, no CORS issues in dev.

---

## Project Structure

```
backend/
├── server.js                  ← Entry point — Express app setup
├── .env                       ← Secrets (never commit this)
├── .env.example               ← Template for new devs
├── package.json
├── prisma/
│   ├── schema.prisma          ← Database models (User, File)
│   └── dev.db                 ← SQLite database (dev only)
└── src/
    ├── config/
    │   └── passport.js        ← GitHub + Google OAuth strategies
    ├── controllers/
    │   ├── authController.js  ← signup, login, logout, me, oauthCallback
    │   ├── filesController.js ← CRUD operations for files
    │   ├── runController.js   ← H-Script server-side execution
    │   └── userController.js  ← User profile management
    ├── lib/
    │   └── prisma.js          ← Singleton Prisma client
    ├── middleware/
    │   ├── auth.js            ← JWT signing, cookie helpers, requireAuth
    │   └── validate.js        ← Request body validation
    └── routes/
        ├── auth.js            ← /auth/* routes
        ├── files.js           ← /api/files/* routes
        ├── run.js             ← /api/run route
        └── user.js            ← /api/user/* routes
```

---

## Setup & Running

```bash
cd backend
npm install
cp .env.example .env         # fill in your values
npx prisma migrate dev --name init
node server.js
```

Verify: `GET http://localhost:5000/health` → `{ "status": "OK" }`

For auto-restart: `npx nodemon server.js`

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `5000`) |
| `DATABASE_URL` | ✅ | `file:./prisma/dev.db` for dev, PostgreSQL URL for prod |
| `JWT_SECRET` | ✅ | Long random string — signs all JWTs |
| `JWT_EXPIRES_IN` | No | Token lifetime (default: `7d`) |
| `GITHUB_CLIENT_ID` | OAuth | From GitHub Developer Settings |
| `GITHUB_CLIENT_SECRET` | OAuth | From GitHub Developer Settings |
| `GITHUB_CALLBACK_URL` | OAuth | `http://localhost:5000/auth/github/callback` |
| `GOOGLE_CLIENT_ID` | OAuth | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth | From Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | OAuth | `http://localhost:5000/auth/google/callback` |
| `FRONTEND_URL` | ✅ | `http://localhost:3000` dev — used for CORS + OAuth redirects |
| `AI_SERVICE_URL` | Phase 5C | Python AI microservice URL |

> ⚠️ Never commit `.env` to Git. It is already in `.gitignore`.

---

## Database Schema

### User

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | Primary key |
| `name` | String? | Display name |
| `email` | String | Unique |
| `passwordHash` | String? | null for OAuth-only users |
| `provider` | String | `local` / `github` / `google` |
| `providerId` | String? | OAuth provider's user ID |
| `avatar` | String? | Profile picture URL |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

### File

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | Primary key |
| `userId` | String | Foreign key → User (cascade delete) |
| `filename` | String | e.g. `main.hs` |
| `code` | String | Full file content |
| `lines` | Int | Auto-calculated on save |
| `runs` | Int | Incremented via `/run` endpoint |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

---

## API Reference

### Auth Routes `/auth`

> No authentication required unless marked 🔒

#### `POST /auth/signup`
Create a new account.

```json
// Request
{ "name": "Rahul", "email": "rahul@x.com", "password": "secret123" }

// Response 201
{ "user": { "id": "...", "name": "Rahul", "email": "...", "provider": "local" }, "token": "eyJ..." }
```
Sets `hscript_token` cookie. Errors: `400` validation · `409` email taken

---

#### `POST /auth/login`
Login with email + password.

```json
// Request
{ "email": "rahul@x.com", "password": "secret123" }

// Response 200
{ "user": { ... }, "token": "eyJ..." }
```
Sets `hscript_token` cookie. Errors: `400` validation · `401` wrong credentials

---

#### `POST /auth/logout` 🔒
Clears the auth cookie.
```json
{ "message": "Logged out successfully" }
```

---

#### `GET /auth/me` 🔒
Returns current user's profile (passwordHash excluded).
```json
{ "user": { "id": "...", "name": "Rahul", "email": "...", "provider": "local", "avatar": null } }
```

---

#### `GET /auth/github`
Initiates GitHub OAuth — redirects to GitHub.  
On success → redirects to `FRONTEND_URL/dashboard` with cookie set.

#### `GET /auth/github/callback`
GitHub's redirect target. Handled by Passport.js automatically.

#### `GET /auth/google` / `GET /auth/google/callback`
Same flow as GitHub but for Google.

---

### File Routes `/api/files`

> 🔒 All file routes require a valid `hscript_token` cookie.

#### `GET /api/files`
All files for the logged-in user, sorted by `updatedAt DESC`.
```json
{ "files": [ { "id": "...", "filename": "main.hs", "lines": 10, "runs": 3, "updatedAt": "..." } ] }
```

#### `GET /api/files/:id`
Single file. Returns `403` if it belongs to a different user.

#### `POST /api/files`
Create a new file. `lines` is auto-calculated from code.
```json
// Request
{ "filename": "greet.hs", "code": "boliye(\"Namaste!\")" }
// Response 201
{ "file": { "id": "...", "filename": "greet.hs", "lines": 1, "runs": 0 } }
```
> Frontend enforces unique filenames before calling this endpoint.

#### `PUT /api/files/:id`
Update filename and/or code (both optional).
```json
// Request
{ "filename": "greet-v2.hs", "code": "boliye(\"Updated!\")" }
// Response 200
{ "file": { "id": "...", "filename": "greet-v2.hs", "lines": 1 } }
```

#### `DELETE /api/files/:id`
Permanently delete a file.
```json
{ "message": "File deleted" }
```

#### `POST /api/files/:id/run`
Increment run counter for a saved file.
```json
{ "runs": 7 }
```

---

### Run Route `/api/run`

> 🔓 Authentication is **optional** — guests can also run code.

#### `POST /api/run`
Execute H-Script code server-side.

```json
// Request
{ "code": "let_him_cook x = 42\nboliye(x)" }

// Response 200 — success
{ "output": ["42"], "errors": [], "executedAt": "2026-06-04T...", "userId": "clxyz..." }

// Response 200 — runtime error (errors array populated, still HTTP 200)
{ "output": [], "errors": ["ReferenceError: y is not defined"], "executedAt": "...", "userId": null }
```

**Limits:**

| Limit | Value |
|---|---|
| Max code size | 50,000 characters (50 KB) |
| Execution timeout | 5 seconds |

Errors: `400` if code is not a string or exceeds size limit.

---

### User Route `/api/user`

> 🔒 Requires authentication.

#### `GET /api/user/profile`
Full user profile.

#### `PUT /api/user/profile`
Update name or avatar URL.
```json
{ "name": "Rahul Bhai", "avatar": "https://example.com/pic.jpg" }
```

---

## Authentication Flow

### Email / Password
```
POST /auth/signup or /auth/login
  → Validate fields
  → bcrypt.compare (login) or bcrypt.hash (signup)
  → jwt.sign({ sub: userId, email }, JWT_SECRET, { expiresIn: '7d' })
  → res.cookie('hscript_token', token, { httpOnly: true, sameSite: 'lax' })
  → Return { user, token }

Each subsequent request:
  → requireAuth reads cookie
  → jwt.verify(token, JWT_SECRET)
  → prisma.user.findUnique({ where: { id: payload.sub } })
  → req.user = user
  → Controller proceeds
```

### GitHub / Google OAuth
```
GET /auth/github
  → Passport redirects to github.com/login/oauth/authorize
  → User approves on GitHub
  → GitHub hits /auth/github/callback
  → Passport fetches profile from GitHub API
  → Backend: find user by providerId OR email
      Found?     → update existing record + login
      Not found? → create new user record
  → Sign JWT, set cookie
  → Redirect to FRONTEND_URL/dashboard
```

---

## Middleware

| Middleware | File | Purpose |
|---|---|---|
| `requireAuth` | `middleware/auth.js` | Verifies JWT cookie. Returns `401` if missing/invalid/expired. |
| `optionalAuth` | `middleware/auth.js` | Like requireAuth but never blocks — sets `req.user = null` for guests. |
| `validateSignup` | `middleware/validate.js` | Checks name, email format, password min-length. |
| `validateLogin` | `middleware/validate.js` | Checks email + password presence. |
| `validateFile` | `middleware/validate.js` | Checks filename + code presence. |

---

## Error Handling

All errors return JSON:
```json
{ "error": "Human-readable message" }
```

| Code | Meaning |
|---|---|
| `400` | Bad request / validation failed |
| `401` | Not authenticated |
| `403` | Authenticated but not authorized (wrong user's resource) |
| `404` | Resource not found |
| `409` | Conflict (e.g. email already registered) |
| `500` | Internal server error |

Global error handler in `server.js` catches any unhandled errors and returns `500`.

---

## Production Checklist

- [ ] Change `DATABASE_URL` → PostgreSQL (Supabase / Neon connection string)
- [ ] Change `prisma/schema.prisma` provider from `sqlite` to `postgresql`
- [ ] Run `npx prisma migrate deploy` (not `dev`)
- [ ] Set `JWT_SECRET` to a long random string (32+ characters)
- [ ] Set `FRONTEND_URL` to your Vercel production domain
- [ ] Update GitHub OAuth App callback URL to production URL
- [ ] Update Google OAuth credentials callback URL to production URL
- [ ] Set `NODE_ENV=production` (enables `secure` flag on JWT cookie)
- [ ] Never commit `.env` ✅ (already in `.gitignore`)

### Switching to PostgreSQL

```prisma
// prisma/schema.prisma — change one line
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```

```bash
npx prisma migrate deploy
```
