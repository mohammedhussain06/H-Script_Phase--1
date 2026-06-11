import React, { useState, useRef, useEffect } from 'react'
import { agentChat, generateCode } from '../../api/ai'
import NeuralCanvas from './NeuralCanvas'
import './AIPanel.css'

export default function AIPanel({ isOpen, onClose, editorCode, onInsertCode, onApplyFix }) {
  const [tab, setTab]             = useState('chat')
  const [chatInput, setChatInput] = useState('')
  const [genInput, setGenInput]   = useState('')
  const [messages, setMessages]   = useState([
    { role: 'assistant', content: 'Namaste bhai! 🙏 Main H-Script AI assistant hoon. Poocho kuch bhi — code samjhao, fix karo, ya generate karo!' }
  ])
  const [history, setHistory]     = useState([])
  const [loading, setLoading]     = useState(false)
  const [genResult, setGenResult] = useState(null)
  const [genLoading, setGenLoading] = useState(false)
  const messagesEndRef            = useRef(null)
  const textareaRef               = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleChat(e) {
    e?.preventDefault()
    if (!chatInput.trim() || loading) return
    const userMsg = chatInput.trim()
    setChatInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    try {
      const res = await agentChat(userMsg, editorCode, history)
      setHistory(res.history)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.reply,
        action: res.action,
        result: res.result,
      }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Yaar kuch gadbad ho gayi AI ke saath 😅 Thodi der baad try karo.' }])
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate(e) {
    e?.preventDefault()
    if (!genInput.trim() || genLoading) return
    setGenLoading(true)
    setGenResult(null)
    try {
      const res = await generateCode(genInput.trim(), editorCode)
      setGenResult(res)
    } catch {
      setGenResult({ code: '', explanation: 'AI se connect nahi ho paya 😅' })
    } finally {
      setGenLoading(false)
    }
  }

  function renderContent(content) {
    const parts = content.split(/(```[\s\S]*?```)/g)
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const code = part.replace(/^```[a-z]*\n?/, '').replace(/```$/, '')
        return <pre key={i} className="aipanel__code-block"><code>{code}</code></pre>
      }
      return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>
    })
  }

  if (!isOpen) return null

  return (
    <div className="aipanel" id="ai-panel">

      {/* ── Hero Header with Three.js ─────────────────────── */}
      <div className="aipanel__hero">
        <NeuralCanvas isThinking={loading || genLoading} />
        <div className="aipanel__hero-content">
          <div className="aipanel__hero-icon">✦</div>
          <div>
            <div className="aipanel__hero-title">AI Assistant</div>
            <div className="aipanel__hero-sub">
              {loading || genLoading ? (
                <span className="aipanel__hero-thinking">
                  <span className="aipanel__hero-dot" /><span className="aipanel__hero-dot" /><span className="aipanel__hero-dot" />
                  Thinking...
                </span>
              ) : (
                <span>Powered by Llama 3.1 · Groq</span>
              )}
            </div>
          </div>
        </div>
        <button className="aipanel__close" onClick={onClose} id="ai-panel-close">✕</button>
      </div>

      {/* ── Tabs ─────────────────────────────────────────── */}
      <div className="aipanel__tabs">
        <button className={`aipanel__tab ${tab === 'chat' ? 'active' : ''}`} onClick={() => setTab('chat')} id="ai-tab-chat">
          <span>💬</span> Chat
        </button>
        <button className={`aipanel__tab ${tab === 'generate' ? 'active' : ''}`} onClick={() => setTab('generate')} id="ai-tab-generate">
          <span>⚡</span> Generate
        </button>
      </div>

      {/* ── CHAT TAB ─────────────────────────────────────── */}
      {tab === 'chat' && (
        <>
          <div className="aipanel__messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`aipanel__msg aipanel__msg--${msg.role}`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="aipanel__msg-avatar">
                  {msg.role === 'assistant'
                    ? <span className="aipanel__ai-avatar">✦</span>
                    : <span className="aipanel__user-avatar">you</span>
                  }
                </div>
                <div className="aipanel__msg-body">
                  <div className="aipanel__msg-content">
                    {renderContent(msg.content)}
                  </div>
                  {msg.action === 'fix' && msg.result?.suggestion && (
                    <button
                      className="aipanel__accept-btn"
                      onClick={() => onApplyFix && onApplyFix(msg.result.suggestion)}
                      id={`accept-fix-${i}`}
                    >
                      ✓ Accept Fix
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {loading && (
              <div className="aipanel__msg aipanel__msg--assistant aipanel__msg--thinking">
                <div className="aipanel__msg-avatar">
                  <span className="aipanel__ai-avatar aipanel__ai-avatar--pulse">✦</span>
                </div>
                <div className="aipanel__msg-body">
                  <div className="aipanel__thinking-wave">
                    <span /><span /><span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips */}
          <div className="aipanel__chips">
            {[
              { icon: '🔍', label: 'Explain', msg: 'Explain my current code' },
              { icon: '🔧', label: 'Fix',     msg: 'Fix my code' },
              { icon: '❓', label: 'Error',   msg: 'What does this error mean?' },
            ].map(chip => (
              <button
                key={chip.label}
                className="aipanel__chip"
                onClick={() => { setChatInput(chip.msg); textareaRef.current?.focus() }}
              >
                {chip.icon} {chip.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <form className="aipanel__input-area" onSubmit={handleChat}>
            <textarea
              ref={textareaRef}
              className="aipanel__textarea"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleChat(e) }}
              placeholder="Poocho kuch bhi... (Enter to send)"
              rows={2}
              disabled={loading}
              id="ai-chat-input"
            />
            <button
              type="submit"
              className={`aipanel__send-btn ${loading ? 'loading' : ''}`}
              disabled={loading || !chatInput.trim()}
              id="ai-send-btn"
            >
              {loading ? <span className="aipanel__spin">⟳</span> : '↑'}
            </button>
          </form>
        </>
      )}

      {/* ── GENERATE TAB ─────────────────────────────────── */}
      {tab === 'generate' && (
        <div className="aipanel__generate">
          <div className="aipanel__gen-hero">
            <div className="aipanel__gen-icon">⚡</div>
            <div className="aipanel__gen-tagline">Describe it, get H-Script</div>
          </div>

          <form onSubmit={handleGenerate} className="aipanel__gen-form">
            <textarea
              className="aipanel__textarea aipanel__textarea--gen"
              value={genInput}
              onChange={e => setGenInput(e.target.value)}
              placeholder={`e.g. "write a function that adds two numbers"\ne.g. "loop from 1 to 10, print even ones"`}
              rows={4}
              disabled={genLoading}
              id="ai-gen-input"
            />
            <button
              type="submit"
              className={`aipanel__gen-btn ${genLoading ? 'loading' : ''}`}
              disabled={genLoading || !genInput.trim()}
              id="ai-gen-submit"
            >
              {genLoading
                ? <><span className="aipanel__spin">⟳</span> Generating...</>
                : <><span>⚡</span> Generate H-Script</>
              }
            </button>
          </form>

          {genResult && (
            <div className="aipanel__gen-result">
              {genResult.code && (
                <>
                  <div className="aipanel__gen-code-header">
                    <span>Generated Code</span>
                    <button
                      className="aipanel__insert-btn"
                      onClick={() => onInsertCode && onInsertCode(genResult.code)}
                      id="ai-insert-code"
                    >
                      ↗ Insert into Editor
                    </button>
                  </div>
                  <pre className="aipanel__code-block aipanel__code-block--result">
                    <code>{genResult.code}</code>
                  </pre>
                </>
              )}
              {genResult.explanation && (
                <p className="aipanel__gen-explanation">{genResult.explanation}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
