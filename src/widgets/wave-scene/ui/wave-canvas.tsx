import { gsap } from 'gsap'
import { memo, MutableRefObject, useEffect, useRef } from 'react'
import { COLORS } from 'shared/lib/colors'
import type { ParticleEmitter } from '../lib/particle-emitter'
import type { GradientStop, WaveConfig, WavePoint } from '../lib/wave-math'
import { fillWavePoints, H, MAX_WAVE_SEGS, W } from '../lib/wave-math'
import { createMatrixRain } from './matrix-rain'

type GradientCache = {
  gradRef: GradientStop[] | undefined
  fill: CanvasGradient | string
}

type Props = {
  configsRef: MutableRefObject<WaveConfig[]>
  viewW?: number
  splashEmitterRef?: MutableRefObject<ParticleEmitter | null>
}

// Build the closed wave shape inline on a given context.
// Returns the number of segments used so the caller can reuse it.
function buildWaveShape(
  ctx: CanvasRenderingContext2D,
  points: WavePoint[],
  segs: number
) {
  const dx = W / segs
  ctx.beginPath()
  ctx.moveTo(0, H)
  ctx.lineTo(0, points[0].y)

  for (let j = 0; j < segs; j++) {
    const x0 = points[j].x
    const x1 = points[j + 1].x
    const yPrev = points[Math.max(0, j - 1)].y
    const yCurr = points[j].y
    const yNext = points[j + 1].y
    const yNext2 = points[Math.min(segs, j + 2)].y

    const cp1y = yCurr + (yNext - yPrev) / 6
    const cp2y = yNext - (yNext2 - yCurr) / 6

    ctx.bezierCurveTo(x0 + dx / 3, cp1y, x1 - dx / 3, cp2y, x1, yNext)
  }

  ctx.lineTo(W, H)
  ctx.closePath()
}

function WaveCanvas({ configsRef, viewW = W, splashEmitterRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glowCanvasRef = useRef<HTMLCanvasElement>(null)
  const matrixRainRef = useRef(
    createMatrixRain({ color: COLORS.matrixGreen, headOpacity: 0.9, groupOpacity: 0.35 })
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const glowCanvas = glowCanvasRef.current
    if (!canvas || !glowCanvas) return

    const dpr = window.devicePixelRatio || 1

    for (const c of [canvas, glowCanvas]) {
      c.width = viewW * dpr
      c.height = H * dpr
    }

    const ctx = canvas.getContext('2d')
    const glowCtx = glowCanvas.getContext('2d')
    if (!ctx || !glowCtx) return

    ctx.scale(dpr, dpr)
    glowCtx.scale(dpr, dpr)

    const matrixRain = matrixRainRef.current

    // Pre-allocate one point buffer per wave — reused every frame, zero GC
    const numWaves = configsRef.current.length
    const pointBuffers: WavePoint[][] = Array.from({ length: numWaves }, () =>
      Array.from({ length: MAX_WAVE_SEGS + 1 }, () => ({ x: 0, y: 0 }))
    )

    // Gradient cache — keyed by wave index, invalidated only when gradient stops change
    const gradCache: GradientCache[] = []

    const tick = (time: number, deltaTime: number) => {
      const cfgs = configsRef.current
      const dt = Math.min(deltaTime / 1000, 0.1)

      splashEmitterRef?.current?.update(dt)

      ctx.clearRect(0, 0, viewW, H)
      glowCtx.clearRect(0, 0, viewW, H)

      for (let i = 0; i < cfgs.length; i++) {
        const cfg = cfgs[i]
        const points = pointBuffers[i]
        const segs = fillWavePoints(time, cfg, points)

        // --- Main canvas: fill ---
        buildWaveShape(ctx, points, segs)

        let cache = gradCache[i]
        if (!cache || cache.gradRef !== cfg.gradient) {
          let fill: CanvasGradient | string
          if (cfg.gradient) {
            const grad = ctx.createLinearGradient(0, 0, 0, H)
            for (const stop of cfg.gradient) grad.addColorStop(stop.offset, stop.color)
            fill = grad
          } else {
            fill = cfg.color
          }
          cache = { gradRef: cfg.gradient, fill }
          gradCache[i] = cache
        }

        ctx.fillStyle = cache.fill
        ctx.globalAlpha = cfg.opacity
        ctx.fill()

        // --- Main canvas: crisp 1px stroke (no shadow) ---
        if (cfg.strokeColor) {
          ctx.strokeStyle = cfg.strokeColor
          ctx.lineWidth = 1
          ctx.lineJoin = 'round'
          ctx.stroke()

          // --- Glow canvas: thick stroke — CSS blur on the element provides the halo ---
          buildWaveShape(glowCtx, points, segs)
          glowCtx.strokeStyle = cfg.strokeColor
          glowCtx.lineWidth = 4
          glowCtx.lineJoin = 'round'
          glowCtx.globalAlpha = cfg.opacity * 0.75
          glowCtx.stroke()
        }

        // --- Matrix rain clipped to back wave ---
        if (i === 0) {
          matrixRain.update(dt)
          matrixRain.draw(ctx, points, segs)
        }
      }

      ctx.globalAlpha = 1
      glowCtx.globalAlpha = 1

      splashEmitterRef?.current?.draw(ctx)
    }

    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configsRef, viewW])

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
      <canvas
        ref={glowCanvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          filter: 'blur(6px)',
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

export default memo(WaveCanvas)
