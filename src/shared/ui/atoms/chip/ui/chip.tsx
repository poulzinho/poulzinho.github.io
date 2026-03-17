import { type CSSProperties, type ReactNode } from 'react'
import { useTheme } from 'shared/ui/theme/theme-context'

export type ChipSize = 'sm' | 'md'

interface ChipProps {
  label: string
  icon?: ReactNode
  accentColor?: string
  size?: ChipSize
  className?: string
}

const SIZE: Record<ChipSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}

const SUN_BASE = 'text-gray-800 ring-1 ring-black/10'
const MOON_BASE = 'text-white/90 ring-1 ring-white/10'
const SUN_PLAIN = 'bg-black/6'
const MOON_PLAIN = 'bg-white/8'

export default function Chip({
  label,
  icon,
  accentColor,
  size = 'md',
  className = '',
}: ChipProps) {
  const { theme } = useTheme()
  const baseClass = theme === 'light' ? SUN_BASE : MOON_BASE
  const plainBg = theme === 'light' ? SUN_PLAIN : MOON_PLAIN

  const accentStyle: CSSProperties | undefined = accentColor
    ? {
        background: `${accentColor}18`,
        borderLeft: `2px solid ${accentColor}`,
        borderRadius: '0 9999px 9999px 0',
      }
    : undefined

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full',
        SIZE[size],
        baseClass,
        accentColor ? '' : plainBg,
        accentColor ? 'rounded-l-sm' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={accentStyle}
    >
      {icon && <span aria-hidden='true'>{icon}</span>}
      {label}
    </span>
  )
}
