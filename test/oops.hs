squad IndianParent {
  pov init(taana) {
    this.taana = taana
    this._secret_savings = 500000 // Private property!
  }

  pov scold() {
    boliye(this.taana)
  }
  
  pov get_savings() {
    // Allowed because we are inside the class
    wapas_karo this._secret_savings
  }
}

squad GenZKid nepo_baby_of IndianParent {
  pov init_kid(taana, slang) {
    this.taana = taana
    this.slang = slang
  }

  pov argue() {
    boliye(this.slang)
  }
}

boliye("--- Parent Object ---")
let_him_cook papa = new IndianParent("Sharma ji ke bete ko dekh!")
papa.scold()
boliye("Papa's secret savings:")
boliye(papa.get_savings())

boliye("--- Child Object (Inheritance) ---")
let_him_cook rahul = new GenZKid()
rahul.init_kid("Padhai kar lo", "Ok boomer, no cap")
rahul.scold() // Inherited from IndianParent!
rahul.argue() // Specific to GenZKid!