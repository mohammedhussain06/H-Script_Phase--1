import anime from 'animejs'

// ── Logo/title typewriter reveal ─────────────────────────
export function logoReveal(el) {
  if (!el) return
  const text = el.textContent
  el.textContent = ''
  el.style.visibility = 'visible'

  anime({
    targets: el,
    duration: 800,
    easing: 'easeOutExpo',
    opacity: [0, 1],
  })

  let i = 0
  const interval = setInterval(() => {
    el.textContent = text.slice(0, ++i)
    if (i >= text.length) clearInterval(interval)
  }, 60)
}

// ── Staggered fade + slide in for hero content ───────────
export function heroContentEntrance(els) {
  anime({
    targets: els,
    opacity: [0, 1],
    translateY: [30, 0],
    easing: 'easeOutExpo',
    duration: 900,
    delay: anime.stagger(150, { start: 300 }),
  })
}

// ── Scroll-triggered: cards fly in ───────────────────────
export function cardEntrance(els) {
  anime({
    targets: els,
    opacity: [0, 1],
    translateY: [50, 0],
    scale: [0.92, 1],
    easing: 'easeOutBack',
    duration: 700,
    delay: anime.stagger(120),
  })
}

// ── Scroll-triggered: section title reveal ────────────────
export function sectionTitleReveal(el) {
  anime({
    targets: el,
    opacity: [0, 1],
    translateY: [20, 0],
    easing: 'easeOutExpo',
    duration: 600,
  })
}

// ── Run button pulse ─────────────────────────────────────
export function runButtonPulse(el) {
  anime({
    targets: el,
    scale: [1, 1.06, 1],
    boxShadow: [
      '0 0 0px rgba(124,58,237,0)',
      '0 0 24px rgba(124,58,237,0.6)',
      '0 0 0px rgba(124,58,237,0)',
    ],
    duration: 600,
    easing: 'easeInOutQuad',
  })
}

// ── Error screen shake ───────────────────────────────────
export function errorShake(el) {
  anime({
    targets: el,
    translateX: [-8, 8, -6, 6, -4, 4, 0],
    duration: 400,
    easing: 'easeInOutSine',
  })
}

// ── Navbar entrance ──────────────────────────────────────
export function navbarEntrance(el) {
  anime({
    targets: el,
    opacity: [0, 1],
    translateY: [-20, 0],
    easing: 'easeOutExpo',
    duration: 600,
  })
}

// ── Use IntersectionObserver to trigger on scroll ────────
export function onScrollInView(el, callback) {
  if (!el) return
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback()
          observer.unobserve(el)
        }
      })
    },
    { threshold: 0.2 }
  )
  observer.observe(el)
}
