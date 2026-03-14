import profilePic from 'shared/assets/images/profile-pic.jpg'
import { useTranslation } from 'react-i18next'

const LINKED_IN_URL = 'https://www.linkedin.com/in/paul-gualotuna'

export default function ProfileCard() {
  const { t } = useTranslation()
  return (
    <div className='max-w-[460px] rounded-lg bg-white shadow-md overflow-hidden'>
      {/* Card header */}
      <div className='flex items-center gap-3 p-4'>
        <div
          className='flex h-10 w-10 items-center justify-center rounded-full bg-[dodgerblue] text-sm font-medium text-white'
          aria-label='recipe'
        >
          {t('paul_initials')}
        </div>
        <div className='flex-1'>
          <p className='text-sm font-medium text-gray-900'>{t('paul_name')}</p>
          <p className='text-xs text-gray-500'>{t('paul_position')}</p>
        </div>
        <button aria-label='settings' className='text-gray-400' />
      </div>

      {/* Card media */}
      <img
        className='w-full h-[300px] object-cover'
        src={profilePic}
        alt={t('paul_profile_picture_alt_text')}
        title={t('paul_profile_picture_alt_text')}
      />

      {/* Card content */}
      <div className='px-4 pt-1 pb-2'>
        <p className='text-xs text-gray-500'>{t('paul_profile_picture_caption')}</p>
        <h2 className='mt-1.5 mb-1.5 text-2xl font-normal text-gray-900'>{t('greetings')}</h2>
        <p className='mb-3 text-base text-gray-500'>{t('paul_profile_intro')}</p>
        <p className='text-sm text-gray-500'>{t('paul_profile_description')}</p>
      </div>

      {/* Card actions */}
      <div className='flex items-center px-2 pb-2'>
        <button
          className='flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium text-blue-600 uppercase tracking-wide hover:bg-blue-50 transition-colors'
          onClick={() => window.open(LINKED_IN_URL, '_blank')}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            className='h-5 w-5 fill-current'
            aria-hidden='true'
          >
            <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
          </svg>
          {t('linkedin_button_text')}
        </button>
      </div>
    </div>
  )
}
