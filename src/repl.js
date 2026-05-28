/**
 * H-Script Phase 2 — Interactive REPL
 * Run: node src/repl.js
 *
 * Features:
 *   - Multi-line input (detects unclosed braces)
 *   - Nice error messages with line/col info
 *   - Special commands: :help  :clear  :quit
 */

const readline = require("readline");
const lexer       = require("./lexer.js");
const parser      = require("./parser.js");
const interpreter = require("./interpreter.js");
const { HScriptError } = require("./errors.js");

// Persistent session — variables & classes survive across every line
const session = interpreter.createSession();

// ── ANSI Colors ──────────────────────────────────────────────────────────────
const C = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
  cyan:   "\x1b[36m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  red:    "\x1b[31m",
  magenta:"\x1b[35m",
};

// ── Banner ───────────────────────────────────────────────────────────────────
console.log(`
${C.cyan}${C.bold}╔══════════════════════════════════════════╗
║    🔥  H-Script v3.0  —  REPL  🔥       ║
║    Type H-Script code and run it!        ║
╚══════════════════════════════════════════╝${C.reset}
${C.dim}  Commands: :help  :clear  :quit${C.reset}
`);

// ── Readline Setup ───────────────────────────────────────────────────────────
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

let buffer = "";   // accumulated multi-line input
let depth  = 0;    // brace depth — when 0, input is complete

function countBraces(line) {
  for (const ch of line) {
    if (ch === "{") depth++;
    if (ch === "}") depth--;
  }
}

// ── Execute a block of code ───────────────────────────────────────────────────
function runCode(code) {
  try {
    const tokens = lexer(code);
    const ast    = parser(tokens);
    session.run(ast);          // reuse the same env — variables persist!
  } catch (err) {
    if (err instanceof HScriptError) {
      console.log(err.format());
    } else {
      console.log(`${C.red}[Error]: ${err.message}${C.reset}`);
    }
  }
}

// ── Help text ────────────────────────────────────────────────────────────────
const HELP = `
${C.bold}${C.cyan}H-Script v3.0 — Language Reference${C.reset}
${"─".repeat(50)}
${C.cyan}Variables & Output${C.reset}
  let_him_cook x = 42
  boliye(x)                         → print with newline
  bolao("no newline")               → print without newline

${C.cyan}Control Flow${C.reset}
  agar (x > 5) { } warna { }       → if / else
  agar (x>5) { } baaki_sab agar (x>0) { } warna { }  → else-if
  jab_tak_doomscroll (cond) { }    → while loop
  baar_baar (let_him_cook i=0; i<5; i++) { }

${C.cyan}Functions (pov) + Default Params${C.reset}
  pov add(a, b = 0) { wapas_karo a + b }
  boliye(add(2, 3))                 → 5
  boliye(add(2))                    → 2  (b defaults to 0)

${C.cyan}Classes (squad) + Inheritance${C.reset}
  squad Dog nepo_baby_of Animal {
    pov speak() { buzurg.speak()  boliye("Bho!") }
  }
  let_him_cook d = new Dog("Rocky")  d.speak()

${C.cyan}BakchodList (Arrays) + Spread${C.reset}
  let_him_cook arr = [1, 2, 3]
  let_him_cook b = [...arr, 4, 5]   → spread into new array
  boliye(arr.lambai)                → length
  arr.daalo(4)  arr.nikalo()        → push / pop
  arr.palat()   arr.sort_karo()     → reverse / sort
  boliye(arr.milao(", "))           → join to string
  boliye(arr[0])   arr[0] = 99      → index get / set

${C.cyan}JugaadMap (Dictionary)${C.reset}
  let_him_cook m = { name: "Rocky", age: 21 }
  boliye(m.name)   boliye(m["age"])
  m.city = "Mumbai"
  let_him_cook c = { ...m, level: 9 }  → object spread
  keys_nikalo(m)   values_nikalo(m)    hasKey_kya(m, "name")

${C.cyan}Template Literals${C.reset}
  boliye(\`Hello \${name}!\`)          → string interpolation
  boliye(\`Sum: \${a + b}\`)           → expressions in \${}

${C.cyan}Ternary${C.reset}
  boliye(x > 0 ? "pos" : "neg")     → condition ? a : b

${C.cyan}Try / Catch / Finally${C.reset}
  agar_risk { jhel_isko "oops" }
  pakad_lo (e) { boliye(e) }
  jo_bhi_hai_bhaad_me_jaaye { boliye("cleanup") }

${C.cyan}Stdlib — Phase 2${C.reset}
  typeOf  toNumber  toString  toBool
  ceiling  flooring  powerOf  squareRoot  absValue  randomNum
  upperCase  lowerCase  lambai  trim_karo  repeat_karo
  includes_kya  split_karo  replace_karo  bolao

${C.cyan}Stdlib — Phase 3${C.reset}
  min(...)  max(...)  isNaN_kya()  parseInt_karo()  parseFloat_karo()
  keys_nikalo()  values_nikalo()  hasKey_kya()

${C.cyan}REPL Commands${C.reset}
  :help    Show this reference
  :clear   Clear the screen
  :quit    Exit the REPL
${"─".repeat(50)}
`;

// ── Main prompt loop ──────────────────────────────────────────────────────────
function prompt() {
  const indicator = depth > 0
    ? `${C.yellow}...${C.reset} `
    : `${C.green}${C.bold}H»${C.reset} `;

  rl.question(indicator, (line) => {
    if (line === null) {
      rl.close();
      return;
    }

    // ── Special REPL commands (only when not inside a block) ──────────────
    if (depth === 0) {
      const cmd = line.trim();
      if (cmd === ":quit" || cmd === ":exit") {
        console.log(`\n${C.dim}Bye! Stay no_cap. ✌️${C.reset}\n`);
        rl.close();
        return;
      }
      if (cmd === ":clear") {
        console.clear();
        buffer = "";
        depth  = 0;
        prompt();
        return;
      }
      if (cmd === ":help") {
        console.log(HELP);
        prompt();
        return;
      }
    }

    // Accumulate input
    buffer += line + "\n";
    countBraces(line);

    // When braces are balanced, execute
    if (depth <= 0) {
      depth = 0;
      const code = buffer.trim();
      buffer = "";
      if (code) runCode(code);
    }

    prompt();
  });
}

prompt();
