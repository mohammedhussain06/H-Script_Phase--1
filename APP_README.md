# H-Script IDE — Application Plan

> Web-based IDE + Agentic AI platform for the H-Script programming language.

---

## Overview

H-Script IDE is a full-stack web application that brings the H-Script language to the browser with a rich code editor, real-time execution, user accounts, file management, and an agentic AI assistant powered by NLP.

---

## Project Structure

```
H-Script-IDE/
├── frontend/          ← React + Vite + Monaco + Three.js + Anime.js
├── backend/           ← Node + Express + Passport + MongoDB
└── ai/                ← Python + FastAPI + NLP (Agentic AI core)
```

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, Monaco Editor, Three.js, Anime.js |
| **Backend** | Node.js, Express, Passport.js, MongoDB |
| **AI** | Python, FastAPI, spaCy, Transformers, scikit-learn |
| **Auth** | GitHub OAuth + Google OAuth via Passport |
| **Storage** | MongoDB (users, files, sessions) |
| **Communication** | REST API (frontend ↔ backend), REST (backend ↔ ai) |

---

## User Flow

```
/ (Landing Page)
│
├── /docs          → Full H-Script language reference
├── /ide           → Guest mode (run code, no save)
│
└── /login         → GitHub / Google OAuth
        ↓
   /dashboard      → My files, recent sessions
        ↓
   /ide/:fileId    → Full IDE (save, load, share)
```

---

## Frontend

### Pages

| Route | Description |
|---|---|
| `/` | Landing page with Three.js hero + feature sections |
| `/docs` | Full language reference (all 4 phases) |
| `/ide` | Guest IDE — run code without login |
| `/login` | OAuth login page |
| `/dashboard` | User file manager + recent sessions |
| `/ide/:fileId` | Full IDE with save/load/share |

### Key Components

- **Navbar** — Logo, Docs, IDE, Login/Logout
- **HeroSection** — Three.js animated scene + headline + CTAs
- **MonacoEditor** — H-Script syntax highlighting + autocomplete
- **Terminal** — Output panel with character-by-character print animation
- **FileTree** — Sidebar for managing `.hs` files
- **AIPanel** — Agentic AI chat sidebar
- **DocsViewer** — Rendered H-Script documentation

### Animations (Original — H-Script Identity)

| Element | Animation |
|---|---|
| Hero background | Three.js — floating H-Script keywords (`let_him_cook`, `boliye`, `agar`) drifting in 3D |
| Background | Particle system shaped as `{ }` slowly morphing |
| Logo reveal | Anime.js typewriter effect + 🔥 pop |
| Feature cards | 3D tilt hologram effect on hover |
| Run button | Pulse glow on code execution |
| Error trigger | Screen shake + red flash |
| Output text | Prints character by character (terminal feel) |
| Scroll sections | Code snippets fly in from left/right |

---

## Backend

### API Routes

| Method | Route | Description |
|---|---|---|
| `POST` | `/auth/github` | GitHub OAuth login |
| `POST` | `/auth/google` | Google OAuth login |
| `GET` | `/auth/logout` | Logout + session destroy |
| `GET` | `/api/files` | Get all user files |
| `POST` | `/api/files` | Create new file |
| `PUT` | `/api/files/:id` | Update file content |
| `DELETE` | `/api/files/:id` | Delete file |
| `POST` | `/api/run` | Execute H-Script code server-side |
| `GET` | `/api/user` | Get current user profile |

### MongoDB Models

- **User** — id, name, email, avatar, provider, createdAt
- **File** — id, userId, name, content, createdAt, updatedAt
- **Session** — managed by Passport + express-session

---

## AI Module

### Core — NLP Engine

| Component | Purpose |
|---|---|
| **Intent Classifier** | Detect what the user wants (generate, debug, explain, review) |
| **Entity Extractor** | Pull out variable names, function names, error types from user prompt |
| **Context Manager** | Keep track of current code + conversation history |
| **Code Generator** | Natural language → H-Script code |
| **Error Explainer** | Parse H-Script error → human-friendly explanation |
| **Code Reviewer** | Scan `.hs` file → suggest improvements |

### Agentic Loop

```
User Prompt
     ↓
Intent Detection (NLP)
     ↓
Plan Steps (what tools to call)
     ↓
Execute Tools:
  ├── run_code(code)      → execute H-Script, get output/error
  ├── read_file(fileId)   → read user's current code
  ├── fix_error(code, err) → generate corrected code
  └── explain(error)      → generate plain English explanation
     ↓
Synthesize Response
     ↓
Return to user (with runnable code examples)
```

### AI Features

| Feature | Description |
|---|---|
| **Code Generation** | "Write a function that sorts a list" → H-Script code |
| **Error Debugger** | Reads error + code → explains + fixes |
| **Code Review** | Reviews `.hs` file → style + logic suggestions |
| **Autocomplete** | Predicts next token based on context |
| **Chat Mode** | Ask anything about H-Script, get answers with examples |
| **Refactor Agent** | "Convert this to use JugaadMap" → plans + rewrites |

---

## Development Phases

| Phase | What |
|---|---|
| **Phase 5A** | Frontend — Landing page, Monaco IDE, routing |
| **Phase 5B** | Backend — Auth, file CRUD, execution API |
| **Phase 5C** | AI — NLP core, error explainer, code gen |
| **Phase 5D** | Integration — Connect all three, polish UI |
| **Phase 5E** | Agentic AI — Multi-step reasoning, chat mode |

---

## Design Principles

- **Dark-first** — deep dark bg, neon purple/orange accents
- **H-Script identity** — language keywords as visual elements
- **Performance** — code runs in browser (bundled interpreter) + server fallback
- **Guest-friendly** — try without login, login to save
- **Mobile-aware** — responsive layout (IDE collapses on small screens)

---

*Language done. Application incoming. No cap. 🔥*
