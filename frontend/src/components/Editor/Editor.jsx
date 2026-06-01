import React, { useRef, useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { registerHScript } from './hscript-monaco.js'
import './Editor.css'

export default function Editor({ value, onChange, readOnly = false }) {
  const editorRef = useRef(null)
  const [loading, setLoading] = useState(true)

  const handleMount = (editor, monaco) => {
    editorRef.current = editor
    registerHScript(monaco)
    monaco.editor.setTheme('hscript-dark')
    editor.focus()
    setLoading(false)
  }

  return (
    <div className="editor-wrapper">
      {loading && (
        <div className="editor-skeleton">
          {[80, 60, 90, 50, 70, 45, 85, 55, 65, 40].map((w, i) => (
            <div key={i} className="editor-skeleton__line" style={{ width: `${w}%`, animationDelay: `${i * 60}ms` }} />
          ))}
        </div>
      )}
      <MonacoEditor
        height="100%"
        language="hscript"
        theme="hscript-dark"
        value={value}
        onChange={onChange}
        onMount={handleMount}
        options={{
          fontSize:              14,
          fontFamily:            '"JetBrains Mono", "Fira Code", monospace',
          fontLigatures:         true,
          lineHeight:            1.7,
          minimap:               { enabled: false },
          scrollBeyondLastLine:  false,
          wordWrap:              'on',
          tabSize:               2,
          renderWhitespace:      'selection',
          smoothScrolling:       true,
          cursorBlinking:        'phase',
          cursorSmoothCaretAnimation: 'on',
          bracketPairColorization: { enabled: true },
          padding:               { top: 16, bottom: 16 },
          readOnly,
          automaticLayout:       true,
          suggest:               { showKeywords: true },
          quickSuggestions:      true,
        }}
      />
    </div>
  )
}
