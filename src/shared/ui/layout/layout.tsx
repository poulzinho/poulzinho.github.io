import { PropsWithChildren, ReactNode } from 'react'

const TOOLBAR_ARIA_LABEL = 'Toolbar'

type LayoutProps = PropsWithChildren<{ menuItems?: ReactNode[] }>

export default function Layout({ children, menuItems }: LayoutProps) {
  return (
    <div className='flex'>
      <header className='fixed top-0 left-0 right-0 z-50 bg-blue-600'>
        <nav aria-label={TOOLBAR_ARIA_LABEL} className='flex items-center px-4 py-1'>
          {menuItems && menuItems.length > 0 && (
            <button aria-label='menu' className='mr-4 text-white'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
          )}
        </nav>
      </header>
      <div className='mt-[30px]'>{children}</div>
    </div>
  )
}
