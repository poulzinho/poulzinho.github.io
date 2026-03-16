import { type ReactNode } from 'react'
import Sidebar from 'shared/ui/organisms/sidebar'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className='flex flex-col dark:bg-gray-950'>
      <Sidebar />
      <main className='h-dvh w-full overflow-y-scroll snap-y snap-mandatory md:pl-14'>{children}</main>
    </div>
  )
}
