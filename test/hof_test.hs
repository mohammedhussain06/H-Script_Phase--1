// hof_test.hs — Phase 4: Higher-Order Array Functions

let_him_cook nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// forEach_karo — iterate
boliye("--- forEach_karo ---")
nums.forEach_karo(pov(n) {
  agar (n <= 3) { boliye(n) }
})

// map_karo — transform
boliye("--- map_karo ---")
let_him_cook squares = nums.map_karo(pov(n) { wapas_karo n * n })
boliye(squares.milao(", "))

// filter_karo — filter
boliye("--- filter_karo ---")
let_him_cook evens = nums.filter_karo(pov(n) { wapas_karo n % 2 == 0 })
boliye(evens.milao(", "))

let_him_cook odds = nums.filter_karo(pov(n) { wapas_karo n % 2 != 0 })
boliye(odds.milao(", "))

// reduce_karo — accumulate
boliye("--- reduce_karo ---")
let_him_cook total = nums.reduce_karo(pov(acc, n) { wapas_karo acc + n }, 0)
boliye(total)

let_him_cook product = [1, 2, 3, 4, 5].reduce_karo(pov(acc, n) { wapas_karo acc * n }, 1)
boliye(product)

// koi_bhi — some
boliye("--- koi_bhi ---")
boliye(nums.koi_bhi(pov(n) { wapas_karo n > 9 }))
boliye(nums.koi_bhi(pov(n) { wapas_karo n > 100 }))

// sab_sahi — every
boliye("--- sab_sahi ---")
boliye(nums.sab_sahi(pov(n) { wapas_karo n > 0 }))
boliye(nums.sab_sahi(pov(n) { wapas_karo n > 5 }))

// dhundo_karo — find
boliye("--- dhundo_karo ---")
let_him_cook first_big = nums.dhundo_karo(pov(n) { wapas_karo n > 7 })
boliye(first_big)

let_him_cook not_found = nums.dhundo_karo(pov(n) { wapas_karo n > 100 })
boliye(not_found)

// Chaining: filter then map then reduce
boliye("--- chaining ---")
let_him_cook even_squares_sum = nums
  .filter_karo(pov(n) { wapas_karo n % 2 == 0 })
  .map_karo(pov(n) { wapas_karo n * n })
  .reduce_karo(pov(acc, n) { wapas_karo acc + n }, 0)
boliye(even_squares_sum)

// HOF with template literal
boliye("--- HOF + templates ---")
let_him_cook words = ["bhai", "yaar", "bsdk", "haramkhor"]
let_him_cook shouts = words.map_karo(pov(w) { wapas_karo upperCase(w) })
boliye(shouts.milao(" "))

let_him_cook long_words = words.filter_karo(pov(w) { wapas_karo lambai(w) > 4 })
boliye(long_words.milao(", "))

boliye("All HOF tests done!")
