/**
 * H-Script Phase 2 — Custom Error System
 * Errors carry line + column AND maximum vibe energy.
 */

class HScriptError extends Error {
  constructor(message, line = null, column = null) {
    super(message);
    this.name = "HScriptError";
    this.hLine = line;
    this.hColumn = column;
  }

  format() {
    const loc =
      this.hLine != null
        ? ` at line ${this.hLine}, col ${this.hColumn}`
        : "";
    return `\x1b[31m[${this.name}]${loc}: ${this.message}\x1b[0m`;
  }
}

class LexerError extends HScriptError {
  constructor(message, line, column) {
    super(message, line, column);
    this.name = "LexerError 💀";
  }
}

class ParseError extends HScriptError {
  constructor(message, line, column) {
    super(message, line, column);
    this.name = "ParseError 🚩";
  }
}

class RuntimeError extends HScriptError {
  constructor(message) {
    super(message, null, null);
    this.name = "RuntimeError 🔥";
  }
}

module.exports = { HScriptError, LexerError, ParseError, RuntimeError };
