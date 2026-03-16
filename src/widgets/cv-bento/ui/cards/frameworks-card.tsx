import { useTranslation } from 'react-i18next'
import { BentoCard, Chip, Divider, Label } from 'shared/ui'

const FRONTEND = [
  { label: 'React',   accentColor: '#61dafb' },
  { label: 'Angular', accentColor: '#dd0031' },
  { label: 'Stencil', accentColor: '#4e54c8' },
]

const BACKEND = [
  { label: 'JEE',  accentColor: '#e76f00' },
  { label: '.NET', accentColor: '#512bd4' },
]

export default function FrameworksCard() {
  const { t } = useTranslation()

  return (
    <BentoCard colSpan={2} rowSpan={1} variant='accent' label={t('cv_frameworks_title')}>
      <div className='flex h-full flex-col gap-3'>
        <Label as='h3' muted>{t('cv_frameworks_title')}</Label>
        <div className='flex flex-col gap-2'>
          <Label as='span' muted>{t('cv_frameworks_frontend')}</Label>
          <div className='flex flex-wrap gap-1.5'>
            {FRONTEND.map(({ label, accentColor }) => (
              <Chip key={label} label={label} accentColor={accentColor} size='sm' />
            ))}
          </div>
        </div>
        <Divider />
        <div className='flex flex-col gap-2'>
          <Label as='span' muted>{t('cv_frameworks_backend')}</Label>
          <div className='flex flex-wrap gap-1.5'>
            {BACKEND.map(({ label, accentColor }) => (
              <Chip key={label} label={label} accentColor={accentColor} size='sm' />
            ))}
          </div>
        </div>
      </div>
    </BentoCard>
  )
}
