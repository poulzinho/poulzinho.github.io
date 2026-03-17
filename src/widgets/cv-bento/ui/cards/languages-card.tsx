import { useTranslation } from 'react-i18next'
import { BentoCard } from 'shared/ui'
import { LANGUAGE_ICONS, SkillGrid } from './skill-icon'

// Row 1: JS, TS, SQL, HTML5 (indices 0–3) — current / primary
// Row 2: Python, Rust, Java, C# (indices 4–7) — secondary / past
const ROW_1 = LANGUAGE_ICONS.slice(0, 4)
const ROW_2 = LANGUAGE_ICONS.slice(4)

export default function LanguagesCard() {
  const { t } = useTranslation()

  return (
    <BentoCard
      colSpan={2}
      rowSpan={1}
      variant='default'
      label={t('cv_languages_title')}
      noPadding
    >
      {/* Hidden heading for SEO / a11y */}
      <h3 className='sr-only'>{t('cv_languages_title')}</h3>

      <div className='flex h-full flex-col'>
        {/* Row 1 — 4 tiles spanning full width */}
        <div className='flex min-h-0 flex-1'>
          <SkillGrid icons={ROW_1} cols={4} />
        </div>

        {/* Row 2 — 4 tiles, same column count */}
        <div className='flex min-h-0 flex-1'>
          <SkillGrid icons={ROW_2} cols={4} />
        </div>
      </div>
    </BentoCard>
  )
}
