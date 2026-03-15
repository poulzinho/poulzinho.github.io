import { COLORS } from 'shared/lib/colors'
import type { WavePoint } from '../lib/wave-math'
import { H, W } from '../lib/wave-math'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const COL_COUNT = 60
const FONT_SIZE = 14
const LINE_HEIGHT = FONT_SIZE * 1.3
const MAX_ROWS = Math.ceil(H / LINE_HEIGHT) + 2
const SPEED_MIN = 20
const SPEED_MAX = 55
const MUTATE_INTERVAL = 0.15
const WRAP_H = H + LINE_HEIGHT * 2
const BUCKET_COUNT = 6

const MATRIX_CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  '0123456789' +
  ':・."=*+-<>¦|_'

function randomChar(): string {
  return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
}

// ---------------------------------------------------------------------------
// Column state
// ---------------------------------------------------------------------------

type Column = {
  x: number
  speed: number
  offset: number
  chars: string[]
  opacities: number[]
  nextMutate: number
}

function createColumn(index: number): Column {
  const x = (index / COL_COUNT) * W + (W / COL_COUNT) * 0.5
  const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN)
  const chars: string[] = []
  const opacities: number[] = []
  for (let r = 0; r < MAX_ROWS; r++) {
    chars.push(randomChar())
    opacities.push(Math.max(0.05, 1 - r / MAX_ROWS))
  }
  return {
    x,
    speed,
    offset: Math.random() * H,
    chars,
    opacities,
    nextMutate: Math.random() * MUTATE_INTERVAL,
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

type MatrixRainOpts = {
  color?: string
  headOpacity?: number
  groupOpacity?: number
}

export function createMatrixRain({
  color = COLORS.matrixGreen,
  headOpacity = 0.9,
  groupOpacity = 0.35,
}: MatrixRainOpts = {}) {
  const columns: Column[] = []
  for (let c = 0; c < COL_COUNT; c++) {
    columns.push(createColumn(c))
  }

  const font = `${FONT_SIZE}px "Courier New", Consolas, monospace`

  // Pre-compute opacity buckets — done once at creation, not per frame.
  // bucketRows[b] holds the row indices assigned to bucket b.
  // bucketAlpha[b] is the representative globalAlpha for that bucket.
  const bucketRows: number[][] = Array.from({ length: BUCKET_COUNT }, () => [])
  const bucketAlpha: number[] = new Array(BUCKET_COUNT).fill(0)

  for (let r = 0; r < MAX_ROWS; r++) {
    const b = Math.min(BUCKET_COUNT - 1, Math.floor((r / MAX_ROWS) * BUCKET_COUNT))
    bucketRows[b].push(r)
  }

  for (let b = 0; b < BUCKET_COUNT; b++) {
    const rows = bucketRows[b]
    const midRow = rows[Math.floor(rows.length / 2)] ?? 0
    bucketAlpha[b] = groupOpacity * headOpacity * Math.max(0.05, 1 - midRow / MAX_ROWS)
  }

  function update(dt: number): void {
    for (let c = 0; c < columns.length; c++) {
      const col = columns[c]
      col.offset += col.speed * dt
      if (col.offset > WRAP_H) {
        col.offset -= WRAP_H
      }
      col.nextMutate -= dt
      if (col.nextMutate <= 0) {
        const idx = Math.floor(Math.random() * MAX_ROWS)
        col.chars[idx] = randomChar()
        col.nextMutate = MUTATE_INTERVAL + Math.random() * MUTATE_INTERVAL
      }
    }
  }

  function draw(
    ctx: CanvasRenderingContext2D,
    points: WavePoint[],
    segs: number
  ): void {
    ctx.font = font
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = color

    for (let b = 0; b < BUCKET_COUNT; b++) {
      ctx.globalAlpha = bucketAlpha[b]
      const rows = bucketRows[b]

      for (let c = 0; c < columns.length; c++) {
        const col = columns[c]
        const frac = (col.x / W) * segs
        const lo = Math.min(segs - 1, Math.floor(frac))
        const hi = Math.min(segs, lo + 1)
        const waveTopY = points[lo].y + (frac - lo) * (points[hi].y - points[lo].y)

        for (let ri = 0; ri < rows.length; ri++) {
          const r = rows[ri]
          const y = col.offset - r * LINE_HEIGHT
          const wrappedY = (((y % WRAP_H) + WRAP_H) % WRAP_H) - LINE_HEIGHT

          if (wrappedY < waveTopY + LINE_HEIGHT * 0.5 || wrappedY < -LINE_HEIGHT || wrappedY > H + LINE_HEIGHT) continue

          ctx.fillText(col.chars[r], col.x, wrappedY)
        }
      }
    }
  }

  return { update, draw }
}
