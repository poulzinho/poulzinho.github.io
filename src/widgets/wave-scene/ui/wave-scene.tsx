import { memo, MutableRefObject, ReactNode } from 'react'
import { COLORS } from 'shared/lib/colors'
import type { ParticleEmitter } from '../lib/particle-emitter'
import type { WaveConfig } from '../lib/wave-math'
import { H, W } from '../lib/wave-math'
import WaveCanvas from './wave-canvas'

type Props = {
  configsRef: MutableRefObject<WaveConfig[]>
  children?: ReactNode
  splashEmitterRef?: MutableRefObject<ParticleEmitter | null>
}

export default memo(function WaveScene({ configsRef, children, splashEmitterRef }: Props) {
  return (
    <div
      className='absolute bottom-0 left-0 z-10 w-full origin-[left_bottom] -translate-x-[20%] scale-[2.5] sm:-translate-x-[18%] sm:scale-[1.8] md:-translate-x-[6%] md:scale-[1.3] lg:translate-x-0 lg:scale-100'
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <WaveCanvas configsRef={configsRef} splashEmitterRef={splashEmitterRef} />
      <svg
        className='absolute inset-0 h-full w-full overflow-visible'
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio='none'
        aria-hidden='true'
      >
        <defs>
          <filter id='cuy-glow' x='-50%' y='-50%' width='200%' height='200%'>
            <feGaussianBlur stdDeviation='6' result='blur' />
            <feFlood floodColor={COLORS.effectGlow} floodOpacity='0.7' result='color' />
            <feComposite in='color' in2='blur' operator='in' result='glow' />
            <feMerge>
              <feMergeNode in='glow' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>
        {children}
      </svg>
    </div>
  )
})
