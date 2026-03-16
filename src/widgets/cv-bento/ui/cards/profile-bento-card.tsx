import { useTranslation } from 'react-i18next'
import profilePic from 'shared/assets/images/profile-pic.jpg'
import { COLORS } from 'shared/lib/colors'
import { useTheme } from 'shared/ui/theme/theme-context'
import { BentoCard } from 'shared/ui'

const LINKEDIN_URL  = 'https://www.linkedin.com/in/paul-gualotuna'
// LinkedIn was removed from simple-icons; path sourced from their brand guidelines
const LINKEDIN_PATH = 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'

const SUN = {
  imgFilter:        'grayscale(1) contrast(1.15) brightness(0.95)',
  photoShadow:      `linear-gradient(180deg, ${COLORS.waveMid1}, ${COLORS.waveMid1})`,
  photoShadowBlend: 'color'  as const,
  vignette:         'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)',
  caption:          'rgba(255,255,255,0.85)',
}

const MOON = {
  imgFilter:        'grayscale(1) contrast(1.15) brightness(0.95)',
  photoShadow:      `linear-gradient(180deg, ${COLORS.moonLavender}, ${COLORS.waveDeep3})`,
  photoShadowBlend: 'color' as const,
  vignette:         `linear-gradient(to top, ${COLORS.waveDeep1}cc 0%, transparent 50%)`,
  caption:          'rgba(255,255,255,0.85)',
}

export default function ProfileBentoCard() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const s = theme === 'light' ? SUN : MOON

  return (
    <BentoCard colSpan={2} rowSpan={2} tabletRowSpan={1} variant='default' label={t('paul_name')} className='!p-0'>
      <div className='relative h-full w-full' style={{ isolation: 'isolate' }}>
        <img
          className='h-full w-full object-cover object-top'
          src={profilePic}
          alt={t('paul_profile_picture_alt_text')}
          title={t('paul_profile_picture_alt_text')}
          style={{ filter: s.imgFilter }}
        />
        <div
          className='absolute inset-0'
          style={{ background: s.photoShadow, mixBlendMode: s.photoShadowBlend }}
        />
        <div className='absolute inset-0' style={{ background: s.vignette ?? undefined }} />
        <a
          href={LINKEDIN_URL}
          target='_blank'
          rel='noopener noreferrer'
          aria-label='View LinkedIn profile'
          className='absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/50'
          style={{ color: '#ffffff' }}
        >
          <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
            <path d={LINKEDIN_PATH} />
          </svg>
        </a>
        <p className='absolute bottom-2 left-3 text-xs' style={{ color: s.caption }}>
          {t('paul_profile_picture_caption')}
        </p>
      </div>
    </BentoCard>
  )
}
