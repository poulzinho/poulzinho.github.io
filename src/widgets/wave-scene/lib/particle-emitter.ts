const POOL_SIZE = 160
const GRAVITY = 460  // SVG units/s²
const FLAME_RATE = 90 // particles/second — ~25 alive at peak (90 × 0.27s avg life)

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  r: number
  active: boolean
  kind: 'splash' | 'flame'
}

export type SplashKind = 'land' | 'entry'

export class ParticleEmitter {
  private pool: Particle[] = Array.from({ length: POOL_SIZE }, () => ({
    x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1, r: 2, active: false, kind: 'splash' as const,
  }))

  private flameSource: { x: number; y: number } | null = null
  private flameAccum = 0

  setFlameSource(pos: { x: number; y: number } | null): void {
    this.flameSource = pos
    if (!pos) this.flameAccum = 0
  }

  emit(x: number, y: number, kind: SplashKind): void {
    const count = kind === 'land' ? 16 : 8
    let spawned = 0
    for (const p of this.pool) {
      if (!p.active) {
        this.initSplashParticle(p, x, y, kind)
        if (++spawned >= count) break
      }
    }
  }

  private initSplashParticle(p: Particle, x: number, y: number, kind: SplashKind): void {
    p.active = true
    p.kind = 'splash'
    p.x = x + (Math.random() - 0.5) * 18
    p.y = y

    if (kind === 'land') {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.15
      const speed = 130 + Math.random() * 200
      p.vx = Math.cos(angle) * speed
      p.vy = Math.sin(angle) * speed
      p.r = 1.5 + Math.random() * 2.5
      p.maxLife = 0.38 + Math.random() * 0.32
    } else {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.75 + 0.35
      const speed = 55 + Math.random() * 95
      p.vx = Math.cos(angle) * speed
      p.vy = Math.sin(angle) * speed
      p.r = 1 + Math.random() * 1.5
      p.maxLife = 0.18 + Math.random() * 0.2
    }
    p.life = p.maxLife
  }

  private initFlameParticle(p: Particle, x: number, y: number): void {
    p.active = true
    p.kind = 'flame'
    p.x = x + (Math.random() - 0.5) * 22
    p.y = y + Math.random() * 8
    p.vx = (Math.random() - 0.5) * 38
    p.vy = 110 + Math.random() * 160  // strong downward exhaust jet
    p.r = 3 + Math.random() * 6       // bigger blobs for visibility
    p.maxLife = 0.15 + Math.random() * 0.24
    p.life = p.maxLife
  }

  update(dt: number): void {
    // Continuous flame emission
    if (this.flameSource) {
      this.flameAccum += FLAME_RATE * dt
      while (this.flameAccum >= 1) {
        this.flameAccum -= 1
        for (const p of this.pool) {
          if (!p.active) {
            this.initFlameParticle(p, this.flameSource.x, this.flameSource.y)
            break
          }
        }
      }
    }

    for (const p of this.pool) {
      if (!p.active) continue
      if (p.kind !== 'flame') p.vy += GRAVITY * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.life -= dt
      if (p.life <= 0) p.active = false
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save()
    for (const p of this.pool) {
      if (!p.active) continue
      const t = p.life / p.maxLife   // 1 = fresh, 0 = dying

      if (p.kind === 'flame') {
        // Color: white-yellow (fresh) → orange → deep red (dying)
        const heat = 1 - t
        const r = 255
        let g: number
        let b = 0
        if (heat < 0.35) {
          g = Math.floor(255 - heat / 0.35 * 55)   // 255 → 200
          b = Math.floor(255 - heat / 0.35 * 255)  // 255 → 0
        } else if (heat < 0.65) {
          g = Math.floor(200 - ((heat - 0.35) / 0.3) * 120)  // 200 → 80
        } else {
          g = Math.floor(80 - ((heat - 0.65) / 0.35) * 60)   // 80 → 20
        }
        ctx.globalAlpha = t * 0.9
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.beginPath()
        ctx.ellipse(p.x, p.y, p.r * 0.65, p.r, 0, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.globalAlpha = t * t * 0.88
        ctx.fillStyle = '#cceeff'
        ctx.beginPath()
        ctx.ellipse(p.x, p.y, p.r, p.r * 0.65, 0, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.restore()
  }
}
