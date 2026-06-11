# H-Script AI Service — Complete Documentation
> Phase 5C | Stack: FastAPI · Groq · Llama 3.1 8B Instant · Python 3.12

---

## Overview

The H-Script AI Service is a standalone Python FastAPI server that provides six AI-powered endpoints for the IDE. It runs separately from the Express backend and communicates with the React frontend via REST API.

```
┌─────────────────────────────────────────────────────┐
│              H-Script Full Stack                    │
│                                                     │
│  React Frontend (:3000)                             │
│       │ calls                                       │
│       ├──→ Express Backend (:5000)  [auth, files]   │
│       └──→ FastAPI AI Service (:8000) [AI]          │
└─────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Component | Tool | Purpose |
|---|---|---|
| **Framework** | FastAPI | Async HTTP server |
| **Server** | Uvicorn | ASGI server with hot-reload |
| **LLM** | Llama 3.1 8B Instant (via Groq) | Sub-second inference |
| **HTTP Client** | httpx | Internal backend calls (code runner) |
| **Threading** | ThreadPoolExecutor | Runs sync Groq SDK non-blocking |
| **Env** | python-dotenv | Key management |
| **Validation** | Pydantic | Request/Response schemas |

---

## Project Structure

```
ai/
├── main.py                  # FastAPI app, CORS, router registration, /health
├── requirements.txt         # Dependencies
├── .env                     # GROQ_API_KEY (gitignored)
├── .env.example             # Template for contributors
├── core/
│   └── gemini_client.py     # Groq AI client + H-Script system prompt
├── api/
│   ├── explain.py           # POST /ai/explain
│   ├── generate.py          # POST /ai/generate
│   ├── fix.py               # POST /ai/fix
│   ├── autocomplete.py      # POST /ai/autocomplete
│   ├── explain_error.py     # POST /ai/explain-error
│   └── agent.py             # POST /ai/agent
├── nlp/
│   └── intent_classifier.py # Keyword-based intent detection helper
└── features/
    ├── agent.py             # Tool registry reference
    ├── error_explainer.py   # Endpoint reference
    └── code_generator.py    # Endpoint reference
```

---

## Setup & Running

### Prerequisites
- Python 3.10+
- A free Groq API key → [console.groq.com/keys](https://console.groq.com/keys)

### Install
```bash
cd ai
pip install -r requirements.txt
```

### Configure
```bash
# Copy example and fill in your key
cp .env.example .env
```

Edit `ai/.env`:
```
GROQ_API_KEY=gsk_your_key_here
AI_PORT=8000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### Run
```bash
python main.py
# → http://localhost:8000
# → Auto-reloads on file changes (Uvicorn --reload)
```

### Health Check
```
GET http://localhost:8000/health
```
```json
{
  "status": "OK",
  "service": "H-Script AI",
  "version": "2.0.0",
  "model": "llama-3.1-8b-instant",
  "endpoints": ["/ai/explain", "/ai/generate", "/ai/fix", "/ai/autocomplete", "/ai/explain-error", "/ai/agent"]
}
```

---

## Core: AI Client (`core/gemini_client.py`)

The central module that all 6 endpoints import from.

### How it works
1. Initialises a `Groq` client with `GROQ_API_KEY` from `.env`
2. Defines a `ThreadPoolExecutor` with 4 workers
3. Exports `ask_gemini(prompt)` — an async function that runs the sync Groq SDK call in a background thread, keeping FastAPI's event loop non-blocking
4. Handles rate limits (429) silently — returns `""` instead of crashing

### H-Script System Prompt
Every call to `ask_gemini` prepends a detailed system prompt that tells the LLM:
- All H-Script keywords and their equivalents
- All built-in functions and list methods
- Tone: friendly Hinglish, use desi references
- Rule: only generate valid H-Script syntax

### Model
```
groq/llama-3.1-8b-instant
```
- Free tier: 14,400 requests/day, 30 req/min
- Response time: typically 0.5–2 seconds

---

## API Endpoints

### 1. `POST /ai/explain`

Explains H-Script code in simple Hinglish, line by line.

**Request:**
```json
{
  "code": "let_him_cook x = 5\nboliye(x)",
  "selection": null
}
```
- `code` — full editor content
- `selection` *(optional)* — if provided, explains only the selected text

**Response:**
```json
{
  "explanation": "Bhai, pehli line mein ek variable x banaya gaya hai jisme value 5 dali hai 🎯 Doosri line mein boliye() se us value ko print kar diya!"
}
```

**Frontend trigger:** "Explain" chip in AI Chat tab, `🔍 Explain` bottom button

---

### 2. `POST /ai/generate`

Generates H-Script code from a plain English/Hinglish description.

**Request:**
```json
{
  "prompt": "write a function that adds two numbers",
  "context": "// optional: existing editor code for coherence"
}
```

**Response:**
```json
{
  "code": "pov add(a, b) {\n  wapas_karo a + b\n}\nboliye(add(3, 5))",
  "explanation": "Ek simple add function banaya — do numbers leta hai, sum return karta hai!"
}
```

**Parsing logic:**
1. Looks for ` ```...``` ` block → extracts code
2. Strips language tag (hscript, js, etc.)
3. Looks for `EXPLANATION:` marker → extracts explanation
4. Fallback: returns raw response as code if no code block found
5. If empty response (rate limit): returns a friendly wait message

**Frontend trigger:** Generate tab → "Generate H-Script" button

---

### 3. `POST /ai/fix`

Given broken code + error message, returns the complete fixed code.

**Request:**
```json
{
  "code": "let_him_cook x = 5\nboliye(y)",
  "error": "ReferenceError: y is not defined"
}
```

**Response:**
```json
{
  "fixed_code": "let_him_cook x = 5\nboliye(x)",
  "explanation": "Bhai, tune y use kiya tha but define nahi kiya tha! Maine y ko x se replace kar diya 😄"
}
```

**Parsing logic:** Same as `/generate` — extracts code block + `EXPLANATION:` marker.

**Frontend trigger:** "Fix" chip in Chat tab, `🔧 Fix` bottom button, agent `suggest_fix` tool

---

### 4. `POST /ai/autocomplete`

Returns 1–3 short ghost-text completions based on the last 10 lines of code.

**Request:**
```json
{
  "prefix": "let_him_cook name = \"bhai\"\nboliye("
}
```

**Response:**
```json
{
  "completions": ["name)", "\"Hello, \" + name)", "\"Namaste \" + name + \"!\")"]
}
```

**Optimisations:**
- Only sends last 10 lines to the LLM (keeps prompt small + fast)
- Frontend debounces calls at **2500ms** after user stops typing
- Only fires if code length > 5 characters
- Silently fails — empty completions, no error shown

**Frontend trigger:** Auto-fires in IDE editor after 2500ms idle

---

### 5. `POST /ai/explain-error`

Auto-triggered when `Run` returns errors. Classifies the error type and generates a beginner-friendly Hinglish explanation.

**Request:**
```json
{
  "code": "let_him_cook x = 5\nboliye(y)",
  "error": "ReferenceError 🚨: 'y' ka naam nahi pata bhai"
}
```

**Response:**
```json
{
  "error_type": "ReferenceError",
  "explanation": "Bhai tune y use kiya hai lekin use kabhi banaya nahi tha! 😅 Jab bhi koi variable use karo, pehle let_him_cook se banana padega.",
  "hint": "let_him_cook y = ... se pehle define karo"
}
```

**Error types classified:**
- `SyntaxError` — wrong syntax / missing brackets
- `ReferenceError` — variable/function used before declaration
- `TypeError` — wrong data type used
- `RuntimeError` — error during execution
- `LogicError` — code runs but output is wrong

**Parsing logic:** Looks for `ERROR_TYPE:`, `EXPLANATION:`, `HINT:` markers in structured response.

**Frontend trigger:** Auto-pops as a banner below IDE topbar when Run returns errors

---

### 6. `POST /ai/agent` *(Agentic AI)*

Multi-turn conversational AI with tool calling. The most powerful endpoint — can reason, use tools, and respond in context.

**Request:**
```json
{
  "message": "run my code and tell me what's wrong",
  "code": "let_him_cook x = 5\nboliye(y)",
  "history": [
    { "role": "user", "content": "hi" },
    { "role": "assistant", "content": "Namaste bhai! ..." }
  ]
}
```

**Response:**
```json
{
  "reply": "Bhai maine tera code run karke dekha...",
  "action": "fix",
  "result": { "suggestion": "let_him_cook x = 5\nboliye(x)" },
  "history": [...]
}
```

#### Tool Calling System

The agent can call 3 tools by writing `TOOL_CALL: tool_name(...)` in its response:

| Tool | What it does |
|---|---|
| `run_code(code)` | POSTs to Express `/api/run`, returns `{ output, errors }` |
| `explain_code(code)` | Calls `ask_gemini` to explain the code |
| `suggest_fix(code, error)` | Calls `ask_gemini` to suggest a fix |

#### Two-Pass Inference
1. **First pass** — Groq generates a response (may include `TOOL_CALL:`)
2. **If tool called** — parse tool name + args with regex, execute tool, get result
3. **Second pass** — Groq reflects on tool result and gives final friendly answer
4. **Action mapping** — `run_code → "run"`, `suggest_fix → "fix"`, `explain_code → "explain"`

#### Context Awareness
- Sends last **10 messages** of history for multi-turn context
- Injects current **editor code** as context
- Tool call args fallback to editor code if regex parsing fails

#### Frontend Behaviour
- `action: "fix"` → shows "Accept Fix" button in chat
- `action: "run"` → shows tool output in message
- History maintained in React state, sent with every request

---

## Frontend Integration

### API Client (`frontend/src/api/ai.js`)

```js
// All functions call http://localhost:8000/ai/...
explainCode(code, selection)   // → { explanation }
generateCode(prompt, context)  // → { code, explanation }
fixCode(code, error)           // → { fixed_code, explanation }
autocomplete(prefix)           // → { completions }
explainError(code, error)      // → { error_type, explanation, hint }
agentChat(message, code, hist) // → { reply, action, result, history }
```

### AI Panel (`frontend/src/components/AIPanel/`)

| File | Purpose |
|---|---|
| `AIPanel.jsx` | Main panel — Chat + Generate tabs, message rendering, form handling |
| `AIPanel.css` | Full styling — animations, glassmorphic, wave indicator |
| `NeuralCanvas.jsx` | Three.js component — animated neural network in hero header |

#### NeuralCanvas (Three.js)
- 28 floating nodes rendered with `THREE.SphereGeometry`
- Edges between nodes closer than 3.2 units (`THREE.Line`)
- Nodes pulse with `Math.sin` wave animations
- **When AI is thinking:** nodes speed up 3.5×, color shifts from `#a78bfa` → `#f0abfc`
- Edges rebuilt every 4 frames for smooth repositioning

### IDE Integration (`frontend/src/pages/IDE/IDE.jsx`)

| Feature | Implementation |
|---|---|
| **Autocomplete** | `useEffect` on `code` state, 2500ms debounce, sets `aiSuggestion` state |
| **Error explainer** | Called in `handleRun()` when `errors.length > 0` |
| **AI panel toggle** | `aiOpen` state, panel slides in from right, editor gets `margin-right: 380px` |
| **Quick actions** | Bottom bar: Explain / Fix / Error buttons pre-fill chat |

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| **Rate limit (429)** | Returns `""` silently — no crash, UI handles gracefully |
| **Groq API error** | Raises `RuntimeError` → caught by FastAPI global handler → `500` JSON |
| **Empty AI response** | Generate returns "try again" message; Chat shows friendly Hinglish error |
| **Tool call parse fail** | Falls back to editor code as default arg |
| **Backend unreachable** | `run_code` tool returns `{ output: [], errors: ["..."] }` |

---

## NLP Intent Classifier (`nlp/intent_classifier.py`)

Lightweight keyword-based intent detector used as a fast local fallback. Full intent understanding is handled by the Groq agent via in-context reasoning.

| Intent | Trigger keywords |
|---|---|
| `generate` | generate, write, create, make |
| `debug` | fix, debug, broken, error, wrong |
| `explain` | explain, what does, how does, samjhao |
| `review` | review, check, feedback, improve |
| `refactor` | refactor, clean, optimise, optimize |
| `chat` | *(default)* |

---

## Rate Limits (Groq Free Tier)

| Limit | Value |
|---|---|
| Requests per minute | 30 |
| Requests per day | 14,400 |
| Tokens per minute | 131,072 |
| Model | `llama-3.1-8b-instant` |

**Optimisations implemented:**
- Autocomplete debounced to 2500ms (not per-keystroke)
- Only last 10 lines sent for autocomplete
- System prompt embedded in user message (no extra tokens for `system_instruction`)
- Rate limit errors silently swallowed — no user-facing crash

---

## Deployment Notes

When deploying (e.g. Railway):
1. Set `GROQ_API_KEY` as an environment variable in Railway dashboard
2. Update `FRONTEND_URL` to your Vercel deployment URL
3. The FastAPI server listens on `0.0.0.0` so it works on any host
4. Uvicorn auto-detects `PORT` env variable on Railway

```bash
# Production start command
uvicorn main:app --host 0.0.0.0 --port $PORT
```
