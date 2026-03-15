import { computeY, findNextPeak } from './wave-math'
import type { WaveConfig } from './wave-configs'

export type TrickKind =
  | 'backflip'
  | 'shuvit'
  | 'triple-flip'
  | 'corkscrew'
  | 'rocket'
  | 'time-warp'
  | 'anti-gravity'

// Peak detection thresholds (fraction of current amplitude)
export const BIG_PEAK_AMP_FACTOR = 0.55
export const SMALL_PEAK_AMP_FACTOR = 0.25

// Super trick height thresholds — fixed SVG units, not relative to amplitude.
// Bigger waves (from boost) directly increase the number of peaks that qualify.
export const ROCKET_MIN_HEIGHT = 43    // ~85% of default amplitude (50)
export const TRIPLE_FLIP_MIN_HEIGHT = 45 // ~90% of default amplitude
export const ANTIGRAVITY_MIN_HEIGHT = 30 // ~60% of default amplitude

// Super trick probabilities (checked in priority order)
export const P_ROCKET = 0.15
export const P_TRIPLE_FLIP = 0.12
export const P_ANTIGRAVITY = 0.10
export const P_TIMEWARP = 0.12
export const P_CORKSCREW = 0.15
export const P_GHOST = 0.08
export const P_HYPERDASH = 0.08

// Minimum normal tricks between super tricks
export const SUPER_TRICK_COOLDOWN = 1

// How many recently-seen tricks to block (prevents same trick on consecutive runs)
export const RECENT_TRICKS_WINDOW = 3

// Pity timer: each run without a super trick multiplies probabilities by this factor.
// After 4 normal runs, probabilities are ~3× baseline → near-certain super.
export const PITY_MULTIPLIER_PER_RUN = 0.6

export function scanForPeak(
  time: number,
  uStart: number,
  cfg: WaveConfig
): { u: number; kind: TrickKind; peakHeight: number } | null {
  const bigPeak = findNextPeak(time, uStart, cfg, cfg.amplitude * BIG_PEAK_AMP_FACTOR)
  if (bigPeak !== null && bigPeak - uStart < 0.03) {
    const peakHeight = cfg.yBase - computeY(time, bigPeak, cfg)
    return { u: bigPeak, kind: 'backflip', peakHeight }
  }
  const smallPeak = findNextPeak(time, uStart, cfg, cfg.amplitude * SMALL_PEAK_AMP_FACTOR)
  if (smallPeak !== null && smallPeak - uStart < 0.03) {
    const peakHeight = cfg.yBase - computeY(time, smallPeak, cfg)
    return { u: smallPeak, kind: 'shuvit', peakHeight }
  }
  return null
}

export function pickSuperTrick(
  peakHeight: number,
  usedTricks: Set<string>,
  pityMultiplier: number
): TrickKind | null {
  const r = Math.random()
  let acc = 0
  const m = pityMultiplier

  if (!usedTricks.has('rocket') && peakHeight >= ROCKET_MIN_HEIGHT) {
    acc += P_ROCKET * m
    if (r < acc) return 'rocket'
  }
  if (!usedTricks.has('triple-flip') && peakHeight >= TRIPLE_FLIP_MIN_HEIGHT) {
    acc += P_TRIPLE_FLIP * m
    if (r < acc) return 'triple-flip'
  }
  if (!usedTricks.has('anti-gravity') && peakHeight >= ANTIGRAVITY_MIN_HEIGHT) {
    acc += P_ANTIGRAVITY * m
    if (r < acc) return 'anti-gravity'
  }
  if (!usedTricks.has('time-warp')) {
    acc += P_TIMEWARP * m
    if (r < acc) return 'time-warp'
  }
  if (!usedTricks.has('corkscrew')) {
    acc += P_CORKSCREW * m
    if (r < acc) return 'corkscrew'
  }
  return null
}
