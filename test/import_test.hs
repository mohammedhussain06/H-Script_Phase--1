// import_test.hs — Phase 4: lele (import system)

// Import the math helper — all its functions/classes/variables become available
lele "math_helper.hs"

// Use imported functions
boliye(add(2, 3))
boliye(multiply(4, 5))
boliye(factorial(6))
boliye(PI)
boliye(circle_area(5))

// Use imported class
let_him_cook v = new Vector(3, 4)
boliye(v.describe())

// Import works with stdlib too
let_him_cook nums = [10, 20, 30]
let_him_cook doubled = nums.map_karo(pov(n) { wapas_karo multiply(n, 2) })
boliye(doubled.milao(", "))

boliye("All import tests done!")
