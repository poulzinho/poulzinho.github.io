import { memo } from 'react'
import type { WaveConfig } from 'widgets/wave-scene'

type Props = {
  configs: WaveConfig[]
  onChange: (
    index: number,
    key: keyof Pick<WaveConfig, 'amplitude' | 'frequency' | 'speed' | 'skew'>,
    value: number
  ) => void
  onDirectionChange: (direction: 1 | -1) => void
  onReset: () => void
  dynamic: boolean
  onDynamicChange: (enabled: boolean) => void
  autoBoost: boolean
  onAutoBoostChange: (enabled: boolean) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const WAVE_LABELS = ['Wave 1', 'Wave 2', 'Wave 3']

const SLIDERS: {
  key: keyof Pick<WaveConfig, 'amplitude' | 'frequency' | 'speed' | 'skew'>
  label: string
  min: number
  max: number
  step: number
}[] = [
  { key: 'amplitude', label: 'Amplitude', min: 0, max: 80, step: 1 },
  { key: 'frequency', label: 'Frequency', min: 0.5, max: 8, step: 0.1 },
  { key: 'speed', label: 'Speed', min: 0.05, max: 2, step: 0.01 },
  { key: 'skew', label: 'Skew', min: -0.4, max: 0.4, step: 0.01 },
]

export default memo(function WaveControls({
  configs,
  onChange,
  onDirectionChange,
  onReset,
  dynamic,
  onDynamicChange,
  autoBoost,
  onAutoBoostChange,
  isOpen,
  onOpenChange,
}: Props) {
  const direction = configs[0]?.direction ?? 1

  return (
    <div className='absolute right-4 top-14 z-50 flex flex-col items-end'>
      <button
        onClick={() => onOpenChange(!isOpen)}
        className='w-28 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-white/20'
      >
        {isOpen ? 'Hide controls' : 'Wave controls'}
      </button>

      {isOpen && (
        <div className='mt-2 w-72 rounded-xl bg-black/65 p-4 backdrop-blur-md'>
          <div className='space-y-4'>
            {/* Dynamic mode toggle */}
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold tracking-widest text-white/60 uppercase'>
                Dynamic
              </span>
              <button
                onClick={() => onDynamicChange(!dynamic)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  dynamic
                    ? 'bg-emerald-400 text-gray-900'
                    : 'bg-white/10 text-white/60 hover:text-white'
                }`}
              >
                {dynamic ? 'On' : 'Off'}
              </button>
            </div>

            {/* Group direction toggle */}
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold tracking-widest text-white/60 uppercase'>
                Direction
              </span>
              <div className='flex rounded-full bg-white/10 p-0.5'>
                <button
                  onClick={() => onDirectionChange(-1)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${direction === -1 ? 'bg-white text-gray-900' : 'text-white/60 hover:text-white'}`}
                >
                  &#8594; Right
                </button>
                <button
                  onClick={() => onDirectionChange(1)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${direction === 1 ? 'bg-white text-gray-900' : 'text-white/60 hover:text-white'}`}
                >
                  &#8592; Left
                </button>
              </div>
            </div>

            {/* Per-wave sliders */}
            {configs.map((cfg, i) => (
              <div key={i} className={dynamic ? 'opacity-40' : ''}>
                <div className='mb-1.5 flex items-center justify-between'>
                  <p
                    className='text-xs font-semibold tracking-widest uppercase'
                    style={{ color: `color-mix(in srgb, ${cfg.strokeColor ?? cfg.color} 65%, white)` }}
                  >
                    {WAVE_LABELS[i]}
                  </p>
                  {i === 1 && (
                    <button
                      onClick={() => onAutoBoostChange(!autoBoost)}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium transition ${
                        autoBoost
                          ? 'bg-cyan-400/80 text-gray-900'
                          : 'bg-white/10 text-white/50 hover:text-white'
                      }`}
                    >
                      Auto
                    </button>
                  )}
                </div>
                <div className='space-y-1.5'>
                  {SLIDERS.map(({ key, label, min, max, step }) => (
                    <label
                      key={key}
                      className='flex items-center gap-2 text-xs text-white/80'
                    >
                      <span className='w-20 shrink-0'>{label}</span>
                      <input
                        type='range'
                        min={min}
                        max={max}
                        step={step}
                        value={cfg[key]}
                        disabled={dynamic || (autoBoost && i === 1 && (key === 'amplitude' || key === 'frequency'))}
                        onChange={e =>
                          onChange(i, key, parseFloat(e.target.value))
                        }
                        className='h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-white disabled:cursor-not-allowed'
                      />
                      <span className='w-10 text-right tabular-nums'>
                        {cfg[key].toFixed(key === 'amplitude' ? 0 : 2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Reset button */}
            <button
              onClick={onReset}
              disabled={dynamic}
              className='w-full rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40'
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  )
})
