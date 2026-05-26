let_him_cook battery = 15
let_him_cook is_bored = no_cap

boliye("--- Doomscrolling Started ---")

jab_tak_doomscroll (is_bored == no_cap) {
  boliye("Scrolling reels... Battery at:")
  boliye(battery)

  agar (battery <= 5) {
    boliye("Phone dying! Nikal lo!")
    nikal_lo
  } warna {
    agar (battery % 2 == 0) {
      boliye("Saw a cringe reel. Skip karo.")
      battery = battery - 3
      skip_karo
    }
  }
  
  boliye("Saw a funny meme.")
  battery = battery - 4
}

boliye("--- Screen Time Over ---")