import { type ReactNode } from 'react'
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

const SUN = 'bg-black/6 text-gray-800 ring-1 ring-black/10'
const MOON = 'bg-white/8 text-white/90 ring-1 ring-white/10'

export default function Chip({
  label,
  icon,
  accentColor,
  size = 'md',
  className = '',
}: ChipProps) {
  const { theme } = useTheme()
  const themeClass = theme === 'light' ? SUN : MOON
  const accentStyle = accentColor
    ? { borderLeft: `2px solid ${accentColor}`, borderRadius: '0 9999px 9999px 0' }
    : undefined

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full',
        SIZE[size],
        themeClass,
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
