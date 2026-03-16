import { type ReactNode } from 'react'
import { COLORS } from 'shared/lib/colors'
import { useTheme } from 'shared/ui/theme/theme-context'

export type ButtonVariant = 'solid' | 'ghost' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  href?: string
  target?: string
  onClick?: () => void
  children: ReactNode
  className?: string
  'aria-label'?: string
}

const SIZE: Record<ButtonSize, string> = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-1.5 text-sm',
  lg: 'px-5 py-2 text-base',
}

const SUN: Record<ButtonVariant, { cls: string; bg?: string }> = {
  solid:   { cls: 'text-white',                                              bg: COLORS.sunPinkMed },
  ghost:   { cls: 'text-gray-900 hover:bg-black/8' },
  outline: { cls: 'text-gray-900 ring-1 ring-black/20 hover:bg-black/5' },
}

const MOON: Record<ButtonVariant, { cls: string; bg?: string }> = {
  solid:   { cls: 'text-white',                                         bg: COLORS.waveDeep3 },
  ghost:   { cls: 'text-white hover:bg-white/10' },
  outline: { cls: 'text-white ring-1 ring-white/20 hover:bg-white/5' },
}

const BASE = 'inline-flex items-center gap-2 rounded-lg font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'

export default function Button({
  variant = 'solid',
  size = 'md',
  leftIcon,
  rightIcon,
  href,
  target,
  onClick,
  children,
  className = '',
  'aria-label': ariaLabel,
}: ButtonProps) {
  const { theme } = useTheme()
  const s = theme === 'light' ? SUN[variant] : MOON[variant]

  const shared = {
    'aria-label': ariaLabel,
    className: [BASE, SIZE[size], s.cls, className].filter(Boolean).join(' '),
    style: s.bg ? { backgroundColor: s.bg } : undefined,
  }

  if (href) {
    return (
      <a href={href} target={target} {...shared}>
        {leftIcon}
        {children}
        {rightIcon}
      </a>
    )
  }

  return (
    <button type='button' onClick={onClick} {...shared}>
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}
