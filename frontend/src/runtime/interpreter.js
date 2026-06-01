// H-Script Interpreter — ES Module version for browser runtime
// Removed: fs, path, process.cwd() — lele (import) throws a browser-friendly error
import { RuntimeError, ThrowError } from './errors.js';
import stdlib from './utils.js';
import lexer  from './lexer.js';
import parse  from './parser.js';

function createSession() {
  const globalEnv = {};
  const classes   = {};
  let currentEnv    = globalEnv;
  let insideMethod  = false;

  for (const [name, fn] of Object.entries(stdlib)) {
    globalEnv[name] = fn;
  }

  function isJugaadMap(val) {
    return (val !== null && typeof val === "object" && !Array.isArray(val) &&
      val.type !== "FunctionValue" && val.type !== "NativeFunction" &&
      Object.getPrototypeOf(val) === Object.prototype);
  }

  function formatValue(value) {
    if (value === null || value === undefined) return "null";
    if (Array.isArray(value)) return `BakchodList [ ${value.map(formatValue).join(", ")} ]`;
    if (typeof value === "object" && value.type === "FunctionValue") return "<pov>";
    if (typeof value === "object" && value.type === "NativeFunction") return `<native: ${value.name}>`;
    if (isJugaadMap(value)) return `JugaadMap { ${Object.entries(value).map(([k,v]) => `${k}: ${formatValue(v)}`).join(", ")} }`;
    return String(value);
  }

  function evalArgs(argNodes) {
    const args = [];
    for (const argNode of argNodes) {
      if (argNode.type === "SpreadElement") {
        const val = evaluate(argNode.argument);
        if (Array.isArray(val)) args.push(...val); else args.push(val);
      } else { args.push(evaluate(argNode)); }
    }
    return args;
  }

  function callFn(fn, args) {
    if (fn?.type === "NativeFunction") return fn.fn(args);
    if (!fn || fn.type !== "FunctionValue") throw new RuntimeError("forEach_karo/map_karo expects a pov function bc 🤡");
    const previousEnv = currentEnv;
    const callEnv = Object.create(fn.closureEnv);
    callEnv.__class__ = fn.ownerClass ?? null;
    for (let i = 0; i < fn.params.length; i++) {
      const arg = args[i];
      if ((arg === undefined || arg === null) && fn.defaults && fn.defaults[fn.params[i]] !== undefined) {
        const savedEnv = currentEnv; currentEnv = fn.closureEnv;
        callEnv[fn.params[i]] = evaluate(fn.defaults[fn.params[i]]);
        currentEnv = savedEnv;
      } else { callEnv[fn.params[i]] = arg ?? null; }
    }
    currentEnv = callEnv;
    const result = evaluateBlock(fn.body);
    currentEnv = previousEnv;
    if (result?.type === "RETURN") return result.value;
    return null;
  }

  function lookupVariable(name, env) {
    if (env === null || env === undefined)
      throw new RuntimeError(`'${name}' tujhe dekh ke hi bhaag gaya 👻 — yeh variable exist hi nahi karta bc. let_him_cook se declare kar pehle`);
    if (Object.prototype.hasOwnProperty.call(env, name)) return env[name];
    return lookupVariable(name, Object.getPrototypeOf(env));
  }

  function assignVariable(name, value, env) {
    if (env === null || env === undefined)
      throw new RuntimeError(`'${name}' assign karna chahta hai?? TU NPC HAI KYA BC 🤷 — pehle let_him_cook se declare kar`);
    if (Object.prototype.hasOwnProperty.call(env, name)) { env[name] = value; return value; }
    return assignVariable(name, value, Object.getPrototypeOf(env));
  }

  function evaluate(node) {
    switch (node.type) {
      case "Program":              return evaluateProgram(node);
      case "BlockStatement":       return evaluateBlock(node);
      case "VariableDeclaration":  return evaluateVariableDeclaration(node);
      case "AssignmentExpression": return evaluateAssignment(node);
      case "PrintStatement": {
        const value = evaluate(node.expression);
        if (value?.type === "FunctionValue" || value?.type === "NativeFunction")
          throw new RuntimeError("TU PHOEBE BUFFAY SE BHI ZYADA CONFUSED HAI BC 🙊 — boliye() ko poora function diya?? '() lagao' saala");
        if (value === null || value === undefined) console.log("null");
        else if (Array.isArray(value)) console.log(formatValue(value));
        else if (isJugaadMap(value)) console.log(formatValue(value));
        else console.log(value);
        return;
      }
      case "NumberLiteral":
      case "BooleanLiteral":
      case "StringLiteral":        return node.value;
      case "NullLiteral":          return null;
      case "Identifier":           return lookupVariable(node.name, currentEnv);
      case "ThisExpression":       return currentEnv.this ?? null;
      case "SuperExpression":      throw new RuntimeError("'buzurg' standalone nahi chalti — buzurg.method() se bulao bc 👴");
      case "BinaryExpression":     return evaluateBinary(node);
      case "UnaryExpression":      return evaluateUnary(node);
      case "IfStatement":          return evaluateIf(node);
      case "WhileStatement":       return evaluateWhile(node);
      case "ForStatement":         return evaluateFor(node);
      case "ExpressionStatement":  return evaluate(node.expression);
      case "BreakStatement":       return { type: "BREAK" };
      case "ContinueStatement":    return { type: "CONTINUE" };
      case "ReturnStatement":      return { type: "RETURN", value: node.argument ? evaluate(node.argument) : null };
      case "FunctionDeclaration": {
        const fn = { type: "FunctionValue", params: node.params, defaults: node.defaults || {}, body: node.body, closureEnv: null, ownerClass: null };
        currentEnv[node.name] = fn; fn.closureEnv = currentEnv; return;
      }
      case "FunctionExpression":   return { type: "FunctionValue", params: node.params, defaults: node.defaults || {}, body: node.body, closureEnv: currentEnv, ownerClass: null };
      case "ArrayLiteral":         return evaluateArrayLiteral(node);
      case "IndexExpression":      return evaluateIndex(node);
      case "CallExpression":       return evaluateCall(node);
      case "MemberExpression":     return evaluateMember(node);
      case "ClassDeclaration":     return evaluateClass(node);
      case "NewExpression":        return evaluateNew(node);
      case "TryCatchStatement":    return evaluateTryCatch(node);
      case "ThrowStatement":       return evaluateThrow(node);
      case "ImportStatement":
        throw new RuntimeError("lele (import) is not supported in the browser IDE bhai 🌐 — use the Node.js REPL for multi-file projects.");
      case "TernaryExpression":    return evaluate(node.condition) ? evaluate(node.consequent) : evaluate(node.alternate);
      case "ObjectLiteral":        return evaluateObjectLiteral(node);
      case "TemplateLiteral":      return evaluateTemplateLiteral(node);
      default:
        throw new RuntimeError("H-Script ne kaha: yeh AST node exist nahi karta! 🫥 " + node.type);
    }
  }

  function evaluateProgram(node) {
    for (const stmt of node.body) if (stmt.type === "ClassDeclaration") evaluate(stmt);
    for (const stmt of node.body) if (stmt.type !== "ClassDeclaration") evaluate(stmt);
  }

  function evaluateBlock(node) {
    const previousEnv = currentEnv;
    const blockEnv = Object.create(previousEnv);
    currentEnv = blockEnv;
    for (const stmt of node.body) {
      const result = evaluate(stmt);
      if (result?.type === "BREAK" || result?.type === "CONTINUE" || result?.type === "RETURN") {
        currentEnv = previousEnv; return result;
      }
    }
    currentEnv = previousEnv;
  }

  function evaluateVariableDeclaration(node) { currentEnv[node.name] = evaluate(node.value); }

  function evaluateAssignment(node) {
    const value = evaluate(node.value);
    if (node.target.type === "Identifier") return assignVariable(node.target.name, value, currentEnv);
    if (node.target.type === "MemberExpression") {
      const obj = evaluate(node.target.object);
      const prop = node.target.property;
      if (prop.startsWith("_") && !insideMethod)
        throw new RuntimeError(`Private property '${prop}' — CAUGHT IN 4K 📸 — squad ke andar hi access karo bc`);
      obj[prop] = value; return value;
    }
    if (node.target.type === "IndexExpression") {
      const obj = evaluate(node.target.object);
      const idx = evaluate(node.target.index);
      if (Array.isArray(obj) || (obj !== null && typeof obj === "object")) { obj[idx] = value; return value; }
      throw new RuntimeError("BHAI [] assignment sirf BakchodList aur JugaadMap pe hota hai bc 💥");
    }
    throw new RuntimeError("Assignment target invalid hai BSDK 💩");
  }

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
        if (r === 0) throw new RuntimeError("RATIO ATTEMPT FAILED BSDK 🫣 — Division by zero! Thanos ke stones bhi yeh fix nahi kar sakte. SKILL ISSUE.");
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

  function evaluateIf(node) {
    if (evaluate(node.condition)) return evaluate(node.thenBlock);
    else if (node.elseBlock) return evaluate(node.elseBlock);
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
      if (result?.type === "CONTINUE") { evaluate(node.update); continue; }
      evaluate(node.update);
    }
  }

  function evaluateTryCatch(node) {
    try {
      return evaluate(node.tryBlock);
    } catch (err) {
      if (node.catchBlock) {
        const previousEnv = currentEnv;
        const catchEnv = Object.create(currentEnv);
        if (node.catchVar) {
          catchEnv[node.catchVar] = (err instanceof ThrowError) ? err.thrownValue : (err.message || String(err));
        }
        currentEnv = catchEnv;
        const result = evaluateBlock(node.catchBlock);
        currentEnv = previousEnv;
        return result;
      }
    } finally {
      if (node.finallyBlock) evaluate(node.finallyBlock);
    }
  }

  function evaluateThrow(node) { throw new ThrowError(evaluate(node.argument)); }

  function evaluateArrayLiteral(node) {
    const result = [];
    for (const el of node.elements) {
      if (el.type === "SpreadElement") {
        const val = evaluate(el.argument);
        if (!Array.isArray(val)) throw new RuntimeError("BSDK spread sirf BakchodList pe hota hai 🪣");
        result.push(...val);
      } else { result.push(evaluate(el)); }
    }
    return result;
  }

  function evaluateIndex(node) {
    const obj = evaluate(node.object);
    const idx = evaluate(node.index);
    if (Array.isArray(obj)) { const r = obj[idx]; return r !== undefined ? r : null; }
    if (obj !== null && typeof obj === "object") { const r = obj[idx]; return r !== undefined ? r : null; }
    throw new RuntimeError("SAALA [] sirf BakchodList aur JugaadMap ke liye hai 😩");
  }

  function evaluateObjectLiteral(node) {
    const obj = {};
    for (const prop of node.properties) {
      if (prop.spread) { const v = evaluate(prop.value); if (v && typeof v === "object" && !Array.isArray(v)) Object.assign(obj, v); }
      else obj[prop.key] = evaluate(prop.value);
    }
    return obj;
  }

  function evaluateTemplateLiteral(node) {
    return node.segments.map(seg => {
      if (seg.type === "TemplateStr") return seg.value;
      const val = evaluate(seg.expr);
      if (val === null || val === undefined) return "null";
      if (Array.isArray(val)) return formatValue(val);
      if (isJugaadMap(val)) return formatValue(val);
      return String(val);
    }).join("");
  }

  function evaluateCall(node) {
    if (node.callee.type === "MemberExpression" && node.callee.object.type === "SuperExpression")
      return evaluateSuperCall(node.callee.property, node.arguments);

    let fn, thisValue = null;
    if (node.callee.type === "MemberExpression") {
      const obj  = evaluate(node.callee.object);
      const prop = node.callee.property;
      if (Array.isArray(obj)) {
        const args = evalArgs(node.arguments);
        switch (prop) {
          case "daalo":        obj.push(args[0] ?? null); return null;
          case "nikalo":       return obj.pop() ?? null;
          case "jodo":         return obj.concat(Array.isArray(args[0]) ? args[0] : [args[0]]);
          case "palat":        obj.reverse(); return null;
          case "sort_karo":    obj.sort((a, b) => a - b); return null;
          case "milao":        return obj.join(args[0] ?? ", ");
          case "slice_karo":   return obj.slice(args[0], args[1]);
          case "dhundo":       return obj.indexOf(args[0]);
          case "forEach_karo": { const cb = args[0]; for (let i = 0; i < obj.length; i++) callFn(cb, [obj[i], i, obj]); return null; }
          case "map_karo":     { const cb = args[0]; const m = []; for (let i = 0; i < obj.length; i++) m.push(callFn(cb, [obj[i], i, obj])); return m; }
          case "filter_karo":  { const cb = args[0]; const f = []; for (let i = 0; i < obj.length; i++) if (callFn(cb, [obj[i], i, obj])) f.push(obj[i]); return f; }
          case "reduce_karo":  { const cb = args[0]; let acc = args[1] ?? null; for (let i = 0; i < obj.length; i++) acc = callFn(cb, [acc, obj[i], i, obj]); return acc; }
          case "koi_bhi":      { const cb = args[0]; for (const item of obj) if (callFn(cb, [item])) return true; return false; }
          case "sab_sahi":     { const cb = args[0]; for (const item of obj) if (!callFn(cb, [item])) return false; return true; }
          case "dhundo_karo":  { const cb = args[0]; for (const item of obj) if (callFn(cb, [item])) return item; return null; }
          default: throw new RuntimeError(`BakchodList ko '${prop}' method nahi pata bc 🙅 — method exist nahi karta. L + ratio`);
        }
      }
      if (obj === null || obj === undefined)
        throw new RuntimeError(`Bhai .${prop}() null pe call kar raha hai?? TU BRAIN WORMS KA SHIKAAR HAI BC 💥`);
      fn = obj[prop]; thisValue = obj;
    } else { fn = evaluate(node.callee); }

    if (fn?.type === "NativeFunction") return fn.fn(evalArgs(node.arguments));
    if (!fn || fn.type !== "FunctionValue") {
      const name = node.callee.type === "MemberExpression" ? node.callee.property : node.callee.name ?? "unknown";
      throw new RuntimeError(`'${name}' function nahi hai BSDK 🤡 — define karo ya sahi naam use karo`);
    }

    const args = evalArgs(node.arguments);
    const previousEnv = currentEnv;
    const callEnv = Object.create(fn.closureEnv);
    callEnv.this = thisValue;
    callEnv.__class__ = fn.ownerClass ?? null;
    currentEnv = callEnv;

    for (let i = 0; i < fn.params.length; i++) {
      const arg = args[i];
      if ((arg === undefined || arg === null) && fn.defaults && fn.defaults[fn.params[i]] !== undefined) {
        const savedEnv = currentEnv; currentEnv = fn.closureEnv;
        callEnv[fn.params[i]] = evaluate(fn.defaults[fn.params[i]]);
        currentEnv = savedEnv;
      } else { callEnv[fn.params[i]] = arg ?? null; }
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
    if (!className) throw new RuntimeError("'buzurg' class ke bahar?? BSDK — squad method ke andar hi kaam karta hai buzurg 🦾");
    const classDef = classes[className];
    if (!classDef?.parent) throw new RuntimeError(`Squad '${className}' bata raha hai 'Mera koi baap nahi!' 💔 — nepo_baby_of lagao pehle`);
    const parentClass = classes[classDef.parent];
    const method = parentClass?.methods[methodName];
    if (!method) throw new RuntimeError(`Parent class '${classDef.parent}' ke paas '${methodName}' nahi hai bc 🙅`);
    const args = evalArgs(argNodes);
    const previousEnv = currentEnv;
    const callEnv = Object.create(method.closureEnv);
    callEnv.this = thisObj; callEnv.__class__ = classDef.parent;
    currentEnv = callEnv;
    for (let i = 0; i < method.params.length; i++) callEnv[method.params[i]] = args[i] ?? null;
    const prevInsideMethod = insideMethod; insideMethod = true;
    const result = evaluateBlock(method.body);
    insideMethod = prevInsideMethod; currentEnv = previousEnv;
    if (result?.type === "RETURN") return result.value;
    return null;
  }

  function evaluateClass(node) {
    const methods = {};
    for (const m of node.methods) {
      methods[m.name] = { type: "FunctionValue", params: m.params, defaults: m.defaults || {}, body: m.body, closureEnv: currentEnv, ownerClass: node.name };
    }
    classes[node.name] = { methods, parent: node.parent || null };
  }

  function evaluateNew(node) {
    const classDef = classes[node.className];
    if (!classDef) throw new RuntimeError(`'${node.className}'?? KABHI SUNA HI NAHI SAALA 💅 — squad se define kar pehle`);
    const instance = {}, proto = {};
    const chain = [];
    let curr = classDef;
    while (curr) { chain.push(curr.methods); curr = curr.parent ? classes[curr.parent] : null; }
    for (let i = chain.length - 1; i >= 0; i--) Object.assign(proto, chain[i]);
    Object.setPrototypeOf(instance, proto);
    if (instance.init) {
      const fn = instance.init;
      const args = evalArgs(node.arguments);
      const previousEnv = currentEnv;
      const callEnv = Object.create(fn.closureEnv);
      callEnv.this = instance; callEnv.__class__ = fn.ownerClass ?? null;
      currentEnv = callEnv;
      for (let i = 0; i < fn.params.length; i++) callEnv[fn.params[i]] = args[i] ?? null;
      const prevInsideMethod = insideMethod; insideMethod = true;
      evaluateBlock(fn.body);
      insideMethod = prevInsideMethod; currentEnv = previousEnv;
    }
    return instance;
  }

  function evaluateMember(node) {
    const obj = evaluate(node.object);
    const prop = node.property;
    if (Array.isArray(obj)) {
      if (prop === "lambai") return obj.length;
      if (prop === "pehla")  return obj.length > 0 ? obj[0] : null;
      if (prop === "aakhri") return obj.length > 0 ? obj[obj.length - 1] : null;
      return obj[prop] ?? null;
    }
    if (obj === null || obj === undefined)
      throw new RuntimeError(`'${prop}' null pe access karna?? TU CHUTIYA HAI KYA BC 😭 — null check kar NPC`);
    if (prop.startsWith("_") && !insideMethod && !isJugaadMap(obj))
      throw new RuntimeError(`'${prop}' is PRIVATE PROPERTY bc 🔒 — CAUGHT IN 4K. Squad-exclusive zone.`);
    const result = obj[prop];
    return result !== undefined ? result : null;
  }

  return { run(ast) { return evaluate(ast); }, env: globalEnv };
}

export default function interpreter(ast) {
  return createSession().run(ast);
}
