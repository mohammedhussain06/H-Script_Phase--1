/**
 * H-Script Phase 2 — Test Runner
 *
 * Usage:
 *   node test/testrunner.js              → run all .hs files in test/
 *   node test/testrunner.js loop.hs      → run a single file
 */

const fs   = require("fs");
const path = require("path");

const lexer       = require("../src/lexer.js");
const parser      = require("../src/parser.js");
const interpreter = require("../src/interpreter.js");
const { HScriptError } = require("../src/errors.js");

// ── ANSI Colors ──────────────────────────────────────────────────────────────
const C = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
  green:  "\x1b[32m",
  red:    "\x1b[31m",
  yellow: "\x1b[33m",
  cyan:   "\x1b[36m",
};

// ── Run a single .hs file ────────────────────────────────────────────────────
function runFile(filePath) {
  const name = path.basename(filePath);
  let code;

  try {
    code = fs.readFileSync(filePath, "utf8");
  } catch {
    console.log(`${C.red}❌ FAIL${C.reset} ${C.bold}${name}${C.reset} — file not found`);
    return false;
  }

  try {
    const tokens = lexer(code);
    const ast    = parser(tokens);

    // Capture stdout so we can show it indented
    const lines = [];
    const origLog = console.log;
    console.log = (...args) => lines.push(args.join(" "));

    interpreter(ast);
    console.log = origLog;

    console.log(`${C.green}✅ PASS${C.reset} ${C.bold}${name}${C.reset}`);
    for (const line of lines) {
      console.log(`   ${C.dim}${line}${C.reset}`);
    }
    return true;

  } catch (err) {
    // Restore console.log in case it was hijacked before the throw
    // (safe to call even if not overridden)
    console.log = console.log.__originalLog ?? console.log;

    console.log(`${C.red}❌ FAIL${C.reset} ${C.bold}${name}${C.reset}`);
    if (err instanceof HScriptError) {
      console.log(`   ${C.red}${err.format()}${C.reset}`);
    } else {
      console.log(`   ${C.red}[Error]: ${err.message}${C.reset}`);
    }
    return false;
  }
}

// ── Entry point ───────────────────────────────────────────────────────────────
const testDir = __dirname;
const arg     = process.argv[2];

if (arg) {
  // Single file mode
  const filePath = path.isAbsolute(arg) ? arg : path.join(testDir, arg);
  const ok = runFile(filePath);
  process.exit(ok ? 0 : 1);

} else {
  // Run all .hs files
  const files = fs.readdirSync(testDir).filter((f) => f.endsWith(".hs")).sort();

  if (files.length === 0) {
    console.log(`${C.yellow}No .hs test files found in test/${C.reset}`);
    process.exit(0);
  }

  console.log(`\n${C.bold}${C.cyan}H-Script Phase 2 — Test Suite${C.reset}`);
  console.log(`${"─".repeat(44)}`);

  let passed = 0;
  let failed = 0;

  for (const file of files) {
    const ok = runFile(path.join(testDir, file));
    ok ? passed++ : failed++;
  }

  console.log(`${"─".repeat(44)}`);
  console.log(
    `\n${C.bold}Results: ${C.green}${passed} passed${C.reset}  ${C.bold}${C.red}${failed} failed${C.reset}  ${C.dim}(${files.length} total)${C.reset}\n`
  );

  process.exit(failed > 0 ? 1 : 0);
}
