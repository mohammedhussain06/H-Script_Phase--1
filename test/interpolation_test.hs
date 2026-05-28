// interpolation_test.hs — Phase 3: Template literals with ${...}

let_him_cook name = "Rocky"
let_him_cook level = 9001
let_him_cook lang = "H-Script"

// Basic interpolation
boliye(`Hello ${name}!`)
boliye(`${lang} is built different`)

// Expression inside ${}
boliye(`Level: ${level}`)
boliye(`Double: ${level * 2}`)
boliye(`Is over 9000: ${level > 9000}`)

// Function call inside ${}
boliye(`Name upper: ${upperCase(name)}`)
boliye(`Name length: ${lambai(name)}`)

// Nested expression
let_him_cook a = 10
let_him_cook b = 20
boliye(`Sum of ${a} and ${b} is ${a + b}`)
boliye(`Average: ${(a + b) / 2}`)

// typeOf inside template
boliye(`Type of name: ${typeOf(name)}`)
boliye(`Type of level: ${typeOf(level)}`)

// Null in template
let_him_cook nothing = null
boliye(`Nothing is: ${nothing}`)

// BakchodList in template
let_him_cook arr = [1, 2, 3]
boliye(`Array: ${arr}`)
boliye(`First: ${arr[0]}, Last: ${arr.aakhri}`)

// Template in a function
pov greet_user(user, score) {
  wapas_karo `${user} scored ${score} — ${score >= 50 ? "pass ho gaya bhai!" : "fail bsdk"}`
}

boliye(greet_user("Rahul", 75))
boliye(greet_user("Raju", 30))

boliye("All interpolation tests done!")
