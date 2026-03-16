import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Cols = 2 | 3 | 4 | 6
type Gap = 2 | 3 | 4 | 6 | 8

interface BentoGridProps {
  children: ReactNode
  cols?: Cols
  gap?: Gap
  className?: string
}

const COLS: Record<Cols, string> = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6',
}

const GAP: Record<Gap, string> = {
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
}

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function BentoGrid({
  children,
  cols = 3,
  gap = 4,
  className = '',
}: BentoGridProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (reducedMotion() || !ref.current) return

    const cards = ref.current.querySelectorAll<HTMLElement>(':scope > article')
    if (!cards.length) return

    // Find the nearest scrollable ancestor (could be <main> or window)
    const findScroller = (el: HTMLElement): HTMLElement | typeof window => {
      let node = el.parentElement
      while (node) {
        const { overflowY } = window.getComputedStyle(node)
        if (overflowY === 'auto' || overflowY === 'scroll') return node
        node = node.parentElement
      }
      return window
    }
    const scroller = findScroller(ref.current)

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          scroller,
          start: 'top 85%',
          once: true,
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={ref}
      className={['grid', 'md:grid-flow-dense', COLS[cols], GAP[gap], className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
