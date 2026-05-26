// ===================================================
// stdlib_test.hs — Tests standard library functions
// ===================================================

boliye("--- typeOf ---")
boliye(typeOf(42))           // number
boliye(typeOf("hello"))      // string
boliye(typeOf(no_cap))       // boolean
boliye(typeOf(null))         // null
boliye(typeOf([1, 2, 3]))    // BakchodList

boliye("--- toNumber / toString ---")
boliye(toNumber("99"))       // 99
boliye(toString(3.14))       // 3.14
boliye(toString(null))       // null

boliye("--- Math ---")
boliye(ceiling(3.1))         // 4
boliye(flooring(3.9))        // 3
boliye(powerOf(2, 10))       // 1024
boliye(squareRoot(144))      // 12
boliye(absValue(-99))        // 99
boliye(randomNum(1, 1))      // 1 (deterministic — min == max)

boliye("--- String ops ---")
boliye(upperCase("hello"))   // HELLO
boliye(lowerCase("WORLD"))   // world
boliye(lambai("testing"))    // 7
boliye(trim_karo("  hi  "))  // hi
boliye(repeat_karo("ha", 3)) // hahaha
boliye(includes_kya("H-Script is fun", "fun"))  // true
boliye(replace_karo("hello world", "world", "H-Script"))  // hello H-Script

boliye("--- lambai on BakchodList ---")
let_him_cook arr = [1, 2, 3, 4, 5]
boliye(lambai(arr))          // 5
