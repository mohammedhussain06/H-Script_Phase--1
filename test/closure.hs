// Testing Closures: A function returning another function
pov make_hustler(multiplier) {
  pov hustle(amount) {
    wapas_karo amount * multiplier
  }
  wapas_karo hustle
}

let_him_cook double_money = make_hustler(2)
let_him_cook triple_money = make_hustler(3)

boliye("--- Hustle Check ---")
boliye("Doubling 500:")
boliye(double_money(500))

boliye("Tripling 500:")
boliye(triple_money(500))

// Testing Math Precedence and Modulo
boliye("--- Math Check ---")
let_him_cook math_test = (10 + 5) * 2 / 3 % 4
boliye("Result of (10 + 5) * 2 / 3 % 4 (Should be 2):")
boliye(math_test)