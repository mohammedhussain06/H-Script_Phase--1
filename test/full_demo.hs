// ═══════════════════════════════════════════════════════
//   H-Script — Complete Feature Demo (All 3 Phases)
//   Run: node src/repl.js < test/full_demo.hs
// ═══════════════════════════════════════════════════════

// ── PHASE 1: Variables, Print, Booleans ─────────────────
let_him_cook name = "H-Script"
let_him_cook version = 3
let_him_cook is_goated = no_cap
boliye("=== PHASE 1 ===")
boliye(name)
boliye(version)
boliye(is_goated)

// ── PHASE 1: If / Else ──────────────────────────────────
agar (version >= 3) {
  boliye("v3 is here fr fr")
} warna {
  boliye("touch grass and update")
}

// ── PHASE 1: While Loop ─────────────────────────────────
let_him_cook i = 1
jab_tak_doomscroll (i <= 3) {
  boliye(i)
  i++
}

// ── PHASE 1: For Loop ───────────────────────────────────
baar_baar (let_him_cook x = 0; x < 3; x++) {
  boliye(x * x)
}

// ── PHASE 1: Function ───────────────────────────────────
pov add(a, b) {
  wapas_karo a + b
}
boliye(add(10, 32))

// ── PHASE 1: Class + Inheritance ────────────────────────
squad Animal {
  pov init(n) {
    this.name = n
  }
  pov speak() {
    boliye(this.name)
  }
}

squad Dog nepo_baby_of Animal {
  pov speak() {
    buzurg.speak()
    boliye("Bho Bho!")
  }
}

let_him_cook d = new Dog("Tommy")
d.speak()

// ── PHASE 2: Null + BakchodList ─────────────────────────
boliye("=== PHASE 2 ===")
let_him_cook nothing = null
boliye(nothing)

let_him_cook arr = [3, 1, 4, 1, 5]
arr.daalo(9)
arr.sort_karo()
boliye(arr.milao(", "))
boliye(arr.lambai)
boliye(arr.pehla)
boliye(arr.aakhri)

// ── PHASE 2: Closures ───────────────────────────────────
pov make_counter() {
  let_him_cook count = 0
  wapas_karo pov() {
    count += 1
    wapas_karo count
  }
}
let_him_cook counter = make_counter()
boliye(counter())
boliye(counter())
boliye(counter())

// ── PHASE 2: Stdlib ─────────────────────────────────────
boliye(typeOf(arr))
boliye(powerOf(2, 8))
boliye(upperCase("bhai"))
boliye(squareRoot(144))
boliye(randomNum(1, 6))

// ── PHASE 3: else-if ────────────────────────────────────
boliye("=== PHASE 3 ===")
let_him_cook score = 85
agar (score >= 90) {
  boliye("Sigma 😤")
} baaki_sab agar (score >= 80) {
  boliye("GigaChad 💪")
} baaki_sab agar (score >= 70) {
  boliye("Mid ngl")
} warna {
  boliye("Skill issue 💀")
}

// ── PHASE 3: Ternary ────────────────────────────────────
let_him_cook n = 42
boliye(n % 2 == 0 ? "even" : "odd")
boliye(n > 100 ? "big" : "smol")

// ── PHASE 3: Template Literals ──────────────────────────
let_him_cook lang = "H-Script"
let_him_cook ver = 3
boliye(`${lang} v${ver} is absolutely ${ver >= 3 ? "cooked 🔥" : "mid"}`)
boliye(`2 + 2 = ${2 + 2}, not 5`)
boliye(`Array sum: ${arr[0] + arr[1]}`)

// ── PHASE 3: JugaadMap ──────────────────────────────────
let_him_cook user = { name: "Rocky", level: 9001, hp: 100 }
boliye(user.name)
boliye(user["level"])
user.city = "Mumbai"
boliye(`${user.name} from ${user.city}, level ${user.level}`)
boliye(typeOf(user))
boliye(hasKey_kya(user, "hp"))
boliye(hasKey_kya(user, "salary"))

// ── PHASE 3: Object Spread ──────────────────────────────
let_him_cook base = { theme: "dark", lang: "H-Script" }
let_him_cook extra = { lang: "H-Script Pro", version: 3 }
let_him_cook config = { ...base, ...extra }
boliye(config.theme)
boliye(config.lang)
boliye(config.version)

// ── PHASE 3: Spread Operator ────────────────────────────
let_him_cook a = [1, 2, 3]
let_him_cook b = [4, 5, 6]
let_him_cook all = [...a, ...b]
boliye(all.milao("-"))
boliye(max(...all))
boliye(min(...all))

// ── PHASE 3: Default Params ─────────────────────────────
pov greet(who = "yaar", emoji = "👋") {
  boliye(`Hello ${who} ${emoji}`)
}
greet("Rocky", "🔥")
greet("Rahul")
greet()

// ── PHASE 3: Try / Catch / Finally ──────────────────────
agar_risk {
  jhel_isko "Oops bc!"
} pakad_lo (err) {
  boliye(`Pakda: ${err}`)
} jo_bhi_hai_bhaad_me_jaaye {
  boliye("Cleanup done regardless 🫡")
}

// ── PHASE 3: Catch runtime error ────────────────────────
agar_risk {
  let_him_cook bad = 10 / 0
} pakad_lo (e) {
  boliye(`Division saved: ${e}`)
}

// ── FULL COMBO: OOP + JugaadMap + Template + Default ────
squad Player {
  pov init(name = "Unknown", hp = 100) {
    this.name = name
    this.hp = hp
    this.stats = { kills: 0, deaths: 0 }
  }
  pov kill() {
    this.stats.kills += 1
    boliye(`${this.name} got a kill! Total: ${this.stats.kills}`)
  }
  pov status() {
    boliye(`[${this.name}] HP:${this.hp} K:${this.stats.kills} D:${this.stats.deaths}`)
  }
}

let_him_cook p = new Player("Gabbar", 200)
p.kill()
p.kill()
p.kill()
p.status()

let_him_cook p2 = new Player()
p2.status()

boliye("=== ALL FEATURES PASSED ✅ ===")
