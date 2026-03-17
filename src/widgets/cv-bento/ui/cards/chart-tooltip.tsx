import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { type ThemeColors, type TooltipData } from './chart-engine'

// ─── Constants ───────────────────────────────────────────────────────────────

const FADE_IN_MS = 140
const FADE_OUT_MS = 200
const VIEWPORT_MARGIN = 8 // minimum px from any viewport edge

// ─── Component ───────────────────────────────────────────────────────────────
//
// Approach: derived-state pattern.
//
//   portalState  — the snapshot rendered inside the portal. Updated synchronously
//                  during render (not in an effect) whenever `data` is non-null,
//                  so content is always fresh before the opacity transition fires.
//
//   visible      — derived purely from `data !== null`. Controls CSS opacity.
//
//   mounted      — kept true until FADE_OUT_MS after data goes null, so the
//                  portal stays in the DOM while the fade-out plays.
//
// Viewport clamping:
//   After each render where content changes, we measure the tooltip's bounding
//   rect and nudge left/top so that the tooltip never overflows the viewport.
//   This handles left-edge, right-edge, top-edge, and bottom-edge overflow.

export default function ChartTooltip({
  data,
  colors,
}: {
  data: TooltipData | null
  colors: ThemeColors
}) {
  // ── Derived state (synchronous, during render) ───────────────────────────────
  const [portalState, setPortalState] = useState<TooltipData | null>(data)
  const [mounted, setMounted] = useState(data !== null)
  const [prevData, setPrevData] = useState<TooltipData | null>(data)

  // Clamped position offsets — applied after measuring the tooltip
  const [clampedPos, setClampedPos] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  })
  const tooltipRef = useRef<HTMLDivElement>(null)

  if (data !== prevData) {
    setPrevData(data)
    if (data !== null) {
      setPortalState(data)
      setMounted(true)
    }
  }

  // ── Visibility ───────────────────────────────────────────────────────────────
  const visible = data !== null

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (data !== null) {
      if (hideTimerRef.current !== null) {
        clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }
    } else {
      hideTimerRef.current = setTimeout(() => {
        setMounted(false)
        hideTimerRef.current = null
      }, FADE_OUT_MS + 20)
    }

    return () => {
      if (hideTimerRef.current !== null) {
        clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }
    }
  }, [data])

  // ── Viewport clamping ────────────────────────────────────────────────────────
  // After the tooltip renders (or data changes), measure it and clamp.
  const clamp = useCallback(() => {
    const el = tooltipRef.current
    if (!el || !portalState) return

    const anchorX = portalState.x
    const anchorY = portalState.y

    // Default: centered above the anchor point
    const tooltipW = el.offsetWidth
    const tooltipH = el.offsetHeight
    const gap = 14 // vertical gap above anchor

    let left = anchorX - tooltipW / 2
    let top = anchorY - tooltipH - gap

    const vw = window.innerWidth
    const vh = window.innerHeight

    // Clamp horizontal
    if (left < VIEWPORT_MARGIN) {
      left = VIEWPORT_MARGIN
    } else if (left + tooltipW > vw - VIEWPORT_MARGIN) {
      left = vw - VIEWPORT_MARGIN - tooltipW
    }

    // If tooltip overflows top, flip below the anchor
    if (top < VIEWPORT_MARGIN) {
      top = anchorY + gap
    }

    // Clamp bottom (if flipped and still overflows)
    if (top + tooltipH > vh - VIEWPORT_MARGIN) {
      top = vh - VIEWPORT_MARGIN - tooltipH
    }

    setClampedPos({ left, top })
  }, [portalState])

  useEffect(() => {
    if (mounted && portalState) {
      // Use rAF to measure after browser has laid out the portal content
      const id = requestAnimationFrame(clamp)
      return () => cancelAnimationFrame(id)
    }
  }, [mounted, portalState, clamp])

  if (!mounted || portalState === null) return null

  const single =
    portalState.items.length === 1 && !portalState.items[0].category

  return createPortal(
    <div
      ref={tooltipRef}
      className='pointer-events-none fixed z-9999 max-w-70 rounded-xl border px-4 py-3 shadow-lg'
      style={{
        left: clampedPos.left,
        top: clampedPos.top,
        opacity: visible ? 1 : 0,
        transition: visible
          ? `opacity ${FADE_IN_MS}ms ease-out ${Math.round(FADE_IN_MS * 0.4)}ms`
          : `opacity ${FADE_OUT_MS}ms ease-in`,
        backgroundColor: colors.dropdownBg,
        borderColor: colors.dropdownBorder,
        color: colors.dropdownText,
      }}
    >
      <div
        className='text-[11px] font-semibold'
        style={{ color: colors.headerText }}
      >
        {portalState.xLabel}
      </div>

      <div className='mt-2 flex flex-col gap-2'>
        {portalState.items.map((item, i) => (
          <div key={i} className='flex flex-col gap-0.5'>
            <div className='flex items-center gap-2 text-[11px]'>
              <span
                className='inline-block h-2.5 w-2.5 shrink-0 rounded-full'
                style={{
                  backgroundColor:
                    colors.series[item.colorIdx % colors.series.length],
                }}
              />
              {!single && (
                <span
                  className='font-medium'
                  style={{ color: colors.headerText }}
                >
                  {item.category}
                </span>
              )}
              <span
                className='ml-auto font-semibold tabular-nums'
                style={{ color: colors.headerText }}
              >
                {item.value}
              </span>
            </div>
            {item.meta && (
              <div
                className='ml-4.5 flex flex-col text-[10px] leading-snug'
                style={{ color: colors.axisText }}
              >
                {item.meta.split('\n').map((line, j) => (
                  <span key={j}>{line}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>,
    document.body
  )
}
