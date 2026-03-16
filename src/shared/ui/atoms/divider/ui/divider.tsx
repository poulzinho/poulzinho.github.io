interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export default function Divider({
  orientation = 'horizontal',
  className = '',
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role='separator'
        aria-orientation='vertical'
        className={['w-px self-stretch bg-current opacity-15', className]
          .filter(Boolean)
          .join(' ')}
      />
    )
  }

  return (
    <hr
      role='separator'
      className={['border-none h-px w-full bg-current opacity-15', className]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
