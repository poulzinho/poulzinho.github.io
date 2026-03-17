import { useTranslation } from 'react-i18next'
import { BentoCard, Label } from 'shared/ui'
import { useTheme } from 'shared/ui/theme/theme-context'
import { FRAMEWORK_ICONS, SkillGrid } from './skill-icon'

const SUN = { label: 'text-gray-500' }
const MOON = { label: 'text-white/60' }

export default function FrameworksCard() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const s = theme === 'light' ? SUN : MOON

  const groupLabel: Record<string, string> = {
    Frontend: t('cv_frameworks_frontend'),
    Backend: t('cv_frameworks_backend'),
    Enterprise: 'Enterprise',
  }

  return (
    <BentoCard
      colSpan={2}
      rowSpan={1}
      variant='default'
      label={t('cv_frameworks_title')}
      noPadding
    >
      {/* Hidden heading for SEO / a11y */}
      <h3 className='sr-only'>{t('cv_frameworks_title')}</h3>

      <div className='flex h-full flex-col'>
        {FRAMEWORK_ICONS.map(group => (
          <div key={group.group} className='flex min-h-0 flex-1 flex-col'>
            {/* Group label — slim bar above each icon row */}
            <div className='px-3 pt-px pb-0 leading-none'>
              <Label as='span' muted className={`text-[9px] ${s.label}`}>
                {groupLabel[group.group] ?? group.group}
              </Label>
            </div>
            <SkillGrid
              icons={group.items}
              cols={group.items.length}
              iconSize='h-10 w-10'
              tilePadding='p-2'
            />
          </div>
        ))}
      </div>
    </BentoCard>
  )
}
