import type { TrickKind } from './trick-system'

// ---------------------------------------------------------------------------
// Surfer motion
// ---------------------------------------------------------------------------

export const ACCEL = 0.35
export const CRUISE_SPEED = 0.45

// Rotation smoothing rate (per second). Prevents snapping to steep slope angles instantly.
// Higher = snappier, lower = more damping. Y position always follows wave exactly.
export const SMOOTH_ROT_RATE = 15

// ---------------------------------------------------------------------------
// Trick physics — launch velocity, gravity, rotations
// ---------------------------------------------------------------------------

// Backflip (big peak)
export const BACKFLIP_LAUNCH_VY = -280
export const BACKFLIP_GRAVITY = 700
export const BACKFLIP_ROTATIONS = 1

// Shuvit (small peak) — lower, quicker arc with half spin
export const SHUVIT_LAUNCH_VY = -160
export const SHUVIT_GRAVITY = 850
export const SHUVIT_ROTATIONS = 0.5

// Triple Flip — turbo backflip
export const TRIPLE_FLIP_LAUNCH_VY = -420
export const TRIPLE_FLIP_GRAVITY = 550
export const TRIPLE_FLIP_ROTATIONS = 3

// Corkscrew — backflip arc + rapid scaleX oscillation (4 flips)
export const CORKSCREW_LAUNCH_VY = -280
export const CORKSCREW_GRAVITY = 700
export const CORKSCREW_ROTATIONS = 1
export const CORKSCREW_FLIPS = 4 // scaleX full cycles during flight

// Rocket — insane height, slow gravity, 2.5 rotations
export const ROCKET_LAUNCH_VY = -700
export const ROCKET_GRAVITY = 120
export const ROCKET_ROTATIONS = 2.5

// Time Warp — normal backflip but freezes at apex
export const TIMEWARP_LAUNCH_VY = -280
export const TIMEWARP_GRAVITY = 700
export const TIMEWARP_ROTATIONS = 1
export const TIMEWARP_FREEZE_VY_THRESHOLD = 60 // |vy| below this → start freeze
export const TIMEWARP_FREEZE_DURATION = 1.2
export const TIMEWARP_FREEZE_GRAVITY = 30
export const TIMEWARP_ELEVATION = 28              // SVG units to float upward during freeze
export const TIMEWARP_ELEVATION_DURATION = 0.45   // seconds to reach full elevation
export const TIMEWARP_PULSE_HZ = 1.8              // breathing frequency during freeze
export const TIMEWARP_FADE_DURATION = 0.18        // fade to invisible after freeze ends

// Anti-Gravity — rises, then floats upward inverted, then falls
export const ANTIGRAVITY_LAUNCH_VY = -280
export const ANTIGRAVITY_GRAVITY = 700
export const ANTIGRAVITY_ROTATIONS = 1
export const ANTIGRAVITY_FLOAT_DURATION = 0.6
export const ANTIGRAVITY_FLOAT_VY = -60 // continues rising slowly while inverted

// Ghost — phases through wave face
export const GHOST_FADE_IN = 0.25
export const GHOST_HOLD = 0.15
export const GHOST_FADE_OUT = 0.2
export const GHOST_SPEED_MULT = 4 // u advances this many times faster during ghost
export const GHOST_MIN_OPACITY = 0.15

// Hyperdash — rockets horizontally
export const HYPERDASH_VX = CRUISE_SPEED * 5
export const HYPERDASH_DURATION = 0.2
export const HYPERDASH_SPRING_DURATION = 0.18
export const HYPERDASH_SCALE_X = 1.35
export const HYPERDASH_SCALE_Y = 0.65

// Barrel roll (flat section) — stays on wave surface
export const BARREL_ROLL_DURATION = 0.45

// Air drag during any airborne trick
export const FLIP_AIR_DRAG = 0.92

// ---------------------------------------------------------------------------
// Wave boost
// ---------------------------------------------------------------------------

export const AMPLITUDE_BOOST_PER_RUN = 18
export const MAX_AMPLITUDE_BOOST = 100 // caps at default 50 + 100 = 150
export const FREQUENCY_BOOST_PER_RUN = 1.4
export const MAX_FREQUENCY_BOOST = 5.5 // caps at default 2.2 + 5.5 = 7.7

// ---------------------------------------------------------------------------
// Squash & stretch
// ---------------------------------------------------------------------------

export const LAUNCH_SQUASH_DURATION = 0.12
export const LAND_SQUASH_DURATION = 0.18
export const SQUASH_SX = 1.25
export const SQUASH_SY = 0.75
export const SUPER_SQUASH_SY = 0.6 // harder landing for super tricks
export const STRETCH_SX = 0.85
export const STRETCH_SY = 1.18

// ---------------------------------------------------------------------------
// Visual effects
// ---------------------------------------------------------------------------

// Entry flash: super tricks burst to this scale then ease to 1
export const SUPER_ENTRY_FLASH_SCALE = 1.3
export const SUPER_ENTRY_FLASH_DURATION = 0.1

// Landing rotation blend
export const LAND_ROT_BLEND_DURATION = 0.15

// Return easing
export const RETURN_EASE_POWER = 3

// Idle hover hint
export const IDLE_HOVER_SCALE = 1.04
export const IDLE_HOVER_SPEED = 2.5
export const IDLE_HINT_CYCLE = 6.0
export const IDLE_HINT_ON = 0.3
export const IDLE_HINT_FADE = 0.08

// Super tricks that use the glow filter
export const SUPER_TRICK_KINDS = new Set<TrickKind>([
  'triple-flip',
  'corkscrew',
  'rocket',
  'time-warp',
  'anti-gravity',
  'ghost',
  'hyperdash',
])

// ---------------------------------------------------------------------------
// Timing
// ---------------------------------------------------------------------------

export const MIN_RIDE_TIME = 0
export const BARREL_ROLL_PATIENCE = 0.7
export const OFFSCREEN_DELAY = 2.0
export const RETURN_START_SPEED = 0.55
export const SCAN_AHEAD_MIN = 0.01
export const EXIT_ZONE = 0.72
export const MAX_DT = 0.1
export const RISE_THRESHOLD = 5

// ---------------------------------------------------------------------------
// Pure math helpers
// ---------------------------------------------------------------------------

export function easeOutCubic(t: number): number {
  const t1 = 1 - t
  return 1 - t1 * t1 * t1
}

export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function normalizeAngleNear(angle: number, target: number): number {
  let diff = angle - target
  diff = (((diff % 360) + 540) % 360) - 180
  return target + diff
}
