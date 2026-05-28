// jugaadmap_test.hs — Phase 3: JugaadMap { key: value }

// Basic creation and access
let_him_cook person = { name: "Rocky", age: 21, city: "Mumbai" }
boliye(person.name)
boliye(person.age)
boliye(person.city)

// String key index access
boliye(person["name"])
boliye(person["age"])

// Adding new properties
person.level = 9001
boliye(person.level)
person["skill"] = "max"
boliye(person.skill)

// typeOf
boliye(typeOf(person))

// Nested JugaadMap
let_him_cook address = { street: "Linking Road", pincode: 400050 }
let_him_cook user = { name: "Bhai", address: address }
boliye(user.name)
boliye(user.address.street)
boliye(user.address.pincode)

// JugaadMap in a function
pov describe(p) {
  wapas_karo `${p.name} is ${p.age} years old from ${p.city}`
}
boliye(describe(person))

// keys_nikalo and values_nikalo
let_him_cook profile = { x: 1, y: 2, z: 3 }
let_him_cook ks = keys_nikalo(profile)
boliye(ks.lambai)

let_him_cook vs = values_nikalo(profile)
boliye(vs.lambai)

// hasKey_kya
boliye(hasKey_kya(profile, "x"))
boliye(hasKey_kya(profile, "w"))

// Object spread: { ...a, ...b }
let_him_cook defaults = { theme: "dark", lang: "H-Script" }
let_him_cook overrides = { lang: "HScript-Pro", version: 3 }
let_him_cook config = { ...defaults, ...overrides }
boliye(config.theme)
boliye(config.lang)
boliye(config.version)

// JugaadMap in template literal
boliye(`Name: ${person.name}, Level: ${person.level}`)

boliye("All JugaadMap tests done!")
