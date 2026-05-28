// spread_test.hs — Phase 3: spread operator ...

// Spread in array literals
let_him_cook a = [1, 2, 3]
let_him_cook b = [4, 5, 6]
let_him_cook merged = [...a, ...b]
boliye(merged.lambai)

// Spread with extra elements
let_him_cook extended = [0, ...a, 99]
boliye(extended.lambai)
boliye(extended[0])
boliye(extended.aakhri)

// Spread in function calls
pov add3(x, y, z) {
  wapas_karo x + y + z
}
let_him_cook nums = [10, 20, 30]
boliye(add3(...nums))

// Spread mixed with regular args
pov sum5(a, b, c, d, e) {
  wapas_karo a + b + c + d + e
}
let_him_cook part = [2, 3, 4]
boliye(sum5(1, ...part, 5))

// Spread to copy a list
let_him_cook original = [7, 8, 9]
let_him_cook copy = [...original]
copy.daalo(10)
boliye(original.lambai)
boliye(copy.lambai)

// Spread with stdlib that takes multiple args
boliye(max(...nums))
boliye(min(...nums))

boliye("All spread tests done!")
