# H-Script Phase 3 — Complete Language Reference

> Phase 3 fills every known Phase 2 gap and adds powerful new features — JugaadMaps, template literals, try/catch, ternary, spread, default params, and else-if chaining.

---

## What's New in Phase 3

| # | Feature | Syntax | Description |
|---|---|---|---|
| 1 | **Try / Catch / Finally** | `agar_risk` / `pakad_lo` / `jo_bhi_hai_bhaad_me_jaaye` | Handle errors inside H-Script |
| 2 | **Throw** | `jhel_isko "msg"` | Throw custom errors |
| 3 | **String Interpolation** | `` `Hello ${name}!` `` | Backtick template literals |
| 4 | **Ternary Operator** | `cond ? a : b` | One-liner conditions |
| 5 | **JugaadMap** | `{ key: value }` | Key-value dictionaries |
| 6 | **Spread Operator** | `...arr` | Spread arrays into calls or literals |
| 7 | **Object Spread** | `{ ...obj1, ...obj2 }` | Merge JugaadMaps |
| 8 | **Default Params** | `pov fn(x = 10)` | Default function parameter values |
| 9 | **else-if chaining** | `baaki_sab agar (...)` | Multi-branch if chains |
| 10 | **New Stdlib** | `min`, `max`, `isNaN_kya`, `keys_nikalo`, `values_nikalo`, `hasKey_kya`, `parseInt_karo`, `parseFloat_karo` | 8 new built-in functions |

---

## Try / Catch / Finally

```
agar_risk {
  // code that might fail
} pakad_lo (e) {
  // e is the error message or thrown value
  boliye(e)
} jo_bhi_hai_bhaad_me_jaaye {
  // always runs, pass or fail
  boliye("cleanup done")
}
```

### Rules
- `pakad_lo` and/or `jo_bhi_hai_bhaad_me_jaaye` must follow `agar_risk` — can't leave it bare
- `pakad_lo` variable binding is optional: `pakad_lo { ... }` works too
- `jo_bhi_hai_bhaad_me_jaaye` is optional — works without catch too

### Examples

```
// Catch a user throw
agar_risk {
  jhel_isko "Yeh galat tha bc!"
} pakad_lo (err) {
  boliye(err)   // → "Yeh galat tha bc!"
}

// Catch a runtime error
agar_risk {
  let_him_cook x = 10 / 0
} pakad_lo (e) {
  boliye("Division saved!")
}

// Only finally (no catch)
agar_risk {
  boliye("doing stuff")
} jo_bhi_hai_bhaad_me_jaaye {
  boliye("cleanup")
}
```

---

## Throw — `jhel_isko`

Throw any H-Script value as an error:

```
jhel_isko "Custom error message!"
jhel_isko 404
jhel_isko no_cap
```

Thrown value is bound to the catch variable:

```
agar_risk {
  jhel_isko 503
} pakad_lo (code) {
  boliye(code)   // → 503
}
```

---

## String Interpolation

Use backticks `` ` `` instead of `"` to embed expressions with `${...}`:

```
let_him_cook name = "Rocky"
let_him_cook level = 42

boliye(`Hello ${name}!`)             // Hello Rocky!
boliye(`Level: ${level * 2}`)        // Level: 84
boliye(`Type: ${typeOf(name)}`)      // Type: string
boliye(`Upper: ${upperCase(name)}`)  // Upper: ROCKY
```

### Supports
- Any expression: `${a + b}`, `${fn()}`, `${arr[0]}`
- Nested template in `${}` is allowed
- `null` renders as `"null"`
- `BakchodList` renders as `BakchodList [ ... ]`
- `JugaadMap` renders as `JugaadMap { ... }`

---

## Ternary Operator

```
condition ? valueIfTrue : valueIfFalse
```

```
let_him_cook x = 10
boliye(x > 5 ? "big" : "small")         // big

// Store the result
let_him_cook label = x >= 10 ? "max" : "not max"

// Nested ternary
let_him_cook grade = score >= 90 ? "A" : score >= 80 ? "B" : "C"

// In templates
boliye(`${x} is ${x % 2 == 0 ? "even" : "odd"}`)
```

---

## JugaadMap

Key-value dictionaries using JSON-style syntax:

```
let_him_cook person = { name: "Rocky", age: 21, city: "Mumbai" }
```

### Access
```
boliye(person.name)       // dot access
boliye(person["age"])     // bracket access
```

### Assignment
```
person.level = 9001       // new or update property
person["skill"] = "max"   // bracket style
```

### Nested
```
let_him_cook addr = { street: "Linking Road", pin: 400050 }
let_him_cook user = { name: "Bhai", address: addr }
boliye(user.address.street)
```

### typeOf
```
typeOf({ name: "x" })   // → "JugaadMap"
```

### JugaadMap Stdlib

```
keys_nikalo(map)          → BakchodList of keys
values_nikalo(map)        → BakchodList of values
hasKey_kya(map, "key")    → no_cap / fraud
```

---

## Object Spread

Merge JugaadMaps using `...`:

```
let_him_cook defaults = { theme: "dark", lang: "H-Script" }
let_him_cook overrides = { lang: "H-Script Pro", version: 3 }
let_him_cook config = { ...defaults, ...overrides }

boliye(config.theme)    // dark   (from defaults)
boliye(config.lang)     // H-Script Pro  (overridden)
boliye(config.version)  // 3      (from overrides)
```

---

## Spread Operator

### In Array Literals
```
let_him_cook a = [1, 2, 3]
let_him_cook b = [4, 5, 6]
let_him_cook merged = [...a, ...b]      // [1, 2, 3, 4, 5, 6]
let_him_cook extended = [0, ...a, 99]  // [0, 1, 2, 3, 99]
```

### In Function Calls
```
pov add3(x, y, z) {
  wapas_karo x + y + z
}
let_him_cook nums = [10, 20, 30]
boliye(add3(...nums))     // 60

// Mixed: regular args + spread
boliye(sum5(1, ...nums, 5))
```

### With Stdlib
```
let_him_cook scores = [3, 1, 4, 1, 5, 9]
boliye(max(...scores))   // 9
boliye(min(...scores))   // 1
```

---

## Default Parameters

```
pov greet(name = "yaar") {
  boliye(`Hello ${name}!`)
}
greet("Rocky")   // Hello Rocky!
greet()          // Hello yaar!
```

### Multiple Defaults
```
pov connect(host = "localhost", port = 8080) {
  boliye(`${host}:${port}`)
}
connect("google.com", 443)   // google.com:443
connect("google.com")        // google.com:8080
connect()                    // localhost:8080
```

### In Class Methods
```
squad Counter {
  pov init(start = 0, step = 1) {
    this.count = start
    this.step = step
  }
}
let_him_cook c = new Counter()      // starts at 0, step 1
let_him_cook c2 = new Counter(10, 5) // starts at 10, step 5
```

---

## else-if Chaining — `baaki_sab agar`

```
agar (score >= 90) {
  boliye("A")
} baaki_sab agar (score >= 80) {
  boliye("B")
} baaki_sab agar (score >= 70) {
  boliye("C")
} warna {
  boliye("F")
}
```

- Chain as many `baaki_sab agar` as you want
- Final `warna` is optional
- Can be used inside functions, loops, try blocks

---

## New Stdlib Functions (Phase 3)

### Math
```
min(1, 2, 3)              → 1
min(...arr)               → smallest in arr
max(10, 20, 30)           → 30
max(...arr)               → largest in arr
isNaN_kya("abc")          → no_cap
isNaN_kya(42)             → fraud
parseInt_karo("42")       → 42
parseInt_karo("FF", 16)   → 255  (base-16)
parseFloat_karo("3.14")   → 3.14
```

### JugaadMap
```
keys_nikalo(map)          → BakchodList of all keys
values_nikalo(map)        → BakchodList of all values
hasKey_kya(map, "key")    → no_cap / fraud
```

---

## Complete Phase 3 Keyword Reference

| Keyword | Meaning |
|---|---|
| `agar_risk { }` | try |
| `pakad_lo (e) { }` | catch |
| `jo_bhi_hai_bhaad_me_jaaye { }` | finally |
| `jhel_isko expr` | throw |
| `` `text ${expr}` `` | template literal / string interpolation |
| `cond ? a : b` | ternary operator |
| `{ key: value }` | JugaadMap (object/dictionary) |
| `...arr` | spread operator |
| `pov fn(x = val)` | default parameter |
| `baaki_sab agar` | else-if |

---

## All Phase 3 Test Files

| File | What it tests |
|---|---|
| `trycatch_test.hs` | agar_risk, pakad_lo, jo_bhi_hai_bhaad_me_jaaye, jhel_isko |
| `interpolation_test.hs` | Backtick template literals with expressions |
| `ternary_test.hs` | `? :` ternary, nested, in templates |
| `jugaadmap_test.hs` | JugaadMap CRUD, spread, stdlib helpers |
| `spread_test.hs` | `...` in arrays, calls, stdlib |
| `defaultparams_test.hs` | Default params in fns and class methods |
| `elseif_test.hs` | `baaki_sab agar` chains |
| `phase3_vibe.hs` | Everything combined — the real vibe check |

---

## Known Limitations (Phase 3)

- No module / import system (Phase 4 candidate)
- No `forEach` / `map` / `filter` on BakchodList (Phase 4 candidate)
- No multi-line string without backticks
- `buzurg` still only works as `buzurg.method()` — not `const ref = buzurg`
- `jhel_isko` only throws scalars and strings (no throwing class instances yet)
