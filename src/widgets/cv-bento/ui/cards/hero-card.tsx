import { useTranslation } from 'react-i18next'
import { TOTAL_YEARS_DISPLAY } from 'shared/lib/career-data'
import { COLORS } from 'shared/lib/colors'
import { BentoCard, Button } from 'shared/ui'
import { useTheme } from 'shared/ui/theme/theme-context'
import { GitHubIcon, LinkedInIcon } from '../icons'

const LINKEDIN_URL = 'https://www.linkedin.com/in/paul-gualotuna'
const GITHUB_URL = 'https://github.com/poulzinho'

const SERIF = { fontFamily: "'DM Serif Display', Georgia, serif" }

const SUN = {
  gradient: `linear-gradient(135deg, ${COLORS.sunPinkMed} 0%, ${COLORS.sunPeach} 100%)`,
  eyebrow: 'text-white/70',
  name: 'text-white',
  tagline: 'text-white',
  bio: 'text-white/90',
  stat: 'text-white/[0.18]',
  statLabel: 'text-white/65',
  divider: 'bg-white/30',
  availability: 'text-white/80',
}
const MOON = {
  gradient: `linear-gradient(135deg, ${COLORS.waveDeep3} 0%, ${COLORS.waveDeep2} 100%)`,
  eyebrow: 'text-white/60',
  name: 'text-white',
  tagline: 'text-white/95',
  bio: 'text-white/80',
  stat: 'text-white/[0.15]',
  statLabel: 'text-white/55',
  divider: 'bg-white/20',
  availability: 'text-white/70',
}

export default function HeroCard() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const s = theme === 'light' ? SUN : MOON

  return (
    <BentoCard
      colSpan={4}
      rowSpan={2}
      variant='hero'
      label={t('paul_name')}
      className='relative'
    >
      {/* Background gradient */}
      <div className='absolute inset-0' style={{ background: s.gradient }} />

      {/* Dot texture */}
      <div
        className='absolute inset-0 opacity-[0.06]'
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Ghost stat — oversized decorative number, top-right */}
      <div
        className={`absolute top-2 right-6 leading-none font-black tracking-tighter select-none ${s.stat}`}
        style={{ fontSize: 'clamp(5rem, 12vw, 10rem)' }}
        aria-hidden='true'
      >
        {TOTAL_YEARS_DISPLAY}
      </div>

      {/* Content */}
      <div className='relative flex h-full flex-col justify-between'>
        {/* Top — eyebrow + stacked name + role */}
        <div>
          <p
            className={`font-mono text-[10px] tracking-[0.25em] uppercase ${s.eyebrow}`}
          >
            {t('cv_hero_eyebrow')}
          </p>
          <h2
            className={`mt-3 leading-[0.92] font-black tracking-tighter ${s.name}`}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 3.75rem)' }}
          >
            {t('paul_name')
              .split(' ')
              .map((word, i) => (
                <span key={i} className='block'>
                  {word}
                </span>
              ))}
          </h2>
          <p
            className={`mt-2 font-mono text-[11px] tracking-[0.18em] uppercase ${s.eyebrow}`}
          >
            {t('cv_hero_role')}
          </p>
        </div>

        {/* Middle — serif tagline + divider + bio + stat label */}
        <div>
          <p
            className={`text-xl leading-snug sm:text-2xl ${s.tagline}`}
            style={SERIF}
          >
            <em>{t('cv_hero_serif_tagline')}</em>
          </p>
          <div className={`my-4 h-px w-10 ${s.divider}`} />
          <p className={`max-w-md text-sm leading-relaxed ${s.bio}`}>
            {t('cv_hero_short_bio')}
          </p>
          <p
            className={`mt-2 font-mono text-[10px] tracking-[0.2em] uppercase ${s.statLabel}`}
          >
            {TOTAL_YEARS_DISPLAY} {t('cv_hero_years_label')} ·{' '}
            {t('cv_hero_location_short')}
          </p>
        </div>

        {/* Bottom — links + green availability dot */}
        <div className='flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex gap-2'>
            <Button
              variant='ghost'
              href={LINKEDIN_URL}
              target='_blank'
              leftIcon={<LinkedInIcon />}
            >
              {t('linkedin_button_text')}
            </Button>
            <Button
              variant='ghost'
              href={GITHUB_URL}
              target='_blank'
              leftIcon={<GitHubIcon />}
            >
              {t('github_button_text')}
            </Button>
          </div>
          <p
            className={`font-mono text-[10px] tracking-[0.2em] uppercase ${s.availability}`}
          >
            <span className='mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 align-middle' />
            {t('cv_hero_availability')}
          </p>
        </div>
      </div>
    </BentoCard>
  )
}
