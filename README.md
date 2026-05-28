# H-Script 🔥

> An esoteric, Hinglish-flavored interpreted programming language built from scratch — for fun, vibes, and the culture.

**H-Script** is a fully working programming language with a Lexer → Parser → AST → Interpreter pipeline. Syntax is inspired by Indian internet slang, Bollywood, and pure brainrot energy.

---

## Quick Start

```bash
# Interactive REPL
npm run repl

# Run a .hs file
node test/testrunner.js yourfile.hs

# Run all tests
node test/testrunner.js

# Meme error showcase
node test/error_test.js
```

---

## The Language at a Glance

```
// Variables
let_him_cook name = "Rocky"
let_him_cook score = 9001

// Print
boliye(name)
boliye(`${name} ka score: ${score}`)

// If / Else-if / Else
agar (score >= 9000) {
  boliye("OVER 9000 🔥")
} baaki_sab agar (score >= 5000) {
  boliye("GigaChad level")
} warna {
  boliye("Skill issue fr fr")
}

// For loop
baar_baar (let_him_cook i = 1; i <= 5; i++) {
  boliye(i * i)
}

// Function with default params
pov greet(who = "yaar") {
  boliye(`Hello ${who}!`)
}
greet("Rahul")
greet()

// Try / Catch / Finally
agar_risk {
  jhel_isko "Oops bc!"
} pakad_lo (e) {
  boliye(`Error: ${e}`)
} jo_bhi_hai_bhaad_me_jaaye {
  boliye("Cleanup ho gaya!")
}
```

---

## Phase Status

| Phase | Status | Features |
|---|---|---|
| **Phase 1** | ✅ Complete | Core language |
| **Phase 2** | ✅ Complete | Arrays, OOP, stdlib, REPL, errors |
| **Phase 3** | ✅ Complete | Try/catch, templates, JugaadMap, spread, ternary |

---

## Phase 1 — Core Language

The full pipeline: Lexer → Parser → AST → Interpreter.

| Feature | H-Script | Meaning |
|---|---|---|
| Variable | `let_him_cook x = 10` | `let x = 10` |
| Print | `boliye(x)` | `console.log(x)` |
| If | `agar (cond) { }` | `if` |
| Else | `warna { }` | `else` |
| While | `jab_tak_doomscroll (cond) { }` | `while` |
| For | `baar_baar (init; cond; update) { }` | `for` |
| Break | `nikal_lo` | `break` |
| Continue | `skip_karo` | `continue` |
| Function | `pov fn(a, b) { }` | `function` |
| Return | `wapas_karo val` | `return` |
| Class | `squad ClassName { }` | `class` |
| Inherit | `squad Dog nepo_baby_of Animal { }` | `extends` |
| Instance | `new Dog("Rocky")` | `new` |
| Boolean | `no_cap` / `fraud` | `true` / `false` |
| This | `this.name` | `this` |
| Operators | `+ - * / % == != > < >= <=` | standard |
| Logical | `&& \|\| !` | standard |

```
// OOP Example
squad Animal {
  pov init(name) {
    this.name = name
  }
  pov speak() {
    boliye(this.name)
  }
}

squad Dog nepo_baby_of Animal {
  pov speak() {
    buzurg.speak()
    boliye("Bho Bho!")
  }
}

let_him_cook d = new Dog("Tommy")
d.speak()
```

---

## Phase 2 — Power Features

| Feature | Syntax | Description |
|---|---|---|
| Null | `null` | Null value |
| BakchodList | `[1, 2, 3]` | Arrays |
| Array push | `arr.daalo(val)` | push |
| Array pop | `arr.nikalo()` | pop |
| Array sort | `arr.sort_karo()` | sort numerically |
| Array reverse | `arr.palat()` | reverse in-place |
| Array join | `arr.milao(sep)` | join to string |
| Array find | `arr.dhundo(val)` | indexOf |
| Array slice | `arr.slice_karo(s,e)` | slice |
| Length | `arr.lambai` | `.length` |
| First/Last | `arr.pehla` / `arr.aakhri` | first / last element |
| Super | `buzurg.method()` | `super.method()` |
| Private props | `this._secret` | `_` prefix = private |
| Closures | inner fn captures outer scope | ✅ |
| Anonymous fn | `pov(x) { wapas_karo x * x }` | lambda |
| Floats | `3.14` | decimal numbers |
| Escape chars | `"\n"` `"\t"` `"\\"` | in strings |
| Compound ops | `+=` `-=` `*=` `/=` | ✅ |
| Increment | `i++` `++i` `i--` | ✅ |
| Bitwise | `& \| ^ ~ << >> >>>` | ✅ |
| REPL | `npm run repl` | interactive shell |
| Test runner | `node test/testrunner.js` | auto test runner |
| Meme errors | line + col + Bollywood/meme energy | 💀🚩🔥 |

```
// BakchodList
let_him_cook arr = [3, 1, 4, 1, 5]
arr.sort_karo()
boliye(arr.milao(", "))   // 1, 1, 3, 4, 5
boliye(arr.lambai)        // 5
boliye(arr.aakhri)        // 5
```

### Standard Library (Phase 2)
Auto-available everywhere — no import needed:

| Function | Description |
|---|---|
| `typeOf(val)` | `"number"` `"string"` `"BakchodList"` `"JugaadMap"` `"pov"` `"null"` |
| `toNumber(x)` | Convert to number |
| `toString(x)` | Convert to string |
| `toBool(x)` | Convert to boolean |
| `ceiling(n)` | Math.ceil |
| `flooring(n)` | Math.floor |
| `powerOf(b, e)` | Math.pow |
| `squareRoot(n)` | Math.sqrt |
| `absValue(n)` | Math.abs |
| `randomNum(min, max)` | Random int in range |
| `lambai(s)` | String/array length |
| `upperCase(s)` | UPPER CASE |
| `lowerCase(s)` | lower case |
| `trim_karo(s)` | Trim whitespace |
| `repeat_karo(s, n)` | Repeat string n times |
| `includes_kya(s, sub)` | String includes check |
| `split_karo(s, sep)` | Split to BakchodList |
| `replace_karo(s, f, t)` | Replace first occurrence |
| `bolao(s)` | Print without newline |

---

## Phase 3 — Modern Features

| Feature | Syntax | Description |
|---|---|---|
| Try | `agar_risk { }` | try block |
| Catch | `pakad_lo (e) { }` | catch with optional binding |
| Finally | `jo_bhi_hai_bhaad_me_jaaye { }` | always runs |
| Throw | `jhel_isko "msg"` | throw any value |
| Template literal | `` `Hello ${name}!` `` | string interpolation |
| Ternary | `cond ? a : b` | one-liner condition |
| JugaadMap | `{ name: "Rocky", age: 21 }` | key-value dictionary |
| Object spread | `{ ...obj1, ...obj2 }` | merge maps |
| Array spread | `[...a, ...b]` | spread into array |
| Call spread | `fn(...arr)` | spread as function args |
| Default params | `pov fn(x = 10)` | default values |
| else-if | `baaki_sab agar (...)` | else-if chain |

```
// Template Literals
let_him_cook name = "Rocky"
boliye(`Hello ${name}, level ${9000 + 1}!`)

// JugaadMap
let_him_cook user = { name: "Bhai", level: 9001 }
boliye(user.name)
boliye(user["level"])
user.city = "Mumbai"
let_him_cook merged = { ...user, vip: no_cap }

// Try / Catch / Finally
agar_risk {
  jhel_isko "Yeh galat tha bc!"
} pakad_lo (err) {
  boliye(`Caught: ${err}`)
} jo_bhi_hai_bhaad_me_jaaye {
  boliye("Jo bhi ho, yeh chalega!")
}

// Spread
let_him_cook nums = [3, 1, 4, 1, 5]
boliye(max(...nums))   // 5
boliye(min(...nums))   // 1

// Default Params
pov connect(host = "localhost", port = 8080) {
  boliye(`${host}:${port}`)
}
connect()              // localhost:8080
connect("prod.server") // prod.server:8080

// else-if
agar (score >= 90) {
  boliye("Sigma")
} baaki_sab agar (score >= 70) {
  boliye("GigaChad")
} warna {
  boliye("Skill issue")
}
```

### Standard Library (Phase 3)

| Function | Description |
|---|---|
| `min(a, b, ...)` or `min(...arr)` | Minimum value |
| `max(a, b, ...)` or `max(...arr)` | Maximum value |
| `isNaN_kya(val)` | Is NaN check |
| `parseInt_karo(s, base?)` | Parse integer |
| `parseFloat_karo(s)` | Parse float |
| `keys_nikalo(map)` | BakchodList of keys |
| `values_nikalo(map)` | BakchodList of values |
| `hasKey_kya(map, key)` | Key exists check |

---

## The Error System 🎬

H-Script errors carry **line + column** info and are written with maximum chaos energy — Bollywood references, Indian internet slang, Hollywood memes, and mild cuss words.

```
// Undefined variable
boliye(ghost)
→ RuntimeError 🔥: 'ghost' tujhe dekh ke hi bhaag gaya 👻
  — NO BITCHES?? NO VARIABLE?? let_him_cook se declare kar pehle haramkhor

// Division by zero
let_him_cook x = 10 / 0
→ RuntimeError 🔥: RATIO ATTEMPT FAILED BSDK 🫣
  — Thanos ke 6 infinity stones bhi yeh fix nahi kar sakte. SKILL ISSUE OF THE CENTURY

// Missing bracket
agar (no_cap) { boliye(1)
→ ParseError 🚩: BHAI TERA '}' KAHAN GAYA SAALA?? 🎪
  — Gandalf bolta hai: YOU SHALL NOT PARSE!
```

| Error Type | Emoji | Trigger |
|---|---|---|
| `LexerError` | 💀 | Bad char, unterminated string/comment |
| `ParseError` | 🚩 | Wrong syntax, missing tokens |
| `RuntimeError` | 🔥 | Type errors, undefined vars, null access |
| `UchhalError` | 🪃 | User-thrown via `jhel_isko` |

---

## Project Structure

```
H-Script_Phase--1-main/
├── src/
│   ├── lexer.js        → Tokenizer
│   ├── tokens.js       → Token type constants
│   ├── parser.js       → AST builder
│   ├── ast.js          → AST node registry
│   ├── interpreter.js  → Tree-walking evaluator
│   ├── utils.js        → 27 stdlib functions
│   ├── errors.js       → Error classes (4 types)
│   └── repl.js         → Interactive REPL
├── test/
│   ├── testrunner.js         → Auto test runner
│   ├── error_test.js         → Meme error showcase
│   ├── full_demo.hs          → All-features demo
│   ├── phase3_vibe.hs        → Phase 3 integration test
│   ├── trycatch_test.hs      → Try/catch/finally/throw
│   ├── interpolation_test.hs → Template literals
│   ├── ternary_test.hs       → Ternary operator
│   ├── jugaadmap_test.hs     → JugaadMap (dict)
│   ├── spread_test.hs        → Spread operator
│   ├── defaultparams_test.hs → Default params
│   ├── elseif_test.hs        → Else-if chaining
│   ├── arrays_test.hs        → BakchodList
│   ├── closure.hs            → Closures
│   ├── oops.hs               → OOP basics
│   ├── oops_upgraded.hs      → Private + super
│   ├── stdlib_test.hs        → All stdlib functions
│   └── super_test.hs         → Chained buzurg calls
├── docs/
│   ├── Phase1.md       → Phase 1 reference
│   ├── Phase2.md       → Phase 2 reference
│   └── Phase3.md       → Phase 3 reference
└── package.json
```

---

## Complete Keyword Reference

| Keyword | Meaning |
|---|---|
| `let_him_cook` | Variable declaration |
| `boliye` | Print with newline |
| `bolao` | Print without newline |
| `agar` | if |
| `baaki_sab agar` | else-if |
| `warna` | else |
| `jab_tak_doomscroll` | while |
| `baar_baar` | for |
| `nikal_lo` | break |
| `skip_karo` | continue |
| `pov` | function / method |
| `wapas_karo` | return |
| `squad` | class |
| `nepo_baby_of` | extends |
| `this` | current instance |
| `new` | instantiate class |
| `buzurg` | super |
| `null` | null value |
| `no_cap` | true |
| `fraud` | false |
| `agar_risk` | try |
| `pakad_lo` | catch |
| `jo_bhi_hai_bhaad_me_jaaye` | finally |
| `jhel_isko` | throw |

---

*Built for fun, vibes, and the culture. No cap fr fr.* 🔥
