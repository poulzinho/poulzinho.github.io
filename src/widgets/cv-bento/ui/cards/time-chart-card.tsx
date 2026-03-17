import { useCallback, useEffect, useRef, useState } from 'react'

import { FOCUS_SPLIT_DATA, SKILL_GROWTH_DATA } from 'shared/lib/career-data'
import { BentoCard } from 'shared/ui'
import { useTheme } from 'shared/ui/theme/theme-context'
import {
  type AnimationState,
  type ChartSpec,
  type DatasetPreset,
  type HitTarget,
  type ThemeColors,
  type TooltipData,
  MOON,
  SUN,
  createAnimationState,
  renderChart,
  resolveTooltip,
  startAnimation,
  startHoverTransition,
} from './chart-engine'
import ChartTooltip from './chart-tooltip'

// ─── Datasets ───────────────────────────────────────────────────────────────────

const DATASETS: DatasetPreset[] = [
  {
    id: 'tech-evolution',
    label: 'Skill Growth',
    defaultMark: 'line',
    spec: {
      mark: 'line',
      data: { values: SKILL_GROWTH_DATA },
      encoding: {
        x: { field: 'year', type: 'ordinal' },
        y: { field: 'level', type: 'quantitative' },
        color: { field: 'domain', type: 'nominal' },
      },
    },
  },
  {
    id: 'fullstack-split',
    label: 'Focus Split',
    defaultMark: 'area',
    spec: {
      mark: 'area',
      data: { values: FOCUS_SPLIT_DATA },
      encoding: {
        x: { field: 'year', type: 'ordinal' },
        y: { field: 'pct', type: 'quantitative' },
        color: { field: 'layer', type: 'nominal' },
      },
    },
  },
]

// ─── Sub-components ─────────────────────────────────────────────────────────────

function TimeChartHeader({
  datasetId,
  onDatasetChange,
  mark,
  onMarkChange,
  datasets,
  colors,
}: {
  datasetId: string
  onDatasetChange: (id: string) => void
  mark: ChartSpec['mark']
  onMarkChange: (m: ChartSpec['mark']) => void
  datasets: DatasetPreset[]
  colors: ThemeColors
}) {
  const selectStyle: React.CSSProperties = {
    backgroundColor: colors.dropdownBg,
    borderColor: colors.dropdownBorder,
    color: colors.dropdownText,
  }

  return (
    <div className='flex flex-col gap-2 pb-3'>
      <span
        className='text-xs font-semibold tracking-wide uppercase'
        style={{ color: colors.headerText }}
      >
        Growth Over Time
      </span>
      <div className='flex items-center gap-2'>
        <select
          value={datasetId}
          onChange={e => onDatasetChange(e.target.value)}
          className='flex-1 rounded-md border px-2 py-1 text-xs outline-none'
          style={selectStyle}
          aria-label='Select dataset'
        >
          {datasets.map(d => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
        <select
          value={mark}
          onChange={e => onMarkChange(e.target.value as ChartSpec['mark'])}
          className='rounded-md border px-2 py-1 text-xs outline-none'
          style={selectStyle}
          aria-label='Select chart type'
        >
          <option value='line'>Line</option>
          <option value='area'>Area</option>
          <option value='bar'>Bar</option>
        </select>
      </div>
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function TimeChartCard() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeDataset, setActiveDataset] = useState<DatasetPreset>(DATASETS[0])
  const [spec, setSpec] = useState<ChartSpec>(DATASETS[0].spec)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const hitTargetsRef = useRef<HitTarget[]>([])
  const animRef = useRef<AnimationState>(createAnimationState(900))
  const hoveredXLabelRef = useRef<string | null>(null)
  const cancelHoverRef = useRef<(() => void) | null>(null)

  const colors = theme === 'light' ? SUN : MOON

  const handleDatasetChange = (id: string) => {
    const preset = DATASETS.find(d => d.id === id)!
    setActiveDataset(preset)
    setSpec({ ...preset.spec, mark: spec.mark })
  }

  const handleMarkChange = (mark: ChartSpec['mark']) => {
    setSpec(prev => ({ ...prev, mark }))
  }

  // Core draw function — called both from the animation loop and on hover changes
  const draw = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      hitTargetsRef.current = renderChart(
        ctx,
        spec,
        colors,
        rect.width,
        rect.height,
        progress,
        hoveredXLabelRef.current,
        animRef.current.hoverAlpha
      )
    },
    [spec, colors]
  )

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left

      const next = resolveTooltip(hitTargetsRef.current, mx, rect)
      const nextLabel = next?.xLabel ?? null

      if (nextLabel === hoveredXLabelRef.current) return

      hoveredXLabelRef.current = nextLabel

      if (cancelHoverRef.current) cancelHoverRef.current()
      cancelHoverRef.current = startHoverTransition(
        animRef.current,
        nextLabel !== null ? 1 : 0,
        () => draw(1)
      )

      setTooltip(next)
    },
    [draw]
  )

  const handleCanvasMouseLeave = useCallback(() => {
    hoveredXLabelRef.current = null
    setTooltip(null)
    if (cancelHoverRef.current) cancelHoverRef.current()
    cancelHoverRef.current = startHoverTransition(animRef.current, 0, () =>
      draw(1)
    )
  }, [draw])

  // Resize observer — redraws at current progress (full after animation)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const ro = new ResizeObserver(() =>
      draw(animRef.current.done ? 1 : animRef.current.progress)
    )
    ro.observe(container)
    return () => ro.disconnect()
  }, [draw])

  // Kick off draw-in animation whenever spec or colors change
  useEffect(() => {
    const cancel = startAnimation(animRef.current, progress => {
      draw(progress)
    })
    return cancel
  }, [spec, colors, draw])

  return (
    <BentoCard
      colSpan={3}
      rowSpan={2}
      tabletColSpan={2}
      variant='default'
      label='Growth Over Time'
      className='min-h-[420px]'
    >
      <div className='flex h-full flex-col'>
        <TimeChartHeader
          datasetId={activeDataset.id}
          onDatasetChange={handleDatasetChange}
          mark={spec.mark}
          onMarkChange={handleMarkChange}
          datasets={DATASETS}
          colors={colors}
        />
        <div ref={containerRef} className='relative min-h-0 flex-1'>
          <canvas
            ref={canvasRef}
            className='absolute inset-0 rounded-lg'
            role='img'
            aria-label='Temporal chart showing career growth over time'
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={handleCanvasMouseLeave}
          />
          <ChartTooltip data={tooltip} colors={colors} />
        </div>
      </div>
    </BentoCard>
  )
}
