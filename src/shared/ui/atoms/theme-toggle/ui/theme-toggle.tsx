import { useTheme } from 'shared/ui/theme/theme-context'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      className='rounded-full p-1 text-white transition-colors hover:bg-white/20'
    >
      {theme === 'dark' ? (
        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
          <path d='M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z' />
        </svg>
      ) : (
        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
          <circle cx='12' cy='12' r='4' />
          <line x1='12' y1='2'  x2='12' y2='4' />
          <line x1='12' y1='20' x2='12' y2='22' />
          <line x1='2'  y1='12' x2='4'  y2='12' />
          <line x1='20' y1='12' x2='22' y2='12' />
          <line x1='4.93'  y1='4.93'  x2='6.34'  y2='6.34' />
          <line x1='17.66' y1='17.66' x2='19.07' y2='19.07' />
          <line x1='4.93'  y1='19.07' x2='6.34'  y2='17.66' />
          <line x1='17.66' y1='6.34'  x2='19.07' y2='4.93' />
        </svg>
      )}
    </button>
  )
}
