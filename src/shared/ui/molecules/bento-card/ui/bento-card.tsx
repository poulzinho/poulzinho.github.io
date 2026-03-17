import type { ReactNode } from 'react'
import { COLORS } from 'shared/lib/colors'
import { useTheme } from 'shared/ui/theme/theme-context'

export type BentoVariant = 'default' | 'accent' | 'hero'
export type ColSpan = 1 | 2 | 3 | 4 | 5 | 6
export type RowSpan = 1 | 2 | 3

interface BentoCardProps {
  children: ReactNode
  colSpan?: ColSpan // lg: desktop
  rowSpan?: RowSpan // lg: desktop
  tabletColSpan?: ColSpan // md: override (defaults to colSpan, capped at 2)
  tabletRowSpan?: RowSpan // md: override (defaults to rowSpan)
  variant?: BentoVariant
  label?: string
  /** Remove default padding — use when children fill the card edge-to-edge */
  noPadding?: boolean
  className?: string
}

// Desktop (lg:)
const COL_SPAN_LG: Record<ColSpan, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
}

// Tablet (md:) — capped at 2 since tablet grid is 2 cols
const COL_SPAN_MD: Record<ColSpan, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-2',
  4: 'md:col-span-2',
  5: 'md:col-span-2',
  6: 'md:col-span-2',
}

const ROW_SPAN_LG: Record<RowSpan, string> = {
  1: 'lg:row-span-1',
  2: 'lg:row-span-2',
  3: 'lg:row-span-3',
}

const ROW_SPAN_MD: Record<RowSpan, string> = {
  1: 'md:row-span-1',
  2: 'md:row-span-2',
  3: 'md:row-span-2',
}

const SUN: Record<
  BentoVariant,
  { bg: string; border: string; padding: string }
> = {
  default: {
    bg: COLORS.sunCream,
    border: 'ring-1 ring-black/8',
    padding: 'p-6',
  },
  accent: {
    bg: COLORS.sunPeach,
    border: 'ring-1 ring-black/10',
    padding: 'p-6',
  },
  hero: {
    bg: COLORS.sunPinkMed,
    border: 'ring-1 ring-black/10',
    padding: 'p-8',
  },
}

const MOON: Record<
  BentoVariant,
  { bg: string; border: string; padding: string }
> = {
  default: {
    bg: COLORS.moonCard,
    border: 'ring-1 ring-white/10',
    padding: 'p-6',
  },
  accent: {
    bg: COLORS.moonTeal,
    border: 'ring-1 ring-white/10',
    padding: 'p-6',
  },
  hero: {
    bg: COLORS.waveDeep3,
    border: 'ring-1 ring-white/10',
    padding: 'p-8',
  },
}

const RADIUS: Record<BentoVariant, string> = {
  default: 'rounded-2xl',
  accent: 'rounded-2xl',
  hero: 'rounded-3xl',
}

const MIN_HEIGHT: Record<BentoVariant, string> = {
  default: 'min-h-[160px]',
  accent: 'min-h-[160px]',
  hero: 'min-h-[220px]',
}

export default function BentoCard({
  children,
  colSpan = 1,
  rowSpan = 1,
  tabletColSpan,
  tabletRowSpan,
  variant = 'default',
  label,
  noPadding = false,
  className = '',
}: BentoCardProps) {
  const { theme } = useTheme()
  const s = theme === 'light' ? SUN[variant] : MOON[variant]

  const mdCol = COL_SPAN_MD[tabletColSpan ?? colSpan]
  const lgCol = COL_SPAN_LG[colSpan]
  const mdRow = ROW_SPAN_MD[tabletRowSpan ?? rowSpan]
  const lgRow = ROW_SPAN_LG[rowSpan]

  return (
    <article
      aria-label={label}
      className={[
        mdCol,
        lgCol,
        mdRow,
        lgRow,
        RADIUS[variant],
        MIN_HEIGHT[variant],
        s.border,
        noPadding ? '' : s.padding,
        'overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ backgroundColor: s.bg }}
    >
      {children}
    </article>
  )
}
