import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Docs.css'

/* ── Copy-to-clipboard hook ─────────────────────────── */
function useCopy() {
  const [copied, setCopied] = useState(null)
  const copy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 1800)
    })
  }
  return { copied, copy }
}

/* ── Code Block with copy + try-in-IDE ──────────────── */
function CodeBlock({ id, code, label }) {
  const { copied, copy } = useCopy()
  return (
    <div className="docs-code-block">
      {label && <div className="docs-code-label">{label}</div>}
      <button
        className={`docs-copy-btn ${copied === id ? 'copied' : ''}`}
        onClick={() => copy(code, id)}
        title="Copy code"
      >
        {copied === id ? '✓ Copied!' : '⧉ Copy'}
      </button>
      <pre className="docs-code-pre"><code dangerouslySetInnerHTML={{ __html: highlight(code) }} /></pre>
      <Link to="/ide" className="docs-try-btn" title="Open in IDE">
        ▶ Try in IDE
      </Link>
    </div>
  )
}

/* ── Simple syntax highlighter ──────────────────────── */
function highlight(code) {
  const keywords = ['let_him_cook','boliye','agar','warna','baaki_sab','pov','wapas_karo',
    'squad','new','this','buzurg','nepo_baby_of','jab_tak_doomscroll','baar_baar',
    'nikal_lo','skip_karo','agar_risk','pakad_lo','jo_bhi_hai_bhaad_me_jaaye','jhel_isko','lele']
  const boolNull = ['no_cap','fraud','null']
  
  return code
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    // comments
    .replace(/(\/\/[^\n]*)/g, '<span class="hl-comment">$1</span>')
    // strings
    .replace(/("(?:[^"\\]|\\.)*")/g, '<span class="hl-string">$1</span>')
    // template literals
    .replace(/(`[^`]*`)/g, '<span class="hl-string">$1</span>')
    // numbers
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="hl-number">$1</span>')
    // bool/null
    .replace(new RegExp(`\\b(${boolNull.join('|')})\\b`, 'g'), '<span class="hl-bool">$1</span>')
    // keywords
    .replace(new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'), '<span class="hl-kw">$1</span>')
}

/* ── Concept Card ───────────────────────────────────── */
function ConceptCard({ emoji, title, desc }) {
  return (
    <div className="docs-concept-card">
      <span className="docs-concept-emoji">{emoji}</span>
      <div>
        <div className="docs-concept-title">{title}</div>
        <div className="docs-concept-desc">{desc}</div>
      </div>
    </div>
  )
}

/* ── Comparison row ─────────────────────────────────── */
function Compare({ english, hscript }) {
  return (
    <div className="docs-compare">
      <div className="docs-compare-side docs-compare-eng">
        <span className="docs-compare-label">Plain English</span>
        <span>{english}</span>
      </div>
      <div className="docs-compare-arrow">→</div>
      <div className="docs-compare-side docs-compare-hs">
        <span className="docs-compare-label">H-Script</span>
        <code>{hscript}</code>
      </div>
    </div>
  )
}

/* ── SECTIONS DATA ──────────────────────────────────── */
const SECTIONS = [
  {
    id: 'intro',
    icon: '👋',
    label: 'Introduction',
    phase: null,
    content: () => (
      <>
        <p className="docs-lead">
          H-Script is a fun, Hinglish-flavored programming language. If you can speak a bit of Hindi or follow Bollywood references, you'll feel right at home. If you're completely new to coding — <strong>don't worry at all</strong>, this guide will walk you through everything step by step.
        </p>
        <div className="docs-callout docs-callout--info">
          💡 <strong>What is a programming language?</strong> Think of it as giving instructions to a very literal-minded robot. You tell it exactly what to do, step by step, and it does it perfectly every time.
        </div>
        <div className="docs-concepts-grid">
          <ConceptCard emoji="📦" title="Variables" desc="Boxes that store information (numbers, names, lists)" />
          <ConceptCard emoji="🔁" title="Loops" desc="Doing something again and again automatically" />
          <ConceptCard emoji="⚡" title="Functions" desc="Reusable recipes — write once, use anywhere" />
          <ConceptCard emoji="🧱" title="Classes" desc="Blueprints for creating similar objects" />
        </div>
        <CodeBlock id="intro-ex" label="Your first H-Script program:" code={`// This is a comment — the computer ignores it!
// Think of it as a note to yourself

let_him_cook name = "bhai"      // Store "bhai" in a box called 'name'
boliye("Namaste, " + name)      // Print it out → Namaste, bhai`} />
      </>
    )
  },
  {
    id: 'variables',
    icon: '📦',
    label: 'Variables',
    phase: '1',
    content: () => (
      <>
        <p className="docs-lead">A <strong>variable</strong> is like a labeled box. You put a value in it, give it a name, and use that name later whenever you need the value.</p>

        <Compare english="Let x equal 10" hscript='let_him_cook x = 10' />
        <Compare english='Store the word "hello" in a box named greeting' hscript='let_him_cook greeting = "hello"' />
        <Compare english="True or False value" hscript="let_him_cook isLit = no_cap   // true" />

        <div className="docs-callout docs-callout--tip">
          🔑 The keyword is <code>let_him_cook</code> — think of it as telling the computer <em>"cook this up and remember it"</em>.
        </div>

        <CodeBlock id="vars" label="Variables in action:" code={`let_him_cook age     = 18            // number
let_him_cook city    = "Mumbai"      // text (called a "string")
let_him_cook isAdult = no_cap        // true (called a boolean)
let_him_cook nothing = null          // empty / no value

boliye(age)       // → 18
boliye(city)      // → Mumbai
boliye(isAdult)   // → true

// You can change a variable's value later
age = 19
boliye(age)       // → 19`} />

        <div className="docs-types">
          <div className="docs-type-pill">🔢 Numbers — <code>42</code>, <code>3.14</code></div>
          <div className="docs-type-pill">📝 Text — <code>"hello"</code></div>
          <div className="docs-type-pill">✅ Boolean — <code>no_cap</code> (true), <code>fraud</code> (false)</div>
          <div className="docs-type-pill">∅ Empty — <code>null</code></div>
        </div>
      </>
    )
  },
  {
    id: 'print',
    icon: '📢',
    label: 'Printing Output',
    phase: '1',
    content: () => (
      <>
        <p className="docs-lead"><code>boliye()</code> is how you show something on screen. It's like shouting out loud — <em>"boliye"</em> literally means "please say" in Hindi.</p>
        <CodeBlock id="print" label="Different ways to print:" code={`boliye("Hello World!")          // → Hello World!
boliye(100 + 50)               // → 150
boliye("My age is: " + 21)     // → My age is: 21
boliye(no_cap)                 // → true

// Print multiple things using template literals (backticks)
let_him_cook name = "Arjun"
let_him_cook score = 95
boliye(\`\${name} scored \${score} marks!\`)  // → Arjun scored 95 marks!`} />
        <div className="docs-callout docs-callout--info">
          🎤 Template literals use <strong>backticks</strong> (`) and <code>${'{'}...{'}'}</code> to embed variables directly inside text. Super handy!
        </div>
      </>
    )
  },
  {
    id: 'conditions',
    icon: '🚦',
    label: 'If / Else',
    phase: '1',
    content: () => (
      <>
        <p className="docs-lead">Conditions let your program make decisions — <em>"if this is true, do that, otherwise do something else."</em></p>
        <Compare english="if (age is more than 17)" hscript="agar age > 17 {" />
        <Compare english="otherwise" hscript="warna {" />
        <Compare english="else if (age equals 17)" hscript="baaki_sab agar age == 17 {" />

        <CodeBlock id="cond" label="Traffic light example:" code={`let_him_cook marks = 75

agar marks >= 90 {
  boliye("Grade A — Topper! 🏆")
} baaki_sab agar marks >= 75 {
  boliye("Grade B — Solid performance 💪")
} baaki_sab agar marks >= 50 {
  boliye("Grade C — Keep going bhai 📚")
} warna {
  boliye("Study karo yaar 😅")
}
// → Grade B — Solid performance 💪`} />

        <div className="docs-operators">
          <span className="docs-op"><code>==</code> equals</span>
          <span className="docs-op"><code>!=</code> not equal</span>
          <span className="docs-op"><code>&gt;</code> greater than</span>
          <span className="docs-op"><code>&lt;</code> less than</span>
          <span className="docs-op"><code>&gt;=</code> greater or equal</span>
          <span className="docs-op"><code>&amp;&amp;</code> AND</span>
          <span className="docs-op"><code>||</code> OR</span>
          <span className="docs-op"><code>!</code> NOT</span>
        </div>
      </>
    )
  },
  {
    id: 'loops',
    icon: '🔁',
    label: 'Loops',
    phase: '1',
    content: () => (
      <>
        <p className="docs-lead">Loops repeat a block of code. Instead of writing <code>boliye(1)</code>, <code>boliye(2)</code>... 100 times, you write a loop!</p>

        <div className="docs-loop-cards">
          <div className="docs-loop-card">
            <div className="docs-loop-card-title">jab_tak_doomscroll</div>
            <div className="docs-loop-card-sub">= <strong>while</strong> (repeat while condition is true)</div>
          </div>
          <div className="docs-loop-card">
            <div className="docs-loop-card-title">baar_baar</div>
            <div className="docs-loop-card-sub">= <strong>for</strong> (repeat a specific number of times)</div>
          </div>
        </div>

        <CodeBlock id="while" label="While loop — doomscrolling until 3am:" code={`let_him_cook hour = 10

jab_tak_doomscroll hour <= 12 {
  boliye("Hour: " + hour)
  hour = hour + 1
}
// → Hour: 10
// → Hour: 11
// → Hour: 12`} />

        <CodeBlock id="for" label="For loop — counting 1 to 5:" code={`baar_baar (let_him_cook i = 1; i <= 5; i++) {
  boliye("Count: " + i)
}
// → Count: 1
// → Count: 2
// → Count: 3
// → Count: 4
// → Count: 5`} />

        <div className="docs-callout docs-callout--tip">
          ⏹️ Use <code>nikal_lo</code> to <strong>break</strong> out of a loop early, and <code>skip_karo</code> to <strong>skip</strong> the current iteration.
        </div>
      </>
    )
  },
  {
    id: 'functions',
    icon: '⚡',
    label: 'Functions',
    phase: '2',
    content: () => (
      <>
        <p className="docs-lead">A <strong>function</strong> is a reusable recipe. You define it once with a name, and then call it whenever you need it — saving you from writing the same code again and again.</p>
        <Compare english="define a function called greet" hscript="pov greet(name) {" />

        <CodeBlock id="fn-basic" label="Basic function:" code={`// Define the function
pov add(a, b) {
  wapas_karo a + b       // 'wapas_karo' = return the result
}

// Call the function
let_him_cook result = add(10, 5)
boliye(result)             // → 15
boliye(add(100, 200))      // → 300`} />

        <CodeBlock id="fn-default" label="Function with default values:" code={`// If no name given, use "Bhai" as default
pov greet(name = "Bhai") {
  boliye(\`Namaste, \${name}! 🙏\`)
}

greet("Rahul")    // → Namaste, Rahul! 🙏
greet()           // → Namaste, Bhai! 🙏 (uses default)`} />

        <CodeBlock id="fn-anon" label="Anonymous function (no name — stored in a variable):" code={`let_him_cook double = pov(n) {
  wapas_karo n * 2
}

boliye(double(7))   // → 14`} />
      </>
    )
  },
  {
    id: 'arrays',
    icon: '📋',
    label: 'Lists (BakchodList)',
    phase: '2',
    content: () => (
      <>
        <p className="docs-lead">A <strong>BakchodList</strong> is H-Script's name for an array — basically a list of items stored in order, like a numbered todo list.</p>

        <CodeBlock id="arr" label="Creating and using lists:" code={`let_him_cook fruits = ["apple", "mango", "banana"]

boliye(fruits.lambai)     // → 3 (length of list)
boliye(fruits[0])         // → apple (index starts at 0!)
boliye(fruits.pehla)      // → apple (first item)
boliye(fruits.aakhri)     // → banana (last item)

fruits.daalo("guava")     // Add to end
boliye(fruits.lambai)     // → 4

fruits.nikalo()           // Remove from end
boliye(fruits.lambai)     // → 3`} />

        <CodeBlock id="arr-hof" label="Higher-order functions (powerful list tools!):" code={`let_him_cook nums = [1, 2, 3, 4, 5]

// map_karo — transform every item
let_him_cook doubled = nums.map_karo(pov(n) { wapas_karo n * 2 })
boliye(doubled.milao(", "))    // → 2, 4, 6, 8, 10

// filter_karo — keep only matching items
let_him_cook evens = nums.filter_karo(pov(n) { wapas_karo n % 2 == 0 })
boliye(evens.milao(", "))      // → 2, 4

// reduce_karo — collapse list into one value
let_him_cook sum = nums.reduce_karo(pov(acc, n) { wapas_karo acc + n }, 0)
boliye(sum)                    // → 15`} />
      </>
    )
  },
  {
    id: 'objects',
    icon: '🗺️',
    label: 'Objects (JugaadMap)',
    phase: '3',
    content: () => (
      <>
        <p className="docs-lead">A <strong>JugaadMap</strong> stores key-value pairs — like a real-world dictionary or a form with labeled fields. Perfect for grouping related data.</p>

        <CodeBlock id="obj" label="Creating an object:" code={`let_him_cook person = {
  name: "Priya",
  age: 22,
  city: "Delhi"
}

boliye(person.name)      // → Priya
boliye(person.age)       // → 22
boliye(person["city"])   // → Delhi (bracket notation also works)

// Update a field
person.age = 23
boliye(\`\${person.name} is now \${person.age}\`)  // → Priya is now 23`} />
      </>
    )
  },
  {
    id: 'classes',
    icon: '🧱',
    label: 'Classes (Squad)',
    phase: '2',
    content: () => (
      <>
        <p className="docs-lead">A <strong>squad</strong> (class) is a blueprint for creating multiple objects of the same type. Think of it as a cookie cutter — you make the cutter once, then stamp out as many cookies as you want.</p>

        <CodeBlock id="class" label="Defining and using a class:" code={`squad Animal {
  pov init(name, sound) {
    this.name  = name
    this.sound = sound
  }

  pov speak() {
    boliye(\`\${this.name} says: \${this.sound}!\`)
  }
}

let_him_cook dog = new Animal("Bruno", "Woof")
let_him_cook cat = new Animal("Whiskers", "Meow")

dog.speak()   // → Bruno says: Woof!
cat.speak()   // → Whiskers says: Meow!`} />

        <CodeBlock id="inherit" label="Inheritance — child class extends parent:" code={`squad Vehicle {
  pov init(brand) {
    this.brand = brand
  }
  pov info() {
    boliye("Brand: " + this.brand)
  }
}

squad Car nepo_baby_of Vehicle {
  pov init(brand, model) {
    buzurg.init(brand)       // call parent's init
    this.model = model
  }
  pov info() {
    buzurg.info()
    boliye("Model: " + this.model)
  }
}

let_him_cook c = new Car("Tata", "Nexon")
c.info()
// → Brand: Tata
// → Model: Nexon`} />
      </>
    )
  },
  {
    id: 'errors',
    icon: '🛡️',
    label: 'Error Handling',
    phase: '3',
    content: () => (
      <>
        <p className="docs-lead">Sometimes things go wrong — a file doesn't exist, the user types the wrong thing. Error handling lets you catch problems gracefully instead of crashing.</p>
        <Compare english="try" hscript="agar_risk {" />
        <Compare english="catch (error)" hscript="pakad_lo (err) {" />
        <Compare english="finally" hscript="jo_bhi_hai_bhaad_me_jaaye {" />
        <Compare english="throw new Error(...)" hscript="jhel_isko ..." />

        <CodeBlock id="trycatch" label="Try-Catch example:" code={`pov divide(a, b) {
  agar b == 0 {
    jhel_isko "Bhai zero se divide nahi hota! 🙅"
  }
  wapas_karo a / b
}

agar_risk {
  boliye(divide(10, 2))   // → 5
  boliye(divide(5, 0))    // throws error!
} pakad_lo (err) {
  boliye("Error caught: " + err)
} jo_bhi_hai_bhaad_me_jaaye {
  boliye("This always runs, no matter what 🔒")
}`} />
      </>
    )
  },
  {
    id: 'stdlib',
    icon: '🧰',
    label: 'Built-in Tools',
    phase: '1-4',
    content: () => (
      <>
        <p className="docs-lead">H-Script comes with built-in functions ready to use — no imports needed. Here are the most useful ones:</p>

        <div className="docs-stdlib-grid">
          {[
            { fn: 'typeOf(x)', desc: 'What type is x?', ex: 'typeOf(42) → "number"' },
            { fn: 'toNumber(x)', desc: 'Convert to number', ex: 'toNumber("99") → 99' },
            { fn: 'toString(x)', desc: 'Convert to text', ex: 'toString(42) → "42"' },
            { fn: 'lambai(x)', desc: 'Length of string or list', ex: 'lambai("hello") → 5' },
            { fn: 'upperCase(s)', desc: 'UPPER CASE', ex: 'upperCase("hi") → "HI"' },
            { fn: 'lowerCase(s)', desc: 'lower case', ex: 'lowerCase("HI") → "hi"' },
            { fn: 'randomNum(min, max)', desc: 'Random number', ex: 'randomNum(1, 6) → dice roll!' },
            { fn: 'powerOf(x, y)', desc: 'x raised to power y', ex: 'powerOf(2, 10) → 1024' },
            { fn: 'squareRoot(x)', desc: 'Square root', ex: 'squareRoot(16) → 4' },
            { fn: 'absValue(x)', desc: 'Absolute (positive) value', ex: 'absValue(-7) → 7' },
            { fn: 'max(...)', desc: 'Largest number', ex: 'max(3, 9, 1) → 9' },
            { fn: 'min(...)', desc: 'Smallest number', ex: 'min(3, 9, 1) → 1' },
            { fn: 'split_karo(s, sep)', desc: 'Split string into list', ex: 'split_karo("a,b,c", ",")' },
            { fn: 'includes_kya(s, sub)', desc: 'Does string contain?', ex: 'includes_kya("hello", "ell") → true' },
            { fn: 'trim_karo(s)', desc: 'Remove whitespace', ex: 'trim_karo("  hi  ") → "hi"' },
          ].map((item, i) => (
            <div className="docs-stdlib-item" key={i}>
              <code className="docs-stdlib-fn">{item.fn}</code>
              <span className="docs-stdlib-desc">{item.desc}</span>
              <span className="docs-stdlib-ex">{item.ex}</span>
            </div>
          ))}
        </div>
      </>
    )
  },
  {
    id: 'cheatsheet',
    icon: '📌',
    label: 'Cheat Sheet',
    phase: null,
    content: () => (
      <>
        <p className="docs-lead">Quick reference — all keywords at a glance:</p>
        <div className="docs-cheatsheet">
          {[
            ['let_him_cook x = value', 'Declare variable'],
            ['boliye(value)', 'Print to screen'],
            ['agar cond { } warna { }', 'If / else'],
            ['baaki_sab agar cond { }', 'Else if'],
            ['jab_tak_doomscroll cond { }', 'While loop'],
            ['baar_baar (init; cond; upd) { }', 'For loop'],
            ['nikal_lo', 'Break out of loop'],
            ['skip_karo', 'Skip current iteration'],
            ['pov name(params) { }', 'Define function'],
            ['wapas_karo value', 'Return from function'],
            ['squad Name { }', 'Define class'],
            ['new ClassName(args)', 'Create instance'],
            ['nepo_baby_of', 'Extends (inheritance)'],
            ['this', 'Current object reference'],
            ['buzurg.method()', 'Call parent method (super)'],
            ['agar_risk { } pakad_lo (e) { }', 'Try / catch'],
            ['jhel_isko value', 'Throw error'],
            ['jo_bhi_hai_bhaad_me_jaaye { }', 'Finally block'],
            ['no_cap', 'true'],
            ['fraud', 'false'],
            ['null', 'empty / no value'],
          ].map(([code, desc], i) => (
            <div className="docs-cheat-row" key={i}>
              <code className="docs-cheat-code">{code}</code>
              <span className="docs-cheat-desc">{desc}</span>
            </div>
          ))}
        </div>
      </>
    )
  },
]

/* ── MAIN DOCS PAGE ─────────────────────────────────── */
export default function Docs() {
  const [active, setActive] = useState('intro')
  const contentRef = useRef(null)

  const section = SECTIONS.find(s => s.id === active) || SECTIONS[0]

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0
  }, [active])

  return (
    <div className="docs" id="docs-page">

      {/* ── Sidebar ───────────────────────────────────── */}
      <aside className="docs__sidebar">
        <div className="docs__sidebar-header">
          <Link to="/" className="docs__back-home" id="docs-home-link">
            ← Home
          </Link>
          <div className="docs__sidebar-title">
            <span className="docs__sidebar-logo-icon">H</span>
            <span>Script Docs</span>
          </div>
          <div className="docs__sidebar-sub">Your complete beginner guide</div>
        </div>

        <nav className="docs__nav">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              id={`nav-${s.id}`}
              className={`docs__nav-item ${active === s.id ? 'active' : ''}`}
              onClick={() => setActive(s.id)}
            >
              <span className="docs__nav-icon">{s.icon}</span>
              <span className="docs__nav-label">{s.label}</span>
              {s.phase && <span className="docs__nav-phase">Ph {s.phase}</span>}
            </button>
          ))}
        </nav>

        <div className="docs__sidebar-footer">
          <Link to="/ide" className="docs__try-ide-link" id="docs-open-ide">
            ⚡ Open IDE
          </Link>
        </div>
      </aside>

      {/* ── Content ───────────────────────────────────── */}
      <main className="docs__content" ref={contentRef}>

        {/* Page header */}
        <div className="docs__page-header">
          <div className="docs__breadcrumb">
            <span>Docs</span>
            <span>/</span>
            <span>{section.label}</span>
          </div>
          <h1 className="docs__title">
            <span className="docs__title-icon">{section.icon}</span>
            {section.label}
          </h1>
          {section.phase && (
            <span className={`docs__phase-badge docs__phase-badge--${section.phase}`}>
              Phase {section.phase}
            </span>
          )}
        </div>

        {/* Section body */}
        <div className="docs__body">
          {section.content()}
        </div>

        {/* Next / Prev navigation */}
        <div className="docs__pagination">
          {SECTIONS.findIndex(s => s.id === active) > 0 && (
            <button
              className="docs__page-btn docs__page-btn--prev"
              onClick={() => setActive(SECTIONS[SECTIONS.findIndex(s => s.id === active) - 1].id)}
            >
              ← {SECTIONS[SECTIONS.findIndex(s => s.id === active) - 1].label}
            </button>
          )}
          {SECTIONS.findIndex(s => s.id === active) < SECTIONS.length - 1 && (
            <button
              className="docs__page-btn docs__page-btn--next"
              onClick={() => setActive(SECTIONS[SECTIONS.findIndex(s => s.id === active) + 1].id)}
            >
              {SECTIONS[SECTIONS.findIndex(s => s.id === active) + 1].label} →
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
