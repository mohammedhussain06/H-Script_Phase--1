# H-Script Phase 2 — Complete Language Reference

> Phase 2 builds on Phase 1's working foundation to deliver a more solid, expressive, and debuggable language — with errors that hit different. 🔥

---

## What's New in Phase 2

| Feature | Description |
|---|---|
| **Meme Error System** | Errors with line + column, Indian cuss words, Bollywood + Hollywood refs, brainrot memes |
| **`null`** | Null value keyword |
| **BakchodList** | Arrays with full method support |
| **`buzurg`** | Super keyword for calling parent class methods |
| **Stdlib** | 22 built-in functions, auto-available globally — no import needed |
| **Float support** | Numbers like `3.14` work natively |
| **Escape sequences** | `"\n"`, `"\t"`, `"\\"` in strings |
| **REPL** | Interactive shell with multi-line support |
| **Test runner** | Auto-runs all `.hs` files in `test/` |
| **AST Registry** | `ast.js` documents every AST node type |
| **Private properties** | Properties prefixed with `_` are class-private |
| **Compound assignment** | `+=`, `-=`, `*=`, `/=` |
| **Prefix/postfix `++`/`--`** | `i++`, `++i`, `i--`, `--i` |
| **Bitwise operators** | `&`, `|`, `^`, `~`, `<<`, `>>`, `>>>` |
| **Anonymous functions** | `pov(x) { wapas_karo x }` as expressions |
| **Closures** | Functions capture their surrounding scope |

---

## Null

```
let_him_cook x = null

agar (x == null) {
  boliye("it is null")
}
```

`null` is a first-class value. `typeOf(null)` returns `"null"`.

---

## BakchodList (Arrays)

### Creating
```
let_him_cook arr = [1, 2, 3]
let_him_cook empty = []
let_him_cook mixed = ["hello", 42, no_cap, null]
```

### Properties
```
arr.lambai      → length (number)
arr.pehla       → first element (null if empty)
arr.aakhri      → last element (null if empty)
```

### Index Access & Assignment
```
boliye(arr[0])      → first element
arr[0] = 99         → assign to index
```

### Methods
```
arr.daalo(val)           → push — add to end
arr.nikalo()             → pop — remove from end, returns popped value
arr.jodo(otherArr)       → concat — returns new merged array
arr.palat()              → reverse in-place
arr.sort_karo()          → sort numerically in-place
arr.milao(separator)     → join to string (like .join())
arr.slice_karo(s, e)     → return subarray [s, e)
arr.dhundo(val)          → indexOf — returns -1 if not found
```

### Example
```
let_him_cook arr = [3, 1, 2]
arr.sort_karo()
boliye(arr.milao(", "))    // "1, 2, 3"

arr.daalo(99)
boliye(arr.lambai)         // 4
boliye(arr.aakhri)         // 99
```

---

## `buzurg` (super)

Call a parent class method from inside a child class:

```
squad Animal {
  pov init(name) {
    this.name = name
  }
  pov speak() {
    boliye(this.name)
  }
}

squad Dog nepo_baby_of Animal {
  pov init(name, breed) {
    buzurg.init(name)       // calls Animal's init
    this.breed = breed
  }
  pov speak() {
    buzurg.speak()          // calls Animal's speak
    boliye("Bho Bho!")
  }
}

let_him_cook d = new Dog("Rocky", "Lab")
d.speak()
// Rocky
// Bho Bho!
```

> `buzurg` only works as `buzurg.method(args)` — using it standalone throws a Darth Vader-tier error.

---

## Private Properties

Properties prefixed with `_` are enforced as class-private:

```
squad BankAccount {
  pov init(bal) {
    this._balance = bal     // private
  }
  pov getBalance() {
    wapas_karo this._balance
  }
}

let_him_cook acc = new BankAccount(1000)
boliye(acc.getBalance())    // 1000
boliye(acc._balance)        // 💥 RuntimeError — CAUGHT IN 4K
```

---

## Floats & Escape Sequences

```
let_him_cook pi = 3.14159
boliye(ceiling(pi))         // 4
boliye(flooring(pi))        // 3

boliye("line1\nline2")      // prints on two lines
boliye("tab\there")         // tab spacing
boliye("quote: \"hello\"")  // escaped quote
```

---

## Anonymous Functions & Closures

```
// Anonymous function stored in a variable
let_him_cook square = pov(x) { wapas_karo x * x }
boliye(square(5))            // 25

// Closure — inner function captures outer scope
pov makeCounter() {
  let_him_cook count = 0
  wapas_karo pov() {
    count += 1
    wapas_karo count
  }
}

let_him_cook counter = makeCounter()
boliye(counter())   // 1
boliye(counter())   // 2
boliye(counter())   // 3
```

---

## Compound Assignment & Increment

```
let_him_cook x = 10
x += 5      // x = 15
x -= 3      // x = 12
x *= 2      // x = 24
x /= 4      // x = 6

x++         // x = 7
++x         // x = 8
x--         // x = 7
```

---

## Bitwise Operators

```
boliye(5 & 3)    // 1  (AND)
boliye(5 | 3)    // 7  (OR)
boliye(5 ^ 3)    // 6  (XOR)
boliye(~5)       // -6 (NOT)
boliye(1 << 3)   // 8  (left shift)
boliye(8 >> 2)   // 2  (right shift)
boliye(8 >>> 2)  // 2  (unsigned right shift)
```

---

## Standard Library

All 22 functions are globally available — **no import needed**.

### Type System
```
typeOf(val)           → "number" | "string" | "boolean" | "null" | "BakchodList" | "pov"
toNumber("42")        → 42
toString(3.14)        → "3.14"
toBool(0)             → false
```

### Math
```
ceiling(3.2)          → 4
flooring(3.9)         → 3
powerOf(2, 8)         → 256
squareRoot(144)       → 12
absValue(-7)          → 7
randomNum(1, 10)      → random integer between 1 and 10 (inclusive)
```

### String
```
lambai("hello")              → 5      (also works on BakchodList)
upperCase("hello")           → "HELLO"
lowerCase("WORLD")           → "world"
trim_karo("  hi  ")          → "hi"
repeat_karo("ha", 3)         → "hahaha"
includes_kya("fun", "un")    → true
split_karo("a,b,c", ",")     → BakchodList ["a", "b", "c"]
replace_karo(s, from, to)    → replace first occurrence
```

### Output
```
bolao("no newline")    → prints without newline (like process.stdout.write)
boliye("with newline") → prints with newline (already in Phase 1)
```

---

## The Meme Error System 🎬🔥

H-Script errors are not your average boring compiler messages. Every error hits with:
- 📍 Exact **line + column** location
- 🎭 Bollywood / Hollywood reference
- 🤡 Indian internet meme energy
- 💀 Mild cuss words for flavor

### Error Types

| Type | Emoji | When it fires |
|---|---|---|
| `LexerError 💀` | 💀 | Bad character, unterminated string/comment |
| `ParseError 🚩` | 🚩 | Wrong syntax, missing brackets, bad structure |
| `RuntimeError 🔥` | 🔥 | Wrong types, undefined vars, null access, etc. |

### Lexer Error Examples

```
// Unterminated comment
/* yeh comment khatam nahi hua
→ LexerError 💀: BSDK tune comment start kiya aur Bermuda Triangle mein ghus gaya 🌀
  — yeh Thanos ka snap nahi tha. Apna '*/' dhundh haramkhor, SKILL ISSUE fr fr

// Unterminated string
let_him_cook x = "yeh band nahi hui
→ LexerError 💀: SAALA teri string Sholay ki Basanti se bhi zyada bak bak karti hai 🎬
  — ek closing '"' daal de bc. Left on read fr fr

// Unknown character
let_him_cook x = 10 @ 20
→ LexerError 💀: '@' KAHAN SE AAYA YEH?? 🧙
  — Mogambo khush nahi hua. Ohio-level cringe hai. L + ratio. Nikal bahar chutiye
```

### Parse Error Examples

```
// Missing identifier
let_him_cook = 10
→ ParseError 🚩: Expected IDENT but got '=' — L + RATIO + YOU FELL OFF 💥
  Chetan Bhagat bhi isse better likhta bsdk. Even the Sorting Hat said 'NOT GRYFFINDOR'

// Missing closing brace
agar (no_cap) { boliye(1)
→ ParseError 🚩: BHAI TERA '}' KAHAN GAYA SAALA?? 🎪
  Gandalf bolta hai: YOU SHALL NOT PARSE! Skill issue of the highest order

// Non-method inside squad
squad Villain { let_him_cook x = 10 }
→ ParseError 🚩: YEH KYA BAKWAAS HAI BC?? 🙏 — Bahubali ke darbaar mein
  sirf 'pov' methods allowed hain. NPC behavior fr fr. KICK OUT haramkhor
```

### Runtime Error Examples

```
// Undefined variable
boliye(ghost)
→ RuntimeError 🔥: 'ghost' tujhe dekh ke hi bhaag gaya 👻
  — NO BITCHES?? NO VARIABLE?? let_him_cook se declare kar pehle haramkhor

// Division by zero
let_him_cook x = 10 / 0
→ RuntimeError 🔥: RATIO ATTEMPT FAILED BSDK 🫣
  — Thanos ke 6 infinity stones bhi yeh fix nahi kar sakte. SKILL ISSUE OF THE CENTURY

// Method on null
let_him_cook x = null
x.doSomething()
→ RuntimeError 🔥: TU BRAIN WORMS KA SHIKAAR HAI BC 💥
  — NULL ka koi ghar nahi, koi method nahi, koi rizz nahi. Ghar ja saala

// Undefined class
let_him_cook x = new Ghost()
→ RuntimeError 🔥: 'Ghost'?? KABHI SUNA HI NAHI SAALA 💅
  — Voldemort bhi is class ka naam nahi jaanta bc. Fanum tax on your undefined class

// Private property access from outside
acc._balance
→ RuntimeError 🔥: '_balance' is PRIVATE PROPERTY bc 🔒
  — CAUGHT IN 4K trying to access this. Squad-exclusive zone. Bahar teri aukat nahi. L + ratio
```

---

## REPL

```bash
node src/repl.js
```

```
H» let_him_cook x = 10
H» boliye(x * x)
100
H» let_him_cook arr = [1, 2, 3]
H» arr.daalo(4)
H» boliye(arr.lambai)
4
H» :help      → show commands
H» :clear     → reset environment
H» :quit      → exit
```

Multi-line input is supported — open a `{` and the prompt shows `...` until it's closed.

---

## Running Tests

```bash
# Run all .hs files in test/
node test/testrunner.js

# Run a single file
node test/testrunner.js arrays_test.hs

# Run the meme error showcase
node test/error_test.js
```

### Test Files

| File | What it tests |
|---|---|
| `arrays_test.hs` | BakchodList creation, methods, indexing |
| `closure.hs` | Closures, function scope capture |
| `loop.hs` | while, for, break, continue |
| `null_test.hs` | null values, null comparisons |
| `oops.hs` | Basic class + inheritance |
| `oops_upgraded.hs` | Private props, buzurg (super), multi-level inheritance |
| `operators_test.hs` | Arithmetic, comparison, bitwise, compound assign |
| `stdlib_test.hs` | All 22 stdlib functions |
| `super_test.hs` | buzurg chained calls across 3 levels |
| `vibe_check.hs` | General sanity / vibe check |
| `error_test.js` | Triggers every meme error to showcase messages |

---

## Complete Keyword Reference

| Keyword | Meaning |
|---|---|
| `let_him_cook` | Variable declaration |
| `boliye` | Print with newline |
| `bolao` | Print without newline |
| `agar` | if |
| `warna` | else |
| `jab_tak_doomscroll` | while |
| `baar_baar` | for |
| `nikal_lo` | break |
| `skip_karo` | continue |
| `pov` | function / method |
| `wapas_karo` | return |
| `squad` | class |
| `nepo_baby_of` | extends (inheritance) |
| `this` | current instance |
| `new` | instantiate a class |
| `buzurg` | super — call parent method |
| `null` | null value |
| `no_cap` | true |
| `fraud` | false |

---

## AST Node Reference

All AST node types defined in `src/ast.js`:

| Category | Nodes |
|---|---|
| **Top-level** | `Program` |
| **Statements** | `BlockStatement`, `VariableDeclaration`, `PrintStatement`, `ExpressionStatement`, `IfStatement`, `WhileStatement`, `ForStatement`, `BreakStatement`, `ContinueStatement`, `ReturnStatement` |
| **Declarations** | `FunctionDeclaration`, `ClassDeclaration` |
| **Expressions** | `AssignmentExpression`, `BinaryExpression`, `UnaryExpression`, `CallExpression`, `MemberExpression`, `IndexExpression`, `NewExpression`, `FunctionExpression` |
| **Literals** | `NumberLiteral`, `StringLiteral`, `BooleanLiteral`, `NullLiteral`, `ArrayLiteral` |
| **Special** | `Identifier`, `ThisExpression`, `SuperExpression` |

---

## Project File Structure

```
H-Script_Phase--1-main/
├── src/
│   ├── lexer.js        → Tokenizer — converts source text to tokens
│   ├── tokens.js       → Token type constants
│   ├── parser.js       → Builds AST from token stream
│   ├── ast.js          → AST node factory registry (documentation)
│   ├── interpreter.js  → Tree-walking evaluator
│   ├── utils.js        → Standard library (22 native functions)
│   ├── errors.js       → LexerError, ParseError, RuntimeError classes
│   └── repl.js         → Interactive REPL shell
├── test/
│   ├── testrunner.js   → Auto test runner for .hs files
│   ├── error_test.js   → Meme error showcase script
│   └── *.hs            → 10 H-Script test files
├── docs/
│   ├── Phase1.md       → Phase 1 reference
│   └── Phase2.md       → This file
└── package.json
```

---

## Known Limitations (Phase 2)

- No module / import system
- No string interpolation (`"Hello ${name}"` doesn't work)
- No `try/catch` error handling **within** H-Script itself
- `buzurg` only works as `buzurg.method()` — not as a standalone value
- No multi-catch or finally blocks
- Grammar may still evolve in Phase 3
