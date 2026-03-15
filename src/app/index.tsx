import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { I18nextProvider } from 'react-i18next'
import i18n from 'shared/i18n'
import { ThemeProvider } from 'shared/ui'
import HomePage from 'pages/home'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <HomePage />
      </I18nextProvider>
    </ThemeProvider>
  </StrictMode>
)
