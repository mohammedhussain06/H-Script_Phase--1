/**
 * H-Script Phase 2 — AST Node Registry
 * Factory functions for every AST node type in the language.
 * Serves as authoritative documentation for the AST structure.
 * The parser & interpreter both use these shapes (implicitly).
 */

const AST = {
  // ── Top-level ────────────────────────────────────────────────────────────
  Program:            (body)                          => ({ type: "Program", body }),

  // ── Statements ───────────────────────────────────────────────────────────
  BlockStatement:     (body)                          => ({ type: "BlockStatement", body }),
  VariableDeclaration:(name, value)                   => ({ type: "VariableDeclaration", name, value }),
  PrintStatement:     (expression)                    => ({ type: "PrintStatement", expression }),
  ExpressionStatement:(expression)                    => ({ type: "ExpressionStatement", expression }),
  IfStatement:        (condition, thenBlock, elseBlock) => ({ type: "IfStatement", condition, thenBlock, elseBlock }),
  WhileStatement:     (condition, body)               => ({ type: "WhileStatement", condition, body }),
  ForStatement:       (init, condition, update, body) => ({ type: "ForStatement", init, condition, update, body }),
  BreakStatement:     ()                              => ({ type: "BreakStatement" }),
  ContinueStatement:  ()                              => ({ type: "ContinueStatement" }),
  ReturnStatement:    (argument)                      => ({ type: "ReturnStatement", argument }),

  // ── Declarations ─────────────────────────────────────────────────────────
  FunctionDeclaration:(name, params, body)            => ({ type: "FunctionDeclaration", name, params, body }),
  ClassDeclaration:   (name, parent, methods)         => ({ type: "ClassDeclaration", name, parent, methods }),

  // ── Expressions ──────────────────────────────────────────────────────────
  AssignmentExpression:(target, value)                => ({ type: "AssignmentExpression", target, value }),
  BinaryExpression:   (operator, left, right)         => ({ type: "BinaryExpression", operator, left, right }),
  UnaryExpression:    (operator, argument)            => ({ type: "UnaryExpression", operator, argument }),
  CallExpression:     (callee, args)                  => ({ type: "CallExpression", callee, arguments: args }),
  MemberExpression:   (object, property)              => ({ type: "MemberExpression", object, property }),
  IndexExpression:    (object, index)                 => ({ type: "IndexExpression", object, index }),
  NewExpression:      (className, args)               => ({ type: "NewExpression", className, arguments: args }),
  FunctionExpression: (params, body)                  => ({ type: "FunctionExpression", params, body }),

  // ── Literals ─────────────────────────────────────────────────────────────
  NumberLiteral:      (value)                         => ({ type: "NumberLiteral", value }),
  StringLiteral:      (value)                         => ({ type: "StringLiteral", value }),
  BooleanLiteral:     (value)                         => ({ type: "BooleanLiteral", value }),
  NullLiteral:        ()                              => ({ type: "NullLiteral" }),
  ArrayLiteral:       (elements)                      => ({ type: "ArrayLiteral", elements }),

  // ── Identifiers & Special ─────────────────────────────────────────────────
  Identifier:         (name)                          => ({ type: "Identifier", name }),
  ThisExpression:     ()                              => ({ type: "ThisExpression" }),
  SuperExpression:    ()                              => ({ type: "SuperExpression" }),
};

module.exports = AST;
