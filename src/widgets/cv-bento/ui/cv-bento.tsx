import { BentoGrid } from 'shared/ui'
import BarChartCard from './cards/bar-chart-card'
import BrowserCard from './cards/browser-card'
import CtaCard from './cards/cta-card'
import DataVizCard from './cards/data-viz-card'
import DualityCard from './cards/duality-card'
import DuckCard from './cards/duck-card'
import FrameworksCard from './cards/frameworks-card'
import HeroCard from './cards/hero-card'
import IndustriesCard from './cards/industries-card'
import LanguagesCard from './cards/languages-card'
import ProfileBentoCard from './cards/profile-bento-card'
import SuperpowerCard from './cards/superpower-card'
import TerminalCard from './cards/terminal-card'
import TimeChartCard from './cards/time-chart-card'

export default function CvBento() {
  return (
    <BentoGrid cols={6} gap={4}>
      <HeroCard />
      <TerminalCard />
      <BrowserCard />
      <ProfileBentoCard />
      <DualityCard />
      <DuckCard />
      <IndustriesCard />
      <SuperpowerCard />
      <LanguagesCard />
      <FrameworksCard />
      <DataVizCard />
      <BarChartCard />
      <TimeChartCard />
      <CtaCard />
    </BentoGrid>
  )
}
