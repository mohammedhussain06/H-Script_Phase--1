# H-Script Frontend — Complete Implementation Documentation
> Phase 5A | Stack: React + Vite + Monaco Editor + Anime.js + Three.js

---

## Tech Stack

| Tool | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite 5** | Dev server + bundler |
| **React Router v6** | Client-side routing |
| **Monaco Editor** | VS Code editor in the browser |
| **Anime.js** | Scroll animations, entrance effects |
| **Three.js** | 3D background (reserved for future) |
| **Vanilla CSS** | All styling — no Tailwind |
| **localStorage** | File persistence (no backend needed) |

---

## Project Structure

```
frontend/src/
├── App.jsx                    # Root router
├── main.jsx                   # Entry point
├── pages/
│   ├── Landing/               # Home page
│   ├── IDE/                   # Code editor
│   ├── Docs/                  # Documentation
│   ├── Dashboard/             # User dashboard
│   ├── Login/                 # Auth page
│   └── NotFound/              # 404 page
├── components/
│   ├── Navbar/                # Top navigation
│   ├── Editor/                # Monaco wrapper
│   ├── Terminal/              # Output console
│   ├── Toast/                 # Notifications
│   ├── AIPanel/               # Placeholder (Phase 5C)
│   └── FileTree/              # Placeholder (Phase 5B)
├── runtime/                   # H-Script browser engine
│   ├── index.js               # Entry: runCode(), getKeywords()
│   ├── lexer.js               # Tokenizer
│   ├── parser.js              # AST builder
│   ├── interpreter.js         # Tree-walk evaluator
│   ├── tokens.js              # Token constants
│   ├── errors.js              # Error classes
│   └── utils.js               # Standard library (27 functions)
├── animations/
│   └── animations.js          # Anime.js helpers
├── utils/
│   └── fileStorage.js         # localStorage CRUD
└── styles/
    └── global.css             # Design tokens + global styles
```

---

## Pages

### 1. Landing Page `/`
- Hero Section — animated headline, gradient CTA buttons, floating code card
- Cyberpunk Background Animation — digital rain (canvas), scan lines, mouse-reactive glow
- Features Section — 6 cards with staggered scroll-reveal via Anime.js
- Code Preview Section — live syntax-highlighted H-Script snippet
- How It Works Section — 4-step process cards
- Footer — links, GitHub

### 2. IDE Page `/ide`
Full-screen layout (no Navbar). Topbar → Editor + Terminal → Status Bar.

| Feature | Detail |
|---|---|
| Monaco Editor | Custom `hscript` language, dark cyberpunk theme, font ligatures |
| H-Script Runtime | Runs code 100% in the browser |
| Resizable panels | Drag divider — 20% to 80% split |
| Run | `▶ Run` button or `Ctrl+Enter` |
| Save | `💾 Save` or `Ctrl+S` → localStorage |
| Download | `⬇` → downloads `.hs` file |
| Share | `🔗` → base64 URL, copied to clipboard |
| Load shared code | Reads `?code=` URL param on load |
| File rename | Double-click the tab filename |
| Unsaved dot | Orange dot when there are unsaved changes |
| Line count | `Ln X` in status bar |
| Monaco skeleton | Purple shimmer loader while editor initialises |
| Navigation | HScript logo → Home, Docs button in topbar |
| Toast notifications | Save / Download / Share all show toasts |

### 3. Docs Page `/docs`
Sidebar navigation + scrollable content area.

| # | Section |
|---|---|
| 1 | Introduction |
| 2 | Variables (`let_him_cook`) |
| 3 | Printing (`boliye`) |
| 4 | If / Else (`agar`, `warna`, `baaki_sab`) |
| 5 | Loops (`jab_tak_doomscroll`, `baar_baar`) |
| 6 | Functions (`pov`, `wapas_karo`) |
| 7 | Lists / BakchodList |
| 8 | Objects / JugaadMap |
| 9 | Classes / Squad + inheritance |
| 10 | Error Handling (`agar_risk`, `pakad_lo`) |
| 11 | Built-in Tools (27 stdlib functions) |
| 12 | Cheat Sheet |

Features: copy button, "Try in IDE" button, plain English explanations, comparison rows, prev/next pagination, phase badges, responsive sidebar.

### 4. Dashboard Page `/dashboard`
- Live stats from localStorage (files, lines, runs)
- File cards — filename, last edited, line count, run count
- Open file → encodes code into URL → IDE
- Delete with confirmation + toast
- Empty state with CTA
- Quick Actions — IDE, Docs, Home, GitHub

### 5. Login Page `/login`
- Tab switcher — Login / Sign Up
- Manual form — email + password with show/hide toggle
- Sign Up adds — name + confirm password fields
- Inline validation — required, email format, 6-char min, password match
- Field error states — red border + message
- Success state with animation
- OR divider
- GitHub OAuth → `/auth/github`
- Google OAuth → `/auth/google`
- Guest link → `/ide`

### 6. 404 Page `/*`
- Glitch CSS animation on the "404" number
- Floating robot emoji
- Hinglish error message
- Auto-redirect to Home after 8 seconds
- Animated cyber grid background

---

## Components

| Component | Description |
|---|---|
| **Navbar** | Fixed, frosted glass on scroll, Anime.js entrance, mobile hamburger |
| **Editor** | Monaco wrapper, custom hscript language + theme, loading skeleton |
| **Terminal** | Displays output/errors from runtime, running state indicator |
| **Toast** | success/error/info, auto-dismiss 2.8s, slide-up animation |
| **AIPanel** | Placeholder for Phase 5C |
| **FileTree** | Placeholder for Phase 5B |

---

## H-Script Browser Runtime (`src/runtime/`)

All ES Module rewrites — no Node.js APIs, works fully in browser.

**Supports:**
- Variables, print, conditionals, loops, break/continue
- Functions (named, anonymous, default params, closures)
- Arrays (BakchodList) + 13 methods + 7 HOF methods
- Objects (JugaadMap) — literals, spread, member access
- Classes (Squad) — OOP, inheritance (`nepo_baby_of`), super (`buzurg`), private props
- Error handling (try/catch/finally/throw)
- Template literals, ternary, spread, bitwise operators
- 27 built-in stdlib functions

**API:**
```js
import { runCode } from './runtime/index.js'
const { output, errors } = runCode(codeString)
```

---

## File Storage Utility (`src/utils/fileStorage.js`)

| Function | Description |
|---|---|
| `getAllFiles()` | Returns all saved files from localStorage |
| `saveFile(filename, code)` | Create or update a file |
| `deleteFile(id)` | Remove by ID |
| `incrementRuns(filename)` | Bump run counter |
| `formatRelative(iso)` | "2h ago", "Just now" etc. |

---

## Routing (`App.jsx`)

| Route | Page | Navbar |
|---|---|---|
| `/` | Landing | ✅ |
| `/ide` | IDE | ❌ full-screen |
| `/docs` | Docs | ❌ own sidebar |
| `/dashboard` | Dashboard | ✅ |
| `/login` | Login | ✅ |
| `/*` | NotFound | ✅ |

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Enter` | Run code |
| `Ctrl+S` | Save file |

---

## Design Tokens (global.css)

```
--accent-primary:   #7c3aed  (Purple)
--accent-secondary: #f97316  (Orange)
--bg-base:          #08080e
--font-mono:        'JetBrains Mono', monospace
--font-sans:        'Inter', sans-serif
```

---

## What Needs Backend (Phase 5B+)

| Feature | Phase |
|---|---|
| Auth session / JWT | 5B |
| Files synced across devices | 5B |
| Server-side code execution | 5B |
| AI assistant UI + panel | 5C |
| User profile page | 5B |
