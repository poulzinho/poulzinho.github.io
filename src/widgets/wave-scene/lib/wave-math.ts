import type { WaveConfig } from './wave-configs'

export type { WaveConfig, GradientStop } from './wave-configs'
export { DEFAULT_WAVE_CONFIGS } from './wave-configs'

export const W = 1440
export const H = 320

const SAMPLES_PER_CYCLE = 10

export type WavePoint = { x: number; y: number }

// Upper bound on segs for any WaveConfig (frequency max 8 × 10 samples/cycle)
export const MAX_WAVE_SEGS = 80

export function buildWavePoints(
  t: number,
  cfg: WaveConfig
): { points: WavePoint[]; segs: number } {
  const segs = Math.max(30, Math.ceil(cfg.frequency * SAMPLES_PER_CYCLE))
  const dx = W / segs
  const points: WavePoint[] = []
  for (let i = 0; i <= segs; i++) {
    points.push({ x: i * dx, y: computeY(t, i / segs, cfg) })
  }
  return { points, segs }
}

/** Writes wave points into a pre-allocated buffer. Returns the segment count.
 *  Use this in hot paths to avoid per-frame array allocation. */
export function fillWavePoints(
  t: number,
  cfg: WaveConfig,
  out: WavePoint[]
): number {
  const segs = Math.min(Math.max(30, Math.ceil(cfg.frequency * SAMPLES_PER_CYCLE)), out.length - 1)
  const dx = W / segs
  for (let i = 0; i <= segs; i++) {
    out[i].x = i * dx
    out[i].y = computeY(t, i / segs, cfg)
  }
  return segs
}

// Shared inner computation used by buildWavePath, sampleWave, and findNextPeak
export function computeY(t: number, u: number, cfg: WaveConfig): number {
  const { yBase, amplitude, frequency, speed, skew, direction, phaseOffset = 0, phaseOffsetMag = 0 } = cfg
  const phase = u * frequency * Math.PI * 2 + t * speed * direction + phaseOffset

  // Amplitude modulation at sub-frequencies → wave groups (some peaks taller)
  // Uses fractions < 1 so NO spatial ripples are added above the primary wave
  const ampMod =
    1 +
    0.35 *
      Math.sin(u * frequency * 0.61 * Math.PI * 2 + t * speed * 0.7 + phaseOffsetMag * 0.7 + 1.2) +
    0.18 * Math.sin(u * frequency * 0.37 * Math.PI * 2 + t * speed * 0.45 + phaseOffsetMag * 0.45 + 2.7)

  // Phase modulation → irregular peak spacing without adding ripples
  const phaseMod =
    0.24 * Math.sin(u * frequency * 0.5 * Math.PI * 2 + t * speed * 0.55 + phaseOffsetMag * 0.55 + 0.9)

  const p = phase + phaseMod
  return yBase + amplitude * ampMod * (Math.sin(p) + skew * Math.sin(2 * p))
}

export function buildWavePath(t: number, cfg: WaveConfig): string {
  const segs = Math.max(30, Math.ceil(cfg.frequency * SAMPLES_PER_CYCLE))
  const dx = W / segs
  const ys: number[] = []
  for (let i = 0; i <= segs; i++) {
    ys.push(computeY(t, i / segs, cfg))
  }
  // Catmull-Rom → cubic bezier: control points from neighbour slopes
  // guarantees smooth C1 tangents at every point — no sharp corners
  let d = `M0,${H} L0,${ys[0]}`
  for (let i = 0; i < segs; i++) {
    const x0 = i * dx
    const x1 = (i + 1) * dx
    const yPrev = ys[Math.max(0, i - 1)]
    const yNext = ys[Math.min(segs, i + 2)]
    const cp1y = ys[i] + (ys[i + 1] - yPrev) / 6
    const cp2y = ys[i + 1] - (yNext - ys[i]) / 6
    d += ` C${x0 + dx / 3},${cp1y} ${x1 - dx / 3},${cp2y} ${x1},${ys[i + 1]}`
  }
  return d + ` L${W},${H} Z`
}

// Returns the wave y-position and board tilt angle at horizontal position u ∈ [0, 1]
export function sampleWave(
  t: number,
  u: number,
  cfg: WaveConfig
): { y: number; slopeDeg: number } {
  const eps = 1 / W // 1 SVG unit of horizontal travel
  const y0 = computeY(t, u, cfg)
  const y1 = computeY(t, u + eps, cfg)
  return {
    y: y0,
    slopeDeg: Math.atan2(y1 - y0, 1) * (180 / Math.PI),
  }
}

// Scans rightward from uStart looking for the next wave peak whose local height
// above yBase exceeds minAmplitude. Returns the u-coordinate of that peak, or null.
export function findNextPeak(
  t: number,
  uStart: number,
  cfg: WaveConfig,
  minAmplitude: number
): number | null {
  const scanEnd = Math.min(uStart + 0.4, 1.0)
  const du = 0.005
  // In SVG y-down coordinates a peak (highest visual point) is a local minimum of y.
  // The slope transitions from negative (going up) to positive (going down).
  let prevSlope = computeY(t, uStart + du, cfg) - computeY(t, uStart, cfg)

  for (let u = uStart + du; u < scanEnd; u += du) {
    const slope = computeY(t, u + du, cfg) - computeY(t, u, cfg)
    if (prevSlope < 0 && slope >= 0) {
      // Found a peak — check if it's tall enough
      const peakHeight = cfg.yBase - computeY(t, u, cfg)
      if (peakHeight > minAmplitude) {
        return u
      }
    }
    prevSlope = slope
  }
  return null
}
