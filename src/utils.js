/**
 * H-Script Phase 2 — Standard Library
 * All functions are automatically available globally — no imports needed.
 *
 * Usage in H-Script:
 *   boliye(typeOf(42))          // "number"
 *   boliye(upperCase("hello"))  // "HELLO"
 *   boliye(powerOf(2, 10))      // 1024
 */

const { RuntimeError } = require("./errors.js");

function native(name, fn) {
  return { type: "NativeFunction", name, fn };
}

module.exports = {
  // ── Type System ──────────────────────────────────────────────────────────
  typeOf: native("typeOf", (args) => {
    const val = args[0];
    if (val === null || val === undefined) return "null";
    if (Array.isArray(val))               return "BakchodList";
    if (typeof val === "object" &&
        (val.type === "FunctionValue" || val.type === "NativeFunction")) return "pov";
    return typeof val; // "number" | "string" | "boolean"
  }),

  // ── Type Conversions ─────────────────────────────────────────────────────
  toNumber: native("toNumber", (args) => {
    const n = Number(args[0]);
    if (isNaN(n)) throw new RuntimeError(`toNumber: cannot convert '${args[0]}' to a number`);
    return n;
  }),

  toString: native("toString", (args) => {
    const val = args[0];
    if (val === null || val === undefined) return "null";
    if (Array.isArray(val)) return `BakchodList [ ${val.join(", ")} ]`;
    return String(val);
  }),

  toBool: native("toBool", (args) => Boolean(args[0])),

  // ── Math ─────────────────────────────────────────────────────────────────
  ceiling: native("ceiling", (args) => {
    if (typeof args[0] !== "number") throw new RuntimeError("ceiling() expects a number");
    return Math.ceil(args[0]);
  }),

  flooring: native("flooring", (args) => {
    if (typeof args[0] !== "number") throw new RuntimeError("flooring() expects a number");
    return Math.floor(args[0]);
  }),

  powerOf: native("powerOf", (args) => {
    if (typeof args[0] !== "number" || typeof args[1] !== "number")
      throw new RuntimeError("powerOf() expects two numbers");
    return Math.pow(args[0], args[1]);
  }),

  squareRoot: native("squareRoot", (args) => {
    if (typeof args[0] !== "number") throw new RuntimeError("squareRoot() expects a number");
    if (args[0] < 0) throw new RuntimeError("squareRoot: cannot take root of a negative number");
    return Math.sqrt(args[0]);
  }),

  absValue: native("absValue", (args) => {
    if (typeof args[0] !== "number") throw new RuntimeError("absValue() expects a number");
    return Math.abs(args[0]);
  }),

  randomNum: native("randomNum", (args) => {
    const min = args[0] ?? 0;
    const max = args[1] ?? 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }),

  // ── String Operations ────────────────────────────────────────────────────
  lambai: native("lambai", (args) => {
    const s = args[0];
    if (typeof s !== "string" && !Array.isArray(s))
      throw new RuntimeError("lambai() expects a string or BakchodList");
    return s.length;
  }),

  upperCase: native("upperCase", (args) => {
    if (typeof args[0] !== "string") throw new RuntimeError("upperCase() expects a string");
    return args[0].toUpperCase();
  }),

  lowerCase: native("lowerCase", (args) => {
    if (typeof args[0] !== "string") throw new RuntimeError("lowerCase() expects a string");
    return args[0].toLowerCase();
  }),

  trim_karo: native("trim_karo", (args) => {
    if (typeof args[0] !== "string") throw new RuntimeError("trim_karo() expects a string");
    return args[0].trim();
  }),

  repeat_karo: native("repeat_karo", (args) => {
    if (typeof args[0] !== "string") throw new RuntimeError("repeat_karo() expects a string");
    if (typeof args[1] !== "number") throw new RuntimeError("repeat_karo() expects a number as 2nd arg");
    return args[0].repeat(args[1]);
  }),

  includes_kya: native("includes_kya", (args) => {
    return String(args[0]).includes(String(args[1]));
  }),

  split_karo: native("split_karo", (args) => {
    const sep = args[1] ?? "";
    return String(args[0]).split(String(sep));
  }),

  replace_karo: native("replace_karo", (args) => {
    return String(args[0]).replace(String(args[1]), String(args[2]));
  }),

  // ── Input / Output ───────────────────────────────────────────────────────
  // Print without newline
  bolao: native("bolao", (args) => {
    process.stdout.write(args.map((v) => (v === null ? "null" : String(v))).join(""));
    return null;
  }),
};
