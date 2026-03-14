import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslation from './locales/en.json'

export const resources = {
  en: { translation: enTranslation },
}

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  debug: false,
})

export default i18n
