import { useTranslation } from 'react-i18next'
import { COLORS } from 'shared/lib/colors'
import { BentoCard, Chip, Label } from 'shared/ui'
import { useTheme } from 'shared/ui/theme/theme-context'

const SUN = {
  bg: COLORS.sunWarm,
  eyebrow: 'text-gray-500',
  headline: 'text-gray-900',
  body: 'text-gray-700',
  footer: 'text-gray-500',
  texture: 'rgba(18, 28, 46, 0.06)',
  accent: COLORS.effectCyanMed,
}

const MOON = {
  bg: COLORS.moonSlate,
  eyebrow: 'text-white/55',
  headline: 'text-white',
  body: 'text-white/80',
  footer: 'text-white/55',
  texture: 'rgba(210, 220, 235, 0.08)',
  accent: COLORS.effectCyan,
}

const CHIP_ACCENTS = [
  COLORS.effectCyanMed,
  COLORS.sunPinkDark,
  COLORS.sunYellowDark,
  COLORS.effectTeal,
]

export default function DataVizCard() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const s = theme === 'light' ? SUN : MOON

  const vizTypes = [
    t('cv_dataviz_chip_charts'),
    t('cv_dataviz_chip_treemaps'),
    t('cv_dataviz_chip_sankey'),
    t('cv_dataviz_chip_networks'),
  ]

  return (
    <BentoCard
      colSpan={6}
      rowSpan={2}
      tabletRowSpan={1}
      variant='default'
      label={t('cv_dataviz_title')}
      className='relative'
    >
      <div
        className='absolute inset-0'
        style={{ backgroundColor: s.bg }}
      />
      <div
        className='absolute inset-0 opacity-70'
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${s.texture} 1px, transparent 0)`,
          backgroundSize: '18px 18px',
        }}
      />

      <div className='relative flex h-full flex-col gap-4'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex flex-col gap-2'>
            <Label as='h3' muted className={s.eyebrow}>
              {t('cv_dataviz_title')}
            </Label>
            <p
              className={`text-[11px] font-medium tracking-[0.18em] uppercase ${s.eyebrow}`}
            >
              {t('cv_dataviz_eyebrow')}
            </p>
          </div>

          <svg
            width='54'
            height='54'
            viewBox='0 0 54 54'
            aria-hidden='true'
            className='shrink-0'
          >
            <path
              d='M8 38c7-10 12-5 18-13s12-14 20-12'
              fill='none'
              stroke={s.accent}
              strokeWidth='2.25'
              strokeLinecap='round'
            />
            <circle cx='8' cy='38' r='3' fill={s.accent} />
            <circle cx='20' cy='28' r='3' fill={s.accent} opacity='0.85' />
            <circle cx='34' cy='16' r='3' fill={s.accent} opacity='0.7' />
            <circle cx='46' cy='13' r='3' fill={s.accent} opacity='0.55' />
          </svg>
        </div>

        <p className={`text-xl leading-snug font-semibold ${s.headline}`}>
          {t('cv_dataviz_headline')}
        </p>

        <p className={`text-sm leading-relaxed ${s.body}`}>
          {t('cv_dataviz_body')}
        </p>

        <div className='flex flex-wrap gap-1.5'>
          {vizTypes.map((label, index) => (
            <Chip
              key={label}
              label={label}
              accentColor={CHIP_ACCENTS[index]}
              size='sm'
            />
          ))}
        </div>

        <p
          className={`mt-auto text-[11px] font-medium tracking-[0.16em] uppercase ${s.footer}`}
        >
          {t('cv_dataviz_footer')}
        </p>
      </div>
    </BentoCard>
  )
}
