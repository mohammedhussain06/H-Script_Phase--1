// math_helper.hs — Phase 4 import test utility
// This file is lele'd by import_test.hs

pov add(a, b) {
  wapas_karo a + b
}

pov multiply(a, b) {
  wapas_karo a * b
}

pov factorial(n) {
  agar (n <= 1) { wapas_karo 1 }
  wapas_karo n * factorial(n - 1)
}

let_him_cook PI = 3.14159

pov circle_area(r) {
  wapas_karo PI * r * r
}

squad Vector {
  pov init(x, y) {
    this.x = x
    this.y = y
  }
  pov magnitude() {
    wapas_karo squareRoot(this.x * this.x + this.y * this.y)
  }
  pov describe() {
    wapas_karo `Vector(${this.x}, ${this.y}) — magnitude: ${this.magnitude()}`
  }
}
