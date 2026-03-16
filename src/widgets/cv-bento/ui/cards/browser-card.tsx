import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import {
  siReact, siTypescript, siReactivex, siD3,
  siNestjs, siExpress, siNodedotjs,
  siPostgresql, siMongodb, siRedis,
  siGooglecloud, siDocker, siGithubactions,
  siGithub,
} from 'simple-icons'
import { BentoCard } from 'shared/ui'
import { useTheme } from 'shared/ui/theme/theme-context'

const GITHUB_URL = 'https://github.com/poulzinho'

gsap.registerPlugin(ScrollTrigger)

// ─── Types ────────────────────────────────────────────────────────────────────

type SiIcon = { path: string; hex: string }

// ─── Icon data ────────────────────────────────────────────────────────────────

const FRONTEND_ICONS: SiIcon[] = [siReact, siTypescript, siReactivex, siD3]
const BACKEND_ICONS:  SiIcon[] = [siNestjs, siExpress, siNodedotjs]
const DB_ICONS:       SiIcon[] = [siPostgresql, siMongodb, siRedis]
const INFRA_ICONS:    SiIcon[] = [siGooglecloud, siDocker, siGithubactions]

// ─── Palette ──────────────────────────────────────────────────────────────────

const LIGHT = {
  canvas:       '#F0F2F5',
  dot:          'rgba(0,0,0,0.04)',
  nodeBg:       '#FFFFFF',
  nodeBorder:   '#D8DCE6',
  titleColor:   '#0F1117',
  subColor:     '#6B7280',
  edge:         '#BCC4D2',
  arrow:        '#A0AABB',
  labelBg:      '#FFFFFF',
  labelBorder:  '#D4D8E4',
  labelText:    '#5A6478',
  // Icons rendered as dark silhouettes — brand hex colors have poor contrast on white
  iconFill:     'rgba(18, 28, 46, 0.68)',
  personStroke: '#9CA3AF',
  chromeBg:     '#E4E7EC',
  chromeBorder: 'rgba(0,0,0,0.07)',
  chromeRing:   'ring-1 ring-black/8',
  neon:         '#06B6D4',
}

const DARK = {
  canvas:       '#0D1117',
  dot:          'rgba(255,255,255,0.03)',
  nodeBg:       '#161B22',
  nodeBorder:   '#21262D',
  titleColor:   '#E6EDF3',
  subColor:     '#7D8590',
  edge:         '#2D333B',
  arrow:        '#3D444D',
  labelBg:      '#1C2128',
  labelBorder:  '#2D333B',
  labelText:    '#7D8590',
  // Icons as semi-white silhouettes on dark nodes
  iconFill:     'rgba(210,220,235,0.60)',
  personStroke: '#4D5562',
  chromeBg:     '#1C1C1E',
  chromeBorder: 'rgba(255,255,255,0.07)',
  chromeRing:   'ring-1 ring-white/8',
  neon:         '#A78BFA',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function findScroller(el: HTMLElement): HTMLElement | typeof window {
  let node = el.parentElement
  while (node) {
    const { overflowY } = window.getComputedStyle(node)
    if (overflowY === 'auto' || overflowY === 'scroll') return node
    node = node.parentElement
  }
  return window
}

// simple-icons v16 paths live in a 24×24 viewBox — no scale needed
const ICON_PX    = 24   // natural rendered size
const ICON_PITCH = 32   // 8 px gap between icons

function iconRowStartX(cx: number, n: number) {
  return cx - ((n - 1) * ICON_PITCH + ICON_PX) / 2
}

function IconRow({ icons, cx, y, fill }: { icons: SiIcon[]; cx: number; y: number; fill: string }) {
  const startX = iconRowStartX(cx, icons.length)
  return (
    <>
      {icons.map((icon, i) => (
        <g key={i} transform={`translate(${startX + i * ICON_PITCH},${y})`}>
          <path d={icon.path} fill={fill} />
        </g>
      ))}
    </>
  )
}

// Compact inline edge-label box, centered at (cx, cy)
function EdgeLabel({
  cx, cy, text, w,
  bg, border, color,
}: {
  cx: number; cy: number; text: string; w: number
  bg: string; border: string; color: string
}) {
  return (
    <g>
      <rect x={cx - w / 2} y={cy - 6} width={w} height={12} rx={3}
        fill={bg} stroke={border} strokeWidth={0.75} />
      <text x={cx} y={cy + 4} textAnchor='middle' fontSize={7} fontWeight='500' fill={color}>
        {text}
      </text>
    </g>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

/*
  Layout — viewBox 460 × 358
  ─────────────────────────────────────────────────────────
  User        x=175  y=14   w=110  h=42   cx=230  bottom=56
  Frontend    x=30   y=80   w=400  h=68   cx=230  bottom=148
  Backend     x=12   y=180  w=190  h=68   cx=107  bottom=248
  Database    x=258  y=180  w=190  h=68   cx=353  bottom=248
  Infra       x=30   y=280  w=400  h=60   cx=230  bottom=340

  Edges (straight verticals / horizontal):
  1. (230,56) → (230,80)       User→Frontend
  2. (107,148)→ (107,180)      Frontend→Backend
  3. (202,214)↔ (258,214)      Backend↔Database  (cy = 180+34=214)
  4. (107,248)→ (107,280)      Backend→Infra
  5. (353,248)→ (353,280)      Database→Infra
*/

export default function BrowserCard() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const p    = dark ? DARK : LIGHT

  const cardRef  = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(SVGGElement | null)[]>([null, null, null, null, null])
  const edgeRefs = useRef<(SVGGElement | null)[]>([null, null, null, null, null])

  const [hovNode, setHovNode] = useState<number | null>(null)
  const [hovEdge, setHovEdge] = useState<number | null>(null)

  // ── Canvas pan ──────────────────────────────────────────────────────────────
  const [dragging,   setDragging]   = useState(false)
  const [panOffset,  setPanOffset]  = useState({ x: 0, y: 0 })
  const dragState = useRef({ active: false, startX: 0, startY: 0 })
  const tweenObj  = useRef({ x: 0, y: 0 })

  const onBgMouseDown = (e: React.MouseEvent<SVGRectElement>) => {
    gsap.killTweensOf(tweenObj.current)
    dragState.current = {
      active: true,
      startX: e.clientX - tweenObj.current.x,
      startY: e.clientY - tweenObj.current.y,
    }
    setDragging(true)
  }

  const onSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragState.current.active) return
    const x = Math.max(-110, Math.min(110, e.clientX - dragState.current.startX))
    const y = Math.max(-110, Math.min(110, e.clientY - dragState.current.startY))
    tweenObj.current.x = x
    tweenObj.current.y = y
    setPanOffset({ x, y })
  }

  const onSvgMouseUp = () => {
    if (!dragState.current.active) return
    dragState.current.active = false
    setDragging(false)
    gsap.to(tweenObj.current, {
      x: 0, y: 0,
      duration: 1.1,
      ease: 'elastic.out(1, 0.38)',
      onUpdate: () => setPanOffset({ x: tweenObj.current.x, y: tweenObj.current.y }),
      onComplete: () => setPanOffset({ x: 0, y: 0 }),
    })
  }
  // ────────────────────────────────────────────────────────────────────────────

  useLayoutEffect(() => {
    if (!cardRef.current) return
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const els = [
      ...nodeRefs.current.filter((el): el is SVGGElement => el !== null),
      ...edgeRefs.current.filter((el): el is SVGGElement => el !== null),
    ]

    if (rm) {
      els.forEach(el => { el.style.opacity = '1' })
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(els, { opacity: 0 })
      gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          scroller: findScroller(cardRef.current!),
          start: 'top 80%',
          once: true,
        },
      }).to(els, { opacity: 1, duration: 0.65, ease: 'power2.out' })
    }, cardRef)

    return () => ctx.revert()
  }, [])

  const arrId  = `bw-a-${dark ? 'd' : 'l'}`
  const arrSId = `bw-as-${dark ? 'd' : 'l'}`

  return (
    <BentoCard colSpan={3} rowSpan={3} variant='default' label='Full-Stack Web Architecture' className='!p-0'>
      <div ref={cardRef} className={`flex h-full flex-col overflow-hidden rounded-2xl ${p.chromeRing}`}>

        {/* ── Browser chrome ── */}
        <div
          className='flex shrink-0 items-center gap-1.5 border-b px-4 py-3'
          style={{ background: p.chromeBg, borderColor: p.chromeBorder }}
        >
          <span className='h-3 w-3 rounded-full' style={{ background: '#FF5F57' }} />
          <span className='h-3 w-3 rounded-full' style={{ background: '#FEBC2E' }} />
          <span className='h-3 w-3 rounded-full' style={{ background: '#28C840' }} />
          <a
            href={GITHUB_URL}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='View on GitHub'
            className='ml-auto flex h-6 w-6 items-center justify-center rounded-full transition-colors'
            style={{ color: p.subColor }}
          >
            <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
              <path d={siGithub.path} />
            </svg>
          </a>
        </div>

        {/* ── SVG Diagram ── */}
        {/*
          Layout — viewBox 460 × 400
          ────────────────────────────────────────────────
          Node            y    h    bottom   cx
          User           14   42      56    230
          Frontend       80   82     162    230
          Backend       194   82     276    107
          Database      194   82     276    353
          Infra         308   74     382    230

          Internal (h=82 nodes): icon top=+12, bottom=+36
            title baseline=+53, subtitle=+64, pad-bottom=18
          Internal (h=74 Infra): icon top=+10, bottom=+34
            title baseline=+51, subtitle=+62, pad-bottom=12

          Edge attachment y:
            Frontend bottom = 162
            Backend/DB cy   = 235  (194 + 41)
            Backend/DB bottom = 276
            Infra top       = 308
        */}
        <div className='relative flex-1 overflow-hidden' style={{ background: p.canvas }}>
          <svg
            role='img'
            aria-labelledby='bw-title bw-desc'
            viewBox='0 0 460 400'
            width='100%'
            height='100%'
            preserveAspectRatio='xMidYMid meet'
            style={{ display: 'block', userSelect: 'none' }}
            onMouseMove={onSvgMouseMove}
            onMouseUp={onSvgMouseUp}
            onMouseLeave={onSvgMouseUp}
          >
            <title id='bw-title'>Full-Stack Web Architecture</title>
            <desc id='bw-desc'>
              C4 architecture: Frontend (React, TypeScript, RxJS, d3) calls Backend
              (NestJS, Express, Node.js) via REST/GraphQL; Backend reads/writes Database
              (PostgreSQL, MongoDB, Redis); both run on Infra (GCP, Docker, GitHub Actions).
            </desc>

            <defs>
              <pattern id='bw-dots' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'>
                <circle cx='1' cy='1' r='1' fill={p.dot} />
              </pattern>
              <marker id={arrId} markerWidth='7' markerHeight='5' refX='7' refY='2.5' orient='auto'>
                <path d='M0,0 L0,5 L7,2.5 z' fill={p.arrow} />
              </marker>
              <marker id={arrSId} markerWidth='7' markerHeight='5' refX='7' refY='2.5' orient='auto-start-reverse'>
                <path d='M0,0 L0,5 L7,2.5 z' fill={p.arrow} />
              </marker>
            </defs>

            <rect width='460' height='400' fill={p.canvas} />
            <rect width='460' height='400' fill='url(#bw-dots)'
              style={{ cursor: dragging ? 'grabbing' : 'grab' }}
              onMouseDown={onBgMouseDown} />

            {/* ── Pannable content ── */}
            <g transform={`translate(${panOffset.x},${panOffset.y})`}>

            {/* ── Edges ── */}

            {/* 1 · User → Frontend   (230,56)→(230,80) */}
            <g ref={el => { edgeRefs.current[0] = el }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovEdge(0)} onMouseLeave={() => setHovEdge(null)}>
              <path d='M 230 56 L 230 80' fill='none' stroke='transparent' strokeWidth={12} />
              <path d='M 230 56 L 230 80'
                fill='none'
                stroke={hovEdge === 0 ? p.neon : p.edge}
                strokeWidth={hovEdge === 0 ? 1.8 : 1.2}
                strokeDasharray='4.5 3'
                markerEnd={`url(#${arrId})`} />
              <EdgeLabel cx={230} cy={68} text='HTTP / WS' w={54}
                bg={p.labelBg} border={p.labelBorder} color={p.labelText} />
            </g>

            {/* 2 · Frontend → Backend   (107,162)→(107,194) */}
            <g ref={el => { edgeRefs.current[1] = el }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovEdge(1)} onMouseLeave={() => setHovEdge(null)}>
              <path d='M 107 162 L 107 194' fill='none' stroke='transparent' strokeWidth={12} />
              <path d='M 107 162 L 107 194'
                fill='none'
                stroke={hovEdge === 1 ? p.neon : p.edge}
                strokeWidth={hovEdge === 1 ? 1.8 : 1.2}
                strokeDasharray='4.5 3'
                markerEnd={`url(#${arrId})`} />
              <EdgeLabel cx={107} cy={178} text='REST / GraphQL' w={76}
                bg={p.labelBg} border={p.labelBorder} color={p.labelText} />
            </g>

            {/* 3 · Backend ↔ Database   (202,235)↔(258,235) */}
            <g ref={el => { edgeRefs.current[2] = el }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovEdge(2)} onMouseLeave={() => setHovEdge(null)}>
              <path d='M 202 235 L 258 235' fill='none' stroke='transparent' strokeWidth={12} />
              <path d='M 202 235 L 258 235'
                fill='none'
                stroke={hovEdge === 2 ? p.neon : p.edge}
                strokeWidth={hovEdge === 2 ? 1.8 : 1.2}
                strokeDasharray='4.5 3'
                markerStart={`url(#${arrSId})`}
                markerEnd={`url(#${arrId})`} />
              <EdgeLabel cx={230} cy={227} text='read / write' w={60}
                bg={p.labelBg} border={p.labelBorder} color={p.labelText} />
            </g>

            {/* 4 · Backend → Infra   (107,276)→(107,308) */}
            <g ref={el => { edgeRefs.current[3] = el }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovEdge(3)} onMouseLeave={() => setHovEdge(null)}>
              <path d='M 107 276 L 107 308' fill='none' stroke='transparent' strokeWidth={12} />
              <path d='M 107 276 L 107 308'
                fill='none'
                stroke={hovEdge === 3 ? p.neon : p.edge}
                strokeWidth={hovEdge === 3 ? 1.8 : 1.2}
                strokeDasharray='4.5 3'
                markerEnd={`url(#${arrId})`} />
              <EdgeLabel cx={107} cy={292} text='runs on' w={44}
                bg={p.labelBg} border={p.labelBorder} color={p.labelText} />
            </g>

            {/* 5 · Database → Infra   (353,276)→(353,308) */}
            <g ref={el => { edgeRefs.current[4] = el }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovEdge(4)} onMouseLeave={() => setHovEdge(null)}>
              <path d='M 353 276 L 353 308' fill='none' stroke='transparent' strokeWidth={12} />
              <path d='M 353 276 L 353 308'
                fill='none'
                stroke={hovEdge === 4 ? p.neon : p.edge}
                strokeWidth={hovEdge === 4 ? 1.8 : 1.2}
                strokeDasharray='4.5 3'
                markerEnd={`url(#${arrId})`} />
              <EdgeLabel cx={353} cy={292} text='runs on' w={44}
                bg={p.labelBg} border={p.labelBorder} color={p.labelText} />
            </g>

            {/* ── Nodes ── */}

            {/* User */}
            <g ref={el => { nodeRefs.current[0] = el }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovNode(0)} onMouseLeave={() => setHovNode(null)}>
              <rect x={175} y={14} width={110} height={42} rx={8}
                fill={p.nodeBg}
                stroke={hovNode === 0 ? p.neon : p.nodeBorder}
                strokeWidth={hovNode === 0 ? 1.5 : 0.75} />
              <circle cx={203} cy={27} r={6} fill='none' stroke={p.personStroke} strokeWidth={1.3} />
              <path d='M 191 43 Q 191 36 203 36 Q 215 36 215 43'
                fill='none' stroke={p.personStroke} strokeWidth={1.3} />
              <text x={228} y={30} fontSize={12} fontWeight='700' fill={p.titleColor}>User</text>
              <text x={228} y={43} fontSize={8} fill={p.subColor}>Actor</text>
            </g>

            {/* Frontend  — icons +12, title +53, sub +64 */}
            <g ref={el => { nodeRefs.current[1] = el }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovNode(1)} onMouseLeave={() => setHovNode(null)}>
              <rect x={30} y={80} width={400} height={82} rx={8}
                fill={p.nodeBg}
                stroke={hovNode === 1 ? p.neon : p.nodeBorder}
                strokeWidth={hovNode === 1 ? 1.5 : 0.75} />
              <IconRow icons={FRONTEND_ICONS} cx={230} y={92} fill={p.iconFill} />
              <text x={230} y={133} textAnchor='middle' fontSize={12.5} fontWeight='700' fill={p.titleColor}>
                Frontend
              </text>
              <text x={230} y={144} textAnchor='middle' fontSize={8.5} fill={p.subColor}>
                React · TypeScript · RxJS · d3
              </text>
            </g>

            {/* Backend  — icons +12, title +53, sub +64 */}
            <g ref={el => { nodeRefs.current[2] = el }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovNode(2)} onMouseLeave={() => setHovNode(null)}>
              <rect x={12} y={194} width={190} height={82} rx={8}
                fill={p.nodeBg}
                stroke={hovNode === 2 ? p.neon : p.nodeBorder}
                strokeWidth={hovNode === 2 ? 1.5 : 0.75} />
              <IconRow icons={BACKEND_ICONS} cx={107} y={206} fill={p.iconFill} />
              <text x={107} y={247} textAnchor='middle' fontSize={12.5} fontWeight='700' fill={p.titleColor}>
                Backend
              </text>
              <text x={107} y={258} textAnchor='middle' fontSize={8.5} fill={p.subColor}>
                NestJS · Express · Node.js
              </text>
            </g>

            {/* Database */}
            <g ref={el => { nodeRefs.current[3] = el }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovNode(3)} onMouseLeave={() => setHovNode(null)}>
              <rect x={258} y={194} width={190} height={82} rx={8}
                fill={p.nodeBg}
                stroke={hovNode === 3 ? p.neon : p.nodeBorder}
                strokeWidth={hovNode === 3 ? 1.5 : 0.75} />
              <IconRow icons={DB_ICONS} cx={353} y={206} fill={p.iconFill} />
              <text x={353} y={247} textAnchor='middle' fontSize={12.5} fontWeight='700' fill={p.titleColor}>
                Database
              </text>
              <text x={353} y={258} textAnchor='middle' fontSize={8.5} fill={p.subColor}>
                PostgreSQL · MongoDB · Redis
              </text>
            </g>

            {/* Infra  — icons +10, title +51, sub +62 */}
            <g ref={el => { nodeRefs.current[4] = el }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovNode(4)} onMouseLeave={() => setHovNode(null)}>
              <rect x={30} y={308} width={400} height={74} rx={8}
                fill={p.nodeBg}
                stroke={hovNode === 4 ? p.neon : p.nodeBorder}
                strokeWidth={hovNode === 4 ? 1.5 : 0.75} />
              <IconRow icons={INFRA_ICONS} cx={230} y={318} fill={p.iconFill} />
              <text x={230} y={359} textAnchor='middle' fontSize={12.5} fontWeight='700' fill={p.titleColor}>
                Infra
              </text>
              <text x={230} y={370} textAnchor='middle' fontSize={8.5} fill={p.subColor}>
                GCP · Docker · GitHub Actions
              </text>
            </g>

            {/* ── End pannable content ── */}
            </g>

          </svg>
        </div>

        <ul className='sr-only'>
          <li>Frontend: React, TypeScript, RxJS, d3</li>
          <li>Backend: NestJS, Express, Node.js</li>
          <li>Database: PostgreSQL, MongoDB, Redis</li>
          <li>Infra: GCP, Docker, GitHub Actions</li>
        </ul>

      </div>
    </BentoCard>
  )
}
