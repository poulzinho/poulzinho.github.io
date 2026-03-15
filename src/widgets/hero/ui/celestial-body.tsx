import { gsap } from 'gsap'
import { memo, useEffect, useRef } from 'react'
import { COLORS } from 'shared/lib/colors'

const SIZE = 320
const CX = 160
const CY = 160
const R = 130

// Perspective-spaced horizontal cuts in the lower half
const CUTS = [8, 20, 35, 54, 77, 104]
const CUT_H = 6

function Sun() {
  const svgRef = useRef<SVGSVGElement>(null)
  const glowRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate CSS opacity on the glow layer — GPU-composited in both browsers
      gsap.to(glowRef.current, {
        opacity: 0.75,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to(svgRef.current, {
        scale: 1.06,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: '50% 50%',
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className='relative w-full dark:hidden'>
      {/* Glow layer: blurred circle, CSS filter composited by GPU */}
      <svg
        ref={glowRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden='true'
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          filter: 'blur(22px)',
          opacity: 0.35,
          overflow: 'visible',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <linearGradient id='vw-sun-glow-grad' x1={CX} y1={CY - R} x2={CX} y2={CY + R} gradientUnits='userSpaceOnUse'>
            <stop offset='0%' stopColor={COLORS.sunYellow} />
            <stop offset='100%' stopColor={COLORS.sunPink} />
          </linearGradient>
        </defs>
        <circle cx={CX} cy={CY} r={R} fill='url(#vw-sun-glow-grad)' />
      </svg>

      {/* Crisp sun — no SVG filter */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden='true'
        className='w-full overflow-visible'
      >
        <defs>
          <linearGradient id='vw-sun-grad' x1={CX} y1={CY - R} x2={CX} y2={CY + R} gradientUnits='userSpaceOnUse'>
            <stop offset='0%' stopColor={COLORS.sunYellow} />
            <stop offset='100%' stopColor={COLORS.sunPink} />
          </linearGradient>
          <mask id='vw-sun-mask'>
            <circle cx={CX} cy={CY} r={R} fill='white' />
            {CUTS.map((o, i) => (
              <rect key={i} x={0} y={CY + o} width={SIZE} height={CUT_H} fill='black' />
            ))}
          </mask>
        </defs>
        <rect x={0} y={0} width={SIZE} height={SIZE} fill='url(#vw-sun-grad)' mask='url(#vw-sun-mask)' />
      </svg>
    </div>
  )
}

function Moon() {
  const svgRef = useRef<SVGSVGElement>(null)
  const glowRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(glowRef.current, {
        opacity: 0.75,
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to(svgRef.current, {
        scale: 1.06,
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: '50% 50%',
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className='relative hidden w-full dark:block'>
      {/* Glow layer: blurred crescent, CSS filter composited by GPU */}
      <svg
        ref={glowRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden='true'
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          filter: 'blur(28px)',
          opacity: 0.7,
          overflow: 'visible',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <linearGradient id='vw-moon-glow-grad' x1={CX} y1={CY - R} x2={CX} y2={CY + R} gradientUnits='userSpaceOnUse'>
            <stop offset='0%' stopColor={COLORS.moonLavender} />
            <stop offset='100%' stopColor={COLORS.moonPurple} />
          </linearGradient>
          <mask id='vw-moon-glow-mask'>
            <circle cx={CX} cy={CY} r={R} fill='white' />
            <circle cx={CX + R * 0.42} cy={CY - R * 0.14} r={R * 0.78} fill='black' />
          </mask>
        </defs>
        <circle cx={CX} cy={CY} r={R} fill='url(#vw-moon-glow-grad)' mask='url(#vw-moon-glow-mask)' />
      </svg>

      {/* Crisp moon — no SVG filter */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden='true'
        className='w-full overflow-visible'
      >
        <defs>
          <linearGradient id='vw-moon-grad' x1={CX} y1={CY - R} x2={CX} y2={CY + R} gradientUnits='userSpaceOnUse'>
            <stop offset='0%' stopColor={COLORS.moonLavender} />
            <stop offset='100%' stopColor={COLORS.moonPurple} />
          </linearGradient>
          <mask id='vw-moon-mask'>
            <circle cx={CX} cy={CY} r={R} fill='white' />
            <circle cx={CX + R * 0.42} cy={CY - R * 0.14} r={R * 0.78} fill='black' />
          </mask>
        </defs>
        <circle cx={CX} cy={CY} r={R} fill='url(#vw-moon-grad)' mask='url(#vw-moon-mask)' />
      </svg>
    </div>
  )
}

function getTargetLayout() {
  const w = window.innerWidth
  if (w >= 1024) return { width: 480, left: 48, top: 120 }
  if (w >= 768)  return { width: 380, left: 32, top: 100 }
  if (w >= 640)  return { width: 320, left: 32, top: 90 }
  return                { width: 220, left: 16, top: 70 }
}

export default memo(function CelestialBody() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    gsap.set(el, getTargetLayout())

    const onResize = () => gsap.to(el, { ...getTargetLayout(), duration: 0.6, ease: 'power2.inOut' })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div ref={wrapperRef} className='absolute'>
      <Sun />
      <Moon />
    </div>
  )
})
