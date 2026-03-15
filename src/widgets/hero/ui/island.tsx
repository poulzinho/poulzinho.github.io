import { memo } from 'react'

function PalmTree({
  className = '',
  flip = false,
}: {
  className?: string
  flip?: boolean
}) {
  return (
    <svg
      viewBox='0 0 200 320'
      className={className}
      fill='currentColor'
      aria-hidden='true'
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      {/* Trunk — tapered, leans slightly toward the fronds */}
      <path d='M84,320 C82,240 90,160 104,78 L112,78 C118,160 112,240 96,320Z' />
      {/* Fronds — each a proper tapered leaf shape */}
      <path d='M108,80 C85,70 55,68 18,88 C55,84 85,82 108,84Z' />
      <path d='M105,78 C88,62 68,42 45,20 C68,46 88,64 107,82Z' />
      <path d='M107,76 C100,54 96,30 90,6 C96,32 102,55 110,76Z' />
      <path d='M112,76 C128,58 144,38 158,16 C144,40 128,60 110,78Z' />
      <path d='M114,80 C136,70 158,64 188,72 C158,78 136,80 112,84Z' />
      <path d='M114,84 C140,86 164,92 188,108 C162,90 138,84 112,86Z' />
      {/* Coconuts */}
      <ellipse cx='106' cy='90' rx='6' ry='5' />
      <ellipse cx='115' cy='88' rx='5' ry='4' />
    </svg>
  )
}

export default memo(function Island() {
  return (
    <div className='absolute inset-x-0 top-[78%] bottom-0 z-[5] bg-gradient-to-b from-pink-400 to-pink-200 dark:from-purple-900 dark:to-purple-500'>
      <PalmTree className='absolute -top-24 left-[6%] h-24 text-stone-900/60 dark:text-stone-950/70' />
      <PalmTree
        className='absolute -top-20 left-[28%] h-20 text-stone-900/60 dark:text-stone-950/70'
        flip
      />
      <PalmTree className='absolute -top-28 right-[24%] h-28 text-stone-900/60 dark:text-stone-950/70' />
      <PalmTree
        className='absolute -top-20 right-[6%] h-20 text-stone-900/60 dark:text-stone-950/70'
        flip
      />
    </div>
  )
})
