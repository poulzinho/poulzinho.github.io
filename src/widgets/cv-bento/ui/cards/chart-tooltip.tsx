import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { type ThemeColors, type TooltipData } from './chart-engine'

// ─── Constants ───────────────────────────────────────────────────────────────

const FADE_IN_MS = 140
const FADE_OUT_MS = 200

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
// No setTimeout deferred setState, no rAF, no stale-content flicker.

export default function ChartTooltip({
  data,
  colors,
}: {
  data: TooltipData | null
  colors: ThemeColors
}) {
  // ── Derived state (synchronous, during render) ───────────────────────────────
  // Canonical React pattern for deriving state from props without an effect:
  // track what we last saw and call setState during render when it changes.
  // React will immediately re-render with the updated state before painting,
  // so there is never a frame where portalState is stale relative to data.
  // See: react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [portalState, setPortalState] = useState<TooltipData | null>(data)
  const [mounted, setMounted] = useState(data !== null)
  const [prevData, setPrevData] = useState<TooltipData | null>(data)

  if (data !== prevData) {
    setPrevData(data)
    if (data !== null) {
      // New non-null data: update content and ensure portal is mounted —
      // both in a single synchronous render pass, no flicker.
      setPortalState(data)
      setMounted(true)
    }
    // data === null case: mounted stays true; the effect schedules the unmount
    // after the fade-out completes. portalState is intentionally left stale so
    // content stays readable during the fade-out.
  }

  // ── Visibility ───────────────────────────────────────────────────────────────
  const visible = data !== null

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (data !== null) {
      // Cancel any pending unmount from a previous hide cycle.
      // No setState needed here — portalState is already updated synchronously
      // in render via the derived-state block, and mounted is already true.
      if (hideTimerRef.current !== null) {
        clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }
    } else {
      // Keep portal mounted until fade-out finishes, then unmount.
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

  if (!mounted || portalState === null) return null

  const single =
    portalState.items.length === 1 && !portalState.items[0].category

  return createPortal(
    <div
      className='pointer-events-none fixed z-9999 max-w-70 rounded-xl border px-4 py-3 shadow-lg'
      style={{
        left: portalState.x,
        top: portalState.y,
        transform: 'translate(-50%, -100%) translateY(-14px)',
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
