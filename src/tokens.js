module.exports = {
  // Keywords
  LET: "LET_HIM_COOK",
  PRINT: "BOLIYE",

  // Identifiers & literals
  IDENT: "IDENT",
  NUMBER: "NUMBER",
  STRING: "STRING",
  NULL: "NULL",

  // Arithmetic operators
  PLUS: "PLUS",       // +
  MINUS: "MINUS",     // -
  STAR: "STAR",       // *
  SLASH: "SLASH",     // /
  MOD: "MOD",         // %

  // Compound assignment
  PLUS_EQUAL: "PLUS_EQUAL",    // +=
  MINUS_EQUAL: "MINUS_EQUAL",  // -=
  STAR_EQUAL: "STAR_EQUAL",    // *=
  SLASH_EQUAL: "SLASH_EQUAL",  // /=

  // Increment / Decrement
  PLUS_PLUS: "PLUS_PLUS",      // ++
  MINUS_MINUS: "MINUS_MINUS",  // --

  // Assignment
  EQUAL: "EQUAL",              // =

  // Parentheses
  LPAREN: "LPAREN",
  RPAREN: "RPAREN",

  // Braces
  LBRACE: "LBRACE",
  RBRACE: "RBRACE",

  // Brackets — BakchodList (arrays)
  LBRACKET: "LBRACKET",        // [
  RBRACKET: "RBRACKET",        // ]

  // If-else
  IF: "AGAR",
  ELSE: "WARNA",
  ELSEIF: "BAAKI_SAB",         // baaki_sab agar → else-if  (Phase 3)

  // Comparison operators
  GREATER: "GREATER",
  LESS: "LESS",
  GTE: "GTE",
  LTE: "LTE",
  EQEQ: "EQEQ",
  NOTEQ: "NOTEQ",

  // Boolean literals
  TRUE: "NO_CAP",
  FALSE: "FRAUD",

  // Logical operators
  AND: "AND",
  OR: "OR",
  NOT: "NOT",

  // Bitwise operators
  BAND: "BAND",
  BOR: "BOR",
  BXOR: "BXOR",
  BNOT: "BNOT",
  SHL: "SHL",
  SHR: "SHR",
  USHR: "USHR",

  // Loops
  WHILE: "JAB_TAK_DOOMSCROLL",
  FOR: "BAAR_BAAR",
  SEMICOLON: "SEMICOLON",

  // Loop controls
  BREAK: "NIKAL_LO",
  CONTINUE: "SKIP_KARO",

  // Functions
  FUNCTION: "POV",
  RETURN: "WAPAS_KARO",
  COMMA: "COMMA",

  // OOP
  CLASS: "SQUAD",
  NEW: "NEW",
  DOT: "DOT",
  THIS: "THIS",
  EXTENDS: "NEPO_BABY_OF",
  SUPER: "SUPER",        // buzurg

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  TRY:     "AGAR_RISK",                  // agar_risk { }
  CATCH:   "PAKAD_LO",                   // pakad_lo (e) { }
  FINALLY: "JO_BHI_HAI_BHAAD_ME_JAAYE", // jo_bhi_hai_bhaad_me_jaaye { }
  THROW:   "JHEL_ISKO",                  // jhel_isko "message"

  QUESTION: "QUESTION",  // ?  (ternary)
  COLON:    "COLON",     // :  (ternary + object literal)
  SPREAD:   "SPREAD",    // ...

  TEMPLATE_LITERAL: "TEMPLATE_LITERAL",  // `Hello ${name}!`

  // Phase 4
  IMPORT: "IMPORT",  // lele "file.hs"

  // Special
  EOF: "EOF",
};
