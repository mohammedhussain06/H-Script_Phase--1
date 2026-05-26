const TOKENS = require("./tokens.js");
const { LexerError } = require("./errors.js");

module.exports = function lexer(input) {
  const tokens = [];
  let index = 0;
  let line = 1;
  let column = 1;
  const length = input.length;

  function peek() {
    return input[index];
  }

  function nextChar() {
    return input[index + 1];
  }

  function advance() {
    if (input[index] === "\n") {
      line++;
      column = 1;
    } else {
      column++;
    }
    index++;
  }

  function pushToken(type, value) {
    tokens.push({ type, value, line, column });
  }

  while (index < length) {
    let char = peek();

    // WHITESPACE
    if (/\s/.test(char)) {
      advance();
      continue;
    }

    // COMMENTS — single-line: //
    if (char === "/" && nextChar() === "/") {
      advance();
      advance();
      while (peek() !== "\n" && index < length) advance();
      continue;
    }

    // COMMENTS — multi-line: /* ... */
    if (char === "/" && nextChar() === "*") {
      advance();
      advance();
      while (!(peek() === "*" && nextChar() === "/")) {
        advance();
        if (index >= length) {
          throw new LexerError("BSDK tune comment start kiya aur Bermuda Triangle mein ghus gaya 🌀 — yeh Thanos ka snap nahi tha jo adha adha khatam hota. Apna '*/' dhundh haramkhor, SKILL ISSUE fr fr", line, column);
        }
      }
      advance();
      advance();
      continue;
    }

    // NUMBERS (integer + decimal float support)
    if (/[0-9]/.test(char)) {
      let numStr = "";
      while (index < length && /[0-9]/.test(peek())) {
        numStr += peek();
        advance();
      }
      // Optional decimal part
      if (peek() === "." && /[0-9]/.test(input[index + 1])) {
        numStr += peek();
        advance();
        while (index < length && /[0-9]/.test(peek())) {
          numStr += peek();
          advance();
        }
      }
      pushToken(TOKENS.NUMBER, Number(numStr));
      continue;
    }

    // STRINGS: "hello" (with escape sequence support)
    if (char === '"') {
      advance(); // skip opening "
      let str = "";
      while (peek() !== '"' && index < length) {
        if (peek() === "\\" && index + 1 < length) {
          advance();
          const esc = peek();
          if      (esc === "n")  str += "\n";
          else if (esc === "t")  str += "\t";
          else if (esc === '"')  str += '"';
          else if (esc === "\\") str += "\\";
          else                   str += esc;
          advance();
        } else {
          str += peek();
          advance();
        }
      }
      if (peek() !== '"') {
        throw new LexerError("SAALA teri string Sholay ki Basanti se bhi zyada bak bak karti hai aur phir bhi band nahi hui 🎬 — 'Kitne aadmi the?' jaisi confusion mat kar, ek closing '\"' daal de bc. Left on read fr fr", line, column);
      }
      advance(); // skip closing "
      pushToken(TOKENS.STRING, str);
      continue;
    }

    // IDENTIFIERS & KEYWORDS
    if (/[A-Za-z_]/.test(char)) {
      let str = "";
      while (index < length && /[A-Za-z0-9_]/.test(peek())) {
        str += peek();
        advance();
      }

      // H-Script Hinglish keyword dictionary
      if      (str === "let_him_cook")        pushToken(TOKENS.LET, str);
      else if (str === "boliye")              pushToken(TOKENS.PRINT, str);
      else if (str === "agar")               pushToken(TOKENS.IF, str);
      else if (str === "warna")              pushToken(TOKENS.ELSE, str);
      else if (str === "no_cap")             pushToken(TOKENS.TRUE, true);
      else if (str === "fraud")              pushToken(TOKENS.FALSE, false);
      else if (str === "jab_tak_doomscroll") pushToken(TOKENS.WHILE, str);
      else if (str === "baar_baar")          pushToken(TOKENS.FOR, str);
      else if (str === "nikal_lo")           pushToken(TOKENS.BREAK, str);
      else if (str === "skip_karo")          pushToken(TOKENS.CONTINUE, str);
      else if (str === "pov")                pushToken(TOKENS.FUNCTION, str);
      else if (str === "wapas_karo")         pushToken(TOKENS.RETURN, str);
      else if (str === "squad")              pushToken(TOKENS.CLASS, str);
      else if (str === "nepo_baby_of")       pushToken(TOKENS.EXTENDS, str);
      else if (str === "this")               pushToken(TOKENS.THIS, str);
      else if (str === "new")                pushToken(TOKENS.NEW, str);
      else if (str === "null")               pushToken(TOKENS.NULL, null);
      else if (str === "buzurg")             pushToken(TOKENS.SUPER, str);
      else                                   pushToken(TOKENS.IDENT, str);

      continue;
    }

    // BRACKETS — BakchodList (arrays)
    if (char === "[") {
      pushToken(TOKENS.LBRACKET, "[");
      advance();
      continue;
    }
    if (char === "]") {
      pushToken(TOKENS.RBRACKET, "]");
      advance();
      continue;
    }

    // SEMICOLON, COMMA, DOT
    if (char === ";") { pushToken(TOKENS.SEMICOLON, ";"); advance(); continue; }
    if (char === ",") { pushToken(TOKENS.COMMA, ",");     advance(); continue; }
    if (char === ".") { pushToken(TOKENS.DOT, ".");       advance(); continue; }

    // BITWISE OPERATORS — must check multi-char before single-char
    if (char === ">" && nextChar() === ">" && input[index + 2] === ">") {
      pushToken(TOKENS.USHR, ">>>"); advance(); advance(); advance(); continue;
    }
    if (char === ">" && nextChar() === ">") {
      pushToken(TOKENS.SHR, ">>"); advance(); advance(); continue;
    }
    if (char === "<" && nextChar() === "<") {
      pushToken(TOKENS.SHL, "<<"); advance(); advance(); continue;
    }
    if (char === "~") {
      pushToken(TOKENS.BNOT, "~"); advance(); continue;
    }
    if (char === "&" && nextChar() !== "&") {
      pushToken(TOKENS.BAND, "&"); advance(); continue;
    }
    if (char === "|" && nextChar() !== "|") {
      pushToken(TOKENS.BOR, "|"); advance(); continue;
    }
    if (char === "^") {
      pushToken(TOKENS.BXOR, "^"); advance(); continue;
    }

    // LOGICAL OPERATORS
    if (char === "&" && nextChar() === "&") {
      pushToken(TOKENS.AND, "&&"); advance(); advance(); continue;
    }
    if (char === "|" && nextChar() === "|") {
      pushToken(TOKENS.OR, "||"); advance(); advance(); continue;
    }
    if (char === "!") {
      if (nextChar() === "=") {
        pushToken(TOKENS.NOTEQ, "!="); advance(); advance();
      } else {
        pushToken(TOKENS.NOT, "!"); advance();
      }
      continue;
    }

    // COMPARISON & ASSIGNMENT
    if (char === "=" && nextChar() === "=") {
      pushToken(TOKENS.EQEQ, "=="); advance(); advance(); continue;
    }
    if (char === "=" && nextChar() !== "=") {
      pushToken(TOKENS.EQUAL, "="); advance(); continue;
    }
    if (char === ">" && nextChar() === "=") {
      pushToken(TOKENS.GTE, ">="); advance(); advance(); continue;
    }
    if (char === "<" && nextChar() === "=") {
      pushToken(TOKENS.LTE, "<="); advance(); advance(); continue;
    }
    if (char === ">") { pushToken(TOKENS.GREATER, ">"); advance(); continue; }
    if (char === "<") { pushToken(TOKENS.LESS, "<");    advance(); continue; }

    // ARITHMETIC (multi-char first)
    if (char === "+" && nextChar() === "+") {
      pushToken(TOKENS.PLUS_PLUS, "++"); advance(); advance(); continue;
    }
    if (char === "+" && nextChar() === "=") {
      pushToken(TOKENS.PLUS_EQUAL, "+="); advance(); advance(); continue;
    }
    if (char === "+") { pushToken(TOKENS.PLUS, "+"); advance(); continue; }

    if (char === "-" && nextChar() === "-") {
      pushToken(TOKENS.MINUS_MINUS, "--"); advance(); advance(); continue;
    }
    if (char === "-" && nextChar() === "=") {
      pushToken(TOKENS.MINUS_EQUAL, "-="); advance(); advance(); continue;
    }
    if (char === "-") { pushToken(TOKENS.MINUS, "-"); advance(); continue; }

    if (char === "*" && nextChar() === "=") {
      pushToken(TOKENS.STAR_EQUAL, "*="); advance(); advance(); continue;
    }
    if (char === "*") { pushToken(TOKENS.STAR, "*"); advance(); continue; }

    if (char === "/" && nextChar() === "=") {
      pushToken(TOKENS.SLASH_EQUAL, "/="); advance(); advance(); continue;
    }
    if (char === "/") { pushToken(TOKENS.SLASH, "/"); advance(); continue; }

    if (char === "%") { pushToken(TOKENS.MOD, "%"); advance(); continue; }

    // BRACES / PARENTHESES
    if (char === "(") { pushToken(TOKENS.LPAREN, "("); advance(); continue; }
    if (char === ")") { pushToken(TOKENS.RPAREN, ")"); advance(); continue; }
    if (char === "{") { pushToken(TOKENS.LBRACE, "{"); advance(); continue; }
    if (char === "}") { pushToken(TOKENS.RBRACE, "}"); advance(); continue; }

    // UNKNOWN CHARACTER
    throw new LexerError(`'${char}' KAHAN SE AAYA YEH?? 🧙 — Bhai yeh H-Script hai Hogwarts nahi ki koi bhi random spell chala do. Mogambo khush nahi hua. Yeh character toh pure Ohio-level cringe hai. L + ratio. Nikal bahar chutiye`, line, column);
  }

  pushToken(TOKENS.EOF, null);
  return tokens;
};
