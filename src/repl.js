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
║    🔥  H-Script v2.0  —  REPL  🔥       ║
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
${C.bold}${C.cyan}H-Script v2.0 — Language Reference${C.reset}
${"─".repeat(46)}
${C.cyan}Variables & Output${C.reset}
  let_him_cook x = 42
  boliye(x)                      → prints x

${C.cyan}Control Flow${C.reset}
  agar (x > 5) { } warna { }    → if / else
  jab_tak_doomscroll (cond) { } → while loop
  baar_baar (let_him_cook i = 0; i < 5; i++) { }

${C.cyan}Functions (pov)${C.reset}
  pov add(a, b) { wapas_karo a + b }
  boliye(add(2, 3))              → 5

${C.cyan}Classes (squad)${C.reset}
  squad Animal {
    pov init(name) { this.name = name }
    pov speak() { boliye(this.name) }
  }
  squad Dog nepo_baby_of Animal {
    pov speak() { buzurg.speak()  boliye("Bho!") }
  }
  let_him_cook d = new Dog("Rocky")
  d.speak()

${C.cyan}BakchodList (Arrays)${C.reset}
  let_him_cook arr = [1, 2, 3]
  arr.daalo(4)                   → push
  arr.nikalo()                   → pop
  boliye(arr.lambai)             → length
  boliye(arr[0])                 → index access
  arr[0] = 99                    → index assign
  arr.palat()                    → reverse
  arr.sort_karo()                → sort numerically
  boliye(arr.milao(", "))        → join to string

${C.cyan}Null & Booleans${C.reset}
  let_him_cook x = null
  no_cap  fraud                  → true  false

${C.cyan}Stdlib (auto-available)${C.reset}
  typeOf(x)      toNumber("5")   toString(42)
  ceiling(3.2)   flooring(3.9)   powerOf(2, 8)
  squareRoot(9)  absValue(-5)    randomNum(1, 10)
  upperCase(s)   lowerCase(s)    lambai(s)
  trim_karo(s)   includes_kya(s, sub)
  split_karo(s, sep)             replace_karo(s, from, to)

${C.cyan}REPL Commands${C.reset}
  :help    Show this reference
  :clear   Clear the screen
  :quit    Exit the REPL
${"─".repeat(46)}
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
