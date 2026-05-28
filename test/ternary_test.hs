// ternary_test.hs — Phase 3: condition ? a : b

let_him_cook x = 10

// Basic
boliye(x > 5 ? "big" : "small")
boliye(x == 10 ? "ten" : "not ten")

// Store ternary result
let_him_cook label = x >= 10 ? "at least 10" : "less than 10"
boliye(label)

// Nested ternary
let_him_cook score = 85
let_him_cook grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "F"
boliye(grade)

// Ternary in function call
boliye(upperCase(x > 0 ? "positive" : "negative"))

// Ternary inside template literal
boliye(`${x} is ${x % 2 == 0 ? "even" : "odd"}`)

// Ternary with no_cap / fraud
let_him_cook logged_in = no_cap
boliye(logged_in ? "Welcome back!" : "Please login bc")

// Ternary with null check
let_him_cook maybe = null
boliye(maybe == null ? "it is null" : maybe)

// Ternary in return value
pov abs_val(n) {
  wapas_karo n >= 0 ? n : n * -1
}
boliye(abs_val(5))
boliye(abs_val(-7))

boliye("All ternary tests done!")
