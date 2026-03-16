import { useTranslation } from 'react-i18next'
import { BentoCard, Chip, Label } from 'shared/ui'

const LANGUAGES = [
  { label: 'JavaScript ES6', accentColor: '#f0db4f' },
  { label: 'TypeScript',     accentColor: '#3178c6' },
  { label: 'Java',           accentColor: '#f89820' },
  { label: 'C#',             accentColor: '#9b4993' },
]

export default function LanguagesCard() {
  const { t } = useTranslation()

  return (
    <BentoCard colSpan={2} rowSpan={1} variant='default' label={t('cv_languages_title')}>
      <div className='flex h-full flex-col gap-3'>
        <Label as='h3' muted>{t('cv_languages_title')}</Label>
        <div className='grid grid-cols-2 gap-2'>
          {LANGUAGES.map(({ label, accentColor }) => (
            <Chip
              key={label}
              label={label}
              accentColor={accentColor}
              className='transition-transform hover:scale-[1.03]'
            />
          ))}
        </div>
      </div>
    </BentoCard>
  )
}
