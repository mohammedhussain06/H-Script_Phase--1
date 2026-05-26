/**
 * H-Script — Meme Error Showcase 🎬
 * Deliberately triggers every error type to flex the new messages.
 * Run: node test/error_test.js
 */

const lexer       = require("../src/lexer.js");
const parser      = require("../src/parser.js");
const interpreter = require("../src/interpreter.js");
const { HScriptError } = require("../src/errors.js");

const C = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  cyan:   "\x1b[36m",
  yellow: "\x1b[33m",
  dim:    "\x1b[2m",
  red:    "\x1b[31m",
};

function tryRun(label, code) {
  process.stdout.write(`\n${C.bold}${C.yellow}» ${label}${C.reset}\n`);
  process.stdout.write(`${C.dim}  Code: ${code.trim()}${C.reset}\n`);
  try {
    const tokens = lexer(code);
    const ast    = parser(tokens);
    interpreter(ast);
    process.stdout.write(`  ✅ No error (unexpected)\n`);
  } catch (err) {
    if (err instanceof HScriptError) {
      process.stdout.write(`  ${err.format()}\n`);
    } else {
      process.stdout.write(`  ${C.red}[JS Error]: ${err.message}${C.reset}\n`);
    }
  }
}

console.log(`\n${C.bold}${C.cyan}╔══════════════════════════════════════════════════════╗`);
console.log(`║       H-Script Meme Error Showcase 🎬🔥              ║`);
console.log(`╚══════════════════════════════════════════════════════╝${C.reset}`);

// ── LEXER ERRORS ─────────────────────────────────────────────────────────────
console.log(`\n${C.bold}${C.cyan}━━━  LEXER ERRORS 💀  ━━━${C.reset}`);

tryRun(
  "Unterminated multi-line comment (Thanos snap)",
  `/* bhai yeh comment band hi nahi hua `
);

tryRun(
  "Unterminated string (Sholay's Basanti)",
  `let_him_cook x = "yeh string toh kabhi khatam hi nahi hogi`
);

tryRun(
  "Unknown character (Mogambo + Hogwarts)",
  `let_him_cook x = 10 @ 20`
);

// ── PARSE ERRORS ─────────────────────────────────────────────────────────────
console.log(`\n${C.bold}${C.cyan}━━━  PARSE ERRORS 🚩  ━━━${C.reset}`);

tryRun(
  "Expected token not found (Chetan Bhagat + Sorting Hat)",
  `let_him_cook = 10`
);

tryRun(
  "Unterminated block — missing } (Gandalf + Rahul Gandhi)",
  `agar (no_cap) { boliye(1)`
);

tryRun(
  "Non-method inside squad (Bahubali + Kattappa)",
  `squad Villain { let_him_cook x = 10 }`
);

tryRun(
  "Invalid assignment target (Mogambo)",
  `1 + 2 = 5`
);

tryRun(
  "Unexpected token (3 Idiots + Rancho)",
  `let_him_cook x = }`
);

// ── RUNTIME ERRORS ────────────────────────────────────────────────────────────
console.log(`\n${C.bold}${C.cyan}━━━  RUNTIME ERRORS 🔥  ━━━${C.reset}`);

tryRun(
  "Undefined variable (Lagaan reference)",
  `boliye(unknownVariable)`
);

tryRun(
  "Assign undeclared variable (DDLJ + Raj)",
  `ghost = 99`
);

tryRun(
  "Print a function without calling it (Phoebe Buffay)",
  `pov greet() { boliye("hello") }
   boliye(greet)`
);

tryRun(
  "Division by zero (Thanos + 6 infinity stones)",
  `let_him_cook x = 10 / 0`
);

tryRun(
  "Index [] on non-array (Spider-Man wrong universe)",
  `let_him_cook x = 5
   boliye(x[0])`
);

tryRun(
  "Unknown BakchodList method (Avengers analogy)",
  `let_him_cook arr = [1, 2, 3]
   arr.fly_karo()`
);

tryRun(
  "Method call on null (Inception reference)",
  `let_him_cook x = null
   x.anything()`
);

tryRun(
  "Call undefined function (Vijay Deverakonda coded)",
  `fakeFunction()`
);

tryRun(
  "Undefined class (Voldemort + Mogambo)",
  `let_him_cook x = new GhostClass()`
);

tryRun(
  "Access property on null (ZNMD road trip)",
  `let_him_cook x = null
   boliye(x.name)`
);

tryRun(
  "buzurg outside a class (Baahubali 2 + Kattappa betrayal)",
  `pov test() { buzurg.init() }
   test()`
);

console.log(`\n${C.bold}${C.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
console.log(`${C.bold}  Jai H-Script! Mogambo khush hua. 🎉${C.reset}\n`);
