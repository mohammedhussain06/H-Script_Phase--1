// elseif_test.hs — Phase 3: baaki_sab agar (else-if chaining)

// Basic else-if
pov grade(score) {
  agar (score >= 90) {
    wapas_karo "A"
  } baaki_sab agar (score >= 80) {
    wapas_karo "B"
  } baaki_sab agar (score >= 70) {
    wapas_karo "C"
  } baaki_sab agar (score >= 60) {
    wapas_karo "D"
  } warna {
    wapas_karo "F"
  }
}

boliye(grade(95))
boliye(grade(85))
boliye(grade(75))
boliye(grade(65))
boliye(grade(40))

// Else-if without final warna
pov check_sign(n) {
  agar (n > 0) {
    wapas_karo "positive"
  } baaki_sab agar (n < 0) {
    wapas_karo "negative"
  } baaki_sab agar (n == 0) {
    wapas_karo "zero"
  }
}
boliye(check_sign(5))
boliye(check_sign(-3))
boliye(check_sign(0))

// Long chain
pov day_type(day) {
  agar (day == "Monday") {
    wapas_karo "Start of the grind 😤"
  } baaki_sab agar (day == "Friday") {
    wapas_karo "TGIF bhai 🎉"
  } baaki_sab agar (day == "Saturday") {
    wapas_karo "Weekend! 🥳"
  } baaki_sab agar (day == "Sunday") {
    wapas_karo "Sunday blues 😔"
  } warna {
    wapas_karo "Just another day bc"
  }
}

boliye(day_type("Monday"))
boliye(day_type("Friday"))
boliye(day_type("Saturday"))
boliye(day_type("Wednesday"))

boliye("All else-if tests done!")
