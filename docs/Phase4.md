# H-Script Phase 4 — Complete Language Reference

> Phase 4 adds functional programming power to H-Script — higher-order array functions and a file import system. With these, you can write real, modular programs.

---

## What's New in Phase 4

| # | Feature | Syntax | Description |
|---|---|---|---|
| 1 | **forEach_karo** | `arr.forEach_karo(fn)` | Iterate with a callback |
| 2 | **map_karo** | `arr.map_karo(fn)` | Transform every element |
| 3 | **filter_karo** | `arr.filter_karo(fn)` | Keep matching elements |
| 4 | **reduce_karo** | `arr.reduce_karo(fn, init)` | Fold to a single value |
| 5 | **koi_bhi** | `arr.koi_bhi(fn)` | `some` — any match? |
| 6 | **sab_sahi** | `arr.sab_sahi(fn)` | `every` — all match? |
| 7 | **dhundo_karo** | `arr.dhundo_karo(fn)` | `find` — first match |
| 8 | **Import system** | `lele "file.hs"` | Import another H-Script file |

---

## Higher-Order Array Functions

All HOF methods accept a `pov` function (anonymous or named) as a callback.  
Callback receives `(element, index, array)` — use only the args you need.

---

### `forEach_karo` — iterate

```
let_him_cook nums = [1, 2, 3, 4, 5]

nums.forEach_karo(pov(n) {
  boliye(n * n)
})
// 1  4  9  16  25
```

- Returns `null`
- Use for side-effects (printing, mutation)

---

### `map_karo` — transform

```
let_him_cook nums = [1, 2, 3, 4, 5]
let_him_cook squares = nums.map_karo(pov(n) { wapas_karo n * n })
boliye(squares.milao(", "))
// 1, 4, 9, 16, 25
```

```
// With index
let_him_cook labeled = nums.map_karo(pov(n, i) {
  wapas_karo `[${i}] = ${n}`
})
labeled.forEach_karo(pov(s) { boliye(s) })
```

- Returns a **new** BakchodList
- Original array is NOT modified

---

### `filter_karo` — filter

```
let_him_cook nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

let_him_cook evens = nums.filter_karo(pov(n) { wapas_karo n % 2 == 0 })
boliye(evens.milao(", "))
// 2, 4, 6, 8, 10

let_him_cook big = nums.filter_karo(pov(n) { wapas_karo n > 7 })
boliye(big.milao(", "))
// 8, 9, 10
```

- Returns a **new** BakchodList with only matching elements
- Element is kept when callback returns truthy

---

### `reduce_karo` — accumulate

```
let_him_cook nums = [1, 2, 3, 4, 5]

// Sum
let_him_cook total = nums.reduce_karo(pov(acc, n) { wapas_karo acc + n }, 0)
boliye(total)   // 15

// Product
let_him_cook product = nums.reduce_karo(pov(acc, n) { wapas_karo acc * n }, 1)
boliye(product)  // 120

// Max value (without stdlib)
let_him_cook biggest = nums.reduce_karo(pov(acc, n) { wapas_karo n > acc ? n : acc }, nums[0])
boliye(biggest)  // 5
```

- Second argument is the **initial accumulator value**
- Callback receives `(accumulator, element, index, array)`

---

### `koi_bhi` — some (any match?)

```
let_him_cook nums = [1, 2, 3, 4, 5]

boliye(nums.koi_bhi(pov(n) { wapas_karo n > 4 }))   // true
boliye(nums.koi_bhi(pov(n) { wapas_karo n > 10 }))  // false
```

- Returns `no_cap` if **at least one** element matches
- Short-circuits on first match (fast)

---

### `sab_sahi` — every (all match?)

```
let_him_cook nums = [2, 4, 6, 8]

boliye(nums.sab_sahi(pov(n) { wapas_karo n % 2 == 0 }))  // true
boliye(nums.sab_sahi(pov(n) { wapas_karo n > 5 }))       // false
```

- Returns `no_cap` only if **all** elements match
- Short-circuits on first failure

---

### `dhundo_karo` — find

```
let_him_cook users = [
  { name: "Rahul", score: 45 },
  { name: "Priya", score: 92 },
  { name: "Raju",  score: 38 }
]

let_him_cook topper = users.dhundo_karo(pov(u) { wapas_karo u.score >= 90 })
boliye(topper.name)   // Priya

let_him_cook ghost = users.dhundo_karo(pov(u) { wapas_karo u.score > 100 })
boliye(ghost)         // null
```

- Returns the **first matching element**
- Returns `null` if nothing matches

---

## Method Chaining

HOF methods can be chained since `map_karo` and `filter_karo` return new BakchodLists:

```
let_him_cook nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Sum of squares of even numbers
let_him_cook result = nums
  .filter_karo(pov(n) { wapas_karo n % 2 == 0 })
  .map_karo(pov(n) { wapas_karo n * n })
  .reduce_karo(pov(acc, n) { wapas_karo acc + n }, 0)

boliye(result)   // 220  (4 + 16 + 36 + 64 + 100)
```

```
// Uppercase only long words
let_him_cook words = ["bhai", "haramkhor", "yaar", "no_cap"]
let_him_cook result = words
  .filter_karo(pov(w) { wapas_karo lambai(w) > 4 })
  .map_karo(pov(w) { wapas_karo upperCase(w) })

result.forEach_karo(pov(w) { boliye(w) })
// HARAMKHOR
// NO_CAP
```

---

## HOF with Classes

```
squad Student {
  pov init(name, score) {
    this.name = name
    this.score = score
  }
  pov passed() { wapas_karo this.score >= 50 }
}

let_him_cook students = [
  new Student("Rahul", 78),
  new Student("Raju", 35),
  new Student("Priya", 95)
]

let_him_cook passed = students.filter_karo(pov(s) { wapas_karo s.passed() })
boliye(`${passed.lambai} students passed`)

let_him_cook names = passed.map_karo(pov(s) { wapas_karo s.name })
boliye(names.milao(", "))
```

---

## Import System — `lele`

Import another `.hs` file. All its top-level declarations (variables, functions, classes) become available in the current scope.

### Syntax

```
lele "filename.hs"
lele "./utils/math.hs"
lele "../shared/helpers.hs"
```

- Path resolves **relative to the current file**
- Imported file executes fully — side effects included
- Supports nested imports (a file you import can itself `lele` other files)

### Example

**`math_utils.hs`**
```
pov add(a, b) { wapas_karo a + b }
pov multiply(a, b) { wapas_karo a * b }
pov factorial(n) {
  agar (n <= 1) { wapas_karo 1 }
  wapas_karo n * factorial(n - 1)
}
let_him_cook PI = 3.14159
```

**`main.hs`**
```
lele "math_utils.hs"

boliye(add(2, 3))         // 5
boliye(multiply(4, 5))    // 20
boliye(factorial(6))      // 720
boliye(PI)                // 3.14159
```

### Import a Class

**`models.hs`**
```
squad Vector {
  pov init(x, y) {
    this.x = x
    this.y = y
  }
  pov magnitude() {
    wapas_karo squareRoot(this.x * this.x + this.y * this.y)
  }
}
```

**`app.hs`**
```
lele "models.hs"

let_him_cook v = new Vector(3, 4)
boliye(v.magnitude())   // 5
```

### Combining: Import + HOF

```
lele "math_utils.hs"

let_him_cook nums = [1, 2, 3, 4, 5]
let_him_cook doubled = nums.map_karo(pov(n) { wapas_karo multiply(n, 2) })
boliye(doubled.milao(", "))   // 2, 4, 6, 8, 10

let_him_cook facts = nums.map_karo(pov(n) { wapas_karo factorial(n) })
boliye(facts.milao(", "))     // 1, 2, 6, 24, 120
```

---

## Phase 4 Error Messages

| Error | Trigger | Message |
|---|---|---|
| `RuntimeError 🔥` | `arr.forEach_karo(99)` | `forEach_karo/map_karo expects a pov function bc 🤡 — tu function ki jagah kuch aur de raha hai. Skill issue haramkhor` |
| `RuntimeError 🔥` | `lele "missing.hs"` | `lele fail ho gaya bc 📁 — 'missing.hs' nahi mila saala. File exist karta hai? Path check kar haramkhor. Even Google Maps isse nahi dhundh sakta` |

---

## Complete Phase 4 Test Files

| File | What it tests |
|---|---|
| `hof_test.hs` | All 7 HOF methods + chaining |
| `import_test.hs` | lele import system with functions and classes |
| `math_helper.hs` | Utility file used by import tests |
| `master_test.hs` | Everything across all 4 phases combined |

---

## Updated BakchodList Method Reference

| Method | Description | Returns |
|---|---|---|
| `arr.daalo(val)` | Push to end | `null` |
| `arr.nikalo()` | Pop from end | removed element |
| `arr.jodo(arr2)` | Concat two arrays | new BakchodList |
| `arr.palat()` | Reverse in-place | `null` |
| `arr.sort_karo()` | Sort numerically in-place | `null` |
| `arr.milao(sep)` | Join to string | string |
| `arr.slice_karo(s, e)` | Slice | new BakchodList |
| `arr.dhundo(val)` | indexOf (exact match) | number (-1 if missing) |
| **`arr.forEach_karo(fn)`** | Iterate with callback | `null` |
| **`arr.map_karo(fn)`** | Transform elements | new BakchodList |
| **`arr.filter_karo(fn)`** | Filter elements | new BakchodList |
| **`arr.reduce_karo(fn, init)`** | Fold to single value | any |
| **`arr.koi_bhi(fn)`** | Any element matches? | boolean |
| **`arr.sab_sahi(fn)`** | All elements match? | boolean |
| **`arr.dhundo_karo(fn)`** | Find first match | element or `null` |
| `arr.lambai` | Length | number |
| `arr.pehla` | First element | element or `null` |
| `arr.aakhri` | Last element | element or `null` |

---

## Known Limitations (Phase 4)

- `lele` resolves relative to the **running file's directory** — REPL resolves from `process.cwd()`
- No circular import detection (importing a file that imports itself will stack overflow)
- No named exports — everything declared at top level in the imported file is global
- HOF callbacks receive `(element, index, array)` — index and array are optional
