// HeroScene.js — Cyberpunk Digital Rain + Circuit Grid
// Full canvas 2D — no Three.js needed for this effect

const CHARS_BINARY   = '01'
const CHARS_HEX      = '0123456789ABCDEF'
const CHARS_SYMBOLS  = '{}[]()<>|/\\;:!@#$%^&*=+-~`'
const HSCRIPT_WORDS  = [
  'let_him_cook', 'boliye', 'agar', 'pov', 'no_cap', 'wapas_karo',
  'squad', 'lele', 'fraud', 'jhel_isko', 'map_karo', 'filter_karo',
  'baar_baar', 'buzurg', 'reduce_karo', 'no_cap', 'nepo_baby_of',
]

// Neon color palette
const RAIN_COLORS = {
  lead:    '#ffffff',
  primary: '#00ff41',  // Matrix green
  cyan:    '#00e5ff',
  purple:  '#a855f7',
  orange:  '#f97316',
  dim:     'rgba(0,255,65,0.15)',
}

export function initHeroScene(canvas) {
  const ctx = canvas.getContext('2d')
  let W = canvas.clientWidth
  let H = canvas.clientHeight
  canvas.width  = W
  canvas.height = H

  const FONT_SIZE = 14
  const COLS      = Math.floor(W / FONT_SIZE)

  // ── Column state ───────────────────────────────────────
  class Column {
    constructor(x) {
      this.x      = x
      this.y      = -(Math.random() * H)       // start above screen
      this.speed  = 1 + Math.random() * 2.5
      this.length = 8 + Math.floor(Math.random() * 20)
      this.chars  = []
      this.mode   = Math.random()              // 0=binary, 0.4=hex, 0.7=keyword
      this.color  = this._pickColor()
      this.keyword       = null
      this.keywordTimer  = 0
      this._genChars()
    }

    _pickColor() {
      const r = Math.random()
      if (r < 0.55) return RAIN_COLORS.primary
      if (r < 0.75) return RAIN_COLORS.cyan
      if (r < 0.90) return RAIN_COLORS.purple
      return RAIN_COLORS.orange
    }

    _randChar() {
      if (this.mode < 0.5) {
        return CHARS_BINARY[Math.floor(Math.random() * CHARS_BINARY.length)]
      } else if (this.mode < 0.8) {
        return CHARS_HEX[Math.floor(Math.random() * CHARS_HEX.length)]
      } else {
        return CHARS_SYMBOLS[Math.floor(Math.random() * CHARS_SYMBOLS.length)]
      }
    }

    _genChars() {
      this.chars = Array.from({ length: this.length }, () => this._randChar())
    }

    update() {
      this.y += this.speed
      // Randomly mutate a char
      if (Math.random() < 0.12) {
        const idx = Math.floor(Math.random() * this.chars.length)
        this.chars[idx] = this._randChar()
      }
      // Keyword flash
      if (this.keywordTimer > 0) {
        this.keywordTimer--
      } else if (Math.random() < 0.003) {
        this.keyword     = HSCRIPT_WORDS[Math.floor(Math.random() * HSCRIPT_WORDS.length)]
        this.keywordTimer = 60
      }
      // Reset when off-screen
      if (this.y - this.length * FONT_SIZE > H) {
        this.y      = -Math.random() * H * 0.5
        this.speed  = 1 + Math.random() * 2.5
        this.length = 8 + Math.floor(Math.random() * 20)
        this.mode   = Math.random()
        this.color  = this._pickColor()
        this.keyword = null
        this._genChars()
      }
    }

    draw(ctx) {
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`

      // Draw each char in the trail
      for (let i = this.chars.length - 1; i >= 0; i--) {
        const cy    = this.y - i * FONT_SIZE
        if (cy < -FONT_SIZE || cy > H + FONT_SIZE) continue

        const alpha = (1 - i / this.chars.length) * 0.85

        if (i === 0) {
          // Leading char — bright white with glow
          ctx.shadowBlur  = 12
          ctx.shadowColor = this.color
          ctx.fillStyle   = RAIN_COLORS.lead
        } else if (i === 1) {
          ctx.shadowBlur  = 8
          ctx.shadowColor = this.color
          ctx.fillStyle   = this.color
        } else {
          ctx.shadowBlur  = 0
          ctx.shadowColor = 'transparent'
          // parse color and add alpha
          ctx.fillStyle   = hexWithAlpha(this.color, alpha * 0.7)
        }

        ctx.fillText(this.chars[i], this.x, cy)
      }

      // Keyword flash — bright label beside column
      if (this.keyword && this.keywordTimer > 0) {
        const ky    = this.y - Math.floor(this.chars.length / 2) * FONT_SIZE
        const fade  = this.keywordTimer / 60
        ctx.shadowBlur  = 20
        ctx.shadowColor = RAIN_COLORS.orange
        ctx.fillStyle   = `rgba(249,115,22,${fade * 0.9})`
        ctx.font        = `bold ${FONT_SIZE}px "JetBrains Mono", monospace`
        ctx.fillText(this.keyword, this.x + FONT_SIZE * 1.5, ky)
        ctx.font        = `${FONT_SIZE}px "JetBrains Mono", monospace`
      }

      ctx.shadowBlur = 0
    }
  }

  // ── Grid (circuit board background) ───────────────────
  function drawGrid() {
    const spacing = 40
    ctx.strokeStyle = 'rgba(0,229,255,0.035)'
    ctx.lineWidth   = 0.5
    ctx.shadowBlur  = 0
    for (let x = 0; x < W; x += spacing) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, H)
      ctx.stroke()
    }
    for (let y = 0; y < H; y += spacing) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(W, y)
      ctx.stroke()
    }
    // Corner dots at intersections
    ctx.fillStyle = 'rgba(0,229,255,0.07)'
    for (let x = 0; x < W; x += spacing) {
      for (let y = 0; y < H; y += spacing) {
        ctx.beginPath()
        ctx.arc(x, y, 1, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  // ── Scan line effect ───────────────────────────────────
  let scanY = 0
  function drawScanLine() {
    const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40)
    grad.addColorStop(0,   'rgba(0,229,255,0)')
    grad.addColorStop(0.5, 'rgba(0,229,255,0.04)')
    grad.addColorStop(1,   'rgba(0,229,255,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, scanY - 40, W, 80)
    scanY = (scanY + 1.2) % (H + 40)
  }

  // ── Glitch flash ──────────────────────────────────────
  let glitchTimer = 0
  function maybeGlitch() {
    if (glitchTimer > 0) {
      glitchTimer--
      const sx = Math.random() * W * 0.4
      const sy = Math.random() * H
      const sw = 80 + Math.random() * 200
      const sh = 2 + Math.random() * 6
      ctx.fillStyle = `rgba(168,85,247,${Math.random() * 0.15})`
      ctx.fillRect(sx, sy, sw, sh)
    } else if (Math.random() < 0.002) {
      glitchTimer = 4
    }
  }

  // ── Mouse interaction ─────────────────────────────────
  let mouseX = -1
  const handleMouse = (e) => {
    const rect = canvas.getBoundingClientRect()
    mouseX = e.clientX - rect.left
  }
  canvas.addEventListener('mousemove', handleMouse)

  // ── Init columns ──────────────────────────────────────
  let columns = Array.from({ length: COLS }, (_, i) => new Column(i * FONT_SIZE))

  // ── Resize ────────────────────────────────────────────
  const handleResize = () => {
    W = canvas.clientWidth
    H = canvas.clientHeight
    canvas.width  = W
    canvas.height = H
    const newCols = Math.floor(W / FONT_SIZE)
    columns = Array.from({ length: newCols }, (_, i) => new Column(i * FONT_SIZE))
  }
  window.addEventListener('resize', handleResize)

  // ── Animation loop ────────────────────────────────────
  let frameId

  const animate = () => {
    frameId = requestAnimationFrame(animate)

    // Semi-transparent black fade — creates trail effect
    ctx.fillStyle = 'rgba(8, 8, 14, 0.18)'
    ctx.fillRect(0, 0, W, H)

    // Circuit grid
    drawGrid()

    // Rain columns
    for (const col of columns) {
      // Speed boost near mouse
      if (mouseX > 0 && Math.abs(col.x - mouseX) < 60) {
        col.speed = Math.min(col.speed * 1.02, 8)
      }
      col.update()
      col.draw(ctx)
    }

    // Effects
    drawScanLine()
    maybeGlitch()

    // Vignette
    const vg = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H)
    vg.addColorStop(0, 'rgba(0,0,0,0)')
    vg.addColorStop(1, 'rgba(0,0,0,0.55)')
    ctx.fillStyle = vg
    ctx.fillRect(0, 0, W, H)
  }

  animate()

  return () => {
    cancelAnimationFrame(frameId)
    canvas.removeEventListener('mousemove', handleMouse)
    window.removeEventListener('resize', handleResize)
  }
}

// ── Utility ───────────────────────────────────────────────
function hexWithAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
