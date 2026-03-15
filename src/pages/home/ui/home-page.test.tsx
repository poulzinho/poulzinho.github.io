import { render } from '@testing-library/react'
import { ThemeProvider } from 'shared/ui'
import HomePage from './home-page'

describe('HomePage', () => {
  it('should render the website without crashes', () => {
    render(
      <ThemeProvider>
        <HomePage />
      </ThemeProvider>
    )
  })
})
