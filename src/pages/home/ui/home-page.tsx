import Hero from 'widgets/hero'
import ProfileCard from 'widgets/profile-card'
import Layout from 'shared/ui/layout'
import { ThemeToggle } from 'shared/ui'
import { useScrollSnap } from 'shared/lib/use-scroll-snap'

export default function HomePage() {
  const containerRef = useScrollSnap()

  return (
    <Layout menuItems={[<ThemeToggle key='theme' />]}>
      <div ref={containerRef}>
        <section className='scroll-panel h-dvh'>
          <Hero />
        </section>
        <section
          id='profile'
          className='scroll-panel flex min-h-dvh items-center justify-center overflow-y-auto py-8 bg-gradient-to-b from-blue-600 to-blue-700 dark:from-[#0d0221] dark:to-[#1a0a3e]'
        >
          <ProfileCard />
        </section>
      </div>
    </Layout>
  )
}
