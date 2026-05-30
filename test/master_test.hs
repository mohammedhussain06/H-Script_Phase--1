// ═══════════════════════════════════════════════════════════════
//   H-Script — Complete Language Test (All 4 Phases)
//   One cohesive program: Student Grade Management System
//   Run: node test/testrunner.js master_test.hs
// ═══════════════════════════════════════════════════════════════

boliye("╔══════════════════════════════════════════╗")
boliye("║   H-Script Master Test — All 4 Phases   ║")
boliye("╚══════════════════════════════════════════╝")

// ── PHASE 1: Variables, Booleans, Arithmetic ─────────────────────────────────
let_him_cook PASSING_SCORE = 50
let_him_cook MAX_SCORE = 100
let_him_cook is_strict_mode = no_cap
boliye(`Passing score: ${PASSING_SCORE} / ${MAX_SCORE}`)

// ── PHASE 1: Function + Return ───────────────────────────────────────────────
pov percentage(score, total) {
  wapas_karo (score / total) * 100
}

// ── PHASE 3: Default Params ──────────────────────────────────────────────────
pov make_id(prefix = "STU", num = 1) {
  wapas_karo `${prefix}-${num}`
}
boliye(make_id("ENG", 42))
boliye(make_id())

// ── PHASE 1: Class + this + Private Props ────────────────────────────────────
squad Student {
  pov init(name, roll) {
    this.name = name
    this.roll = roll
    this._scores = []        // private
    this.passed = fraud
  }

  pov add_score(subject, marks) {
    this._scores.daalo({ subject: subject, marks: marks })
  }

  pov average() {
    agar (this._scores.lambai == 0) { wapas_karo 0 }
    let_him_cook total = this._scores.reduce_karo(
      pov(acc, s) { wapas_karo acc + s.marks }, 0
    )
    wapas_karo total / this._scores.lambai
  }

  pov evaluate() {
    let_him_cook avg = this.average()
    this.passed = avg >= PASSING_SCORE
    wapas_karo avg
  }

  pov report() {
    let_him_cook avg = this.evaluate()
    let_him_cook grade = avg >= 90 ? "A" : avg >= 80 ? "B" : avg >= 70 ? "C" : avg >= 50 ? "D" : "F"
    boliye(`[${this.roll}] ${this.name} | Avg: ${avg} | Grade: ${grade} | ${this.passed ? "PASS ✅" : "FAIL ❌"}`)
  }
}

// ── PHASE 1: Inheritance + buzurg (super) ────────────────────────────────────
squad ScholarStudent nepo_baby_of Student {
  pov init(name, roll, scholarship) {
    buzurg.init(name, roll)
    this.scholarship = scholarship
  }
  pov report() {
    buzurg.report()
    boliye(`   Scholarship: ${this.scholarship}`)
  }
}

// ── Build some students ───────────────────────────────────────────────────────
let_him_cook s1 = new Student("Rahul", make_id("STU", 1))
s1.add_score("Math", 88)
s1.add_score("Science", 76)
s1.add_score("English", 92)

let_him_cook s2 = new Student("Raju", make_id("STU", 2))
s2.add_score("Math", 40)
s2.add_score("Science", 38)
s2.add_score("English", 45)

let_him_cook s3 = new ScholarStudent("Priya", make_id("STU", 3), "Merit-Gold")
s3.add_score("Math", 97)
s3.add_score("Science", 94)
s3.add_score("English", 98)

boliye("\n── Results ─────────────────────────────────────")
s1.report()
s2.report()
s3.report()

// ── PHASE 2: BakchodList + methods ───────────────────────────────────────────
let_him_cook all_students = [s1, s2, s3]

boliye("\n── Phase 2: Array ops ──────────────────────────")

// PHASE 4: forEach_karo
all_students.forEach_karo(pov(s) {
  boliye(`Checking ${s.name}...`)
})

// PHASE 4: filter_karo
let_him_cook passed_students = all_students.filter_karo(pov(s) {
  wapas_karo s.evaluate() >= PASSING_SCORE
})
boliye(`Passed: ${passed_students.lambai} / ${all_students.lambai}`)

// PHASE 4: map_karo
let_him_cook averages = all_students.map_karo(pov(s) { wapas_karo s.average() })
boliye(`Averages: ${averages.milao(", ")}`)

// PHASE 4: reduce_karo — class average
let_him_cook class_total = averages.reduce_karo(pov(acc, n) { wapas_karo acc + n }, 0)
let_him_cook class_avg = class_total / averages.lambai
boliye(`Class average: ${class_avg}`)

// PHASE 4: koi_bhi / sab_sahi
boliye(`Any scholar? ${all_students.koi_bhi(pov(s) { wapas_karo s.scholarship != null })}`)
boliye(`All passed? ${all_students.sab_sahi(pov(s) { wapas_karo s.passed })}`)

// PHASE 4: dhundo_karo
let_him_cook top = all_students.dhundo_karo(pov(s) { wapas_karo s.average() >= 90 })
boliye(`Top student: ${top != null ? top.name : "none"}`)

// ── PHASE 3: Spread ───────────────────────────────────────────────────────────
boliye("\n── Phase 3: Spread ─────────────────────────────")
let_him_cook batch_a = [78, 82, 91]
let_him_cook batch_b = [55, 63, 88]
let_him_cook all_marks = [...batch_a, ...batch_b]
boliye(`Combined: ${all_marks.milao(", ")}`)
boliye(`Max: ${max(...all_marks)} | Min: ${min(...all_marks)}`)

// ── PHASE 3: JugaadMap ───────────────────────────────────────────────────────
boliye("\n── Phase 3: JugaadMap ──────────────────────────")
let_him_cook config = { min_pass: 50, grade_a: 90, grade_b: 80 }
let_him_cook updated = { ...config, min_pass: 45, strict: no_cap }

boliye(`Min pass (old): ${config.min_pass}`)
boliye(`Min pass (new): ${updated.min_pass}`)
boliye(`Keys: ${keys_nikalo(updated).milao(", ")}`)
boliye(`Has strict? ${hasKey_kya(updated, "strict")}`)
boliye(`Has cheat? ${hasKey_kya(updated, "cheat")}`)

// ── PHASE 3: Try / Catch / Finally / Throw ───────────────────────────────────
boliye("\n── Phase 3: Try/Catch ──────────────────────────")

pov safe_score(score) {
  agar_risk {
    agar (typeOf(score) != "number") {
      jhel_isko `Invalid score: expected number, got ${typeOf(score)}`
    }
    agar (score < 0 || score > 100) {
      jhel_isko `Score ${score} out of bounds (0-100)`
    }
    wapas_karo score
  } pakad_lo (err) {
    boliye(`Error caught: ${err}`)
    wapas_karo null
  } jo_bhi_hai_bhaad_me_jaaye {
    boliye("Validation done")
  }
}

boliye(safe_score(85))
boliye(safe_score(-5))
boliye(safe_score("lol"))

// ── PHASE 2: Closures ────────────────────────────────────────────────────────
boliye("\n── Phase 2: Closures ───────────────────────────")

pov make_bonus_calculator(base_bonus) {
  wapas_karo pov(score) {
    let_him_cook extra = score >= 90 ? base_bonus * 2 : base_bonus
    wapas_karo `Score ${score} → Bonus: ${extra}`
  }
}

let_him_cook merit_calc = make_bonus_calculator(500)
let_him_cook normal_calc = make_bonus_calculator(200)

boliye(merit_calc(95))
boliye(merit_calc(75))
boliye(normal_calc(55))

// ── PHASE 1: Loops with break/continue ───────────────────────────────────────
boliye("\n── Phase 1: Loops ──────────────────────────────")

let_him_cook found_perfect = fraud
baar_baar (let_him_cook i = 0; i < averages.lambai; i++) {
  agar (averages[i] == 100) {
    found_perfect = no_cap
    nikal_lo
  }
  agar (averages[i] < 50) {
    skip_karo
  }
  boliye(`Score at index ${i}: ${averages[i]}`)
}
boliye(`Perfect score found: ${found_perfect}`)

// PHASE 1: While + counter
let_him_cook count = 0
let_him_cook idx = 0
jab_tak_doomscroll (idx < all_marks.lambai) {
  agar (all_marks[idx] >= 80) { count += 1 }
  idx++
}
boliye(`Scores >= 80: ${count}`)

// ── PHASE 2: Stdlib ──────────────────────────────────────────────────────────
boliye("\n── Phase 2: Stdlib ─────────────────────────────")

let_him_cook raw = "  Rahul Sharma  "
boliye(trim_karo(raw))
boliye(upperCase(trim_karo(raw)))
boliye(includes_kya(raw, "Sharma"))

let_him_cook parts = split_karo(trim_karo(raw), " ")
boliye(parts.milao("-"))
boliye(lambai(trim_karo(raw)))

boliye(powerOf(2, 10))
boliye(squareRoot(144))
boliye(absValue(-42))
boliye(parseInt_karo("255", 16))
boliye(isNaN_kya("bsdk"))
boliye(isNaN_kya(99))

// ── PHASE 3: Else-if chain ───────────────────────────────────────────────────
boliye("\n── Phase 3: Else-if chain ──────────────────────")

pov classify(avg) {
  agar (avg >= 90) {
    wapas_karo "Distinction 🏅"
  } baaki_sab agar (avg >= 75) {
    wapas_karo "First Class 🥇"
  } baaki_sab agar (avg >= 60) {
    wapas_karo "Second Class 🥈"
  } baaki_sab agar (avg >= 50) {
    wapas_karo "Pass 📝"
  } warna {
    wapas_karo "Fail 💀"
  }
}

all_students.forEach_karo(pov(s) {
  boliye(`${s.name}: ${classify(s.average())}`)
})

// ── PHASE 2: Bitwise ops ─────────────────────────────────────────────────────
boliye("\n── Phase 2: Bitwise ────────────────────────────")
let_him_cook flags = 0
flags = flags | 1
flags = flags | 4
boliye(`Flags: ${flags}`)
boliye(`Has flag 1? ${(flags & 1) != 0}`)
boliye(`Has flag 2? ${(flags & 2) != 0}`)
boliye(`Shift left: ${1 << 4}`)

// ── FINAL RESULT ─────────────────────────────────────────────────────────────
boliye("\n╔══════════════════════════════════════════╗")
boliye("║        ALL TESTS PASSED — NO CAP 🔥      ║")
boliye("╚══════════════════════════════════════════╝")
