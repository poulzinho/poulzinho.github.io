import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

/**
 * Any wheel/touch scroll navigates to the next or previous .scroll-panel.
 * Uses gsap ScrollToPlugin for smooth animation.
 * Cleaned up on unmount — no memory leaks.
 */
export function useScrollSnap() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let currentIndex = 0
    let isAnimating = false
    let touchStartY = 0

    const getPanels = (): HTMLElement[] =>
      gsap.utils.toArray<HTMLElement>('.scroll-panel')

    const goTo = (index: number) => {
      const panels = getPanels()
      if (isAnimating || index < 0 || index >= panels.length) return
      isAnimating = true
      currentIndex = index
      gsap.to(window, {
        scrollTo: { y: panels[index], autoKill: false },
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => { isAnimating = false },
      })
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (isAnimating) return
      goTo(e.deltaY > 0 ? currentIndex + 1 : currentIndex - 1)
    }

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (isAnimating) return
      const delta = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(delta) < 10) return
      goTo(delta > 0 ? currentIndex + 1 : currentIndex - 1)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(currentIndex + 1) }
      if (e.key === 'ArrowUp'   || e.key === 'PageUp')   { e.preventDefault(); goTo(currentIndex - 1) }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return containerRef
}
