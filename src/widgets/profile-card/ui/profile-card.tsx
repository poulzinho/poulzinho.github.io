import { useTranslation } from 'react-i18next'
import profilePic from 'shared/assets/images/profile-pic.jpg'
import { COLORS } from 'shared/lib/colors'
import { useTheme } from 'shared/ui/theme/theme-context'

const LINKED_IN_URL = 'https://www.linkedin.com/in/paul-gualotuna'
const GITHUB_URL = 'https://github.com/poulzinho'

const SUN = {
  header: COLORS.sunYellow,
  headerText: 'text-gray-900',
  headerSub: 'text-gray-800',
  imgFilter: 'grayscale(1) contrast(1.15) brightness(0.95)',
  photoShadow: `linear-gradient(180deg, ${COLORS.waveMid1}, ${COLORS.waveMid1})`,
  photoShadowBlend: 'color' as const,
  photoHighlight: null,
  photoHighBlend: 'normal' as const,
  vignette: null,
  content: `linear-gradient(to bottom, ${COLORS.sunPinkMed}, ${COLORS.sunPink})`,
  caption: '#7c2d4e',
  text: 'text-gray-900',
  subtext: 'text-gray-800',
  avatarText: 'text-gray-900',
  footer: COLORS.sunPink,
  footerText: 'text-gray-900',
}

const MOON = {
  header: COLORS.waveFront1,
  headerText: 'text-white',
  headerSub: 'text-white/70',
  imgFilter: 'grayscale(1) contrast(1.15) brightness(0.95)',
  photoShadow: `linear-gradient(180deg, ${COLORS.moonLavender}, ${COLORS.waveDeep3})`,
  photoShadowBlend: 'color' as const,
  photoHighlight: null,
  photoHighBlend: 'normal' as const,
  vignette: `linear-gradient(to top, ${COLORS.waveDeep1}cc 0%, transparent 50%)`,
  content: `linear-gradient(to bottom, ${COLORS.waveDeep2}, ${COLORS.waveDeep3})`,
  caption: COLORS.moonLavender,
  text: 'text-white',
  subtext: 'text-white/80',
  avatarText: 'text-white',
  footer: COLORS.waveDeep3,
  footerText: 'text-white/80',
}

export default function ProfileCard() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const s = theme === 'light' ? SUN : MOON

  return (
    <div className='max-w-[460px] overflow-hidden rounded-lg shadow-2xl'>
      {/* Card header */}
      <div
        className='flex items-center gap-3 p-4'
        style={{ background: s.header }}
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-medium ring-2 ring-white/40 ${s.avatarText}`}
          aria-label='recipe'
        >
          {t('paul_initials')}
        </div>
        <div className='flex-1'>
          <p className={`text-sm font-medium ${s.headerText}`}>
            {t('paul_name')}
          </p>
          <p className={`text-xs ${s.headerSub}`}>{t('paul_position')}</p>
        </div>
        <button aria-label='settings' className='text-white/50' />
      </div>

      {/* Card media */}
      <div className='relative' style={{ isolation: 'isolate' }}>
        <img
          className='h-[300px] w-full object-cover'
          src={profilePic}
          alt={t('paul_profile_picture_alt_text')}
          title={t('paul_profile_picture_alt_text')}
          style={{ filter: s.imgFilter }}
        />
        <div
          className='absolute inset-0'
          style={{
            background: s.photoShadow,
            mixBlendMode: s.photoShadowBlend,
          }}
        />
        <div className='absolute inset-0' style={{ background: s.vignette ?? undefined }} />
      </div>

      {/* Card content */}
      <div className='px-4 pt-1 pb-2' style={{ background: s.content }}>
        <p className='text-xs' style={{ color: s.caption }}>
          {t('paul_profile_picture_caption')}
        </p>
        <h2 className={`mt-1.5 mb-1.5 text-2xl font-normal ${s.text}`}>
          {t('greetings')}
        </h2>
        <p className={`mb-3 text-base ${s.subtext}`}>
          {t('paul_profile_intro')}
        </p>
        <p className={`text-sm ${s.subtext}`}>
          {t('paul_profile_description')}
        </p>
      </div>

      {/* Card actions */}
      <div
        className='flex items-center px-2 pb-2'
        style={{ backgroundColor: s.footer }}
      >
        <button
          className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium tracking-wide ${s.footerText} uppercase transition-colors hover:bg-white/10`}
          onClick={() => window.open(LINKED_IN_URL, '_blank')}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            className='h-5 w-5 fill-current'
            aria-hidden='true'
          >
            <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
          </svg>
          {t('linkedin_button_text')}
        </button>
        <button
          className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium tracking-wide ${s.footerText} uppercase transition-colors hover:bg-white/10`}
          onClick={() => window.open(GITHUB_URL, '_blank')}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            className='h-5 w-5 fill-current'
            aria-hidden='true'
          >
            <path d='M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z' />
          </svg>
          {t('github_button_text')}
        </button>
      </div>
    </div>
  )
}
