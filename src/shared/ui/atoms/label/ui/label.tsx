import { type ReactNode, createElement } from 'react'

type LabelAs = 'p' | 'h2' | 'h3' | 'h4' | 'span'

interface LabelProps {
  children: ReactNode
  as?: LabelAs
  muted?: boolean
  className?: string
}

export default function Label({
  children,
  as = 'p',
  muted = false,
  className = '',
}: LabelProps) {
  return createElement(
    as,
    {
      className: [
        'text-xs font-medium uppercase tracking-widest',
        muted ? 'opacity-50' : '',
        className,
      ]
        .filter(Boolean)
        .join(' '),
    },
    children
  )
}
