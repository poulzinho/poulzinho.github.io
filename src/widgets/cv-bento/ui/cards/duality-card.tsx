import { useTranslation } from 'react-i18next'
import { useTheme } from 'shared/ui/theme/theme-context'
import { BentoCard, Label } from 'shared/ui'

const SUN = { text: 'text-gray-900', caption: 'text-gray-700' }
const MOON = { text: 'text-white',   caption: 'text-white/70' }

function CodeIcon() {
  return (
    <span className='text-3xl font-bold font-mono leading-none' aria-hidden='true'>
      {'</>'}
    </span>
  )
}

function PencilIcon() {
  return <span className='text-3xl' aria-hidden='true'>✏️</span>
}

export default function DualityCard() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const s = theme === 'light' ? SUN : MOON

  return (
    <BentoCard colSpan={2} rowSpan={1} variant='accent' label={t('cv_duality_caption')}>
      <div className='flex h-full flex-col justify-between gap-4'>
        <div className='flex items-center gap-0'>
          <div className='flex flex-1 flex-col items-center gap-2 py-2'>
            <CodeIcon />
            <Label as='span' className={s.text}>{t('cv_duality_label_engineering')}</Label>
          </div>
          <div className='h-12 w-px bg-current opacity-15' aria-hidden='true' />
          <div className='flex flex-1 flex-col items-center gap-2 py-2'>
            <PencilIcon />
            <Label as='span' className={s.text}>{t('cv_duality_label_design')}</Label>
          </div>
        </div>
        <p className={`text-center text-sm italic ${s.caption}`}>
          "{t('cv_duality_caption')}"
        </p>
      </div>
    </BentoCard>
  )
}
