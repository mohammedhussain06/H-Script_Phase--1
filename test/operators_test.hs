// ============================================
// TEST: +=, -=, *=, /=
// ============================================
boliye("--- Compound Assignment ---")

let_him_cook x = 10
x += 5
boliye(x)   // 15

x -= 3
boliye(x)   // 12

x *= 2
boliye(x)   // 24

x /= 4
boliye(x)   // 6

// ============================================
// TEST: ++ and -- (postfix)
// ============================================
boliye("--- Postfix ++ and -- ---")

let_him_cook i = 0
i++
boliye(i)   // 1
i++
boliye(i)   // 2
i--
boliye(i)   // 1

// ============================================
// TEST: ++ in for loop (the main use case)
// ============================================
boliye("--- For loop with i++ ---")

baar_baar (let_him_cook j = 0; j < 5; j++) {
  boliye(j)
}
// Expected: 0 1 2 3 4

// ============================================
// TEST: continue inside for loop (bug fix)
// ============================================
boliye("--- For loop with skip_karo ---")

baar_baar (let_him_cook k = 0; k < 6; k++) {
  agar (k == 3) {
    skip_karo   // skip 3
  }
  boliye(k)
}
// Expected: 0 1 2 4 5  (3 is skipped)
