import Hero from 'widgets/hero'
import CvBento from 'widgets/cv-bento'
import { Layout } from 'shared/ui'

export default function HomePage() {
  return (
    <Layout>
      <div className='snap-start md:-ml-14 md:w-[calc(100%+3.5rem)]'>
        <Hero />
      </div>
      <section
        id='profile'
        className='snap-start px-4 pt-12 pb-8 bg-gradient-to-b from-blue-600 to-blue-700 dark:from-[#0d0221] dark:to-[#1a0a3e]'
      >
        <CvBento />
      </section>
    </Layout>
  )
}
