import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { CuySurfer, WaveScene } from 'widgets/wave-scene'
import { ParticleEmitter } from 'widgets/wave-scene/lib/particle-emitter'
import { useWaveEngine } from 'widgets/wave-scene/model/use-wave-engine'
import CelestialBody from './celestial-body'
import Island from './island'
import WaveControls from './wave-controls'

export default function Hero() {
  const [controlsOpen, setControlsOpen] = useState(false)
  const { configs, configsRef, dynamic, handlers } = useWaveEngine(controlsOpen)
  const [autoBoost, setAutoBoost] = useState(true)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const splashEmitterRef = useRef(new ParticleEmitter())

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([headlineRef.current, subRef.current, ctaRef.current], {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.18,
        ease: 'power3.out',
        delay: 0.2,
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className='relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-t from-cyan-600 to-blue-700 dark:from-gray-900 dark:to-indigo-950'>
      <CelestialBody />
      <Island />
      <WaveScene configsRef={configsRef} splashEmitterRef={splashEmitterRef}>
        <CuySurfer
          configsRef={configsRef}
          splashEmitterRef={splashEmitterRef}
          autoBoost={autoBoost}
        />
      </WaveScene>
      <WaveControls
        configs={configs}
        onChange={handlers.onChange}
        onDirectionChange={handlers.onDirectionChange}
        onReset={handlers.onReset}
        dynamic={dynamic}
        onDynamicChange={handlers.onDynamicChange}
        autoBoost={autoBoost}
        onAutoBoostChange={setAutoBoost}
        isOpen={controlsOpen}
        onOpenChange={setControlsOpen}
      />

      <div className='relative z-20 -mt-32 flex flex-col items-center gap-6 px-6 text-center text-white'>
        <h1
          ref={headlineRef}
          className='text-5xl font-bold tracking-tight drop-shadow-lg sm:text-7xl'
        >
          Hi, I&apos;m Paúl
        </h1>
        <p
          ref={subRef}
          className='max-w-xl text-lg font-light text-white/80 sm:text-2xl'
        >
          Software Engineer crafting modern web experiences
        </p>
      </div>
    </section>
  )
}
