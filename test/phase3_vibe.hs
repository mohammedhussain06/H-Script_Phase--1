// phase3_vibe.hs — The ultimate Phase 3 flex: everything together

boliye("=== PHASE 3 VIBE CHECK ===")

// ── JugaadMap + Interpolation + Ternary ──────────────────────────────────
let_him_cook user = {
  name: "Bhai",
  level: 9001,
  hp: 100
}

boliye(`${user.name} has joined the server`)
boliye(`Level: ${user.level > 9000 ? "OVER 9000 🔥" : user.level}`)
boliye(`HP: ${user.hp}`)

// ── JugaadMap as config ───────────────────────────────────────────────────
let_him_cook config = { debug: fraud, version: 3, lang: "H-Script" }
boliye(`Running ${config.lang} v${config.version}`)
boliye(`Debug mode: ${config.debug ? "ON" : "OFF"}`)

// ── Else-if grade system ──────────────────────────────────────────────────
pov vibe_check(score) {
  agar (score == 100) {
    wapas_karo "Sigma 😤"
  } baaki_sab agar (score >= 80) {
    wapas_karo "GigaChad 💪"
  } baaki_sab agar (score >= 60) {
    wapas_karo "Mid (no cap) 😐"
  } baaki_sab agar (score >= 40) {
    wapas_karo "L + ratio 💀"
  } warna {
    wapas_karo "Skill issue fr fr 🪦"
  }
}

let_him_cook scores = [100, 85, 60, 40, 10]
baar_baar (let_him_cook i = 0; i < scores.lambai; i++) {
  boliye(`Score ${scores[i]}: ${vibe_check(scores[i])}`)
}

// ── Default params + Closures ─────────────────────────────────────────────
pov make_greeter(prefix = "Hello", suffix = "!") {
  wapas_karo pov(name) {
    wapas_karo `${prefix}, ${name}${suffix}`
  }
}

let_him_cook formal = make_greeter("Namaste", " ji")
let_him_cook casual = make_greeter()

boliye(formal("Rahul"))
boliye(casual("Rocky"))

// ── Try/Catch + Throw ─────────────────────────────────────────────────────
pov safe_divide(a, b) {
  agar_risk {
    agar (b == 0) {
      jhel_isko `Division by zero: ${a} / ${b} toh nahi hoga bc`
    }
    wapas_karo a / b
  } pakad_lo (err) {
    boliye(`⚠️  ${err}`)
    wapas_karo null
  }
}

boliye(safe_divide(10, 2))
boliye(safe_divide(10, 0))

// ── Spread + Stdlib ───────────────────────────────────────────────────────
let_him_cook batch1 = [3, 1, 4, 1, 5]
let_him_cook batch2 = [9, 2, 6, 5, 3]
let_him_cook all_scores = [...batch1, ...batch2]

boliye(`Total scores: ${all_scores.lambai}`)
boliye(`Max: ${max(...all_scores)}`)
boliye(`Min: ${min(...all_scores)}`)

// ── OOP + JugaadMap + Template ────────────────────────────────────────────
squad Player {
  pov init(name = "Unknown", hp = 100) {
    this.name = name
    this.hp = hp
    this.inventory = []
  }
  pov pick_up(item) {
    this.inventory.daalo(item)
    boliye(`${this.name} picked up ${item}`)
  }
  pov status() {
    boliye(`[${this.name}] HP:${this.hp} | Items:${this.inventory.lambai}`)
  }
}

let_him_cook p = new Player("Gabbar", 200)
p.pick_up("Sword")
p.pick_up("Shield")
p.pick_up("Chai ☕")
p.status()

// ── jo_bhi_hai_bhaad_me_jaaye ─────────────────────────────────────────────
boliye("--- cleanup test ---")
agar_risk {
  jhel_isko "aaj kuch nahi chala"
} pakad_lo (e) {
  boliye(`Error: ${e}`)
} jo_bhi_hai_bhaad_me_jaaye {
  boliye("Cleanup done. Jo bhi ho, yeh toh chalega 😤")
}

boliye("=== VIBE CHECK COMPLETE ✅ ===")
