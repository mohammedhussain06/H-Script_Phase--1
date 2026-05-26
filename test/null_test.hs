// ===================================================
// null_test.hs — Tests null value support
// ===================================================

let_him_cook x = null
boliye(x)                    // null
boliye(typeOf(x))            // null

agar (x == null) {
  boliye("x is null: correct!")
} warna {
  boliye("FAIL")
}

// null in array
let_him_cook arr = [1, null, 3]
boliye(arr[1])               // null

// reassign from null
x = 42
boliye(x)                    // 42
boliye(x == null)            // false
