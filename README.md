# H Script (Phase 1)

H Script is a small interpreted programming language built from scratch as a learning project.
Phase 1 focuses on making the language **work end-to-end**, not on perfect syntax or advanced optimizations.

This phase covers the full pipeline:
lexer → parser → AST → interpreter.

---

## What is implemented in Phase 1

- Lexer (tokenizer)
- Recursive-descent parser
- AST generation
- Tree-walk interpreter
- Block-scoped environments
- Variables and assignments
- Expressions (arithmetic, logical, comparison)
- Control flow (`if`, `while`, `for`)
- Functions and closures
- Classes and objects
- Basic Object-Oriented Programming

---

## Folder Structure

src/
├── lexer.js // Converts source code to tokens
├── parser.js // Converts tokens into AST
├── interpreter.js // Executes the AST
├── tokens.js // Token definitions
├── ast.js // Empty (reserved for Phase 2)
├── errors.js // Empty (reserved for Phase 2)
└── utils.js // Empty (reserved for Phase 2)

## Language Syntax 

function add(a, b) {
  return a + b
}

print(add(2, 3))

Example of a function, it also supports closures 

## Control Flow

if (x > 5) {
  print("big")
} else {
  print("small")
}

while (x < 10) {
  x = x + 1
}

## Object Oriented Programming
### Class and Object 

class BankAccount {
  function init(balance) {
    this.balance = balance
  }

  function deposit(amount) {
    this.balance = this.balance + amount
  }

  function getBalance() {
    return this.balance
  }
}

let acc = new BankAccount()
acc.init(100)
acc.deposit(50)
print(acc.getBalance())

OOP Support (Phase 1)

1. Encapsulation
   Properties starting with _ are treated as private and can only be accessed inside class methods.

2. Abstraction
   Classes expose behavior through methods.

3. Polymorphism
   Method calls are resolved dynamically based on the object.

4. Inheritance
   Single inheritance using extends.

Example: 

class Animal {
  function speak() {
    return "sound"
  }
}

class Dog extends Animal {}

let d = new Dog()
print(d.speak())

## Interpreter Design 

HScript uses a tree-walk interpreter with lexical scoping 

Source Code
→ Tokens
→ AST
→ Interpreter

## Phase 1 Status

Phase 1 is functionally complete.
The language works, supports OOP basics, and can run non-trivial programs.

Future phases will redesign syntax and improve the language model.


