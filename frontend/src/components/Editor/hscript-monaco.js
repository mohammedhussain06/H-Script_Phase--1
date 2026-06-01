/**
 * hscript-monaco.js
 * Registers H-Script as a Monaco Editor language:
 *  - Syntax highlighting (tokenizer)
 *  - Autocomplete suggestions
 *  - Dark cyberpunk theme
 */

import { getKeywords } from '../../runtime/index.js'

export function registerHScript(monaco) {
  // ── 1. Register language ──────────────────────────────
  monaco.languages.register({ id: 'hscript', extensions: ['.hs'] })

  // ── 2. Tokenizer (syntax highlighting) ───────────────
  monaco.languages.setMonarchTokensProvider('hscript', {
    keywords: [
      'let_him_cook', 'boliye', 'agar', 'warna', 'baaki_sab',
      'pov', 'wapas_karo', 'squad', 'new', 'this', 'buzurg',
      'nepo_baby_of', 'baar_baar', 'jab_tak_doomscroll',
      'nikal_lo', 'skip_karo', 'no_cap', 'fraud',
      'agar_risk', 'pakad_lo', 'jo_bhi_hai_bhaad_me_jaaye',
      'jhel_isko', 'lele',
    ],
    stdlib: [
      'lambai', 'upperCase', 'lowerCase', 'trim_karo', 'split_karo',
      'includes_kya', 'parseInt_karo', 'parseFloat_karo', 'isNaN_kya',
      'typeOf', 'powerOf', 'squareRoot', 'absValue', 'roundKaro',
      'floorKaro', 'ceilKaro', 'max', 'min', 'random_soch',
      'keys_nikalo', 'values_nikalo', 'hasKey_kya',
    ],
    hof: [
      'forEach_karo', 'map_karo', 'filter_karo', 'reduce_karo',
      'koi_bhi', 'sab_sahi', 'dhundo_karo', 'dhundo',
      'daalo', 'nikalo', 'jodo', 'palat', 'sort_karo', 'milao',
      'slice_karo', 'pehla', 'aakhri',
    ],
    tokenizer: {
      root: [
        // Comments
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],

        // Template literals
        [/`/, 'string', '@template'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string_double'],
        [/'([^'\\]|\\.)*$/, 'string.invalid'],
        [/'/, 'string', '@string_single'],

        // Numbers
        [/\d+(\.\d+)?/, 'number'],

        // Identifiers / keywords
        [/[a-zA-Z_$][\w$]*/, {
          cases: {
            '@keywords': 'keyword',
            '@stdlib':   'type',
            '@hof':      'variable.predefined',
            '@default':  'identifier',
          }
        }],

        // Operators
        [/[+\-*/%]=?/, 'operator'],
        [/[<>!]=?/, 'operator'],
        [/==|!=|&&|\|\|/, 'operator'],
        [/\.{3}/, 'operator'],
        [/[?:.]/, 'operator'],

        // Punctuation
        [/[{}()\[\];,]/, 'delimiter'],

        // Whitespace
        [/\s+/, 'white'],
      ],

      comment: [
        [/[^/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment'],
      ],

      template: [
        [/\$\{/, 'delimiter.bracket', '@template_expr'],
        [/[^`$\\]+/, 'string'],
        [/`/, 'string', '@pop'],
        [/./, 'string'],
      ],

      template_expr: [
        [/\}/, 'delimiter.bracket', '@pop'],
        { include: 'root' },
      ],

      string_double: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, 'string', '@pop'],
      ],

      string_single: [
        [/[^\\']+/, 'string'],
        [/\\./, 'string.escape'],
        [/'/, 'string', '@pop'],
      ],
    }
  })

  // ── 3. Autocomplete ───────────────────────────────────
  monaco.languages.registerCompletionItemProvider('hscript', {
    provideCompletionItems: (model, position) => {
      const word  = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber:   position.lineNumber,
        startColumn:     word.startColumn,
        endColumn:       word.endColumn,
      }

      const keywords = getKeywords().map(k => ({
        label:            k,
        kind:             monaco.languages.CompletionItemKind.Keyword,
        insertText:       k,
        range,
      }))

      const snippets = [
        {
          label: 'let_him_cook',
          kind:  monaco.languages.CompletionItemKind.Snippet,
          insertText: 'let_him_cook ${1:name} = ${2:value}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Declare a variable',
          range,
        },
        {
          label: 'pov',
          kind:  monaco.languages.CompletionItemKind.Snippet,
          insertText: 'pov ${1:name}(${2:params}) {\n\t${3:// body}\n\twapas_karo ${4:null}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Define a function',
          range,
        },
        {
          label: 'squad',
          kind:  monaco.languages.CompletionItemKind.Snippet,
          insertText: 'squad ${1:ClassName} {\n\tpov init(${2:params}) {\n\t\t${3:// constructor}\n\t}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Define a class',
          range,
        },
        {
          label: 'agar',
          kind:  monaco.languages.CompletionItemKind.Snippet,
          insertText: 'agar (${1:condition}) {\n\t${2:// body}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'If statement',
          range,
        },
        {
          label: 'agar_risk',
          kind:  monaco.languages.CompletionItemKind.Snippet,
          insertText: 'agar_risk {\n\t${1:// try body}\n} pakad_lo (${2:err}) {\n\t${3:// catch body}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Try/catch block',
          range,
        },
        {
          label: 'baar_baar',
          kind:  monaco.languages.CompletionItemKind.Snippet,
          insertText: 'baar_baar (let_him_cook ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${3:// body}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'For loop',
          range,
        },
        {
          label: 'map_karo',
          kind:  monaco.languages.CompletionItemKind.Snippet,
          insertText: '.map_karo(pov(${1:item}) { wapas_karo ${2:item} })',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Map array',
          range,
        },
        {
          label: 'filter_karo',
          kind:  monaco.languages.CompletionItemKind.Snippet,
          insertText: '.filter_karo(pov(${1:item}) { wapas_karo ${2:condition} })',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Filter array',
          range,
        },
      ]

      return { suggestions: [...keywords, ...snippets] }
    }
  })

  // ── 4. Cyberpunk dark theme ───────────────────────────
  monaco.editor.defineTheme('hscript-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword',             foreground: 'a78bfa', fontStyle: 'bold' },
      { token: 'type',                foreground: '22d3ee' },
      { token: 'variable.predefined', foreground: 'f97316' },
      { token: 'string',              foreground: '86efac' },
      { token: 'string.escape',       foreground: 'fcd34d' },
      { token: 'number',              foreground: 'fb923c' },
      { token: 'comment',             foreground: '4a4a6a', fontStyle: 'italic' },
      { token: 'operator',            foreground: '94a3b8' },
      { token: 'delimiter',           foreground: '64748b' },
      { token: 'identifier',          foreground: 'e2e8f0' },
    ],
    colors: {
      'editor.background':           '#0a0a12',
      'editor.foreground':           '#e2e8f0',
      'editor.lineHighlightBackground': '#111122',
      'editorCursor.foreground':     '#a78bfa',
      'editor.selectionBackground':  '#7c3aed33',
      'editorLineNumber.foreground': '#2a2a4a',
      'editorLineNumber.activeForeground': '#a78bfa',
      'editorIndentGuide.background': '#1a1a2a',
      'editorBracketMatch.background': '#a78bfa22',
      'editorBracketMatch.border':   '#a78bfa',
      'scrollbar.shadow':            '#00000000',
      'scrollbarSlider.background':  '#7c3aed33',
      'scrollbarSlider.hoverBackground': '#7c3aed55',
    }
  })
}
