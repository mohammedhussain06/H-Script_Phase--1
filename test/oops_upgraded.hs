// ============================================
// TEST 1: Auto-init via new (constructor fix)
// ============================================
boliye("--- TEST 1: Auto-init ---")

squad Phone {
  pov init(brand, battery) {
    this.brand = brand
    this.battery = battery
  }

  pov info() {
    boliye(this.brand)
    boliye(this.battery)
  }
}

let_him_cook p = new Phone("Samsung", 100)
p.info()
// Expected: Samsung, 100


// ============================================
// TEST 2: Polymorphism — child overrides parent
// ============================================
boliye("--- TEST 2: Polymorphism ---")

squad Animal {
  pov speak() {
    boliye("Generic animal sound")
  }
}

squad Dog nepo_baby_of Animal {
  pov speak() {
    boliye("Bho Bho!")
  }
}

squad Cat nepo_baby_of Animal {
  pov speak() {
    boliye("Meow!")
  }
}

let_him_cook a = new Animal()
let_him_cook d = new Dog()
let_him_cook c = new Cat()

a.speak()
// Expected: Generic animal sound

d.speak()
// Expected: Bho Bho!   (child override wins, NOT parent)

c.speak()
// Expected: Meow!      (child override wins, NOT parent)


// ============================================
// TEST 3: Private property — read/write inside class OK,
//         access outside class should error
// ============================================
boliye("--- TEST 3: Private Properties ---")

squad Locker {
  pov init(secret) {
    this._pin = secret        // write private inside class — OK
  }

  pov reveal() {
    wapas_karo this._pin     // read private inside class — OK
  }
}

let_him_cook box = new Locker(9999)
boliye(box.reveal())
// Expected: 9999

// Uncommenting below should throw an error (private access outside class):
// boliye(box._pin)


// ============================================
// TEST 4: Inherited method + overridden init
// ============================================
boliye("--- TEST 4: Inheritance + init chain ---")

squad Vehicle {
  pov init(speed) {
    this.speed = speed
  }

  pov describe() {
    boliye("Speed:")
    boliye(this.speed)
  }
}

squad Bike nepo_baby_of Vehicle {
  pov wheelie() {
    boliye("Doing a wheelie!")
  }
}

let_him_cook b = new Bike(120)  // uses inherited init from Vehicle
b.describe()                     // uses inherited describe
b.wheelie()                      // own method
// Expected: Speed: 120, Doing a wheelie!
