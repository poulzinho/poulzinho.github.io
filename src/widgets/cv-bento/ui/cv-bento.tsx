import { BentoGrid } from 'shared/ui'
import ProfileBentoCard from './cards/profile-bento-card'
import HeroCard         from './cards/hero-card'
import DualityCard      from './cards/duality-card'
import IndustriesCard   from './cards/industries-card'
import LanguagesCard    from './cards/languages-card'
import FrameworksCard   from './cards/frameworks-card'
import SuperpowerCard   from './cards/superpower-card'
import CtaCard          from './cards/cta-card'
import TerminalCard     from './cards/terminal-card'
import BrowserCard      from './cards/browser-card'
import DuckCard         from './cards/duck-card'

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
      <LanguagesCard />
      <FrameworksCard />
      <SuperpowerCard />
      <CtaCard />
    </BentoGrid>
  )
}
