import gsap from 'gsap'
import { useCallback, useRef } from 'react'
import duckImg from 'shared/assets/images/duck.png'
import { BentoCard } from 'shared/ui'
import { useTheme } from 'shared/ui/theme/theme-context'

const SUN = { label: 'text-gray-500' }
const MOON = { label: 'text-white/40' }

const QUACKS = [
  'Quack Quack!',
  'Quaaack!',
  'Bug found! 🐛',
  'Have you tried\nlogging it?',
  'Quack! 🦆',
  "It's line 42.",
  'Did you check\nthe types?',
]

export default function DuckCard() {
  const { theme } = useTheme()
  const s = theme === 'light' ? SUN : MOON

  const bubbleRef = useRef<HTMLDivElement>(null)
  const tailRef = useRef<HTMLDivElement>(null)
  const duckRef = useRef<HTMLImageElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const quackIndexRef = useRef(0)

  const handleClick = useCallback(() => {
    // Kill any running animation
    if (timelineRef.current) {
      timelineRef.current.kill()
      timelineRef.current = null
    }

    // Pick next quack message (cycle through)
    const msg = QUACKS[quackIndexRef.current % QUACKS.length]
    quackIndexRef.current += 1

    // Update text content directly (no state needed)
    if (textRef.current) {
      textRef.current.textContent = msg
    }

    // Make bubble visible before animating
    if (bubbleRef.current) bubbleRef.current.style.visibility = 'visible'
    if (tailRef.current) tailRef.current.style.visibility = 'visible'

    const tl = gsap.timeline({
      onComplete: () => {
        // Hide after animation completes
        if (bubbleRef.current) bubbleRef.current.style.visibility = 'hidden'
        if (tailRef.current) tailRef.current.style.visibility = 'hidden'
        timelineRef.current = null
      },
    })

    timelineRef.current = tl

    // Duck squeeze reaction
    tl.to(
      duckRef.current,
      {
        scaleX: 0.88,
        scaleY: 1.12,
        duration: 0.12,
        ease: 'power2.out',
      },
      0
    )
    tl.to(
      duckRef.current,
      {
        scaleX: 1,
        scaleY: 1,
        duration: 0.4,
        ease: 'elastic.out(1, 0.4)',
      },
      0.12
    )

    // Bubble pop-in
    tl.fromTo(
      bubbleRef.current,
      { scale: 0, opacity: 0, y: 8 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'back.out(2.5)',
      },
      0.05
    )

    // Tail pop-in (slight delay)
    tl.fromTo(
      tailRef.current,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(2)',
      },
      0.12
    )

    // Hold, then fade out
    tl.to(
      [bubbleRef.current, tailRef.current],
      {
        opacity: 0,
        scale: 0.85,
        y: -6,
        duration: 0.35,
        ease: 'power2.in',
      },
      '+=1.4'
    )
  }, [])

  return (
    <BentoCard
      colSpan={1}
      rowSpan={1}
      variant='default'
      label='Rubber duck debugger'
      className='overflow-hidden p-0!'
    >
      <div className='relative h-full w-full'>
        <p
          className={`absolute top-5 w-full text-center text-[10px] font-medium tracking-widest uppercase ${s.label}`}
        >
          Debug Buddy
        </p>

        {/* Speech bubble — always in DOM, hidden until clicked */}
        <div
          ref={bubbleRef}
          className='absolute top-3 right-3 z-10 rounded-xl bg-white px-3 py-2 shadow-lg ring-1 ring-black/10'
          style={{
            transformOrigin: 'bottom left',
            opacity: 0,
            visibility: 'hidden',
            whiteSpace: 'pre-line',
            pointerEvents: 'none',
          }}
        >
          <span
            ref={textRef}
            className='block text-center text-xs leading-tight font-bold text-gray-800'
          />
        </div>
        {/* Cartoon tail — triangle pointing down-left toward the duck */}
        <div
          ref={tailRef}
          className='absolute top-13 right-10 z-10'
          style={{
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '10px solid white',
            transformOrigin: 'top center',
            opacity: 0,
            visibility: 'hidden',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.06))',
          }}
        />

        <img
          ref={duckRef}
          src={duckImg}
          alt='Rubber duck — debug buddy'
          className='absolute bottom-0 left-1/2 h-[85%] -translate-x-1/2 cursor-pointer object-contain drop-shadow-lg lg:h-auto lg:w-[85%]'
          style={{ transformOrigin: 'bottom center' }}
          draggable={false}
          onClick={handleClick}
        />
      </div>
    </BentoCard>
  )
}
