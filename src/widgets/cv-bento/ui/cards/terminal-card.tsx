import { useLayoutEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import TextPlugin from 'gsap/TextPlugin'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { siGithub } from 'simple-icons'
import { BentoCard } from 'shared/ui'
import { useTheme } from 'shared/ui/theme/theme-context'

const GITHUB_URL = 'https://github.com/poulzinho'

gsap.registerPlugin(TextPlugin, ScrollTrigger)

// ─── Script ──────────────────────────────────────────────────────────────────

const COMMAND = 'pgcodes --agents --orchestrate'

const METHODS = [
  { short: 'SDD', label: 'Spec-driven development' },
  { short: 'TDD', label: 'Test-driven development' },
  { short: 'VDD', label: 'Verification-driven development' },
]

function formatLoginLine() {
  const d = new Date()
  const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  const date = d.getDate()
  return `Last login: ${DAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${date < 10 ? ' ' + date : date} ${hh}:${mm}:${ss} on ttys001`
}

// ─── Colors ──────────────────────────────────────────────────────────────────

const T = {
  user:    '#79C0FF',
  host:    '#56D364',
  dollar:  '#C9D1D9',
  command: '#FFFFFF',
  dim:     '#484F58',
  success: '#3FB950',
  output:  '#C9D1D9',
  result:  '#E3B341',
  cursor:  '#58A6FF',
  login:   '#484F58',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function findScroller(el: HTMLElement): HTMLElement | typeof window {
  let node = el.parentElement
  while (node) {
    const { overflowY } = window.getComputedStyle(node)
    if (overflowY === 'auto' || overflowY === 'scroll') return node
    node = node.parentElement
  }
  return window
}

function Prompt() {
  return (
    <>
      <span style={{ color: T.user }}>paul</span>
      <span style={{ color: T.dim }}>@</span>
      <span style={{ color: T.host }}>gualotuna.com</span>
      <span style={{ color: T.dim }}> ~ </span>
      <span style={{ color: T.dollar }}>% </span>
    </>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function TerminalCard() {
  const { theme } = useTheme()
  const loginLine = useMemo(() => formatLoginLine(), [])

  const cardRef     = useRef<HTMLDivElement>(null)
  const loginRef    = useRef<HTMLDivElement>(null)
  const cmdRef      = useRef<HTMLSpanElement>(null)
  const cmdCursor   = useRef<HTMLSpanElement>(null)
  const bannerRef   = useRef<HTMLSpanElement>(null)   // "PG-AGENTS" types in
  const introRef    = useRef<HTMLDivElement>(null)
  const methodRefs  = useRef<(HTMLDivElement | null)[]>([null, null, null])
  const orchRef     = useRef<HTMLDivElement>(null)
  const resultRef   = useRef<HTMLDivElement>(null)
  const finalRef    = useRef<HTMLDivElement>(null)
  const finalCursor = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (!cardRef.current) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const allFadeable = [
      loginRef.current,
      introRef.current,
      ...methodRefs.current,
      orchRef.current,
      resultRef.current,
      finalRef.current,
    ].filter((el): el is HTMLDivElement => el !== null)

    if (reducedMotion) {
      allFadeable.forEach(el => { el.style.opacity = '1' })
      if (cmdRef.current)    cmdRef.current.textContent    = COMMAND
      if (cmdCursor.current) cmdCursor.current.style.opacity = '0'
      if (bannerRef.current) bannerRef.current.textContent = 'PG-AGENTS'
      if (finalCursor.current) finalCursor.current.style.opacity = '1'
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(allFadeable, { opacity: 0 })
      gsap.set(finalCursor.current, { opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          scroller: findScroller(cardRef.current!),
          start: 'top 80%',
          once: true,
        },
        defaults: { ease: 'power2.out' },
      })

      // 1. "Last login" line fades in
      tl.fromTo(loginRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })

      // 2. Command types out
      tl.to(cmdRef.current, {
        duration: 1.0,
        text: { value: COMMAND, delimiter: '' },
        ease: 'none',
      }, '+=0.2')

      // 3. Cursor blinks then hides ("press enter")
      tl.to(cmdCursor.current, {
        opacity: 0, duration: 0.12, repeat: 3, yoyo: true,
      }, '+=0.15')
      tl.set(cmdCursor.current, { opacity: 0 })

      // 4. "PG-AGENTS" types into banner span
      tl.to(bannerRef.current, {
        duration: 0.55,
        text: { value: 'PG-AGENTS', delimiter: '' },
        ease: 'none',
      }, '+=0.1')

      // 5. "I have experience..." fades in
      tl.fromTo(introRef.current,
        { opacity: 0, y: 3 },
        { opacity: 1, y: 0, duration: 0.25 },
        '+=0.2',
      )

      // 6. Method lines staggered
      methodRefs.current.forEach(el => {
        tl.fromTo(el,
          { opacity: 0, x: -6 },
          { opacity: 1, x: 0, duration: 0.2 },
          '+=0.08',
        )
      })

      // 7. [ORCH]
      tl.fromTo(orchRef.current,
        { opacity: 0, y: 3 },
        { opacity: 1, y: 0, duration: 0.25 },
        '+=0.2',
      )

      // 8. [RESULT]
      tl.fromTo(resultRef.current,
        { opacity: 0, y: 3 },
        { opacity: 1, y: 0, duration: 0.3 },
        '+=0.2',
      )

      // 9. Final idle prompt
      tl.fromTo(finalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 },
        '+=0.2',
      )

      // 10. Cursor blinks forever
      tl.set(finalCursor.current, { opacity: 1 })
      tl.to(finalCursor.current, {
        opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: 'none',
      })
    }, cardRef)

    return () => ctx.revert()
  }, [])

  const ringClass = theme === 'light' ? 'ring-2 ring-black/15' : 'ring-1 ring-white/8'

  return (
    <BentoCard
      colSpan={3}
      rowSpan={2}
      variant='default'
      label='AI Agent Orchestration'
      className='!p-0'
    >
      <div
        ref={cardRef}
        className={`flex h-full flex-col overflow-hidden rounded-2xl ${ringClass}`}
        style={{ background: '#0D1117', fontFamily: 'ui-monospace, "Cascadia Code", Menlo, monospace' }}
      >
        {/* ── macOS title bar ── */}
        <div
          className='flex shrink-0 items-center gap-1.5 border-b px-4 py-3'
          style={{ background: '#161B22', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <span className='h-3 w-3 rounded-full' style={{ background: '#FF5F57' }} />
          <span className='h-3 w-3 rounded-full' style={{ background: '#FEBC2E' }} />
          <span className='h-3 w-3 rounded-full' style={{ background: '#28C840' }} />
          <span className='mx-auto text-[11px]' style={{ color: '#6E7681' }}>
            paul@gualotuna.com — zsh
          </span>
          <a
            href={GITHUB_URL}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='View on GitHub'
            className='flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-white/10'
            style={{ color: '#6E7681' }}
          >
            <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
              <path d={siGithub.path} />
            </svg>
          </a>
        </div>

        {/* ── Terminal body ── */}
        <div className='overflow-hidden p-5 text-[11px] leading-relaxed' style={{ color: T.output }}>

          {/* Last login */}
          <div ref={loginRef} style={{ color: T.login }}>{loginLine}</div>
          <div className='h-3' />

          {/* Prompt + command */}
          <div className='flex flex-wrap items-baseline'>
            <Prompt />
            <span ref={cmdRef} style={{ color: T.command }} />
            <span ref={cmdCursor} style={{ color: T.cursor }}>█</span>
          </div>

          {/* Output */}
          <div className='mt-2 space-y-px'>

            {/* > PG-AGENTS logo */}
            <div className='flex items-center gap-2.5 py-1'>
              <span
                style={{
                  color: T.cursor,
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '0.65rem',
                }}
              >
                {'>'}
              </span>
              <span
                ref={bannerRef}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'clamp(0.85rem, 1.8vw, 1.25rem)',
                  background: 'linear-gradient(90deg, #79C0FF 0%, #a78bfa 55%, #f472b6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1.5,
                }}
              />
            </div>

            <div className='h-2' />

            {/* Intro line */}
            <div ref={introRef} style={{ color: T.output }}>
              I have experience orchestrating agents with:
            </div>

            {/* Method lines */}
            {METHODS.map((m, i) => (
              <div
                key={m.short}
                ref={el => { methodRefs.current[i] = el }}
                className='pl-4'
              >
                <span style={{ color: T.dim }}>- </span>
                <span style={{ color: T.output }}>{m.label} </span>
                <span style={{ color: T.cursor }}>({m.short})</span>
              </div>
            ))}

            <div className='h-3' />

            {/* [ORCH] */}
            <div ref={orchRef}>
              <span style={{ color: T.dim }}>[ORCH]</span>
              <span style={{ color: T.output }}>{'  Initializing ...'}</span>
            </div>

            <div className='h-2' />

            {/* [RESULT] */}
            <div ref={resultRef}>
              <span style={{ color: T.dim }}>[RESULT]</span>
              <span style={{ color: T.result }}>{'  release/my-app'}</span>
            </div>

            <div className='h-3' />

            {/* Final idle prompt */}
            <div ref={finalRef} className='flex flex-wrap items-baseline'>
              <Prompt />
              <span ref={finalCursor} style={{ color: T.cursor }}>█</span>
            </div>

          </div>
        </div>
      </div>
    </BentoCard>
  )
}
