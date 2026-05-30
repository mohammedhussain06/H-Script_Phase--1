/**
 * H-Script Phase 2/3 — AST Node Registry
 * Factory functions for every AST node type in the language.
 * Serves as authoritative documentation for the AST structure.
 * The parser & interpreter both use these shapes (implicitly).
 */

const AST = {
  // ── Top-level ────────────────────────────────────────────────────────────
  Program:            (body)                                    => ({ type: "Program", body }),

  // ── Statements ───────────────────────────────────────────────────────────
  BlockStatement:     (body)                                    => ({ type: "BlockStatement", body }),
  VariableDeclaration:(name, value)                             => ({ type: "VariableDeclaration", name, value }),
  PrintStatement:     (expression)                              => ({ type: "PrintStatement", expression }),
  ExpressionStatement:(expression)                              => ({ type: "ExpressionStatement", expression }),
  IfStatement:        (condition, thenBlock, elseBlock)         => ({ type: "IfStatement", condition, thenBlock, elseBlock }),
  WhileStatement:     (condition, body)                         => ({ type: "WhileStatement", condition, body }),
  ForStatement:       (init, condition, update, body)           => ({ type: "ForStatement", init, condition, update, body }),
  BreakStatement:     ()                                        => ({ type: "BreakStatement" }),
  ContinueStatement:  ()                                        => ({ type: "ContinueStatement" }),
  ReturnStatement:    (argument)                                => ({ type: "ReturnStatement", argument }),

  // ── Phase 3 Statements ───────────────────────────────────────────────────
  TryCatchStatement:  (tryBlock, catchVar, catchBlock, finallyBlock) =>
    ({ type: "TryCatchStatement", tryBlock, catchVar, catchBlock, finallyBlock }),
  ThrowStatement:     (argument)                                => ({ type: "ThrowStatement", argument }),

  // ── Phase 4 ──────────────────────────────────────────────────────────────
  ImportStatement:    (path)                                    => ({ type: "ImportStatement", path }),

  // ── Declarations ─────────────────────────────────────────────────────────
  FunctionDeclaration:(name, params, defaults, body)            => ({ type: "FunctionDeclaration", name, params, defaults, body }),
  ClassDeclaration:   (name, parent, methods)                   => ({ type: "ClassDeclaration", name, parent, methods }),

  // ── Expressions ──────────────────────────────────────────────────────────
  AssignmentExpression:(target, value)                          => ({ type: "AssignmentExpression", target, value }),
  BinaryExpression:   (operator, left, right)                   => ({ type: "BinaryExpression", operator, left, right }),
  UnaryExpression:    (operator, argument)                      => ({ type: "UnaryExpression", operator, argument }),
  CallExpression:     (callee, args)                            => ({ type: "CallExpression", callee, arguments: args }),
  MemberExpression:   (object, property)                        => ({ type: "MemberExpression", object, property }),
  IndexExpression:    (object, index)                           => ({ type: "IndexExpression", object, index }),
  NewExpression:      (className, args)                         => ({ type: "NewExpression", className, arguments: args }),
  FunctionExpression: (params, defaults, body)                  => ({ type: "FunctionExpression", params, defaults, body }),

  // ── Phase 3 Expressions ──────────────────────────────────────────────────
  TernaryExpression:  (condition, consequent, alternate)        => ({ type: "TernaryExpression", condition, consequent, alternate }),
  ObjectLiteral:      (properties)                              => ({ type: "ObjectLiteral", properties }),
  TemplateLiteral:    (segments)                                => ({ type: "TemplateLiteral", segments }),
  SpreadElement:      (argument)                                => ({ type: "SpreadElement", argument }),

  // ── Literals ─────────────────────────────────────────────────────────────
  NumberLiteral:      (value)                                   => ({ type: "NumberLiteral", value }),
  StringLiteral:      (value)                                   => ({ type: "StringLiteral", value }),
  BooleanLiteral:     (value)                                   => ({ type: "BooleanLiteral", value }),
  NullLiteral:        ()                                        => ({ type: "NullLiteral" }),
  ArrayLiteral:       (elements)                                => ({ type: "ArrayLiteral", elements }),

  // ── Identifiers & Special ─────────────────────────────────────────────────
  Identifier:         (name)                                    => ({ type: "Identifier", name }),
  ThisExpression:     ()                                        => ({ type: "ThisExpression" }),
  SuperExpression:    ()                                        => ({ type: "SuperExpression" }),
};

module.exports = AST;
