/* eslint-disable */
/**
 * Mocking react-i18next module
 * https://react.i18next.com/misc/testing
 * @ignore
 */
// @ts-ignore
module.exports = {
  useTranslation: () => {
    return {
      t: (str: any) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
  initReactI18next: {
    type: '3rdParty',
    init: (i18next: any) => i18next,
  },
}
/* eslint-enable */
