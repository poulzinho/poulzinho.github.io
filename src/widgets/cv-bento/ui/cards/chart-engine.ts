// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ChartSpec {
  mark: 'line' | 'bar' | 'area'
  stacked?: boolean
  data: { values: Record<string, unknown>[] }
  encoding: {
    x: { field: string; type: 'ordinal' | 'quantitative' | 'temporal' }
    y: { field: string; type: 'quantitative' }
    color?: { field: string; type: 'nominal' }
  }
}

export interface DatasetPreset {
  id: string
  label: string
  defaultMark: ChartSpec['mark']
  spec: ChartSpec
}

export interface ThemeColors {
  canvasBg: string
  gridLine: string
  axisText: string
  axisLine: string
  series: string[]
  headerBg: string
  headerText: string
  footerText: string
  dropdownBg: string
  dropdownBorder: string
  dropdownText: string
}

export interface HitTarget {
  px: number // pixel x
  py: number // pixel y
  xLabel: string // x-axis value
  yValue: number // y-axis value
  category: string // series name (or '_default')
  colorIdx: number // index into series colors
  meta?: string // extra context for tooltip
}

export interface TooltipData {
  x: number // viewport pixel x (for fixed positioning)
  y: number // viewport pixel y (for fixed positioning)
  xLabel: string
  items: { category: string; value: number; colorIdx: number; meta?: string }[]
}

// ─── Theme palettes ─────────────────────────────────────────────────────────────

export const SUN: ThemeColors = {
  canvasBg: '#FFFFFF',
  gridLine: 'rgba(0,0,0,0.06)',
  axisText: '#6B7280',
  axisLine: 'rgba(0,0,0,0.12)',
  series: [
    '#3B82F6',
    '#F59E0B',
    '#10B981',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4',
  ],
  headerBg: 'rgba(0,0,0,0.03)',
  headerText: '#374151',
  footerText: '#6B7280',
  dropdownBg: '#FFFFFF',
  dropdownBorder: 'rgba(0,0,0,0.12)',
  dropdownText: '#374151',
}

export const MOON: ThemeColors = {
  canvasBg: '#1A1D23',
  gridLine: 'rgba(255,255,255,0.06)',
  axisText: '#9CA3AF',
  axisLine: 'rgba(255,255,255,0.12)',
  series: [
    '#60A5FA',
    '#FBBF24',
    '#34D399',
    '#F87171',
    '#A78BFA',
    '#F472B6',
    '#22D3EE',
  ],
  headerBg: 'rgba(255,255,255,0.04)',
  headerText: '#E5E7EB',
  footerText: '#9CA3AF',
  dropdownBg: '#2A2D35',
  dropdownBorder: 'rgba(255,255,255,0.10)',
  dropdownText: '#E5E7EB',
}

// ─── Canvas rendering engine ────────────────────────────────────────────────────

export const PADDING = { top: 28, right: 20, bottom: 54, left: 56 }

/** Measure the pixel width of a string at the x-axis label font. */
function measureXLabel(ctx: CanvasRenderingContext2D, text: string): number {
  ctx.save()
  ctx.font = '10px system-ui, -apple-system, sans-serif'
  const w = ctx.measureText(text).width
  ctx.restore()
  return w
}

/** Decide whether x-axis labels should be rotated, and compute the
 *  dynamic bottom padding accordingly. */
export function computeXLabelLayout(
  ctx: CanvasRenderingContext2D | null,
  xLabels: string[],
  plotWidth: number
): { rotateXLabels: boolean; bottomPadding: number } {
  const GAP = 6 // minimum horizontal gap between labels
  const n = xLabels.length
  if (n === 0 || !ctx)
    return { rotateXLabels: false, bottomPadding: PADDING.bottom }

  const maxLabelWidth = Math.max(...xLabels.map(l => measureXLabel(ctx, l)))
  const availablePerLabel = plotWidth / n

  if (maxLabelWidth + GAP <= availablePerLabel) {
    return { rotateXLabels: false, bottomPadding: PADDING.bottom }
  }

  // Rotated: label contributes sin(45°) * width vertically + some spacing
  const RAD = Math.PI / 4
  const rotatedHeight = Math.ceil(maxLabelWidth * Math.sin(RAD)) + 18 // 18 = tick offset + axis title
  const dynamicBottom = Math.max(PADDING.bottom, rotatedHeight + 24)
  return { rotateXLabels: true, bottomPadding: dynamicBottom }
}

export interface Scales {
  xLabels: string[]
  xPositions: number[]
  yMin: number
  yMax: number
  yToPixel: (v: number) => number
  plotLeft: number
  plotRight: number
  plotTop: number
  plotBottom: number
  groups: Map<string, { x: string; y: number; meta?: string }[]>
  categories: string[]
  /** Whether x-axis labels should be drawn at 45° to avoid collision. */
  rotateXLabels: boolean
}

// ─── Easing ──────────────────────────────────────────────────────────────────────

/** Quartic ease-out: gentler start than cubic, smooth deceleration. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

/** Linear interpolation. */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

// ─── Animation state ─────────────────────────────────────────────────────────────
//
// Each canvas instance maintains its own AnimationState. The chart engine is
// a pure-function renderer; the state lives in the card components and is
// passed in via RenderOptions.

export interface AnimationState {
  /** 0 → 1 draw-in progress for the current render cycle */
  progress: number
  /** RAF handle so we can cancel on unmount */
  rafHandle: number
  /** Timestamp when the current animation started */
  startTime: number | null
  /** Total duration in ms */
  duration: number
  /** Whether the draw-in has completed (skip RAF cost on subsequent redraws) */
  done: boolean
  /** Previously hovered xLabel — used to detect hover changes */
  hoveredXLabel: string | null
  /**
   * 0 = no dim active (all series at full opacity).
   * 1 = dim fully applied (non-hovered series at minimum opacity).
   * Animated by startHoverTransition so the dim eases in and out softly.
   */
  hoverAlpha: number
  /** RAF handle for the hover transition loop (separate from draw-in). */
  hoverRafHandle: number
}

export function createAnimationState(duration = 900): AnimationState {
  return {
    progress: 0,
    rafHandle: 0,
    startTime: null,
    duration,
    done: false,
    hoveredXLabel: null,
    hoverAlpha: 0,
    hoverRafHandle: 0,
  }
}

/**
 * Animate `anim.hoverAlpha` toward `target` (0 or 1) over ~220 ms.
 * Calls `onFrame` each tick so the canvas can redraw with the new alpha.
 * Returns a cancel function.
 */
export function startHoverTransition(
  anim: AnimationState,
  target: 0 | 1,
  onFrame: () => void
): () => void {
  cancelAnimationFrame(anim.hoverRafHandle)

  const SPEED = 1 / 220 // fraction per ms — 220 ms full sweep

  let lastTime: number | null = null

  const tick = (now: number) => {
    const dt = lastTime === null ? 0 : now - lastTime
    lastTime = now

    const delta = SPEED * dt
    if (target === 1) {
      anim.hoverAlpha = Math.min(1, anim.hoverAlpha + delta)
    } else {
      anim.hoverAlpha = Math.max(0, anim.hoverAlpha - delta)
    }

    onFrame()

    if (anim.hoverAlpha !== target) {
      anim.hoverRafHandle = requestAnimationFrame(tick)
    }
  }

  anim.hoverRafHandle = requestAnimationFrame(tick)

  return () => cancelAnimationFrame(anim.hoverRafHandle)
}

// ─── computeScales ───────────────────────────────────────────────────────────────

export function computeScales(
  spec: ChartSpec,
  w: number,
  h: number,
  rotateXLabels = false,
  bottomPadding = PADDING.bottom
): Scales {
  const xField = spec.encoding.x.field
  const yField = spec.encoding.y.field
  const colorField = spec.encoding.color?.field

  const plotLeft = PADDING.left
  const plotRight = w - PADDING.right
  const plotTop = PADDING.top
  const plotBottom = h - bottomPadding

  // Unique x labels in order of appearance
  const xLabels = [...new Set(spec.data.values.map(d => String(d[xField])))]

  // x positions — band-style for bars (centered in equal-width bands),
  // point-style for line/area (edge-to-edge)
  const isBand = spec.mark === 'bar'
  const n = xLabels.length
  let xPositions: number[]

  if (isBand && n > 0) {
    const bandWidth = (plotRight - plotLeft) / n
    xPositions = xLabels.map((_, i) => plotLeft + bandWidth * i + bandWidth / 2)
  } else {
    const xStep = n > 1 ? (plotRight - plotLeft) / (n - 1) : 0
    xPositions = xLabels.map((_, i) => plotLeft + i * xStep)
  }

  // y range — for stacked bars sum values per x label
  let yMax: number
  if (spec.stacked && spec.mark === 'bar') {
    const sums = new Map<string, number>()
    for (const d of spec.data.values) {
      const key = String(d[xField])
      sums.set(key, (sums.get(key) ?? 0) + Number(d[yField]))
    }
    yMax = Math.ceil(Math.max(...sums.values()) * 1.15)
  } else {
    const yValues = spec.data.values.map(d => Number(d[yField]))
    yMax = Math.ceil(Math.max(...yValues) * 1.15)
  }
  const yMin = 0

  const yToPixel = (v: number) =>
    plotBottom - ((v - yMin) / (yMax - yMin)) * (plotBottom - plotTop)

  // Group by color field, aggregating duplicate (x, category) pairs
  const groups = new Map<string, { x: string; y: number; meta?: string }[]>()
  const _addToGroup = (
    groupKey: string,
    x: string,
    y: number,
    meta?: string
  ) => {
    if (!groups.has(groupKey)) groups.set(groupKey, [])
    const arr = groups.get(groupKey)!
    const existing = arr.find(p => p.x === x)
    if (existing) {
      existing.y += y
      if (meta)
        existing.meta = existing.meta ? `${existing.meta}\n${meta}` : meta
    } else {
      arr.push({ x, y, meta })
    }
  }

  if (colorField) {
    for (const d of spec.data.values) {
      _addToGroup(
        String(d[colorField]),
        String(d[xField]),
        Number(d[yField]),
        d.meta as string | undefined
      )
    }
  } else {
    for (const d of spec.data.values) {
      _addToGroup(
        '_default',
        String(d[xField]),
        Number(d[yField]),
        d.meta as string | undefined
      )
    }
  }

  const categories = [...groups.keys()]

  return {
    xLabels,
    xPositions,
    yMin,
    yMax,
    yToPixel,
    plotLeft,
    plotRight,
    plotTop,
    plotBottom,
    groups,
    categories,
    rotateXLabels,
  }
}

// ─── Gradient helpers ────────────────────────────────────────────────────────────

/**
 * Create a vertical linear gradient for a bar segment.
 * Subtle: full color at top, 85% at bottom — barely perceptible depth.
 */
function barGradient(
  ctx: CanvasRenderingContext2D,
  color: string,
  y: number,
  height: number
): CanvasGradient {
  const g = ctx.createLinearGradient(0, y, 0, y + height)
  g.addColorStop(0, color)
  g.addColorStop(1, hexToRgba(color, 0.82))
  return g
}

/**
 * Create a vertical linear gradient for an area fill.
 * Subtle: 22% opacity at peak, 0% at baseline.
 */
function areaGradient(
  ctx: CanvasRenderingContext2D,
  color: string,
  plotTop: number,
  plotBottom: number
): CanvasGradient {
  const g = ctx.createLinearGradient(0, plotTop, 0, plotBottom)
  g.addColorStop(0, hexToRgba(color, 0.22))
  g.addColorStop(1, hexToRgba(color, 0.0))
  return g
}

/**
 * Convert a CSS hex color (#RRGGBB or #RGB) to rgba(r,g,b,a).
 * Falls back to the original string if parsing fails.
 */
function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map(c => c + c)
          .join('')
      : clean
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return hex
  return `rgba(${r},${g},${b},${alpha})`
}

// ─── Bezier spline ───────────────────────────────────────────────────────────────

/**
 * Draw a cardinal / Catmull-Rom spline through the given points.
 *
 * Tension is kept low (0.12) to produce gentle, organic curves.
 * Control points are additionally clamped so they never cross the x-midpoint
 * between their neighbours — this eliminates the overshoot kinks that appear
 * when data values change direction sharply (e.g. a plateau followed by a rise).
 */
function splineTo(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  tension = 0.12
) {
  if (points.length < 2) return
  ctx.moveTo(points[0].x, points[0].y)

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(i + 2, points.length - 1)]

    let cp1x = p1.x + (p2.x - p0.x) * tension
    let cp1y = p1.y + (p2.y - p0.y) * tension
    let cp2x = p2.x - (p3.x - p1.x) * tension
    let cp2y = p2.y - (p3.y - p1.y) * tension

    // Clamp control-point x values to the segment [p1.x, p2.x] so the curve
    // never travels backwards — prevents S-curve kinks at direction changes.
    const xMin = Math.min(p1.x, p2.x)
    const xMax = Math.max(p1.x, p2.x)
    cp1x = Math.max(xMin, Math.min(xMax, cp1x))
    cp2x = Math.max(xMin, Math.min(xMax, cp2x))

    // Monotone-y guard: if p1 and p2 have the same y (plateau), flatten the
    // control points vertically to avoid micro-bumps.
    if (Math.abs(p2.y - p1.y) < 0.5) {
      cp1y = p1.y
      cp2y = p2.y
    }

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y)
  }
}

// ─── drawGrid ────────────────────────────────────────────────────────────────────

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  scales: Scales,
  colors: ThemeColors,
  spec: ChartSpec
) {
  const { yMin, yMax, yToPixel, plotLeft, plotRight, plotBottom } = scales

  const tickCount = 5
  const step = (yMax - yMin) / tickCount

  ctx.font = '10px system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'

  for (let i = 0; i <= tickCount; i++) {
    const val = yMin + step * i
    const y = yToPixel(val)

    ctx.beginPath()
    ctx.strokeStyle = colors.gridLine
    ctx.lineWidth = 1
    ctx.moveTo(plotLeft, y)
    ctx.lineTo(plotRight, y)
    ctx.stroke()

    ctx.fillStyle = colors.axisText
    ctx.fillText(String(Math.round(val)), plotLeft - 8, y)
  }

  // x-axis baseline
  ctx.beginPath()
  ctx.strokeStyle = colors.axisLine
  ctx.lineWidth = 1
  ctx.moveTo(plotLeft, plotBottom)
  ctx.lineTo(plotRight, plotBottom)
  ctx.stroke()

  // x-axis tick labels
  ctx.fillStyle = colors.axisText
  ctx.font = '10px system-ui, -apple-system, sans-serif'

  if (scales.rotateXLabels) {
    // Rotated labels — 45° counter-clockwise, anchored at top-right
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    const RAD = Math.PI / 4
    for (let i = 0; i < scales.xLabels.length; i++) {
      ctx.save()
      ctx.translate(scales.xPositions[i], plotBottom + 8)
      ctx.rotate(-RAD)
      ctx.fillText(scales.xLabels[i], 0, 0)
      ctx.restore()
    }
  } else {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    for (let i = 0; i < scales.xLabels.length; i++) {
      ctx.fillText(scales.xLabels[i], scales.xPositions[i], plotBottom + 8)
    }
  }

  // x-axis title — pushed down further when labels are rotated
  const axisTitleY = scales.rotateXLabels
    ? plotBottom +
      14 +
      Math.ceil(
        Math.max(...scales.xLabels.map(l => ctx.measureText(l).width)) *
          Math.sin(Math.PI / 4)
      )
    : plotBottom + 24
  ctx.font = '11px system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillStyle = colors.axisText
  ctx.fillText(spec.encoding.x.field, (plotLeft + plotRight) / 2, axisTitleY)

  // y-axis title (rotated)
  ctx.save()
  ctx.font = '11px system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = colors.axisText
  const yCenterY = (scales.plotTop + plotBottom) / 2
  ctx.translate(14, yCenterY)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText(spec.encoding.y.field, 0, 0)
  ctx.restore()
}

// ─── drawRoundedBar ──────────────────────────────────────────────────────────────

export function drawRoundedBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  roundTop: boolean
) {
  if (h <= 0) return
  const r = roundTop ? Math.min(4, w / 2, h) : 0
  ctx.beginPath()
  ctx.moveTo(x, y + h)
  ctx.lineTo(x, y + r)
  if (roundTop) {
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  } else {
    ctx.lineTo(x, y)
    ctx.lineTo(x + w, y)
  }
  ctx.lineTo(x + w, y + h)
  ctx.closePath()
  ctx.fill()
}

// ─── drawGroupedBars ─────────────────────────────────────────────────────────────

export function drawGroupedBars(
  ctx: CanvasRenderingContext2D,
  scales: Scales,
  colors: ThemeColors,
  progress: number,
  hoveredXLabel: string | null,
  hoverAlpha: number
) {
  const {
    xLabels,
    xPositions,
    yToPixel,
    plotLeft,
    plotRight,
    plotBottom,
    categories,
    groups,
  } = scales
  const n = xLabels.length
  const bandWidth = n > 0 ? (plotRight - plotLeft) / n : plotRight - plotLeft
  const totalBarWidth = bandWidth * 0.7

  const presentAt = new Map<string, { cat: string; ci: number }[]>()
  for (const xLabel of xLabels) {
    const present: { cat: string; ci: number }[] = []
    categories.forEach((cat, ci) => {
      const data = groups.get(cat)!
      if (data.some(d => d.x === xLabel && d.y > 0)) present.push({ cat, ci })
    })
    presentAt.set(xLabel, present)
  }

  for (let xi = 0; xi < xLabels.length; xi++) {
    const xLabel = xLabels[xi]
    const cx = xPositions[xi]
    const present = presentAt.get(xLabel)!
    const localCount = present.length
    if (localCount === 0) continue

    const isHovered = hoveredXLabel === xLabel
    const hasHover = hoveredXLabel !== null
    const dimmed = hasHover && !isHovered

    // hoverAlpha is passed via the outer scope of renderChart
    const alpha = dimmed ? lerp(1, 0.28, hoverAlpha) : 1

    const singleBarWidth = totalBarWidth / localCount
    const barGap = localCount > 1 ? 1 : 0

    present.forEach((entry, li) => {
      const data = groups.get(entry.cat)!
      const pt = data.find(d => d.x === xLabel)
      if (!pt) return

      const rawColor = colors.series[entry.ci % colors.series.length]
      const x = cx - totalBarWidth / 2 + li * singleBarWidth + barGap
      const fullH = plotBottom - yToPixel(pt.y)
      const h = fullH * progress
      const y = plotBottom - h
      const w = singleBarWidth - barGap * 2

      ctx.save()
      ctx.globalAlpha = alpha

      ctx.fillStyle = barGradient(ctx, rawColor, y, h)
      drawRoundedBar(ctx, x, y, w, h, true)
      ctx.restore()
    })
  }
}

// ─── drawStackedBars ─────────────────────────────────────────────────────────────

export function drawStackedBars(
  ctx: CanvasRenderingContext2D,
  scales: Scales,
  colors: ThemeColors,
  progress: number,
  hoveredXLabel: string | null,
  hoverAlpha: number
) {
  const {
    xLabels,
    xPositions,
    yToPixel,
    plotLeft,
    plotRight,
    plotBottom,
    categories,
    groups,
  } = scales
  const n = xLabels.length
  const bandWidth = n > 0 ? (plotRight - plotLeft) / n : plotRight - plotLeft
  const barWidth = bandWidth * 0.5

  for (let xi = 0; xi < xLabels.length; xi++) {
    const xLabel = xLabels[xi]
    const cx = xPositions[xi]
    const x = cx - barWidth / 2
    let stackBottom = plotBottom

    const isHovered = hoveredXLabel === xLabel
    const hasHover = hoveredXLabel !== null
    const dimmed = hasHover && !isHovered
    const colAlpha = dimmed ? lerp(1, 0.28, hoverAlpha) : 1

    for (let ci = 0; ci < categories.length; ci++) {
      const cat = categories[ci]
      const data = groups.get(cat)!
      const pt = data.find(d => d.x === xLabel)
      if (!pt) continue

      const fullSegH = plotBottom - yToPixel(pt.y)
      if (fullSegH <= 0) continue

      const segH = fullSegH * progress
      const segTop = stackBottom - segH
      const isTop =
        ci === categories.length - 1 ||
        categories.slice(ci + 1).every(c => {
          const d = groups.get(c)!.find(d => d.x === xLabel)
          return !d || d.y === 0
        })

      const rawColor = colors.series[ci % colors.series.length]

      ctx.save()
      ctx.globalAlpha = colAlpha

      ctx.fillStyle = barGradient(ctx, rawColor, segTop, segH)
      drawRoundedBar(ctx, x, segTop, barWidth, segH, isTop)
      ctx.restore()

      stackBottom = segTop
    }
  }
}

export function drawBars(
  ctx: CanvasRenderingContext2D,
  scales: Scales,
  colors: ThemeColors,
  stacked: boolean,
  progress: number,
  hoveredXLabel: string | null,
  hoverAlpha: number
) {
  if (stacked)
    drawStackedBars(ctx, scales, colors, progress, hoveredXLabel, hoverAlpha)
  else drawGroupedBars(ctx, scales, colors, progress, hoveredXLabel, hoverAlpha)
}

// ─── drawLines ───────────────────────────────────────────────────────────────────

export function drawLines(
  ctx: CanvasRenderingContext2D,
  scales: Scales,
  colors: ThemeColors,
  progress: number,
  hoveredXLabel: string | null,
  hoverAlpha: number
) {
  const {
    xLabels,
    xPositions,
    yToPixel,
    categories,
    groups,
    plotLeft,
    plotRight,
  } = scales

  // Clipping rect — reveals the chart left-to-right as progress goes 0→1
  const clipWidth = (plotRight - plotLeft) * progress + plotLeft
  ctx.save()
  ctx.beginPath()
  ctx.rect(0, 0, clipWidth, 99999)
  ctx.clip()

  categories.forEach((cat, ci) => {
    const data = groups.get(cat)!
    const rawColor = colors.series[ci % colors.series.length]

    const hasHover = hoveredXLabel !== null
    const isActive = !hasHover || data.some(d => d.x === hoveredXLabel)
    const dimmed = hasHover && !isActive

    const pts = data
      .map(d => {
        const xi = xLabels.indexOf(d.x)
        if (xi < 0) return null
        return { x: xPositions[xi], y: yToPixel(d.y) }
      })
      .filter((p): p is { x: number; y: number } => p !== null)

    if (pts.length < 1) return

    ctx.save()
    ctx.globalAlpha = dimmed ? lerp(1, 0.18, hoverAlpha) : 1

    // Line stroke
    ctx.beginPath()
    ctx.strokeStyle = rawColor
    ctx.lineWidth = isActive && hasHover ? 3 : 2.5
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    splineTo(ctx, pts)
    ctx.stroke()

    ctx.restore()

    // Dots
    ctx.save()
    ctx.globalAlpha = dimmed ? lerp(1, 0.18, hoverAlpha) : 1

    for (const pt of pts) {
      const isHoveredDot =
        hoveredXLabel !== null &&
        data.some(
          d =>
            d.x === hoveredXLabel && xPositions[xLabels.indexOf(d.x)] === pt.x
        )

      const radius = isHoveredDot && progress >= 1 ? 5.5 : 3.5

      // White ring for hovered dot
      if (isHoveredDot && progress >= 1) {
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, radius + 2, 0, Math.PI * 2)
        ctx.fillStyle = colors.canvasBg
        ctx.fill()
      }

      ctx.beginPath()
      ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = rawColor
      ctx.fill()
    }
    ctx.restore()
  })

  ctx.restore() // remove clip
}

// ─── drawArea ────────────────────────────────────────────────────────────────────

export function drawArea(
  ctx: CanvasRenderingContext2D,
  scales: Scales,
  colors: ThemeColors,
  progress: number,
  hoveredXLabel: string | null,
  hoverAlpha: number
) {
  const {
    xLabels,
    xPositions,
    yToPixel,
    plotBottom,
    plotTop,
    categories,
    groups,
    plotLeft,
    plotRight,
  } = scales

  // Clip to revealed portion
  const clipWidth = (plotRight - plotLeft) * progress + plotLeft
  ctx.save()
  ctx.beginPath()
  ctx.rect(0, 0, clipWidth, 99999)
  ctx.clip()

  categories.forEach((cat, ci) => {
    const data = groups.get(cat)!
    const rawColor = colors.series[ci % colors.series.length]

    const hasHover = hoveredXLabel !== null
    const isActive = !hasHover || data.some(d => d.x === hoveredXLabel)
    const dimmed = hasHover && !isActive

    const pts = data
      .map(d => {
        const xi = xLabels.indexOf(d.x)
        if (xi < 0) return null
        return { x: xPositions[xi], y: yToPixel(d.y) }
      })
      .filter((p): p is { x: number; y: number } => p !== null)

    if (pts.length < 2) return

    ctx.save()
    ctx.globalAlpha = dimmed ? lerp(1, 0.15, hoverAlpha) : 1

    // ── Gradient fill ────────────────────────────────────────────────────────
    ctx.beginPath()
    splineTo(ctx, pts)
    // close the shape down to the baseline
    ctx.lineTo(pts[pts.length - 1].x, plotBottom)
    ctx.lineTo(pts[0].x, plotBottom)
    ctx.closePath()
    ctx.fillStyle = areaGradient(ctx, rawColor, plotTop, plotBottom)
    ctx.fill()

    // ── Stroke on top ────────────────────────────────────────────────────────
    ctx.beginPath()
    ctx.strokeStyle = rawColor
    ctx.lineWidth = isActive && hasHover ? 3 : 2
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    splineTo(ctx, pts)
    ctx.stroke()

    ctx.restore()
  })

  ctx.restore() // remove clip
}

// ─── drawLegend ──────────────────────────────────────────────────────────────────

export function drawLegend(
  ctx: CanvasRenderingContext2D,
  scales: Scales,
  colors: ThemeColors,
  w: number
) {
  if (scales.categories.length <= 1 && scales.categories[0] === '_default')
    return

  ctx.font = '10px system-ui, -apple-system, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'

  const items = scales.categories.map(cat => ({
    label: cat,
    width: ctx.measureText(cat).width + 18,
  }))
  const totalWidth = items.reduce((s, it) => s + it.width, 0)

  let x = w - PADDING.right - totalWidth
  const y = 12

  items.forEach((item, i) => {
    ctx.fillStyle = colors.series[i % colors.series.length]
    ctx.beginPath()
    ctx.roundRect(x, y - 4, 8, 8, 2)
    ctx.fill()

    ctx.fillStyle = colors.axisText
    ctx.fillText(item.label, x + 12, y)

    x += item.width
  })
}

// ─── buildHitTargets ─────────────────────────────────────────────────────────────

export function buildHitTargets(scales: Scales, spec: ChartSpec): HitTarget[] {
  const {
    xLabels,
    xPositions,
    yToPixel,
    plotLeft,
    plotRight,
    plotBottom,
    categories,
    groups,
  } = scales
  const targets: HitTarget[] = []

  const stackTops = new Map<string, number>()
  if (spec.stacked && spec.mark === 'bar') {
    for (const xLabel of xLabels) stackTops.set(xLabel, plotBottom)
  }

  categories.forEach((cat, ci) => {
    const data = groups.get(cat)!

    if (spec.mark === 'bar' && spec.stacked) {
      for (const xLabel of xLabels) {
        const pt = data.find(d => d.x === xLabel)
        if (!pt) continue
        const xi = xLabels.indexOf(xLabel)
        const px = xPositions[xi]
        const segH = plotBottom - yToPixel(pt.y)
        if (segH <= 0) continue
        const currentTop = stackTops.get(xLabel)!
        const py = currentTop - segH
        stackTops.set(xLabel, py)

        targets.push({
          px,
          py,
          xLabel: pt.x,
          yValue: pt.y,
          category: cat,
          colorIdx: ci,
          meta: pt.meta,
        })
      }
    } else {
      for (const pt of data) {
        const xi = xLabels.indexOf(pt.x)
        if (xi < 0) continue

        let px: number
        let py: number

        if (spec.mark === 'bar') {
          const n = xLabels.length
          const bandWidth =
            n > 0 ? (plotRight - plotLeft) / n : plotRight - plotLeft
          const totalBarWidth = bandWidth * 0.7
          const present: { cat: string; ci: number }[] = []
          categories.forEach((c, cIdx) => {
            const cData = groups.get(c)!
            if (cData.some(d => d.x === pt.x && d.y > 0))
              present.push({ cat: c, ci: cIdx })
          })
          const localCount = present.length || 1
          const singleBarWidth = totalBarWidth / localCount
          const li = present.findIndex(p => p.cat === cat)
          if (li < 0) continue
          const cx = xPositions[xi]
          px = cx - totalBarWidth / 2 + li * singleBarWidth + singleBarWidth / 2
          py = yToPixel(pt.y)
        } else {
          px = xPositions[xi]
          py = yToPixel(pt.y)
        }

        targets.push({
          px,
          py,
          xLabel: pt.x,
          yValue: pt.y,
          category: cat,
          colorIdx: ci,
          meta: pt.meta,
        })
      }
    }
  })

  return targets
}

// ─── renderChart ─────────────────────────────────────────────────────────────────
//
// The progress + hoveredXLabel parameters are separated from the spec so that
// hover changes can trigger a redraw without restarting the animation.

export function renderChart(
  ctx: CanvasRenderingContext2D,
  spec: ChartSpec,
  colors: ThemeColors,
  w: number,
  h: number,
  progress = 1,
  hoveredXLabel: string | null = null,
  hoverAlpha = 0
): HitTarget[] {
  ctx.clearRect(0, 0, w, h)

  ctx.fillStyle = colors.canvasBg
  ctx.fillRect(0, 0, w, h)

  const easedProgress = easeOutCubic(Math.min(progress, 1))

  // Pre-compute x labels to decide if rotation is needed
  const xField = spec.encoding.x.field
  const xLabels = [...new Set(spec.data.values.map(d => String(d[xField])))]
  const plotWidth = w - PADDING.left - PADDING.right
  const { rotateXLabels, bottomPadding } = computeXLabelLayout(
    ctx,
    xLabels,
    plotWidth
  )

  const scales = computeScales(spec, w, h, rotateXLabels, bottomPadding)

  drawGrid(ctx, scales, colors, spec)

  switch (spec.mark) {
    case 'bar':
      drawBars(
        ctx,
        scales,
        colors,
        !!spec.stacked,
        easedProgress,
        hoveredXLabel,
        hoverAlpha
      )
      break
    case 'line':
      drawLines(ctx, scales, colors, easedProgress, hoveredXLabel, hoverAlpha)
      break
    case 'area':
      drawArea(ctx, scales, colors, easedProgress, hoveredXLabel, hoverAlpha)
      break
  }

  drawLegend(ctx, scales, colors, w)

  return buildHitTargets(scales, spec)
}

// ─── startAnimation ──────────────────────────────────────────────────────────────
//
// Drives the draw-in animation for a canvas. Calls `onFrame(progress)` each RAF
// tick until progress reaches 1. Returns a cancel function.

export function startAnimation(
  anim: AnimationState,
  onFrame: (progress: number) => void
): () => void {
  // Reset
  anim.done = false
  anim.progress = 0
  anim.startTime = null

  const tick = (now: number) => {
    if (anim.startTime === null) anim.startTime = now
    const elapsed = now - anim.startTime
    anim.progress = Math.min(elapsed / anim.duration, 1)

    onFrame(anim.progress)

    if (anim.progress < 1) {
      anim.rafHandle = requestAnimationFrame(tick)
    } else {
      anim.done = true
    }
  }

  anim.rafHandle = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(anim.rafHandle)
    anim.done = true
  }
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────────

export const HIT_RADIUS = 24

/**
 * Given the current hit targets, the pointer's canvas-relative x coordinate,
 * and the canvas's bounding rect, returns a TooltipData ready for the card to
 * pass to <ChartTooltip> — or null when the pointer is not near any target.
 *
 * This is the single source of truth for hit-test → tooltip logic so neither
 * card needs to duplicate or guard it.
 */
export function resolveTooltip(
  hits: HitTarget[],
  mx: number,
  canvasRect: DOMRect
): TooltipData | null {
  let bestDist = HIT_RADIUS
  let bestXLabel: string | null = null
  let bestXPx = 0

  for (const t of hits) {
    const dx = Math.abs(t.px - mx)
    if (dx < bestDist) {
      bestDist = dx
      bestXLabel = t.xLabel
      bestXPx = t.px
    }
  }

  // Nothing within snap radius — no tooltip.
  if (bestXLabel === null) return null

  const group = hits.filter(t => t.xLabel === bestXLabel)
  const minY = Math.min(...group.map(t => t.py))

  return {
    x: canvasRect.left + bestXPx,
    y: canvasRect.top + minY,
    xLabel: bestXLabel,
    items: group.map(t => ({
      category: t.category === '_default' ? '' : t.category,
      value: t.yValue,
      colorIdx: t.colorIdx,
      meta: t.meta,
    })),
  }
}

// ─── Spec validation ─────────────────────────────────────────────────────────────

export function isValidSpec(obj: unknown): obj is ChartSpec {
  if (!obj || typeof obj !== 'object') return false
  const s = obj as Record<string, unknown>
  if (!['line', 'bar', 'area'].includes(s.mark as string)) return false
  if (!s.data || typeof s.data !== 'object') return false
  const data = s.data as Record<string, unknown>
  if (!Array.isArray(data.values)) return false
  if (!s.encoding || typeof s.encoding !== 'object') return false
  const enc = s.encoding as Record<string, unknown>
  if (!enc.x || !enc.y) return false
  return true
}
