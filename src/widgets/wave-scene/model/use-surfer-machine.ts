import { gsap } from 'gsap'
import { MutableRefObject, useCallback, useEffect, useRef } from 'react'
import type { WaveConfig } from '../lib/wave-configs'
import {
  ACCEL,
  AMPLITUDE_BOOST_PER_RUN,
  ANTIGRAVITY_FLOAT_DURATION,
  ANTIGRAVITY_FLOAT_VY,
  ANTIGRAVITY_GRAVITY,
  ANTIGRAVITY_LAUNCH_VY,
  ANTIGRAVITY_ROTATIONS,
  BACKFLIP_GRAVITY,
  BACKFLIP_LAUNCH_VY,
  BACKFLIP_ROTATIONS,
  BARREL_ROLL_DURATION,
  BARREL_ROLL_PATIENCE,
  CORKSCREW_FLIPS,
  CORKSCREW_GRAVITY,
  CORKSCREW_LAUNCH_VY,
  CORKSCREW_ROTATIONS,
  CRUISE_SPEED,
  easeInOutQuad,
  easeOutCubic,
  EXIT_ZONE,
  FLIP_AIR_DRAG,
  FREQUENCY_BOOST_PER_RUN,
  GHOST_FADE_IN,
  GHOST_FADE_OUT,
  GHOST_HOLD,
  GHOST_MIN_OPACITY,
  GHOST_SPEED_MULT,
  HYPERDASH_DURATION,
  HYPERDASH_SCALE_X,
  HYPERDASH_SCALE_Y,
  HYPERDASH_SPRING_DURATION,
  HYPERDASH_VX,
  IDLE_HINT_CYCLE,
  IDLE_HINT_FADE,
  IDLE_HINT_ON,
  IDLE_HOVER_SCALE,
  IDLE_HOVER_SPEED,
  LAND_ROT_BLEND_DURATION,
  LAND_SQUASH_DURATION,
  LAUNCH_SQUASH_DURATION,
  lerp,
  MAX_AMPLITUDE_BOOST,
  MAX_DT,
  MAX_FREQUENCY_BOOST,
  MIN_RIDE_TIME,
  normalizeAngleNear,
  OFFSCREEN_DELAY,
  RETURN_EASE_POWER,
  RETURN_START_SPEED,
  RISE_THRESHOLD,
  ROCKET_GRAVITY,
  ROCKET_LAUNCH_VY,
  ROCKET_ROTATIONS,
  SCAN_AHEAD_MIN,
  SHUVIT_GRAVITY,
  SHUVIT_LAUNCH_VY,
  SHUVIT_ROTATIONS,
  SMOOTH_ROT_RATE,
  SQUASH_SX,
  SQUASH_SY,
  STRETCH_SX,
  STRETCH_SY,
  SUPER_ENTRY_FLASH_DURATION,
  SUPER_ENTRY_FLASH_SCALE,
  SUPER_SQUASH_SY,
  TIMEWARP_FREEZE_DURATION,
  TIMEWARP_FREEZE_GRAVITY,
  TIMEWARP_FREEZE_VY_THRESHOLD,
  TIMEWARP_GRAVITY,
  TIMEWARP_LAUNCH_VY,
  TIMEWARP_ELEVATION,
  TIMEWARP_ELEVATION_DURATION,
  TIMEWARP_FADE_DURATION,
  TIMEWARP_PULSE_HZ,
  TIMEWARP_ROTATIONS,
  TRIPLE_FLIP_GRAVITY,
  TRIPLE_FLIP_LAUNCH_VY,
  TRIPLE_FLIP_ROTATIONS,
} from '../lib/surfer-physics'
import {
  P_GHOST,
  P_HYPERDASH,
  pickSuperTrick,
  PITY_MULTIPLIER_PER_RUN,
  scanForPeak,
  SMALL_PEAK_AMP_FACTOR,
  SUPER_TRICK_COOLDOWN,
  type TrickKind,
} from '../lib/trick-system'
import { findNextPeak, sampleWave, W } from '../lib/wave-math'

// ---------------------------------------------------------------------------
// Surfer FSM — pure state machine
// ---------------------------------------------------------------------------

type AirTrickState = {
  kind: TrickKind
  launchU: number
  launchY: number
  launchSlopeDeg: number
  launchVx: number
  vy0: number
  gravity: number
  elapsed: number
  currentVx: number
  horizDist: number
  hasRisen: boolean
  rotations: number
  timewarpFrozen: boolean
  timewarpFreezeElapsed: number
  timewarpFreezeEndedAt: number  // tFlip when freeze ended, -1 if not yet
  antiGravity: boolean
  antiGravityElapsed: number
  antiGravityPhase: 'pre' | 'floating' | 'falling'
}

type BarrelRollState = {
  elapsed: number
  duration: number
  startU: number
}

type GhostState = {
  elapsed: number
  fadeInDuration: number
  holdDuration: number
  fadeOutDuration: number
}

type HyperdashState = {
  elapsed: number
  duration: number
  springElapsed: number
}

export type SurferState =
  | { phase: 'idle' }
  | { phase: 'accelerating' }
  | { phase: 'riding' }
  | { phase: 'airborne'; trick: AirTrickState }
  | { phase: 'barrel-roll'; roll: BarrelRollState }
  | { phase: 'ghost'; ghost: GhostState }
  | { phase: 'hyperdash'; dash: HyperdashState }
  | { phase: 'exiting' }
  | { phase: 'offscreen' }
  | { phase: 'returning' }

export type SurferAction =
  | { type: 'START_RUN' }
  | { type: 'REACHED_CRUISE' }
  | { type: 'STARTED_AIRBORNE'; trick: AirTrickState }
  | { type: 'STARTED_BARREL_ROLL'; roll: BarrelRollState }
  | { type: 'STARTED_GHOST'; ghost: GhostState }
  | { type: 'STARTED_HYPERDASH'; dash: HyperdashState }
  | { type: 'LANDED' }
  | { type: 'TRICK_DONE' }   // barrel-roll / ghost / hyperdash completed on-wave
  | { type: 'EXITED_WAVE' }  // u > 1.0 from any active phase
  | { type: 'OFF_EDGE' }     // u > 1.15 during exiting
  | { type: 'OFFSCREEN_TIMER_DONE' }
  | { type: 'RETURN_CLICKED' }
  | { type: 'RETURNED' }

export function surferReducer(state: SurferState, action: SurferAction): SurferState {
  switch (action.type) {
    case 'START_RUN':
      return { phase: 'accelerating' }

    case 'REACHED_CRUISE':
      if (state.phase === 'accelerating') return { phase: 'riding' }
      return state

    case 'STARTED_AIRBORNE':
      return { phase: 'airborne', trick: action.trick }

    case 'STARTED_BARREL_ROLL':
      return { phase: 'barrel-roll', roll: action.roll }

    case 'STARTED_GHOST':
      return { phase: 'ghost', ghost: action.ghost }

    case 'STARTED_HYPERDASH':
      return { phase: 'hyperdash', dash: action.dash }

    case 'LANDED':
    case 'TRICK_DONE':
      return { phase: 'riding' }

    case 'EXITED_WAVE':
      return { phase: 'exiting' }

    case 'OFF_EDGE':
      return { phase: 'offscreen' }

    case 'OFFSCREEN_TIMER_DONE':
    case 'RETURN_CLICKED':
      return { phase: 'returning' }

    case 'RETURNED':
      return { phase: 'idle' }

    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Frame output
// ---------------------------------------------------------------------------

export type EffectEvent =
  | { kind: 'timewarp-freeze'; x: number; y: number }
  | { kind: 'timewarp-land'; x: number; y: number }

export type SurferFrameState = {
  x: number           // wave contact x = u * W
  y: number           // wave contact y = displayY
  rotationDeg: number
  scaleX: number
  scaleY: number
  opacity: number
  glow: boolean
  visible: boolean
  clickable: boolean
  rocketFlame: boolean
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSurferMachine(
  configsRef: MutableRefObject<WaveConfig[]>,
  options: { waveIndex: number; uPosition: number; autoBoost?: boolean }
): {
  frameStateRef: MutableRefObject<SurferFrameState>
  trickEventRef: MutableRefObject<string | null>
  effectEventRef: MutableRefObject<EffectEvent | null>
  splashEventRef: MutableRefObject<{ x: number; y: number; kind: 'land' | 'entry' } | null>
  onSurferClick: () => void
  onKeyDown: (e: { key: string; preventDefault: () => void }) => void
  onPointerEnter: () => void
  onPointerLeave: () => void
} {
  const { waveIndex, uPosition, autoBoost = true } = options
  const autoBoostRef = useRef(autoBoost)
  autoBoostRef.current = autoBoost

  const frameStateRef = useRef<SurferFrameState>({
    x: -0.12 * W,
    y: 0,
    rotationDeg: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    glow: false,
    visible: true,
    clickable: true,
    rocketFlame: false,
  })

  // --- FSM state — start returning so surfer slides in from left on first load ---
  const surferStateRef = useRef<SurferState>({ phase: 'returning' })
  const dispatch = (action: SurferAction) => {
    surferStateRef.current = surferReducer(surferStateRef.current, action)
  }

  // --- Continuous physics refs (mutated 60×/s, not part of FSM state) ---
  const uRef = useRef(-0.12)
  const vxRef = useRef(RETURN_START_SPEED)
  const prevTimeRef = useRef(-1)
  const rotationRef = useRef(0)
  const rideTimeRef = useRef(0)
  const trickCountRef = useRef(0)
  const normalTricksSinceSuper = useRef(0)
  const usedTricksRef = useRef<Set<string>>(new Set())
  const prevRunTricksRef = useRef<Set<string>>(new Set())
  const hoveringRef = useRef(false)
  const idleTimeRef = useRef(0)
  const isSupertrickRef = useRef(false)
  const surfaceTrickRollCooldownRef = useRef(0)
  const runsWithoutSuperRef = useRef(0)
  const runHadSuperRef = useRef(false)
  const baseAmplitudeRef = useRef<number | null>(null)
  const baseFrequencyRef = useRef<number | null>(null)
  const waveBoostRef = useRef(0)
  const waveFreqBoostRef = useRef(0)
  const targetConfigRef = useRef<{ amplitude: number; frequency: number } | null>(null)

  // Cancel pending blend when Auto is turned off so the wave stops mid-boost
  useEffect(() => {
    if (!autoBoost) targetConfigRef.current = null
  }, [autoBoost])

  const timerRef = useRef(0)
  const squashTimerRef = useRef(0)
  const squashTypeRef = useRef<'none' | 'launch' | 'land'>('none')
  const entryFlashRef = useRef(-1)
  const landRotBlendRef = useRef<{ startRot: number; elapsed: number } | null>(null)
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = mq.matches
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // --- Helpers ---
  // Cheap membership check — avoids allocating a merged Set on every call
  const hasDoneTrick = (kind: string) =>
    usedTricksRef.current.has(kind) || prevRunTricksRef.current.has(kind)
  // Full merged Set — only allocate when needed for pickSuperTrick / pickTrick
  const doneTricks = () => new Set([...usedTricksRef.current, ...prevRunTricksRef.current])

  const trickEventRef = useRef<string | null>(null)
  const effectEventRef = useRef<EffectEvent | null>(null)
  const splashEventRef = useRef<{ x: number; y: number; kind: 'land' | 'entry' } | null>(null)
  const accelSplashTimerRef = useRef(0)

  const recordTrick = (kind: string) => {
    usedTricksRef.current.add(kind)
    trickEventRef.current = kind
  }

  const startRun = (initialVx: number) => {
    // Reset continuous state
    vxRef.current = initialVx
    idleTimeRef.current = 0
    trickCountRef.current = 0
    normalTricksSinceSuper.current = SUPER_TRICK_COOLDOWN
    const waveCfg = configsRef.current[waveIndex]
    if (waveCfg && baseAmplitudeRef.current === null) {
      baseAmplitudeRef.current = waveCfg.amplitude
    }
    if (waveCfg && baseFrequencyRef.current === null) {
      baseFrequencyRef.current = waveCfg.frequency
    }
    usedTricksRef.current.clear()
    landRotBlendRef.current = null
    squashTypeRef.current = 'none'
    isSupertrickRef.current = false
    entryFlashRef.current = -1
    surfaceTrickRollCooldownRef.current = 0
    accelSplashTimerRef.current = 0  // fire first spray immediately
    // Transition
    dispatch({ type: 'START_RUN' })
  }

  // --- Event handlers ---
  const onSurferClick = useCallback(() => {
    const state = surferStateRef.current
    switch (state.phase) {
      case 'idle':
        startRun(0.05)
        break
      case 'accelerating':
      case 'riding':
        vxRef.current = Math.min(vxRef.current + 0.15, CRUISE_SPEED)
        break
      case 'offscreen':
        uRef.current = -0.12
        vxRef.current = RETURN_START_SPEED
        timerRef.current = 0
        dispatch({ type: 'RETURN_CLICKED' })
        break
      case 'returning':
        startRun(vxRef.current + 0.05)
        break
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onKeyDown = useCallback((e: { key: string; preventDefault: () => void }) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSurferClick()
    }
  }, [onSurferClick])

  const onPointerEnter = useCallback(() => { hoveringRef.current = true }, [])
  const onPointerLeave = useCallback(() => { hoveringRef.current = false }, [])

  // --- Main animation loop ---
  useEffect(() => {
    const tick = (time: number) => {
      if (prevTimeRef.current < 0) prevTimeRef.current = time
      const rawDt = time - prevTimeRef.current
      const dt = Math.min(rawDt, MAX_DT)
      prevTimeRef.current = time

      const cfg = configsRef.current[waveIndex]
      if (!cfg) return

      // Gradually blend wave amplitude and frequency toward targets
      if (targetConfigRef.current !== null) {
        const target = targetConfigRef.current
        const ampDiff = target.amplitude - cfg.amplitude
        const freqDiff = target.frequency - cfg.frequency
        const blendRate = Math.min(0.4 * dt, 1)
        if (Math.abs(ampDiff) < 0.05 && Math.abs(freqDiff) < 0.005) {
          cfg.amplitude = target.amplitude
          cfg.frequency = target.frequency
          targetConfigRef.current = null
        } else {
          cfg.amplitude += ampDiff * blendRate
          cfg.frequency += freqDiff * blendRate
        }
      }

      const state = surferStateRef.current
      const phase = state.phase
      let u = uRef.current
      let vx = vxRef.current
      let displayY = 0
      let displayRotDeg = 0
      let visible = true
      let scaleX = 1
      let scaleY = 1
      let opacity = 1

      switch (phase) {
        // ---------------------------------------------------------------
        case 'idle': {
          u = uPosition
          const sample = sampleWave(time, u, cfg)
          displayY = sample.y
          displayRotDeg = sample.slopeDeg

          idleTimeRef.current += dt
          const cycleT = (idleTimeRef.current % IDLE_HINT_CYCLE) / IDLE_HINT_CYCLE

          let envelope = 0
          if (hoveringRef.current) {
            envelope = 1
          } else if (cycleT < IDLE_HINT_FADE) {
            envelope = cycleT / IDLE_HINT_FADE
          } else if (cycleT < IDLE_HINT_ON) {
            envelope = 1
          } else if (cycleT < IDLE_HINT_ON + IDLE_HINT_FADE) {
            envelope = 1 - (cycleT - IDLE_HINT_ON) / IDLE_HINT_FADE
          }

          if (envelope > 0) {
            const pulse = Math.sin(time * IDLE_HOVER_SPEED * Math.PI * 2) * 0.5 + 0.5
            const s = lerp(1, IDLE_HOVER_SCALE, pulse * envelope)
            scaleX = s
            scaleY = s
          }
          break
        }

        // ---------------------------------------------------------------
        case 'accelerating': {
          vx = Math.min(vx + ACCEL * dt, CRUISE_SPEED)

          const sample = sampleWave(time, u, cfg)
          const slopeFactor = Math.cos(Math.abs(sample.slopeDeg) * (Math.PI / 180))
          u += vx * slopeFactor * dt

          displayY = sample.y

          const speedRatio = vx / CRUISE_SPEED
          const targetRot = sample.slopeDeg + speedRatio * -4
          displayRotDeg = lerp(rotationRef.current, targetRot, Math.min(SMOOTH_ROT_RATE * dt, 1))

          // If a peak is imminent during acceleration, snap to cruise and let
          // the riding phase fire the trick immediately on the next frame.
          if (u > uPosition && vx >= CRUISE_SPEED * 0.2 && scanForPeak(time, u, cfg) !== null) {
            vx = CRUISE_SPEED
            dispatch({ type: 'REACHED_CRUISE' })
          } else if (vx >= CRUISE_SPEED - 0.01) {
            dispatch({ type: 'REACHED_CRUISE' })
          }
          if (u > 1.0) dispatch({ type: 'EXITED_WAVE' })

          // Periodic spray while gaining speed
          accelSplashTimerRef.current -= dt
          if (accelSplashTimerRef.current <= 0) {
            accelSplashTimerRef.current = 0.28
            splashEventRef.current = { x: u * W, y: displayY, kind: 'entry' }
          }
          break
        }

        // ---------------------------------------------------------------
        case 'riding': {
          vx = Math.min(vx + ACCEL * dt, CRUISE_SPEED)

          const sample = sampleWave(time, u, cfg)
          const slopeFactor = Math.cos(Math.abs(sample.slopeDeg) * (Math.PI / 180))
          u += vx * slopeFactor * dt
          rideTimeRef.current += dt

          displayY = sample.y
          displayRotDeg = lerp(rotationRef.current, sample.slopeDeg, Math.min(SMOOTH_ROT_RATE * dt, 1))

          if (u > 1.0) {
            dispatch({ type: 'EXITED_WAVE' })
            break
          }

          if (reducedMotionRef.current || rideTimeRef.current < MIN_RIDE_TIME) break

          surfaceTrickRollCooldownRef.current -= dt
          if (
            surfaceTrickRollCooldownRef.current <= 0 &&
            normalTricksSinceSuper.current >= SUPER_TRICK_COOLDOWN &&
            u < EXIT_ZONE
          ) {
            surfaceTrickRollCooldownRef.current = 0.5

            if (!hasDoneTrick('ghost') && Math.random() < P_GHOST) {
              const nearPeak = findNextPeak(time, u, cfg, cfg.amplitude * SMALL_PEAK_AMP_FACTOR)
              if (nearPeak !== null && nearPeak - u < 0.05) {
                recordTrick('ghost')
                trickCountRef.current++
                runHadSuperRef.current = true
                dispatch({
                  type: 'STARTED_GHOST',
                  ghost: {
                    elapsed: 0,
                    fadeInDuration: GHOST_FADE_IN,
                    holdDuration: GHOST_HOLD,
                    fadeOutDuration: GHOST_FADE_OUT,
                  },
                })
                break
              }
            }

            if (
              !hasDoneTrick('hyperdash') &&
              rideTimeRef.current > 0.5 &&
              u < EXIT_ZONE - 0.1 &&
              Math.random() < P_HYPERDASH
            ) {
              recordTrick('hyperdash')
              trickCountRef.current++
              runHadSuperRef.current = true
              dispatch({
                type: 'STARTED_HYPERDASH',
                dash: { elapsed: 0, duration: HYPERDASH_DURATION, springElapsed: -1 },
              })
              break
            }
          }

          if (u > uPosition + SCAN_AHEAD_MIN && u < EXIT_ZONE) {
            const peak = scanForPeak(time, u, cfg)
            if (peak) {
              const done = doneTricks()
              let superKind: TrickKind | null = null
              if (normalTricksSinceSuper.current >= SUPER_TRICK_COOLDOWN) {
                const pity = 1 + runsWithoutSuperRef.current * PITY_MULTIPLIER_PER_RUN
                superKind = pickSuperTrick(peak.peakHeight, done, pity)
              }

              let kind: TrickKind
              let isSuper = false

              if (superKind) {
                kind = superKind
                isSuper = true
              } else {
                kind = peak.kind
                if (done.has(kind)) {
                  const alt: TrickKind = kind === 'backflip' ? 'shuvit' : 'backflip'
                  if (!done.has(alt)) kind = alt
                }
              }

              if (!done.has(kind)) {
                const peakSample = sampleWave(time, peak.u, cfg)

                let vy0: number, gravity: number, rotations: number
                switch (kind) {
                  case 'triple-flip':
                    vy0 = TRIPLE_FLIP_LAUNCH_VY; gravity = TRIPLE_FLIP_GRAVITY; rotations = TRIPLE_FLIP_ROTATIONS; break
                  case 'corkscrew':
                    vy0 = CORKSCREW_LAUNCH_VY; gravity = CORKSCREW_GRAVITY; rotations = CORKSCREW_ROTATIONS; break
                  case 'rocket':
                    vy0 = ROCKET_LAUNCH_VY; gravity = ROCKET_GRAVITY; rotations = ROCKET_ROTATIONS; break
                  case 'time-warp':
                    vy0 = TIMEWARP_LAUNCH_VY; gravity = TIMEWARP_GRAVITY; rotations = TIMEWARP_ROTATIONS; break
                  case 'anti-gravity':
                    vy0 = ANTIGRAVITY_LAUNCH_VY; gravity = ANTIGRAVITY_GRAVITY; rotations = ANTIGRAVITY_ROTATIONS; break
                  case 'backflip':
                    vy0 = BACKFLIP_LAUNCH_VY; gravity = BACKFLIP_GRAVITY; rotations = BACKFLIP_ROTATIONS; break
                  default:
                    vy0 = SHUVIT_LAUNCH_VY; gravity = SHUVIT_GRAVITY; rotations = SHUVIT_ROTATIONS; break
                }

                u = peak.u
                displayY = peakSample.y
                displayRotDeg = peakSample.slopeDeg
                squashTypeRef.current = 'launch'
                squashTimerRef.current = 0
                recordTrick(kind)
                trickCountRef.current++
                isSupertrickRef.current = isSuper

                if (isSuper) {
                  normalTricksSinceSuper.current = 0
                  entryFlashRef.current = 0
                  runHadSuperRef.current = true
                } else {
                  normalTricksSinceSuper.current++
                }

                dispatch({
                  type: 'STARTED_AIRBORNE',
                  trick: {
                    kind,
                    launchU: peak.u,
                    launchY: peakSample.y,
                    launchSlopeDeg: peakSample.slopeDeg,
                    launchVx: vx,
                    vy0,
                    gravity,
                    currentVx: vx,
                    horizDist: 0,
                    elapsed: 0,
                    hasRisen: false,
                    rotations,
                    timewarpFrozen: false,
                    timewarpFreezeElapsed: 0,
                    timewarpFreezeEndedAt: -1,
                    antiGravity: kind === 'anti-gravity',
                    antiGravityElapsed: 0,
                    antiGravityPhase: 'pre',
                  },
                })
                break
              }
            }
          }

          if (
            rideTimeRef.current > BARREL_ROLL_PATIENCE &&
            trickCountRef.current < 3 &&
            u < EXIT_ZONE &&
            !hasDoneTrick('barrel-roll')
          ) {
            recordTrick('barrel-roll')
            normalTricksSinceSuper.current++
            trickCountRef.current++
            dispatch({
              type: 'STARTED_BARREL_ROLL',
              roll: { elapsed: 0, duration: BARREL_ROLL_DURATION, startU: u },
            })
          }
          break
        }

        // ---------------------------------------------------------------
        case 'airborne': {
          const trick = (state as { phase: 'airborne'; trick: AirTrickState }).trick
          trick.elapsed += dt
          const tFlip = trick.elapsed

          let flashScale = 1
          if (entryFlashRef.current >= 0) {
            entryFlashRef.current += dt
            const ft = Math.min(entryFlashRef.current / SUPER_ENTRY_FLASH_DURATION, 1)
            flashScale = lerp(SUPER_ENTRY_FLASH_SCALE, 1, easeOutCubic(ft))
            if (ft >= 1) entryFlashRef.current = -1
          }

          let timewarpFreezeJustEnded = false
          if (trick.kind === 'time-warp') {
            const vy = trick.vy0 + trick.gravity * tFlip
            if (!trick.timewarpFrozen && trick.timewarpFreezeEndedAt < 0 && trick.hasRisen && Math.abs(vy) < TIMEWARP_FREEZE_VY_THRESHOLD) {
              trick.timewarpFrozen = true
              trick.timewarpFreezeElapsed = 0
            }
            if (trick.timewarpFrozen) {
              trick.timewarpFreezeElapsed += dt
              if (trick.timewarpFreezeElapsed >= TIMEWARP_FREEZE_DURATION) {
                trick.timewarpFrozen = false
                trick.timewarpFreezeEndedAt = tFlip
                timewarpFreezeJustEnded = true
              }
            }
          }

          let effectiveGravity = trick.gravity
          if (trick.timewarpFrozen) effectiveGravity = TIMEWARP_FREEZE_GRAVITY

          trick.currentVx *= Math.pow(FLIP_AIR_DRAG, dt * 60)
          trick.horizDist += trick.currentVx * dt
          u = trick.launchU + trick.horizDist

          const arcY = trick.launchY + trick.vy0 * tFlip + 0.5 * effectiveGravity * tFlip * tFlip
          const vy = trick.vy0 + effectiveGravity * tFlip

          if (timewarpFreezeJustEnded) {
            effectEventRef.current = { kind: 'timewarp-freeze', x: u * W, y: arcY }
          }

          if (!trick.hasRisen && arcY < trick.launchY - RISE_THRESHOLD) {
            trick.hasRisen = true
          }

          if (trick.antiGravity && trick.hasRisen) {
            const rawVy = trick.vy0 + trick.gravity * tFlip
            if (trick.antiGravityPhase === 'pre' && rawVy >= 0) {
              trick.antiGravityPhase = 'floating'
              trick.antiGravityElapsed = 0
            }
            if (trick.antiGravityPhase === 'floating') {
              trick.antiGravityElapsed += dt
              if (trick.antiGravityElapsed >= ANTIGRAVITY_FLOAT_DURATION) {
                trick.antiGravityPhase = 'falling'
              }
            }
          }

          const waveSample = sampleWave(time, u, cfg)
          const frozenOrFloating =
            trick.timewarpFrozen ||
            (trick.antiGravity && trick.antiGravityPhase === 'floating')
          const landed = !frozenOrFloating && trick.hasRisen && vy > 0 && arcY >= waveSample.y

          if (landed) {
            displayY = waveSample.y
            const estFlight = (2 * Math.abs(trick.vy0)) / trick.gravity
            const rotProgress = Math.min(tFlip / estFlight, 1)
            const rawEndRot = trick.launchSlopeDeg - 360 * trick.rotations * easeInOutQuad(rotProgress)
            const flipEndRot = normalizeAngleNear(rawEndRot, waveSample.slopeDeg)

            vx = Math.max(trick.currentVx, CRUISE_SPEED * 0.4)
            landRotBlendRef.current = { startRot: flipEndRot, elapsed: 0 }
            displayRotDeg = flipEndRot
            squashTypeRef.current = 'land'
            squashTimerRef.current = 0
            isSupertrickRef.current = false
            rideTimeRef.current = 0
            if (trick.kind === 'time-warp') {
              effectEventRef.current = { kind: 'timewarp-land', x: u * W, y: waveSample.y }
            }
            splashEventRef.current = { x: u * W, y: waveSample.y, kind: 'land' }
            dispatch({ type: 'LANDED' })
          } else {
            let dispY = arcY
            if (trick.antiGravity && trick.antiGravityPhase === 'floating') {
              const floatT = trick.antiGravityElapsed / ANTIGRAVITY_FLOAT_DURATION
              dispY = arcY + ANTIGRAVITY_FLOAT_VY * trick.antiGravityElapsed
              const flipProgress = Math.min(floatT * 2, 1)
              scaleY = lerp(1, -1, easeInOutQuad(flipProgress))
            } else if (trick.antiGravity && trick.antiGravityPhase === 'falling') {
              scaleY = lerp(-1, 1, Math.min(trick.antiGravityElapsed / ANTIGRAVITY_FLOAT_DURATION, 1))
            }

            displayY = dispY

            const estFlight = (2 * Math.abs(trick.vy0)) / trick.gravity
            const rotProgress = Math.min(tFlip / estFlight, 1)
            displayRotDeg = trick.launchSlopeDeg - 360 * trick.rotations * easeInOutQuad(rotProgress)

            if (trick.kind === 'corkscrew') {
              const estDuration = (2 * Math.abs(trick.vy0)) / trick.gravity
              const corkProgress = Math.min(tFlip / estDuration, 1)
              scaleX = Math.cos(corkProgress * CORKSCREW_FLIPS * Math.PI * 2) * flashScale
              scaleY = flashScale
            } else if (trick.kind === 'rocket') {
              const estDuration = (2 * Math.abs(trick.vy0)) / trick.gravity
              const halfT = estDuration / 2
              const rocketProgress = tFlip / halfT
              if (rocketProgress < 1) {
                scaleX = lerp(0.7, 1, easeOutCubic(rocketProgress)) * flashScale
                scaleY = lerp(1.4, 0.7, easeOutCubic(rocketProgress)) * flashScale
              } else {
                const fallT = Math.min((tFlip - halfT) / halfT, 1)
                scaleX = lerp(1, 1, fallT) * flashScale
                scaleY = lerp(0.7, 1, easeOutCubic(fallT)) * flashScale
              }
            } else if (trick.antiGravityPhase === 'pre') {
              if (squashTypeRef.current === 'launch') {
                squashTimerRef.current += dt
                const st = Math.min(squashTimerRef.current / LAUNCH_SQUASH_DURATION, 1)
                const squashFade = 1 - easeOutCubic(st)
                scaleX = lerp(1, SQUASH_SX, squashFade) * flashScale
                scaleY = lerp(1, SQUASH_SY, squashFade) * flashScale
                if (st >= 1) squashTypeRef.current = 'none'
              } else {
                const vyNorm = Math.min(Math.abs(vy) / Math.abs(trick.vy0), 1)
                scaleX = lerp(1, STRETCH_SX, vyNorm * 0.5) * flashScale
                scaleY = lerp(1, STRETCH_SY, vyNorm * 0.5) * flashScale
              }
            }

            if (trick.timewarpFrozen) {
              // Float upward and pulsate while frozen
              const elevT = Math.min(trick.timewarpFreezeElapsed / TIMEWARP_ELEVATION_DURATION, 1)
              const elevation = TIMEWARP_ELEVATION * easeOutCubic(elevT)
              displayY = arcY - elevation
              const pulse = Math.sin(trick.timewarpFreezeElapsed * TIMEWARP_PULSE_HZ * Math.PI * 2) * 0.5 + 0.5
              opacity = lerp(0.65, 1.0, pulse)
              const scalePulse = lerp(0.92, 1.08, pulse)
              scaleX = flashScale * scalePulse
              scaleY = flashScale * scalePulse
            } else if (trick.timewarpFreezeEndedAt >= 0) {
              // Fade out after freeze ends
              const fadeT = Math.min((tFlip - trick.timewarpFreezeEndedAt) / TIMEWARP_FADE_DURATION, 1)
              opacity = 1 - easeOutCubic(fadeT)
              scaleX = flashScale
              scaleY = flashScale
            }

            if (
              trick.kind !== 'corkscrew' &&
              trick.kind !== 'rocket' &&
              !trick.timewarpFrozen &&
              trick.antiGravityPhase === 'pre'
            ) {
              if (squashTypeRef.current === 'launch') {
                squashTimerRef.current += dt
                const st = Math.min(squashTimerRef.current / LAUNCH_SQUASH_DURATION, 1)
                const squashFade = 1 - easeOutCubic(st)
                scaleX = lerp(1, SQUASH_SX, squashFade) * flashScale
                scaleY = lerp(1, SQUASH_SY, squashFade) * flashScale
                if (st >= 1) squashTypeRef.current = 'none'
              } else if (trick.kind !== 'time-warp' || !trick.timewarpFrozen) {
                const vyNorm = Math.min(Math.abs(vy) / Math.abs(trick.vy0), 1)
                scaleX = lerp(1, STRETCH_SX, vyNorm * 0.5) * flashScale
                scaleY = lerp(1, STRETCH_SY, vyNorm * 0.5) * flashScale
              }
            }
          }
          break
        }

        // ---------------------------------------------------------------
        case 'barrel-roll': {
          const roll = (state as { phase: 'barrel-roll'; roll: BarrelRollState }).roll
          roll.elapsed += dt
          const progress = Math.min(roll.elapsed / roll.duration, 1)

          u += vx * dt
          const sample = sampleWave(time, u, cfg)
          displayY = sample.y
          displayRotDeg = sample.slopeDeg

          const rollAngle = progress * Math.PI * 2
          scaleX = Math.cos(rollAngle)
          scaleY = 1 + 0.1 * Math.sin(rollAngle)

          if (progress >= 1) {
            rideTimeRef.current = 0
            dispatch({ type: 'TRICK_DONE' })
          } else if (u > 1.0) {
            dispatch({ type: 'EXITED_WAVE' })
          }
          break
        }

        // ---------------------------------------------------------------
        case 'ghost': {
          const ghost = (state as { phase: 'ghost'; ghost: GhostState }).ghost
          ghost.elapsed += dt
          const total = ghost.fadeInDuration + ghost.holdDuration + ghost.fadeOutDuration

          let ghostOpacity: number
          if (ghost.elapsed < ghost.fadeInDuration) {
            ghostOpacity = lerp(1, GHOST_MIN_OPACITY, ghost.elapsed / ghost.fadeInDuration)
          } else if (ghost.elapsed < ghost.fadeInDuration + ghost.holdDuration) {
            ghostOpacity = GHOST_MIN_OPACITY
          } else {
            const t = (ghost.elapsed - ghost.fadeInDuration - ghost.holdDuration) / ghost.fadeOutDuration
            ghostOpacity = lerp(GHOST_MIN_OPACITY, 1, Math.min(t, 1))
          }
          opacity = ghostOpacity

          const sample = sampleWave(time, u, cfg)
          const slopeFactor = Math.cos(Math.abs(sample.slopeDeg) * (Math.PI / 180))
          u += vx * GHOST_SPEED_MULT * slopeFactor * dt
          displayY = sample.y
          displayRotDeg = lerp(rotationRef.current, sample.slopeDeg, Math.min(SMOOTH_ROT_RATE * dt, 1))

          if (ghost.elapsed >= total || u > 1.0) {
            isSupertrickRef.current = false
            rideTimeRef.current = 0
            dispatch(u > 1.0 ? { type: 'EXITED_WAVE' } : { type: 'TRICK_DONE' })
          }
          break
        }

        // ---------------------------------------------------------------
        case 'hyperdash': {
          const dash = (state as { phase: 'hyperdash'; dash: HyperdashState }).dash
          dash.elapsed += dt

          const sample = sampleWave(time, u, cfg)
          const slopeFactor = Math.cos(Math.abs(sample.slopeDeg) * (Math.PI / 180))

          if (dash.elapsed < dash.duration) {
            u += HYPERDASH_VX * slopeFactor * dt
            displayY = sample.y
            displayRotDeg = lerp(rotationRef.current, sample.slopeDeg, Math.min(SMOOTH_ROT_RATE * dt, 1))
            scaleX = HYPERDASH_SCALE_X
            scaleY = HYPERDASH_SCALE_Y
          } else {
            if (dash.springElapsed < 0) dash.springElapsed = 0
            dash.springElapsed += dt
            const springT = Math.min(dash.springElapsed / HYPERDASH_SPRING_DURATION, 1)
            const spring = 1 + Math.sin(springT * Math.PI * 2) * (1 - springT) * 0.2
            scaleX = lerp(HYPERDASH_SCALE_X, 1, easeOutCubic(springT)) * spring
            scaleY = lerp(HYPERDASH_SCALE_Y, 1, easeOutCubic(springT))

            u += vx * slopeFactor * dt
            displayY = sample.y
            displayRotDeg = lerp(rotationRef.current, sample.slopeDeg, Math.min(SMOOTH_ROT_RATE * dt, 1))

            if (dash.springElapsed >= HYPERDASH_SPRING_DURATION || u > 1.0) {
              isSupertrickRef.current = false
              rideTimeRef.current = 0
              dispatch(u > 1.0 ? { type: 'EXITED_WAVE' } : { type: 'TRICK_DONE' })
            }
          }
          break
        }

        // ---------------------------------------------------------------
        case 'exiting': {
          vx = Math.min(vx + ACCEL * 1.5 * dt, CRUISE_SPEED)
          u += vx * dt

          if (squashTypeRef.current === 'land') {
            squashTimerRef.current += dt
            const t = Math.min(squashTimerRef.current / LAND_SQUASH_DURATION, 1)
            const spring = Math.sin(t * Math.PI) * (1 - t)
            scaleX = lerp(1, SQUASH_SX, spring)
            scaleY = lerp(1, SQUASH_SY, spring)
            if (t >= 1) squashTypeRef.current = 'none'
          }

          if (u > 1.15) {
            visible = false
            squashTypeRef.current = 'none'
            landRotBlendRef.current = null
            timerRef.current = 0
            dispatch({ type: 'OFF_EDGE' })
          } else {
            const sample = sampleWave(time, Math.min(u, 1.0), cfg)
            displayY = sample.y

            if (landRotBlendRef.current) {
              landRotBlendRef.current.elapsed += dt
              const blendT = Math.min(landRotBlendRef.current.elapsed / LAND_ROT_BLEND_DURATION, 1)
              displayRotDeg = lerp(landRotBlendRef.current.startRot, sample.slopeDeg, easeOutCubic(blendT))
              if (blendT >= 1) landRotBlendRef.current = null
            } else {
              displayRotDeg = sample.slopeDeg
            }
          }
          break
        }

        // ---------------------------------------------------------------
        case 'offscreen': {
          if (timerRef.current === 0) {
            prevRunTricksRef.current = new Set(usedTricksRef.current)
          }

          if (timerRef.current === 0 && autoBoostRef.current && baseAmplitudeRef.current !== null && baseFrequencyRef.current !== null) {
            if (runHadSuperRef.current) {
              runsWithoutSuperRef.current = 0
              waveBoostRef.current = 0
              waveFreqBoostRef.current = 0
            } else {
              runsWithoutSuperRef.current++
              waveBoostRef.current = Math.min(
                waveBoostRef.current + AMPLITUDE_BOOST_PER_RUN,
                MAX_AMPLITUDE_BOOST
              )
              waveFreqBoostRef.current = Math.min(
                waveFreqBoostRef.current + FREQUENCY_BOOST_PER_RUN,
                MAX_FREQUENCY_BOOST
              )
            }
            runHadSuperRef.current = false
            targetConfigRef.current = {
              amplitude: baseAmplitudeRef.current + waveBoostRef.current,
              frequency: baseFrequencyRef.current + waveFreqBoostRef.current,
            }
          }

          timerRef.current += dt
          visible = false

          if (timerRef.current >= OFFSCREEN_DELAY) {
            u = -0.12
            vx = RETURN_START_SPEED
            dispatch({ type: 'OFFSCREEN_TIMER_DONE' })
          }
          break
        }

        // ---------------------------------------------------------------
        case 'returning': {
          const remaining = uPosition - u
          if (remaining <= 0) {
            u = uPosition
            vx = 0
            displayY = sampleWave(time, uPosition, cfg).y
            splashEventRef.current = { x: u * W, y: displayY, kind: 'entry' }
            dispatch({ type: 'RETURNED' })
          } else {
            const totalDist = uPosition - -0.12
            const progress = 1 - remaining / totalDist
            const easeFactor = Math.pow(1 - progress, RETURN_EASE_POWER)
            vx = RETURN_START_SPEED * Math.max(easeFactor, 0.05)
            u += vx * dt

            if (u >= uPosition) {
              u = uPosition
              vx = 0
              displayY = sampleWave(time, uPosition, cfg).y
              splashEventRef.current = { x: u * W, y: displayY, kind: 'entry' }
              dispatch({ type: 'RETURNED' })
            }
          }

          const sample = sampleWave(time, Math.max(u, 0), cfg)
          displayY = sample.y
          displayRotDeg = sample.slopeDeg
          break
        }

        default: {
          const sample = sampleWave(time, u, cfg)
          displayY = sample.y
          displayRotDeg = sample.slopeDeg
        }
      }

      // Landing squash (harder for super tricks)
      if (squashTypeRef.current === 'land' && phase !== 'airborne') {
        squashTimerRef.current += dt
        const t = Math.min(squashTimerRef.current / LAND_SQUASH_DURATION, 1)
        const spring = Math.sin(t * Math.PI) * (1 - t)
        const landSY = isSupertrickRef.current ? SUPER_SQUASH_SY : SQUASH_SY
        scaleX = lerp(1, SQUASH_SX, spring)
        scaleY = lerp(1, landSY, spring)
        if (t >= 1) squashTypeRef.current = 'none'
      }

      // Persist continuous state
      uRef.current = u
      vxRef.current = vx
      rotationRef.current = displayRotDeg

      // Determine clickability
      const clickable =
        phase === 'idle' ||
        phase === 'accelerating' ||
        phase === 'riding' ||
        phase === 'returning' ||
        phase === 'offscreen'

      // Write frame state
      const isGlowing = isSupertrickRef.current || phase === 'ghost' || phase === 'hyperdash'
      const rocketFlame = phase === 'airborne' &&
        (state as { phase: 'airborne'; trick: AirTrickState }).trick.kind === 'rocket'
      frameStateRef.current = {
        x: u * W,
        y: displayY,
        rotationDeg: displayRotDeg,
        scaleX,
        scaleY,
        opacity,
        glow: isGlowing,
        visible,
        clickable,
        rocketFlame,
      }
    }

    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [configsRef, waveIndex, uPosition])

  return { frameStateRef, trickEventRef, effectEventRef, splashEventRef, onSurferClick, onKeyDown, onPointerEnter, onPointerLeave }
}
