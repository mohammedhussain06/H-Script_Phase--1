// ===================================================
// super_test.hs — Tests buzurg (super) keyword
// ===================================================

boliye("--- TEST 1: buzurg calls parent method ---")

squad Animal {
  pov init(name) {
    this.name = name
  }
  pov speak() {
    boliye("Generic sound from:")
    boliye(this.name)
  }
}

squad Dog nepo_baby_of Animal {
  pov speak() {
    buzurg.speak()
    boliye("Bho Bho!")
  }
}

let_him_cook d = new Dog("Rocky")
d.speak()
// Expected:
//   Generic sound from:
//   Rocky
//   Bho Bho!


boliye("--- TEST 2: buzurg calls parent init ---")

squad Vehicle {
  pov init(speed) {
    this.speed = speed
    this.fuel = 100
  }
  pov describe() {
    boliye(this.speed)
    boliye(this.fuel)
  }
}

squad Car nepo_baby_of Vehicle {
  pov init(speed, brand) {
    buzurg.init(speed)
    this.brand = brand
  }
  pov describe() {
    boliye(this.brand)
    buzurg.describe()
  }
}

let_him_cook c = new Car(120, "Honda")
c.describe()
// Expected:
//   Honda
//   120
//   100


boliye("--- TEST 3: buzurg with override chain ---")

squad Shape {
  pov area() {
    wapas_karo 0
  }
}

squad Rectangle nepo_baby_of Shape {
  pov init(w, h) {
    this.w = w
    this.h = h
  }
  pov area() {
    wapas_karo this.w * this.h
  }
}

let_him_cook rect = new Rectangle(5, 4)
boliye(rect.area())          // 20
