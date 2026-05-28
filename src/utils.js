/**
 * H-Script Phase 2/3 — Standard Library
 * All functions are automatically available globally — no imports needed.
 *
 * Phase 2: typeOf, toNumber, toString, toBool, ceiling, flooring, powerOf,
 *           squareRoot, absValue, randomNum, lambai, upperCase, lowerCase,
 *           trim_karo, repeat_karo, includes_kya, split_karo, replace_karo, bolao
 *
 * Phase 3: min, max, isNaN_kya, keys_nikalo, values_nikalo, hasKey_kya,
 *           parseInt_karo, parseFloat_karo
 */

const { RuntimeError } = require("./errors.js");

function native(name, fn) {
  return { type: "NativeFunction", name, fn };
}

function isJugaadMap(val) {
  return (
    val !== null &&
    typeof val === "object" &&
    !Array.isArray(val) &&
    val.type !== "FunctionValue" &&
    val.type !== "NativeFunction" &&
    Object.getPrototypeOf(val) === Object.prototype
  );
}

module.exports = {
  // ── Type System ──────────────────────────────────────────────────────────
  typeOf: native("typeOf", (args) => {
    const val = args[0];
    if (val === null || val === undefined) return "null";
    if (Array.isArray(val))               return "BakchodList";
    if (typeof val === "object" &&
        (val.type === "FunctionValue" || val.type === "NativeFunction")) return "pov";
    if (isJugaadMap(val))                 return "JugaadMap";
    if (typeof val === "object")          return "object"; // class instances
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

  // ── Phase 3: Math extras ─────────────────────────────────────────────────
  min: native("min", (args) => {
    const nums = args.filter(a => typeof a === "number");
    if (nums.length === 0) throw new RuntimeError("min() expects at least one number bc");
    return Math.min(...nums);
  }),

  max: native("max", (args) => {
    const nums = args.filter(a => typeof a === "number");
    if (nums.length === 0) throw new RuntimeError("max() expects at least one number bc");
    return Math.max(...nums);
  }),

  isNaN_kya: native("isNaN_kya", (args) => isNaN(args[0])),

  parseInt_karo: native("parseInt_karo", (args) => {
    const n = parseInt(String(args[0]), args[1] ?? 10);
    if (isNaN(n)) throw new RuntimeError(`parseInt_karo: '${args[0]}' integer nahi hai bc 🤡`);
    return n;
  }),

  parseFloat_karo: native("parseFloat_karo", (args) => {
    const n = parseFloat(String(args[0]));
    if (isNaN(n)) throw new RuntimeError(`parseFloat_karo: '${args[0]}' float nahi hai bc 🤡`);
    return n;
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

  // ── Phase 3: JugaadMap helpers ───────────────────────────────────────────
  keys_nikalo: native("keys_nikalo", (args) => {
    const val = args[0];
    if (!isJugaadMap(val))
      throw new RuntimeError("keys_nikalo() sirf JugaadMap pe kaam karta hai bc 🪣 — array ya class instance mat de");
    return Object.keys(val);
  }),

  values_nikalo: native("values_nikalo", (args) => {
    const val = args[0];
    if (!isJugaadMap(val))
      throw new RuntimeError("values_nikalo() sirf JugaadMap pe kaam karta hai bc 🪣");
    return Object.values(val);
  }),

  hasKey_kya: native("hasKey_kya", (args) => {
    const val = args[0];
    if (!isJugaadMap(val))
      throw new RuntimeError("hasKey_kya() sirf JugaadMap pe kaam karta hai bc 🪣");
    return Object.prototype.hasOwnProperty.call(val, String(args[1]));
  }),

  // ── Input / Output ───────────────────────────────────────────────────────
  // Print without newline
  bolao: native("bolao", (args) => {
    process.stdout.write(args.map((v) => (v === null ? "null" : String(v))).join(""));
    return null;
  }),
};
