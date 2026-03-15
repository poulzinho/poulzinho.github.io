import { COLORS } from 'shared/lib/colors'

export type GradientStop = {
  offset: number // 0–1
  color: string
}

export type WaveConfig = {
  yBase: number
  amplitude: number
  frequency: number
  speed: number
  skew: number
  opacity: number
  color: string
  gradient?: GradientStop[]
  strokeColor?: string
  direction: 1 | -1
  /** Phase compensation for the directional main wave (t*speed*direction). */
  phaseOffset?: number
  /** Phase compensation for the non-directional sub-frequency terms (ampMod, phaseMod). */
  phaseOffsetMag?: number
}

export const DEFAULT_WAVE_CONFIGS: WaveConfig[] = [
  // Back: massive ground swell — deep indigo-violet ocean body
  {
    yBase: 148,
    amplitude: 72,
    frequency: 1.6,
    speed: 0.55,
    skew: 0.35,
    opacity: 1,
    color: COLORS.waveDeep2,
    gradient: [
      { offset: 0, color: COLORS.waveDeep3 },
      { offset: 0.6, color: COLORS.waveDeep2 },
      { offset: 1, color: COLORS.waveDeep1 },
    ],
    strokeColor: COLORS.waveDeepStroke,
    direction: 1,
  },
  // Mid (cuy surfs here): electric cyan crests — the star wave
  {
    yBase: 208,
    amplitude: 50,
    frequency: 2.2,
    speed: 1.1,
    skew: 0.28,
    opacity: 0.9,
    color: COLORS.waveMid2,
    gradient: [
      { offset: 0, color: COLORS.waveMid3 },
      { offset: 0.55, color: COLORS.waveMid2 },
      { offset: 1, color: COLORS.waveMid1 },
    ],
    strokeColor: COLORS.waveMid3,
    direction: 1,
  },
  // Front: fast surface chop — neon magenta-violet spray & reflections
  {
    yBase: 258,
    amplitude: 30,
    frequency: 3.0,
    speed: 1.75,
    skew: 0.18,
    opacity: 0.55,
    color: COLORS.waveFront2,
    gradient: [
      { offset: 0, color: COLORS.waveFront3 },
      { offset: 0.5, color: COLORS.waveFront2 },
      { offset: 1, color: COLORS.waveFront1 },
    ],
    strokeColor: COLORS.waveFront3,
    direction: 1,
  },
]
