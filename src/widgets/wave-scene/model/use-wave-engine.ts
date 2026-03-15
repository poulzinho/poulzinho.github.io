import { gsap } from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_WAVE_CONFIGS } from '../lib/wave-configs'
import type { WaveConfig } from '../lib/wave-configs'

// ---------------------------------------------------------------------------
// Dynamic mode — harmonic sine-wave modulation
// ---------------------------------------------------------------------------
//
// Each (wave index, parameter) pair gets its own slow sine oscillator with a
// unique frequency and phase offset. The oscillators are layered (2 sines
// summed) so the motion isn't perfectly periodic — it drifts in and out of
// phase, creating organic, never-repeating variation.
//
// The modulation depth controls how far each parameter swings from its
// default value. Everything is continuous and smooth — no random jumps.
// ---------------------------------------------------------------------------

type ModKey = 'amplitude' | 'frequency' | 'speed' | 'skew'

// How far each parameter can swing from its default (±)
const MOD_DEPTH: Record<ModKey, number> = {
  amplitude: 25,
  frequency: 1.2,
  speed: 0.45,
  skew: 0.15,
}

// Absolute bounds so values stay sensible
const MOD_BOUNDS: Record<ModKey, { min: number; max: number }> = {
  amplitude: { min: 5, max: 78 },
  frequency: { min: 0.6, max: 6.5 },
  speed: { min: 0.08, max: 1.9 },
  skew: { min: -0.38, max: 0.38 },
}

// Per-oscillator config: two layered sines per (wave, param) pair.
// Frequencies are in cycles per minute — deliberately very slow.
// Phase offsets spread the waves apart so they don't all breathe in unison.
type OscLayer = { cpm: number; phaseOffset: number; weight: number }

function buildOscillators(waveCount: number, keys: ModKey[]): OscLayer[][][] {
  // Returns oscillators[waveIndex][keyIndex] = [layer0, layer1]
  const golden = 1.618033988749895
  const result: OscLayer[][][] = []
  for (let w = 0; w < waveCount; w++) {
    const perWave: OscLayer[][] = []
    for (let k = 0; k < keys.length; k++) {
      const seed = w * keys.length + k
      perWave.push([
        {
          cpm: 1.5 + seed * 0.37,
          phaseOffset: seed * golden * Math.PI,
          weight: 0.65,
        },
        {
          cpm: 0.7 + seed * 0.23,
          phaseOffset: seed * golden * golden * Math.PI + 1.1,
          weight: 0.35,
        },
      ])
    }
    result.push(perWave)
  }
  return result
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

const MOD_KEYS: ModKey[] = ['amplitude', 'frequency', 'speed', 'skew']
const OSCILLATORS = buildOscillators(DEFAULT_WAVE_CONFIGS.length, MOD_KEYS)

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export type WaveEngineHandlers = {
  onChange: (
    index: number,
    key: keyof Pick<WaveConfig, 'amplitude' | 'frequency' | 'speed' | 'skew'>,
    value: number
  ) => void
  onDirectionChange: (direction: 1 | -1) => void
  onReset: () => void
  onDynamicChange: (enabled: boolean) => void
}

export function useWaveEngine(controlsOpen = false): {
  configs: WaveConfig[]
  configsRef: React.MutableRefObject<WaveConfig[]>
  dynamic: boolean
  handlers: WaveEngineHandlers
} {
  const [configs, setConfigs] = useState<WaveConfig[]>(DEFAULT_WAVE_CONFIGS)
  const [dynamic, setDynamic] = useState(false)
  const configsRef = useRef(configs)

  const controlsOpenRef = useRef(controlsOpen)
  const dynamicRef = useRef(dynamic)
  const directionRef = useRef<1 | -1>(1)
  const dynamicBaseRef = useRef<WaveConfig[]>(DEFAULT_WAVE_CONFIGS)
  const dynamicStartTimeRef = useRef(-1)

  // Keep refs in sync
  useEffect(() => { configsRef.current = configs }, [configs])
  useEffect(() => { dynamicRef.current = dynamic }, [dynamic])
  useEffect(() => { controlsOpenRef.current = controlsOpen }, [controlsOpen])

  // Dynamic mode ticker — sine-wave modulation, no random targets
  useEffect(() => {
    const lastSyncRef = { current: 0 }
    const tick = (time: number) => {
      if (dynamicRef.current) {
        if (dynamicStartTimeRef.current < 0) dynamicStartTimeRef.current = time
        const startupT = Math.min((time - dynamicStartTimeRef.current) / 1.5, 1.0)
        const blend = startupT * startupT // ease-in over 1.5s

        const next = DEFAULT_WAVE_CONFIGS.map((base, w) => {
          const cfg = { ...base }
          const snapshot = dynamicBaseRef.current[w] ?? base

          MOD_KEYS.forEach((key, k) => {
            const layers = OSCILLATORS[w]?.[k]
            if (!layers) return

            let mod = 0
            for (const layer of layers) {
              const freq = (layer.cpm / 60) * Math.PI * 2 // cycles/min → rad/s
              mod += Math.sin(time * freq + layer.phaseOffset) * layer.weight
            }
            // Oscillate around snapshot value, scaling in amplitude over startup period
            const snapshotVal = snapshot[key] as number
            const bounds = MOD_BOUNDS[key]
            cfg[key] = clamp(snapshotVal + mod * MOD_DEPTH[key] * blend, bounds.min, bounds.max)
          })

          // Compensate for speed changes across all t*speed terms in computeY.
          const prevCfg = configsRef.current[w]
          const prevSpeed = prevCfg?.speed ?? cfg.speed
          const speedDelta = prevSpeed - cfg.speed
          cfg.phaseOffset = (prevCfg?.phaseOffset ?? 0) + time * speedDelta * directionRef.current
          cfg.phaseOffsetMag = (prevCfg?.phaseOffsetMag ?? 0) + time * speedDelta
          cfg.direction = directionRef.current

          return cfg
        })

        configsRef.current = next
      }

      // Sync sliders once per second — only when controls panel is open
      if (controlsOpenRef.current && time - lastSyncRef.current > 1.0) {
        lastSyncRef.current = time
        const current = configsRef.current
        setConfigs(prev =>
          current.map((cfg, i) => ({ ...cfg, direction: prev[i]?.direction ?? cfg.direction }))
        )
      }
    }

    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [configsRef])

  const onChange = useCallback(
    (
      index: number,
      key: keyof Pick<WaveConfig, 'amplitude' | 'frequency' | 'speed' | 'skew'>,
      value: number
    ) => {
      setConfigs(prev =>
        prev.map((cfg, i) => (i === index ? { ...cfg, [key]: value } : cfg))
      )
    },
    []
  )

  const onDirectionChange = useCallback((direction: 1 | -1) => {
    directionRef.current = direction
    setConfigs(prev => prev.map(cfg => ({ ...cfg, direction })))
  }, [])

  const onReset = useCallback(() => {
    setConfigs(DEFAULT_WAVE_CONFIGS)
  }, [])

  const onDynamicChange = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        dynamicBaseRef.current = configsRef.current.map(cfg => ({ ...cfg }))
        dynamicStartTimeRef.current = -1
      }
      setDynamic(enabled)
      if (!enabled) setConfigs([...configsRef.current])
    },
    [configsRef]
  )

  return {
    configs,
    configsRef,
    dynamic,
    handlers: { onChange, onDirectionChange, onReset, onDynamicChange },
  }
}
