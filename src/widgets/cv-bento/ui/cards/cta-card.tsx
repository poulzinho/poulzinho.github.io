import { useTranslation } from 'react-i18next'
import { COLORS } from 'shared/lib/colors'
import { useTheme } from 'shared/ui/theme/theme-context'
import { BentoCard, Button } from 'shared/ui'
import { LinkedInIcon, GitHubIcon } from '../icons'

const LINKEDIN_URL = 'https://www.linkedin.com/in/paul-gualotuna'
const GITHUB_URL = 'https://github.com/poulzinho'

const SUN = {
  gradient: `linear-gradient(135deg, ${COLORS.sunPinkMed} 0%, ${COLORS.sunPink} 100%)`,
  headline: 'text-white',
  sub: 'text-white/80',
}
const MOON = {
  gradient: `linear-gradient(135deg, ${COLORS.waveDeep3} 0%, ${COLORS.waveFront1} 100%)`,
  headline: 'text-white',
  sub: 'text-white/70',
}

export default function CtaCard() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const s = theme === 'light' ? SUN : MOON

  return (
    <BentoCard colSpan={6} rowSpan={1} variant='hero' label={t('cv_cta_headline')} className='relative'>
      <div className='absolute inset-0' style={{ background: s.gradient }} />
      <div className='relative flex h-full items-center justify-between gap-6'>
        <div className='flex flex-col gap-2'>
          <h3 className={`text-2xl font-bold leading-tight ${s.headline}`}>
            {t('cv_cta_headline')}
          </h3>
          <p className={`text-sm ${s.sub}`}>{t('cv_cta_subtext')}</p>
        </div>
        <div className='flex shrink-0 flex-col gap-2'>
          <Button variant='ghost' href={LINKEDIN_URL} target='_blank' leftIcon={<LinkedInIcon />}>
            {t('linkedin_button_text')}
          </Button>
          <Button variant='ghost' href={GITHUB_URL} target='_blank' leftIcon={<GitHubIcon />}>
            {t('github_button_text')}
          </Button>
        </div>
      </div>
    </BentoCard>
  )
}
