// H-Script Lexer — ES Module version for browser runtime
import TOKENS from './tokens.js';
import { LexerError } from './errors.js';

export default function lexer(input) {
  const tokens = [];
  let index = 0;
  let line = 1;
  let column = 1;
  const length = input.length;

  function peek() { return input[index]; }
  function nextChar() { return input[index + 1]; }
  function advance() {
    if (input[index] === "\n") { line++; column = 1; } else { column++; }
    index++;
  }
  function pushToken(type, value) { tokens.push({ type, value, line, column }); }

  while (index < length) {
    let char = peek();

    if (/\s/.test(char)) { advance(); continue; }

    if (char === "/" && nextChar() === "/") {
      advance(); advance();
      while (peek() !== "\n" && index < length) advance();
      continue;
    }

    if (char === "/" && nextChar() === "*") {
      advance(); advance();
      while (!(peek() === "*" && nextChar() === "/")) {
        advance();
        if (index >= length) throw new LexerError("BSDK tune comment start kiya aur Bermuda Triangle mein ghus gaya 🌀 — closing '*/' dhundh haramkhor", line, column);
      }
      advance(); advance();
      continue;
    }

    if (/[0-9]/.test(char)) {
      let numStr = "";
      while (index < length && /[0-9]/.test(peek())) { numStr += peek(); advance(); }
      if (peek() === "." && /[0-9]/.test(input[index + 1])) {
        numStr += peek(); advance();
        while (index < length && /[0-9]/.test(peek())) { numStr += peek(); advance(); }
      }
      pushToken(TOKENS.NUMBER, Number(numStr));
      continue;
    }

    if (char === "`") {
      advance();
      const segments = [];
      let strPart = "";
      while (peek() !== "`" && index < length) {
        if (peek() === "$" && nextChar() === "{") {
          if (strPart) { segments.push({ type: "str", value: strPart }); strPart = ""; }
          advance(); advance();
          let exprSrc = "";
          let depth = 1;
          while (depth > 0 && index < length) {
            if (peek() === "{") depth++;
            else if (peek() === "}") { depth--; if (depth === 0) break; }
            exprSrc += peek(); advance();
          }
          if (peek() !== "}") throw new LexerError("SAALA tera '${' expression band nahi hua bc 🫠 — closing brace daal haramkhor", line, column);
          advance();
          const innerTokens = lexer(exprSrc);
          innerTokens.pop();
          segments.push({ type: "expr", tokens: innerTokens });
        } else if (peek() === "\\") {
          advance();
          const esc = peek();
          if      (esc === "n")  strPart += "\n";
          else if (esc === "t")  strPart += "\t";
          else if (esc === "`")  strPart += "`";
          else if (esc === "\\") strPart += "\\";
          else                   strPart += esc;
          advance();
        } else { strPart += peek(); advance(); }
      }
      if (peek() !== "`") throw new LexerError("SAALA backtick khola aur band nahi kiya bc 🫠 — closing backtick daal", line, column);
      advance();
      if (strPart) segments.push({ type: "str", value: strPart });
      pushToken(TOKENS.TEMPLATE_LITERAL, segments);
      continue;
    }

    if (char === '"') {
      advance();
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
        } else { str += peek(); advance(); }
      }
      if (peek() !== '"') throw new LexerError("SAALA teri string band nahi hui bc 🎬 — closing '\"' daal de haramkhor", line, column);
      advance();
      pushToken(TOKENS.STRING, str);
      continue;
    }

    if (/[A-Za-z_]/.test(char)) {
      let str = "";
      while (index < length && /[A-Za-z0-9_]/.test(peek())) { str += peek(); advance(); }

      if      (str === "let_him_cook")               pushToken(TOKENS.LET, str);
      else if (str === "boliye")                     pushToken(TOKENS.PRINT, str);
      else if (str === "agar")                       pushToken(TOKENS.IF, str);
      else if (str === "warna")                      pushToken(TOKENS.ELSE, str);
      else if (str === "baaki_sab")                  pushToken(TOKENS.ELSEIF, str);
      else if (str === "no_cap")                     pushToken(TOKENS.TRUE, true);
      else if (str === "fraud")                      pushToken(TOKENS.FALSE, false);
      else if (str === "jab_tak_doomscroll")         pushToken(TOKENS.WHILE, str);
      else if (str === "baar_baar")                  pushToken(TOKENS.FOR, str);
      else if (str === "nikal_lo")                   pushToken(TOKENS.BREAK, str);
      else if (str === "skip_karo")                  pushToken(TOKENS.CONTINUE, str);
      else if (str === "pov")                        pushToken(TOKENS.FUNCTION, str);
      else if (str === "wapas_karo")                 pushToken(TOKENS.RETURN, str);
      else if (str === "squad")                      pushToken(TOKENS.CLASS, str);
      else if (str === "nepo_baby_of")               pushToken(TOKENS.EXTENDS, str);
      else if (str === "this")                       pushToken(TOKENS.THIS, str);
      else if (str === "new")                        pushToken(TOKENS.NEW, str);
      else if (str === "null")                       pushToken(TOKENS.NULL, null);
      else if (str === "buzurg")                     pushToken(TOKENS.SUPER, str);
      else if (str === "agar_risk")                  pushToken(TOKENS.TRY, str);
      else if (str === "pakad_lo")                   pushToken(TOKENS.CATCH, str);
      else if (str === "jo_bhi_hai_bhaad_me_jaaye") pushToken(TOKENS.FINALLY, str);
      else if (str === "jhel_isko")                  pushToken(TOKENS.THROW, str);
      else if (str === "lele")                       pushToken(TOKENS.IMPORT, str);
      else                                           pushToken(TOKENS.IDENT, str);
      continue;
    }

    if (char === "[") { pushToken(TOKENS.LBRACKET, "["); advance(); continue; }
    if (char === "]") { pushToken(TOKENS.RBRACKET, "]"); advance(); continue; }
    if (char === ";") { pushToken(TOKENS.SEMICOLON, ";"); advance(); continue; }
    if (char === ",") { pushToken(TOKENS.COMMA, ","); advance(); continue; }
    if (char === ":") { pushToken(TOKENS.COLON, ":"); advance(); continue; }
    if (char === "?") { pushToken(TOKENS.QUESTION, "?"); advance(); continue; }

    if (char === "." && nextChar() === "." && input[index + 2] === ".") {
      pushToken(TOKENS.SPREAD, "..."); advance(); advance(); advance(); continue;
    }
    if (char === ".") { pushToken(TOKENS.DOT, "."); advance(); continue; }

    if (char === ">" && nextChar() === ">" && input[index + 2] === ">") {
      pushToken(TOKENS.USHR, ">>>"); advance(); advance(); advance(); continue;
    }
    if (char === ">" && nextChar() === ">") { pushToken(TOKENS.SHR, ">>"); advance(); advance(); continue; }
    if (char === "<" && nextChar() === "<") { pushToken(TOKENS.SHL, "<<"); advance(); advance(); continue; }
    if (char === "~") { pushToken(TOKENS.BNOT, "~"); advance(); continue; }
    if (char === "&" && nextChar() !== "&") { pushToken(TOKENS.BAND, "&"); advance(); continue; }
    if (char === "|" && nextChar() !== "|") { pushToken(TOKENS.BOR, "|"); advance(); continue; }
    if (char === "^") { pushToken(TOKENS.BXOR, "^"); advance(); continue; }

    if (char === "&" && nextChar() === "&") { pushToken(TOKENS.AND, "&&"); advance(); advance(); continue; }
    if (char === "|" && nextChar() === "|") { pushToken(TOKENS.OR, "||"); advance(); advance(); continue; }
    if (char === "!") {
      if (nextChar() === "=") { pushToken(TOKENS.NOTEQ, "!="); advance(); advance(); }
      else { pushToken(TOKENS.NOT, "!"); advance(); }
      continue;
    }

    if (char === "=" && nextChar() === "=") { pushToken(TOKENS.EQEQ, "=="); advance(); advance(); continue; }
    if (char === "=" && nextChar() !== "=") { pushToken(TOKENS.EQUAL, "="); advance(); continue; }
    if (char === ">" && nextChar() === "=") { pushToken(TOKENS.GTE, ">="); advance(); advance(); continue; }
    if (char === "<" && nextChar() === "=") { pushToken(TOKENS.LTE, "<="); advance(); advance(); continue; }
    if (char === ">") { pushToken(TOKENS.GREATER, ">"); advance(); continue; }
    if (char === "<") { pushToken(TOKENS.LESS, "<"); advance(); continue; }

    if (char === "+" && nextChar() === "+") { pushToken(TOKENS.PLUS_PLUS, "++"); advance(); advance(); continue; }
    if (char === "+" && nextChar() === "=") { pushToken(TOKENS.PLUS_EQUAL, "+="); advance(); advance(); continue; }
    if (char === "+") { pushToken(TOKENS.PLUS, "+"); advance(); continue; }
    if (char === "-" && nextChar() === "-") { pushToken(TOKENS.MINUS_MINUS, "--"); advance(); advance(); continue; }
    if (char === "-" && nextChar() === "=") { pushToken(TOKENS.MINUS_EQUAL, "-="); advance(); advance(); continue; }
    if (char === "-") { pushToken(TOKENS.MINUS, "-"); advance(); continue; }
    if (char === "*" && nextChar() === "=") { pushToken(TOKENS.STAR_EQUAL, "*="); advance(); advance(); continue; }
    if (char === "*") { pushToken(TOKENS.STAR, "*"); advance(); continue; }
    if (char === "/" && nextChar() === "=") { pushToken(TOKENS.SLASH_EQUAL, "/="); advance(); advance(); continue; }
    if (char === "/") { pushToken(TOKENS.SLASH, "/"); advance(); continue; }
    if (char === "%") { pushToken(TOKENS.MOD, "%"); advance(); continue; }

    if (char === "(") { pushToken(TOKENS.LPAREN, "("); advance(); continue; }
    if (char === ")") { pushToken(TOKENS.RPAREN, ")"); advance(); continue; }
    if (char === "{") { pushToken(TOKENS.LBRACE, "{"); advance(); continue; }
    if (char === "}") { pushToken(TOKENS.RBRACE, "}"); advance(); continue; }

    throw new LexerError(`'${char}' KAHAN SE AAYA YEH?? 🧙 — Bhai yeh H-Script hai Hogwarts nahi. Mogambo khush nahi hua. L + ratio. Nikal bahar`, line, column);
  }

  pushToken(TOKENS.EOF, null);
  return tokens;
}
