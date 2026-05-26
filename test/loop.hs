squad LoopTester {
  pov run_test() {
    boliye("Starting the loop...")
    
    // The semicolons inside the brackets here are required by your parseFor() logic
    baar_baar (let_him_cook i = 1; i <= 5; i = i + 1) {
      agar (i == 3) {
        boliye("Ignoring 3...")
        skip_karo
      }
      
      agar (i == 5) {
        boliye("5 is too much, I'm out!")
        nikal_lo
      }
      
      boliye(i)
    }
    
    wapas_karo no_cap
  }
}

let_him_cook tester = new LoopTester()
tester.run_test()