import duckImg from 'shared/assets/images/duck.png'
import { useTheme } from 'shared/ui/theme/theme-context'
import { BentoCard } from 'shared/ui'

const SUN  = { label: 'text-gray-500' }
const MOON = { label: 'text-white/40' }

export default function DuckCard() {
  const { theme } = useTheme()
  const s = theme === 'light' ? SUN : MOON

  return (
    <BentoCard colSpan={1} rowSpan={1} variant='default' label='Rubber duck debugger' className='!p-0 overflow-hidden'>
      <div className='relative h-full w-full'>
        <p className={`absolute top-5 w-full text-center text-[10px] font-medium tracking-widest uppercase ${s.label}`}>
          Debug Buddy
        </p>
        <img
          src={duckImg}
          alt='Rubber duck — debug buddy'
          className='absolute bottom-0 left-1/2 -translate-x-1/2 object-contain drop-shadow-lg h-[85%] lg:h-auto lg:w-[85%]'
          draggable={false}
        />
      </div>
    </BentoCard>
  )
}
