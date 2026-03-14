export const useTranslation = () => ({
  t: (str: string) => str,
  i18n: {
    changeLanguage: () => new Promise(() => {}),
  },
})

export const initReactI18next = {
  type: '3rdParty' as const,
  init: (i18next: unknown) => i18next,
}
