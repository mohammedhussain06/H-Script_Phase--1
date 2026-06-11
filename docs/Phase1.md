# Phase 1 – Core Interpreter

## Goal of Phase 1
Build a minimal but complete programming language pipeline:
lexer → parser → AST → interpreter.

Focus was correctness and learning, not syntax perfection.

---

## Language Capabilities

### Core
- Variables (`let`)
- Expressions (arithmetic, logical, comparison)
- Control flow (`if`, `else`, `while`, `for`)
- Functions
- Closures
- Recursion

### Object Oriented Programming
- Classes
- Objects
- `this`
- Method calls
- Encapsulation via `_private` convention
- Polymorphism (dynamic dispatch)
- Single inheritance (`extends`)

---

## Interpreter Model
- Tree-walk interpreter
- Lexical scoping
- Prototype-based object model
- Environments implemented via JS prototype chain

---

## Phase 1 Limitations (All resolved in later phases)
- ~~No module system~~ → **Implemented** (Phase 3 — `import_karo`)
- ~~No standard library~~ → **Implemented** (Phase 3 — 27 stdlib functions)
- ~~No error recovery~~ → **Implemented** (Phase 3 — `agar_risk` / `pakad_lo`)
- ~~`super` not implemented~~ → **Implemented** (Phase 3 — `buzurg` keyword)
- ~~Grammar not finalized~~ → **Finalized** (Phase 2)
- ~~Syntax inconsistencies~~ → **Resolved** (Phase 2 rewrite)

---

## Why Phase 1 Ends Here
Phase 1 proves:
- The model works
- OOP is possible
- The language is expressive enough

Further progress requires redesigning grammar and runtime rules.

Phase 2 will introduce breaking changes.
