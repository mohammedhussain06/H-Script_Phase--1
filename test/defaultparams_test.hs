// defaultparams_test.hs — Phase 3: default function parameters

// Basic default
pov greet(name = "yaar") {
  boliye(`Hello ${name}!`)
}
greet("Rocky")
greet()

// Multiple defaults
pov connect(host = "localhost", port = 8080) {
  boliye(`Connecting to ${host}:${port}`)
}
connect("google.com", 443)
connect("google.com")
connect()

// Default with expression
pov power(base, exp = 2) {
  wapas_karo powerOf(base, exp)
}
boliye(power(5))
boliye(power(2, 10))
boliye(power(3))

// Default overridden by null vs not-passed
pov test_default(x = 42) {
  boliye(x)
}
test_default(99)
test_default()

// Default in class method
squad Counter {
  pov init(start = 0, step = 1) {
    this.count = start
    this.step = step
  }
  pov tick() {
    this.count += this.step
    wapas_karo this.count
  }
}

let_him_cook c1 = new Counter()
boliye(c1.tick())
boliye(c1.tick())

let_him_cook c2 = new Counter(10, 5)
boliye(c2.tick())
boliye(c2.tick())

boliye("All default params tests done!")
