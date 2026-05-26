// ===================================================
// arrays_test.hs — Tests BakchodList (array) support
// ===================================================

boliye("--- BakchodList Basics ---")

let_him_cook arr = [10, 20, 30]
boliye(arr.lambai)           // 3
boliye(arr[0])               // 10
boliye(arr[2])               // 30
boliye(arr.pehla)            // 10
boliye(arr.aakhri)           // 30

boliye("--- daalo / nikalo ---")

arr.daalo(40)
boliye(arr.lambai)           // 4
boliye(arr.aakhri)           // 40

let_him_cook popped = arr.nikalo()
boliye(popped)               // 40
boliye(arr.lambai)           // 3

boliye("--- Index Assignment ---")

arr[0] = 99
boliye(arr[0])               // 99

boliye("--- palat (reverse) ---")

let_him_cook nums = [1, 2, 3, 4, 5]
nums.palat()
boliye(nums[0])              // 5
boliye(nums[4])              // 1

boliye("--- sort_karo ---")

let_him_cook unsorted = [3, 1, 4, 1, 5, 9, 2]
unsorted.sort_karo()
boliye(unsorted[0])          // 1
boliye(unsorted[6])          // 9

boliye("--- milao (join) ---")

let_him_cook words = ["no_cap", "this", "is", "H-Script"]
boliye(words.milao(" "))     // no_cap this is H-Script

boliye("--- dhundo (indexOf) ---")

let_him_cook list = [10, 20, 30, 40]
boliye(list.dhundo(20))      // 1
boliye(list.dhundo(99))      // -1

boliye("--- Nested Array Loop ---")

let_him_cook scores = [85, 92, 76, 100, 60]
let_him_cook total = 0
let_him_cook i = 0

jab_tak_doomscroll (i < scores.lambai) {
  total = total + scores[i]
  i = i + 1
}

boliye(total)                // 413
