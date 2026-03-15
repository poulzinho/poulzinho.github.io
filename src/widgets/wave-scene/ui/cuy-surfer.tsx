import { gsap } from 'gsap'
import { memo, MutableRefObject, useEffect, useRef } from 'react'
import cuySurferUrl from 'shared/assets/images/cuy-surfer.svg'
import { COLORS } from 'shared/lib/colors'
import type { ParticleEmitter } from '../lib/particle-emitter'
import type { WaveConfig } from '../lib/wave-configs'
import { W } from '../lib/wave-math'
import type { EffectEvent } from '../model/use-surfer-machine'
import { useSurferMachine } from '../model/use-surfer-machine'

const TRICK_LABELS: Record<string, string> = {
  backflip: 'BACKFLIP',
  shuvit: 'SHUVIT',
  'triple-flip': 'TRIPLE FLIP',
  corkscrew: 'CORKSCREW',
  rocket: 'ROCKET',
  'time-warp': 'TIME WARP',
  'anti-gravity': 'ANTI-GRAVITY',
  'barrel-roll': 'BARREL ROLL',
  ghost: 'GHOST',
  hyperdash: 'HYPERDASH',
}

function playEffect(
  event: EffectEvent,
  ring1: SVGCircleElement | null,
  ring2: SVGCircleElement | null,
  flash: SVGCircleElement | null,
) {
  const { x, y } = event
  if (!ring1 || !ring2) return

  gsap.killTweensOf([ring1, ring2, flash])

  if (event.kind === 'timewarp-freeze') {
    // Disappear: central flash implosion + two outward rings
    if (flash) {
      gsap.set(flash, { attr: { cx: x, cy: y, r: 0 }, opacity: 1 })
      gsap.to(flash, { attr: { r: 55 }, opacity: 0, duration: 0.3, ease: 'power3.out' })
    }
    gsap.set(ring1, { attr: { cx: x, cy: y, r: 14 }, opacity: 1, strokeWidth: 3 })
    gsap.set(ring2, { attr: { cx: x, cy: y, r: 14 }, opacity: 0.7, strokeWidth: 1.5 })
    gsap.to(ring1, { attr: { r: 170 }, opacity: 0, duration: 0.85, ease: 'power2.out' })
    gsap.to(ring2, { attr: { r: 100 }, opacity: 0, duration: 0.55, ease: 'power3.out', delay: 0.12 })
  } else {
    // Appear: two impact rings expand from the landing point
    gsap.set(ring1, { attr: { cx: x, cy: y, r: 8 }, opacity: 0.9, strokeWidth: 3 })
    gsap.set(ring2, { attr: { cx: x, cy: y, r: 4 }, opacity: 0.7, strokeWidth: 2 })
    gsap.to(ring1, { attr: { r: 100 }, opacity: 0, duration: 0.5, ease: 'power3.out' })
    gsap.to(ring2, { attr: { r: 60 }, opacity: 0, duration: 0.35, ease: 'power3.out', delay: 0.08 })
  }
}

type Props = {
  configsRef: MutableRefObject<WaveConfig[]>
  waveIndex?: number
  uPosition?: number
  size?: number
  verticalAnchor?: number
  splashEmitterRef?: MutableRefObject<ParticleEmitter | null>
  autoBoost?: boolean
}

function CuySurfer({
  configsRef,
  waveIndex = 1,
  uPosition = 0.15,
  size = 100,
  verticalAnchor = 0.77,
  splashEmitterRef,
  autoBoost = true,
}: Props) {
  const imageRef = useRef<SVGImageElement>(null)
  const hitAreaRef = useRef<SVGRectElement>(null)
  const trickLabelRef = useRef<SVGTextElement>(null)
  const ring1Ref = useRef<SVGCircleElement>(null)
  const ring2Ref = useRef<SVGCircleElement>(null)
  const flashRef = useRef<SVGCircleElement>(null)

  const { frameStateRef, trickEventRef, effectEventRef, splashEventRef, onSurferClick, onKeyDown, onPointerEnter, onPointerLeave } =
    useSurferMachine(configsRef, { waveIndex, uPosition, autoBoost })


  // Apply frame state to DOM each tick
  useEffect(() => {
    const apply = () => {
      const s = frameStateRef.current
      const imgEl = imageRef.current
      const hitEl = hitAreaRef.current
      if (!imgEl) return

      const cx = s.x
      const cy = s.y
      const imgCenterX = cx
      const imgCenterY = cy - size * verticalAnchor + size / 2

      const transform = [
        `rotate(${s.rotationDeg}, ${cx}, ${cy})`,
        `translate(${imgCenterX}, ${imgCenterY})`,
        `scale(${s.scaleX}, ${s.scaleY})`,
        `translate(${-imgCenterX}, ${-imgCenterY})`,
      ].join(' ')

      imgEl.setAttribute('x', String(cx - size / 2))
      imgEl.setAttribute('y', String(cy - size * verticalAnchor))
      imgEl.setAttribute('transform', transform)
      imgEl.setAttribute('opacity', String(s.visible ? s.opacity : 0))
      imgEl.setAttribute('filter', s.glow ? 'url(#cuy-glow)' : '')

      if (hitEl) {
        const hitPad = size * 0.1
        hitEl.setAttribute('x', String(cx - size / 2 - hitPad))
        hitEl.setAttribute('y', String(cy - size * verticalAnchor - hitPad))
        hitEl.setAttribute('width', String(size + hitPad * 2))
        hitEl.setAttribute('height', String(size + hitPad * 2))
        hitEl.style.pointerEvents = s.clickable ? 'auto' : 'none'
        hitEl.style.cursor = s.clickable ? 'pointer' : 'default'
      }

      // Rocket flame — updated every frame
      if (splashEmitterRef?.current) {
        splashEmitterRef.current.setFlameSource(
          s.rocketFlame
            ? { x: s.x, y: s.y + size * (1 - verticalAnchor) + 14 }
            : null
        )
      }

      const pendingEffect = effectEventRef.current
      if (pendingEffect) {
        effectEventRef.current = null
        playEffect(pendingEffect, ring1Ref.current, ring2Ref.current, flashRef.current)
      }

      const pendingSplash = splashEventRef.current
      if (pendingSplash) {
        splashEventRef.current = null
        splashEmitterRef?.current?.emit(pendingSplash.x, pendingSplash.y, pendingSplash.kind)
      }

      const pendingTrick = trickEventRef.current
      if (pendingTrick) {
        trickEventRef.current = null
        const labelEl = trickLabelRef.current
        if (labelEl) {
          const labelX = cx
          const labelY = cy - size * verticalAnchor - 12
          labelEl.textContent = TRICK_LABELS[pendingTrick] ?? pendingTrick.toUpperCase()
          labelEl.setAttribute('x', String(labelX))
          labelEl.setAttribute('y', String(labelY))
          gsap.killTweensOf(labelEl)
          const tl = gsap.timeline()
          tl.fromTo(labelEl,
            { opacity: 0, scale: 0.5, transformOrigin: `${labelX}px ${labelY}px` },
            { opacity: 1, scale: 1.15, duration: 0.15, ease: 'back.out(2)' }
          )
          tl.to(labelEl, { scale: 1, duration: 0.1, ease: 'power1.out' })
          tl.to(labelEl, { y: -40, opacity: 0, duration: 0.55, ease: 'power1.in' }, '+=0.35')
          tl.set(labelEl, { y: 0 })
        }
      }
    }

    gsap.ticker.add(apply)
    return () => gsap.ticker.remove(apply)
  }, [frameStateRef, trickEventRef, effectEventRef, splashEventRef, splashEmitterRef, size, verticalAnchor])

  return (
    <g>
      <circle ref={flashRef} cx={0} cy={0} r={0} fill={COLORS.effectCyan} opacity={0} style={{ pointerEvents: 'none' }} />
      <circle ref={ring1Ref} cx={0} cy={0} r={0} fill='none' stroke={COLORS.effectCyan} opacity={0} style={{ pointerEvents: 'none' }} />
      <circle ref={ring2Ref} cx={0} cy={0} r={0} fill='none' stroke='#ffffff' opacity={0} style={{ pointerEvents: 'none' }} />
      <text
        ref={trickLabelRef}
        fontSize={18}
        fontWeight='bold'
        fontFamily='monospace'
        textAnchor='middle'
        fill={COLORS.effectCyan}
        stroke={COLORS.effectCyanDark}
        strokeWidth={3}
        paintOrder='stroke'
        opacity={0}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      />
      <image
        ref={imageRef}
        href={cuySurferUrl}
        width={size}
        height={size}
        x={uPosition * W - size / 2}
        y={0}
      />
      <rect
        ref={hitAreaRef}
        fill='transparent'
        stroke='none'
        width={size * 1.2}
        height={size * 1.2}
        style={{ cursor: 'pointer', outline: 'none' }}
        onClick={onSurferClick}
        onKeyDown={onKeyDown}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        role='button'
        tabIndex={0}
        aria-label='Click the cuy surfer to make him do a trick'
      />
    </g>
  )
}

export default memo(CuySurfer)
