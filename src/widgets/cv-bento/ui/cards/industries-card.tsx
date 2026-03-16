import { useTranslation } from 'react-i18next'
import {
  siStripe,
  siFitbit,
  siShopify,
  siAutodesk,
  siShell,
  siUdemy,
  siGooglescholar,
} from 'simple-icons'
import { useTheme } from 'shared/ui/theme/theme-context'
import { BentoCard, Chip, Label } from 'shared/ui'

const SUN  = { number: 'text-gray-900', label: 'text-gray-500', icon: 'rgba(18,28,46,0.55)' }
const MOON = { number: 'text-white',    label: 'text-white/50', icon: 'rgba(210,220,235,0.55)' }

function SiIcon({ path, fill }: { path: string; fill: string }) {
  return (
    <svg width='14' height='14' viewBox='0 0 24 24' aria-hidden='true' fill={fill}>
      <path d={path} />
    </svg>
  )
}

export default function IndustriesCard() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const s = theme === 'light' ? SUN : MOON

  const INDUSTRIES = [
    { key: 'cv_industries_finance',      si: siStripe       },
    { key: 'cv_industries_medical',      si: siFitbit       },
    { key: 'cv_industries_ecommerce',    si: siShopify      },
    { key: 'cv_industries_construction', si: siAutodesk     },
    { key: 'cv_industries_oilgas',       si: siShell        },
    { key: 'cv_industries_elearning',    si: siUdemy        },
    { key: 'cv_industries_academia',     si: siGooglescholar },
  ] as const

  return (
    <BentoCard colSpan={2} rowSpan={2} tabletRowSpan={1} variant='default' label={t('cv_industries_title')}>
      <div className='flex h-full flex-col gap-4'>
        <div>
          <p className={`text-5xl font-black leading-none ${s.number}`}>7</p>
          <Label as='h3' muted className={s.label}>{t('cv_industries_title')}</Label>
        </div>
        <div className='flex flex-col gap-2'>
          {INDUSTRIES.map(({ key, si }) => (
            <Chip
              key={key}
              label={t(key)}
              icon={<SiIcon path={si.path} fill={s.icon} />}
              size='sm'
            />
          ))}
        </div>
      </div>
    </BentoCard>
  )
}
