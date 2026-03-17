import { useTranslation } from 'react-i18next'
import { INDUSTRIES } from 'shared/lib/career-data'
import { BentoCard, Chip, Label } from 'shared/ui'
import { useTheme } from 'shared/ui/theme/theme-context'

const SUN = {
  number: 'text-gray-900',
  label: 'text-gray-500',
  icon: 'rgba(18,28,46,0.55)',
}
const MOON = {
  number: 'text-white',
  label: 'text-white/50',
  icon: 'rgba(210,220,235,0.55)',
}

// ─── Concept SVG icons (24×24 viewBox, no brand affiliation) ─────────────────

function CoinIcon({ fill }: { fill: string }) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      aria-hidden='true'
      fill='none'
      stroke={fill}
      strokeWidth='1.75'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12' cy='12' r='9' />
      <path d='M12 7v1m0 8v1M9.5 9.5C9.5 8.4 10.6 7.5 12 7.5s2.5.9 2.5 2c0 2.5-5 2.5-5 5 0 1.1 1.1 2 2.5 2s2.5-.9 2.5-2' />
    </svg>
  )
}

function HeartIcon({ fill }: { fill: string }) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      aria-hidden='true'
      fill='none'
      stroke={fill}
      strokeWidth='1.75'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
    </svg>
  )
}

function CartIcon({ fill }: { fill: string }) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      aria-hidden='true'
      fill='none'
      stroke={fill}
      strokeWidth='1.75'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='9' cy='21' r='1' />
      <circle cx='20' cy='21' r='1' />
      <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' />
    </svg>
  )
}

function BuildingIcon({ fill }: { fill: string }) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      aria-hidden='true'
      fill='none'
      stroke={fill}
      strokeWidth='1.75'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect x='3' y='3' width='18' height='18' rx='1' />
      <path d='M9 22V12h6v10M9 7h1m4 0h1M9 11h1m4 0h1' />
    </svg>
  )
}

function FlameIcon({ fill }: { fill: string }) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      aria-hidden='true'
      fill='none'
      stroke={fill}
      strokeWidth='1.75'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M8.5 14.5A6 6 0 0 0 18 9c-1-2-2.5-3-2.5-3S16 9 12 11c0 0 1-3-1-6C7 7 6 12 8.5 14.5z' />
      <path d='M12 22c-3.314 0-6-2.686-6-6 0-1.5.5-3 2-4 0 1.5 1 2 2 2 0-2 1.5-4 3-4s2.5 2 2 4c1-1 1.5-2 1.5-3.5 1.5 1 2.5 3 2.5 5.5 0 3.314-2.686 6-7 6z' />
    </svg>
  )
}

function BookIcon({ fill }: { fill: string }) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      aria-hidden='true'
      fill='none'
      stroke={fill}
      strokeWidth='1.75'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20' />
      <path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' />
    </svg>
  )
}

function MicroscopeIcon({ fill }: { fill: string }) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      aria-hidden='true'
      fill='none'
      stroke={fill}
      strokeWidth='1.75'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M9 3h6M12 3v7' />
      <ellipse cx='12' cy='13' rx='4' ry='3' />
      <path d='M4 21h16M12 16v5' />
      <path d='M8 21a8 8 0 0 1 0-16' />
    </svg>
  )
}

function MiningIcon({ fill }: { fill: string }) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      aria-hidden='true'
      fill='none'
      stroke={fill}
      strokeWidth='1.75'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12' cy='12' r='3' />
      <path d='M3 12h3m12 0h3M12 3v3m0 12v3' />
      <path d='M5.636 5.636l2.122 2.122m8.484 8.484 2.122 2.122M5.636 18.364l2.122-2.122m8.484-8.484 2.122-2.122' />
    </svg>
  )
}

function BriefcaseIcon({ fill }: { fill: string }) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      aria-hidden='true'
      fill='none'
      stroke={fill}
      strokeWidth='1.75'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect x='2' y='7' width='20' height='14' rx='2' />
      <path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2' />
      <line x1='12' y1='12' x2='12' y2='12' />
      <path d='M2 12h20' />
    </svg>
  )
}

// ─── Icon map keyed by industry key ──────────────────────────────────────────

const ICON_MAP: Record<string, (fill: string) => React.ReactElement> = {
  finance: fill => <CoinIcon fill={fill} />,
  medical: fill => <HeartIcon fill={fill} />,
  ecommerce: fill => <CartIcon fill={fill} />,
  construction: fill => <BuildingIcon fill={fill} />,
  oil_gas: fill => <FlameIcon fill={fill} />,
  elearning: fill => <BookIcon fill={fill} />,
  academia: fill => <MicroscopeIcon fill={fill} />,
  process_mining: fill => <MiningIcon fill={fill} />,
  consulting: fill => <BriefcaseIcon fill={fill} />,
}

// i18n key map
const I18N_KEY: Record<string, string> = {
  finance: 'cv_industries_finance',
  medical: 'cv_industries_medical',
  ecommerce: 'cv_industries_ecommerce',
  construction: 'cv_industries_construction',
  oil_gas: 'cv_industries_oilgas',
  elearning: 'cv_industries_elearning',
  academia: 'cv_industries_academia',
  process_mining: 'cv_industries_process_mining',
  consulting: 'cv_industries_consulting',
}

export default function IndustriesCard() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const s = theme === 'light' ? SUN : MOON

  return (
    <BentoCard
      colSpan={2}
      rowSpan={2}
      tabletRowSpan={1}
      variant='default'
      label={t('cv_industries_title')}
    >
      <div className='flex h-full flex-col gap-4'>
        <div>
          <p className={`text-5xl leading-none font-black ${s.number}`}>
            {INDUSTRIES.length}
          </p>
          <Label as='h3' muted className={s.label}>
            {t('cv_industries_title')}
          </Label>
        </div>
        <div className='flex flex-col gap-2'>
          {INDUSTRIES.map(({ key }) => (
            <Chip
              key={key}
              label={t(I18N_KEY[key] ?? key)}
              icon={ICON_MAP[key]?.(s.icon)}
              size='sm'
            />
          ))}
        </div>
      </div>
    </BentoCard>
  )
}
