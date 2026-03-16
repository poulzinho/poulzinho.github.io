// Central color palette — single source of truth for all canvas/SVG colors.
// Tailwind class names are used directly in JSX; only hex values that cannot
// be expressed as Tailwind classes are defined here.

export const COLORS = {
  // Celestial bodies
  sunYellow:      '#ffe566',
  sunYellowDark:  '#f0a800',
  sunPeach:       '#ffb380',   // warm orange-peach — bento accent (light)
  sunCream:       '#fff8ed',   // warm off-white — bento card bg (light)
  sunWarm:        '#fdf2f8',   // blush-white — bento secondary card bg (light)
  sunPink:        '#ff71ce',
  sunPinkMed:     '#f559a4',
  sunPinkDark:    '#ec407a',
  moonLavender:   '#f5d0fe',
  moonPurple:     '#a855f7',
  moonSurface:    '#120833',   // elevated dark surface — bento card bg (dark)
  moonCard:       '#1f0d4a',   // card fill, lighter than waveDeep2 (dark)
  moonSlate:      '#1e2a4a',   // dark navy — bento secondary card bg (dark)
  moonTeal:       '#0f3a4a',   // dark teal — bento accent card bg (dark)

  // Ocean waves — back (deep ground swell)
  waveDeep1:      '#0d0221',
  waveDeep2:      '#1a0a3e',
  waveDeep3:      '#3b1578',
  waveDeepStroke: '#7b2fff',

  // Ocean waves — mid (cuy wave)
  waveMid1:       '#0044ff',
  waveMid2:       '#00d4ff',
  waveMid3:       '#00ffff',

  // Ocean waves — front (surface chop)
  waveFront1:     '#7b2fbe',
  waveFront2:     '#bf00ff',
  waveFront3:     '#ff44cc',

  // Trick / effect overlays
  effectTeal:     '#0d9488',
  effectTealLight:'#2dd4bf',
  effectCyan:     '#00ffee',
  effectCyanMed:  '#06b6d4',
  effectCyanDark: '#003333',
  effectGlow:     '#00ffff',
  matrixGreen:    '#00ff88',
} as const
