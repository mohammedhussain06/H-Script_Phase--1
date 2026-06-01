/**
 * H-Script Browser Runtime — entry point
 * Uses local ES module copies of lexer/parser/interpreter (no cross-directory imports).
 */
import lexer       from './lexer.js'
import parse       from './parser.js'
import interpreter from './interpreter.js'
import { HScriptError } from './errors.js'

/**
 * runCode(code) — Execute H-Script code in the browser.
 * Returns: { output: string[], errors: string[] }
 */
export function runCode(code) {
  const output = []
  const errors = []

  const origLog   = console.log
  const origError = console.error
  const origWarn  = console.warn

  // Capture all console output
  console.log   = (...args) => output.push(args.map(a => (a === null || a === undefined ? 'null' : String(a))).join(' '))
  console.error = (...args) => errors.push(args.map(String).join(' '))
  console.warn  = (...args) => output.push('[warn] ' + args.map(String).join(' '))

  try {
    const tokens = lexer(code)
    const ast    = parse(tokens)
    interpreter(ast)
  } catch (err) {
    // Strip any ANSI codes (shouldn't appear now but just in case)
    const clean = (str) => String(str).replace(/\x1b\[[0-9;]*m/g, '')
    if (err instanceof HScriptError) {
      const loc = err.hLine != null ? ` [line ${err.hLine}]` : ''
      errors.push(`${err.name}${loc}: ${clean(err.message)}`)
    } else {
      errors.push(`Error: ${clean(err.message)}`)
    }
  } finally {
    console.log   = origLog
    console.error = origError
    console.warn  = origWarn
  }

  return { output, errors }
}

/**
 * getKeywords() — Returns all H-Script keywords for Monaco autocomplete
 */
export function getKeywords() {
  return [
    'let_him_cook', 'boliye', 'agar', 'warna', 'baaki_sab',
    'pov', 'wapas_karo', 'squad', 'new', 'this', 'buzurg',
    'nepo_baby_of', 'baar_baar', 'jab_tak_doomscroll',
    'nikal_lo', 'skip_karo', 'no_cap', 'fraud', 'null',
    'agar_risk', 'pakad_lo', 'jo_bhi_hai_bhaad_me_jaaye',
    'jhel_isko', 'lele',
    // stdlib
    'lambai', 'upperCase', 'lowerCase', 'trim_karo', 'split_karo',
    'includes_kya', 'parseInt_karo', 'parseFloat_karo', 'isNaN_kya',
    'typeOf', 'powerOf', 'squareRoot', 'absValue', 'roundKaro',
    'floorKaro', 'ceilKaro', 'max', 'min', 'randomNum',
    'keys_nikalo', 'values_nikalo', 'hasKey_kya',
    // HOF / array methods
    'forEach_karo', 'map_karo', 'filter_karo', 'reduce_karo',
    'koi_bhi', 'sab_sahi', 'dhundo_karo', 'dhundo',
    'daalo', 'nikalo', 'jodo', 'palat', 'sort_karo', 'milao',
    'slice_karo', 'pehla', 'aakhri',
  ]
}
