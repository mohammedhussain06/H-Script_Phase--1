const { RuntimeError } = require("./errors.js");
const stdlib = require("./utils.js");

/**
 * createSession() — returns a persistent interpreter session.
 * The same globalEnv and classes dict are reused across multiple run() calls.
 * This is what the REPL uses so variables persist between lines.
 */
function createSession() {
  const globalEnv = {};
  const classes = {};
  let currentEnv = globalEnv;
  let insideMethod = false;

  // Inject standard library into global environment
  for (const [name, fn] of Object.entries(stdlib)) {
    globalEnv[name] = fn;
  }

  // ============================
  // VALUE FORMATTING
  // ============================
  function formatValue(value) {
    if (value === null || value === undefined) return "null";
    if (Array.isArray(value)) {
      return `BakchodList [ ${value.map(formatValue).join(", ")} ]`;
    }
    if (typeof value === "object" && value.type === "FunctionValue")   return "<pov>";
    if (typeof value === "object" && value.type === "NativeFunction") return `<native: ${value.name}>`;
    return String(value);
  }

  // ============================
  // ENVIRONMENT
  // ============================
  function lookupVariable(name, env) {
    if (env === null || env === undefined) {
      throw new RuntimeError(`'${name}' tujhe dekh ke hi bhaag gaya 👻 — BSDK yeh variable exist hi nahi karta, jaise Lagaan mein angrezi officer ka dimaag. NO BITCHES?? NO VARIABLE?? let_him_cook se declare kar pehle haramkhor`);
    }
    if (Object.prototype.hasOwnProperty.call(env, name)) {
      return env[name];
    }
    return lookupVariable(name, Object.getPrototypeOf(env));
  }

  function assignVariable(name, value, env) {
    if (env === null || env === undefined) {
      throw new RuntimeError(`'${name}' assign karna chahta hai?? TU NPC HAI KYA BC 🤷 — DDLJ mein Raj bhi seedha train nahi pakad leta tha saala. Pehle let_him_cook se declare kar THEN assign kar. Skill issue`);
    }
    if (Object.prototype.hasOwnProperty.call(env, name)) {
      env[name] = value;
      return value;
    }
    return assignVariable(name, value, Object.getPrototypeOf(env));
  }

  // ============================
  // DISPATCH
  // ============================
  function evaluate(node) {
    switch (node.type) {
      case "Program":
        return evaluateProgram(node);

      case "BlockStatement":
        return evaluateBlock(node);

      case "VariableDeclaration":
        return evaluateVariableDeclaration(node);

      case "AssignmentExpression":
        return evaluateAssignment(node);

      case "PrintStatement": {
        const value = evaluate(node.expression);
        if (value?.type === "FunctionValue" || value?.type === "NativeFunction") {
          throw new RuntimeError("TU PHOEBE BUFFAY SE BHI ZYADA CONFUSED HAI BC 🙊 — boliye() ko poora function diya?? '() lagao' sunne mein nahi aata?? L + ratio + skill issue. Print kar function ka RESULT, function ko nahi chutiye");
        }
        // null prints as "null"; arrays print as BakchodList; everything else uses Node's default
        if (value === null || value === undefined) {
          console.log("null");
        } else if (Array.isArray(value)) {
          console.log(formatValue(value));
        } else {
          console.log(value);
        }
        return;
      }

      case "NumberLiteral":
      case "BooleanLiteral":
      case "StringLiteral":
        return node.value;

      case "NullLiteral":
        return null;

      case "Identifier":
        return lookupVariable(node.name, currentEnv);

      case "ThisExpression":
        return currentEnv.this ?? null;

      case "SuperExpression":
        // Valid only when accessed via buzurg.method() — intercepted in evaluateCall
        throw new RuntimeError("'buzurg' bolta hai: 'MAIN TUMHARA BAAP HOON!' 👴♥️ — Darth Vader ki tarah sirf announce karta hai saala, kaam nahi karta standalone. buzurg.method() se bulao bc. Ohio rizz level galti hai yeh");

      case "BinaryExpression":
        return evaluateBinary(node);

      case "UnaryExpression":
        return evaluateUnary(node);

      case "IfStatement":
        return evaluateIf(node);

      case "WhileStatement":
        return evaluateWhile(node);

      case "ForStatement":
        return evaluateFor(node);

      case "ExpressionStatement":
        return evaluate(node.expression);

      case "BreakStatement":
        return { type: "BREAK" };

      case "ContinueStatement":
        return { type: "CONTINUE" };

      case "ReturnStatement":
        return {
          type: "RETURN",
          value: node.argument ? evaluate(node.argument) : null,
        };

      case "FunctionDeclaration": {
        const fn = {
          type: "FunctionValue",
          params: node.params,
          body: node.body,
          closureEnv: null,
          ownerClass: null,
        };
        currentEnv[node.name] = fn;
        fn.closureEnv = currentEnv; // recursion-safe self-reference
        return;
      }

      case "FunctionExpression":
        return {
          type: "FunctionValue",
          params: node.params,
          body: node.body,
          closureEnv: currentEnv,
          ownerClass: null,
        };

      case "ArrayLiteral":
        return evaluateArrayLiteral(node);

      case "IndexExpression":
        return evaluateIndex(node);

      case "CallExpression":
        return evaluateCall(node);

      case "MemberExpression":
        return evaluateMember(node);

      case "ClassDeclaration":
        return evaluateClass(node);

      case "NewExpression":
        return evaluateNew(node);

      default:
        throw new RuntimeError("H-Script ne kaha: 'Yeh AST node toh KGF Chapter 3 jaisi hai — exist nahi karti!' 🫥 BSDK " + node.type + " is NOT the vibe. Rocky bhai bhi confuse ho gaye. Skibidi toilet level mistake hai yeh");
    }
  }

  // ============================
  // PROGRAM / BLOCK
  // ============================
  function evaluateProgram(node) {
    // First pass: register all classes so they can reference each other
    for (const stmt of node.body) {
      if (stmt.type === "ClassDeclaration") evaluate(stmt);
    }
    // Second pass: execute everything else
    for (const stmt of node.body) {
      if (stmt.type !== "ClassDeclaration") evaluate(stmt);
    }
  }

  function evaluateBlock(node) {
    const previousEnv = currentEnv;
    const blockEnv = Object.create(previousEnv);
    currentEnv = blockEnv;

    for (const stmt of node.body) {
      const result = evaluate(stmt);
      // Propagate control-flow signals — be precise to avoid FunctionValue false positives
      if (
        result?.type === "BREAK" ||
        result?.type === "CONTINUE" ||
        result?.type === "RETURN"
      ) {
        currentEnv = previousEnv;
        return result;
      }
    }

    currentEnv = previousEnv;
  }

  // ============================
  // VARIABLES
  // ============================
  function evaluateVariableDeclaration(node) {
    currentEnv[node.name] = evaluate(node.value);
  }

  function evaluateAssignment(node) {
    const value = evaluate(node.value);

    if (node.target.type === "Identifier") {
      return assignVariable(node.target.name, value, currentEnv);
    }

    if (node.target.type === "MemberExpression") {
      const obj = evaluate(node.target.object);
      const prop = node.target.property;
      if (prop.startsWith("_") && !insideMethod) {
        throw new RuntimeError(`Private property ko haath lagaya CAUGHT IN 4K 📸 — '${prop}' squad-exclusive VIP area hai jaise Amitabh Bachchan ka vanity van saala. Bahar reh haramkhor. Touch grass, not private props`);
      }
      obj[prop] = value;
      return value;
    }

    if (node.target.type === "IndexExpression") {
      const arr = evaluate(node.target.object);
      const idx = evaluate(node.target.index);
      if (!Array.isArray(arr)) {
        throw new RuntimeError("BHAI [] sirf BakchodList pe kaam karta hai 💨 — Tu Pushpa ki tarah 'main jhukunga nahi' bol raha hai but indexing rules pe toh jhukna padega bc. Yeh array nahi hai, NPC move tha yeh saala");
      }
      arr[idx] = value;
      return value;
    }

    throw new RuntimeError("Assignment ka yeh scene Vikram Vedha se bhi zyada confusing hai BSDK 💩 — Target completely invalid, Vikram bhi nahi samjha yeh kya tha. L + ratio + fell off");
  }

  // ============================
  // EXPRESSIONS
  // ============================
  function evaluateUnary(node) {
    const v = evaluate(node.argument);
    if (node.operator === "NOT")   return !v;
    if (node.operator === "BNOT")  return ~v;
    if (node.operator === "MINUS") return -v;
  }

  function evaluateBinary(node) {
    const l = evaluate(node.left);
    const r = evaluate(node.right);

    switch (node.operator) {
      case "PLUS":    return l + r;
      case "MINUS":   return l - r;
      case "STAR":    return l * r;
      case "SLASH":
        if (r === 0) throw new RuntimeError("RATIO ATTEMPT FAILED BSDK 🫣 — Division by zero?! Bhai Thanos ke 6 infinity stones bhi yeh fix nahi kar sakte. Mathematically galat, spiritually galat, aur tu bhi galat. SKILL ISSUE OF THE CENTURY");
        return l / r;
      case "MOD":     return l % r;

      case "GREATER": return l > r;
      case "LESS":    return l < r;
      case "GTE":     return l >= r;
      case "LTE":     return l <= r;
      case "EQEQ":    return l === r;
      case "NOTEQ":   return l !== r;

      case "AND":     return l && r;
      case "OR":      return l || r;

      case "BAND":    return l & r;
      case "BOR":     return l | r;
      case "BXOR":    return l ^ r;
      case "SHL":     return l << r;
      case "SHR":     return l >> r;
      case "USHR":    return l >>> r;
    }
  }

  // ============================
  // CONTROL FLOW
  // ============================
  function evaluateIf(node) {
    const cond = evaluate(node.condition);
    const branch = cond ? node.thenBlock : node.elseBlock;
    if (!branch) return;
    return evaluate(branch);
  }

  function evaluateWhile(node) {
    while (evaluate(node.condition)) {
      const result = evaluate(node.body);
      if (result?.type === "BREAK")    return;
      if (result?.type === "CONTINUE") continue;
      if (result?.type === "RETURN")   return result;
    }
  }

  function evaluateFor(node) {
    evaluate(node.init);
    while (evaluate(node.condition)) {
      const result = evaluate(node.body);
      if (result?.type === "BREAK")  return;
      if (result?.type === "RETURN") return result;
      if (result?.type === "CONTINUE") {
        evaluate(node.update); // still run i++ before next iteration
        continue;
      }
      evaluate(node.update);
    }
  }

  // ============================
  // BAKCHODLIST (Arrays)
  // ============================
  function evaluateArrayLiteral(node) {
    return node.elements.map((el) => evaluate(el));
  }

  function evaluateIndex(node) {
    const obj = evaluate(node.object);
    const idx = evaluate(node.index);
    if (!Array.isArray(obj)) {
      throw new RuntimeError("SAALA [] sirf BakchodList ke liye hai 😩 — Tu Spider-Man No Way Home ki tarah wrong universe mein ghus gaya bc. Yeh array nahi hai. GigaChad move nahi tha yeh. Slay differently haramkhor");
    }
    const result = obj[idx];
    return result !== undefined ? result : null;
  }

  // ============================
  // FUNCTIONS
  // ============================
  function evaluateCall(node) {
    // ── SUPER CALL: buzurg.method(args) ──────────────────────────────────
    if (
      node.callee.type === "MemberExpression" &&
      node.callee.object.type === "SuperExpression"
    ) {
      return evaluateSuperCall(node.callee.property, node.arguments);
    }

    let fn;
    let thisValue = null;

    if (node.callee.type === "MemberExpression") {
      const obj = evaluate(node.callee.object);
      const prop = node.callee.property;

      // ── BakchodList built-in method calls ──────────────────────────────
      if (Array.isArray(obj)) {
        const args = node.arguments.map((a) => evaluate(a));
        switch (prop) {
          case "daalo":      obj.push(args[0] ?? null); return null;         // push
          case "nikalo":     return obj.pop() ?? null;                       // pop
          case "jodo":       return obj.concat(Array.isArray(args[0]) ? args[0] : [args[0]]); // concat
          case "palat":      obj.reverse(); return null;                     // reverse in-place
          case "sort_karo":  obj.sort((a, b) => a - b); return null;        // sort numerically
          case "milao":      return obj.join(args[0] ?? ", ");               // join to string
          case "slice_karo": return obj.slice(args[0], args[1]);             // slice
          case "dhundo":     return obj.indexOf(args[0]);                    // indexOf (-1 if not found)
          default:
            throw new RuntimeError(`BakchodList bol raha hai 'I don't know her, who is she??' 🙅 — '${prop}' method hai hi nahi bc. Yeh array hai Avengers team nahi ki sab kuch support kare saala. L + ratio`);
        }
      }

      if (obj === null || obj === undefined) {
        throw new RuntimeError(`Bhai .${prop}() null pe call kar raha hai?? TU BRAIN WORMS KA SHIKAAR HAI BC 💥 — Yeh Inception ka dream nahi hai jahan kuch bhi possible ho. NULL ka koi ghar nahi, koi method nahi, koi rizz nahi. Ghar ja saala`);
      }

      fn = obj[prop];
      thisValue = obj;
    } else {
      fn = evaluate(node.callee);
    }

    // ── Native stdlib function ────────────────────────────────────────────
    if (fn?.type === "NativeFunction") {
      const args = node.arguments.map((a) => evaluate(a));
      return fn.fn(args);
    }

    // ── H-Script function ─────────────────────────────────────────────────
    if (!fn || fn.type !== "FunctionValue") {
      const name =
        node.callee.type === "MemberExpression"
          ? node.callee.property
          : node.callee.name ?? "unknown";
      throw new RuntimeError(`'${name}' function nahi hai BSDK 🤡 — Yeh Vijay Deverakonda coded hai — all looks, no callable, no rizz. L + ratio + no function + fell off. Define karo ya sahi naam use karo haramkhor`);
    }

    const args = node.arguments.map((a) => evaluate(a));
    const previousEnv = currentEnv;
    const callEnv = Object.create(fn.closureEnv);
    callEnv.this = thisValue;
    callEnv.__class__ = fn.ownerClass ?? null; // for buzurg (super) resolution
    currentEnv = callEnv;

    for (let i = 0; i < fn.params.length; i++) {
      callEnv[fn.params[i]] = args[i] ?? null;
    }

    const prevInsideMethod = insideMethod;
    if (thisValue !== null) insideMethod = true;
    const result = evaluateBlock(fn.body);
    insideMethod = prevInsideMethod;
    currentEnv = previousEnv;

    if (result?.type === "RETURN") return result.value;
    return null;
  }

  function evaluateSuperCall(methodName, argNodes) {
    const thisObj = currentEnv.this;
    const className = currentEnv.__class__;

    if (!className) {
      throw new RuntimeError("'buzurg' class ke bahar?? BSDK YEH KYA HAI 🦾 — Baahubali 2 ke climax se bhi bada betrayal hai yeh. Kattappa confirm karta hai: squad method ke andar hi kaam karta hai buzurg, bahar nahi. Skill issue fr fr");
    }

    const classDef = classes[className];
    if (!classDef?.parent) {
      throw new RuntimeError(`Squad '${className}' bata raha hai 'Mera koi baap nahi!' 💔 — BC Simba bhi jaanta tha ki Lion King important hota hai saala. nepo_baby_of lagao pehle THEN buzurg call karo. NPC behavior on god`);
    }

    const parentClass = classes[classDef.parent];
    const method = parentClass?.methods[methodName];
    if (!method) {
      throw new RuntimeError(
        `Parent class '${classDef.parent}' ke paas '${methodName}' nahi hai bc 🙅 — buzurg ne check kiya aur bola 'Not my problem beta, wrong method name hai tera.' Sahi naam likh haramkhor`
      );
    }

    const args = argNodes.map((a) => evaluate(a));
    const previousEnv = currentEnv;
    const callEnv = Object.create(method.closureEnv);
    callEnv.this = thisObj;
    callEnv.__class__ = classDef.parent; // allow chained super calls
    currentEnv = callEnv;

    for (let i = 0; i < method.params.length; i++) {
      callEnv[method.params[i]] = args[i] ?? null;
    }

    const prevInsideMethod = insideMethod;
    insideMethod = true;
    const result = evaluateBlock(method.body);
    insideMethod = prevInsideMethod;
    currentEnv = previousEnv;

    if (result?.type === "RETURN") return result.value;
    return null;
  }

  // ============================
  // OOP
  // ============================
  function evaluateClass(node) {
    const methods = {};
    for (const m of node.methods) {
      methods[m.name] = {
        type: "FunctionValue",
        params: m.params,
        body: m.body,
        closureEnv: currentEnv,
        ownerClass: node.name,  // needed for buzurg (super) resolution
      };
    }
    classes[node.name] = {
      methods,
      parent: node.parent || null,
    };
  }

  function evaluateNew(node) {
    const classDef = classes[node.className];
    if (!classDef) {
      throw new RuntimeError(`'${node.className}'?? KABHI SUNA HI NAHI SAALA 💅 — Voldemort bhi is class ka naam nahi jaanta bc. Mogambo is khushi mein khush NAHI hoga. squad se define kar pehle haramkhor. Fanum tax on your undefined class`);
    }

    const instance = {};
    const proto = {};

    // Build inheritance chain from root → child so child overrides parent
    const chain = [];
    let curr = classDef;
    while (curr) {
      chain.push(curr.methods);
      curr = curr.parent ? classes[curr.parent] : null;
    }
    for (let i = chain.length - 1; i >= 0; i--) {
      Object.assign(proto, chain[i]);
    }
    Object.setPrototypeOf(instance, proto);

    // Auto-call init (constructor) if it exists, passing new() args
    if (instance.init) {
      const fn = instance.init;
      const args = node.arguments.map((a) => evaluate(a));
      const previousEnv = currentEnv;
      const callEnv = Object.create(fn.closureEnv);
      callEnv.this = instance;
      callEnv.__class__ = fn.ownerClass ?? null;
      currentEnv = callEnv;

      for (let i = 0; i < fn.params.length; i++) {
        callEnv[fn.params[i]] = args[i] ?? null;
      }

      const prevInsideMethod = insideMethod;
      insideMethod = true;
      evaluateBlock(fn.body);
      insideMethod = prevInsideMethod;
      currentEnv = previousEnv;
    }

    return instance;
  }

  function evaluateMember(node) {
    const obj = evaluate(node.object);
    const prop = node.property;

    // BakchodList property access (non-method)
    if (Array.isArray(obj)) {
      if (prop === "lambai") return obj.length;
      if (prop === "pehla")  return obj.length > 0 ? obj[0] : null;
      if (prop === "aakhri") return obj.length > 0 ? obj[obj.length - 1] : null;
      // Numeric string index e.g. arr.0 (unusual, but fallback)
      return obj[prop] ?? null;
    }

    if (obj === null || obj === undefined) {
      throw new RuntimeError(`'${prop}' null pe access karna?? TU CHUTIYA HAI KYA BC 😭 — Yeh ZNMD ka road trip nahi hai jahan sab kuch possible ho. Null object ka koi property nahi hota saala. Pehle null check kar NPC`);
    }

    // Private property enforcement
    if (prop.startsWith("_") && !insideMethod) {
      throw new RuntimeError(`'${prop}' is PRIVATE PROPERTY bc 🔒 — CAUGHT IN 4K trying to access this. Yeh James Bond ka MI6 HQ hai, tu Mission Impossible wala tha kya saala? Squad-exclusive zone. Bahar teri aukat nahi. L + ratio`);
    }

    const result = obj[prop];
    return result !== undefined ? result : null;
  }

  // Public API for this session
  return {
    run(ast) { return evaluate(ast); },
    env: globalEnv,
  };
}

/**
 * Default export: interpreter(ast)
 * Creates a fresh session for each call — used by testrunner.js.
 */
function interpreter(ast) {
  return createSession().run(ast);
}

interpreter.createSession = createSession;
module.exports = interpreter;
