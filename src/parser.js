const TOKENS = require("./tokens.js");
const { ParseError } = require("./errors.js");

module.exports = function parse(tokens) {
  let index = 0;

  function peek() {
    return tokens[index];
  }

  function advance() {
    index++;
  }

  function consume(type) {
    const token = peek();
    if (token.type !== type) {
      throw new ParseError(
        `Expected ${type} but got '${token.value ?? token.type}' — L + RATIO + YOU FELL OFF 💥 Chetan Bhagat bhi isse better likhta bsdk. Even the Sorting Hat said 'NOT GRYFFINDOR'. Kya bakwaas likh raha hai yaar`,
        token.line,
        token.column
      );
    }
    advance();
    return token;
  }

  // ============================
  // PROGRAM
  // ============================
  function parseProgram() {
    const body = [];
    while (peek().type !== TOKENS.EOF) {
      body.push(parseStatement());
    }
    return { type: "Program", body };
  }

  // ============================
  // STATEMENTS
  // ============================
  function parseStatement() {
    const token = peek();

    if (token.type === TOKENS.LET)      return parseLet();
    if (token.type === TOKENS.PRINT)    return parsePrint();
    if (token.type === TOKENS.IF)       return parseIf();
    if (token.type === TOKENS.WHILE)    return parseWhile();
    if (token.type === TOKENS.FOR)      return parseFor();
    if (token.type === TOKENS.BREAK)    return parseBreak();
    if (token.type === TOKENS.CONTINUE) return parseContinue();
    if (token.type === TOKENS.FUNCTION) return parseFunction();
    if (token.type === TOKENS.RETURN)   return parseReturn();
    if (token.type === TOKENS.CLASS)    return parseClass();
    // Phase 3
    if (token.type === TOKENS.TRY)      return parseTryCatch();
    if (token.type === TOKENS.THROW)    return parseThrow();
    // Phase 4
    if (token.type === TOKENS.IMPORT)   return parseImport();

    return parseExpressionStatement();
  }

  function parseExpressionStatement() {
    return { type: "ExpressionStatement", expression: parseExpression() };
  }

  // ============================
  // BLOCK
  // ============================
  function parseBlock() {
    consume(TOKENS.LBRACE);
    const body = [];
    while (peek().type !== TOKENS.RBRACE) {
      if (peek().type === TOKENS.EOF) {
        throw new ParseError("BHAI TERA '}' KAHAN GAYA SAALA?? 🎪 — Tera block khula tha jaise Rahul Gandhi ka speech — shuru hua, khatam hi nahi hota bc. Gandalf bolta hai: YOU SHALL NOT PARSE! Skill issue of the highest order", peek().line, peek().column);
      }
      body.push(parseStatement());
    }
    consume(TOKENS.RBRACE);
    return { type: "BlockStatement", body };
  }

  // ============================
  // CONTROL FLOW
  // ============================
  function parseIf() {
    consume(TOKENS.IF);
    const condition = parseExpression();
    const thenBlock = parseBlock();
    let elseBlock = null;

    if (peek().type === TOKENS.ELSEIF) {
      // baaki_sab agar (...) { } — else-if chaining
      consume(TOKENS.ELSEIF);
      elseBlock = parseIf(); // recursive — parseIf consumes the next 'agar'
    } else if (peek().type === TOKENS.ELSE) {
      consume(TOKENS.ELSE);
      elseBlock = parseBlock();
    }

    return { type: "IfStatement", condition, thenBlock, elseBlock };
  }

  function parseWhile() {
    consume(TOKENS.WHILE);
    const condition = parseExpression();
    return { type: "WhileStatement", condition, body: parseBlock() };
  }

  function parseFor() {
    consume(TOKENS.FOR);
    consume(TOKENS.LPAREN);

    let init =
      peek().type === TOKENS.LET ? parseLet() : parseExpressionStatement();

    consume(TOKENS.SEMICOLON);
    const condition = parseExpression();
    consume(TOKENS.SEMICOLON);
    const update = parseExpression();

    consume(TOKENS.RPAREN);

    return { type: "ForStatement", init, condition, update, body: parseBlock() };
  }

  function parseBreak() {
    consume(TOKENS.BREAK);
    return { type: "BreakStatement" };
  }

  function parseContinue() {
    consume(TOKENS.CONTINUE);
    return { type: "ContinueStatement" };
  }

  // ============================
  // PHASE 3 — TRY / CATCH / FINALLY / THROW
  // ============================
  function parseTryCatch() {
    consume(TOKENS.TRY);
    const tryBlock = parseBlock();

    let catchVar   = null;
    let catchBlock = null;
    let finallyBlock = null;

    if (peek().type === TOKENS.CATCH) {
      consume(TOKENS.CATCH);
      if (peek().type === TOKENS.LPAREN) {
        consume(TOKENS.LPAREN);
        catchVar = consume(TOKENS.IDENT).value;
        consume(TOKENS.RPAREN);
      }
      catchBlock = parseBlock();
    }

    if (peek().type === TOKENS.FINALLY) {
      consume(TOKENS.FINALLY);
      finallyBlock = parseBlock();
    }

    if (!catchBlock && !finallyBlock) {
      throw new ParseError(
        "BSDK agar_risk ke baad pakad_lo ya jo_bhi_hai_bhaad_me_jaaye toh chahiye — akele try se kya hoga bc 🤡 Skill issue fr fr",
        peek().line, peek().column
      );
    }

    return { type: "TryCatchStatement", tryBlock, catchVar, catchBlock, finallyBlock };
  }

  function parseThrow() {
    consume(TOKENS.THROW);
    return { type: "ThrowStatement", argument: parseExpression() };
  }

  // ── Phase 4: Import ──────────────────────────────────────────────────────
  function parseImport() {
    consume(TOKENS.IMPORT);
    const pathToken = consume(TOKENS.STRING);
    return { type: "ImportStatement", path: pathToken.value };
  }

  // ============================
  // FUNCTIONS & CLASSES
  // ============================

  /**
   * Parse a parameter list with optional default values.
   * e.g.  pov greet(name = "yaar", age = 18) { }
   * Returns { params: ["name","age"], defaults: { age: <AST> } }
   */
  function parseParamList() {
    const params   = [];
    const defaults = {};
    if (peek().type !== TOKENS.RPAREN) {
      do {
        const paramName = consume(TOKENS.IDENT).value;
        params.push(paramName);
        if (peek().type === TOKENS.EQUAL) {
          consume(TOKENS.EQUAL);
          defaults[paramName] = parseExpression();
        }
        if (peek().type === TOKENS.COMMA) consume(TOKENS.COMMA);
        else break;
      } while (true);
    }
    return { params, defaults };
  }

  /**
   * Parse an argument list that supports spread: fn(a, ...arr, b)
   */
  function parseArgList() {
    const args = [];
    if (peek().type !== TOKENS.RPAREN) {
      do {
        if (peek().type === TOKENS.SPREAD) {
          consume(TOKENS.SPREAD);
          args.push({ type: "SpreadElement", argument: parseExpression() });
        } else {
          args.push(parseExpression());
        }
        if (peek().type === TOKENS.COMMA) consume(TOKENS.COMMA);
        else break;
      } while (true);
    }
    return args;
  }

  function parseFunction() {
    consume(TOKENS.FUNCTION);
    const name = consume(TOKENS.IDENT).value;

    consume(TOKENS.LPAREN);
    const { params, defaults } = parseParamList();
    consume(TOKENS.RPAREN);

    return { type: "FunctionDeclaration", name, params, defaults, body: parseBlock() };
  }

  function parseLet() {
    consume(TOKENS.LET);
    const name = consume(TOKENS.IDENT).value;
    consume(TOKENS.EQUAL);
    return { type: "VariableDeclaration", name, value: parseExpression() };
  }

  function parsePrint() {
    consume(TOKENS.PRINT);
    return { type: "PrintStatement", expression: parseExpression() };
  }

  function parseReturn() {
    consume(TOKENS.RETURN);
    return {
      type: "ReturnStatement",
      argument: peek().type === TOKENS.RBRACE ? null : parseExpression(),
    };
  }

  function parseClass() {
    consume(TOKENS.CLASS);
    const name = consume(TOKENS.IDENT).value;

    let parent = null;
    if (peek().type === TOKENS.EXTENDS) {
      consume(TOKENS.EXTENDS);
      parent = consume(TOKENS.IDENT).value;
    }
    consume(TOKENS.LBRACE);

    const methods = [];
    while (peek().type !== TOKENS.RBRACE) {
      if (peek().type !== TOKENS.FUNCTION) {
        throw new ParseError(
          `YEH KYA BAKWAAS HAI BC?? 🙏 — Bahubali ke darbaar mein sirf 'pov' methods allowed hain. Tu rogue statement lekar ghus aaya?? Kattappa ne bhi tujhse zyada samjha tha. NPC behavior fr fr. KICK OUT haramkhor`,
          peek().line,
          peek().column
        );
      }
      methods.push(parseFunction());
    }
    consume(TOKENS.RBRACE);

    return { type: "ClassDeclaration", name, parent, methods };
  }

  // ============================
  // EXPRESSIONS
  // ============================
  function parseExpression() {
    return parseAssignment();
  }

  function parseAssignment() {
    const left = parseTernary();   // Phase 3: ternary sits above assignment

    if (peek().type === TOKENS.EQUAL) {
      if (
        left.type !== "Identifier" &&
        left.type !== "MemberExpression" &&
        left.type !== "IndexExpression"
      ) {
        throw new ParseError("TU MOGAMBO HAI KYA BC?? 🙄 — galat cheez pe assign karna band kar saala. Yeh L-value nahi hai. Sigma males real variables pe assign karte hain. SKILL ISSUE. Jai ho nahi hoga aise", peek().line, peek().column);
      }
      consume(TOKENS.EQUAL);
      return {
        type: "AssignmentExpression",
        target: left,
        value: parseAssignment(),
      };
    }

    // Compound assignment: +=, -=, *=, /= (desugared to x = x op rhs)
    const compoundOps = {
      [TOKENS.PLUS_EQUAL]:  "PLUS",
      [TOKENS.MINUS_EQUAL]: "MINUS",
      [TOKENS.STAR_EQUAL]:  "STAR",
      [TOKENS.SLASH_EQUAL]: "SLASH",
    };
    const compoundOp = compoundOps[peek().type];
    if (compoundOp) {
      if (left.type !== "Identifier" && left.type !== "MemberExpression") {
        throw new ParseError("+= wahan nahi hota bhai 💥 — Tony Stark ne bhi Iron Man suit galat jagah nahi diya haramkhor. Itna bada L le raha hai. GigaChad move nahi tha yeh. Doosra L-value dhundh chutiye", peek().line, peek().column);
      }
      advance();
      return {
        type: "AssignmentExpression",
        target: left,
        value: {
          type: "BinaryExpression",
          operator: compoundOp,
          left,
          right: parseAssignment(),
        },
      };
    }

    return left;
  }

  // ── Phase 3: Ternary  condition ? consequent : alternate ─────────────────
  function parseTernary() {
    const node = parseOr();
    if (peek().type === TOKENS.QUESTION) {
      consume(TOKENS.QUESTION);
      const consequent = parseAssignment();   // right-assoc
      consume(TOKENS.COLON);
      const alternate  = parseAssignment();
      return { type: "TernaryExpression", condition: node, consequent, alternate };
    }
    return node;
  }

  function parseOr() {
    let node = parseAnd();
    while (peek().type === TOKENS.OR) {
      advance();
      node = { type: "BinaryExpression", operator: TOKENS.OR, left: node, right: parseAnd() };
    }
    return node;
  }

  function parseAnd() {
    let node = parseBitwise();
    while (peek().type === TOKENS.AND) {
      advance();
      node = { type: "BinaryExpression", operator: TOKENS.AND, left: node, right: parseBitwise() };
    }
    return node;
  }

  function parseBitwise() {
    let node = parseComparison();
    while (
      [TOKENS.BAND, TOKENS.BOR, TOKENS.BXOR, TOKENS.SHL, TOKENS.SHR, TOKENS.USHR].includes(
        peek().type
      )
    ) {
      const op = peek().type;
      advance();
      node = { type: "BinaryExpression", operator: op, left: node, right: parseComparison() };
    }
    return node;
  }

  function parseComparison() {
    let node = parseAddSubtract();
    while (
      [TOKENS.GREATER, TOKENS.LESS, TOKENS.GTE, TOKENS.LTE, TOKENS.EQEQ, TOKENS.NOTEQ].includes(
        peek().type
      )
    ) {
      const op = peek().type;
      advance();
      node = { type: "BinaryExpression", operator: op, left: node, right: parseAddSubtract() };
    }
    return node;
  }

  function parseAddSubtract() {
    let node = parseMultiplyDivide();
    while (peek().type === TOKENS.PLUS || peek().type === TOKENS.MINUS) {
      const op = peek().type;
      advance();
      node = { type: "BinaryExpression", operator: op, left: node, right: parseMultiplyDivide() };
    }
    return node;
  }

  function parseMultiplyDivide() {
    let node = parseUnary();
    while ([TOKENS.STAR, TOKENS.SLASH, TOKENS.MOD].includes(peek().type)) {
      const op = peek().type;
      advance();
      node = { type: "BinaryExpression", operator: op, left: node, right: parseUnary() };
    }
    return node;
  }

  function parseUnary() {
    if (
      peek().type === TOKENS.NOT ||
      peek().type === TOKENS.BNOT ||
      peek().type === TOKENS.MINUS  // unary minus: -99, -x
    ) {
      const op = peek().type;
      advance();
      return { type: "UnaryExpression", operator: op, argument: parseUnary() };
    }
    // Prefix ++
    if (peek().type === TOKENS.PLUS_PLUS) {
      advance();
      const target = parsePrimary();
      return {
        type: "AssignmentExpression",
        target,
        value: { type: "BinaryExpression", operator: "PLUS", left: target, right: { type: "NumberLiteral", value: 1 } },
      };
    }
    // Prefix --
    if (peek().type === TOKENS.MINUS_MINUS) {
      advance();
      const target = parsePrimary();
      return {
        type: "AssignmentExpression",
        target,
        value: { type: "BinaryExpression", operator: "MINUS", left: target, right: { type: "NumberLiteral", value: 1 } },
      };
    }
    return parsePrimary();
  }

  function parsePrimary() {
    let node;
    const token = peek();

    // Anonymous function expression: pov(params) { ... }
    if (token.type === TOKENS.FUNCTION) {
      consume(TOKENS.FUNCTION);
      consume(TOKENS.LPAREN);
      const { params, defaults } = parseParamList();
      consume(TOKENS.RPAREN);
      return { type: "FunctionExpression", params, defaults, body: parseBlock() };
    }

    // new ClassName(args)
    if (token.type === TOKENS.NEW) {
      consume(TOKENS.NEW);
      const className = consume(TOKENS.IDENT).value;
      consume(TOKENS.LPAREN);
      const args = parseArgList();
      consume(TOKENS.RPAREN);
      node = { type: "NewExpression", className, arguments: args };

    // ── Phase 3: JugaadMap object literal { key: value, ... } ───────────
    } else if (token.type === TOKENS.LBRACE) {
      advance(); // consume {
      const properties = [];
      while (peek().type !== TOKENS.RBRACE) {
        if (peek().type === TOKENS.EOF) {
          throw new ParseError("JugaadMap band nahi hua bc 🪛 — missing '}' saala", peek().line, peek().column);
        }
        // Spread inside object: { ...other }
        if (peek().type === TOKENS.SPREAD) {
          consume(TOKENS.SPREAD);
          properties.push({ spread: true, value: parseExpression() });
        } else {
          // Key: identifier, string, or number
          let key;
          if (peek().type === TOKENS.STRING) {
            key = String(consume(TOKENS.STRING).value);
          } else if (peek().type === TOKENS.NUMBER) {
            key = String(consume(TOKENS.NUMBER).value);
          } else {
            key = consume(TOKENS.IDENT).value;
          }
          consume(TOKENS.COLON);
          properties.push({ key, value: parseExpression() });
        }
        if (peek().type === TOKENS.COMMA) consume(TOKENS.COMMA);
        else break;
      }
      consume(TOKENS.RBRACE);
      node = { type: "ObjectLiteral", properties };

    // ── Phase 3: Template literal `Hello ${name}!` ───────────────────────
    } else if (token.type === TOKENS.TEMPLATE_LITERAL) {
      advance();
      // Each segment is either { type:"str", value } or { type:"expr", tokens:[...] }
      // Re-parse the expr segments using this same parser (named fn expression)
      const segments = token.value.map(seg => {
        if (seg.type === "str") return { type: "TemplateStr", value: seg.value };
        // Re-parse pre-lexed tokens — add synthetic EOF so parser terminates
        const withEof = [...seg.tokens, { type: TOKENS.EOF, value: null, line: 0, column: 0 }];
        const exprAst = parse(withEof);
        return { type: "TemplateExpr", expr: exprAst.body[0].expression };
      });
      node = { type: "TemplateLiteral", segments };

    // BakchodList literal: [1, 2, 3]
    } else if (token.type === TOKENS.LBRACKET) {
      advance();
      const elements = [];
      if (peek().type !== TOKENS.RBRACKET) {
        do {
          // Spread in arrays: [...arr, 4]
          if (peek().type === TOKENS.SPREAD) {
            consume(TOKENS.SPREAD);
            elements.push({ type: "SpreadElement", argument: parseExpression() });
          } else {
            elements.push(parseExpression());
          }
          if (peek().type === TOKENS.COMMA) consume(TOKENS.COMMA);
          else break;
        } while (true);
      }
      consume(TOKENS.RBRACKET);
      node = { type: "ArrayLiteral", elements };

    // buzurg (super)
    } else if (token.type === TOKENS.SUPER) {
      advance();
      node = { type: "SuperExpression" };

    } else if (token.type === TOKENS.NUMBER) {
      advance();
      node = { type: "NumberLiteral", value: token.value };
    } else if (token.type === TOKENS.STRING) {
      advance();
      node = { type: "StringLiteral", value: token.value };
    } else if (token.type === TOKENS.NULL) {
      advance();
      node = { type: "NullLiteral" };
    } else if (token.type === TOKENS.TRUE || token.type === TOKENS.FALSE) {
      advance();
      node = { type: "BooleanLiteral", value: token.type === TOKENS.TRUE };
    } else if (token.type === TOKENS.THIS) {
      advance();
      node = { type: "ThisExpression" };
    } else if (token.type === TOKENS.IDENT) {
      advance();
      node = { type: "Identifier", name: token.value };
    } else if (token.type === TOKENS.LPAREN) {
      advance();
      node = parseExpression();
      consume(TOKENS.RPAREN);
    } else {
      throw new ParseError(
        `'${token.value ?? token.type}' KYA HOTA HAI YAAR?? 🤔 — 3 Idiots ke Rancho ne bhi itna confusing kuch nahi padha bc. Yeh token toh Ohio ka rizzler hai — makes zero sense. L + ratio + no rizz + fell off. Raju bhaiya isko jail mein daalo`,
        token.line,
        token.column
      );
    }

    // POSTFIX: .property  ()call  [index]  ++  --
    while (true) {
      // Member access: obj.prop
      if (peek().type === TOKENS.DOT) {
        consume(TOKENS.DOT);
        node = {
          type: "MemberExpression",
          object: node,
          property: consume(TOKENS.IDENT).value,
        };
        continue;
      }
      // Index access: arr[i] or map["key"]
      if (peek().type === TOKENS.LBRACKET) {
        consume(TOKENS.LBRACKET);
        const idx = parseExpression();
        consume(TOKENS.RBRACKET);
        node = { type: "IndexExpression", object: node, index: idx };
        continue;
      }
      // Function call: fn(args) — supports spread
      if (peek().type === TOKENS.LPAREN) {
        consume(TOKENS.LPAREN);
        const args = parseArgList();
        consume(TOKENS.RPAREN);
        node = { type: "CallExpression", callee: node, arguments: args };
        continue;
      }
      // Postfix ++  (desugar: x++ → x = x + 1)
      if (peek().type === TOKENS.PLUS_PLUS) {
        advance();
        node = {
          type: "AssignmentExpression",
          target: node,
          value: { type: "BinaryExpression", operator: "PLUS", left: node, right: { type: "NumberLiteral", value: 1 } },
        };
        break;
      }
      // Postfix --  (desugar: x-- → x = x - 1)
      if (peek().type === TOKENS.MINUS_MINUS) {
        advance();
        node = {
          type: "AssignmentExpression",
          target: node,
          value: { type: "BinaryExpression", operator: "MINUS", left: node, right: { type: "NumberLiteral", value: 1 } },
        };
        break;
      }
      break;
    }

    return node;
  }

  return parseProgram();
};
