import { useTranslation } from 'react-i18next'
import { useTheme } from 'shared/ui/theme/theme-context'
import { BentoCard } from 'shared/ui'

const DISPLAY = "'DM Serif Display', serif"

const SUN  = {
  mark:        'text-gray-900/30',
  quote:       'text-gray-900',
  dash:        'bg-gray-900/20',
  attribution: 'text-gray-500',
}
const MOON = {
  mark:        'text-white/25',
  quote:       'text-white',
  dash:        'bg-white/20',
  attribution: 'text-white/50',
}

export default function SuperpowerCard() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const s = theme === 'light' ? SUN : MOON

  return (
    <BentoCard colSpan={4} rowSpan={1} variant='accent' label={t('cv_superpower_quote')}>
      <div className='flex h-full flex-col justify-center gap-1'>

        {/* Opening mark — in flow so it never overlaps the quote */}
        <span
          className={`leading-none ${s.mark}`}
          style={{ fontFamily: DISPLAY, fontSize: '2.25rem', fontStyle: 'italic' }}
          aria-hidden='true'
        >
          &#8220;
        </span>

        {/* Quote body */}
        <blockquote
          className={`leading-snug ${s.quote}`}
          style={{ fontFamily: DISPLAY, fontSize: '1.25rem', fontStyle: 'italic' }}
        >
          {t('cv_superpower_quote')}
        </blockquote>

        {/* Attribution */}
        <footer className='mt-2 flex items-center justify-end gap-2'>
          <span className={`h-px w-5 shrink-0 ${s.dash}`} aria-hidden='true' />
          <cite className={`not-italic text-[11px] font-medium tracking-[0.12em] uppercase ${s.attribution}`}>
            {t('cv_superpower_attribution')}
          </cite>
        </footer>

      </div>
    </BentoCard>
  )
}
