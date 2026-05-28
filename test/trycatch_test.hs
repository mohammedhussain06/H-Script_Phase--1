// trycatch_test.hs — Phase 3: agar_risk / pakad_lo / jo_bhi_hai_bhaad_me_jaaye / jhel_isko

// 1. Basic throw + catch
agar_risk {
  jhel_isko "Yeh galat tha bc!"
} pakad_lo (e) {
  boliye("Pakda! Error: ")
  boliye(e)
}

// 2. Catch a runtime error (division by zero)
agar_risk {
  let_him_cook x = 10 / 0
  boliye(x)
} pakad_lo (e) {
  boliye("Division by zero caught!")
}

// 3. finally — jo_bhi_hai_bhaad_me_jaaye always runs
agar_risk {
  boliye("Trying...")
  jhel_isko "oops"
} pakad_lo (e) {
  boliye("Caught in pakad_lo")
} jo_bhi_hai_bhaad_me_jaaye {
  boliye("jo_bhi_hai_bhaad_me_jaaye runs anyway 🫡")
}

// 4. No error — finally still runs
agar_risk {
  boliye("No error here")
} pakad_lo (e) {
  boliye("This should NOT print")
} jo_bhi_hai_bhaad_me_jaaye {
  boliye("Finally ran after clean try ✅")
}

// 5. Only finally (no catch)
agar_risk {
  boliye("Only finally test")
} jo_bhi_hai_bhaad_me_jaaye {
  boliye("Cleanup done!")
}

// 6. Throw a number
agar_risk {
  jhel_isko 404
} pakad_lo (code) {
  boliye("Error code: ")
  boliye(code)
}

// 7. Throw inside a function
pov risky_add(a, b) {
  agar (b == 0) {
    jhel_isko "b zero nahi ho sakta bc!"
  }
  wapas_karo a + b
}

agar_risk {
  let_him_cook result = risky_add(10, 0)
} pakad_lo (err) {
  boliye("risky_add failed: ")
  boliye(err)
}

boliye("All try/catch tests done!")
