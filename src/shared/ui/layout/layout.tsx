import { PropsWithChildren, ReactNode } from 'react'

const TOOLBAR_ARIA_LABEL = 'Toolbar'

type LayoutProps = PropsWithChildren<{ menuItems?: ReactNode[] }>

export default function Layout({ children, menuItems }: LayoutProps) {
  return (
    <div className='flex min-h-screen w-full flex-col dark:bg-gray-950'>
      <header className='fixed top-0 right-0 left-0 z-50 bg-blue-600/80 backdrop-blur-sm dark:bg-gray-900/80'>
        <nav
          aria-label={TOOLBAR_ARIA_LABEL}
          className='flex items-center justify-between px-4 py-2'
        >
          <span className='text-sm font-semibold tracking-widest text-white uppercase'>
            Paúl Gualotuña
          </span>
          {menuItems && menuItems.length > 0 && (
            <div className='flex items-center gap-2'>{menuItems}</div>
          )}
        </nav>
      </header>
      <main className='w-full'>{children}</main>
    </div>
  )
}
