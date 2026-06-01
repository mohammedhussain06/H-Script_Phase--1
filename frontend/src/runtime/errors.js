// H-Script Errors — ES Module version for browser runtime
export class HScriptError extends Error {
  constructor(message, line = null, column = null) {
    super(message);
    this.name = "HScriptError";
    this.hLine = line;
    this.hColumn = column;
  }
  format() {
    const loc = this.hLine != null ? ` at line ${this.hLine}, col ${this.hColumn}` : "";
    return `[${this.name}]${loc}: ${this.message}`;
  }
}

export class LexerError extends HScriptError {
  constructor(message, line, column) {
    super(message, line, column);
    this.name = "LexerError 💀";
  }
}

export class ParseError extends HScriptError {
  constructor(message, line, column) {
    super(message, line, column);
    this.name = "ParseError 🚩";
  }
}

export class RuntimeError extends HScriptError {
  constructor(message) {
    super(message, null, null);
    this.name = "RuntimeError 🔥";
  }
}

export class ThrowError extends HScriptError {
  constructor(value) {
    const msg = (value === null || value === undefined) ? "null" : String(value);
    super(msg, null, null);
    this.name = "UchhalError 🪃";
    this.thrownValue = value;
  }
}
